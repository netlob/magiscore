function logConsole(err) {
    $("#Terminal").append(err + "<hr>")
}

function errorConsole(err) {
    $("#Terminal").append("<p style = \"color: red;\">" + err + "</p><hr>")
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
        //var m = new Magister("kajmunk", tokens.access_token)
        m.getInfo()
            .then(person => {
                logConsole("info")

            }).catch(err => {
                errorConsole(err + " 3")
            })
    })

}

// function getLatestGrades() {
//     return new Promise((resolve, reject) => {
//         logConsole("wtf")
//         var tokens = JSON.parse(localStorage.getItem("tokens"))
//         var m = new Magister("kajmunk", tokens.access_token)
//         m.info()
//             .then(person => {
//                 logConsole("info")
//                 m.courses()
//                     .then(courses => {
//                         var current = courses.find(c => c.current)
//                         current.grades({
//                                 fillGrades = false,
//                                 latest = true
//                             })
//                             .then(grades => {
//                                 logConsole("GRADES")
//                                 resolve(grades)
//                             })
//                     })
//             })
//     })

// }