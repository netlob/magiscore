class ViewController {
  constructor(element, lineChart, pieChart, lessonController) {
    this.element = element[0];
    this.lineChart = false;
    this.lineChart2 = false;
    this.pieChart = false;
    this.barChart = false;
    this.config = {};
    this.currentCourse = {}
    this.currentLesson = {}
    this.settingsOpen = false
  }

  render(lesson) {
    if (lesson == "general") {
      this.renderGeneral();
    } else {
      this.renderLesson(lesson);
    }
  }

  renderGeneral() {
    $("#lesson-wrapper").hide();
    $("#settings-wrapper").hide();
    $("#currentRender").html(`Gemiddeld`) // (${this.currentCourse.course.group.description})`);
    $("#currentRenderMobile").html(`Gemiddeld`) // (${this.currentCourse.course.group.description})`);
    if (!this.config.isDesktop) {
      $("#sidebarToggleTop").click();
    }
    $("#lineChart-container").empty().append(`<canvas id="lineChart""></canvas>`)
    $("#lineChart2-container").empty().append(`<canvas id="lineChart2""></canvas>`)
    $("#pieChart-container").empty().append(`<canvas id="pieChart""></canvas>`)
    $("#barChart-container").empty().append(`<canvas id="barChart""></canvas>`)
    // $("#general-area-title").text(
    //   `Alle cijfers van ${course.type.description}`
    // );
    setChartData(this.config, "general", true);
    setAverages()
    this.currentLesson = "general";
    this.initTheme();
    $('*[data-toggle="tooltip"]').tooltip()
    $("#general-wrapper").show();
    $(".vibrate").on("click", function () {
      navigator.vibrate(15)
    })
  }

  renderLesson(lesson) {
    // this.setConfig()
    var html = generateHTML(lesson);
    $("#lesson-wrapper")
      .empty()
      .html(html);
    $("#general-wrapper").hide();
    $("#settings-wrapper").hide();
    // $("#lesson-wrapper").show();
    $("#currentRender").html(lesson);
    $("#currentRenderMobile").html(lesson);
    if (!this.config.isDesktop) {
      $("#sidebarToggleTop").click();
    }
    setChartData(this.config, lesson);
    setTableData(lesson);
    this.currentLesson = lesson;
    this.initTheme();
    $('*[data-toggle="tooltip"]').tooltip()
    $("#lesson-wrapper").show();
    $(".vibrate").on("click", function () {
      navigator.vibrate(15)
    })
  }

  renderCourse(courseid, loader, course, lesson) {
    navigator.vibrate(15)
    if (loader) $("#overlay").show()
    if (!courseid && course) viewController.currentCourse = course
    else viewController.currentCourse = courseController.getCourse(courseid)
    if (lesson) main(lesson)
    else main()
    $("#years").children().removeClass("course-selected")
    $(`#course-${courseid}`).addClass("course-selected")
    $("#current-course-badge").text(this.currentCourse.course.group.description)
    setTimeout(function () {
      $("#overlay").hide()
    }, 100)
  }

  updateNav() {
    updateSidebar();
    this.setCourses();
    // this.setLatestGrades(courseController.latestGrades);
    // logConsole(courseController.allGrades)
  }

  downloadGraph() {
    var newCanvas = document.querySelector("#lineChart");
    var newCanvasImg = newCanvas.toDataURL("image/png", 1.0);
    var doc = new jsPDF("landscape");
    doc.setFontSize(20);
    doc.text(
      15,
      15,
      `${$("#userDropdown > span").text()} - ${$("#general-area-title").text()}`
    );
    doc.addImage(newCanvasImg, "PNG", 20, 20, 280, 150);
    doc.save(`${$("#general-area-title").text()}.pdf`);
  }

  updateConfig(config, theme) {
    var base = JSON.parse(localStorage.getItem("config"));
    for (var key in config) {
      // if (key == 'includeGradesInAverageChart' && base['includeGradesInAverageChart'] == true) config[key] == false
      base[key] = config[key];
    }
    localStorage.removeItem("config");
    localStorage.setItem("config", JSON.stringify(base));
    this.config = base;
    if (config['includeGradesInAverageChart']) this.render(this.currentLesson)
    if (config["exclude"]) main(this.currentLesson)
  }

  setConfig() {
    var config = localStorage.getItem("config") || false;
    if (!config) {
      config = {
        "isDesktop": false,
        "tention": 0.3,
        "passed": 5.5,
        "darkTheme": false,
        "includeGradesInAverageChart": false,
        "exclude": []
      }
      localStorage.setItem("config", JSON.stringify(config));
    }
    config = JSON.parse(config)
    config["isDesktop"] = $(window).width() > 600 ? true : false;
    this.config = config;
    logConsole(config.exclude.toString())
  }

  toast(msg, duration, fullWidth) {
    var snackId = Math.floor((Math.random() * 1000000) + 1)
    // var bottom = 30
    var bottom = $(".snackbar").length < 1 ? 30 : ($(".snackbar").length * 65) + 30
    $("body").append(`<div id="snackbar-${snackId}" class="snackbar${fullWidth ? " w-90" : ""}">${msg}</div>`);
    $(`#snackbar-${snackId}`).css("margin-left", -($(`#snackbar-${snackId}`).width() / 2 + 16))
    $(`#snackbar-${snackId}`).css("display", "block");
    $(`#snackbar-${snackId}`).animate({
        "bottom": `${bottom}px`
      },
      "slow"
    );
    if (duration) {
      setTimeout(function () {
        $(`#snackbar-${snackId}`).animate({
            "bottom": "-200px"
          },
          "slow",
          function () {
            $(`#snackbar-${snackId}`).remove();
          }
        );
      }, duration);
    }
  }

  removeToasts() {
    $(".snackbar").remove();
  }

  initTheme() {
    var theme = this.config.darkTheme
    if (theme) {
      $("body").attr("theme", "dark")
    } else {
      $("body").attr("theme", "light")
    }
  }

  toggleTheme() {
    var theme = this.config.darkTheme
    if (!theme) {
      $("body").attr("theme", "dark")
      this.updateConfig({
        "darkTheme": true,
        "isDesktop": this.config.isDesktop
      });
    } else {
      $("body").attr("theme", "light")
      this.updateConfig({
        "darkTheme": false,
        "isDesktop": this.config.isDesktop
      });
    }
  }

  lightTheme() {
    $("body").attr("theme", "light")
    this.updateConfig({
      "darkTheme": false,
      "isDesktop": this.config.isDesktop
    });
    this.toast("Thema veranderd naar licht", 2000, false)
    logConsole("Theme changed to light")
  }

  darkTheme() {
    $("body").attr("theme", "dark")
    this.updateConfig({
      "darkTheme": true,
      "isDesktop": this.config.isDesktop
    });
    this.toast("Thema veranderd naar donker", 2000, false)
    logConsole("Theme changed to dark")
  }

  savePassed(e) {
    this.updateConfig({
      "passed": e.valueAsNumber
    })
    this.toast("Voldoendegrens veranderd naar " + e.valueAsNumber, 2000, false)
    logConsole("Passed changed to " + e.valueAsNumber)
    // this.render(this.currentLesson)
  }

  setLatestGrades(grades) {
    grades.slice(0, 5)
    $('#latest-grades').find('*').not('#latest-grades-empty').remove();
    grades.forEach(grade => {
      var d = new Date(grade.ingevoerdOp)
      // var w = new Date().getDate() - 7;
      // if (d < w) {
      length++
      $("#latest-grades").append(`
          <a class="dropdown-item d-flex align-items-center vibrate" onclick="if(viewController.currentCourse.course == courseController.current()) { viewController.render('${grade.vak.omschrijving.capitalize()}') } else { viewController.renderCourse(viewController.currentCourse.course.id, true, false, '${grade.vak.omschrijving.capitalize()}') }">
            <div class="dropdown-list-image mr-3">
              <div class="rounded-circle">
                <h3 class="text-center mt-1">${grade.waarde == "10,0" ? '<span class="text-success">10</span>' : (round(grade.waarde) < this.config.passed) ? '<span class="text-danger">' + grade.waarde + '</span>' : grade.waarde}<sup style="font-size: 10px !important; position: absolute !important; line-height: 1.2 !important; top: 0px !important;">${grade.weegfactor}x</sup></h3>
              </div>
              <!-- <div class="status-indicator bg-success"></div> -->
            </div>
            <div class="ml-2">
              <span class="text-truncate font-weight-bold text-capitalize">${grade.vak.omschrijving}</span><span
                class="latest-grades-date">${d.getDate()}/${d.getMonth() + 1}</span>
              <div class="small text-gray-600">${grade.omschrijving}</div>
            </div>
          </a>
        `)
      // }
    })
    if (length == 0) $("#latest-grades-empty").show()
    else $("#latest-grades-empty").hide()
    $("#latest-grades-badge").text(length)
  }

  setCourses() {
    $("#years").empty()
    // logConsole(courseController.courses.length)
    courseController.courses.forEach(course => {
      var sexyDate = `${new Date(course.course.start).getFullYear().toString().substring(2)}/${new Date(course.course.end).getFullYear().toString().substring(2)}`
      // var sexyDate = course.raw.Start
      $("#years").append(`<a class="pt-3 pl-4 pb-3 pr-4 dropdown-item vibrate" onclick="viewController.renderCourse('${course.course.id}', true, false, false)" id="course-${course.course.id}">${sexyDate} - ${course.course.group.description} ${course.course.curricula.length > 0 ? "(" + course.course.curricula.toString() + ")" : ""}</a>`)
    })
    $("#years").children().removeClass("course-selected")
    $(`#course-${this.currentCourse.course.id}`).addClass("course-selected")
  }

  openSettings() {
    $("#general-wrapper").hide();
    $("#lesson-wrapper").hide();
    $("#currentRender").html('Instellingen');
    $("#currentRenderMobile").html('<i class="fa fa-arrow-left mr-3 vibrate" onclick="viewController.closeSettings()"></i>Instellingen');
    $("#settings-wrapper").show();
    this.settingsOpen = true
  }

  closeSettings() {
    this.render("general")
    this.settingsOpen = true
    // this.render(this.currentLesson.name)
  }
}

