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
const login = require('./lib/magister/login.function');
const grades = require('./lib/magister/grades.function');
var demo = fs.readFileSync("./grades.json")
demo = JSON.parse(demo)

http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Request-Method', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', 'school, username, password, token, subscription');
    // Handle normal request
    if ('username' in req.headers && 'password' in req.headers && 'school' in req.headers && req.url.substring(0, 7) == '/grades') {
        console.log('Request')
        getAuthCode()
            .then(mAuth => {
                req.headers.code = mAuth
                grades(req.headers, res)
                    .catch(err => {
                        res.writeHead(200);
                        res.end('error: ' + err.toString());
                    });
            }).catch(err => {
                res.writeHead(200);
                res.end('error: ' + err.toString());
            });
    } else if ('username' in req.headers && 'password' in req.headers && 'school' in req.headers && req.url == '/login') {
        console.log('Request')
        getAuthCode()
            .then(mAuth => {
                req.headers.code = mAuth
                login(req.headers, res)
                    .then(tokens => {
                        res.writeHead(200, {
                            'Content-Type': 'application/json'
                        })
                        res.end(JSON.stringify(tokens))
                    })
                    .catch(err => {
                        res.writeHead(200);
                        res.end('error: ' + err.toString());
                    });
            }).catch(err => {
                res.writeHead(200);
                res.end('error: ' + err.toString());
            });
    } else if (req.url == '/demo') {
        console.log('Demo request')
        res.writeHead(200)
        res.end(JSON.stringify(demo))
    }
    /* else if ('subscription' in req.headers && req.url == '/notifications') {
           res.writeHead(201);
           res.end(JSON.stringify({}))
           const payload = JSON.stringify({
               title: "Push Test"
           });

           webpush
               .sendNotification(JSON.parse(req.headers.subscription), payload)
               .catch(err => console.error(err));
       } */
    else {
        res.end("MAGISCORE API");
    }
}).listen(7080);

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}