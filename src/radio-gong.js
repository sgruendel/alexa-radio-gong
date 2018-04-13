'use strict';

const request = require('request-promise-native');
const cheerio = require('cheerio');

const baseRequest = request.defaults({
    baseUrl: 'http://www.radiogong.com',
    gzip: true,
});

var exports = module.exports = {};

exports.parsePlaylistBody = function(body) {
    const $ = cheerio.load(body);
    return $('#content-main center table tr').map((i, tr) => {
        const cells = $('td', tr).map((j, td) => {
            return $(td).text().trim();
        }).toArray();
        // cells[2] is the album cover
        return { day: cells[0], time: cells[1], artist: cells[3], song: cells[4] };
    }).toArray();
};

exports.getPlaylist = function(callback) {
    const options = {
        uri: 'index.php',
        qs: {
            id: 32,
        },
    };
    baseRequest(options)
        .then(result => {
            try {
                const entries = exports.parsePlaylistBody(result);
                return callback(null, entries);
            } catch (err) {
                console.error('error parsing playlist:', err);
                return callback(err);
            }
        })
        .catch(err => {
            console.error('error in response for playlist:', err);
            return callback(err);
        });
};