function updateSidebar() {
  if (lessonController.lessons.length > 0) {
    $("#subjectsNav").empty();
    lessonController.lessons.map(lesson =>
      $("#subjectsNav").append(`
        <li class="nav-item vibrate" id="${lesson.name}">
            <a class="nav-link" onclick="viewController.render('${
      lesson.name
      }')">
                <span>${lesson.name.capitalize()}</span>
            </a>
        </li>
    `)
    )
  } else {
    $("#subjectsNav").html(`
      <li class="text-center text-gray-500 mt-4">
            <span>Geen cijfers dit jaar...</span>
      </li>`)
  }

  // var profilepic = document.getElementById("imgelem");
  // profilepic.setAttribute("src", "./img/stock-profile-picture.png");
  var profilepicStorage = localStorage.getItem("profilepic") || false,
    profilepic = document.getElementById("imgelem");
  if (profilepicStorage) {
    logConsole("profile picture from localstorage");
    profilepic.setAttribute("src", profilepicStorage);
  } else {
    logConsole("profile picture from request");
    var xhr = new XMLHttpRequest(),
      blob,
      fileReader = new FileReader();
    xhr.responseType = "blob";
    // xhr.onreadystatechange = function (oEvent) {
    //   if (xhr.readyState === 4) {
    //     if (xhr.status === 200) {
    //       logConsole(xhr.responseText)
    //     } else {
    //       errorLog("Error", xhr.statusText);
    //     }
    //   }
    // };

    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        blob = new Blob([xhr.response], {
          type: "image/png"
        });
        fileReader.onload = function (evt) {
          var result = evt.target.result;
          // logConsole(result)
          profilepic.setAttribute("src", result);
          try {
            logConsole("[INFO] Storage of image succes");
            localStorage.setItem("profilepic", result);
          } catch (e) {
            errorConsole("[ERROR] Storage failed: " + e);
          }
        };
        fileReader.readAsDataURL(blob);
      }
    };
    logConsole(`https://${school}/api/personen/${person.id}/foto?width=640&height=640&crop=no`)
    logConsole(`Bearer ${tokens.access_token}`)
    xhr.open(
      "GET",
      `https://${school}/api/personen/${person.id}/foto?width=640&height=640&crop=no`,
      true
    );
    xhr.setRequestHeader("Authorization", `Bearer ${tokens.access_token}`);
    xhr.send();
  }
  $("#userDropdown > span").text(
    `${person.firstName} ${person.lastName} ${
    viewController.currentCourse.course.group.description ? "(" + viewController.currentCourse.course.group.description + ")" : ""
    }`
  );
  $("#mobilePersonInfo").text(
    `${person.firstName} ${person.lastName} ${
      viewController.currentCourse.course.group.description ? "(" + viewController.currentCourse.course.group.description + ")" : ""
    }`
  );
  var header = document.getElementById("accordionSidebar");
  var btns = header.getElementsByClassName("nav-item");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      $("body").removeClass("sidenav-open")
      if ($(window).width() <= 465) snapper.close()
      var current = $(".active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
  }
}

