const { default: magister, getSchools } = require('magister.js');

module.exports = async function (params, res) {
    magister({
        school: {
            url: `https://${params.school}.magister.net`
        },
        username: params.username,
        password: params.password,
        authCode: params.code
    }).then(m => {
        var response = {}
        response["person"] = m.profileInfo
        response["token"] = m.token
        response["school"] = m.school

        m.courses()
            .then(courses => {
                var current = courses.find(c => c.current).grades()
                response["courses"] = courses;
                response["courses"]["current"] = current;
                courses.find(c => c.current).grades()
                Promise.all(current.grades(), current.classes())
                    .then(values => {
                        response["classes"] = values[1]
                        response["grades"] = values[0]
                        res.writeHead(200)
                        res.end(JSON.stringify(response))
                    }).catch((err) => {
                        console.error('something went wrong:', err);
                        res.writeHead(200);
                        res.end('error: ' + err.toString());
                    });
            })
    }).catch(err => {
        res.writeHead(200);
        res.end('error: ' + err.toString());
    });
}