class Lesson {
  constructor(name, data, grades, lessoncontroller, course) {
    // if (!grade.exclude) alert(JSON.stringify(grade))
    // alert(grades.find(x => (x.exclude == true)))
    this.grades = _.sortBy(grades, "dateFilledIn");
    this.average = this.getAverage(true, -1);
    this.grades = this.fillGradeAverages();
    this.name = name;
    this.data = data;
    this.controller = lessoncontroller;
    this.extraFirst = undefined;
    this.extraSecond = undefined;
    this.extraThird = undefined;
    this.course = course;
    this.lastYearAverage = undefined;
    this.currentYearAverage = undefined;
    this.lastYearGroup = undefined;
  }

  render() { }

  getFirst() {
    var keys = Object.keys(this.data);
    keys = keys.remove("Grades");
    if (keys.length > 0 && this.data[keys[0]]) {
      var res = this.data[keys[0]][this.data[keys[0]].length - 1];
      if (res == undefined) {
        return {
          title: "nee.",
          value: "nee."
        };
      }
      this.extraFirst = keys[0];
      return {
        title: res["type"]["description"],
        value: [isNaN(res["grade"])] ? res["grade"] : round(res["grade"])
      };
    }
  }

  getSecond() {
    var keys = Object.keys(this.data);
    keys = keys.remove("Grades");
    if (keys.length > 0 && this.data[keys[1]]) {
      var res = this.data[keys[1]][this.data[keys[1]].length - 1];
      if (res == undefined) {
        return {
          title: "nee.",
          value: "nee."
        };
      }
      this.extraSecond = keys[1];
      return {
        title: res["type"]["description"],
        value: [isNaN(res["grade"])] ? res["grade"] : round(res["grade"])
      };
    }
  }

  getThird() {
    var keys = Object.keys(this.data);
    keys = keys.remove("Grades");
    if (keys.length > 1 && this.data[keys[2]]) {
      var res = this.data[keys[2]][this.data[keys[2]].length - 1];
      if (res == undefined) {
        return {
          title: "nee.",
          value: "nee."
        };
      }
      this.extraSecond = keys[2];
      return {
        title: res["type"]["description"],
        value: [isNaN(res["grade"])] ? res["grade"] : round(res["grade"])
      };
    }
  }

  getCompleted() {
    return "-";
  }

  // getProgress() {
  //   if (this.data['Vordering']) {
  //     return this.data['Vordering'][0]['grade']
  //   } else {
  //     return 0
  //   }
  // }

  // getEffort() {
  //   if (this.data['Inzet']) {
  //     return this.data['Inzet'][0]['grade']
  //   } else {
  //     return "-"
  //   }
  // }

  getAverage(rounded, ignore) {
    if (this.grades) {
      if (this.grades.length > 0) {
        var average = 0;
        var all = this.grades;
        var grades = [];
        var processed = 0;
        if (ignore > 0) all = all.slice(0, ignore);
        all.forEach(_grade => {
          // console.log(_grade.type.isPTA)
          if (
            Number(round(_grade.grade)) > 0 &&
            Number(round(_grade.grade)) < 10.1
          ) {
            // console.dir(_grade)
            processed++;
            if (!_grade.exclude) {
              for (let i = 0; i < _grade.weight; i++) {
                grades.push(Number(round(_grade.grade)));
              }
              if (processed == all.length) {
                var averageTotal = 0;
                for (let i = 0; i < grades.length; i++) {
                  averageTotal += grades[i];
                }
                average = averageTotal / grades.filter(grade => !grade.exclude).length;
              }
            }
          }
        });
        if (rounded) {
          return round(average);
        } else {
          return average;
        }
      } else {
        return "-";
      }
    }
  }

  getAverageOnDate(date) {
    var gradesFilledIn = [];
    var total = 0;
    var overallWeight = 0;
    // alert(this.grades)
    this.grades.forEach(grade => {
      // if (grade == undefined) alert(grade)
      if (!grade.exclude) {
        // logConsole("Date grade: " + grade.dateFilledIn)
        // logConsole("Date input: " + date)
        // logConsole("Has been: " + (Number(date.getTime()) <= Number(date.getTime())).toString())

        if (Number(Date.parse(grade.dateFilledIn)) <= Number(date.getTime())) {
          gradesFilledIn.push(grade);
        }
      }
    });

    gradesFilledIn.forEach(grade => {
      // console.log(_grade.type.isPTA)
      if (Number(round(grade.grade)) > 0 && Number(round(grade.grade)) < 10.1) {
        // console.dir(_grade)
        if (!grade.exclude) {
          total += Number(round(grade.grade)) * parseFloat(grade.weight);
          overallWeight += parseFloat(grade.weight);
        }
      }
    });
    var average = total / overallWeight;
    return round(average);
  }