function setChartData(config, lesson, everything) {
  // this.lineChart.clear()
  this.lineChart = "";
  this.lineChart2 = "";
  this.pieChart = "";
  this.barChart = "";
  var data = [];
  var datums = [];
  var cijfers = [];
  var wegingen = [];
  var gemiddeldes = [];
  var afgerond = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var vol = 0;
  var onvol = 0;
  if (lesson == "general") {
    lessonController.lessons.forEach(lesson => {
      if (lesson.lesson.grades.length > 0) {
        lesson.lesson.grades.forEach(grade => {
          if (!grade.exclude) {
            var gradegrade = grade.grade.replace(",", ".");
            data.push({
              t: new Date(grade.dateFilledIn),
              y: gradegrade,
              a: grade.average,
              w: grade.weight
            });
            gradegrade = parseFloat(gradegrade.replace(",", "."));
            if (grade.passed) {
              vol++;
            } else {
              onvol++;
            }
          }
        });
      }
    })
  } else {
    lessonController.getLesson(lesson).lesson.grades.forEach(grade => {
      if (!grade.exclude) {
        var gradegrade = grade.grade.replace(",", ".");
        data.push({
          t: new Date(grade.dateFilledIn),
          y: gradegrade,
          a: grade.average,
          w: grade.weight
        });
        gradegrade = parseFloat(gradegrade.replace(",", "."));
        if (gradegrade >= 5.5) {
          vol++;
        } else {
          onvol++;
        }
      }
    });
  }

  data.sort(function (a, b) {
    return new Date(b.t) - new Date(a.t);
  });

  data.forEach(value => {
    //   datums.push(`${value.t.getMonth()+1}/${value.t.getFullYear().toString().substr(-2)}`)
    datums.push(toShortFormat(value.t));
    cijfers.push(value.y);
    gemiddeldes.push(Math.round(value.a.value * 100) / 100);
    wegingen.push(value.w);
    switch (Math.round(value.y)) {
      case 1:
        afgerond[0]++
        break;
      case 2:
        afgerond[1]++
        break;
      case 3:
        afgerond[2]++
        break;
      case 4:
        afgerond[3]++
        break;
      case 5:
        afgerond[4]++
        break;
      case 6:
        afgerond[5]++
        break;
      case 7:
        afgerond[6]++
        break;
      case 8:
        afgerond[7]++
        break;
      case 9:
        afgerond[8]++
        break;
      case 10:
        afgerond[9]++
        break;
    }
  });

  datums.reverse();
  cijfers.reverse();
  wegingen.reverse();
  gemiddeldes.reverse();

  if (cijfers.length == 1) datums.push(datums[0]), cijfers.push(cijfers[0]), gemiddeldes.push(gemiddeldes[0])

  // if (viewController.lineChart != false) viewController.lineChart.destroy();
  var ctx = document.getElementById("lineChart").getContext("2d");
  viewController.lineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: datums,
      // labels: ["Sep", "Okt", "Nov", "Dec", "Jan", "Feb", "Maa", "Apr", "Mei", "Jun", "Jul"],
      datasets: [{
          label: "Cijfer",
          lineTension: config.tention,
          backgroundColor: "rgba(0, 150, 219, 0.06)",
          borderColor: "rgba(38, 186, 255, 1)",
          pointRadius: 2,
          pointBackgroundColor: "rgba(0, 150, 219, 1)",
          pointBorderColor: "rgba(0, 150, 219, 1)",
          pointHoverRadius: 4,
          pointHoverBackgroundColor: "rgba(0, 150, 219, 1)",
          pointHoverBorderColor: "rgba(0, 150, 219, 1)",
          pointHitRadius: 30,
          pointBorderWidth: 2,
          borderWidth: config.isDesktop ? 3 : 1.5,
          data: cijfers,
          // pointRadius: 1
        } //,
        // {
        //   label: "Weging",
        //   lineTension: config.tention,
        //   backgroundColor: "rgba(0, 150, 219, 0)",
        //   borderColor: "rgba(38, 186, 255, 0)",
        //   pointRadius: 0,
        //   pointBackgroundColor: "rgba(0, 150, 219, 0)",
        //   pointBorderColor: "rgba(0, 150, 219, 0)",
        //   pointHoverRadius: 0,
        //   pointHoverBackgroundColor: "rgba(0, 150, 219, 0)",
        //   pointHoverBorderColor: "rgba(0, 150, 219, 0)",
        //   pointHitRadius: 0,
        //   pointBorderWidth: 0,
        //   borderWidth: 0,
        //   data: wegingen,
        //   pointRadius: 0
        // }
      ]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      layout: {
        padding: {
          //   left: 10,
          //   right: 25,
          //   top: 25,
          //   bottom: 0
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          time: {
            unit: "month",
            displayFormats: {
              quarter: "ll"
            }
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 4,
            autoSkip: true,
            maxRotation: 0,
            minRotation: 0
          },
          // type: 'time',
          distribution: "linear",
          display: config.isDesktop
        }],
        yAxes: [{
          ticks: {
            maxTicksLimit: 10,
            padding: 10,
            beginAtZero: false,
            steps: 1,
            max: 10,
            min: 1,
            display: config.isDesktop
          }
          // gridLines: {
          //     color: "rgb(234, 236, 244)",
          //     zeroLineColor: "rgb(234, 236, 244)",
          //     drawBorder: false,
          //     borderDash: [2],
          //     zeroLineBorderDash: [2]
          // }
        }]
      },
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: "#0096db",
        // bodyFontColor: "#858796",
        titleMarginBottom: 2,
        // titleFontColor: "#6e707e",
        titleFontSize: 12,
        bodyFontSize: 12,
        borderColor: "rgba(0, 150, 219, 1)",
        borderWidth: 1,
        xPadding: 8,
        yPadding: 8,
        displayColors: false,
        intersect: true,
        mode: "index",
        caretPadding: 4
      },
      annotation: {
        annotations: [{
          type: "line",
          mode: "horizontal",
          scaleID: "y-axis-0",
          value: config.passed,
          borderColor: "rgb(232, 100, 88)",
          borderWidth: 1,
          label: {
            enabled: false,
            content: "Onvoldoende"
          }
        }]
      }
    }
  });

  // if (viewController.pieChart != false) viewController.pieChart.destroy();
  var ctx = document.getElementById("pieChart");
  viewController.pieChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Voldoendes", "Onvoldoendes"],
      datasets: [{
        data: [vol, onvol],
        backgroundColor: ["rgba(0, 150, 219, 0.2)", "rgba(232, 100, 88, 0.2)"],
        hoverBackgroundColor: ["rgba(0, 150, 219, 0.4)", "rgba(232, 100, 88, 0.4)"],
        hoverBorderColor: ["#0096db", "#e86458"],
        borderColor: ["#0096db", "#e86458"], //config.darkTheme ? "#2c2d30" : "#fff"
      }]
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "rgba(0, 150, 219, 1)",
        titleMarginBottom: 2,
        titleFontSize: 12,
        bodyFontSize: 12,
        borderColor: "rgba(0, 150, 219, 1)",
        borderWidth: 1,
        xPadding: 8,
        yPadding: 8,
        displayColors: false,
        intersect: false,
        mode: "index",
        caretPadding: 4
      },
      legend: {
        display: false
      },
      cutoutPercentage: 80
    }
  });

  if (vol + onvol > 0) {
    var tot = vol + onvol;
    vol = round((vol / tot) * 100);
    onvol = round((onvol / tot) * 100);
    $("#percentageGrades").text(`${vol}% voldoende - ${onvol}% onvoldoende`);
  } else {
    $("#percentageGrades").text(`Geen cijfers voor dit vak...`);
  }

  // if (viewController.lineChart2 != false) viewController.lineChart2.update();
  if (lesson != "general") {
    var ctx = document.getElementById("lineChart2").getContext("2d");
    var data = [{
        label: "Gemiddelde",
        lineTension: config.tention,
        backgroundColor: "rgba(0, 150, 219, 0.06)",
        borderColor: "rgba(38, 186, 255, 1)",
        pointRadius: 2,
        pointBackgroundColor: "rgba(0, 150, 219, 1)",
        pointBorderColor: "rgba(0, 150, 219, 1)",
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "rgba(0, 150, 219, 1)",
        pointHoverBorderColor: "rgba(0, 150, 219, 1)",
        pointHitRadius: 30,
        pointBorderWidth: 2,
        borderWidth: config.isDesktop ? 3 : 1.5,
        data: gemiddeldes,
        // pointRadius: 1
      } //,
      // {
      //   label: "Weging",
      //   lineTension: config.tention,
      //   backgroundColor: "rgba(0, 150, 219, 0)",
      //   borderColor: "rgba(38, 186, 255, 0)",
      //   pointRadius: 0,
      //   pointBackgroundColor: "rgba(0, 150, 219, 0)",
      //   pointBorderColor: "rgba(0, 150, 219, 0)",
      //   pointHoverRadius: 0,
      //   pointHoverBackgroundColor: "rgba(0, 150, 219, 0)",
      //   pointHoverBorderColor: "rgba(0, 150, 219, 0)",
      //   pointHitRadius: 0,
      //   pointBorderWidth: 0,
      //   borderWidth: 0,
      //   data: wegingen,
      //   pointRadius: 0
      // }
    ]
    // if (config.includeGradesInAverageChart) {
    if (true) {
      data.push({
        label: "Cijfer",
        lineTension: config.tention,
        backgroundColor: "rgba(0, 219, 69, 0.06)",
        borderColor: "rgba(0, 252, 80, 1)",
        pointRadius: 2,
        pointBackgroundColor: "rgba(0, 219, 69, 1)",
        pointBorderColor: "rgba(0, 219, 69, 1)",
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "rgba(0, 219, 69, 1)",
        pointHoverBorderColor: "rgba(0, 219, 69, 1)",
        pointHitRadius: 30,
        pointBorderWidth: 2,
        borderWidth: config.isDesktop ? 3 : 1.5,
        data: cijfers,
        // pointRadius: 1
      })
    }
    viewController.lineChart2 = new Chart(ctx, {
      type: "line",
      data: {
        labels: datums,
        // labels: ["Sep", "Okt", "Nov", "Dec", "Jan", "Feb", "Maa", "Apr", "Mei", "Jun", "Jul"],
        datasets: data
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        layout: {
          padding: {
            //   left: 10,
            //   right: 25,
            //   top: 25,
            //   bottom: 0
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
        scales: {
          xAxes: [{
            time: {
              unit: "month",
              displayFormats: {
                quarter: "ll"
              }
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              maxTicksLimit: 4,
              autoSkip: true,
              maxRotation: 0,
              minRotation: 0
            },
            // type: 'time',
            distribution: "linear",
            display: config.isDesktop
          }],
          yAxes: [{
            ticks: {
              maxTicksLimit: 10,
              padding: 10,
              beginAtZero: false,
              steps: 1,
              max: 10,
              min: 1,
              display: config.isDesktop
            }
            // gridLines: {
            //     color: "rgb(234, 236, 244)",
            //     zeroLineColor: "rgb(234, 236, 244)",
            //     drawBorder: false,
            //     borderDash: [2],
            //     zeroLineBorderDash: [2]
            // }
          }]
        },
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontSize: 15,
            boxWidth: 50
          },
          // onClick: navigator.vibrate(15)
        },
        tooltips: {
          backgroundColor: "#0096db",
          // bodyFontColor: "#858796",
          titleMarginBottom: 2,
          // titleFontColor: "#6e707e",
          titleFontSize: 12,
          bodyFontSize: 12,
          borderColor: "rgba(0, 150, 219, 1)",
          borderWidth: 1,
          xPadding: 8,
          yPadding: 8,
          displayColors: false,
          intersect: true,
          mode: "index",
          caretPadding: 4
        },
        annotation: {
          annotations: [{
            type: "line",
            mode: "horizontal",
            scaleID: "y-axis-0",
            value: config.passed,
            borderColor: "rgb(232, 100, 88)",
            borderWidth: 1,
            label: {
              enabled: false,
              content: "Onvoldoende"
            }
          }]
        }
      }
    });
  }

  // $("#barChart-container").empty().append(`<canvas id="barChart""></canvas>`)
  viewController.barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      datasets: [{
        label: "Afgerond behaalde cijfers",
        data: afgerond,
        fill: false,
        backgroundColor: ["rgba(255,0,0,0.2)", "rgba(255,35,0,0.2)", "rgba(255,87,0,0.2)", "rgba(255,140,0,0.2)", "rgba(255,193,0,0.2)", "rgba(255,246,0,0.2)", "rgba(212,255,0,0.2)", "rgba(159,255,0,0.2)", "rgba(106,255,0,0.2)", "rgba(53,255,0,0.2)", "rgba(0,255,0,0.2)"],
        borderColor: ["rgba(255,0,0,1)", "rgba(255,35,0,1)", "rgba(255,87,0,1)", "rgba(255,140,0,1)", "rgba(255,193,0,1)", "rgba(255,246,0,1)", "rgba(212,255,0,1)", "rgba(159,255,0,1)", "rgba(106,255,0,1)", "rgba(53,255,0,1)", "rgba(0,255,0,1)"],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      maintainAspectRatio: false,
      responsive: true,
      layout: {
        padding: {
          //   left: 10,
          //   right: 25,
          //   top: 25,
          //   bottom: 0
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      },
      legend: {
        display: false,
      },
      tooltips: {
        backgroundColor: "#0096db",
        // bodyFontColor: "#858796",
        titleMarginBottom: 2,
        // titleFontColor: "#6e707e",
        titleFontSize: 12,
        bodyFontSize: 12,
        borderColor: "rgba(0, 150, 219, 1)",
        borderWidth: 1,
        xPadding: 8,
        yPadding: 8,
        displayColors: false,
        intersect: true,
        mode: "index",
        caretPadding: 4
      },
    }
  });
}

