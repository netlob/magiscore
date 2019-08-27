const p = require("phin");
const {
    Cookie
} = require("tough-cookie");
const {
    Issuer,
    generators
} = require("openid-client");

module.exports = async function (params) {
    return new Promise(async function (resolve, reject) {
        const codeVerifier = generators.codeVerifier();

        const tenant = params.school;
        const username = params.username;
        const password = params.password;
        const authCode = params.code;

        const issuerUrl = "https://accounts.magister.net";

        let client;

        const issuer = await Issuer.discover(issuerUrl);

        client = new issuer.Client({
            authority: "https://accounts.magister.net",
            client_id: "iam-profile",
            redirect_uris: ["m6loapp://oauth2redirect/"],
            response_types: ["code id_token"],
            id_token_signed_response_alg: "RS256"
        });

        const state = generators.state();
        const nonce = generators.nonce();

        const codeChallenge = generators.codeChallenge(codeVerifier);
        const authUrl = client.authorizationUrl({
            scope: issuer.scopes_supported.join(" "),
            code_challenge: codeChallenge,
            code_challenge_method: "S256",
            acr_values: `tenant:${tenant}.magister.net`,
            client_id: "M6LOAPP",
            state: state,
            nonce: nonce,
            prompt: "select_account"
        });

        const auth = await p(authUrl).then(res => p(res.headers.location));
        const location = auth.headers.location;
        const sessionId = extractQueryParameter(
            `${issuerUrl}${location}`,
            "sessionId"
        );
        const returnUrl = extractQueryParameter(
            `${issuerUrl}${location}`,
            "returnUrl"
        );

        const xsrf = Cookie.parse(auth.headers["set-cookie"][1]).value;

        await p({
            url: `${issuerUrl}/challenge/username`,
            method: "post",
            parse: "json",
            data: {
                authCode,
                sessionId,
                returnUrl,
                username
            },
            headers: {
                cookie: auth.headers["set-cookie"],
                "X-XSRF-TOKEN": xsrf
            }
        }).then(res => {
            return validate(res);
        });

        const cookies = await p({
            url: `${issuerUrl}/challenge/password`,
            method: "post",
            parse: "json",
            data: {
                authCode,
                sessionId,
                returnUrl,
                password
            },
            headers: {
                cookie: auth.headers["set-cookie"],
                "X-XSRF-TOKEN": xsrf
            }
        }).then(res => {
            validate(res);
            return res.headers["set-cookie"];
        });

        return await p({
            url: `${issuerUrl}${returnUrl}`,
            headers: {
                cookie: cookies
            }
        }).then(res => {
            const url = res.headers.location;
            const refresh_token = url.split("#code=")[1].split("&")[0];

            refresh(refresh_token, cookies, codeVerifier).then(tokens => {
                var parsed = JSON.parse(tokens.body)
                parsed["cookies"] = cookies
                parsed["code_verifier"] = codeVerifier
                resolve(parsed)
                // console.log(tokens.body.toString());
            });
        });
    })
}

function extractQueryParameter(url, parameter) {
    const parsedUrl = new URL(url)

    return parsedUrl.searchParams.get(parameter)
}


function validate(res) {
    const code = res.statusCode;

    if (code === 200) {
        return;
    } else {
        throw new Error(res.body.error || code);
    }
}

async function refresh(token, cookies, verify) {
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