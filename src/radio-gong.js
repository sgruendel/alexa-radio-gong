'use strict';

// TODO introduce constants for strings

const http = require('http');
const cheerio = require('cheerio');

var exports = module.exports = {};

exports.getPlaylist = function(callback) {
    const request = http.get({ host: 'www.radiogong.com',
                               port: 80,
                               path: '/index.php?id=32',
                             });

    request.on('response', (response) => {
        if (response.statusCode < 200 || response.statusCode > 299) {
            callback(new Error(response.statusMessage));
        }
        response.on('error', err => {
            console.error('error in response for playlist', err);
            callback(err);
        });
        // explicitly treat incoming data as utf8
        response.setEncoding('utf8');

        // incrementally capture the incoming response body        
        var body = '';
        response.on('data', chunk => {
            body += chunk;
        });
            
        response.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
            //console.log(JSON.stringify(body));
            // we may need to parse through it to extract the needed data

            if (body.length > 4) {
                try {
                    var $ = cheerio.load(body);
                    var entries = $('#content-main center table tr').map((i, tr) => {
                        //console.log('tr', tr);
                        var day, time, artist, song;
                        var cells = $('td', tr).map((j, td) => {
                            return $(td).text();
                        });
                        var entry = {};
                        entry.day = cells[0];
                        entry.time = cells[1];
                        // cells[2] is the album cover
                        entry.artist = cells[3];
                        entry.song = cells[4];
                        //console.log(entry);
                        return [ entry ];
                    });
                    //console.log(entries);
                    return callback(null, entries);
                } catch (err) {
                    console.error('error parsing playlist', err);
                    callback(err);
                }
            }
            console.error('received an empty page, starting recursion ...');
            exports.getPlaylist(callback);
        });
    });

    request.on('error', err => {
        console.error('error requesting playlist', err.message);
        callback(err);
    });
    
    request.end();
}
