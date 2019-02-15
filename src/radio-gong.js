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
        if (i >= 5) {
            // only return last 5 songs played, otherwise we're too slow
            return undefined;
        }
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

exports.parseTrafficBody = (body) => {
    const $ = cheerio.load(body);
    var traffic = {};
    $('div .content-box-verlauf').map((i, alertDivs) => {
        const header = $('h2', alertDivs).text();
        const cells = $('div', alertDivs).map((j, div) => {
            return $(div).text().trim().replace(/\n+/, ' ');
        });
        var alerts = [];
        for (var j = 2; j < cells.length; j += 3) {
            var alert = cells[j - 2];
            if (cells[j - 1]) {
                alert += ' ' + cells[j - 1];
            }
            if (cells[j]) {
                alert += ' ' + cells[j];
            }
            alerts.push(alert);
        }
        if (header.indexOf('Verkehrsmeldung') >= 0) {
            traffic.messages = alerts;
        } else if (header.indexOf('Blitzermeldung') >= 0) {
            traffic.controls = alerts;
        }
    });
    return traffic;
};

exports.getTraffic = async function() {
    const options = {
        uri: '/verkehr-und-blitzer/',
    };
    return exports.parseTrafficBody(await baseRequest(options));
};
