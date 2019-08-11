/*
 *   -= Magiscore =-
 *  Sj3rd
 * Licensed under MIT
 *   -= Magiscore =-
 */

'use strict';

// Imports
const http = require('http');

const fs = require('fs')
const getAuthCode = require('@magisterjs/dynamic-authcode');
const webpush = require("web-push");
const login = require('./lib/magister/login.function');
const cijfers = require('./lib/magister/cijfers.function');
var demo = fs.readFileSync("./cijfers.json")
demo = JSON.parse(demo)
const {
    default: magister,
    getSchools
} = require('magister.js');

http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Request-Method', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', 'school, username, password, token, subscription');
    // Handle normal request
    if ('username' in req.headers && 'password' in req.headers && 'school' in req.headers && req.url == '/cijfers') {
        console.log('Request')
        getAuthCode()
            .then(mAuth => {
                req.headers.code = mAuth
                cijfers(req.headers, res)
                    .catch(err => {
                        res.writeHead(200);
                        res.end('error: ' + err.toString());
                    });
            }).catch(err => {
                res.writeHead(200);
                res.end('error: ' + err.toString());
            });
    } else if (req.url == '/demo') {
        res.writeHead(200)
        res.end(JSON.stringify(demo))
    } /* else if ('subscription' in req.headers && req.url == '/notifications') {
        res.writeHead(201);
        res.end(JSON.stringify({}))
        const payload = JSON.stringify({
            title: "Push Test"
        });

        webpush
            .sendNotification(JSON.parse(req.headers.subscription), payload)
            .catch(err => console.error(err));
    } */ else {
        res.end("MAGISCORE API");
    }
}).listen(7080);

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}