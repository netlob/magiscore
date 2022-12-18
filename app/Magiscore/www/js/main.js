// If you want comments. Go fuck yourself

if (localStorage.getItem('courses')) { MoveToNewStorage(); }

var viewController = new ViewController($("#content-wrapper"));
var lessonController = new LessonController(viewController);
var courseController = new CourseController(viewController);
var filtereddisabled = [];
var idletime;

var sorted = {},
  person = JSON.parse(getObject("person", getActiveAccount())),
  account = JSON.parse(getObject("account", getActiveAccount())),
  tokens = JSON.parse(getObject("tokens", getActiveAccount())),
  courses = JSON.parse(getObject("courses", getActiveAccount())),
  latest = JSON.parse(getObject("latest", getActiveAccount())),
  school = getObject("school", getActiveAccount()),
  m = null;

courseController.clear();
// courses = courses.splice(0,5)
// setObject("courses", JSON.stringify(courses));
courses.forEach((c) => {
  var newCourse = Course.create();
  Object.keys(c).forEach((key) => {
    newCourse[key] = c[key];
  });
  c = newCourse;
  // if(c.id == "31089" || c.id == 31089) c.grades = []
  courseController.add(c);
});
viewController.currentCourse = courseController.current();

var snapper;

//logConsole("Courses" + JSON.stringify(courses))
// courses[1].grades.splice(0, 100)

// setObject("courses", JSON.stringify(courses))
// logConsole("removed grades")

//courses.splice(courses.indexOf(courseController.current()))

function reloaddata() {
  sorted = {},
  person = JSON.parse(getObject("person", getActiveAccount())),
  account = JSON.parse(getObject("account", getActiveAccount())),
  tokens = JSON.parse(getObject("tokens", getActiveAccount())),
  courses = JSON.parse(getObject("courses", getActiveAccount())),
  latest = JSON.parse(getObject("latest", getActiveAccount())),
  school = getObject("school", getActiveAccount()),
  m = null;

courseController.clear();
courses.forEach((c) => {
  var newCourse = Course.create();
  Object.keys(c).forEach((key) => {
    newCourse[key] = c[key];
  });
  c = newCourse;
  courseController.add(c);
});
viewController.currentCourse = courseController.current();
onDeviceReady();
}

function main(l) {
  // alert(person.account.name)
  // if ($(window).width() <= 465) {
  snapper = new Snap({
    element: document.querySelector("#content-wrapper"),
    dragger: null,
    disable: "right",
    addBodyClasses: true,
    hyperextensible: false,
    resistance: 0,
    flickThreshold: 0,
    transitionSpeed: 0.2,
    easing: "ease",
    maxPosition: 238,
    minPosition: 0,
    tapToClose: true,
    touchToDrag: true,
    slideIntent: 40,
    minDragDistance: 5,
    // effect: 'pull'
  });
  // }
  viewController.setConfig();
  viewController.initTheme();
  //sorted = {}
  lessonController.clear();
  lessonController.allGrades = [];
  lessonController.lessons = [];
  filtereddisabled = [];
  document.getElementById('gradefilterbutton').children[0].children[0].classList.remove("activefilter");
  var sorted = viewController.currentCourse.course.sortGrades();
  // viewController.currentCourse.course.grades.forEach(grade => {
  //   var vak = grade.class.description.capitalize()
  //   if (sorted[vak] == null) {
  //     sorted[vak] = []
  //   }
  //   if (sorted[vak][grade.type.header] == null) {
  //     sorted[vak][grade.type.header] = []
  //   }
  //   if (sorted[vak]['Grades'] == null) {
  //     sorted[vak]['Grades'] = []
  //   }
  //   if (sorted[vak]['Completed'] == null) {
  //     sorted[vak]['Completed'] = []
  //   }
  //   sorted[vak][grade.type.header].push(grade)
  //   if (grade.type._type == 1 && round(grade.grade) > 0 && round(grade.grade) < 11) {
  //     grade.exclude = viewController.config.exclude.includes(grade.id);
  //     lessonController.allGrades.push(grade)
  //     sorted[vak]['Grades'].push(grade)
  //   }
  //   if (grade.type._type == 12 || grade.type._type == 4 && round(grade.grade) > -1 && round(grade.grade) < 101) {
  //     sorted[vak]['Completed'].push(grade)
  //   }
  // })
  for (var vak in sorted) {
    var lesson = sorted[vak]["Lesson"];

    if (lesson.grades.length > 0) {
      lessonController.add(vak, lesson);
      //logConsole(vak + ": " + lesson.averageLastYearFact())
      lesson.compareYearBeforeAverageFact();
      //logConsole("compared")
    }
    // var data = sorted[lesson]
    // var grades = data["Grades"]
    // if (grades.length > 0) lessonController.add(lesson, grades, data, lessonController, viewController.currentCourse.course)
  }

  viewController.updateNav();
  viewController.render(l ? l : "general");
  // if ($(window).width() < 767 && !document.querySelector('#accordionSidebar').classList.contains('toggled')) {
  //   document.querySelector('#sidebarToggleTop').click()
  // }
  // $('#betaModal').modal({show:true})
  // } else {
  //window.location = './login.html'
  // alert(window.location)

  // }
}

