
'use strict';

// --- dependancies

const Server = require('./lib/server.js');
const Site   = require('./lib/site.js');
const logger = require('./lib/logger.js');
const axios  = require('axios');

// --- running contexts

var app = new Server('aphrodite service');

// --- development route

app.router.get('/test', (req, res) => {
    Site.inspect(req.headers.host, decodeURIComponent(req.query.url) || '').then(items => res.json(items));
});

// --- home

app.router.get('/', (req, res) => {
    res.render('search', { app: req.query.app || '' });
});

// --- items

app.router.get('/items', (req, res) => {
    let seed  = req.query.seed || ''
    let sites = Site.list();
    res.render('items', { sites, seed, app: req.query.app || '' });
});

// --- lane

app.router.get('/lane', (req, res) => {
    let site = req.query.site;
    let text = req.query.text;
    let url  = req.query.url;

    if (url) {
        Site.inspect(req.headers.host, decodeURIComponent(url)).then(info => {
            res.render('lane', { info, app: req.query.app || '' });
        });
    }
    else {
        Site.search(req.headers.host, site, text).then(info => {
            res.render('lane', { info, app: req.query.app || '' });
        });
    }
});

// --- passthru video

app.router.get('/video', (req, res) => {
    let ctx = { responseType: 'stream', headers: { range: req.headers.range || '' }};
    let url = decodeURIComponent(req.query.url || '');

    axios.get(url, ctx).then(stream => {
        res.writeHead(stream.status, stream.headers);
        stream.data.pipe(res);
    });
})

// --- main

app.listen();
