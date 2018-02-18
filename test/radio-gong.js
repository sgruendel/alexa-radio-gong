'use strict';

var expect = require('chai').expect;
var radioGong = require('../src/radio-gong');

describe('radioGong', () => {
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
