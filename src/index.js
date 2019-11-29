'use strict';

const Alexa = require('ask-sdk-core');
const i18next = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const dashbot = process.env.DASHBOT_API_KEY ? require('dashbot')(process.env.DASHBOT_API_KEY).alexa : undefined;
const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
    exitOnError: false,
});

const radioGong = require('./radio-gong');
const utils = require('./utils');

const SKILL_ID = 'amzn1.ask.skill.8b0359cd-df17-46f0-b1fa-509d6e9ca1cc';
const RADIOGONG_IMAGE_URL = 'https://www.radiogong.com';
const TITLE = 'Radio Gong Playlist'; // Used for card and display title
const TITLE_TRAFFIC_MESSAGES = 'Radio Gong Verkehrsmeldungen';
const ICON_TRAFFIC_MESSAGE = '/wp-content/grafiken/verkehrsmeldung-icon-80x75.png';
const TITLE_TRAFFIC_CONTROLS = 'Radio Gong Blitzermeldungen';
const ICON_TRAFFIC_CONTROL = '/wp-content/grafiken/blitzer-icon-80x75.png';

const languageStrings = {
    de: {
        translation: {
            HELP_MESSAGE: 'Du kannst sagen „Öffne Mein Heimvorteil“ und ich sage dir was gerade auf Radio Gong Würzburg läuft.',
            STOP_MESSAGE: '<say-as interpret-as="interjection">bis dann</say-as>.',
            NOT_UNDERSTOOD_MESSAGE: 'Entschuldigung, das verstehe ich nicht. Bitte wiederhole das?',
            CURRENTLY_PLAYING_MESSAGE: 'Du hörst gerade {{song}} von {{artist}}.',
            TRAFFIC_MESSAGES: 'Verkehrsmeldungen',
            TRAFFIC_MESSAGES_MESSAGE: 'Es liegen zur Zeit folgende Verkehrsmeldungen vor: {{text}}',
            TRAFFIC_NO_MESSAGES_MESSAGE: 'Es liegen zur Zeit keine Verkehrsmeldungen vor.',
            TRAFFIC_CONTROLS: 'Blitzermeldungen',
            TRAFFIC_CONTROLS_MESSAGE: 'Es liegen zur Zeit folgende Blitzermeldungen vor: {{text}}',
            TRAFFIC_NO_CONTROLS_MESSAGE: 'Es liegen zur Zeit keine Blitzermeldungen vor.',
            CANT_GET_DATA_MESSAGE: 'Es tut mir leid, das kann ich gerade nicht herausfinden.',
        },
    },
};

const RadioGongIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return (request.type === 'LaunchRequest')
            || (request.type === 'IntentRequest' && request.intent.name === 'RadioGongIntent');
    },
    async handle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        logger.debug('request', request);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        var response;
        await radioGong.getPlaylist()
            .then((playlist) => {
                logger.debug('playlist', playlist);
                const entry = playlist[0];
                const speechOutput = requestAttributes.t('CURRENTLY_PLAYING_MESSAGE', { artist: entry.artist, song: entry.song });
                const cardContent = requestAttributes.t('CURRENTLY_PLAYING_MESSAGE',
                    {
                        artist: entry.artist, song: entry.song,
                        interpolation: { escapeValue: false },
                    });
                logger.debug(cardContent);

                if (entry.cover) {
                    const smallImageUrl = RADIOGONG_IMAGE_URL + entry.cover;

                    response = handlerInput.responseBuilder
                        .speak(speechOutput)
                        .withStandardCard(TITLE, cardContent, smallImageUrl)
                        .getResponse();
                } else {
                    response = handlerInput.responseBuilder
                        .speak(speechOutput)
                        .withStandardCard(TITLE, cardContent)
                        .getResponse();
                }
            })
            .catch((err) => {
                logger.error(err.stack || err.toString());
                const speechOutput = requestAttributes.t('CANT_GET_DATA_MESSAGE');
                response = handlerInput.responseBuilder
                    .speak(speechOutput)
                    .getResponse();
            });

        return response;
    },
};

const TrafficMessagesIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'TrafficMessagesIntent';
    },
    async handle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        logger.debug('request', request);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        var response;
        try {
            const traffic = await radioGong.getTraffic();
            logger.debug('traffic messages', traffic.messages);
            const responseData =
                utils.getTrafficResponseData(traffic.messages,
                    requestAttributes.t('TRAFFIC_MESSAGES'),
                    RADIOGONG_IMAGE_URL + ICON_TRAFFIC_MESSAGE);
            var speechOutput;
            var cardContent;
            if (responseData.listItems.length === 0) {
                speechOutput = requestAttributes.t('TRAFFIC_NO_MESSAGES_MESSAGE');
                cardContent = speechOutput;
            } else {
                speechOutput = requestAttributes.t('TRAFFIC_MESSAGES_MESSAGE', {
                    text: responseData.speechOutputText,
                });
                cardContent = requestAttributes.t('TRAFFIC_MESSAGES_MESSAGE', {
                    text: responseData.cardContentText,
                    interpolation: { escapeValue: false },
                });
            }
            logger.info(cardContent);

            /* TODO
            if (responseData.listItems.length > 0 && supportsDisplay(handlerInput)) {
                handlerInput.responseBuilder
                    .addRenderTemplateDirective({
                        type: 'ListTemplate1',
                        backButton: 'HIDDEN',
                        // backgroundImage: measurementImage,
                        title: TITLE_TRAFFIC_MESSAGES,
                        listItems: responseData.listItems,
                    });
            } */
            response = handlerInput.responseBuilder
                .speak(speechOutput)
                .withStandardCard(TITLE_TRAFFIC_MESSAGES, cardContent, RADIOGONG_IMAGE_URL + ICON_TRAFFIC_MESSAGE)
                .getResponse();
        } catch (err) {
            logger.error(err.stack || err.toString());
            const speechOutput = requestAttributes.t('CANT_GET_DATA_MESSAGE');
            response = handlerInput.responseBuilder
                .speak(speechOutput)
                .getResponse();
        }

        return response;
    },
};

const TrafficControlsIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'TrafficControlsIntent';
    },
    async handle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        logger.debug('request', request);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        var response;
        try {
            const traffic = await radioGong.getTraffic();
            logger.debug('traffic controls', traffic.controls);
            const responseData =
                utils.getTrafficResponseData(traffic.controls,
                    requestAttributes.t('TRAFFIC_CONTROLS'),
                    RADIOGONG_IMAGE_URL + ICON_TRAFFIC_CONTROL);
            var speechOutput;
            var cardContent;
            if (responseData.listItems.length === 0) {
                speechOutput = requestAttributes.t('TRAFFIC_NO_CONTROLS_MESSAGE');
                cardContent = speechOutput;
            } else {
                speechOutput = requestAttributes.t('TRAFFIC_CONTROLS_MESSAGE', {
                    text: responseData.speechOutputText,
                });
                cardContent = requestAttributes.t('TRAFFIC_CONTROLS_MESSAGE', {
                    text: responseData.cardContentText,
                    interpolation: { escapeValue: false },
                });
            }
            logger.info(cardContent);

            /* TODO
            if (responseData.listItems.length > 0 && supportsDisplay(handlerInput)) {
                handlerInput.responseBuilder
                    .addRenderTemplateDirective({
                        type: 'ListTemplate1',
                        backButton: 'HIDDEN',
                        // backgroundImage: measurementImage,
                        title: TITLE_TRAFFIC_CONTROLS,
                        listItems: responseData.listItems,
                    });
            } */
            response = handlerInput.responseBuilder
                .speak(speechOutput)
                .withStandardCard(TITLE_TRAFFIC_CONTROLS, cardContent, RADIOGONG_IMAGE_URL + ICON_TRAFFIC_CONTROL)
                .getResponse();
        } catch (err) {
            logger.error(err.stack || err.toString());
            const speechOutput = requestAttributes.t('CANT_GET_DATA_MESSAGE');
            response = handlerInput.responseBuilder
                .speak(speechOutput)
                .getResponse();
        }

        return response;
    },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        logger.debug('request', request);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('HELP_MESSAGE'))
            .getResponse();
    },
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        logger.debug('request', request);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechOutput = requestAttributes.t('STOP_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        try {
            if (request.reason === 'ERROR') {
                logger.error(request.error.type + ': ' + request.error.message);
            }
        } catch (err) {
            logger.error(err.stack || err.toString(), request);
        }

        logger.debug('session ended', request);
        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        logger.error(error.stack || error.toString(), handlerInput.requestEnvelope.request);
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechOutput = requestAttributes.t('NOT_UNDERSTOOD_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
    },
};

const LocalizationInterceptor = {
    process(handlerInput) {
        i18next.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languageStrings,
            returnObjects: true,
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = (...args) => {
            return i18next.t(...args);
        };
    },
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        RadioGongIntentHandler,
        TrafficMessagesIntentHandler,
        TrafficControlsIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler)
    .addRequestInterceptors(LocalizationInterceptor)
    .addErrorHandlers(ErrorHandler)
    .withSkillId(SKILL_ID)
    .lambda();
if (dashbot) exports.handler = dashbot.handler(exports.handler);
