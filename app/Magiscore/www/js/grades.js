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
                        // logConsole("COURSES:")
                        // logConsole(JSON.stringify(courses))
                        // var current = courses.find(c => c.current)
                        var current = courses[0]
                        current.classes()
                            .then(classes => {
                                logConsole("classes")
                                //logConsole(JSON.stringify(classes))
                            }).catch(err => {
                                errorConsole(err + " 1")
                            })
                        current.grades()
                            .then(grades => {
                                errorConsole("grades")
                                logConsole("lenghth grades" + grades.length)
                                localStorage.removeItem("grades");
                                localStorage.setItem("grades", JSON.stringify(grades));
                                localStorage.setItem("person", JSON.stringify(m.person));
                                //localStorage.setItem("token", JSON.stringify(token));
                                localStorage.setItem("school", JSON.stringify(m.tenant));
                                localStorage.setItem("courses", JSON.stringify(courses));
                                localStorage.setItem("course", JSON.stringify(current));
                                resolve()
                            }).catch(err => {
                                errorConsole(err + " 5")
                            })
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