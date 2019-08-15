class Lesson {
  constructor(name, data, grades, lessoncontroller) {
    this.grades = grades;
    this.name = name;
    this.data = data;
    this.controller = lessoncontroller;
    this.extraFirst = undefined;
    this.extraSecond = undefined;
    this.extraThird = undefined;
  }

  render() {

  }

  getFirst() {
    var keys = Object.keys(this.data)
    keys = keys.remove("Grades")
    if (keys.length > 0 && this.data[keys[0]]) {
      var res = this.data[keys[0]][this.data[keys[0]].length - 1]
      this.extraFirst = keys[0]
      return {
        "title": res['type']['description'],
        "value": [isNaN(res['grade'])] ? res['grade'] : round(res['grade'])
      }
    }
  }

  getSecond() {
    var keys = Object.keys(this.data)
    keys = keys.remove("Grades")
    if (keys.length > 0 && this.data[keys[1]]) {
      var res = this.data[keys[1]][this.data[keys[1]].length - 1]
      if (res == undefined) return { "title": undefined, "value": undefined }
      this.extraSecond = keys[1]
      return {
        "title": res['type']['description'],
        "value": [isNaN(res['grade'])] ? res['grade'] : round(res['grade'])
      }
    }
  }

  getThird() {
    var keys = Object.keys(this.data)
    keys = keys.remove("Grades")
    if (keys.length > 1 && this.data[keys[2]]) {
      var res = this.data[keys[2]][this.data[keys[2]].length - 1]
      this.extraSecond = keys[2]
      return {
        "title": res['type']['description'],
        "value": [isNaN(res['grade'])] ? res['grade'] : round(res['grade'])
      }
    }
  }
  getCompleted() {
    if (this.data['Completed'] && this.data['Completed'][0]) {
      var res = round(this.data['Completed'][this.data['Completed'].length - 1]['grade'])
      return res
    } else {
      return "Niet beschikbaar"
    }
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
  //     return "Niet beschikbaar"
  //   }
  // }

  getAverage(rounded) {
    if (this.data) {
      if (this.data['Grades'].length > 0) {
        var average = 0;
        var grades = []
        var processed = 0;
        this.data['Grades'].forEach(_grade => {
          // console.log(_grade.type.isPTA)
          if (Number(round(_grade.grade)) > 0 && Number(round(_grade.grade)) < 10.1) {
            // console.dir(_grade)
            processed++
            if (!_grade.exclude) {
              for (let i = 0; i < _grade.weight; i++) {
                grades.push(Number(round(_grade.grade)))
              }
              if (processed == this.data['Grades'].length) {
                var averageTotal = 0;
                for (let i = 0; i < grades.length; i++) {
                  averageTotal += grades[i]
                }
                average = averageTotal / grades.length
              }
            }
          }
        })
        if (rounded) {
          return round(average)
        } else {
          return average
        }
      } else {
        return "Niet beschikbaar"
      }
    }
  }

  needToGet(grade, weight) {
    if (!grade) {
      grade = round($('#getGrade-grade').val())
    }
    if (!weight) {
      weight = round($('#getGrade-weight').val())
    }
    grade = Number(grade)
    weight = Number(weight)
    // console.dir('Grade: '+grade + typeof grade)
    // console.dir('Weight: '+weight + typeof weight)
    var grades = this.data["Grades"]
    var alles = 0;
    for (var i = 0; i < grades.length; i++) {
      var cijfer = grades[i].grade.replace(',', '.')
      cijfer = Number(cijfer)
      alles += (cijfer * grades[i].weight);
    }
    var totaalweging = 0;
    for (var i = 0; i < grades.length; i++) {
      totaalweging += grades[i].weight;
    }
    var res = (((totaalweging + weight) * grade) - alles) / weight;
    res = `<span ${(round(res) > 10) ? 'style="color: red"' : ''}>${round(res)}</span>`
    $('#getGrade-newGrade').html(res)
    return res
  }

  getNewAverage(grade, weight) {
    if (!grade) {
      grade = $('#newGrade-grade').val()
    }
    if (!weight) {
      weight = $('#newGrade-weight').val()
    }
    grade = parseFloat(grade.replace(',', '.'))
    weight = parseFloat(weight.replace(',', '.'))

    if (this.getAverage() == 'Niet beschikbaar') {
      return 'Niet mogelijk voor dit vak';
    }
    var newGrade;
    var grades = []
    var processed = 0;
    for (let i = 0; i < weight; i++) {
      grades.push(grade)
    }
    this.grades.forEach(_grade => {
      processed++
      if (!_grade.exclude) {
        for (let i = 0; i < _grade.weight; i++) {
          grades.push(parseFloat(_grade.grade.replace(',', '.')))
        }
        if (processed == this.grades.length) {
          var average = 0;
          for (let i = 0; i < grades.length; i++) {
            const grade = grades[i];
            average += grade
          }
          newGrade = average / grades.length
        }
      }
    })
    $('#newGrade-newGrade').text(round(newGrade))
    return round(newGrade)
  }

  exclude(grade) {
    // this.
    var currentExclude = this.controller.controller.config["exclude"]
    currentExclude.push(grade)
    this.controller.controller.updateConfig({ "exclude": currentExclude })
  }
}