'use strict';

// include the testing framework
const alexaTest = require('alexa-skill-test-framework');

// initialize the testing framework
alexaTest.initialize(
    require('../../src/index'),
    'amzn1.ask.skill.8b0359cd-df17-46f0-b1fa-509d6e9ca1cc',
    'amzn1.ask.account.VOID');
alexaTest.setLocale('de-DE');

describe('Mein Heimvorteil Skill', () => {

    describe('ErrorHandler', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest(''),
                says: 'Entschuldigung, das verstehe ich nicht. Bitte wiederhole das?',
                reprompts: 'Entschuldigung, das verstehe ich nicht. Bitte wiederhole das?',
                shouldEndSession: false,
            },
        ]);
    });

    describe('HelpIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('AMAZON.HelpIntent'),
                says: 'Du kannst sagen „Öffne Mein Heimvorteil“ und ich sage dir was gerade auf Radio Gong Würzburg läuft.',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('SessionEndedRequest', () => {
        alexaTest.test([
            {
                request: alexaTest.getSessionEndedRequest(),
                saysNothing: true, repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('CancelIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('AMAZON.CancelIntent'),
                says: '<say-as interpret-as="interjection">bis dann</say-as>.',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('StopIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('AMAZON.StopIntent'),
                says: '<say-as interpret-as="interjection">bis dann</say-as>.',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('LaunchRequest', () => {
        alexaTest.test([
            {
                request: alexaTest.getLaunchRequest(),
                saysLike: 'Du hörst gerade ',
                hasCardTitle: 'Radio Gong Playlist',
                hasCardTextLike: 'Du hörst gerade ',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('RadioGongIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('RadioGongIntent'),
                saysLike: 'Du hörst gerade ',
                hasCardTitle: 'Radio Gong Playlist',
                hasCardTextLike: 'Du hörst gerade ',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('TrafficMessagesIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('TrafficMessagesIntent'),
                saysLike: 'Es liegen zur Zeit ',
                hasCardTitle: 'Radio Gong Verkehrsmeldungen',
                hasCardTextLike: 'Es liegen zur Zeit ',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('TrafficControlsIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('TrafficControlsIntent'),
                saysLike: 'Es liegen zur Zeit ',
                hasCardTitle: 'Radio Gong Blitzermeldungen',
                hasCardTextLike: 'Es liegen zur Zeit ',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });
});
