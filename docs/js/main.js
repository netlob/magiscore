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
                <div class="h5 mb-0 font-weight-bold text-gray-800">${getAverage(vakName)}</div>
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
                <div class="text-xs font-weight-bold text-info text-uppercase mb-1">% Voltooid</div>
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
                    Nieuw Cijfer Bereken
                    <form class="newGrade">
                        <div class="form-group">
                            <input type="text" class="form-control form-control-user" id="newGrade-grade" aria-describedby="emailHelp" placeholder="Nieuw cijfer">
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control form-control-user" id="newGrade-weight" placeholder="Weging">
                        </div>
                        <div id="newGrade-newGrade" class="showCalculatedGrade">

                        </div>
                    <a onclick="document.getElementById('newGrade-newGrade').innerText = Math.round(getNewAverage('${vakName}', parseInt(document.getElementById('newGrade-grade').value), parseInt(document.getElementById('newGrade-weight').value)) * 100) / 100" class="btn btn-primary btn-user btn-block bg-gradiant-primary">Bereken</a>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-lg-6 mb-4">
            <div class="card text-gray-800 shadow">
                <div class="card-body">
                    Wat moet ik halen
                    <form class="newGrade">
                        <div class="form-group">
                            <input type="text" class="form-control form-control-user" id="newGrade-grade" aria-describedby="emailHelp" placeholder="Ik wil staan">
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control form-control-user" id="newGrade-weight" placeholder="Weging">
                        </div>
                        <div id="newGrade-newGrade">

                        </div>
                    <a onclick="document.getElementById('newGrade-newGrade').innerText = Math.round(getNewAverage('${vakName}', parseInt(document.getElementById('newGrade-grade').value), parseInt(document.getElementById('newGrade-weight').value)) * 100) / 100" class="btn btn-primary btn-user btn-block bg-gradiant-primary">Bereken</a>
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
            <div class="chart-area">
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
            <h6 class="m-0 font-weight-bold text-primary">Revenue Sources</h6>
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
            <div class="chart-pie pt-4 pb-2">
              <canvas id="myPieChart"></canvas>
            </div>
            <div class="mt-4 text-center small">
              <span class="mr-2">
                <i class="fas fa-circle text-primary"></i> Direct
              </span>
              <span class="mr-2">
                <i class="fas fa-circle text-success"></i> Social
              </span>
              <span class="mr-2">
                <i class="fas fa-circle text-info"></i> Referral
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Row -->
    <div class="row">

      <!-- Content Column -->
      <div class="col-lg-6 mb-4">

        <!-- Project Card Example -->
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Projects</h6>
          </div>
          <div class="card-body">
            <h4 class="small font-weight-bold">Server Migration <span class="float-right">20%</span></h4>
            <div class="progress mb-4">
              <div class="progress-bar bg-danger" role="progressbar" style="width: 20%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <h4 class="small font-weight-bold">Sales Tracking <span class="float-right">40%</span></h4>
            <div class="progress mb-4">
              <div class="progress-bar bg-warning" role="progressbar" style="width: 40%" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <h4 class="small font-weight-bold">Customer Database <span class="float-right">60%</span></h4>
            <div class="progress mb-4">
              <div class="progress-bar" role="progressbar" style="width: 60%" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <h4 class="small font-weight-bold">Payout Details <span class="float-right">80%</span></h4>
            <div class="progress mb-4">
              <div class="progress-bar bg-info" role="progressbar" style="width: 80%" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <h4 class="small font-weight-bold">Account Setup <span class="float-right">Complete!</span></h4>
            <div class="progress">
              <div class="progress-bar bg-success" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        </div>

        <!-- Color System -->
        <div class="row">
          <div class="col-lg-6 mb-4">
            <div class="card bg-primary text-white shadow">
              <div class="card-body">
                Primary
                <div class="text-white-50 small">#4e73df</div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 mb-4">
            <div class="card bg-success text-white shadow">
              <div class="card-body">
                Success
                <div class="text-white-50 small">#1cc88a</div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 mb-4">
            <div class="card bg-info text-white shadow">
              <div class="card-body">
                Info
                <div class="text-white-50 small">#36b9cc</div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 mb-4">
            <div class="card bg-warning text-white shadow">
              <div class="card-body">
                Warning
                <div class="text-white-50 small">#f6c23e</div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 mb-4">
            <div class="card bg-danger text-white shadow">
              <div class="card-body">
                Danger
                <div class="text-white-50 small">#e74a3b</div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 mb-4">
            <div class="card bg-secondary text-white shadow">
              <div class="card-body">
                Secondary
                <div class="text-white-50 small">#858796</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="col-lg-6 mb-4">

        <!-- Illustrations -->
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Illustrations</h6>
          </div>
          <div class="card-body">
            <div class="text-center">
              <img class="img-fluid px-3 px-sm-4 mt-3 mb-4" style="width: 25rem;" src="img/undraw_posting_photo.svg" alt="">
            </div>
            <p>Add some quality, svg illustrations to your project courtesy of <a target="_blank" rel="nofollow" href="https://undraw.co/">unDraw</a>, a constantly updated collection of beautiful svg images that you can use completely free and without attribution!</p>
            <a target="_blank" rel="nofollow" href="https://undraw.co/">Browse Illustrations on unDraw &rarr;</a>
          </div>
        </div>

        <!-- Approach -->
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Development Approach</h6>
          </div>
          <div class="card-body">
            <p>SB Admin 2 makes extensive use of Bootstrap 4 utility classes in order to reduce CSS bloat and poor page performance. Custom CSS classes are used to create custom components and custom utility classes.</p>
            <p class="mb-0">Before working with this theme, you should become familiar with the Bootstrap framework, especially the utility classes.</p>
          </div>
        </div>

      </div>
    </div>`
}

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

function setupLogin() {
    var grades = localStorage.getItem("grades");
    if (grades && person) {
        grades = JSON.parse(grades)

        grades.forEach(grade => {
            var vak = grade.class.description.capitalize()
            if (sorted[vak] == null) {
                sorted[vak] = []
            }
            if (sorted[vak][grade.type.header] == null) {
                sorted[vak][grade.type.header] = []
            }
            sorted[vak][grade.type.header].push(grade)
        })

        updateNav()
    } else {
        window.location.href = '/login/'
    }
}

function showClass(vak) {
    if (vak == 'general') {
        document.getElementById('General').style.display = 'block';
        document.getElementById('subjectSpecific').style.display = 'none';
        setChartData("", true)

    } else {
        var subjectDiv = document.getElementById('subjectSpecific')
        while (subjectDiv.firstChild) {
            subjectDiv.removeChild(subjectDiv.firstChild)
        }
        subjectDiv.insertAdjacentHTML('beforeend', generateHTML(vak))
        document.getElementById('General').style.display = 'none';
        document.getElementById('subjectSpecific').style.display = 'block';
        setChartData(vak)
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

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob'; //so you can access the response like a normal URL
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            var img = document.querySelector('#userDropdown > img')
            img.src = URL.createObjectURL(xhr.response); //create <img> with src set to the blob
        }
    };
    xhr.open('GET', `https://cors-anywhere.herokuapp.com/${school.url}/api/personen/${person.id}/foto?width=640&height=640&crop=no`, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send();

    document.querySelector('#userDropdown > span').innerHTML = `${person.firstName} ${person.lastName}`
}

