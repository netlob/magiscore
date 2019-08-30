//import { createBrotliDecompress } from "zlib";

var scholen = {};
var schools = {};
var verifier = "";

function getLoginInfo() {
    return {
        username: $('#login-username').val(),
        password: $('#login-password').val(),
        school: schools[$('#login-school').val()]
    }
}

function onDeviceReady() {
    //alert("poep");

}

function generateRandomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function generateCodeVerifier() {
    var code_verifier = generateRandomString(128)
    return code_verifier;
}

function generateRandomBase64(length) {
    var text = "";
    var possible = "abcdef0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function generateRandomState(length) {
    var text = "";
    var possible = "abcdefhijklmnopqrstuvwxyz";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function generateCodeChallenge(code_verifier) {
    return code_challenge = base64URL(CryptoJS.SHA256(code_verifier))
}

function base64URL(string) {
    return string.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function openLoginWindow() {
    verifier = base64URL(generateCodeVerifier());
    //$("#login-school").val(verifier);

    var nonce = generateRandomBase64(32);
    var state = generateRandomState(16);

    var challenge = base64URL(generateCodeChallenge(verifier));
    //file:///android_asset/www/
    //alert("je moeder is een kehba");
    var url = `https://accounts.magister.net/connect/authorize?client_id=M6LOAPP&redirect_uri=m6loapp%3A%2F%2Foauth2redirect%2F&scope=openid%20profile%20offline_access%20magister.mobile%20magister.ecs&response_type=code%20id_token&state=${state}&nonce=${nonce}&code_challenge=${challenge}&code_challenge_method=S256&acr_values=tenant:kajmunk.magister.net&prompt=select_account`
    var ref = cordova.InAppBrowser.open(url, '_system', 'location=yes,hideurlbar=yes');
}
document.addEventListener("deviceready", onDeviceReady, false);

function valideLogin(code, codeVerifier) {
    var settings = {
        "error": function (jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        },
        "dataType": "json",
        "async": true,
        "crossDomain": true,
        "url": "https://accounts.magister.net/connect/token",
        "method": "POST",
        "headers": {
            "X-API-Client-ID": "EF15",
            "Content-Type": "application/x-www-form-urlencoded",
            "Host": "accounts.magister.net"
        },
        "data": `code=${code}&redirect_uri=m6loapp%3A%2F%2Foauth2redirect%2F&client_id=M6LOAPP&grant_type=authorization_code&code_verifier=${codeVerifier}`,
    }

    $.ajax(settings).done(function (response) {
        //alert(response.responseText);
        //$("#kebha").empty()
        //$("#kebha2").empty()
        $("#kebha").text(JSON.stringify(response))
        //document.write(response.access_token);
        var tokens = {
            access_token: response.access_token,
            refresh_token: response.refresh_token,
            id_token: response.id_token
        }
        alert(JSON.stringify(tokens));
        localStorage.setItem("tokens", JSON.stringify(tokens))
        //document.write(JSON.stringify(JSON.parse(response)))

    });
}

function handleOpenURL(url) {
    var code = url.split("code=")[1].split("&")[0];
    valideLogin(code, verifier);
}
//https://accounts.magister.net/account/login?sessionId=1934dbf3472a440592931cee427e6344&returnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3DM6LOAPP%26redirect_uri%3Dm6loapp%253A%252F%252Foauth2redirect%252F%26scope%3Dopenid%2520profile%2520offline_access%2520magister.mobile%2520magister.ecs%26response_type%3Dcode%2520id_token%26state%3Dqodmwkubaafcntmz%26nonce%3D643f293da9ea55c13d99a485d3e2ba82%26code_challenge%3DTP52UMRqrzurvKwdB0O_WPE4bP_f6AqKy3RZmHGJq7U%26code_challenge_method%3DS256%26acr_values%3Dtenant%253Akajmunk.magister.net#!/rswp