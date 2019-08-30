//import { createBrotliDecompress } from "zlib";

var scholen={};
var schools={};
function getLoginInfo() {
    return {
        username: $('#login-username').val(),
        password: $('#login-password').val(),
        school: schools[$('#login-school').val()]
    }
}
function onDeviceReady(){
    alert("poep");
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
    var verifier = base64URL(generateCodeVerifier());
    var nonce = generateRandomBase64(32);
    var state = generateRandomState(16);
    
    var challenge = base64URL(generateCodeChallenge(verifier));
    //file:///android_asset/www/
    alert("je moeder is een kehba");
    var url = `https://accounts.magister.net/connect/authorize?client_id=M6LOAPP&redirect_uri=m6loapp%3A%2F%2Foauth2redirect%2F&scope=openid%20profile%20offline_access%20magister.mobile%20magister.ecs&response_type=code%20id_token&state=${state}&nonce=${nonce}&code_challenge=${challenge}&code_challenge_method=S256&acr_values=tenant:kajmunk.magister.net&prompt=select_account`
    var ref = cordova.InAppBrowser.open(url, '_blank', 'location=yes,hideurlbar=yes');
}
document.addEventListener("deviceready", onDeviceReady, false);
