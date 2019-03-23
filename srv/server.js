/*
 *   -= Magbot3 stat =-
 *  Sj3rd & minestarnl
 * Licensed under MIT
 *   -= Magbot3 stat =-
 */

'use strict';

// Imports
const http = require('http');
const MagisterAuth = require('./lib/magister/authcode.function');
const login = require('./lib/magister/login.function');
const { default: magister, getSchools } = require('magister.js');

http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', "https://mamorgen.github.io");
    res.setHeader('Access-Control-Request-Method', 'OPTIONS, POST');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
    res.setHeader('Access-Control-Allow-Headers', 'school, username, password, token');
    // Handle normal request
    if ('token' in req.headers || 'username' in req.headers) {
        MagisterAuth()
            .then(mAuth => {
                magister({
                    school: {
                        url: `https://${req.headers.school}.magister.net`
                    },
                    username: req.headers.username,
                    password: req.headers.password,
                    authCode: mAuth
                }).then(m => {
                    m.courses()
                    .then(courses => courses.find(c => c.current).grades())
                    .then(grades => {
                        console.dir(grades)
                        res.writeHead(200)
                        res.end(JSON.stringify(grades))
                    }).catch((err) => { // something went wrong
                        console.error('something went wrong:', err);
                    });
                    // return m
                })
                // login(mAuth, req.headers)
                // .then(m => {
                //     console.dir(m)
                //     res.writeHead(200)
                //     res.end(JSON.stringify(m))
                // })
            })
            // .then(updated => res.end(updated ? 'success: user updated' : 'success: user created'))
            .catch(err => { res.writeHead(500); res.end('error: ' + err.toString()); });
    // If not requesting properly show 'nice' welcome :)
    } else {
        res.end('MAGBOT STAT API');
    }
}).listen(7070);

/**
 * Simple function to await some time.
 * @param {number} millis 
 */
function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}