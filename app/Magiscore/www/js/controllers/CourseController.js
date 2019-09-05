class CourseController {
    constructor(viewcontroller) {
        this.courses = [];
        this.controller = viewcontroller;
        this.allGrades = [];
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
}