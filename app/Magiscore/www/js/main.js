// import {
//   sync
// } from "glob";

// setTimeout(function () {
//   if ($("#userDropdown > span").text() == "Voornaam Achternaam") {
//     location.reload()
//   }
// }, 1000)
var viewController = new ViewController($("#content-wrapper"))
var lessonController = new LessonController(viewController)
var courseController = new CourseController(viewController)

viewController.setConfig()
viewController.initTheme()

var sorted = {},
  person = JSON.parse(localStorage.getItem("person")),
  tokens = JSON.parse(localStorage.getItem("token")),
  creds = JSON.parse(localStorage.getItem("creds")),
  courses = JSON.parse(localStorage.getItem("courses")),
  latest = JSON.parse(localStorage.getItem("latest")),
  school = localStorage.getItem("school"),
  m = null

courseController.clear()
courses.forEach(c => courseController.add(c))
viewController.currentCourse = courseController.current()
//courses.splice(courses.indexOf(courseController.current()))

function main(l) {
  sorted = {}
  lessonController.clear()
  lessonController.allGrades = []
  lessonController.lessons = []

  viewController.currentCourse.course.grades.forEach(grade => {
    var vak = grade.class.description.capitalize()
    if (sorted[vak] == null) {
      sorted[vak] = []
    }
    if (sorted[vak][grade.type.header] == null) {
      sorted[vak][grade.type.header] = []
    }
    if (sorted[vak]['Grades'] == null) {
      sorted[vak]['Grades'] = []
    }
    if (sorted[vak]['Completed'] == null) {
      sorted[vak]['Completed'] = []
    }
    sorted[vak][grade.type.header].push(grade)
    if (grade.type._type == 1 && round(grade.grade) > 0 && round(grade.grade) < 11) {
      grade.exclude = viewController.config.exclude.includes(grade.id);
      lessonController.allGrades.push(grade)
      sorted[vak]['Grades'].push(grade)
    }
    if (grade.type._type == 12 || grade.type._type == 4 && round(grade.grade) > -1 && round(grade.grade) < 101) {
      sorted[vak]['Completed'].push(grade)
    }
  })
  for (var lesson in sorted) {
    var data = sorted[lesson]
    var grades = data["Grades"]
    if (grades.length > 0) lessonController.add(lesson, grades, data, lessonController)
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
  localStorage.clear()
  window.location = './login/index.html'
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
      totalGrades -= 1
      //logConsole(fillAGrade)
      fillAGrade(chunk)


      if (totalGrades == 0) {
        localStorage.setItem("courses", JSON.stringify(all_courses))
        //window.location = '../index.html'
        logConsole("done Filling sync")
      }
    }).catch(err => {
      if (err == 429) {
        setTimeout(function () {
          fillAGrade(chunk)
        }, 21000)
      }
    })
  }
}



function syncGrades() {
  return new Promise((resolve, reject) => {
    logConsole("Sync started!")
    m.getCourses().then(syncCourses => {
      syncCourses.forEach(course => {
        if (!(courses.find(x => x.id == course.id))) {
          courses.push(course)
          courseController.add(course)
          localStorage.setItem("courses", JSON.stringify(courses))

        }
      });
      var currentCourse = courseController.current()
      currentCourse.getGrades().then(currentGrades => {
        var allGradeIds = currentCourse.grades.map(x => {
          return x.id
        })
        var newGrades = []
        currentGrades.forEach(grade => {
          if (!(allGradeIds.includes(grade.id))) {
            newGrades.push(grade)
            currentCourse.grades.push(grade)
          }
        })
        if (newGrades.length > 0) {
          var chunk = {}
          chunk.array = newGrades
          chunk.gradeIndex = 0
          fillAGrade(chunk)
        }
        resolve()
      }).catch(err => {
        errorConsole(err)
      })
    })

  })
}

const ptr = PullToRefresh.init({
  mainElement: '#ptr',
  shouldPullToRefresh: function () {
    return ($(window).scrollTop() == 0) && ($(".sidebar").css("z-index") < 0) && ($("#overlay").css("display") == "none") && viewController.settingsOpen == false
  },
  onRefresh: function (done) {
    syncGrades().then(d => done())
    done()
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
    logConsole('Device ready!')
    refreshToken()
      .then((refreshTokens) => {
        tokens = refreshTokens
        m = new Magister(school, tokens.access_token)
        m.getInfo()
          .then(p => {
            person = p
            localStorage.setItem("person", JSON.stringify(p))
            logConsole("Got person info!")
            main()
            courseController.getLatestGrades()
              .then(grades => {
                logConsole("Grades: " + JSON.stringify(grades))
                logConsole("Latest: " + JSON.stringify(latest))
                logConsole("Got latest grades!")
                // viewController.toast('Nieuwe cijfers beschikbaar <span class="text-warning float-right ml-3">UPDATE</span>', 3000)
                localStorage.setItem("latest", JSON.stringify(grades))
                for (let grade in grades) {
                  if (!(latest.some(x => x.kolomId === grade.kolomId && x.omschrijving === grade.omschrijving && x.waarde === grade.waarde && x.ingevoerdOp === grade.ingevoerdOp))) {
                    viewController.toast('<span class="float-left">Nieuwe cijfers beschikbaar </span><a class="float-right vibrate" onclick="syncCijfers()">UPDATE</a>', 4000, true)
                    break;
                  }
                }
                // logConsole(JSON.stringify(grades[0]))
              })
            // viewcontroller.renderCourse(false, false, courseController.current())
          }).catch(err => errorConsole(err))
      }).catch(err => errorConsole(err));
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