'use strict';

const Alexa = require('ask-sdk-core');

var exports = module.exports = {};

exports.getTrafficResponseData = function(requestAttributes, msgs, noMessagesKey, messagesKey) {
    var speechOutput;
    var cardContent;
    var listItems;

    if (msgs.length === 0) {
        speechOutput = requestAttributes.t(noMessagesKey);
        cardContent = speechOutput;
        listItems = [];
    } else {
        speechOutput = requestAttributes.t(messagesKey, {
            text: msgs.reduce(
                (result, message) => result + message.msg + '. ',
                ''),
        });
        cardContent = requestAttributes.t(messagesKey, {
            text: msgs.reduce(
                (result, message) => result + message.msg + '.\n\n',
                ''),
            interpolation: { escapeValue: false },
        });
        listItems = msgs.map(message => {
            return {
                // image:
                backgroundImage: new Alexa.ImageHelper()
                    .withDescription('Verkehrsmeldungen')
                    .addImageInstance('https://www.radiogong.com/wp-content/grafiken/verkehrsmeldung-icon-80x75.png', 'X_SMALL', 80, 75)
                    .getImage(),
                textContent: new Alexa.PlainTextContentHelper()
                    .withPrimaryText(message.msg)
                    .withSecondaryText(message.date + ' ' + message.time)
                    .getTextContent(),
            };
        });
    }
    return { speechOutput: speechOutput, cardContent: cardContent, listItems: listItems };
};
