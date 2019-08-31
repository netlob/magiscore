// function coursesRequest(bearerToken, school, leerling) {
//     return new Promise(async function (resolve, reject) {
//         var settings = {
//             "dataType": "json",
//             "async": true,
//             "crossDomain": true,
//             "url": `https://${school}.magister.net/api/leerlingen/${leerling.Id}/aanmeldingen?begin=2009-01-01&einde=2020-01-01`,
//             "method": "GET",
//             "headers": {
//                 "Authorization": "Bearer " + bearerToken
//             },
//             "error": function (request, status, error) {
//                 logConsole(request.status)
//                 logConsole(error)
//                 logConsole(status)
//             }
//         }
//         $.ajax(settings)
//             .done(function (response) {
//                 resolve(response.items)
//             })
//     })
// }

// function leerlingIdRequest(bearerToken, school, callback) {
//     logConsole("leerlingidreq")
//     return new Promise(async function (resolve, reject) {
//         var settings = {
//             "dataType": "json",
//             "async": true,
//             "crossDomain": true,
//             "url": `https://${school}.magister.net/api/account?noCache=0`,
//             "method": "GET",
//             "headers": {
//                 "Authorization": "Bearer " + bearerToken
//             },
//             "error": function (request, status, error) {
//                 logConsole(request.status)
//                 logConsole(error)
//                 logConsole(status)
//             }
//         }

//         $.ajax(settings)
//             .done(function (response) {
//                 localStorage.setItem("person", JSON.stringify(response.Persoon));
//                 resolve(response.Persoon)
//             })
//     })
// }



// function gradeRequest(bearerToken, school, leerling, course) {
//     return new Promise(async function (resolve, reject) {

//         logConsole(course.id)
//         var settings = {
//             "dataType": "json",
//             "async": true,
//             "crossDomain": true,
//             "url": `https://${school}.magister.net/api/personen/${leerling.Id}/aanmeldingen/${course.id}/cijfers/cijferoverzichtvooraanmelding?actievePerioden=false&alleenBerekendeKolommen=false&alleenPTAKolommen=false&peildatum=${course.begin}`,
//             "method": "GET",
//             "headers": {
//                 "Authorization": "Bearer " + bearerToken
//             },
//             "error": function (request, status, error) {
//                 logConsole(request.status)
//                 logConsole(error)
//                 logConsole(status)
//             }
//         }
//         $.ajax(settings)
//             .done(function (response) {
//                 resolve(response)
//             })
//     })
// }

// function singleGradeRequest(bearerToken, school, leerling, grade, course) {
//     return new Promise(async function (resolve, reject) {


//         var settings = {
//             "dataType": "json",
//             "async": true,
//             "crossDomain": true,
//             "url": `https://${school}.magister.net/api/personen/${leerling.Id}/aanmeldingen/${course.id}/cijfers/extracijferkolominfo/${grade.CijferKolom.Id}`,
//             "method": "GET",
//             "headers": {
//                 "Authorization": "Bearer " + bearerToken
//             },
//             // "error": function (request, status, error) {
//             //     logConsole(request.status)
//             //     logConsole(error)
//             //     logConsole(status)
//             // }
//         }
//         $.ajax(settings)
//             .done(function (json) {

//                 grade = {
//                     "id": toString(grade.CijferId),
//                     "grade": grade.CijferStr,
//                     "passed": grade.IsVoldoende,
//                     "dateFilledIn": new Date(grade.DatumIngevoerd).toISOString(),
//                     "class": grade.Vak,
//                     "atLaterDate": grade.Inhalen,
//                     "exemption": grade.Vrijstelling,
//                     "counts": grade.TeltMee,
//                     "type": grade.CijferKolom
//                 }
//                 grade.testDate = json.WerkinformatieDatumIngevoerd != null ? new Date(json.WerkinformatieDatumIngevoerd).toISOString() : false
//                 grade.description = json.WerkInformatieOmschrijving != null ? json.WerkInformatieOmschrijving.trim() : false
//                 grade.weight = json.Weging != null ? Number.parseInt(json.Weging, 10) || 0 : false
//                 grade.type.level = json.KolomNiveau
//                 grade.type.description = json.KolomOmschrijving != null ? json.KolomOmschrijving.trim() : false
//                 //logConsole(JSON.stringify(grade))
//                 resolve(grade)
//             })
//     })
// }

// function getGrades() {
//     return new Promise(async function (resolve, reject) {
//         logConsole("getgrades")
//         var tokens = JSON.parse(localStorage.getItem("tokens"))
//         var access_token = tokens.access_token;
//         var school = "kajmunk"
//         logConsole(access_token)
//         leerlingIdRequest(access_token, school)
//             .then(leerling => {
//                 coursesRequest(access_token, school, leerling)
//                     .then(courses => {
//                         logConsole(courses)
//                         var course_promises = courses.map(course => {
//                             logConsole(course)
//                             return Promise.resolve(
//                                 gradeRequest(access_token, school, leerling, course)
//                                 .then(response => {
//                                     var grades = response.Items;
//                                     //logConsole("length: " + grades.length)
//                                     //logConsole("grades1" + JSON.stringify(grades))
//                                     var promises = grades.map(grade => {
//                                         return singleGradeRequest(access_token, school, leerling, grade, course)
//                                     })
//                                     Promise.all(promises)
//                                         .then(grades => {
//                                             // localStorage.setItem("person", JSON.stringify(leerling));
//                                             // localStorage.setItem("school", JSON.stringify(school));
//                                             // localStorage.setItem("courses", JSON.stringify(courses));

//                                             logConsole("grades2: " + JSON.stringify(grades))
//                                             //window.location = '../index.html'
//                                             return grades

//                                         })
//                                         .catch(e => {
//                                             logConsole(e)
//                                         })

//                                 }).catch(e => {
//                                     logConsole(e)
//                                 })
//                             )
//                         })
//                         Promise.all(course_promises).then(all_grades => {
//                             var merged_all_grades = [].concat.apply([], all_grades)
//                             localStorage.setItem("grades", JSON.stringify(merged_all_grades));
//                             resolve(merged_all_grades)
//                         }).catch(e => {
//                             logConsole(e)
//                         })
//                     });

//             })
//     })

// }

function logConsole(err) {
    $("#Terminal").append(err + "</br>")
}

function getGrades() {
    var tokens = JSON.parse(localStorage.getItem("tokens"))
    var m = new Magister("kajmunk", tokens.access_token)
    m.info()
        .then(info => {
            m.courses()
                .then(courses => {
                    var current = courses.find(c => c.current)
                    current.classes()
                        .then(classes => {
                            logConsole(classes)
                        })
                })
        })
}