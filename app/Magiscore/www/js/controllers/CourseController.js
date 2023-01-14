class CourseController {
  constructor(viewcontroller) {
    this.courses = [];
    this.controller = viewcontroller;
    this.courseIds = [];
    this.allGrades = [];
    this.latestGrades = [];
  }

  add(course) {
    this.courses.push({
      id: course.id,
      course: course
    });
    this.courseIds.push(course.id);
    course.grades.forEach(grade => {
      this.allGrades.push(grade);
    });
    _.sortBy(this.allGrades, "dateFilledIn");
  }

  remove(course) {
    this.courses = _.remove(this.courses, function(c) {
      return c.id == course.id;
    });
    // this.courses.remove({
    //     "id": course.id,
    //     "course": course
    // })
  }

  clear() {
    this.courses = [];
    this.allGrades = [];
  }

  save() {
    setObject("courses", JSON.stringify(this.courses), getActiveAccount());
  }

  current() {
    // var latestDate = new Date(Math.max(null, this.courses.map(x => {
    //     return x.end
    // })))
    // var currentCourse = this.courses.find(x => x.end == latestDate)
    // return currentCourse
    return /*this.courses.find(x => x.course.current === true) || */ this
      .courses[this.courses.length - 1];
  }

  getCourse(id) {
    return this.courses.find(x => x.id === id);
  }

  getLatestGrades(open = false, childindex = -1, skipSnackbar = false) {
    if (open) viewController.overlay("show");
    return new Promise((resolve, reject) => {
      // logConsole("RAW:")
      // logConsole(JSON.stringify(this.raw))
      var personid = (childindex >= 0 && person.isParent) ? person.children[childindex].Id : person.id
      const url = `https://cors.sjoerd.dev/https://${school}/api/personen/${personid}/cijfers/laatste?top=50&skip=0`;
      //Er wordt hier een plugin gebruikt, omdat die in Chrome niet worden gethrottled wanneer de applicatie zich in de achtergrond bevindt.
      cordova.plugin.http.sendRequest(url, {
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: "Bearer " + tokens.access_token,
          noCache: new Date().getTime().toString(),
          "x-requested-with": "app.netlob.magiscore"
        },
        method: "GET",
      }, function(response) {
        try {
        var res = JSON.parse(response.data);
        var grades = res.Items || res.items;
        courseController.latestGrades = grades;
        window.dispatchEvent( new Event('storage') );
        var popup = false;
        var foundnew = false
        //Voor een of andere reden is het kolomId van sommige cijfers anders wanneer het bij de laatste cijfers opgehaald wordt,
        //dus controleren we op nieuwe cijfers door middel van verschillende aspecten van het cijfer.
        courseController.latestGrades.forEach(grade => {
          if (
            (courseController.allGrades.map((grade) => `${new Date(grade.dateFilledIn).toISOString()};${grade.grade};${grade.weight};${grade.description}`)
            .filter((foundgrade) => foundgrade == `${new Date(grade.ingevoerdOp).toISOString()};${grade.waarde};${grade.weegfactor};${grade.omschrijving}`).length == 0) &&
            popup == false
          ) {
            popup = true;
            foundnew = true;
            if (!skipSnackbar) viewController.toast(
              '<span class="float-left">Nieuwe cijfer(s) beschikbaar </span><a class="float-right vibrate text-warning" onclick="syncGrades()">UPDATE</a>',
              false,
              true
            );
          }
        });
      } catch(e) {console.log(e)}
        viewController.setLatestGrades(courseController.latestGrades, open);
        viewController.overlay("hide");
        resolve([courseController.latestGrades, foundnew]);
      }, function(response) {
        console.log(response.data)
        reject(response.error);
      })
    });
  }
}