function logOut() {
  navigator.notification.confirm(
    'Klik op "Uitloggen" als je zeker weet dat je wilt uitloggen.',
    confirmLogout,
    "Weet je het zeker?",
    ["Ja", "Nee"]
  );
}

async function confirmLogout(b) {
  if (b == 1) {
    if (localStorage.length > 1) {
      var active = getActiveAccount(); 
      clearObject(active);
      var allfiles = await listFiles()
      var file = (await allfiles.filter((file) => file.name == `${active}.json`))[0];
      var newaccountfile = (await allfiles.filter((file) => file.name == `${Object.keys(localStorage)[0]}.json`))[0];
      localStorage.setItem(Object.keys(localStorage)[0], await readFile(newaccountfile));
      changeActiveAccount(Object.keys(localStorage)[0]);
      reloaddata();
      courseController.getLatestGrades(false, getActiveChildAccount());
      viewController.overlay("hide");
      viewController.closeSettings()
      await RemoveFile(file);
      //window.location = "./index.html";
    } else {
      clearObject(getActiveAccount());
      window.location = "./login.html";
    }
  } else return;
}

function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  var dataURL = canvas.toDataURL("image/png");

  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function round(num) {
  if (typeof num == "string") {
    num = num.replace(",", ".");
  }
  return parseFloat(Math.round(num * 100) / 100).toFixed(2);
}