function getAverage(vak) {
    if (sorted[vak]['Gem. cijfer']) {
        return sorted[vak]['Gem. cijfer'][0]['grade']
    } else {
        return "Niet beschikbaar"
    }
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
        return "Niet beschikbaar"
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
    if (getAverage(vak) == 'Niet beschikbaar') {
        return 'Niet mogelijk voor dit vak';
    }
    var newCijfer
    var processed = 0;
    var currentAverage = 0;
    var currentWeight = 0;
    sorted[vak]['REP'].forEach(_grade => {
        processed++
        currentWeight += _grade.weight
        currentAverage += _grade.weight * parseInt(_grade.grade, 10)
        if (processed == sorted[vak]['REP'].length) {
            currentAverage += grade * weight
            currentWeight += weight
            newCijfer = currentAverage / currentWeight
        }
    })
    console.log(newCijfer)
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
    var cijfers = []
    var datums = []

    if(everything) {
        for(var classcourse in sorted) {
            for(var gradearray in sorted[classcourse]) {
                if(gradearray == "REP") {
                    for(var grade in sorted[classcourse][gradearray]) {
                        var gradegrade = sorted[classcourse][gradearray][grade].grade.replace(',', '.')
                        cijfers.push(gradegrade)
                        var date = new Date(sorted[classcourse][gradearray][grade].dateFilledIn)
                        datums.push(date.toShortFormat())
                    }
                }
            }
        }
    } else {
        for(var gradearray in sorted[vak]) {
            if(gradearray == "REP") {
                for(var grade in sorted[vak][gradearray]) {
                    var gradegrade = sorted[vak][gradearray][grade].grade.replace(',', '.')
                    cijfers.push(gradegrade)
                    var date = new Date(sorted[vak][gradearray][grade].dateFilledIn)
                    datums.push(date.toShortFormat())
                }
            }
        }
    }

    var ctx = document.getElementById('myAreaChart').getContext('2d');
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Sep", "Okt", "Nov", "Dec", "Jan", "Feb", "Maa", "Apr", "Mei", "Jun", "Jul"],
            datasets: [{
                label: "Cijfer",
                lineTension: 0.3,
                backgroundColor: "rgba(21, 106, 54, 0.05)",
                borderColor: "rgba(32, 163, 83, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(21, 106, 54, 1)",
                pointBorderColor: "rgba(21, 106, 54, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: cijfers,
            }],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: 'date'
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        maxTicksLimit: 7
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
            }
        }
    });

}