import Alexa from 'ask-sdk-core';

export function getTrafficResponseData(msgs, description, backgroundImageUrl) {
    var listItems;
    var speechOutputText;
    var cardContentText;

    if (msgs.length === 0) {
        listItems = [];
        speechOutputText = undefined;
        cardContentText = undefined;
    } else {
        speechOutputText = msgs.reduce(
            (result, message, i) => result + message.msg + (i + 1 < msgs.length ? '. ' : '.'),
            '',
        );
        cardContentText = msgs.reduce(
            (result, message, i) => result + message.msg + (i + 1 < msgs.length ? '.\n\n' : '.'),
            '',
        );
        listItems = msgs.map((message) => {
            return {
                // image:
                backgroundImage: new Alexa.ImageHelper()
                    .withDescription(description)
                    .addImageInstance(backgroundImageUrl, 'X_SMALL', 80, 75)
                    .getImage(),
                textContent: new Alexa.PlainTextContentHelper()
                    .withPrimaryText(message.msg)
                    .withSecondaryText(message.date + ' ' + message.time)
                    .getTextContent(),
            };
        });
    }
    return { listItems, speechOutputText, cardContentText };
}
