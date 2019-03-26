var Fraction = algebra.Fraction;
var Expression = algebra.Expression;
var Equation = algebra.Equation;

var indexedCijfers = {
    // "element.class.description": {
    //     "element.id": {
    //         Weight: element.weight,
    //         name: element.class.description
    //     }
    // }
};
var sorted = {}
var person = localStorage.getItem("person");
var person = JSON.parse(person)
var token = localStorage.getItem("token");
var token = JSON.parse(token)
var school = localStorage.getItem("school");
var school = JSON.parse(school)
var creds = localStorage.getItem("creds");
var creds = JSON.parse(creds)
var course = localStorage.getItem("course");
var course = JSON.parse(course)

function setupLogin() {
    var grades = localStorage.getItem("grades");
    if (grades && person && course && creds && school) {
        grades = JSON.parse(grades)

        grades.forEach(grade => {
            var vak = grade.class.description.capitalize()
            if (sorted[vak] == null) { sorted[vak] = [] }
            if (sorted[vak][grade.type.header] == null) { sorted[vak][grade.type.header] = [] }
            if (sorted[vak]['Grades'] == null) { sorted[vak]['Grades'] = [] }
            sorted[vak][grade.type.header].push(grade)
            // console.dir(grade.type.description)
            if(grade.type._type == 1 && round(grade.grade) > 0 && round(grade.grade) < 11) { sorted[vak]['Grades'].push(grade) }
        })

        updateNav()
        showClass('general')
    } else {
        window.location.href = '/login/'
    }
}

function showClass(vak) {
    if (vak == 'general') {
      document.getElementById('General').style.display = 'block';
      document.getElementById('subjectSpecific').style.display = 'none';
      $('#general-area-title').text(`Alle cijfers van ${course.type.description}`)
      setChartData(null, true)
      setCompleted()
    } else {
      var subjectDiv = document.getElementById('subjectSpecific')
      while (subjectDiv.firstChild) {
          subjectDiv.removeChild(subjectDiv.firstChild)
      }
      subjectDiv.insertAdjacentHTML('beforeend', generateHTML(vak))
      document.getElementById('General').style.display = 'none';
      document.getElementById('subjectSpecific').style.display = 'block';
      setChartData(vak)
      setTableData(vak)
    }
}

