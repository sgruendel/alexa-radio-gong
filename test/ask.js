'use strict';

const expect = require('chai').expect;

var exports = module.exports = {};

exports.execFile = 'ask';
exports.execArgs = ['simulate', '-s', 'amzn1.ask.skill.8b0359cd-df17-46f0-b1fa-509d6e9ca1cc', '-l', 'de-DE', /*'--force-new-session',*/ '-t' ];
//exports.execArgs = ['simulate', '-s', 'amzn1.ask.skill.8b0359cd-df17-46f0-b1fa-509d6e9ca1cc', '-l', 'de-DE', '-t' ];

exports.verifyResult = (error, stdout) => {
    console.log('stdout', stdout);
    expect(error).to.be.null;
    const jsonStart = stdout.indexOf('{');
    if (jsonStart < 0) {
        //console.error('json start not found', stdout);
        expect(jsonStart).to.be.greaterThan(0);
    }
    const { result } = JSON.parse(stdout.substr(jsonStart));
    if (result.error) {
        //console.error('error message in json', result.error);
        expect(result.error, result.error.message).to.be.null;
    }
    return result;
};
