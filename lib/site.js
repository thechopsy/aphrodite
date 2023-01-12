
'use strict';

// --- dependancies

var fetch   = require('node-fetch');
var cheerio = require('cheerio');
var fs      = require('fs');

// --- constants

const PATH_READERS = './readers';
const MAX_ITEMS    = 12 + 1 + 12;

// --- loads all the known readers

function readers() {
    return fs.readdirSync(PATH_READERS)
             .map(r => require(`../${ PATH_READERS }/${ r }`))
             .sort((a, b) => a.name.localeCompare(b.name));
}

// --- reads a url with a give reader context

function read(url, reader) {
    return fetch(url)
    .then(res  => res.text())
    .then(html => cheerio.load(html))
    .then($    => ({
        name:   reader.name,
        domain: reader.domain,
        search: reader.search,
        items:  reader.items($).slice(0, MAX_ITEMS)
    }));
}

// --- inspects info for a given url

function inspect(url) {
    let reader = readers().find(r => url.includes(r.match));
    return reader ? read(url, reader) : Promise.resolve({});
}

// --- exports

module.exports = { info: inspect, list: readers };
