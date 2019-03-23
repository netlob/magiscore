const { default: magister, getSchools } = require('magister.js');

module.exports = async function(params, res) {
    console.dir(params)
    magister({
        school: {
            url: `https://${params.school}.magister.net`
        },
        username: params.username,
        password: params.password,
        authCode: params.code
    }).then(m => {
        var response = {
            "person": m.personInfo,
        }
        m.courses()
        .then(courses => courses.find(c => c.current).grades())
        .then(grades => {
            response[grades] = grades
            res.writeHead(200)
            res.end(JSON.stringify(response))
        }).catch((err) => { // something went wrong
            console.error('something went wrong:', err);
        });
    })
}