class Lesson {
    constructor(name, data, grades, viewcontroller) {
        this.grades = grades;
        this.name = name;
        this.data = data;
        this.controller = viewcontroller;
        this.extraFirst = undefined;
        this.extraSecond = undefined;
        this.extraThird = undefined;
    }

    render() {
      
    }

    getFirst() {
      console.dir(this.data)
      var keys = Object.keys(this.data)
      keys = keys.remove("Grades")
      if(keys.length > 0 && this.data[keys[0]]) {
        var res = this.data[keys[0]][this.data[keys[0]].length-1]
        console.dir(res)
        return {
          "title": res['type']['description'],
          "value": [isNaN(res['grade'])]?res['grade']:round(res['grade'])
        }
      }
    }

    getSecond() {
      return {
        "title": 'poep',
        "value": 0
      }
    }

    getThird() {
      return {
        "title": 'poep',
        "value": 0
      }
    }
    getCompleted() {
        if(this.data['Completed'] && this.data['Completed'][0]) {
          var res = round(this.data['Completed'][this.data['Completed'].length-1]['grade'])
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
        if(this.data) {
          if(this.data['Grades'].length > 0) {
            var newGrade = 0;
            var Grades = []
            var processed = 0;
            this.data['Grades'].forEach(_grade => {
              // console.log(_grade.type.isPTA)
              if(Number(round(_grade.grade)) > 0 && Number(round(_grade.grade)) < 10.1) {
                // console.dir(_grade)
                processed++
                for(let i = 0; i < _grade.weight; i++) {
                  Grades.push(Number(round(_grade.grade)))
                }
                if(processed == this.data['Grades'].length) {
                  var Average = 0;
                  for (let i = 0; i < Grades.length; i++) {
                    const Grade = Grades[i];
                    Average += Grade
                  }
                  newGrade = Average / Grades.length
                }
              }
            })
            if(rounded){
              return round(newGrade)
            } else {
              return newGrade
            }
          } else {
            return "Niet beschikbaar"
          }
        }
    }

    needToGet(grade, weight) {
        if(!grade){ grade = round($('#getGrade-grade').val()) }
        if(!weight){ weight = round($('#getGrade-weight').val()) }
        grade = Number(grade)
        weight = Number(weight)
        // console.dir('Grade: '+grade + typeof grade)
        // console.dir('Weight: '+weight + typeof weight)
        var grades = this.data["Grades"]
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
        var res = (((totaalweging+weight)*grade)-alles)/weight;
        // console.dir(res +typeof res)
        res = round(res)
        if(res > 10) {
          res = `<span style="color: red">${res}</span>`
        }
        $('#getGrade-newGrade').html(res)
        return res
    }
    
    getNewAverage(grade, weight) {
        if(!grade){ grade = $('#newGrade-grade').val() }
        if(!weight){ weight = $('#newGrade-weight').val() }
        grade = parseFloat(grade.replace(',', '.'))
        weight = parseFloat(weight.replace(',', '.'))
        
        if(this.getAverage() == 'Niet beschikbaar') {
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
        })
        $('#newGrade-newGrade').text(round(newGrade))
        return round(newGrade)
    }
}