var verifier = "";
var tenant = "";
var popup = null;

function refreshToken(background = false) {
  logFirebaseEvent("refeshTokens");
  return new Promise((resolve, reject) => {
    var tokens = JSON.parse(getObject("tokens", getActiveAccount()));
    var refresh_token = tokens.refresh_token;

    cordova.plugin.http.setRequestTimeout(5.0);
    cordova.plugin.http.post(
      "https://accounts.magister.net/connect/token",
      {
        refresh_token: refresh_token,
        client_id: "M6LOAPP",
        grant_type: "refresh_token",
      },
      { "cache-control": "no-cache" },
      function (res) {
        //success
        try {
          response = JSON.parse(res.data);
        } catch (e) {
          console.error("JSON parsing error");
        }
        logConsole(
          "[DEBUG] " + typeof response == "object"
            ? JSON.stringify(response)
            : response
        );
        var tokens = {
          access_token: response.access_token,
          refresh_token: response.refresh_token,
          id_token: response.id_token,
        };
        setObject("tokens", JSON.stringify(tokens), getActiveAccount());
        if (typeof m != "undefined" && m != null) m.token = tokens.access_token;
        resolve(tokens);
      },
      function (response) {
        //Error
        console.log(response);
        if (
          response.status == 400 ||
          (response.status == "400" && !background)
        ) {
          try {
            navigator.notification.confirm(
              "Er is iets fout gegaan waardoor je geen toegang hebt tot dit account. Probeer opnieuw aan te melden door op de knop ‘Aanmelden’ te klikken of log uit door op de knop ‘Uitloggen’ te klikken.",
              openBrowser,
              "Probleem bij het inloggen",
              ["Aanmelden", "Uitloggen"]
            );
            // }
          } catch (err) {
            logConsole("[ERROR] " + err);
          }
        } else {
          logConsole(`[ERROR] ${response.status}: ${response.error}`);
          reject("no internet");
        }
      }
    );
  });
}

function openBrowser(b) {
  if (b == 2) {
    confirmLogout(1);
  }
  logFirebaseEvent("refeshTokensOpenBrowser");
  // viewController.overlay("show")
  school = /(.+:\/\/)?([^\/]+)(\/.*)*/i.exec(school)[2];
  // tenant = school
  verifier = base64URL(generateCodeVerifier());
  logConsole(`[INFO]   Regenerating token`);

  var nonce = generateRandomBase64(32);
  var state = generateRandomState(16);

  var challenge = base64URL(generateCodeChallenge(verifier));
  var url = `https://accounts.magister.net/connect/authorize?client_id=M6LOAPP&redirect_uri=m6loapp%3A%2F%2Foauth2redirect%2F&scope=openid%20profile%20offline_access%20magister.mobile%20magister.ecs&response_type=code%20id_token&state=${state}&nonce=${nonce}&code_challenge=${challenge}&code_challenge_method=S256&acr_values=tenant:${school}`;
  account == null
    ? (url += `&prompt=select_account`)
    : (url += `&prompt=login&login_hint=${account.name}`);
  popup = window.cordova.InAppBrowser.open(
    url,
    "_blank",
    "location=yes,hideurlbar=yes,hidenavigationbuttons=yes,toolbarcolor=#202124,closebuttoncolor=#eeeeee,zoom=no"
  );
  popup.insertCSS({
    code: "#username_options > a { display: none !important }",
  });
  // popup.addEventListener("loaderror", customScheme);
  popup.addEventListener("loadstart", customScheme);
  popup.addEventListener("exit", exitPopup);
}

function exitPopup(iab) {
  viewController.overlay("hide");
  onDeviceReady();
}

function customScheme(iab) {
  if (
    iab.url.startsWith("m6loapp://oauth2redirect/") ||
    iab.url.startsWith("http://m6loapp://oauth2redirect/") ||
    iab.url.startsWith("https://m6loapp://oauth2redirect/")
  ) {
    var code = iab.url.split("code=")[1].split("&")[0];
    popup.hide();
    var settings = {
      error: function (jqXHR, textStatus, errorThrown) {
        toast(
          "Er kon geen verbinden met Magister gemaakt worden... Probeer het over een tijdje weer",
          false
        );
        reject("no internet");
        return;
        // alert(textStatus);
      },
      dataType: "json",
      async: true,
      crossDomain: true,
      url: "https://cors-gemairo.sjoerd.dev/https://accounts.magister.net/connect/token",
      method: "POST",
      headers: {
        "X-API-Client-ID": "EF15",
        "Content-Type": "application/x-www-form-urlencoded",
        // Host: "accounts.magister.net"
      },
      data: `code=${code}&redirect_uri=m6loapp%3A%2F%2Foauth2redirect%2F&client_id=M6LOAPP&grant_type=authorization_code&code_verifier=${verifier}`,
    };

    $.ajax(settings).done(async (response) => {
      // var poep = window.cordova.InAppBrowser.open(response.access_token, '_system', '');
      var m = new Magister(school, response.access_token);
      m.getInfo().then(async (newperson) => {
        person = JSON.parse(getObject("person", getActiveAccount()));
        if (newperson.id == person.id) {
          var tokens = {
            access_token: response.access_token,
            refresh_token: response.refresh_token,
            id_token: response.id_token,
          };
          setObject("tokens", JSON.stringify(tokens), getActiveAccount());
          // setObject("tokens", JSON.stringify(tokens))
          logConsole(JSON.stringify(tokens));
          viewController.overlay("hide");
          onDeviceReady();
        } else {
          navigator.notification.confirm(
            'Het lijkt erop dat je met een ander account bent ingelogd zojuist. Wil je je opgeslagen cijfers behouden en weer verder gaan log dan in met het account waarmee je tijdens de setup hebt ingelogd. \n\nKlopt dit niet? Dan er is er een flink probleem met de communicatie met Magister wat betekend dat je opnieuw het login process zal moeten volgen. Druk dan op "Uitloggen"',
            openBrowser,
            "Verkeerd account",
            ["Opnieuw proberen", "Uitloggen"]
          );
        }
      });
    });
  }
  //  else {
  //   viewController.toast(
  //     "Er is een onbekende error opgetreden... Probeer het in een ogenblik opnieuw",
  //     5000,
  //     true
  //   );
  // }
}

function generateRandomString(length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function generateCodeVerifier() {
  var code_verifier = generateRandomString(128);
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
  return (code_challenge = base64URL(CryptoJS.SHA256(code_verifier)));
}

function base64URL(string) {
  return string
    .toString(CryptoJS.enc.Base64)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}
