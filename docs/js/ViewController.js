class ViewController {
    constructor(element, lineChart, pieChart, lessenControler) {
        this.element = element[0];
        this.lineChart = lineChart;
        this.pieChart = pieChart;
    }

    render(lesson) {
        if(lesson == 'general') { 
            this.renderGeneral()
        } else {
            this.renderLesson(lesson)
        }
    }

    renderGeneral() {
        $('#general-wrapper').show();
        $('#lesson-wrapper').hide()
        $('#currentRender').text('Gemiddeld')
        $('#currentRenderMobile').text('Gemiddeld')
        if(!config.isDesktop) { $('#sidebarToggleTop').click() }
        $('#general-area-title').text(`Alle cijfers van ${course.type.description}`)
        setChartData(null, true)
        setCompleted()
    }

    renderLesson(lesson) {
        var html = generateHTML(lesson)
        $('#lesson-wrapper').empty().html(html)
        $('#general-wrapper').hide();
        $('#lesson-wrapper').show()
        $('#currentRender').text(lesson)
        $('#currentRenderMobile').text(lesson)
        if(!config.isDesktop) {
          $('#sidebarToggleTop').click()
        }
        setChartData(lesson)
        setTableData(lesson)
    }

    updateNav() {
        updateSidebar()
    }

    downloadGraph() {
        var newCanvas = document.querySelector('#lineChart');
        var newCanvasImg = newCanvas.toDataURL("image/png", 1.0);
        var doc = new jsPDF('landscape');
        doc.setFontSize(20);
        doc.text(15, 15, `${$('#userDropdown > span').text()} - ${$('#general-area-title').text()}`);
        doc.addImage(newCanvasImg, 'PNG', 20, 20, 280, 150 );
        doc.save(`${$('#general-area-title').text()}.pdf`);
    }
}

function updateSidebar() {
    var vakken = Object.keys(sorted)
    vakken.forEach(vak => {
        var HTML = `<li class="nav-item">
                        <a class="nav-link" onclick="viewController.render('${vak}')">
                            <span>${vak.capitalize()}</span>
                        </a>
                    </li>`
        document.getElementById('subjectsNav').insertAdjacentHTML('beforeend', HTML)
    })
  
    var profilepicStorage = localStorage.getItem("profilepic"),
    profilepic = document.getElementById("imgelem");
    if (profilepicStorage) {
        console.info('[INFO] Using saved pic')
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
                  console.error("[ERROR] Storage failed: " + e);
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
    document.querySelector('#userDropdown > span').innerHTML = `${person.firstName} ${person.lastName} ${course.group.description?'('+course.group.description+')':''}`
    document.querySelector('#mobilePersonInfo').innerHTML = `${person.firstName} ${person.lastName} ${course.group.description?'('+course.group.description+')':''}`
    var header = document.getElementById("accordionSidebar");
    var btns = header.getElementsByClassName("nav-item");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function() {
        // console.dir(this)
        var current = $('.active');
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
      });
    }
}

