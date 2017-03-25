'use strict';

var expect = require('chai').expect;
var radioGong = require('../radio-gong');

describe('Radio Gong helpers', function() {
    describe('#getPlaylist()', function() {
        it('should give songs playing', function(done) {
            radioGong.getPlaylist(function(err, result) {
                expect(err).to.be.null;
                console.log(typeof result);
                //expect(result).to.have.length.above(1);
                expect(result[0].artist).to.be.a('string');
                done();
            });
        });
    });
});