async function syncGrades() {
  return new Promise(async (resolve, reject) => {
    $("div:contains('Nieuwe cijfer(s) beschikbaar')").remove();
    if (m == null || m == undefined) {
      if (navigator.connection.type !== Connection.NONE) {
        refreshToken()
          .then((refreshTokens) => {
            tokens = refreshTokens;
            setObject("tokens", JSON.stringify(tokens), getActiveAccount());
            m = new Magister(school, tokens.access_token);
            m.getInfo()
              .then((p) => {
                person = p;
                setObject("person", JSON.stringify(p), getActiveAccount());
                courseController.getLatestGrades(false, getActiveChildAccount());
              })
              .catch((err) => {
                if (err == "no internet")
                  viewController.toast(
                    "Er kon geen verbinding met Magister gemaakt worden...",
                    4000,
                    true
                  );
                errorConsole(err);
                viewController.overlay("hide");
                reject();
                return;
              });
          })
          .catch((err) => {
            if (err == "no internet") {
              viewController.toast(
                "Er kon geen verbinding met Magister gemaakt worden...",
                4000,
                true
              );
              viewController.overlay("hide");
              reject();
              return;
            }
          });
      } else {
        viewController.toast(
          "Er kon geen verbinding met Magister gemaakt worden...",
          4000,
          true
        );
        viewController.overlay("hide");
        reject();
        return;
      }
    }
    viewController.overlay("show");
    logConsole("[INFO]   Sync started!");
    // m.getCourses().then(async (syncCourses) => {
    //   logConsole("[INFO]   Received courses")
    // syncCourses.forEach(course => {
    //   if (!_.includes(courseController.courseIds, course.id)) {
    //     courseController.add(course)
    //     logConsole("addedCourse")
    //   }
    // })
    var currentCourse = viewController.currentCourse;
    var newGrades = [];
    // courses.forEach(currentCourse => {
    var newCourse = Course.create();
    // alert(Object.keys(currentCourse.course))
    Object.keys(currentCourse.course).forEach((key) => {
      newCourse[key] = currentCourse.course[key];
    });
    currentCourse = newCourse;
    currentCourse._magister = m;
    if (
      currentCourse._magister == null ||
      currentCourse._magister == undefined
    ) {
      viewController.toast(
        "Er kon geen verbinding met Magister gemaakt worden...",
        4000,
        true
      );
      viewController.overlay("hide");
      reject();
      return;
    }
    currentCourse
      .getGrades()
      .then(async (currentGrades) => {
        // alert(currentGrades)
        // alert(JSON.stringify(currentGrades))
        // if(currentCourse.id == "31089" || currentCourse.id == 31089) currentCourse.grades = []
        var allGradeIds = currentCourse.grades.map((x) => {
          return x.id;
        });
        currentGrades.forEach((grade) => {
          // logConsole("yeet" + JSON.stringify(grade.type))
          if (
            viewController.config.refreshOldGrades ||
            (currentCourse.grades.find((a) => a.id == grade.id) &&
              currentCourse.grades.find((a) => a.id == grade.id).grade !=
                grade.grade)
          ) {
            var i = _.findIndex(currentCourse.grades, {
              id: grade.id,
            });
            newGrades.push(grade);
            currentCourse.grades.splice(i, 1);
          } else if (!allGradeIds.includes(grade.id)) {
            // logConsole("Not in id list")
            newGrades.push(grade);
            currentCourse.grades.push(grade);
          }
        });
        logConsole("[INFO]   Grades to fill: " + newGrades.length);
        if (newGrades.length == 0) {
          viewController.toast("Geen nieuwe cijfers gevonden...", 3000, false);
          viewController.overlay("hide");
          resolve(await checkNewCourses(newGrades));
        } else {
          // if(newGrades.length > 0) {
          currentCourse.grades = _.unionBy(currentCourse.grades, "id");
          var snack = viewController.toast(
            `<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
        style="width: 20%; height: 20px;" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" id="sync-progress"></div><br><span class="text-center"><span id="sync-synced">0/${
          newGrades.length
        }</span> van je ${
              viewController.config.refreshOldGrades ? "" : " nieuwe"
            } cijfers gesynced<br><!-- <i
        class="far fa-info-circle fa-s display-inline-block mr-3 ml-2 mb-2 mt-3"> Refresh oude cijfers is ingeschakeld, alle cijfers worden gerefreshed --></span>`,
            false,
            true
          );
          $(`#snackbar-${snack}`).css("z-index", "100000");
          var percent = 80 / (Number(newGrades.length) - 1);
          for (let grade of newGrades) {
            try {
              grade = await grade.fill();
              var i = _.findIndex(currentCourse.grades, {
                id: grade.id,
              });
              if (viewController.config.refreshOldGrades) {
                viewController.currentCourse.course.grades.push(grade);
              } else {
                currentCourse.grades[i] = grade
              }
              i = _.findIndex(newGrades, {
                id: grade.id,
              });
              $(`#sync-synced`).text(`${i}/${Number(newGrades.length) - 1}`);
              var val = Number(percent * i) + 20;
              $(".progress-bar")
                .css("width", val + "%")
                .attr("aria-valuenow", val);
              if (i == Number(newGrades.length) - 1) {
                $(`#snackbar-${snack}`).animate(
                  {
                    bottom: "-200px",
                  },
                  "fast",
                  function () {
                    $(`#snackbar-${snack}`).remove();
                  }
                );
                // var result = [...new Set(newGrades.map(x => x.class.description))]
                const result = [];
                const map = new Map();
                for (const item of newGrades) {
                  if (!map.has(item.class.description)) {
                    map.set(item.class.description, true);
                    result.push(item.class.description);
                  }
                }

                var extra = result.map((x) => {
                  return `
                  <br>
                  <span class="grade-small"><b>${
                    newGrades.filter(
                      (y) => x == y.class.description && y.type._type == 1
                    ).length
                  }</b> cijfers voor ${x.trim()}</span>
                `;
                });
                viewController.toast(
                  `
                <b class="mb-0">${newGrades.length} nieuwe cijfers gesycned!</b>
                ${extra}
              `,
                  7000,
                  false,
                  true
                );
                // courseController.remove(currentCourse)
                // courseController.add(currentCourse)
                var coursesStorage = JSON.parse(
                  getObject("courses", getActiveAccount())
                );
                var i = _.findIndex(coursesStorage, {
                  id: currentCourse.id,
                });
                currentCourse._magister = undefined;
                courseController.allGrades = [];
                courseController.courses.forEach((course) => {
                  course.course.grades.forEach((grade) => {
                    courseController.allGrades.push(grade);
                  });
                });
                _.sortBy(courseController.allGrades, "dateFilledIn");
                coursesStorage[i] = viewController.currentCourse.course;
                coursesStorage.forEach(jaar => jaar.grades.forEach(grade => { 
                  ['_fillUrl', '_magister'].forEach(rem => delete grade[rem]);
                  ['id', 'number'].forEach(rem => delete grade.class[rem]);
                  ['name', 'number', 'isAtLaterDate', 'isTeacher', 'level'].forEach(rem => delete grade.type[rem]);
                }))
                
                setObject("courses", JSON.stringify(coursesStorage), getActiveAccount());
                logConsole("[INFO]   Saved new grades in courses");
                // courseController.save()
                main(viewController.currentLesson);
                viewController.overlay("hide");
                resolve(checkNewCourses(newGrades));
              }
            } catch (err) {
              if (err == "no internet") {
                viewController.toast(
                  "Er kon geen verbinding met Magister gemaakt worden...",
                  4000,
                  true
                );
                viewController.overlay("hide");
                reject();
                return;
              }
              errorConsole(err);
              errorConsole("[ERROR] Error while syncing grades");
            }
          }
        }
      })
      .catch((err) => {
        if (err == "no internet") {
          viewController.toast(
            "Er kon geen verbinding met Magister gemaakt worden...",
            4000,
            true
          );
          viewController.overlay("hide");
          reject();
          return;
        }
        errorConsole(err);
        errorConsole("[ERROR] Error while syncing grades");
      });
    // logConsole("[INFO]   Requested grades");
    // });
    // }).catch(err => {
    //   if (err == "no internet") viewController.toast("Er kon geen verbinding met Magister gemaakt worden...", 4000, true)
    //   errorConsole(err)
    //   viewController.overlay("hide")
    // })
    // })
  });
}