function updateNav() {
    var vakken = Object.keys(sorted)
    vakken.forEach(vak => {
        var HTML = `<li class="nav-item">
                        <a class="nav-link" onclick="showClass('${vak}')">
                            <span>${vak.capitalize()}</span>
                        </a>
                    </li>`
        document.getElementById('subjectsNav').insertAdjacentHTML('beforeend', HTML)
    })

    var profilepicStorage = localStorage.getItem("profilepic"),
    profilepic = document.getElementById("imgelem");
    if (profilepicStorage) {
      console.dir('Using saved pic')
      // Reuse existing Data URL from localStorage
      profilepic.setAttribute("src", profilepicStorage);
    } else {
      var xhr = new XMLHttpRequest(),
        blob,
        fileReader = new FileReader();
      xhr.responseType = 'blob'; //so you can access the response like a normal URL
      xhr.onreadystatechange = function () {
          if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
              blob = new Blob([xhr.response], {type: "image/png"});

              // onload needed since Google Chrome doesn't support addEventListener for FileReader
              fileReader.onload = function (evt) {
                  // Read out file contents as a Data URL
                  var result = evt.target.result;
                  // Set image src to Data URL
                  profilepic.setAttribute("src", result);
                  // Store Data URL in localStorage
                  try {
                      localStorage.setItem("profilepic", result);
                  }
                  catch (e) {
                      console.log("Storage failed: " + e);
                  }
              };
              // Load blob as Data URL
              fileReader.readAsDataURL(blob);
          }
      };
      xhr.open('GET', `https://cors-anywhere.herokuapp.com/${school.url}/api/personen/${person.id}/foto?width=640&height=640&crop=no`, true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send();

    }
    document.querySelector('#userDropdown > span').innerHTML = `${person.firstName} ${person.lastName} (${course.group.description})`
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

function getAverage(vak, rounded) {
  if(sorted[vak]) {
    if(sorted[vak]['Grades'].length > 0) {
      var newCijfer = 0;
      var Grades = []
      var processed = 0;
      sorted[vak]['Grades'].forEach(_grade => {
        if(Number(round(_grade.grade)) > 0 && Number(round(_grade.grade)) < 10.1) {
          // console.dir(_grade)
          processed++
          for(let i = 0; i < _grade.weight; i++) {
            Grades.push(Number(round(_grade.grade)))
          }
          if(processed == sorted[vak]['Grades'].length) {
            var Average = 0;
            for (let i = 0; i < Grades.length; i++) {
              const Grade = Grades[i];
              Average += Grade
            }
            newCijfer = Average / Grades.length
          }
        }
      })
      // console.dir('Grades voor: '+vak)
      // console.dir(Grades)
      if(rounded){
        return round(newCijfer)
      } else {
        return newCijfer
      }
    } else {
      return "Niet beschikbaar"
    }
  }
}

function round(num){
  if(typeof num == "string") {
    num = num.replace(',','.')
  }
  return parseFloat(Math.round(num * 100) / 100).toFixed(2);
}

function getCompleted(vak) {
    if (sorted[vak]['% voltooid']) {
        return sorted[vak]['% voltooid'][0]['grade']
    } else {
        return "Niet beschikbaar"
    }
}

function getProgress(vak) {
    if (sorted[vak]['Vordering']) {
        return sorted[vak]['Vordering'][0]['grade']
    } else {
        return 0
    }
}

function getEffort(vak) {
    if (sorted[vak]['Inzet']) {
        return sorted[vak]['Inzet'][0]['grade']
    } else {
        return "Niet beschikbaar"
    }
}

function getNewAverage(vak, grade, weight) {
  grade = parseFloat(grade.replace(',', '.'))
  weight = parseFloat(weight.replace(',', '.'))

  if (getAverage(vak) == 'Niet beschikbaar') {
      return 'Niet mogelijk voor dit vak';
  }
  var newCijfer;
  var Grades = []
  var processed = 0;
  for (let i = 0; i < weight; i++) {
    Grades.push(grade)
  }
  sorted[vak]['Grades'].forEach(_grade => {
      processed++
      for (let i = 0; i < _grade.weight; i++) {
        Grades.push(parseFloat(_grade.grade.replace(',', '.')))
      }
      if (processed == sorted[vak]['Grades'].length) {
        var Average = 0;
        for (let i = 0; i < Grades.length; i++) {
          const Grade = Grades[i];
            Average += Grade
        }
        newCijfer= Average / Grades.length
      }
  })
  $('#newGrade-newGrade').text(round(newCijfer))
  return round(newCijfer)
}

function getNewGrade(vak, grade, weight) {
  if (getAverage(vak) == 'Niet beschikbaar') {
      return 'Niet mogelijk voor dit vak';
  }
  var newCijfer
  var Grades = []
  var processed = 0;
  // for (let i = 0; i < weight; i++) {
  //   Grades.push(grade)
  // }
  sorted[vak]['Grades'].forEach(_grade => {
      processed++
      for (let i = 0; i < _grade.weight; i++) {
        Grades.push(parseFloat(_grade.grade.replace(',', '.')))
      }
      if (processed == sorted[vak]['Grades'].length) {
        var Average = 0;
        for (let i = 0; i < Grades.length; i++) {
          const Grade = Grades[i];
            Average += Grade
        }
        console.log
        newCijfer= Average / Grades.length
      }
  })
  console.log(Grades)
  return newCijfer
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

Date.prototype.toShortFormat = function() {
    var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];
    var day = this.getDate();
    var month_index = this.getMonth();
    var year = this.getFullYear();
    return "" + day + " " + month_names[month_index] + " " + year;
}

setupLogin()

function setChartData(vak, everything) {
    var data = []
    var datums = []
    var cijfers = []
    var vol = 0
    var onvol = 0

    if(everything) {
        for(var classcourse in sorted) {
            for(var gradearray in sorted[classcourse]) {
                if(gradearray == "Grades") {
                    for(var grade in sorted[classcourse][gradearray]) {
                        var gradegrade = sorted[classcourse][gradearray][grade].grade.replace(',', '.')
                        data.push({
                          t: new Date(sorted[classcourse][gradearray][grade].dateFilledIn),
                          y: gradegrade
                        })
                        gradegrade = parseFloat(gradegrade.replace(",","."))
                        if(gradegrade >= 5.5) { vol++ } else { onvol++ }
                    }
                }
            }
        }
    } else {
        for(var gradearray in sorted[vak]) {
            if(gradearray == "Grades") {
                for(var grade in sorted[vak][gradearray]) {
                    var gradegrade = sorted[vak][gradearray][grade].grade.replace(',', '.')
                    data.push({
                      t: new Date(sorted[vak][gradearray][grade].dateFilledIn),
                      y: gradegrade
                    })
                    gradegrade = parseFloat(gradegrade.replace(",","."))
                    if(gradegrade >= 5.5) { vol++ } else { onvol++ }
                }
            }
        }
    }

    data.sort(function(a,b){
      return new Date(b.t) - new Date(a.t);
    });

    data.forEach(value => {
      datums.push(value.t.toShortFormat())
      cijfers.push(value.y)
    })

    datums.reverse()
    cijfers.reverse()

    var ctx = document.getElementById('myAreaChart').getContext('2d');
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: datums,
            // labels: ["Sep", "Okt", "Nov", "Dec", "Jan", "Feb", "Maa", "Apr", "Mei", "Jun", "Jul"],
            datasets: [{
                label: "Cijfer",
                lineTension: 0.3,
                backgroundColor: "rgba(21, 106, 54, 0.05)",
                borderColor: "rgba(32, 163, 83, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(21, 106, 54, 1)",
                pointBorderColor: "rgba(21, 106, 54, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(32, 163, 83, 1)",
                pointHoverBorderColor: "rgba(32, 163, 83, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: cijfers,
            }],
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                padding: {
                    // left: 10,
                    // right: 25,
                    // top: 25,
                    // bottom: 0
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: 'time'
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        maxTicksLimit: 10,
                        autoSkip: true,
                        maxRotation: 90,
                        minRotation: 0
                    },
                    time: {
                      displayFormats: {
                          quarter: 'D MMM YYYY'
                      }
                  }
                }],
                yAxes: [{
                    ticks: {
                        maxTicksLimit: 10,
                        padding: 10,
                        beginAtZero: true,
                        steps: 10,
                        max: 10
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    }
                }],
            },
            legend: {
                display: false
            },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: 'index',
                caretPadding: 10
            },
            annotation: {
              annotations: [{
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: 5.5,
                borderColor: 'rgb(255, 0, 0)',
                borderWidth: 2,
                label: {
                  enabled: false,
                  content: 'Onvoldoende'
                }
              }]
            }
        }
    });

    var ctx = document.getElementById("myPieChart");
    var myPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["Voldoendes", "Onvoldoendes"],
        datasets: [{
          data: [vol, onvol],
          backgroundColor: ['#156a36', '#e74a3b'],
          hoverBackgroundColor: ['#156a36', '#e74a3b'],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
        },
        legend: {
          display: false
        },
        cutoutPercentage: 80,
      },
    });

    if(vol + onvol > 0) {
      var tot = vol + onvol
      vol = round(vol / tot * 100)
      onvol = round(onvol / tot * 100)
      $('#percentageGrades').text(`${vol}% voldoende - ${onvol}% onvoldoende`)
    } else {
      $('#percentageGrades').text(`Geen cijfers voor dit vak...`)
    }
}

