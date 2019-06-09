class Lesson {
    constructor(name, data, grades, viewcontroller) {
        this.grades = grades;
        this.name = name;
        this.data = data;
        this.controller = viewcontroller;
        this.test = 'poep'
    }

    render() {
        console.dir('Poep')
    }

    getCompleted() {
        if(sorted[this.name]['Completed'] && sorted[this.name]['Completed'][0]) {
          var res = round(sorted[this.name]['Completed'][sorted[this.name]['Completed'].length-1]['grade'])
          return res
        } else {
          return "Niet beschikbaar"
        }
    }
      
    getProgress() {
        if (sorted[this.name]['Vordering']) {
            return sorted[this.name]['Vordering'][0]['grade']
        } else {
            return 0
        }
    }
      
    getEffort() {
        if (sorted[this.name]['Inzet']) {
              return sorted[this.name]['Inzet'][0]['grade']
        } else {
              return "Niet beschikbaar"
        }
    }

    getAverage(rounded) {
        if(sorted[this.name]) {
          if(sorted[this.name]['Grades'].length > 0) {
            var newGrade = 0;
            var Grades = []
            var processed = 0;
            sorted[this.name]['Grades'].forEach(_grade => {
              // console.log(_grade.type.isPTA)
              if(Number(round(_grade.grade)) > 0 && Number(round(_grade.grade)) < 10.1) {
                // console.dir(_grade)
                processed++
                for(let i = 0; i < _grade.weight; i++) {
                  Grades.push(Number(round(_grade.grade)))
                }
                if(processed == sorted[this.name]['Grades'].length) {
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
        var grades = sorted[this.name]["Grades"]
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

