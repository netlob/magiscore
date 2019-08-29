class LessonController {
    constructor(viewcontroller) {
        this.lessons = [];
        this.controller = viewcontroller;
        this.allGrades = []
    }

    add(lesson, data, grades, controller) {
        var obj = {
            "name": lesson,
            "lesson": new Lesson(lesson, grades, data, controller)
        }
        this.lessons.push(obj)
    }

    remove(lesson) {

    }

    clear() {
        this.lessons = []
    }

    getLesson(lesson) {
        return this.lessons.find(x => x.name === lesson)
    }
}