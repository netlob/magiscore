function coursesRequest(bearerToken, school, leerling_id) {
    return new Promise(async function (resolve, reject) {
        var settings = {
            "dataType": "json",
            "async": true,
            "crossDomain": true,
            "url": `https://${school}.magister.net/api/leerlingen/${leerling_id}/aanmeldingen?begin=2009-01-01&einde=2020-01-01`,
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
                alert("wat")
                alert(JSON.stringify(response.items))
                var courses = []
                response.items.forEach(course => {
                    courses.push(course)
                });
                alert(courses)
                resolve(courses)
            })
    })
}

function leerlingIdRequest(bearerToken, school, callback) {

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
                resolve(response.Persoon.Id)
            })
    })
}



function gradeRequest(bearerToken, school, leerling_id, course) {
    return new Promise(async function (resolve, reject) {

        alert(course.id)
        var settings = {
            "dataType": "json",
            "async": true,
            "crossDomain": true,
            "url": `https://${school}.magister.net/api/personen/${leerling_id}/aanmeldingen/${course.id}/cijfers/cijferoverzichtvooraanmelding?actievePerioden=false&alleenBerekendeKolommen=false&alleenPTAKolommen=false&peildatum=${course.begin}`,
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

function syncGradesT() {
    var tokens = JSON.parse(localStorage.getItem("tokens"))
    var access_token = tokens.access_token;
    var school = "kajmunk"
    leerlingIdRequest(access_token, school)
        .then(leerling_id => {
            alert(1);
            coursesRequest(access_token, school, leerling_id)
                .then(courses => {
                    alert(2)
                    courses.forEach(course => {
                        gradeRequest(access_token, school, leerling_id, course)
                            .then(response => {
                                var grades = response.Items;
                                alert(JSON.stringify(grades))
                            })
                    });

                })

        })

}