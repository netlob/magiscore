const p = require("phin");

module.exports = async function refresh(token, cookies, verify) {
    return p({
        method: "post",
        data: `code=${token}&redirect_uri=m6loapp://oauth2redirect/&client_id=M6LOAPP&grant_type=authorization_code&code_verifier=${verify}`,
        url: "https://accounts.magister.net/connect/token",
        headers: {
            Cookie: cookies,
            "X-API-Client-ID": "EF15",
            "Content-Type": "application/x-www-form-urlencoded",
            Host: "accounts.magister.net"
        }
    });
}