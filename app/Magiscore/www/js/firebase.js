let classMappings = null;

async function loadMappings() {
  try {
    const data = await fetch(
      "https://cors.gemairo.app/https://sjoerd.dev/html/gemairo/class-mappings.json"
    ).then((res) => res.json());

    if (typeof data == "object" && "mappings" in data) {
      classMappings = data.mappings;
    }
  } catch (e) {}
}

function logFirebaseScreen(screenName) {
  try {
    if (typeof screenName != "string") return;
    screenName = screenName.toLowerCase();

    if (classMappings != null) {
      for (const [key, regexQueries] of Object.entries(mappings)) {
        // Loop through each regex query in the array for this key
        for (const regexQuery of regexQueries) {
          // Test if the regex query matches the courseName
          if (new RegExp(regexQuery).test(screenName)) {
            // If it does, rename the courseName to the key
            screenName = key;
            break;
          }
        }
      }
    }

    cordova.plugins.firebase.analytics.setCurrentScreen(screenName);
    console.log("setCurrentScreen", screenName);
  } catch (e) {
    logConsole("FIREBASE: " + e.toString());
  }
}

function logFirebaseEvent(eventName, params) {
  try {
    cordova.plugins.firebase.analytics.logEvent(eventName, params);
    console.log("logEvent", eventName, params);
  } catch (e) {
    logConsole("FIREBASE: " + e.toString());
  }
}

async function setFirebaseUser() {
  try {
    const userId = `${school.replace(".magister.net", "")}:${person.id}`;
    cordova.plugins.firebase.analytics.setUserId(userId);
    console.log("setUserId", userId);
  } catch (e) {
    logConsole("FIREBASE: " + e.toString());
  }

  let gradeCount = -1;
  try {
    gradeCount = courses.reduce((a, c) => a + c.grades.length, 0);
  } catch (e) {
    gradeCount = -1;
  }

  let courseCount = -1;
  try {
    courseCount = courseController.courses.length;
  } catch (e) {
    courseCount = -1;
  }

  let classCount = -1;
  try {
    classCount = courses.reduce((a, c) => a + c.classes.length, 0);
  } catch (e) {
    classCount = -1;
  }

  let group = "unknown";
  try {
    group = courses.sort(
      (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
    )[0].group.description;
  } catch (e) {}

  let adsConsent = "unknown";
  try {
    adsConsent = await ads.checkConsent();
  } catch (e) {}

  const config = JSON.parse(getObject("config", getActiveAccount()));
  const userProperties = {
    isParent: person.isParent ?? false,
    school: school,
    darkTheme: config.darkTheme,
    devMode: config.devMode,
    smiley: config.smiley,
    passed: config.passed,
    gradeCount: gradeCount,
    courseCount: courseCount,
    classCount: classCount,
    adsConsent: adsConsent,
    group: group,
  };
  logConsole(JSON.stringify(userProperties, null, 2));
  for (let key in userProperties) {
    try {
      cordova.plugins.firebase.analytics.setUserProperty(
        key,
        userProperties[key]
      );
      console.log("setUserProperty", key, userProperties[key]);
    } catch (e) {
      logConsole("FIREBASE: " + e.toString());
    }
  }
}
