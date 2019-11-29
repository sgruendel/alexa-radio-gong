'use strict';

const { execFile } = require('child_process');
const expect = require('chai').expect;

const ask = require('../ask');

function verifyResponse(error, stdout) {
    const result = ask.verifyResult(error, stdout);
    const { alexaResponses } = result.alexaExecutionInfo;
    expect(alexaResponses.length, 'one response').to.equal(1);
    expect(alexaResponses[0].type, 'speech response').to.equal('Speech');
    expect(alexaResponses[0].content.caption, 'output speech').to.have.string('Hier ist die Kamera Schmücke Südwest.');
}

describe('Wetterkamera Schmücke', () => {
    it('should find webcam', (done) => {
        //const args = ask.execArgs.concat(['Alexa öffne d. w. d. Wetterkamera und zeige Schmücke']);
        const args = ask.execArgs.concat(['Frage Mein Heimvorteil was gerade läuft']);
        console.log(args);
        execFile(ask.execFile, args, (error, stdout, stderr) => {
            verifyResponse(error, stdout);
            done();
        });
    });
});
