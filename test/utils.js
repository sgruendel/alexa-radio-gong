'use strict';

const expect = require('chai').expect;
const utils = require('../src/utils');

describe('utils', () => {
    describe('#getTrafficResponseData()', () => {
        it('should work for no messages', () => {
            const messages = [];
            const result = utils.getTrafficResponseData(messages, '', '');
            expect(result.listItems).to.have.lengthOf(0);
            expect(result.speechOutputText).to.be.undefined;
            expect(result.cardContentText).to.be.undefined;
        });
    });

    describe('#getTrafficResponseData()', () => {
        it('should work for one message', () => {
            const messages = [ { msg: 'eins', date: '29.11.2019', time: '10:09' } ];
            const description = 'description';
            const backgroundImageUrl = '/icon.jpg';
            const result = utils.getTrafficResponseData(messages, description, backgroundImageUrl);
            expect(result.listItems).to.have.lengthOf(1);

            expect(result.listItems[0].backgroundImage.sources[0].url, 'backgroundImageUrl').to.equal(backgroundImageUrl);
            expect(result.listItems[0].textContent.primaryText.text, 'primaryText').to.equal('eins');
            expect(result.listItems[0].textContent.secondaryText.text, 'secondaryText').to.equal('29.11.2019 10:09');

            expect(result.speechOutputText, 'speechOutputText').to.equal('eins.');
            expect(result.cardContentText, 'cardContentText').to.equal('eins.');
        });
    });

    describe('#getTrafficResponseData()', () => {
        it('should work for two messages', () => {
            const messages = [
                { msg: 'eins', date: '29.11.2019', time: '10:09' },
                { msg: 'zwei', date: '29.11.2019', time: '10:42' },
            ];
            const description = 'description';
            const backgroundImageUrl = '/icon.jpg';
            const result = utils.getTrafficResponseData(messages, description, backgroundImageUrl);
            expect(result.listItems).to.have.lengthOf(2);

            expect(result.listItems[0].backgroundImage.sources[0].url, 'backgroundImageUrl').to.equal(backgroundImageUrl);
            expect(result.listItems[0].textContent.primaryText.text, 'primaryText').to.equal('eins');
            expect(result.listItems[0].textContent.secondaryText.text, 'secondaryText').to.equal('29.11.2019 10:09');

            expect(result.speechOutputText, 'speechOutputText').to.equal('eins. zwei.');
            expect(result.cardContentText, 'cardContentText').to.equal('eins.\n\nzwei.');
        });
    });
});
