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

    describe('#parseTrafficBody()', () => {
        it('should parse 0 traffic messages and 5 traffic controls', () => {
            const body = fs.readFileSync('test/verkehr_0_blitzer_5.html');
            const traffic = radioGong.parseTrafficBody(body);
            expect(traffic.messages).to.have.length(0);
            expect(traffic.controls).to.have.length(5);
        });

        it('should parse 1 traffic message and 2 traffic cintrols', () => {
            const body = fs.readFileSync('test/verkehr_1_blitzer_2.html');
            const traffic = radioGong.parseTrafficBody(body);
            expect(traffic.messages).to.have.length(1);
            expect(traffic.controls).to.have.length(2);
        });
    });

    describe('#getTraffic()', () => {
        it('should give traffic controls', async function() {
            const traffic = await radioGong.getTraffic();
            expect(traffic.messages).to.exist;
            expect(traffic.controls).to.exist;
        });
    });
});
