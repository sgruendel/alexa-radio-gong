'use strict';

const expect = require('chai').expect;
const fs = require('fs');
const radioGong = require('../src/radio-gong');

describe('Radio Gong Website', () => {
    describe('#parsePlaylistBody()', () => {
        it('should parse playlist', () => {
            const body = fs.readFileSync('test/radio-gong-playlist.html');
            const playlist = radioGong.parsePlaylistBody(body);
            expect(playlist).to.have.lengthOf(5);
            expect(playlist[0].artist).to.equal('ROBIN SCHULZ');
            expect(playlist[0].song).to.equal('Speechless (feat. Erika Sirola)');
        });
    });

    describe('#getPlaylist()', () => {
        it('should give songs playing', async function() {
            const playlist = await radioGong.getPlaylist();
            expect(playlist).to.have.lengthOf(5);
            expect(playlist[0].artist).to.be.a('string');
            expect(playlist[0].song).to.be.a('string');
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
