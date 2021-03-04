'use strict';

const fetch = require('node-fetch');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.radiogong.com/';

const datumRE = /\(am ([0-9\.]*) um ([0-9:]*) Uhr\)/;

var exports = module.exports = {};

function normalizeMsg(msg) {
    return msg
        .replace(/-->/g, '-')
        .replace(/>/g, '-')
        .replace('OA ', 'Ortsausgang ')
        .replace('OE ', 'Ortseinfahrt ')
        .replace('Ri ', 'Richtung ')
        .replace('Richt. ', 'Richtung ')
        .replace('v ', 'von ')
        .replace('zw. ', 'zwischen ')
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

    return $('div .track').map((i, div) => {
        if (i >= 5) {
            // only return last 5 songs played, otherwise we're too slow
            return undefined;
        }
        const date = $('div .track-time', div).text().split(' ');
        const day = date[0];
        const time = date[1];
        const artist = $('div .track-artist', div).text();
        const title = $('div .track-title', div).text();
        const covers = $('div .track-artwork-container img', div).attr('data-srcset').split(' ');

        let entry = { day, time, artist, title };
        if (covers.length > 2 && covers[2].indexOf('/cover-placeholder-gong.jpg') < 0) {
            entry.cover = covers[2];
        }
        return entry;
    }).toArray();
};

exports.getPlaylist = async function() {
    const response = await fetch(BASE_URL + 'programm/playlist');
    return exports.parsePlaylistBody(await response.text());
};

exports.parseTrafficBody = (body) => {
    const $ = cheerio.load(body);
    let traffic = {};
    $('div .content-box-verlauf').map((i, alertDivs) => {
        const header = $('h2', alertDivs).text();
        const isTrafficMessage = header.indexOf('Verkehrsmeldung') >= 0;
        const isTrafficControl = header.indexOf('Blitzermeldung') >= 0;
        const cells = $('div', alertDivs).map((j, div) => {
            return $(div).text().replace(/\s+/g, ' ').trim();
        });
        let alerts = [];
        for (let j = 2; j < cells.length; j += 3) {
            let date, time;
            if (cells[j - 2].match(datumRE)) {
                const sep = cells[j - 2].split(datumRE);
                cells[j - 2] = sep[0].trim();
                date = sep[1];
                time = sep[2];
            }

            let alert = '';
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
    // const response = await fetch(BASE_URL + 'aktuelles/verkehr');
    // return exports.parseTrafficBody(await response.text());
    return { messages: [], controls: [] };
};