async function checkNewCourses(newGrades) {
  let courses = await m.getCourses();
  courses = courses.filter(
    (course) => !courseController.courseIds.includes(course.id)
  );
  if (courses.length == 1) {
    let course = courses[0];
    let storageCourses = JSON.parse(getObject("courses", getActiveAccount()));
    course._magister = undefined;
    storageCourses.push(course);
    setObject("courses", JSON.stringify(storageCourses), getActiveAccount());

    var newCourse = Course.create();
    Object.keys(course).forEach((key) => {
      newCourse[key] = course[key];
    });
    courseController.add(newCourse);

    newGrades = await syncGrades();
    window.location = "./index.html";
  } else if (courses.length > 1) {
    alert(
      "Het lijkt erop alsof je meerdere schooljaren aan cijfers mist in de app. Om dit op te lossen moet je opnieuw inloggen."
    );
    confirmLogout(1);
  } else {
    return newGrades;
  }
}

function fillTimeout() {}

const ptr = PullToRefresh.init({
  mainElement: "#ptr",
  shouldPullToRefresh: function () {
    return (
      $(window).scrollTop() == 0 &&
      $(".sidebar").css("z-index") < 0 &&
      $("#overlay").css("display") == "none" &&
      viewController.settingsOpen == false
    );
  },
  onRefresh: function (done) {
    vibrate(15, true);
    syncGrades()
      .then((d) => done())
      .catch((e) => done());
    // done()
  },
});

$(function () {
  FastClick.attach(document.body);
});

