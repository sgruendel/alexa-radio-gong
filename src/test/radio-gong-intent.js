'use strict';

var expect = require('chai').expect;
var index = require('../index');

const context = require('aws-lambda-mock-context');
const ctx = context();

describe('Testing a session with the RadioGongIntent:', () => {
    var speechResponse = null
    var speechError = null
    
    before(function(done) {
        index.handler( {
            "session": {
                "sessionId": "SessionId.154291c5-a13f-4e7a-ab5a-2342534adfeba",
                "application": {
                    "applicationId": "amzn1.ask.skill.8b0359cd-df17-46f0-b1fa-509d6e9ca1cc"
                },
                "attributes": {},
                "user": {
                    "userId": "amzn1.ask.account.[unique-value-here]"
                },
                "new": true
            },
            "request": {
                "type": "IntentRequest",
                "requestId": "amzn1.echo-api.request.[unique-value-here]",
                "locale": "de-DE",
                "timestamp": "2017-03-30T13:02:01Z",
                "intent": {
                    "name": "RadioGongIntent",
                    "slots": {}
                }
            },
            "version": "1.0"
        }, ctx)
        
        ctx.Promise
            .then(resp => { speechResponse = resp; done(); })
            .catch(err => { speechError = err; done(); })
    })
    
    describe('The response', () => {
        it('should not have errored', () => {
            expect(speechError).to.be.null
        })
        
        it('should have a version', () => {
            expect(speechResponse.version).to.exist
        })
        
        it('should have a speechlet response', () => {
            expect(speechResponse.response).to.exist
        })

        it('should have a spoken response', () => {
            expect(speechResponse.response.outputSpeech).to.exist
        })

        it('should have a card response', () => {
            expect(speechResponse.response.card).to.exist
        })

        it('should end the alexa session', () => {
            expect(speechResponse.response.shouldEndSession).to.be.true
        })
    })
})
