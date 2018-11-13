'use strict';

const expect = require('chai').expect;
const radioGong = require('../src/radio-gong');

describe('Radio Gong Website', () => {
    describe('#getPlaylist()', () => {
        it('should give songs playing', done => {
            radioGong.getPlaylist((err, result) => {
                expect(err).to.be.null;
                expect(result).to.have.length.above(1);
                expect(result[0].artist).to.be.a('string');
                expect(result[0].song).to.be.a('string');
                done();
            });
        });
    });
});

describe('radioGong', () => {
    describe('#getTrafficControls()', () => {
        it('should give traffic controls', done => {
            radioGong.getTrafficControls((err, result) => {
                expect(err).to.be.null;
                expect(result).to.have.length.above(1);
                expect(result[0].title).to.be.a('string');
                expect(result[0].text).to.be.a('string');
                done();
            });
        });
    });
});
