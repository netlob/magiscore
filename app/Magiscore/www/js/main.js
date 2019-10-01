// If you want comments. Go fuck yourself

var viewController = new ViewController($("#content-wrapper"))
var lessonController = new LessonController(viewController)
var courseController = new CourseController(viewController)

viewController.setConfig()
viewController.initTheme()

var sorted = {},
  person = JSON.parse(localStorage.getItem("person")),
  tokens = JSON.parse(localStorage.getItem("token")),
  courses = JSON.parse(localStorage.getItem("courses")),
  latest = JSON.parse(localStorage.getItem("latest")),
  school = localStorage.getItem("school"),
  m = null

courseController.clear()

courses.forEach(c => {
  var newCourse = Course.create()
  Object.keys(c).forEach(key => {
    newCourse[key] = c[key]
  });
  c = newCourse
  courseController.add(c)
})
viewController.currentCourse = courseController.current()

//logConsole("Courses" + JSON.stringify(courses))
// courses[1].grades.splice(0, 100)

// localStorage.setItem("courses", JSON.stringify(courses))
// logConsole("removed grades")


//courses.splice(courses.indexOf(courseController.current()))

function main(l) {
  //sorted = {}
  lessonController.clear()
  lessonController.allGrades = []
  lessonController.lessons = []
  var sorted = viewController.currentCourse.course.sortGrades()
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
    var lesson = sorted[vak]["Lesson"]

    if (lesson.grades.length > 0) {
      lessonController.add(vak, lesson)
      //logConsole(vak + ": " + lesson.averageLastYearFact())
      lesson.compareYearBeforeAverageFact()
      //logConsole("compared")
    }
    // var data = sorted[lesson]
    // var grades = data["Grades"]
    // if (grades.length > 0) lessonController.add(lesson, grades, data, lessonController, viewController.currentCourse.course)
  }


  viewController.updateNav()
  viewController.render(l ? l : 'general')
  // if ($(window).width() < 767 && !document.querySelector('#accordionSidebar').classList.contains('toggled')) {
  //   document.querySelector('#sidebarToggleTop').click()
  // }
  // $('#betaModal').modal({show:true})
  // } else {
  //window.location = './login/index.html'
  // alert(window.location)

  // }
}

function logOut() {
  navigator.notification.confirm(
    "Klik op \"Uitloggen\" als je zeker weet dat je wilt uitloggen. \n\nTip: er wordt momenteel gewerkt aan support voor meerdere accounts",
    confirmLogout,
    'Weet je het zeker?',
    ['Ja', 'Nee']
  )
}

function confirmLogout(b) {
  if (b == 1) {
    localStorage.clear()
    window.location = './login/index.html'
  }
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
    num = num.replace(',', '.')
  }
  return parseFloat(Math.round(num * 100) / 100).toFixed(2);
}

function fillAGrade(chunk) {
  logConsole("starting new fill: " + (chunk.gradeIndex < chunk.array.length))
  if (chunk.gradeIndex < chunk.array.length) {
    var currentGrade = chunk.array[chunk.gradeIndex]
    currentGrade.fill().then(value => {
      logConsole("filledAGrade")
      chunk.gradeIndex += 1
      chunk.totalGrades -= 1
      //logConsole(fillAGrade)
      fillAGrade(chunk)


      if (chunk.totalGrades == 0) {
        localStorage.setItem("courses", JSON.stringify(courses))
        //window.location = '../index.html'
        main()
        logConsole("done Filling sync")
      }
    }).catch(err => {
      if (err == 429) {
        setTimeout(function () {
          fillAGrade(chunk)
        }, 21000)
      } else if (err == "no internet") {
        viewController.toast("Er kon geen verbinding met Magister gemaakt worden...", 4000, true)
      } else {
        errorConsole(err)
      }
    })
  }
}