function setChartData(lesson, everything) {
    this.lineChart = ''
    // lineChart.destroy();
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
                        if(sorted[classcourse][gradearray][grade].passed) { vol++ } else { onvol++ }
                    }
                }
            }
        }
    } else {
        for(var gradearray in sorted[lesson]) {
            if(gradearray == "Grades") {
                for(var grade in sorted[lesson][gradearray]) {
                    var gradegrade = sorted[lesson][gradearray][grade].grade.replace(',', '.')
                    data.push({
                      t: new Date(sorted[lesson][gradearray][grade].dateFilledIn),
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
    //   datums.push(`${value.t.getMonth()+1}/${value.t.getFullYear().toString().substr(-2)}`)
        datums.push(value.t.toShortFormat())
        cijfers.push(value.y)
    })

    datums.reverse()
    cijfers.reverse()

    var ctx = document.getElementById('lineChart').getContext('2d');
    this.lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: datums,
            // labels: ["Sep", "Okt", "Nov", "Dec", "Jan", "Feb", "Maa", "Apr", "Mei", "Jun", "Jul"],
            datasets: [{
                label: "Cijfer",
                lineTension: 0.3,
                backgroundColor: "rgba(0, 150, 219, 0.05)",
                borderColor: "rgba(38, 186, 255, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(0, 150, 219, 1)",
                pointBorderColor: "rgba(0, 150, 219, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(0, 150, 219, 1)", // rgba(38, 186, 255, 1)
                pointHoverBorderColor: "rgba(0, 150, 219, 1)", // rgba(38, 186, 255, 1)
                pointHitRadius: 10,
                pointBorderWidth: 2,
                borderWidth: config.isDesktop?3:2,
                data: cijfers,
                pointRadius: 0,
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
                    unit: 'month',
                    displayFormats: {
                      quarter: 'll'
                    }
                  },
                  gridLines: {
                    display: true,
                    drawBorder: true
                  },
                  ticks: {
                    maxTicksLimit: 4,
                    autoSkip: true,
                    maxRotation: 0,
                    minRotation: 0
                  },
                  // type: 'time',
                  distribution: 'linear',
                  display: config.isDesktop
                }],
                yAxes: [{
                  ticks: {
                    maxTicksLimit: 10,
                    padding: 10,
                    beginAtZero: false,
                    steps: 10,
                    max: 10,
                    min: 1,
                    display: config.isDesktop
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
                borderColor: 'rgb(232, 100, 88)',
                borderWidth: 2,
                label: {
                  enabled: false,
                  content: 'Onvoldoende'
                }
              }]
            },
        }
    });

    var ctx = document.getElementById("pieChart");
    this.pieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["Voldoendes", "Onvoldoendes"],
        datasets: [{
          data: [vol, onvol],
          backgroundColor: ['#0096db', '#e86458'],
          hoverBackgroundColor: ['#0096db', '#e86458'],
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
      $('#percentageGrades').text(`Geen cijfers voor dit lesson...`)
    }
}

function setTableData(lesson) {
  var table = $('#cijfersTable')
  var grades = sorted[lesson]["Grades"]
  grades.reverse()
  grades.forEach(grade => {
    table.append(`<tr>
                    <td>${grade.grade}</td>
                    <td>${grade.weight}x</td>
                    <td>${grade.description}</td>
                    <td>${grade.counts?'Ja':'Nee'}</td>
                    <td>${grade.passed?'Ja':'Nee'}</td>
                    <td>${grade.type.isPTA?'Ja':'Nee'}</td>
                    <td>${grade.atLaterDate?'Ja':'Nee'}</td>
                    <td>${grade.exemption?'Ja':'Nee'}</td>
                    <td>${grade.teacher.teacherCode}</td>
                    <td>${new Date(grade.dateFilledIn.toShortFormat())}</td>
                  </tr>`)
  })
  // $('#dataTable').DataTable();
}

