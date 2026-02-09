// eslint-disable-next-line no-unused-vars -- needed for typedefs
import services from 'ask-sdk-model';
import winston from 'winston';

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
    exitOnError: false,
});

import * as radioGong from './radio-gong.js';
import * as utils from './utils.js';

const RADIOGONG_IMAGE_URL = 'https://www.radiogong.com/storage/thumbs/480x480c/';
const TITLE = 'Radio Gong Playlist'; // Used for card and display title
const TITLE_TRAFFIC_MESSAGES = 'Radio Gong Verkehrsmeldungen';
const ICON_TRAFFIC_MESSAGE = '/wp-content/grafiken/verkehrsmeldung-icon-80x75.png';
const TITLE_TRAFFIC_CONTROLS = 'Radio Gong Blitzermeldungen';
const ICON_TRAFFIC_CONTROL = '/wp-content/grafiken/blitzer-icon-80x75.png';

export async function handleRadioGongIntent(handlerInput) {
    /** @type {services.IntentRequest} */
    const request = handlerInput.requestEnvelope.request;
    logger.debug('request', request);

    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    var response;
    await radioGong
        .getPlaylist()
        .then((playlist) => {
            logger.debug('playlist', playlist);
            const entry = playlist.playlist[0];
            const speechOutput = requestAttributes.t('CURRENTLY_PLAYING_MESSAGE', {
                artist: entry.interpret,
                title: entry.title,
            });
            const cardContent = requestAttributes.t('CURRENTLY_PLAYING_MESSAGE', {
                artist: entry.interpret,
                title: entry.title,
                interpolation: { escapeValue: false },
            });
            logger.debug(cardContent);

            // TODO this needs to be handled differently, check radio paradise skill
            const coverUrl = RADIOGONG_IMAGE_URL + entry.cover;
            response = handlerInput.responseBuilder
                .speak(speechOutput)
                .withStandardCard(TITLE, cardContent, coverUrl)
                .getResponse();
        })
        .catch((err) => {
            logger.error(err.stack || err.toString());
            const speechOutput = requestAttributes.t('CANT_GET_DATA_MESSAGE');
            response = handlerInput.responseBuilder.speak(speechOutput).getResponse();
        });

    return response;
}

export async function handleTrafficMessagesIntent(handlerInput) {
    /** @type {services.IntentRequest} */
    const request = handlerInput.requestEnvelope.request;
    logger.debug('request', request);

    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    var response;
    try {
        const traffic = await radioGong.getTraffic();
        logger.debug('traffic messages', traffic.messages);
        const responseData = utils.getTrafficResponseData(
            traffic.messages,
            requestAttributes.t('TRAFFIC_MESSAGES'),
            RADIOGONG_IMAGE_URL + ICON_TRAFFIC_MESSAGE,
        );
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
        response = handlerInput.responseBuilder.speak(speechOutput).getResponse();
    }

    return response;
}

export async function handleTrafficControlsIntent(handlerInput) {
    /** @type {services.IntentRequest} */
    const request = handlerInput.requestEnvelope.request;
    logger.debug('request', request);

    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    var response;
    try {
        const traffic = await radioGong.getTraffic();
        logger.debug('traffic controls', traffic.controls);
        const responseData = utils.getTrafficResponseData(
            traffic.controls,
            requestAttributes.t('TRAFFIC_CONTROLS'),
            RADIOGONG_IMAGE_URL + ICON_TRAFFIC_CONTROL,
        );
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
        response = handlerInput.responseBuilder.speak(speechOutput).getResponse();
    }

    return response;
}
