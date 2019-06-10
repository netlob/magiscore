var viewController = new ViewController($("#content-wrapper"))
var lessonController = new LessonController()
    
var currentLesson,
    sorted = {},
    person = localStorage.getItem("person"),
    person = JSON.parse(person)
    token = localStorage.getItem("token"),
    token = JSON.parse(token)
    school = localStorage.getItem("school"),
    school = JSON.parse(school)
    creds = localStorage.getItem("creds"),
    creds = JSON.parse(creds)
    course = localStorage.getItem("course"),
    course = JSON.parse(course)
    config = localStorage.getItem("config"),
    config = JSON.parse(config)
    config = []

config.isDesktop = $(window).width()>600?true:false

function setupLogin() {
  var grades = localStorage.getItem("grades");
  if (grades && person && course && creds && school) {
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
    $('#betaModal').modal({show:true})
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
      $("#overlay").show();
      if(response.substring(0, 5) != 'error') {
        localStorage.clear()
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
        $("#overlay").hide();
        viewController.lineChart.destroy();
        setupLogin()
      }
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

// $("#content-wrapper").touchwipe({
//   wipeLeft: function() { if(!$('body').hasClass('sidebar-toggled')) { $('#sidebarToggleTop').click() } },
//   wipeRight: function() { if($('body').hasClass('sidebar-toggled')) { $('#sidebarToggleTop').click() } },
//   min_move_x: 40,
//   preventDefaultEvents: true,
//   allowPageScroll: "vertical"
// });
// $("#content-wrapper.div:not(:last-child)")
$("#content-wrapper").on('swiperight',  function(){ if($('body').hasClass('sidebar-toggled')) { $('#sidebarToggleTop').click() } });
$("#content-wrapper").on('swipeleft',  function(){ if(!$('body').hasClass('sidebar-toggled')) { $('#sidebarToggleTop').click() } });

String.prototype.capitalize = function(poep) {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

Date.prototype.toShortFormat = function() {
  var month_names =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var day = this.getDate();
  var month_index = this.getMonth();
  var year = this.getFullYear();
  return "" + day + " " + month_names[month_index] + " " + year;
}

setupLogin()