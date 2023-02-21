
'use strict';

// --- dependancies

var fetch   = require('node-fetch');
var aborter = require('node-abort-controller');
var cheerio = require('cheerio');
var fs      = require('fs');

// --- constants

const PATH_READERS = './readers';
const MAX_ITEMS    = 12 + 1 + 12;
const TIMEOUT      = 5000; // ms

// --- loads all the known readers

function readers() {
    return fs.readdirSync(PATH_READERS)
             .map(r => require(`../${ PATH_READERS }/${ r }`))
             .filter(r => r.active)
             .sort((a, b) => a.name.localeCompare(b.name));
}

// --- list of reader ids

function list() {
    return readers().map(r => r.id);
}

// --- reads a url with a give reader context

function read(host, url, reader) {
    let controller = new aborter.AbortController();
    let signal     = controller.signal;
    let timeout    = setTimeout(() => controller.abort(), TIMEOUT);

    return fetch(url, { signal })
    .then(res  => res.text())
    .then(html => cheerio.load(html))
    .then($    => {
        clearTimeout(timeout);

        let found = reader.items($, host);
        let first = found.shift();
        let items = found.sort(() => 0.5 - Math.random());
        let rest  = items.slice(0, MAX_ITEMS - 1);

        return {
            id:     reader.id,
            name:   reader.name,
            domain: reader.domain,
            items:  [ first, ...rest ]
        }
    })
    .catch(err => ({}));
}

// --- inspects info for a given url

function inspect(host, url) {
    let reader = readers().find(r => url.includes(r.match));
    return reader ? read(host, url, reader) : Promise.resolve({});
}

// --- search given site for given text

function search(host, site, text) {
    let reader = readers().find(r => r.id === site);
    let url    = text.length > 1 ? reader.search.replace('[TERM]', text) : reader.domain;
    return read(host, url, reader);
}

// --- exports

module.exports = { search, inspect, list };
