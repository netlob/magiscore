const p = require("phin");
const refresh = require("./refresh");
const Cookie = require("tough-cookie");
const URL = require('url')
const getAuthCode = require('@magisterjs/dynamic-authcode');
const fetch = require('node-fetch')
const {
    Issuer,
    generators
} = require("openid-client");
const login = require('./login.function')
const {
    default: magister,
    getSchools
} = require('magister.js');


module.exports = async function (params, res) {
    if (params.refresh && params.person_id && params.school) {
        refreshToken(params.refresh)
            .then(tokens => {
                // var response = {}
                // response["tokens"] = tokens
                // magister({
                //     school: {
                //         url: `https://${params.school}.magister.net`
                //     },
                //     token: tokens.access_token,
                // }).then(m => {
                //     response["person"] = m.profileInfo
                //     response["school"] = m.school
                //     m.courses()
                //         .then(courses => {
                //             let requests = courses.map((course) => {
                //                 return new Promise((resolve) => {
                //                     Promise.all([course.grades(), course.classes()])
                //                         .then(values => {
                //                             course.grades = values[0]
                //                             course.classes = values[1]
                //                             resolve(course)
                //                         }).catch(err => {
                //                             res.end(err.toString())
                //                         });
                //                 });
                //             })
                //             Promise.all(requests)
                //                 .then(values => {
                //                     response["courses"] = values;
                //                     res.writeHead(200, {
                //                         'Content-Type': 'application/json'
                //                     })
                //                     res.end(JSON.stringify(response))
                //                 }).catch((err) => {
                //                     console.error('something went wrong:', err);
                //                     res.writeHead(200);
                //                     res.end('error: ' + err.toString());
                //                 });
                //             // Promise.all(current.grades(), current.classes())
                //             //     .then(values => {
                //             //         response["grades"] = values[0]
                //             //         response["classes"] = values[1]
                //             //         res.writeHead(200, {
                //             //             'Content-Type': 'application/json'
                //             //         })
                //             //         res.end(JSON.stringify(response))
                //             //     }).catch((err) => {
                //             //         console.error('something went wrong:', err);
                //             //         res.writeHead(200);
                //             //         res.end('error: ' + err.toString());
                //             //     });
                //         })
                // }).catch(err => {
                //     res.writeHead(200);
                //     res.end('error: ' + err.toString());
                // });
                var response = {}
                response["tokens"] = tokens
                getCourses(tokens.access_token, params.school)
                    .then(courses => {
                        let requests = courses.Items.map((course) => {
                            return new Promise((resolve) => {
                                const now = new Date()
                                course.Huidig = course.Start <= now && now <= course.Einde
                                Promise.all([getGrades(course, params.person_id, params.school, tokens.access_token), getClasses(course, params.person_id, params.school, tokens.access_token)])
                                    .then(values => {
                                        course.Cijfers = values[0]
                                        course.Vakken = values[1]
                                        if (values[0].TotalCount > 0) {
                                            const grades = values[0].Items.map(grade => {
                                                return Promise.resolve(fillGrade(course, params.school, params.school, grade))
                                            })
                                            Promise.all(grades).then(gardes => {
                                                course.Cijfers.Items = gardes
                                                resolve()
                                            })
                                        } else resolve()
                                    }).catch(err => {
                                        // res.writeHead(200)
                                        res.end(err.toString())
                                    });
                            });
                        })
                        Promise.all(requests)
                            .then(() => {
                                response["courses"] = courses
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                })
                                res.end(JSON.stringify(response))
                            }).catch(err => {
                                // res.writeHead(200)
                                res.end(err.toString())
                            });
                    }).catch(err => {
                        res.writeHead(200)
                        res.end(err.toString())
                    })

            }).catch(err => {
                res.writeHead(200)
                res.end(err.toString())
            })

    } else {
        getAuthCode()
            .then(mAuth => {
                params.code = mAuth
                login(params, res)
                    .then(tokens => {
                        var response = {}
                        response["tokens"] = tokens
                        fetch("https://kajmunk.magister.net/api/account?noCache=0", {
                                "credentials": "include",
                                "headers": {
                                    "accept": "application/json, text/plain, */*",
                                    "accept-language": "en-US,en;q=0.9,nl-NL;q=0.8,nl;q=0.7",
                                    "authorization": "Bearer " + tokens.access_token,
                                    "cache-control": "no-cache",
                                    "pragma": "no-cache",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "same-origin"
                                },
                                "referrer": "https://kajmunk.magister.net/magister/",
                                "referrerPolicy": "no-referrer-when-downgrade",
                                "body": null,
                                "method": "GET",
                                "mode": "cors"
                            })
                            .then(res => res.json())
                            .then(json => {
                                response["person"] = json
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                })
                                res.end(JSON.stringify(json))
                            })
                    }).catch(err => {
                        console.error(err)
                    })
            })
    }
}

