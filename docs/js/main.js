setTimeout(function(){ if($("#userDropdown > span").text() == "Voornaam Achternaam") { location.reload() } }, 1000)
var viewController = new ViewController($("#content-wrapper"))
var lessonController = new LessonController()
    
var currentLesson,
    sorted = {},
    person = JSON.parse(localStorage.getItem("person")),
    token = JSON.parse(localStorage.getItem("token")),
    school = JSON.parse(localStorage.getItem("school"),)
    creds = JSON.parse(localStorage.getItem("creds")),
    course = JSON.parse(localStorage.getItem("course"))
  
viewController.setConfig()

function main() {
  var grades = localStorage.getItem("grades");
  if (grades && person && course && creds && school && viewController.config) {
    grades = JSON.parse(grades)

    grades.forEach(grade => {
      var vak = grade.class.description.capitalize()
      if (sorted[vak] == null) { sorted[vak] = [] }
      if (sorted[vak][grade.type.header] == null) { sorted[vak][grade.type.header] = [] }
      if (sorted[vak]['Grades'] == null) { sorted[vak]['Grades'] = [] }
      if (sorted[vak]['Completed'] == null) { sorted[vak]['Completed'] = [] }
      sorted[vak][grade.type.header].push(grade)
      if(grade.type._type == 1 && round(grade.grade) > 0 && round(grade.grade) < 11) { sorted[vak]['Grades'].push(grade) }
      if(grade.type._type == 12 || grade.type._type == 4 && round(grade.grade) > -1 && round(grade.grade) < 101) { sorted[vak]['Completed'].push(grade) }
    })
    for(var lesson in sorted) {
      var data = sorted[lesson]
      var grades = data["Grades"]
      lessonController.add(lesson, grades, data, $("#lesson-wrapper"))
    }

    viewController.updateNav()
    viewController.render('general')
    if($(window).width() < 767 && !document.querySelector('#accordionSidebar').classList.contains('toggled')) { document.querySelector('#sidebarToggleTop').click() }
    // $('#betaModal').modal({show:true})
  } else {
    window.location.href = '/login/'
  }
}

function logOut() {
  localStorage.clear()
  location.href = '/login'
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

function round(num){
  if(typeof num == "string") {
    num = num.replace(',','.')
  }
  return parseFloat(Math.round(num * 100) / 100).toFixed(2);
}

function syncGrades() {
  return new Promise(function(resolve, reject) {
    $("#overlay").show();
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://magistat.bramkoene.nl/api/cijfers",
        "method": "GET",
        "headers": {
            "username": creds.username,
            "password": creds.password,
            "school": creds.school
        }
    }
    
    $.ajax(settings).done(function (response) {
      // $("#overlay").show();
      if(response.substring(0, 5) != 'error') {
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
          if (sorted[vak] == null) { sorted[vak] = [] }
          if (sorted[vak][grade.type.header] == null) { sorted[vak][grade.type.header] = [] }
          if (sorted[vak]['Grades'] == null) { sorted[vak]['Grades'] = [] }
          if (sorted[vak]['Completed'] == null) { sorted[vak]['Completed'] = [] }
          sorted[vak][grade.type.header].push(grade)
          if(grade.type._type == 1 && round(grade.grade) > 0 && round(grade.grade) < 11) { sorted[vak]['Grades'].push(grade) }
          if(grade.type._type == 12 || grade.type._type == 4 && round(grade.grade) > -1 && round(grade.grade) < 101) { sorted[vak]['Completed'].push(grade) }
        })
        $("#overlay").hide();
        viewController.lineChart.destroy();
        main()
        resolve()
      } else {
        $("#overlay").hide();
        viewController.toast(response.substring, 5000)
        reject()
      }
    });
  });
}

function updateCache() {
  return new Promise(function(resolve, reject) {
    viewController.removeToasts()
    $("#overlay").show();
    var msg_chan = new MessageChannel();
    msg_chan.port1.onmessage = function(event) {
        if(event.data.error) {
            reject(event.data.error);
        } else {
            resolve(event.data);
        }
    };
    navigator.serviceWorker.controller.postMessage("updateAvailablePleaseUpdate", [msg_chan.port2]);
    location.reload();
  });
}

$("body").keypress(function(e) {
  if(e.which == 114) {
    e.preventDefault();
    var elem = $("body");
    $({deg: 0}).animate({deg: 360}, {
      duration: 4000,
      step: function(now){
        elem.css({
          transform: "rotate(" + now + "deg)"
        });
      }
    });
  }
});

const ptr = PullToRefresh.init({
  mainElement: '#ptr',
  onRefresh: function (done) {
    syncGrades().then(d => done())
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
var s = Swiped.init({
  query: '#content-wrapper',
  left: 180,
  left: 180,
  onOpen: function() {
    console.dir('Open')
      $('#content-wrapper').css('transform', 'none')
      if($('body').hasClass('sidebar-toggled')) { $('#sidebarToggleTop').click() }
  },
  onClose: function() {
    console.dir('Close')
    // $('#content-wrapper').css('transform', 'none')
    // if(!$('body').hasClass('sidebar-toggled')) { $('#sidebarToggleTop').click() }
  }
});;

String.prototype.capitalize = function(poep) {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

Array.prototype.remove = function() {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
      what = a[--L];
      while ((ax = this.indexOf(what)) !== -1) {
          this.splice(ax, 1);
      }
  }
  return this;
};

main()