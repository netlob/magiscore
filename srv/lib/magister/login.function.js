const { default: magister, getSchools } = require('magister.js');

module.exports = async function(code, params, res, req) {
    magister({
        school: {
            url: `https://${params.school}.magister.net`
        },
        username: params.username,
        password: params.password,
        authCode: code
    }).then(m => {
        // console.dir(m)
        res.writeHead(200)
        res.end(JSON.stringify(m))
        return m
    })
}