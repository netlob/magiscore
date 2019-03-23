const { default: magister, getSchools } = require('magister.js');

module.exports = async function(code, params) {
    magister({
        school: {
            url: `https://${params.school}.magister.net`
        },
        username: params.username,
        password: params.password,
        authCode: code
    }).then(m => {
        // res.writeHead(200)
        // res.end(JSON.stringify(poep))
        return m
    })
}