  averageLastYearFact() {
    var index = courses.findIndex(c => this.course.id == c.id);
    if (index == courses.length - 1) {
      var currentCourseSorted = this.course.sortGrades();
      var yearEarlierCourse = courses[index - 1];
      var yearEarlierCourseInstance = Course.create();
      Object.keys(yearEarlierCourse).forEach(key => {
        yearEarlierCourseInstance[key] = yearEarlierCourse[key];
      });
      var yearEarlierCourseSorted = yearEarlierCourseInstance.sortGrades();
      //currentCourseVakken = Object.keys(currentCourseSorted)
      var yearEarlierVakken = Object.keys(yearEarlierCourseSorted);

      if (yearEarlierVakken.includes(this.name)) {
        var currentDate = new Date();
        var courseLastYearDate = new Date(yearEarlierCourse.start);
        currentDate.setFullYear(currentDate.getFullYear() - 1);
        var dateLastYear = currentDate;
        var yearEarlierVak = yearEarlierCourseSorted[this.name]["Lesson"];
        var yearEarlierAverage = yearEarlierVak.getAverageOnDate(dateLastYear);
        return yearEarlierAverage;
      }
    }
  }
  compareYearBeforeAverageFact() {
    var index = courses.findIndex(c => this.course.id == c.id);
    if (index > 0) {
      var currentCourseSorted = this.course.sortGrades();
      var yearEarlierCourse = courses[index - 1];
      var yearEarlierCourseInstance = Course.create();
      Object.keys(yearEarlierCourse).forEach(key => {
        yearEarlierCourseInstance[key] = yearEarlierCourse[key];
      });
      var yearEarlierCourseSorted = yearEarlierCourseInstance.sortGrades();
      //currentCourseVakken = Object.keys(currentCourseSorted)
      var yearEarlierVakken = Object.keys(yearEarlierCourseSorted);

      if (yearEarlierVakken.includes(this.name)) {
        var yearEarlierLesson = yearEarlierCourseSorted[this.name]["Lesson"];
        var lastYearAverage = yearEarlierLesson.getAverageOnDate(new Date()); //yearEarlierLesson.average
        var currentYearAverage = this.getAverageOnDate(new Date()); //this.average
        // logConsole(this.name + " lastYearAverage: " + lastYearAverage)
        // logConsole(this.name + " currentYearAverage: " + currentYearAverage)
        this.lastYearAverage = lastYearAverage;
        this.currentYearAverage = currentYearAverage;
        this.lastYearGroup = yearEarlierCourseInstance.group;
      }
    }
  }

  needToGet(grade, weight) {
    if (!grade) {
      grade = round($("#getGrade-grade").val());
    }
    if (!weight) {
      weight = round($("#getGrade-weight").val());
    }
    grade = Number(grade);
    weight = Number(weight);
    if (weight > 420 || weight < 0 || grade < 0 || grade > 420) {
      navigator.notification.alert(
        "Voer een weging tussen 0 en 420.",
        () => {
          weight > 420 || weight < 0
            ? $("#getGrade-weight").val("")
            : $("#getGrade-grade").val("");
        },
        "Ongeldige waarde",
        "Oké"
      );
      return 0;
    }
    var grades = this.data["Grades"];
    var alles = 0;
    var totaalweging = 0;
    for (var i = 0; i < grades.length; i++) {
      if (!grades[i].exclude) {
        var cijfer = grades[i].grade.replace(",", ".");
        cijfer = Number(cijfer);
        alles += cijfer * grades[i].weight;
        totaalweging += grades[i].weight;
      }
    }
    var res = ((totaalweging + weight) * grade - alles) / weight;
    res = `<span ${round(res) > 10 ? 'style="color: #e86458;"' : ""}>${round(
      res
    )}</span>`;
    $("#getGrade-newGrade").html(res);
    return res;
  }

