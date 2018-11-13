'use strict';

const Alexa = require('alexa-sdk');
const radioGong = require('./radio-gong');

const APP_ID = 'amzn1.ask.skill.8b0359cd-df17-46f0-b1fa-509d6e9ca1cc';
const languageStrings = {
    de: {
        translation: {
            HELP_MESSAGE: 'Du kannst sagen „Frag Mein Heimvorteil nach dem aktuellen Lied“, oder du kannst „Beenden“ sagen. Wie kann ich dir helfen?',
            HELP_REPROMPT: 'Wie kann ich dir helfen?',
            STOP_MESSAGE: 'Auf Wiedersehen!',
            CURRENTLY_PLAYING_MESSAGE: 'Du hörst gerade {{song}} von {{artist}}.',
            CANT_GET_PLAYLIST_MESSAGE: 'Es tut mir leid, das kann ich gerade nicht herausfinden.',
        },
    },
};

const handlers = {
    LaunchRequest: function() {
        this.emit('RadioGong');
    },
    RadioGongIntent: function() {
        this.emit('RadioGong');
    },
    RadioGong: function() {
        radioGong.getPlaylist((err, playlist) => {
            if (playlist && playlist[0]) {
                const entry = playlist[0];
                console.log('entry is', entry);
                const speechOutput = this.t('CURRENTLY_PLAYING_MESSAGE', { artist: entry.artist, song: entry.song });
                const cardContent = this.t('CURRENTLY_PLAYING_MESSAGE',
                    {
                        artist: entry.artist, song: entry.song,
                        interpolation: { escapeValue: false },
                    });

                console.log(cardContent);
                this.emit(':tellWithCard', speechOutput, 'Radio Gong Playlist', cardContent);
            } else {
                console.error('Error getting playlist', err);
                this.emit(':tell', this.t('CANT_GET_PLAYLIST_MESSAGE'));
            }
        });
    },
    'AMAZON.HelpIntent': function() {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_REPROMPT');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function() {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    SessionEndedRequest: function() {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = (event, context, callback) => {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
