'use strict';

const expect = require('chai').expect;
const fs = require('fs');
const radioGong = require('../src/radio-gong');

describe('Radio Gong Website', () => {
    describe('#parsePlaylistBody()', () => {
        it('should parse playlist', () => {
            const body = fs.readFileSync('test/radio-gong-playlist.html');
            const playlist = radioGong.parsePlaylistBody(body);
            expect(playlist).to.have.lengthOf(146);

            expect(playlist[0].artist).to.equal('ROBIN SCHULZ');
            expect(playlist[0].song).to.equal('Speechless (feat. Erika Sirola)');

            expect(playlist[6].artist).to.equal('SAM SMITH & Normani');
            expect(playlist[6].song).to.equal('Dancing With A Stranger');

            expect(playlist[145].artist).to.equal('Ariana Grande');
            expect(playlist[145].song).to.equal('7 rings');
        });
    });

    describe('#getPlaylist()', () => {
        it('should give songs playing', async function() {
            const result = await radioGong.getPlaylist();
            expect(result).to.have.length.above(1);
            expect(result[0].artist).to.be.a('string');
            expect(result[0].song).to.be.a('string');
        });
    });

    /*
    describe('#parseTrafficControlsBody()', () => {
        it('should parse 1 traffic and 2 radar alerts', () => {
            const body = fs.readFileSync('test/verkehr_1_blitzer_2.html');
            const result = radioGong.parseTrafficControlsBody(body);
            expect(result[0].title).to.be.a('string');
            expect(result[0].text).to.be.a('string');
        });
    });

    describe('#getTrafficControls()', () => {
        it('should give traffic controls', async function() {
            const result = await radioGong.getTrafficControls();
            //expect(result).to.have.length.above(1);
            expect(result[0].title).to.be.a('string');
            expect(result[0].text).to.be.a('string');
        });
    });
    */
});
