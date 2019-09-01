function logConsole(err) {
    $("#Terminal").append(err + "</br>")
}

function errorConsole(err) {
    $("#Terminal").append("<p style = \"color: red;\">" + err + "</p>")
}
window.onerror = function (msg, url, lineNo, columnNo, error) {
    errorConsole(msg + " line: " + lineNo + " " + url)

    return false;
}
// errorConsole("test")
// logConsole("test")

function getGrades() {
    return new Promise((resolve, reject) => {
        var tokens = JSON.parse(localStorage.getItem("tokens"))
        var m = new Magister("kajmunk", tokens.access_token)
        m.info()
            .then(person => {
                logConsole("info")
                m.courses()
                    .then(courses => {
                        let requests = courses.map((course) => {
                            return new Promise((resolve_c) => {
                                Promise.all([course.grades(), course.classes()])
                                    .then(values => {
                                        logConsole("length grades" + values[0].length)
                                        course.grades = values[0]
                                        course.classes = values[1]
                                        resolve_c(course)
                                    }).catch(err => {
                                        res.end(err.toString())
                                    });
                            });
                        })

                        Promise.all(requests)
                            .then(values => {
                                localStorage.setItem("person", JSON.stringify(m.person));
                                localStorage.setItem("school", JSON.stringify(m.tenant));
                                localStorage.setItem("courses", JSON.stringify(values));
                                resolve(values)
                            })
                        // logConsole("COURSES:")
                        // logConsole(JSON.stringify(courses))
                        // var current = courses.find(c => c.current)

                        // var course = courses[0]
                        // course.classes()
                        //     .then(classes => {
                        //         course["classes"] = classes
                        //         logConsole("classes")
                        //         //logConsole(JSON.stringify(classes))
                        //     }).catch(err => {
                        //         errorConsole(err + " 1")
                        //     })
                        // course.grades()
                        //     .then(grades => {
                        //         course["grades"] = grades
                        //         errorConsole("grades")
                        //         logConsole("length grades" + grades.length)
                        //         localStorage.setItem("person", JSON.stringify(m.person));
                        //         localStorage.setItem("school", JSON.stringify(m.tenant));
                        //         localStorage.setItem("courses", JSON.stringify(courses));
                        //         resolve(course)
                        //     }).catch(err => {
                        //         errorConsole(err + " 5")
                        //     })
                    }).catch(err => {
                        errorConsole(err + " 2")
                    })
            }).catch(err => {
                errorConsole(err + " 3")
            })
    })

}

function getLatestGrades() {
    return new Promise((resolve, reject) => {
        m.info()
            .then(person => {
                logConsole("info")
                m.courses()
                    .then(courses => {
                        var current = courses.find(c => c.current)
                        current.grades()
                            .then(grades => {
                                resolve(grades)
                            })
                    })
            })
    })

}