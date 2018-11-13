'use strict';

const request = require('request-promise-native');
const cheerio = require('cheerio');

const baseRequest = request.defaults({
    baseUrl: 'http://www.radiogong.com',
    gzip: true,
});

var exports = module.exports = {};

exports.parsePlaylistBody = (body) => {
    const $ = cheerio.load(body);
    return $('#content-main center table tr').map((i, tr) => {
        const cells = $('td', tr).map((j, td) => {
            return $(td).text().trim();
        }).toArray();
        // cells[2] is the album cover
        return { day: cells[0], time: cells[1], artist: cells[3], song: cells[4] };
    }).toArray();
};

exports.getPlaylist = async function() {
    const options = {
        uri: 'index.php',
        qs: {
            id: 32,
        },
    };
    return exports.parsePlaylistBody(await baseRequest(options));
};

exports.parseTrafficControlsBody = (body) => {
    const $ = cheerio.load(body);
    return $('#content-main ul li div.verkehritem').map((i, verkehritem) => {
        // console.log('div', verkehritem);
        const cells = $('div', verkehritem).map((j, div) => {
            return $(div).text();
        });
        return { title: cells[0], text: cells[1] };
    }).toArray();
};

exports.getTrafficControls = async function() {
    const options = {
        uri: 'news/verkehr-blitzer-stau-meldungen.html',
    };
    return exports.parseTrafficControlsBody(await baseRequest(options));
};
