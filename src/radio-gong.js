'use strict';

const request = require('request-promise-native');
const cheerio = require('cheerio');

const baseRequest = request.defaults({
    baseUrl: 'https://www.radiogong.com',
    gzip: true,
});

const datumRE = /\(am ([0-9\.]*) um ([0-9:]*) Uhr\)/;

var exports = module.exports = {};

function normalizeMsg(msg) {
    return msg
        .replace(/-->/g, '-')
        .replace(/>/g, '-')
        .replace('OE ', 'Ortseinfahrt ')
        .replace('Ri ', 'Richtung ')
        .replace('Richt. ', 'Richtung ')
        .replace('v ', 'von ')
        .replace('KT', 'Kitzingen')
        .replace('VHH', 'Veitshöchheim')
        .replace('WÜ', 'Würzburg')
        .replace('Nü ', 'Nürnberg ')
        .replace('Nü-', 'Nürnberg-')
        .replace('Wü ', 'Würzburg ')
        .replace('Wü-', 'Würzburg-');
}

function addSnippet(msg, snippet) {
    if (snippet === '-' || snippet === '.-') {
        snippet = '';
    }
    if (!msg) {
        return snippet;
    }
    return snippet ? (msg + ' ' + snippet) : msg;
}

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
        const isTrafficMessage = header.indexOf('Verkehrsmeldung') >= 0;
        const isTrafficControl = header.indexOf('Blitzermeldung') >= 0;
        const cells = $('div', alertDivs).map((j, div) => {
            return $(div).text().replace(/\s+/g, ' ').trim();
        });
        var alerts = [];
        for (var j = 2; j < cells.length; j += 3) {
            var date, time;
            if (cells[j - 2].match(datumRE)) {
                const sep = cells[j - 2].split(datumRE);
                cells[j - 2] = sep[0].trim();
                date = sep[1];
                time = sep[2];
            }

            var alert = '';
            if (!isTrafficMessage) {
                // first cell of traffic messages is redundant
                alert = cells[j - 2];
            }
            alert = addSnippet(alert, cells[j - 1]);
            alert = addSnippet(alert, cells[j]);
            alerts.push({ msg: normalizeMsg(alert), date: date, time: time });
        }
        if (isTrafficMessage) {
            traffic.messages = alerts;
        } else if (isTrafficControl) {
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
