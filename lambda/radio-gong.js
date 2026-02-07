import fetch from 'node-fetch';
import https from 'https';

const BASE_URL = 'https://www.radiogong.com/cmms-api-v2/soylent/';

const httpsAgent = new https.Agent({
    keepAlive: true,
});
const options = {
    agent: (_parsedURL) => {
        return httpsAgent;
    },
};

const datumRE = /\(am ([0-9\.]*) um ([0-9:]*) Uhr\)/;

/**
 * @typedef {Object} Playlist
 * @property {boolean} success whether the request was successful
 * @property {string} date date of the playlist
 * @property {Song[]} playlist list of songs in the playlist
 * @property {number} timestamp timestamp of the playlist (Unix timestamp)
 * @property {number} timestamp_to_hours hour of the timestamp (0-23)
 * @property {number} timestamp_to_minutes minute of the timestamp (0-59)
 */

/**
 * @typedef {Object} Song
 * @property {string} title song title
 * @property {string} interpret song interpret
 * @property {number} time time song started playing (Unix timestamp)
 * @property {number} entry_id
 * @property {number} track_id
 * @property {string} cover cover image url
 */

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
    return snippet ? msg + ' ' + snippet : msg;
}

/**
 * Gets the playlist of a channel.
 * @param {number} channelId id of the channel (default: 601 for Radio Gong Würzburg)
 * @param {number} amount amount of songs to get (default: 3)
 * @returns {Promise<Playlist>} playlist of the channel
 */
export async function getPlaylist(channelId = 601, amount = 3) {
    const body = { channel_id: channelId, timestamp: Math.floor(Date.now() / 1000), amount: amount };
    const response = await fetch(BASE_URL + 'playlist', {
        ...options,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    /** @type {Playlist} */
    // @ts-ignore
    const songs = await response.json();
    return songs;
}

export async function getTraffic() {
    // TODO
    return { messages: [], controls: [] };
}