function setAllGrades() {

}

function toShortFormat(d) {
  d = new Date(d);
  var month_names = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dec"
  ];
  var day = d.getDate();
  var month_index = d.getMonth();
  var year = d.getFullYear();
  return "" + day + " " + month_names[month_index] + " " + year;
}

function setTableData(lesson) {
  var lesson = lessonController.getLesson(lesson).lesson
  var table = $("#cijfersTable");
  var grades = lesson.grades;
  grades.sort();
  if (grades.length == 0) {
    $("#dataTable").hide()
    $("#cijfersTableCard").append(`<h6 class="percentageGrades font-italic text-center">Geen cijfers voor dit vak...</h6>`)
    return
  }
  $("#dataTable").show()
  grades.forEach(grade => {
    table.append(`<tr>
                    <td>
                      <div class="md-checkbox vibrate" style="font-size:1rem">
                        <input id="${grade.id}" type="checkbox" onchange="lessonController.getLesson(viewController.currentLesson).lesson.exclude('${grade.id}', this)" ${(!grade.exclude) ? "checked" : ""}>
                        <label for="${grade.id}"></label>
                      </div>
                    </td>
                    <td>${grade.grade}</td>
                    <td>${grade.weight}x</td>
                    <td>${grade.description}</td>
                    <td>${grade.counts ? "Ja" : "Nee"}</td>
                    <td>${grade.passed ? "Ja" : "Nee"}</td>
                    <td>${grade.type.isPTA ? "Ja" : "Nee"}</td>
                    <td>${grade.atLaterDate ? "Ja" : "Nee"}</td>
                    <td>${grade.exemption ? "Ja" : "Nee"}</td>
                    <td>${grade.teacher.teacherCode}</td>
                    <td>${toShortFormat(grade.dateFilledIn)}</td>
                  </tr>`);
  });
  // $('#dataTable').DataTable();
}

