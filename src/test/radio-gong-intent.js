'use strict';

var expect = require('chai').expect;
var index = require('../index');

const context = require('aws-lambda-mock-context');
const ctx = context();

describe("Testing a session with the RadioGongIntent", function() {
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
                "timestamp": "2016-07-05T22:02:01Z",
                "intent": {
                    "name": "RadioGongIntent",
                    "slots": {}
                },
                "locale": "de-DE"
            },
            "version": "1.0"
        }, ctx)
        
        ctx.Promise
            .then(resp => { speechResponse = resp; done(); })
            .catch(err => { speechError = err; done(); })
    })
    
    describe("The response is structurally correct for Alexa Speech Services", function() {
        it('should not have errored',function() {
            expect(speechError).to.be.null
        })
        
        it('should have a version', function() {
            expect(speechResponse.version).not.to.be.null
        })
        
        it('should have a speechlet response', function() {
            expect(speechResponse.response).not.to.be.null
        })

        it('should have session attributes', function() {
            expect(speechResponse.response.sessionAttributes).not.to.be.null
        })
        
        it("should have a spoken response", () => {
            expect(speechResponse.response.outputSpeech).not.to.be.null
        })
        
        it("should end the alexa session", function() {
            expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.true
        })
    })
})