  getNewAverage(grade, weight) {
    if (!grade) {
      grade = $("#newGrade-grade").val();
    }
    if (!weight) {
      weight = $("#newGrade-weight").val();
    }
    grade = parseFloat(grade.replace(",", "."));
    weight = parseFloat(weight.replace(",", "."));
    if (weight > 420 || weight < 0 || grade < 0 || grade > 420) {
      navigator.notification.alert(
        "Voer een weging tussen 0 en 420.",
        () => {
          weight > 420 || weight < 0
            ? $("#newGrade-weight").val("")
            : $("#newGrade-grade").val("");
        },
        "Ongeldige waarde",
        "Oké"
      );
      return 0;
    }
    if (this.getAverage() == "-") {
      return "Niet mogelijk voor dit vak";
    }
    var newGrade;
    var grades = [];
    var processed = 0;
    for (let i = 0; i < weight; i++) {
      grades.push(grade);
    }
    this.grades.forEach(_grade => {
      processed++;
      if (!_grade.exclude) {
        for (let i = 0; i < _grade.weight; i++) {
          grades.push(parseFloat(_grade.grade.replace(",", ".")));
        }
        if (processed == this.grades.length) {
          var average = 0;
          for (let i = 0; i < grades.length; i++) {
            const grade = grades[i];
            average += grade;
          }
          newGrade = average / grades.filter(grade => !grade.exclude).length;
        }
      }
    });
    $("#newGrade-newGrade").text(round(newGrade));
    return round(newGrade);
  }

  getDays() {
    var passed = {
      start: "nooit",
      end: "nooit",
      days: 0,
      grades: 0
    };
    var not_passed = {
      start: "nooit",
      end: "nooit",
      days: 0,
      grades: 0
    };
    this.grades = _.sortBy(this.grades, "dateFilledIn");
    this.grades.forEach((grade, index) => {
      // if (!grade.exclude) {
      var remaining = this.grades.slice(index);
      var start = new Date(grade.dateFilledIn);
      var end = {};
      if (
        grade.average != undefined &&
        grade.average.value >= viewController.config.passed
      ) {
        if (
          remaining.find(x => x.average.value <= viewController.config.passed)
        ) {
          end = remaining.find(
            x => x.average.value <= viewController.config.passed
          );
        } else {
          end = this.grades[this.grades.length - 1];
          // end['dateFilledIn'] = viewController.currentCourse.end
        }
        // logConsole(new Date(end.dateFilledIn))
        var days =
          Math.round(
            (new Date(end.dateFilledIn) - start) / (1000 * 60 * 60 * 24)
          ) + 1;
        // logConsole("days: " + days)
        if (days >= passed.days) {
          passed = {
            start: toShortFormat(start),
            end: toShortFormat(new Date(end.dateFilledIn)),
            days: days,
            grades: this.grades.indexOf(end) - this.grades.indexOf(grade) + 1
          };
        }
      } else if (grade.average.value <= viewController.config.passed) {
        if (
          remaining.find(x => x.average.value >= viewController.config.passed)
        ) {
          end = remaining.find(
            x => x.average.value >= viewController.config.passed
          );
        } else {
          end = this.grades[this.grades.length - 1];
          // end['dateFilledIn'] = viewController.currentCourse.end
        }
        var days =
          Math.round(
            (new Date(end.dateFilledIn) - start) / (1000 * 60 * 60 * 24)
          ) + 1;
        // logConsole("days: " + days)
        if (days >= not_passed.days) {
          not_passed = {
            start: toShortFormat(start),
            end: toShortFormat(new Date(end.dateFilledIn)),
            days: days,
            grades: this.grades.indexOf(end) - this.grades.indexOf(grade) + 0
          };
        }
      }
      // }
    });
    // logConsole("passed: " + JSON.stringify(passed))
    // logConsole("not_passed: " + JSON.stringify(not_passed))
    return {
      passed: passed,
      not_passed: not_passed
    };
  }

  fillGradeAverages() {
    return this.grades.map((grade, index) => {
      // if (!grade.exclude) {
      var average = this.getAverage(false, index + 1);
      grade.average = {
        value: average,
        delta: index > 0 ? average - this.grades[index - 1].average.value : 0
      };
      return grade;
      // }
    });
  }

  exclude(id, input) {
    var grade = (this.grades.find(x => x.id === id).exclude = input.checked
      ? false
      : true);
    if (grade != null && grade != undefined && typeof grade == "object")
      this.grades.find(x => x.id === id).exclude = input.checked ? false : true;
    var currentExclude = viewController.config["exclude"];
    if (currentExclude.find(x => x === id) && !input.checked)
      currentExclude.remove(id);
    input.checked ? currentExclude.remove(id) : currentExclude.push(id);
    // alert(currentExclude)
    viewController.updateConfig({
      exclude: currentExclude
    });
    // alert(grade.class.description.capitalize())
    input.checked
      ? logConsole(`[INFO]   Included ${id}`)
      : logConsole(`[INFO]   Excluded ${id}`);
    // viewController.renderCourse(false, false, viewController.currentCourse, this.name)
    // var l = viewController.currentLesson == "general"
    viewController.currentCourse.course.sortGrades();
    viewController.renderCourse(
      viewController.currentCourse.id,
      false,
      false,
      viewController.currentLesson
    );
  }
}