String.prototype.capitalize = function (poep) {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

Array.prototype.remove = function () {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

$(".container-fluid").click(function () {
  if (!$("body").hasClass("sidenav-open") && $(window).width() < 767) {
    $("#sidebarToggleTop").click();
  }
});

function vibrate(time, strong) {
  if (window.TapticEngine) {
    if (strong) TapticEngine.unofficial.strongBoom();
    else TapticEngine.unofficial.weakBoom();
  } else {
    navigator.vibrate(time || 15);
  }
}

// function gaSuccess(poep) {
//   window.ga.debugMode();
//   window.ga.setAllowIDFACollection(true);
//   window.ga.trackView('Screen Title', '', true)
//   window.ga.trackEvent('Magister', 'Refreshed_token', 'poep', 1)
//   window.ga.dispatch()
//   logConsole(JSON.stringify(window.ga))
//   logConsole("Ga success")
//   logConsole(poep)
// }

// function gaError(poep) {
//   logConsole("Ga error")
//   logConsole(poep)
// }


// filtereddisabled = [];

// courseController.allGrades.filter((grade) => !grade.type.isPTA).forEach((grade) => filtereddisabled.push(grade))



function generateFilter() {
  filtereddisabled = [];

  courseController.allGrades.filter((grade) => !Array.from(document.getElementById('vakkenModalTable').children).map((ch) => { if (ch.children[0].checked) return ch.innerText })
    .filter((ent) => typeof ent != 'undefined')
    .includes(grade.class.description.capitalize()) && grade.type._type == 1)
    .forEach((grade) => filtereddisabled.push(grade));

  if (document.getElementById('periodeModalTable').children[0].id != 'noperiodsfound') courseController.allGrades.filter((grade) => ('CijferPeriode' in grade) && !Array.from(document.getElementById('periodeModalTable').children).map((ch) => { if (ch.children[0].checked) return ch.innerText })
    .filter((ent) => typeof ent != 'undefined')
    .includes(grade?.CijferPeriode?.name) && grade.type._type == 1)
    .forEach((grade) => filtereddisabled.push(grade));

  document.getElementById('gradefilterbutton').children[0].children[0].classList.add("activefilter");

  viewController.render(viewController.currentLesson);
  updateSidebar();
}

function generateSearch(Zoekopdracht) {
  var zoektable = $("#zoekGradesTable")
  zoektable.empty();
  var searched = courseController.allGrades.filter((grade) => Object.entries(grade).map((grade) => {if (grade[0].includes('grade') || grade[0].includes('description')) {return grade[1] } else if (grade[0].includes('teacher')) {return grade[1].teacherCode} else if (grade[0].includes('class')) {return grade[1].description}}).filter((grade) => typeof grade != 'undefined').filter((string) => string != null && string.toString().toLowerCase()
  .includes(Zoekopdracht.toString().toLowerCase())).length > 0);
  searched.forEach((grade, index) => {
    if (
      grade.type._type == 1 &&
      round(grade.grade) > 0 &&
      round(grade.grade) < 11 &&
      !filtereddisabled.includes(grade)
    ) {
      var d = new Date(grade.dateFilledIn);
      zoektable.append(`
        <a class="d-flex align-items-center border-bottom vibrate grade-card" href="#" data-toggle="modal" data-target="#gradeModal" onclick="viewController.renderGrade(${
          grade.id
        })" ${(grade.exclude) ? 'style="opacity:0.5 !important;"' : ""}>
          <div class="dropdown-list-image mr-1" style="margin-bottom: -9px">
            <div class="rounded-circle">
              <h4 class="text-center mt-2">${
                grade.grade == "10,0"
                  ? '<span class="text-success">10</span><span class="invisible">,</span>'
                  : !grade.passed
                  ? '<span class="text-danger">' + grade.grade + "</span>"
                  : grade.grade
              }<sup class="text-gray-800" style="font-size: 10px !important; top: -2em !important; font-variant-numeric: tabular-nums !important;">${
        grade.weight < 10
          ? grade.weight + 'x<span class="invisible">0</span>'
          : grade.weight + "x"
      }</sup></h4>
            </div>
            <!-- <div class="status-indicator bg-success"></div> -->
          </div>
          <div class="ml-1" style="padding-top: -6px">
            <span class="text-truncate font-weight-bold text-gray-800 small grade-small text-capitalize">${(lesson =
              "general" ? grade.class.description : grade.description)}</span>
            <span
              class="grades-table-date small grade-small float-right text-gray-600">${d.getDate()}-${
        d.getMonth() + 1
      }-${d.getFullYear()}</span>
            <div class="small grade-small text-gray-600">${
              grade.description == ""
                ? "<i>Geen beschrijving...</i>"
                : grade.description
            }</div>
          </div>
        </a>
        ${index != searched.length - 1 ? '<hr class="m-0 p-0">' : ""}
      `);
    }
  })
  if (searched.length == 0) {
    zoektable.append(`<div class="text-center mt-3 mb-3">Geen cijfers gevonden voor uw zoekopdracht...</div>`)
  }
}

function MoveToNewStorage() {
  var newaccountStorage = {};
  for (key of Object.keys(localStorage)) {
    if (key == "config") {
      parseddata = JSON.parse(localStorage[key]);
      parseddata.currentviewed = true;
      localStorage[key] = JSON.stringify(parseddata);
    }
    if (key == "courses") {
      courses = JSON.parse(localStorage[key]);
      courses.forEach(jaar => jaar.grades.forEach(grade => { 
        ['_fillUrl', '_magister'].forEach(rem => delete grade[rem]);
        ['id', 'number'].forEach(rem => delete grade.class[rem]);
        ['name', 'number', 'isAtLaterDate', 'isTeacher', 'level'].forEach(rem => delete grade.type[rem]);
      }))
      localStorage[key] = JSON.stringify(courses);
    }
    newaccountStorage[key] = localStorage[key];
  }
  localStorage.clear();
  localStorage.setItem(0, JSON.stringify(newaccountStorage));
  window.location = './index.html';
}

function onDeviceReady() {
  $.ajaxSetup({
    cache: false,
  });
  if (window.cordova.platformId === "ios") {
    jQuery.ajaxPrefilter(function (options) {
      if (options.url.substr(0, 24) !== "https://cors.sjoerd.dev/") {
        options.url = "https://cors.sjoerd.dev/" + options.url;
      }
    });
  }
  if (getObject("tokens", getActiveAccount()) != null) {
    logConsole("[INFO]   Device ready!");
    logConsole("[INFO]   Connection type: " + navigator.connection.type);
    if (navigator.connection.type !== Connection.NONE) {
      // window.ga.startTrackerWithId('211709234', 30, gaSuccess, gaError)
      refreshToken()
        .then((refreshTokens) => {
          tokens = refreshTokens;
          m = new Magister(school, tokens.access_token);
          setObject("tokens", JSON.stringify(tokens), getActiveAccount());
          m.getInfo()
            .then((p) => {
              person = JSON.parse(getObject("person", getActiveAccount()));
              account = JSON.parse(getObject("account", getActiveAccount()));
              if (p.id == person.id) {
                setObject("person", JSON.stringify(p), getActiveAccount());
                main();
                courseController.getLatestGrades(false, getActiveChildAccount());
                if (account == null || !"name" in account) {
                  m.getAccountInfo().then((a) => {
                    setObject("account", JSON.stringify(a), getActiveAccount());
                    if (a.id != account.id && account != null) {
                      navigator.notification.confirm(
                        "Er is een probleem met het inloggen waardoor je bent uitgelogd. Log opnieuw in.",
                        confirmLogout,
                        "Error",
                        ["Oké"]
                      );
                    }
                  });
                }
              } else {
                navigator.notification.confirm(
                  'Het lijkt erop dat je met een ander account bent ingelogd zojuist. Wil je je opgeslagen cijfers behouden en weer verder gaan log dan in met het account waarmee je tijdens de setup hebt ingelogd. \n\nKlopt dit niet? Dan er is er een flink probleem met de communicatie met Magister wat betekend dat je opnieuw het login process zal moeten volgen. Druk dan op "Uitloggen"',
                  openBrowser,
                  "Verkeerd account",
                  ["Opnieuw proberen", "Uitloggen"]
                );
              }
              // checkForUpdate().then(hasUpdate => {
              //   logConsole("hasUpdate: " + hasUpdate)
              //   if (hasUpdate) {
              //     viewController.toast('<span class="float-left">Nieuwe cijfers beschikbaar </span><a class="float-right vibrate" onclick="syncGrades()">UPDATE</a>', 4000, true)
              //   }
              // })
              //   .then(grades => {
              //     logConsole("Grades: " + JSON.stringify(grades))
              //     logConsole("Latest: " + JSON.stringify(latest))
              //     logConsole("Got latest grades!")
              //     // viewController.toast('Nieuwe cijfers beschikbaar <span class="text-warning float-right ml-3">UPDATE</span>', 3000)
              //     setObject("latest", JSON.stringify(grades))
              //     logConsole(JSON.stringify(latest))
              //     for (let grade in grades) {
              //       if (!(latest.some(x => x.kolomId === grade.kolomId && x.omschrijving === grade.omschrijving && x.waarde === grade.waarde && x.ingevoerdOp === grade.ingevoerdOp))) {
              //         viewController.toast('<span class="float-left">Nieuwe cijfers beschikbaar </span><a class="float-right vibrate" onclick="syncGrades()">UPDATE</a>', 4000, true)
              //         break;
              //       }
              //     }
              //     // logConsole(JSON.stringify(grades[0]))
              //   })
              // viewcontroller.renderCourse(false, false, courseController.current())
            })
            .catch((err) => {
              // if (err == "no internet") {
              viewController.toast(
                "Er kon geen verbinding met Magister gemaakt worden...",
                4000,
                true
              );
              // }
              errorConsole(err);
              person = JSON.parse(getObject("person", getActiveAccount()));
              main();
            });
        })
        .catch((err) => {
          // if (err == "no internet") {
          viewController.toast(
            "Er kon geen verbinding met Magister gemaakt worden...",
            4000,
            true
          );
          // }
          errorConsole(err);
          person = JSON.parse(getObject("person", getActiveAccount()));
          main();
        });
      // var BackgroundFetch = window.BackgroundFetch;

      // // Your background-fetch handler.
      // var fetchCallback = function () {
      //   refreshToken()
      //     .then((refreshTokens) => {
      //       tokens = refreshTokens
      //       m = new Magister(school, tokens.access_token)
      //       cordova.plugins.notification.local.schedule({
      //         title: 'Callback gemaakt',
      //         text: 'ewa',
      //         foreground: true
      //       });
      //       syncGrades().then(newGrades => {
      //         cordova.plugins.notification.local.schedule({
      //           title: 'Cijfers binnengecallbackt',
      //           text: 'poep',
      //           foreground: true
      //         });
      //         if (newGrades.length > 0) {
      //           var message = newGrades.map(grade => {
      //             return `${grade.grade} voor ${grade.class.abbreviation || grade.class.description}`
      //           })
      //           cordova.plugins.notification.local.schedule({
      //             title: newGrades.length < 2 ? `${newGrades.length} nieuw cijfer` : `${newGrades.length} nieuwe cijfers`,
      //             text: message.join(", "),
      //             foreground: true
      //           });
      //         }
      //       })

      //       // Required: Signal completion of your task to native code
      //       // If you fail to do this, the OS can terminate your app
      //       // or assign battery-blame for consuming too much background-time
      //       BackgroundFetch.finish();
      //     })
      // };

      // var failureCallback = function (error) {
      //   console.log('- BackgroundFetch failed', error);
      // };

      // BackgroundFetch.configure(fetchCallback, failureCallback, {
      //   minimumFetchInterval: 15 // <-- default is 15
      // });
    } else {
      logConsole("[INFO]   Continuing offline...");
      viewController.toast(
        "Er kon geen verbinding met Magister gemaakt worden...",
        4000,
        true
      );
      person = JSON.parse(getObject("person", getActiveAccount()));
      main();
    }
  } else {
    window.location = "./login.html";
  }
  showMeldingen();
}

async function showMeldingen() {
  const meldingen = await fetch(
    "https://magiscore-android.firebaseio.com/api/announcements.json"
  ).then((res) => res.json());
  if (meldingen != null) meldingen.forEach((melding) => showMelding(melding));
}

async function showMelding({ title, body, id }) {
  if (getObject(id, getActiveAccount()) != true && getObject(id, getActiveAccount()) != "true") {
    $("#general-wrapper").prepend(`
    <div class="row" id="${id}">
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-success shadow h-100">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">${title}</div>
                <div class="mb-0 font-weight-bold text-gray-800">${body}</div>
              </div>
            </div>
            <div style="position: absolute;top: 9px;right: 13px;">
              <a onclick="sluitMelding('${id}')" style="color:#1cc88a !important;">
                <i class="far fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    `);
  }
}

function sluitMelding(id) {
  setObject(id, true, getActiveAccount());
  $(`#${id}`).hide();
}

$(window).on('hashchange', function() {
  if (window.location.hash == "#settings") {
    viewController.openSettings();
  } else if (window.location.hash == "#search") {
    viewController.openZoeken()
  } else {
    viewController.closeSettings();
  }
});

// function onOffline() {
//   main()
//   viewController.toast("Het lijkt erop dat je offline bent...", 2500, false)
// }

// function onOnline() {
//   alert("online")
//   // viewController.toast("Je bent weer online!", false, false)
// }

function onResume() {
  if (idletime != null && Math.abs(new Date() - new Date(idletime)) > (30 * 60000)) {
    refreshToken().then((refreshTokens) => {
      tokens = refreshTokens;
      setObject("tokens", JSON.stringify(tokens), getActiveAccount());})
  }
  idletime = null;
}

function onPause() {
 idletime = new Date();
}

document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("pause", onPause, false);
document.addEventListener("resume", onResume, false);
// document.addEventListener("offline", onOffline, false);
// document.addEventListener("online", onDeviceReady, false);
// document.addEventListener("online", onDeviceReady, false);