function setTableData(vak) {
  var table = $('#cijfersTable')
  var grades = sorted[vak]["Grades"]
  grades.reverse()
  grades.forEach(grade => {
    table.append(`<tr>
                    <td>${grade.grade}</td>
                    <td>${grade.weight}x</td>
                    <td>${grade.description}</td>
                    <td>${grade.counts?'Ja':'Nee'}</td>
                    <td>${grade.passed?'Ja':'Nee'}</td>
                    <td>${grade.atLaterDate?'Ja':'Nee'}</td>
                    <td>${grade.exemption?'Ja':'Nee'}</td>
                    <td>${grade.teacher.teacherCode}</td>
                    <td>${new Date(grade.dateFilledIn).toShortFormat()}</td>
                  </tr>`)
  })
  // $('#dataTable').DataTable();
}

function syncGrades() {
    document.getElementById("overlay").style.display = "block";
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://magistat.bramkoene.nl/api/cijfers",
        "method": "POST",
        "headers": {
            "username": creds.username,
            "password": creds.password,
            "school": creds.school
        }
    }
    
    $.ajax(settings).done(function (response) {
      document.getElementById("overlay").style.display = "block";
      if(response.substring(0, 5) != 'error') {
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
          document.getElementById("overlay").style.display = "none";
          setupLogin()
      }
  });
}

