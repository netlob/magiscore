const p = require("phin");
const refresh = require("./refresh");
const Cookie = require("tough-cookie");
const URL = require('url')
const fetch = require('node-fetch')
const {
    Issuer,
    generators
} = require("openid-client");
const login = require('./login.function')

module.exports = async function (params, res) {
    login(params, res)
        .then(token => {
            var response = {}
            response["tokens"] = token
            fetch(`https://${params.school}.magister.net/api/personen/14935/aanmeldingen?geenToekomstige=false`, {
                    "credentials": "include",
                    "headers": {
                        "accept": "application/json, text/plain, */*",
                        "authorization": "Bearer " + token.access_token,
                        "sec-fetch-mode": "cors"
                    },
                    "referrer": "https://kajmunk.magister.net/magister/",
                    "referrerPolicy": "no-referrer-when-downgrade",
                    "body": null,
                    "method": "GET",
                    "mode": "cors"
                })
                .then(res => res.json())
                .then(json => {
                    response["courses"] = json
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    res.end(JSON.stringify(response))
                })
        }).catch(err => {
            console.error(err)
        })
    // magister({
    //     token:
    // }).then(m => {
    //     var response = {}
    //     response["person"] = m.profileInfo
    //     response["token"] = m.token
    //     response["school"] = m.school

    //     m.courses()
    //         .then(courses => {
    //             var current = courses.find(c => c.current)
    //             if (current == undefined) current = courses[courses.length - 1]
    //             response["courses"] = courses;
    //             response["courses"]["current"] = current;
    //             // courses.find(c => c.current).grades()
    //             Promise.all(current.grades(), current.classes())
    //                 .then(values => {
    //                     response["classes"] = values[1]
    //                     response["grades"] = values[0]
    //                     res.writeHead(200)
    //                     res.end(JSON.stringify(response))
    //                 }).catch((err) => {
    //                     // console.error('something went wrong:', err);
    //                     // res.writeHead(200);
    //                     // res.end('error: ' + err.toString());
    //                 });
    //         })
    // }).catch(err => {
    //     res.writeHead(200);
    //     res.end('error: ' + err.toString());
    // });
}