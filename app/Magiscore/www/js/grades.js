function coursesRequest(bearerToken, school, callback) {
    var settings = {
        "dataType": "json",
        "async": true,
        "crossDomain": true,
        "url": `https://${school}.magister.net/api/personen/${leerling_id}/aanmeldingen/${jaar_id}/vakken`,
        "method": "GET",
        "headers": {
            "Authorization": "Bearer " + bearerToken
        }
    }
    $.ajax(settings).done(callback)
}

function leerlingIdRequest(bearerToken, school, callback) {
    var settings = {
        "dataType": "json",
        "async": true,
        "crossDomain": true,
        "url": `https://${school}.magister.net/api/account?noCache=0`,
        "method": "GET",
        "headers": {
            "Authorization": "Bearer " + bearerToken
        }
    }
    $.ajax(settings).done(callback(response.Persoon.Id))
}

function gradeRequest(bearerToken, school, callback, leerling_id) {
    var settings = {
        "dataType": "json",
        "async": true,
        "crossDomain": true,
        "url": `https://${school}.magister.net/api/personen/${leerling_id}/aanmeldingen/26301/cijfers/cijferperiodenvooraanmelding`,
        "method": "GET",
        "headers": {
            "Authorization": "Bearer " + bearerToken
        }
    }
    $.ajax(settings).done(callback(response.Persoon.Id))
}

function getGrades() {

}