function checkForUpdate() {
  return new Promise((resolve, reject) => {
    m.getCourses().then(syncCourses => {
      syncCourses.forEach(course => {
        if (!(courses.find(x => x.id == course.id))) {
          resolve(true)

        }
      })
      //var currentCourse = courseController.current()
      courses.forEach(currentCourse => {
        var newCourse = Course.create()
        Object.keys(currentCourse).forEach(key => {
          newCourse[key] = currentCourse[key]
        });
        currentCourse = newCourse

        currentCourse.getGrades().then(currentGrades => {
          // logConsole("got grades")
          var allGradeIds = currentCourse.grades.map(x => {
            return x.id
          })
          logConsole(allGradeIds.length)
          currentGrades.forEach(grade => {
            if (!(allGradeIds.includes(grade.id))) {
              resolve(true)
              //logConsole("Not in id list")

            }
          })
          if (courses.indexOf(currentCourse) == courses.length - 1) {
            resolve(false)
          }
        })
      })
    })
  })
}

function syncGrades() {
  return new Promise((resolve, reject) => {
    $("#overlay").show()
    logConsole("Sync started!")
    m.getCourses().then(syncCourses => {
      syncCourses.forEach(course => {
        if (!(courses.find(x => x.id == course.id))) {
          courses.push(course)
          courseController.add(course)
          localStorage.setItem("courses", JSON.stringify(courses))
          logConsole("addedCourse")

        }
      })
      //var currentCourse = courseController.current()
      var allNewGrades = []
      courses.forEach(currentCourse => {
        var newCourse = Course.create()
        Object.keys(currentCourse).forEach(key => {
          newCourse[key] = currentCourse[key]
        });
        currentCourse = newCourse
        currentCourse._magister = m
        logConsole("is course: " + (currentCourse instanceof Course))
        logConsole(JSON.stringify(currentCourse))
        logConsole("course: " + currentCourse.id)
        currentCourse.getGrades().then(currentGrades => {
          // logConsole("got grades")
          var allGradeIds = currentCourse.grades.map(x => {
            return x.id
          })
          var newGrades = []
          logConsole(allGradeIds.length)
          currentGrades.forEach(grade => {
            if (!(allGradeIds.includes(grade.id))) {
              logConsole("Not in id list")
              newGrades.push(grade)
              allNewGrades.push(grade)
              currentCourse.grades.push(grade)
            }
          })
          logConsole("grades to fill: " + newGrades.length)
          if (newGrades.length > 0) {
            var chunk = {}
            chunk.array = newGrades
            chunk.gradeIndex = 0
            chunk.totalGrades = newGrades.length
            fillAGrade(chunk)
          }

        }).catch(err => {
          if (err == "no internet") viewController.toast("Er kon geen verbinding met Magister gemaakt worden...", 4000, true)
          errorConsole(err)
          errorConsole("ohno")
        })
        logConsole("requested grades")
      });
      if (allNewGrades.length > 0) {
        viewController.toast(`${allNewGrades.length} nieuwe cijfers gevonden!`, 2000, false)
      } else {
        viewController.toast("Geen nieuwe cijfers gevonden...", 2000, false)
      }
      resolve(allNewGrades)
      $("#overlay").hide()
    }).catch(err => {
      if (err == "no internet") viewController.toast("Er kon geen verbinding met Magister gemaakt worden...", 4000, true)
      errorConsole(err)
      $("#overlay").hide()
    })
  })
}

function fillTimeout() {}

const ptr = PullToRefresh.init({
  mainElement: '#ptr',
  shouldPullToRefresh: function () {
    return ($(window).scrollTop() == 0) && ($(".sidebar").css("z-index") < 0) && ($("#overlay").css("display") == "none") && viewController.settingsOpen == false
  },
  onRefresh: function (done) {
    vibrate(15, true)
    syncGrades().then(d => done())
    // done()
  }
});

