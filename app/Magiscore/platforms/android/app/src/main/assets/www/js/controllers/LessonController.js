class LessonController {
    constructor(viewcontroller) {
        this.lessons = [];
        this.controller = viewcontroller;
        this.allGrades = []
    }

    add(name, lesson) {
        var obj = {
            "name": name,
            "lesson": lesson
        }
        lesson.grades.forEach(grade => {
            this.allGrades.push(grade)
        });
        this.lessons.push(obj)
    }

    remove(lesson) {

    }

    clear() {
        this.lessons = []
        this.allGrades = []
    }

    getLesson(lesson) {
        return this.lessons.find(x => x.name === lesson)
    }
}