function refreshToken(token) {
    return new Promise(async function (resolve, reject) {
        fetch(`https://accounts.magister.net/connect/token`, {
                "credentials": "include",
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "sec-fetch-mode": "cors",
                    "X-API-Client-ID": "EF15",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Host": "accounts.magister.net"
                },
                "body": `refresh_token=${token}&client_id=M6LOAPP&grant_type=refresh_token`,
                "method": "POST",
                "mode": "cors"
            })
            .then(res => res.json())
            .then(json => {
                resolve(json)
            })
    })
}

function getCourses(access_token, school) {
    return new Promise(async function (resolve, reject) {
        fetch(`https://${school}.magister.net/api/personen/14935/aanmeldingen?geenToekomstige=false`, {
                "credentials": "include",
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "authorization": "Bearer " + access_token,
                    "sec-fetch-mode": "cors"
                },
                "body": null,
                "method": "GET",
                "mode": "cors"
            })
            .then(res => res.json())
            .then(json => {
                resolve(json)
            })
    })
}

function getGrades(course, person_id, school, access_token) {
    return new Promise(async function (resolve, reject) {
        var date = course.Huidig ? formatDate(new Date()) : formatDate(new Date(course.Einde))
        fetch(`https://${school}.magister.net/api/personen/${person_id}/aanmeldingen/${course.Id}/cijfers/cijferoverzichtvooraanmelding?actievePerioden=false&alleenBerekendeKolommen=false&alleenPTAKolommen=false&peildatum=${date}`, {
                "credentials": "include",
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9,nl-NL;q=0.8,nl;q=0.7",
                    "authorization": "Bearer " + access_token,
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                "body": null,
                "method": "GET",
                "mode": "cors"
            })
            .then(res => res.json())
            .then(json => {
                // console.log(json)
                resolve(json)
            })
    })
}

function getClasses(course, person_id, school, access_token) {
    return new Promise(async function (resolve, reject) {
        fetch(`https://${school}.magister.net/api/personen/${person_id}/aanmeldingen/${course.Id}/vakken`, {
                "credentials": "include",
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9,nl-NL;q=0.8,nl;q=0.7",
                    "authorization": "Bearer " + access_token,
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                "body": null,
                "method": "GET",
                "mode": "cors"
            })
            .then(res => res.json())
            .then(json => {
                resolve(json)
            })
    })
}

function fillGrade(course, person_id, school, grade, access_token) {
    return new Promise(async function (resolve, reject) {
        fetch(`https://${school}.magister.net/api/personen/${person_id}/aanmeldingen/${course.Id}/cijfers/extracijferkolominfo/${grade.CijferKolom.Id}`, {
                "credentials": "include",
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9,nl-NL;q=0.8,nl;q=0.7",
                    "authorization": "Bearer " + access_token,
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": null,
                "method": "GET",
                "mode": "cors"
            })
            .then(res => res.json())
            .then(json => {
                grade.fill = json
                grade.testDate = json.WerkinformatieDatumIngevoerd != null ? new Date(json.WerkinformatieDatumIngevoerd).toISOString() : false
                grade.description = json.WerkInformatieOmschrijving != null ? json.WerkInformatieOmschrijving.trim() : false
                grade.weight = json.Weging != null ? Number.parseInt(json.Weging, 10) || 0 : false
                grade.type = {}
                grade.type.level = json.KolomNiveau
                grade.type.description = json.KolomOmschrijving != null ? json.KolomOmschrijving.trim() : false
                resolve(grade)
            }).catch(err => console.error(err))
    })
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}