function setCompleted() {
    var totcompleted = 0,
        totcomclass = 0,
        totgem = 0,
        totgemclass = 0
    $('#general-progress').empty()
    $('#averagesTable').empty()
    for(var lesson in sorted) {
        var completed = lessonController.getLesson(lesson).lesson.getCompleted()
        var average = lessonController.getLesson(lesson).lesson.getAverage()
        if(completed > 0) {
            var html = generateProgressHTML(lesson)
            $('#general-progress').append(html)
        }
        if(completed > -1 && completed < 101) {
            totcompleted = totcompleted + parseFloat(completed)
            totcomclass++
        }
        if(parseFloat(average) > -1 && parseFloat(average) < 11) {
            $('#averagesTable').append(
            `<tr>
                <td>${lesson}</td>
                <td>${average}</td>
            </tr>`)
            totgem = totgem + parseFloat(average)
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

function generateProgressHTML(lesson) {
    var completed = lessonController.getLesson(lesson).lesson.getCompleted()
    return `<div>
                <h4 class="small font-weight-bold">${lesson}<span class="float-right">${completed}%</span></h4>
                <div class="progress mb-4">
                <div class="progress-bar" role="progressbar" style="width: ${completed}%;" aria-valuenow="${completed}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>`
}

function generateHTML(lesson) {
    var completed = lessonController.getLesson(lesson).lesson.getCompleted()
    var average = lessonController.getLesson(lesson).lesson.getAverage(true)
    var progress = lessonController.getLesson(lesson).lesson.getProgress()
    var effort = lessonController.getLesson(lesson).lesson.getEffort()
    return `<!-- Page Heading -->
            <!-- <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800">${lesson.capitalize()}</h1>
            </div> -->
            <!-- Content Row -->
            <div class="row">
            <!-- Earnings (Monthly) Card Example -->
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Gemiddeld cijfer</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">${average}</div>
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
                            <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">${completed}%</div>
                        </div>
                        <div class="col">
                            <div class="progress progress-sm mr-2">
                            <div class="progress-bar bg-info" role="progressbar" style="width: ${completed}%" aria-valuenow="${completed}" aria-valuemin="0" aria-valuemax="100"></div>
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
                            <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">${progress}</div>
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
                        <div class="h5 mb-0 font-weight-bold text-gray-800">${effort}</div>
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
                            <div class="newGrade-wrapper">
                            <form class="newGrade">
                                <p></p>
                                <div class="form-group">
                                    <input type="number" class="form-control form-control-user" id="newGrade-grade" min="1" max="10" placeholder="Nieuw cijfer">
                                </div>
                                <div class="form-group">
                                    <input type="number" class="form-control form-control-user" id="newGrade-weight" placeholder="Weging">
                                </div>
                            <a onclick="lessonController.getLesson('${lesson}').lesson.getNewAverage()" class="btn btn-primary btn-user btn-block bg-gradiant-primary">Bereken</a>
                            </form>
                            <div class="showCalculatedGrade">
                                <h1 id="newGrade-newGrade"><i class="fas fa-chart-line fa-sm text-primary"></i></h1>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 mb-4">
                    <div class="card text-gray-800 shadow">
                        <div class="card-body">
                            Wat moet ik halen?
                            <div class="newGrade-wrapper">
                            <form class="getGrade">
                                <p></p>
                                <div class="form-group">
                                    <input type="number" class="form-control form-control-user" id="getGrade-grade" min="1" max="10" placeholder="Ik wil staan">
                                </div>
                                <div class="form-group">
                                    <input type="number" class="form-control form-control-user" id="getGrade-weight" placeholder="Weging">
                                </div>
                                <a onclick="lessonController.getLesson('${lesson}').lesson.needToGet()" class="btn btn-primary btn-user btn-block bg-gradiant-primary">Bereken</a>
                            </form>
                            <div class="showCalculatedGrade">
                            <h1 id="getGrade-newGrade"><i class="fas fa-chart-line fa-sm text-primary"></i></h1>
                            </div>
                        </div>
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
                    <h6 class="m-0 font-weight-bold text-primary">Cijfers voor ${lesson}</h6>
                    <div class="dropdown no-arrow">
                    <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-label="Uitschuiven" aria-haspopup="true" aria-expanded="false">
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
                <div class="card-body chart-card">
                    <div class="chart-area chart-container">
                    <canvas id="lineChart"></canvas>
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
                    <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-label="Download grafiek" aria-haspopup="true" aria-expanded="false">
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
                    <canvas id="pieChart"></canvas>
                    </div>
                    <div class="mt-4 text-center small">
                    <span class="mr-2">
                        <i class="fas fa-circle" style="color: #0096db"></i> Voldoendes
                    </span>
                    <span class="mr-2">
                        <i class="fas fa-circle" style="color: #e86458"></i> Onvoldoendes
                    </span>
                    </div>
                </div>
                </div>
            </div>

            <!-- DataTales Example -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Cijfers voor ${lesson}</h6>
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
                        <th>Is PTA</th>
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
                        <th>Is PTA</th>
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