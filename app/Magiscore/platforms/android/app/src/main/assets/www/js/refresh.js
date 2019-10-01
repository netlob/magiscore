function refreshToken() {
    return new Promise((resolve, reject) => {
        var tokens = JSON.parse(localStorage.getItem("tokens"))
        var refresh_token = tokens.refresh_token;

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://accounts.magister.net/connect/token",
            "method": "POST",
            "headers": {
                "cache-control": "no-cache"
            },
            "data": {
                "refresh_token": refresh_token,
                "client_id": "M6LOAPP",
                "grant_type": "refresh_token"
            },
            "error": function (XMLHttpRequest, textStatus, errorThrown) {
                alert("error: " + XMLHttpRequest.statusText)
                if (XMLHttpRequest.readyState == 4) {
                    logConsole("HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)")
                    alert("first: " + XMLHttpRequest.statusText)
                } else if (XMLHttpRequest.readyState == 0) {
                    logConsole("Network error (i.e. connection refused, access denied due to CORS, etc.)")
                    alert("second: " + XMLHttpRequest.statusText)
                    reject("no internet")
                } else {
                    logConsole("something weird is happening")
                    alert("third: " + XMLHttpRequest.statusText)
                }
            },
            "timeout": 5000

            // "error": function (request, status, error) {
            //     errorConsole(request)
            //     logConsole("---------")
            //     errorConsole(status)
            //     logConsole("---------")
            //     errorConsole(error)
            //     reject(error)
            // }
        }

        $.ajax(settings).done(function (response) {
            logConsole(typeof response == "object" ? JSON.stringify(response) : response)
            var tokens = {
                access_token: response.access_token,
                refresh_token: response.refresh_token,
                id_token: response.id_token
            }
            localStorage.setItem("tokens", JSON.stringify(tokens))
            resolve(tokens)
        });
    })

}