function setAverages() {
  var totcompleted = 0,
    totcomclass = 0,
    totgem = 0,
    totgemclass = 0
  $('#general-progress').empty()
  $('#averagesTable').empty()
  lessonController.lessons.forEach(lesson => {
    var average = lesson.lesson.getAverage()
    if (parseFloat(average) > -1 && parseFloat(average) < 11) {
      $('#averagesTable').append(
        `<tr>
          <td>${lesson.name}</td>
          <td>${Math.round(average * 100) / 100}</td>
         </tr>`)
      totgem = totgem + parseFloat(average)
      totgemclass++
    }
  })
  var totgem = totgem / totgemclass
  $('#general-average').text(`${round(totgem) == "NaN" ? "Geen cijfers..." : round(totgem)}`)
}

function generateProgressHTML(lesson) {
  // var completed = lessonController.getLesson(lesson).lesson.getCompleted()
  // return `<div>
  //             <h4 class="small font-weight-bold">${lesson}<span class="float-right">${completed}%</span></h4>
  //             <div class="progress mb-4">
  //             <div class="progress-bar" role="progressbar" style="width: ${completed}%;" aria-valuenow="${completed}" aria-valuemin="0" aria-valuemax="100"></div>
  //             </div>
  //         </div>`
  return;
}

function generateHTML(lesson) {
  var extraFirst = lessonController.getLesson(lesson).lesson.getFirst();
  var average = lessonController.getLesson(lesson).lesson.getAverage(true);
  var extraSecond = lessonController.getLesson(lesson).lesson.getSecond();
  var extraThird = lessonController.getLesson(lesson).lesson.getThird();
  var facts = lessonController.getLesson(lesson).lesson.getDays()
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
                        <div class="text-xs font-weight-bold text-primary-blue text-uppercase mb-1">Gemiddeld cijfer</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">${average}</div>
                    </div>
                    <div class="col-auto">
                        <i class="fas fa-graduation-cap fa-2x text-gray-300"></i>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            <!-- <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-success shadow h-100 py-2">
                  <div class="card-body">
                      <div class="row no-gutters align-items-center">
                      <div class="col mr-2">
                          <div class="text-xs font-weight-bold text-success text-uppercase mb-1 text-green">${
      extraFirst.title
      }</div>
                          <div class="row no-gutters align-items-center">
                          <div class="col-auto">
                              <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">${
      extraFirst.value
      }</div>
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
                        <div class="text-xs font-weight-bold text-info text-uppercase mb-1">${
    extraSecond.title || "nee."
    }</div>
                        <div class="row no-gutters align-items-center">
                        <div class="col-auto">
                            <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">${
    extraSecond.value || "nee."
    }</div>
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

            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-warning shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">${
    extraThird.title || "nee."
    }</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">${
    extraThird.value || "nee."
    }</div>
                    </div>
                    <div class="col-auto">
                        <i class="fas fa-grin-beam-sweat fa-2x text-gray-300"></i>
                    </div>
                    </div>
                </div>
                </div>
            </div> -->
            </div>

            <div class="row">
              <div class="col-xl-8 col-lg-7">
                  <div class="card shadow mb-4">
                  <!-- Card Header - Dropdown -->
                  <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <h6 class="m-0 font-weight-bold text-primary">Gemiddelde van ${lesson}</h6>
                      <!--<div class="dropdown no-arrow">
                        <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-label="Uitschuiven" aria-haspopup="true" aria-expanded="false">
                            <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                            <div class="dropdown-header">Grafiek instellingen:</div>
                            <a class="dropdown-item" href="#" onclick="viewController.updateConfig({'includeGradesInAverageChart': true})">Laat bijbehorende cijfers zien</a>
                        </div>
                      </div>-->
                  </div>
                  <!-- Card Body -->
                  <div class="card-body chart-card">
                      <div class="chart-area chart-container lineChart2-container">
                        <canvas id="lineChart2"></canvas>
                      </div>
                  </div>
                  </div>
              </div>

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
                                    <input type="number" class="form-control form-control-user" id="newGrade-weight" min="0" placeholder="Weging">
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
                                    <input type="number" class="form-control form-control-user" id="getGrade-weight" min="0" placeholder="Weging">
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

            <div class="col-xl-8 col-lg-7">
                <div class="card shadow mb-4">
                <!-- Card Header - Dropdown -->
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">Cijfers voor ${lesson}</h6>
                </div>
                <!-- Card Body -->
                <div class="card-body chart-card">
                    <div class="chart-area chart-container lineChart-container">
                      <canvas id="lineChart"></canvas>
                    </div>
                </div>
                </div>
            </div>

              <div class="col-xl-4 col-lg-5">
                  <div class="card shadow mb-4">
                  <!-- Card Header - Dropdown -->
                  <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <h6 class="m-0 font-weight-bold text-primary">Voldoendes / onvoldoendes</h6>
                      <!--<div class="dropdown no-arrow">
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
                      </div> -->
                  </div>
                  <!-- Card Body -->
                  <div class="card-body">
                      <h6 id="percentageGrades"></h6>
                      <div class="chart-pie chart-container pt-4 pb-2 pieChart-container">
                        <canvas id="pieChart"></canvas>
                      </div>
                      <div class="text-center small">
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

              <div class="col-xl-4 col-lg-5">
                  <div class="card shadow mb-4">
                  <!-- Card Header - Dropdown -->
                  <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <h6 class="m-0 font-weight-bold text-primary">Afgerond behaalde cijfers</h6>
                      <!--<div class="dropdown no-arrow">
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
                      </div> -->
                  </div>
                  <!-- Card Body -->
                  <div class="card-body">
                      <div class="chart-bar chart-container pt-4 pb-2 barChart-container">
                      <canvas id="barChart"></canvas>
                      </div>
                  </div>
                  </div>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-4">
                <div class="card shadow mb-4">
                  <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Feiten voor ${lesson}</h6>
                  </div>
                  <div class="card-body">
                  ${JSON.stringify(facts)}
                  </div>
                </div>
              </div>

              <div class="col-xl-8">
                <!-- DataTales Example -->
                <div class="card shadow mb-4">
                    <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Cijfers voor ${lesson}</h6>
                    </div>
                    <div class="card-body">
                    <div class="table-responsive" id="cijfersTableCard">
                        <table class="table" id="dataTable" width="100%" cellspacing="0" data-snap-ignore="true">
                        <thead class="text-primary">
                            <tr>
                            <th></th>
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
                            <th>Tel mee</th>
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
              </div>
            </div>`;

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

// function generateSettingsHTML() {
//   return `
//   <div class="row">
//     <div class="col-xl-8 col-lg-7">
//         <div class="card shadow mb-4">
//           <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
//               <h6 class="m-0 font-weight-bold text-primary">Instellingen</h6>
//           </div>
//           <div class="card-body">
//           </div>
//         </div>
//     </div>

//   </div>`
// }