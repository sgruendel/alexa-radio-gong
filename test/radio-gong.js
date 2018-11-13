'use strict';

const expect = require('chai').expect;
const radioGong = require('../src/radio-gong');

describe('Radio Gong Website', () => {
    describe('#getPlaylist()', () => {
        it('should give songs playing', async function() {
            const result = await radioGong.getPlaylist();
            expect(result).to.have.length.above(1);
            expect(result[0].artist).to.be.a('string');
            expect(result[0].song).to.be.a('string');
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
});
