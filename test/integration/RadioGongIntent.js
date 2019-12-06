'use strict';

const { execFile } = require('child_process');
const expect = require('chai').expect;

const ask = require('../ask');

function verifyResponse(error, stdout) {
    //console.log(stdout);
    const result = ask.verifyResult(error, stdout);
    const { alexaResponses } = result.alexaExecutionInfo;
    expect(alexaResponses.length, 'one response').to.equal(1);
    expect(alexaResponses[0].type, 'speech response').to.equal('Speech');
    expect(alexaResponses[0].content.caption, 'output speech').to.have.string('Du hörst gerade ');
}

describe('RadioGongIntent', () => {
    it('should work for "starte"', (done) => {
        const args = ask.execArgs.concat(['starte mein Heimvorteil']);
        //console.log(args);
        execFile(ask.execFile, args, (error, stdout, stderr) => {
            verifyResponse(error, stdout);
            done();
        });
    });

    it('should work for "frage"', (done) => {
        const args = ask.execArgs.concat(['frage mein Heimvorteil was das ist']);
        //console.log(args);
        execFile(ask.execFile, args, (error, stdout, stderr) => {
            verifyResponse(error, stdout);
            done();
        });
    });
});
