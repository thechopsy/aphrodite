
'use strict';

// --- dependancies

const Server = require('./lib/server.js');
const Site   = require('./lib/site.js');
const axios  = require('axios');
const logger = require('./lib/logger.js');

// --- running contexts

var app = new Server('aphrodite service');

// --- development route

app.router.get('/test', (req, res) => {
    Site.info(decodeURIComponent(req.query.url) || '').then(items => res.json(items));
});

// --- home

app.router.get('/', (req, res) => {
    res.render('search', { sites: Site.list(), app: req.query.app || '' });
});

// --- items

app.router.get('/items', (req, res) => {
    Site.info(req.headers.host, decodeURIComponent(req.query.url) || '').then(info => {
        res.render('items', { info, app: req.query.app || '' });
    });
});

// --- passthru video

app.router.get('/video', (req, res) => {
    let ctx = { responseType: 'stream', headers: { range: req.headers.range || '' }};
    let url = decodeURIComponent(req.query.url || '');

    axios.get(url, ctx).then(stream => {
        res.writeHead(stream.status, stream.headers);
        stream.data.pipe(res)
    });
})

// --- main

app.listen();
