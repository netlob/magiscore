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
        return m
    })
}