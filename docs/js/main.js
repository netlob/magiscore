setTimeout(function () {
  if ($("#userDropdown > span").text() == "Voornaam Achternaam") {
    location.reload()
  }
}, 1000)
var viewController = new ViewController($("#content-wrapper"))
var lessonController = new LessonController(viewController)

viewController.setConfig()
viewController.initTheme()

var currentLesson,
  sorted = {},
  person = JSON.parse(localStorage.getItem("person")),
  token = JSON.parse(localStorage.getItem("token")),
  school = JSON.parse(localStorage.getItem("school")),
  creds = JSON.parse(localStorage.getItem("creds")),
  course = JSON.parse(localStorage.getItem("course"))

function main(l) {
  var grades = localStorage.getItem("grades");
  if (grades && person && course && creds && school && viewController.config) {
    grades = JSON.parse(grades)

    grades.forEach(grade => {
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
        sorted[vak]['Grades'].push(grade)
      }
      if (grade.type._type == 12 || grade.type._type == 4 && round(grade.grade) > -1 && round(grade.grade) < 101) {
        sorted[vak]['Completed'].push(grade)
      }
    })
    for (var lesson in sorted) {
      var data = sorted[lesson]
      var grades = data["Grades"]
      lessonController.add(lesson, grades, data, lessonController)
    }

    viewController.updateNav()
    viewController.render(l ? l : 'general')
    if ($(window).width() < 767 && !document.querySelector('#accordionSidebar').classList.contains('toggled')) {
      document.querySelector('#sidebarToggleTop').click()
    }
    // $('#betaModal').modal({show:true})
  } else {
    window.location = './login/index.html'
    // alert(window.location)
  }
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
  return new Promise(function (resolve, reject) {
    $("#overlay").show();
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": creds.demo ? "https://api.magiscore.nl/demo" : "https://api.magiscore.nl/cijfers",
      "method": "GET",
      "headers": {
        "username": creds.demo ? "" : creds.username,
        "password": creds.demo ? "" : creds.password,
        "school": creds.demo ? "" : creds.school
      }
    }

    $.ajax(settings).done(function (response) {
      // $("#overlay").show();
      if (response.substring(0, 5) != 'error') {
        lessonController.clear()
        localStorage.removeItem("grades");
        localStorage.removeItem("person");
        localStorage.removeItem("token");
        localStorage.removeItem("school");
        localStorage.removeItem("course");
        sorted = {}
        var data = JSON.parse(response)
        var grades = data["grades"]
        var person = data["person"]
        var token = data["token"]
        var school = data["school"]
        var course = data["course"]
        localStorage.setItem("grades", JSON.stringify(grades));
        localStorage.setItem("person", JSON.stringify(person));
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("school", JSON.stringify(school));
        localStorage.setItem("course", JSON.stringify(course));
        grades.forEach(grade => {
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
            sorted[vak]['Grades'].push(grade)
          }
          if (grade.type._type == 12 || grade.type._type == 4 && round(grade.grade) > -1 && round(grade.grade) < 101) {
            sorted[vak]['Completed'].push(grade)
          }
        })
        $("#overlay").hide();
        viewController.lineChart.destroy();
        main(currentLesson)
        resolve()
      } else {
        $("#overlay").hide();
        viewController.toast(response, 5000)
        reject()
      }
    });
  });
}

function updateCache() {
  return new Promise(function (resolve, reject) {
    viewController.removeToasts()
    $("#overlay").show();
    var msg_chan = new MessageChannel();
    msg_chan.port1.onmessage = function (event) {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data);
      }
    };
    navigator.serviceWorker.controller.postMessage("updateAvailablePleaseUpdate", [msg_chan.port2]);
    location.reload();
  });
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
    return $(window).scrollTop() == 0
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
  if (!$('body').hasClass('sidebar-toggled') && $(window).width() < 767) {
    $('#sidebarToggleTop').click()
  }
});

document.addEventListener("deviceready", function () {
  alert("123");
  $('#wrapper').bind('swipeleft', function () {
    if (!$('body').hasClass('sidebar-toggled')) {
      $('#sidebarToggleTop').click()
    }
  });
  $('#wrapper').bind('swiperight', function () {
    if ($('body').hasClass('sidebar-toggled')) {
      $('#sidebarToggleTop').click()
    }
  });
}, true);

main()