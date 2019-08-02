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
// const MagisterAuth = require('./lib/magister/authcode.function');
const getAuthCode = require('@magisterjs/dynamic-authcode');
const webpush = require("web-push");
const login = require('./lib/magister/login.function');
var cijfers = fs.readFileSync("./cijfers.json")
cijfers = JSON.parse(cijfers)
const {
    default: magister,
    getSchools
} = require('magister.js');


const publicVapidKey = "BC79U18J9Pn9ddyl7Vme5nYZC3blOTTlZS3qWj2QyMbtgZiMpOwe2tEWJstSsUaoHXbNQRiJ5Wi8cX2D4upxZP4";
const privateVapidKey = require('../secret.js').privateVapidKey;

webpush.setVapidDetails(
    "mailto:test@test.com",
    publicVapidKey,
    privateVapidKey
);

http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Request-Method', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', 'school, username, password, token, subscription');
    // Handle normal request
    if ('username' in req.headers && 'password' in req.headers && 'school' in req.headers && req.url == '/api/cijfers') {
        console.log('Request')
        res.writeHead(200)
        res.end(JSON.stringify(cijfers))
        // getAuthCode()
        // .then(mAuth => {
        //     req.headers.code = mAuth
        //     cijfers(req.headers, res)
        //     .catch(err => {
        //         res.writeHead(200);
        //         res.end('error: ' + err.toString());
        //     });
        // }).catch(err => {
        //     res.writeHead(200);
        //     res.end('error: ' + err.toString());
        // });
    } else if ('subscription' in req.headers && req.url == '/api/notifications') {
        res.writeHead(201);
        res.end(JSON.stringify({}))
        const payload = JSON.stringify({
            title: "Push Test"
        });

        webpush
            .sendNotification(JSON.parse(req.headers.subscription), payload)
            .catch(err => console.error(err));
    } else {
        res.end("MAGISCORE API");
    }
}).listen(7080);

/**
 * Simple function to await some time.
 * @param {number} millis
 */
function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}