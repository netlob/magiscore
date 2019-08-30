function coursesRequest(bearerToken, school, leerling) {
    return new Promise(async function (resolve, reject) {
        var settings = {
            "dataType": "json",
            "async": true,
            "crossDomain": true,
            "url": `https://${school}.magister.net/api/leerlingen/${leerling.Id}/aanmeldingen?begin=2009-01-01&einde=2020-01-01`,
            "method": "GET",
            "headers": {
                "Authorization": "Bearer " + bearerToken
            },
            "error": function (request, status, error) {
                alert(request.status)
                alert(error)
                alert(status)
            }
        }
        $.ajax(settings)
            .done(function (response) {
                resolve(response.items)
            })
    })
}

function leerlingIdRequest(bearerToken, school, callback) {
    alert("leerlingidreq")
    return new Promise(async function (resolve, reject) {
        var settings = {
            "dataType": "json",
            "async": true,
            "crossDomain": true,
            "url": `https://${school}.magister.net/api/account?noCache=0`,
            "method": "GET",
            "headers": {
                "Authorization": "Bearer " + bearerToken
            },
            "error": function (request, status, error) {
                alert(request.status)
                alert(error)
                alert(status)
            }
        }

        $.ajax(settings)
            .done(function (response) {
                localStorage.setItem("person", JSON.stringify(response.Persoon));
                resolve(response.Persoon)
            })
    })
}



function gradeRequest(bearerToken, school, leerling, course) {
    return new Promise(async function (resolve, reject) {

        alert(course.id)
        var settings = {
            "dataType": "json",
            "async": true,
            "crossDomain": true,
            "url": `https://${school}.magister.net/api/personen/${leerling.Id}/aanmeldingen/${course.id}/cijfers/cijferoverzichtvooraanmelding?actievePerioden=false&alleenBerekendeKolommen=false&alleenPTAKolommen=false&peildatum=${course.begin}`,
            "method": "GET",
            "headers": {
                "Authorization": "Bearer " + bearerToken
            }
        }
        $.ajax(settings)
            .done(function (response) {
                resolve(response)
            })
    })
}

function singleGradeRequest(bearerToken, school, leerling, grade, course) {
    return new Promise(async function (resolve, reject) {


        var settings = {
            "dataType": "json",
            "async": true,
            "crossDomain": true,
            "url": `https://kajmunk.magister.net/api/personen/${leerling.Id}/aanmeldingen/${course.id}/cijfers/extracijferkolominfo/${grade.CijferKolom.Id}`,
            "method": "GET",
            "headers": {
                "Authorization": "Bearer " + bearerToken
            }
        }
        $.ajax(settings)
            .done(function (json) {

                grade = {
                    "id": toString(grade.CijferId),
                    "grade": grade.CijferStr,
                    "passed": grade.IsVoldoende,
                    "dateFilledIn": new Date(grade.DatumIngevoerd).toISOString(),
                    "class": grade.Vak,
                    "atLaterDate": grade.Inhalen,
                    "exemption": grade.Vrijstelling,
                    "counts": grade.TeltMee,
                    "type": grade.CijferKolom
                }
                grade.testDate = new Date(json.WerkinformatieDatumIngevoerd).toISOString()
                grade.description = json.WerkInformatieOmschrijving.trim()
                grade.weight = Number.parseInt(json.Weging, 10) || 0
                grade.type.level = json.KolomNiveau
                grade.type.description = json.KolomOmschrijving.trim()
                resolve(grade)
            })
    })
}

function getGrades() {
    alert("getgrades")
    var tokens = JSON.parse(localStorage.getItem("tokens"))
    var access_token = tokens.access_token;
    var school = "kajmunk"
    alert(access_token)
    leerlingIdRequest(access_token, school)
        .then(leerling => {
            alert(1);
            coursesRequest(access_token, school, leerling)
                .then(courses => {
                    alert(2)
                    courses.forEach(course => {
                        gradeRequest(access_token, school, leerling, course)
                            .then(response => {
                                var grades = response.Items;

                                var promises = grades.map(grade => {
                                    return Promise.resolve(singleGradeRequest(access_token, school, leerling, grade, course))
                                })
                                grades = Promise.all(promises)
                                    .then(() => {
                                        localStorage.setItem("person", JSON.stringify(leerling));
                                        localStorage.setItem("school", JSON.stringify(school));
                                        localStorage.setItem("courses", JSON.stringify(courses));
                                        localStorage.setItem("grades", JSON.stringify(grades));
                                        alert(JSON.stringify(grades[0]))
                                        window.location = '../index.html'
                                    })

                            })

                    })
                });

        })

}