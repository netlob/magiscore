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
const cijfers = require('./lib/magister/cijfers.function');
const { default: magister, getSchools } = require('magister.js');

http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Request-Method', 'OPTIONS, POST');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
    res.setHeader('Access-Control-Allow-Headers', 'school, username, password, token');
    // Handle normal request
    if('username' in req.headers && 'password' in req.headers && 'school' in req.headers && req.url == '/api/cijfers') {
        MagisterAuth()
        .then(mAuth => {
            req.headers.code = mAuth
            cijfers(req.headers, res)
            .catch(err => { res.writeHead(500), res.end('error: ' + err.toString()); });
        }).catch(err => { res.writeHead(500); res.end('error: ' + err.toString()); });
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