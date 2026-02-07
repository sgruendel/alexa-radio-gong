const Alexa = require('ask-sdk-core');
const i18next = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
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

// as index.cjs is CommonJS, we need to use the asynchronous import()
const handlersPromise = import('./handlers.js');

const SKILL_ID = 'amzn1.ask.skill.8b0359cd-df17-46f0-b1fa-509d6e9ca1cc';

const languageStrings = {
    de: {
        translation: {
            HELP_MESSAGE:
                'Du kannst sagen „Öffne Mein Heimvorteil“ und ich sage dir was gerade auf Radio Gong Würzburg läuft.',
            STOP_MESSAGE: '<say-as interpret-as="interjection">bis dann</say-as>.',
            NOT_UNDERSTOOD_MESSAGE: 'Entschuldigung, das verstehe ich nicht. Bitte wiederhole das?',
            CURRENTLY_PLAYING_MESSAGE: 'Du hörst gerade {{title}} von {{artist}}.',
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
i18next.use(sprintf).init({
    overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
    resources: languageStrings,
    returnObjects: true,
});

const RadioGongIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return (
            request.type === 'LaunchRequest' ||
            (request.type === 'IntentRequest' && request.intent.name === 'RadioGongIntent')
        );
    },
    async handle(handlerInput) {
        return (await handlersPromise).handleRadioGongIntent(handlerInput);
    },
};

const TrafficMessagesIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'TrafficMessagesIntent';
    },
    async handle(handlerInput) {
        return (await handlersPromise).handleTrafficMessagesIntent(handlerInput);
    },
};

const TrafficControlsIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'TrafficControlsIntent';
    },
    async handle(handlerInput) {
        return (await handlersPromise).handleTrafficControlsIntent(handlerInput);
    },
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        logger.debug('request', request);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder.speak(requestAttributes.t('HELP_MESSAGE')).getResponse();
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
        return handlerInput.responseBuilder.speak(requestAttributes.t('HELP_MESSAGE')).getResponse();
    },
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return (
            request.type === 'IntentRequest' &&
            (request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent')
        );
    },
    handle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        logger.debug('request', request);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechOutput = requestAttributes.t('STOP_MESSAGE');
        return handlerInput.responseBuilder.speak(speechOutput).getResponse();
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
        return handlerInput.responseBuilder.speak(speechOutput).reprompt(speechOutput).getResponse();
    },
};

const LocalizationInterceptor = {
    process(handlerInput) {
        i18next.changeLanguage(Alexa.getLocale(handlerInput.requestEnvelope));

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = (...args) => {
            // @ts-ignore
            return i18next.t(...args);
        };
    },
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        RadioGongIntentHandler,
        TrafficMessagesIntentHandler,
        TrafficControlsIntentHandler,
        FallbackIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
    )
    .addRequestInterceptors(LocalizationInterceptor)
    .addErrorHandlers(ErrorHandler)
    .withApiClient(new Alexa.DefaultApiClient())
    .withSkillId(SKILL_ID)
    .lambda();