function logOut() {
  localStorage.clear()
  location.href = '/login'
}

function needToGet(vak, grade, weight) {
    if(!grade){ var grade = round(document.querySelector('#getGrade-grade').value) }
    if(!weight){ var weight = round(document.querySelector('#getGrade-weight').value) }
    grade = Number(grade)
    weight = Number(weight)
    // console.dir('Grade: '+grade + typeof grade)
    // console.dir('Weight: '+weight + typeof weight)
    var grades = sorted[vak]["Grades"]
    var alles = 0;
    for (var i = 0; i < grades.length; i++) {
      var cijfer = grades[i].grade.replace(',','.')
      cijfer = Number(cijfer)
      alles += (cijfer*grades[i].weight);
    }
    var totaalweging = 0;
    for (var i = 0; i < grades.length; i++) {
        totaalweging += grades[i].weight;
    }
    res = (((totaalweging+weight)*grade)-alles)/weight;
    console.dir(res +typeof res)
    res = round(res)
    if(res > 10) {
      res = `Onhaalbaar, namelijk een ${res}`
    }
    $('#getGrade-newGrade').text(res)
    return res
}

function setCompleted() {
  var totcompleted = 0,
      totcomclass = 0,
      totgem = 0,
      totgemclass = 0
  $('#general-progress').empty()
  for(var vak in sorted) {
    if(getCompleted(vak) > 0) {
      var html = generateHTMLprogress(vak)
      $('#general-progress').append(html)
    }
    if(getCompleted(vak) > -1 && getCompleted(vak) < 101) {
      totcompleted = totcompleted + parseFloat(getCompleted(vak))
      totcomclass++
    }
    if(parseFloat(getAverage(vak)) > -1 && parseFloat(getAverage(vak)) < 11) {
      totgem = totgem + parseFloat(getAverage(vak))
      totgemclass++
    }
  }
  var totcompleted = totcompleted / totcomclass
  $('#general-completed-bar').attr('aria-valuenow', totcompleted)
  $('#general-completed-bar').attr('style', `width: ${totcompleted}%`)
  $('#general-completed').text(`${round(totcompleted)}%`)
  var totgem = totgem / totgemclass
  $('#general-average').text(`${round(totgem)}`)
}

function generateHTMLprogress(vakName) {
  return `<div>
            <h4 class="small font-weight-bold">${vakName}<span class="float-right">${getCompleted(vakName)}%</span></h4>
            <div class="progress mb-4">
              <div class="progress-bar" role="progressbar" style="width: ${getCompleted(vakName)}%; background-color: #1a6938 !important" aria-valuenow="${getCompleted(vakName)}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>`
}

