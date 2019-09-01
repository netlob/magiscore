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
                            logConsole(JSON.stringify(grades))
                        }).catch(err => {
                            errorConsole(err + " 5")
                        })
                }).catch(err => {
                    errorConsole(err + " 2")
                })
        }).catch(err => {
            errorConsole(err + " 3")
        })
}