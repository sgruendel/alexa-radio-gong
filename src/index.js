/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

"use strict";

const Alexa = require("alexa-sdk");
const radioGong = require("./radio-gong");

const APP_ID = "amzn1.ask.skill.8b0359cd-df17-46f0-b1fa-509d6e9ca1cc";
const languageStrings = {
    'en': {
        translation: {
            HELP_MESSAGE: 'You can say „Ask Radio Paradise for the current song“, or you can say „Exit“. What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
            CURRENTLY_PLAYING_MESSAGE: 'You\'re listening to {song} by {artist}.',
            CANT_GET_PLAYLIST_MESSAGE: 'I\'m sorry, I can\'t get that information currently.',
        },
    },
        
    'de': {
        translation: {
            HELP_MESSAGE: 'Du kannst sagen „Frag Mein Heimvorteil nach dem aktuellen Lied“, oder du kannst „Beenden“ sagen. Wie kann ich dir helfen?',
            HELP_REPROMPT: 'Wie kann ich dir helfen?',
            STOP_MESSAGE: 'Auf Wiedersehen!',
            CURRENTLY_PLAYING_MESSAGE: 'Du hörst gerade {song} von {artist}.',
            CANT_GET_PLAYLIST_MESSAGE: 'Es tut mir leid, das kann ich gerade nicht herausfinden.',
        },
    },
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('RadioGong');
    },
    'RadioGongIntent': function () {
        this.emit('RadioGong');
    },
    'RadioGong': function () {
        radioGong.getPlaylist((err, playlist) => {
            if (playlist && playlist[0]) {
                var entry = playlist[0];
                const nowPlaying = this.t('CURRENTLY_PLAYING_MESSAGE')
                      .replace('{artist}', entry.artist)
                      .replace('{song}', entry.song);
                const speechOutput = nowPlaying;
                const cardContent = nowPlaying;

                // TODO Can't use imageObj due to cross-origin resource sharing (CORS) restrictions, see
                // https://developer.amazon.com/blogs/post/Tx15T24P9QV8RXN/New-ASK-Features-Standard-Home-Cards-with-Image-Support
                /*
                const imageObj = {
                    smallImageUrl: entry.cover,
                    largeImageUrl: entry.cover.replace('\/s\/', '/l/')
                }
                */

                this.emit(':tellWithCard', speechOutput, 'Radio Gong Playlist', cardContent);
            } else {
                this.emit(':tell', this.t('CANT_GET_PLAYLIST_MESSAGE'));
            }
        });
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_REPROMPT');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