function generateHTML(vakName) {
    return `<!-- Page Heading -->
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0 text-gray-800">${vakName.capitalize()}</h1>
    </div>
    <!-- Content Row -->
    <div class="row">
      <!-- Earnings (Monthly) Card Example -->
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-primary shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Gemiddeld cijfer</div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">${getAverage(vakName, true)}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-graduation-cap fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-success shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-info text-uppercase mb-1 text-green">% Voltooid</div>
                <div class="row no-gutters align-items-center">
                  <div class="col-auto">
                    <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">${getCompleted(vakName)}</div>
                  </div>
                  <div class="col">
                    <div class="progress progress-sm mr-2">
                      <div class="progress-bar bg-info" role="progressbar" style="width: ${getCompleted(vakName)}%" aria-valuenow="${getCompleted(vakName)}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-auto">
                <i class="fas fa-spinner fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-info shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Vordering</div>
                <div class="row no-gutters align-items-center">
                  <div class="col-auto">
                    <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">${getProgress(vakName)}</div>
                  </div>
                </div>
              </div>
              <div class="col-auto">
                <i class="fas fa-check fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Requests Card Example -->
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-warning shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">Inzet</div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">${getEffort(vakName)}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-grin-beam-sweat fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
        <div class="col-lg-6 mb-4">
            <div class="card text-gray-800 shadow">
                <div class="card-body">
                    Wat ga ik staan?
                    <form class="newGrade">
                      <p></p>
                      <div class="form-group">
                          <input type="number" class="form-control form-control-user" id="newGrade-grade" placeholder="Nieuw cijfer">
                      </div>
                      <div class="form-group">
                          <input type="number" class="form-control form-control-user" id="newGrade-weight" placeholder="Weging">
                      </div>
                      <p id="newGrade-newGrade" class="showCalculatedGrade"></p>
                    <a onclick="getNewAverage('${vakName}', $('#newGrade-grade').val(), $('#newGrade-weight').val())" class="btn btn-primary btn-user btn-block bg-gradiant-primary">Bereken</a>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-lg-6 mb-4">
            <div class="card text-gray-800 shadow">
                <div class="card-body">
                    Wat moet ik halen?
                    <form class="getGrade">
                      <p></p>
                      <div class="form-group">
                          <input type="number" class="form-control form-control-user" id="getGrade-grade" placeholder="Ik wil staan">
                      </div>
                      <div class="form-group">
                          <input type="number" class="form-control form-control-user" id="getGrade-weight" placeholder="Weging">
                      </div>
                      <p id="getGrade-newGrade"></p>
                      <a onclick="needToGet('${vakName}')" class="btn btn-primary btn-user btn-block bg-gradiant-primary">Bereken</a>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Content Row -->

    <div class="row">

      <!-- Area Chart -->
      <div class="col-xl-8 col-lg-7">
        <div class="card shadow mb-4">
          <!-- Card Header - Dropdown -->
          <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Cijfers voor ${vakName}</h6>
            <div class="dropdown no-arrow">
              <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
              </a>
              <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                <div class="dropdown-header">Dropdown Header:</div>
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
            </div>
          </div>
          <!-- Card Body -->
          <div class="card-body">
            <div class="chart-area chart-container">
              <canvas id="myAreaChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Pie Chart -->
      <div class="col-xl-4 col-lg-5">
        <div class="card shadow mb-4">
          <!-- Card Header - Dropdown -->
          <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Voldoendes / onvoldoendes</h6>
            <div class="dropdown no-arrow">
              <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
              </a>
              <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                <div class="dropdown-header">Dropdown Header:</div>
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
            </div>
          </div>
          <!-- Card Body -->
          <div class="card-body">
            <h6 id="percentageGrades"></h6>
            <div class="chart-pie chart-container pt-4 pb-2">
              <canvas id="myPieChart"></canvas>
            </div>
            <div class="mt-4 text-center small">
              <span class="mr-2">
                <i class="fas fa-circle" style="color: #156a36"></i> Voldoendes
              </span>
              <span class="mr-2">
                <i class="fas fa-circle" style="color: #e74a3b"></i> Onvoldoendes
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- DataTales Example -->
      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Cijfers voor ${vakName}</h6>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table" id="dataTable" width="100%" cellspacing="0">
              <thead class="text-primary">
                <tr>
                  <th>Cijfer</th>
                  <th>Weging</th>
                  <th>Omschrijving</th>
                  <th>Telt mee</th>
                  <th>Is voldoende</th>
                  <th>Inhalen</th>
                  <th>Vrijstelling</th>
                  <th>Docent</th>
                  <th>Ingevoerd op</th>
                </tr>
              </thead>
              <!-- <tfoot>
                <tr>
                  <th>Cijfer</th>
                  <th>Weging</th>
                  <th>Omschrijving</th>
                  <th>Telt mee</th>
                  <th>Is voldoende</th>
                  <th>Inhalen</th>
                  <th>Vrijstelling</th>
                  <th>Docent</th>
                  <th>Ingevoerd op</th>
                </tr>
              </tfoot> -->
              <tbody id="cijfersTable">
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>`

    // <!-- Content Row -->
    // <div class="row">

    //   <!-- Content Column -->
    //   <div class="col-lg-6 mb-4">

    //     <!-- Project Card Example -->
    //     <div class="card shadow mb-4">
    //       <div class="card-header py-3">
    //         <h6 class="m-0 font-weight-bold text-primary">Projects</h6>
    //       </div>
    //       <div class="card-body">
    //         <h4 class="small font-weight-bold">Server Migration <span class="float-right">20%</span></h4>
    //         <div class="progress mb-4">
    //           <div class="progress-bar bg-danger" role="progressbar" style="width: 20%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
    //         </div>
    //         <h4 class="small font-weight-bold">Sales Tracking <span class="float-right">40%</span></h4>
    //         <div class="progress mb-4">
    //           <div class="progress-bar bg-warning" role="progressbar" style="width: 40%" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
    //         </div>
    //         <h4 class="small font-weight-bold">Customer Database <span class="float-right">60%</span></h4>
    //         <div class="progress mb-4">
    //           <div class="progress-bar" role="progressbar" style="width: 60%" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
    //         </div>
    //         <h4 class="small font-weight-bold">Payout Details <span class="float-right">80%</span></h4>
    //         <div class="progress mb-4">
    //           <div class="progress-bar bg-info" role="progressbar" style="width: 80%" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
    //         </div>
    //         <h4 class="small font-weight-bold">Account Setup <span class="float-right">Complete!</span></h4>
    //         <div class="progress">
    //           <div class="progress-bar bg-success" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
    //         </div>
    //       </div>
    //     </div>

    //     <!-- Color System -->
    //     <div class="row">
    //       <div class="col-lg-6 mb-4">
    //         <div class="card bg-primary text-white shadow">
    //           <div class="card-body">
    //             Primary
    //             <div class="text-white-50 small">#4e73df</div>
    //           </div>
    //         </div>
    //       </div>
    //       <div class="col-lg-6 mb-4">
    //         <div class="card bg-success text-white shadow">
    //           <div class="card-body">
    //             Success
    //             <div class="text-white-50 small">#1cc88a</div>
    //           </div>
    //         </div>
    //       </div>
    //       <div class="col-lg-6 mb-4">
    //         <div class="card bg-info text-white shadow">
    //           <div class="card-body">
    //             Info
    //             <div class="text-white-50 small">#36b9cc</div>
    //           </div>
    //         </div>
    //       </div>
    //       <div class="col-lg-6 mb-4">
    //         <div class="card bg-warning text-white shadow">
    //           <div class="card-body">
    //             Warning
    //             <div class="text-white-50 small">#f6c23e</div>
    //           </div>
    //         </div>
    //       </div>
    //       <div class="col-lg-6 mb-4">
    //         <div class="card bg-danger text-white shadow">
    //           <div class="card-body">
    //             Danger
    //             <div class="text-white-50 small">#e74a3b</div>
    //           </div>
    //         </div>
    //       </div>
    //       <div class="col-lg-6 mb-4">
    //         <div class="card bg-secondary text-white shadow">
    //           <div class="card-body">
    //             Secondary
    //             <div class="text-white-50 small">#858796</div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //   </div>

    //   <div class="col-lg-6 mb-4">

    //     <!-- Illustrations -->
    //     <div class="card shadow mb-4">
    //       <div class="card-header py-3">
    //         <h6 class="m-0 font-weight-bold text-primary">Illustrations</h6>
    //       </div>
    //       <div class="card-body">
    //         <div class="text-center">
    //           <img class="img-fluid px-3 px-sm-4 mt-3 mb-4" style="width: 25rem;" src="img/undraw_posting_photo.svg" alt="">
    //         </div>
    //         <p>Add some quality, svg illustrations to your project courtesy of <a target="_blank" rel="nofollow" href="https://undraw.co/">unDraw</a>, a constantly updated collection of beautiful svg images that you can use completely free and without attribution!</p>
    //         <a target="_blank" rel="nofollow" href="https://undraw.co/">Browse Illustrations on unDraw &rarr;</a>
    //       </div>
    //     </div>

    //     <!-- Approach -->
    //     <div class="card shadow mb-4">
    //       <div class="card-header py-3">
    //         <h6 class="m-0 font-weight-bold text-primary">Development Approach</h6>
    //       </div>
    //       <div class="card-body">
    //         <p>SB Admin 2 makes extensive use of Bootstrap 4 utility classes in order to reduce CSS bloat and poor page performance. Custom CSS classes are used to create custom components and custom utility classes.</p>
    //         <p class="mb-0">Before working with this theme, you should become familiar with the Bootstrap framework, especially the utility classes.</p>
    //       </div>
    //     </div>

    //   </div>
    // </div>`
}