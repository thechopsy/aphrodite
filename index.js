
'use strict';

// --- dependancies

const Server = require('./lib/server.js');
const Site   = require('./lib/site.js');
const logger = require('./lib/logger.js');

// --- running contexts

var app = new Server('aphrodite service');

// --- development routes

app.router.get('/test', (req, res) => {
    Site.info(decodeURIComponent(req.query.url) || '').then(items => res.json(items));
});

// --- site routes

app.router.get('/', (req, res) => {
    res.render('search', { sites: Site.list(), app: req.query.app || '' });
});

app.router.get('/items', (req, res) => {
    Site.info(decodeURIComponent(req.query.url) || '').then(info => {
        res.render('items', { info, app: req.query.app || '' });
    });
});

// --- main

app.listen();
