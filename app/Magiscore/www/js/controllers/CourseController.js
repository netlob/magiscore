class CourseController {
    constructor(viewcontroller) {
        this.courses = [];
        this.controller = viewcontroller;
        this.allGrades = [];
        this.latestGrades = [];
    }

    add(course) {
        this.courses.push({
            "id": course.id,
            "course": course
        })
        course.grades.forEach(grade => {
            this.allGrades.push(grade)
        })
        _.sortBy(this.allGrades, 'start')
    }

    remove(course) {
        this.courses.remove({
            "id": course.id,
            "course": course
        })
    }

    clear() {
        this.courses = []
        this.allGrades = []
    }

    current() {
        return this.courses.find(x => x.course.current === true) || this.courses[this.courses.length - 1]
    }

    getCourse(id) {
        return this.courses.find(x => x.id === id)
    }

    getLatestGrades() {
        return new Promise((resolve, reject) => {
            // logConsole("RAW:")
            // logConsole(JSON.stringify(this.raw))
            const url = `https://${school}/api/personen/${person.id}/cijfers/laatste?top=50&skip=0`
            // logConsole(url)
            $.ajax({
                    "dataType": "json",
                    "async": true,
                    "crossDomain": true,
                    "url": url,
                    "method": "GET",
                    "headers": {
                        "Authorization": "Bearer " + tokens.access_token
                    },
                    "error": function (request, status, error) {
                        reject(error)
                    }
                })
                .done((res) => {
                    var grades = res.Items || res.items
                    grades = _.reject(grades, raw => raw.CijferId === 0)
                    this.latestGrades = grades
                    viewController.setLatestGrades(this.latestGrades)
                    resolve(grades)
                })
        })
    }
}