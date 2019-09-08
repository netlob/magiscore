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
  token = JSON.parse(localStorage.getItem("token")),
  creds = JSON.parse(localStorage.getItem("creds")),
  courses = JSON.parse(localStorage.getItem("courses")),
  school = localStorage.getItem("school"),
  m = null

courseController.clear()
courses.forEach(c => courseController.add(c))
viewController.currentCourse = courseController.current()

function main(l) {
  sorted = {}
  lessonController.clear()
  lessonController.allGrades = []
  lessonController.lessons = []

  viewController.currentCourse.course.grades.forEach(grade => {
    if (grade.class != undefined && viewController.currentCourse.course.classes.find(x => x.id === grade.class.id)) {
      logConsole(JSON.stringify(grade.type))
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

function syncGrades() {
  return new Promise((resolve, reject) => {
    logConsole("Sync started!")
    resolve()
  })
}
$("body").keypress(function (e) {
  if (e.which == 114) {
    e.preventDefault();
    var elem = $("body");
    $({
      deg: 0
    }).animate({
      deg: 360
    }, {
      duration: 4000,
      step: function (now) {
        elem.css({
          transform: `rotate(${now}deg)`
        });
      }
    });
  }
});

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

// $("#content-wrapper").touchwipe({
//   wipeLeft: function() { if(!$('body').hasClass('sidebar-toggled')) { $('#sidebarToggleTop').click() } },
//   wipeRight: function() { if($('body').hasClass('sidebar-toggled')) { $('#sidebarToggleTop').click() } },
//   min_move_x: 40,
//   preventDefaultEvents: true,
//   allowPageScroll: "vertical"
// });
// $("#content-wrapper.div:not(:last-child)")
// $("#content-wrapper").on('swiperight',  function(){ if($('body').hasClass('sidebar-toggled')) { $('#sidebarToggleTop').click() } });
// $("#content-wrapper").on('swipeleft',  function(){ if(!$('body').hasClass('sidebar-toggled')) { $('#sidebarToggleTop').click() } });
// var s = Swiped.init({
//   query: '#content-wrapper',
//   left: 180,
//   left: 180,
//   onOpen: function() {
//     console.dir('Open')
//       $('#content-wrapper').css('transform', 'none')
//       if($('body').hasClass('sidebar-toggled')) { $('#sidebarToggleTop').click() }
//   },
//   onClose: function() {
//     console.dir('Close')
//     // $('#content-wrapper').css('transform', 'none')
//     // if(!$('body').hasClass('sidebar-toggled')) { $('#sidebarToggleTop').click() }
//   }
// });;
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
      .then((tokens) => {
        logConsole('Got tokens!')
        m = new Magister(school, tokens.access_token)
        m.getInfo()
          .then(p => {
            person = p
            logConsole("Got person info!")
            main()
            // viewcontroller.renderCourse(false, false, courseController.current())
          })
      });
  } else {
    window.location = './login/index.html'
  }
}

document.addEventListener("deviceready", onDeviceReady, false);