var snapper;
if ($(window).width() <= 465) {
  snapper = new Snap({
    element: document.querySelector('#content-wrapper'),
    dragger: null,
    disable: 'right',
    addBodyClasses: true,
    hyperextensible: false,
    resistance: 0,
    flickThreshold: 0,
    transitionSpeed: 0.2,
    easing: 'ease',
    maxPosition: 238,
    minPosition: 0,
    tapToClose: true,
    touchToDrag: true,
    slideIntent: 40,
    minDragDistance: 5,
    // effect: 'pull'
  });
}

$(function () {
  FastClick.attach(document.body);
});

String.prototype.capitalize = function (poep) {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

Array.prototype.remove = function () {
  var what, a = arguments,
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

$('.container-fluid').click(function () {
  if (!$('body').hasClass('sidenav-open') && $(window).width() < 767) {
    $('#sidebarToggleTop').click()
  }
});

function vibrate(time, strong) {
  if (window.TapticEngine) {
    if (strong) TapticEngine.unofficial.strongBoom()
    else TapticEngine.unofficial.weakBoom()
  } else {
    navigator.vibrate(time || 15)
  }
}

// document.addEventListener("deviceready", function () {
//   alert("123");
//   $('#wrapper').bind('swipeleft', function () {
//     if (!$('body').hasClass('sidebar-toggled')) {
//       $('#sidebarToggleTop').click()
//     }
//   });
//   $('#wrapper').bind('swiperight', function () {
//     if ($('body').hasClass('sidebar-toggled')) {
//       $('#sidebarToggleTop').click()
//     }
//   });
// }, true);

//main()
function onDeviceReady() {
  if (localStorage.getItem("tokens") != null) {
    logConsole("Device ready!")
    logConsole("Connection type: " + navigator.connection.type)
    if (navigator.connection.type !== Connection.NONE) {
      refreshToken()
        .then((refreshTokens) => {
          tokens = refreshTokens
          logConsole("tokens: " + Object.keys(refreshTokens))
          m = new Magister(school, tokens.access_token)

          m.getInfo()
            .then(p => {
              person = p
              localStorage.setItem("person", JSON.stringify(p))
              logConsole("person: " + Object.keys(p))
              main()
              // checkForUpdate().then(hasUpdate => {
              //   logConsole("hasUpdate: " + hasUpdate)
              //   if (hasUpdate) {
              //     viewController.toast('<span class="float-left">Nieuwe cijfers beschikbaar </span><a class="float-right vibrate" onclick="syncGrades()">UPDATE</a>', 4000, true)
              //   }
              // })
              courseController.getLatestGrades()
              //   .then(grades => {
              //     logConsole("Grades: " + JSON.stringify(grades))
              //     logConsole("Latest: " + JSON.stringify(latest))
              //     logConsole("Got latest grades!")
              //     // viewController.toast('Nieuwe cijfers beschikbaar <span class="text-warning float-right ml-3">UPDATE</span>', 3000)
              //     localStorage.setItem("latest", JSON.stringify(grades))
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
            }).catch(err => {
              if (err == "no internet") viewController.toast("Er kon geen verbinding met Magister gemaakt worden...", 4000, true)
              errorConsole(err)
            })
        }).catch(err => {
          if (err == "no internet") {
            viewController.toast("Er kon geen verbinding met Magister gemaakt worden...", 4000, true)
            person = JSON.parse(localStorage.getItem("person"))
            main()
          }
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
      logConsole("Continuing offline...")
      viewController.toast("Er kon geen verbinding met Magister gemaakt worden...", 4000, true)
      person = JSON.parse(localStorage.getItem("person"))
      main()
    }
  } else {
    window.location = './login/index.html'
  }
}

// function onOffline() {
//   main()
//   viewController.toast("Het lijkt erop dat je offline bent...", 2500, false)
// }

// function onOnline() {
//   alert("online")
//   // viewController.toast("Je bent weer online!", false, false)
// }

document.addEventListener("deviceready", onDeviceReady, false);
// document.addEventListener("offline", onOffline, false);
// document.addEventListener("online", onDeviceReady, false);
// document.addEventListener("online", onDeviceReady, false);