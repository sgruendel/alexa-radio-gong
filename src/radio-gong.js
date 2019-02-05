'use strict';

const request = require('request-promise-native');
const cheerio = require('cheerio');

const baseRequest = request.defaults({
    baseUrl: 'https://www.radiogong.com',
    gzip: true,
});

var exports = module.exports = {};

exports.parsePlaylistBody = (body) => {
    const $ = cheerio.load(body);

    return $('div .playlist-divitem').map((i, div) => {
        /*
        const cells = $('td', tr).map((j, td) => {
            return $(td).text().trim();
        }).toArray();
        */
        const date = $('div .playlist-date span', div);
        const day = date.slice(0, 1).text();
        const time = date.slice(1, 2).text();
        const interpret = $('div .playlist-interpret', div).text();
        const titel = $('div .playlist-titel', div).text();

        return { day: day, time: time, artist: interpret, song: titel };
    }).toArray();
};

exports.getPlaylist = async function() {
    const options = {
        uri: 'radio-gong-playlist/',
    };
    return exports.parsePlaylistBody(await baseRequest(options));
};

exports.parseTrafficControlsBody = (body) => {
    const $ = cheerio.load(body);
    const meldungen = $('div .content-box-verlauf');


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
        uri: '/verkehr-und-blitzer/',
    };
    return exports.parseTrafficControlsBody(await baseRequest(options));
};
