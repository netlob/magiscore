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
            }
        }

        $.ajax(settings).done(function (response) {
            var tokens = {
                access_token: response.access_token,
                refresh_token: response.refresh_token,
                id_token: response.id_token
            }
            localStorage.setItem("tokens", JSON.stringify(tokens))
            resolve()
        });
    })

}