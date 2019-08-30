//import p from "phin";
const  p = require("phin");
const { Cookie } = require("tough-cookie");
const { extractQueryParameter } = require("./util");
const { Issuer, generators } = require("openid-client");

const codeVerifier = generators.codeVerifier();

//const tenant = "baudartius";
//const username = "";
//const password = "";
//const authCode = "6865909dd312";

const issuerUrl = "https://accounts.magister.net";

function validate(res) {
  const code = res.statusCode;

  if (code === 200) {
    return;
  } else {
    throw new Error(res.body.error || code);
  }
}

async function login(tenant, username, password, authCode) {
  const issuer = await Issuer.discover(issuerUrl);
  console.log("Got issuer", issuer.issuer);

  const state = generators.state();
  const nonce = generators.nonce();

  const client = new issuer.Client({
    redirect_uris: ["m6loapp://oauth2redirect/"],
    response_types: ["code id_token"],
    id_token_signed_response_alg: "RS256"
  });

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

  await p({
    url: `${issuerUrl}${returnUrl}`,
    headers: {
      cookie: cookies
    }
  }).then(res => {
    const refresh_token = res.headers.location.split("code=")[1].split("&")[0];
    const access_token = res.headers.location.split("id_token=")[1].split("&")[0];
    console.log(refresh_token);
    console.log(access_token);
  });
}

module.exports.getMagisterBearer = login;
