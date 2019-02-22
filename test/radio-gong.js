'use strict';

const expect = require('chai').expect;
const fs = require('fs');
const radioGong = require('../src/radio-gong');

describe('Radio Gong Website', () => {
    describe('#parsePlaylistBody()', () => {
        it('should parse playlist', () => {
            const body = fs.readFileSync('test/radio-gong-playlist.html');
            const playlist = radioGong.parsePlaylistBody(body);
            expect(playlist).to.have.lengthOf(5);
            expect(playlist[0].artist).to.equal('ROBIN SCHULZ');
            expect(playlist[0].song).to.equal('Speechless (feat. Erika Sirola)');
        });
    });

    describe('#getPlaylist()', () => {
        it('should give songs playing', async function() {
            const playlist = await radioGong.getPlaylist();
            expect(playlist).to.have.lengthOf(5);
            expect(playlist[0].artist).to.be.a('string');
            expect(playlist[0].song).to.be.a('string');
        });
    });

    describe('#parseTrafficBody()', () => {
        it('should parse 0 traffic messages and 1 traffic control', () => {
            const body = fs.readFileSync('test/verkehr_0_blitzer_1.html');
            const traffic = radioGong.parseTrafficBody(body);

            expect(traffic.messages).to.have.length(0);

            expect(traffic.controls).to.have.length(1);
            expect(traffic.controls[0].msg, '1. traffic control').to.equal('B8: Roßbrunn - Richtung Würzburg Mobiler Blitzanhänger "Enforcement-Trailer"');
            expect(traffic.controls[0].date, '1. traffic control').to.equal('18.02.2019');
            expect(traffic.controls[0].time, '1. traffic control').to.equal('08:19');
        });

        it('should parse 0 traffic messages and 5 traffic controls', () => {
            const body = fs.readFileSync('test/verkehr_0_blitzer_5.html');
            const traffic = radioGong.parseTrafficBody(body);

            expect(traffic.messages).to.have.length(0);

            expect(traffic.controls).to.have.length(5);
            expect(traffic.controls[0].msg, '1. traffic control').to.equal('B19 Würzburg: Konrad-Adenauer-Brücke "Enforcement-Trailer" - Stadteinwärts');
            expect(traffic.controls[0].date, '1. traffic control').to.equal('15.02.2019');
            expect(traffic.controls[0].time, '1. traffic control').to.equal('08:35');
            expect(traffic.controls[1].msg, '2. traffic control').to.equal('B19 Estenfeld unter der A7-Autobahnbrücke Richtung Schweinfurt');
            expect(traffic.controls[1].date, '2. traffic control').to.equal('15.02.2019');
            expect(traffic.controls[1].time, '2. traffic control').to.equal('09:32');
            expect(traffic.controls[2].msg, '3. traffic control').to.equal('Kist Unter der Fußgängerbrücke in beide Richtungen');
            expect(traffic.controls[2].date, '3. traffic control').to.equal('15.02.2019');
            expect(traffic.controls[2].time, '3. traffic control').to.equal('09:27');
            expect(traffic.controls[3].msg, '4. traffic control').to.equal('B26 kurz vor Wernfeld Richtung Gemünden');
            expect(traffic.controls[3].date, '4. traffic control').to.equal('15.02.2019');
            expect(traffic.controls[3].time, '4. traffic control').to.equal('09:23');
            expect(traffic.controls[4].msg, '5. traffic control').to.equal('Rieneck am Dürnhof Richtung Burgsinn');
            expect(traffic.controls[4].date, '5. traffic control').to.equal('15.02.2019');
            expect(traffic.controls[4].time, '5. traffic control').to.equal('08:31');
        });

        it('should parse 1 traffic message and 2 traffic controls', () => {
            const body = fs.readFileSync('test/verkehr_1_blitzer_2.html');
            const traffic = radioGong.parseTrafficBody(body);

            expect(traffic.messages).to.have.length(1);
            expect(traffic.messages[0].msg, '1. traffic message').to.equal('A7 Würzburg Richtung Fulda zwischen Hammelburg und Bad Kissingen/Oberthulba Stau, rechter Fahrstreifen gesperrt, defekter LKW, mittlerer Fahrstreifen gesperrt, benutzen Sie den linken Fahrstreifen, Reinigungsarbeiten, bis 18.02.2019 ca. 15:45 Uhr');
            expect(traffic.messages[0].date, '1. traffic message').to.equal('18.02.2019');
            expect(traffic.messages[0].time, '1. traffic message').to.equal('14:01');

            expect(traffic.controls).to.have.length(2);
            expect(traffic.controls[0].msg, '1. traffic control').to.equal('B8: Roßbrunn - Richtung Würzburg Mobiler Blitzanhänger "Enforcement-Trailer"');
            expect(traffic.controls[0].date, '1. traffic control').to.equal('18.02.2019');
            expect(traffic.controls[0].time, '1. traffic control').to.equal('08:19');
            expect(traffic.controls[1].msg, '2. traffic control').to.equal('Blitzer Würzburg Nordtangente 30er Zone von Veitshöchheim kommend');
            expect(traffic.controls[1].date, '2. traffic control').to.equal('18.02.2019');
            expect(traffic.controls[1].time, '2. traffic control').to.equal('14:13');
        });

        it('should parse 1 traffic message and 6 traffic controls', () => {
            const body = fs.readFileSync('test/verkehr_1_blitzer_6.html');
            const traffic = radioGong.parseTrafficBody(body);

            expect(traffic.messages).to.have.length(1);
            expect(traffic.messages[0].msg, '1. traffic message').to.equal('A7 Würzburg Richtung Fulda zwischen Hammelburg und Bad Kissingen/Oberthulba Stau, rechter Fahrstreifen gesperrt, defekter LKW, mittlerer Fahrstreifen gesperrt, benutzen Sie den linken Fahrstreifen, Reinigungsarbeiten, bis 18.02.2019 ca. 15:45 Uhr');
            expect(traffic.messages[0].date, '1. traffic message').to.equal('18.02.2019');
            expect(traffic.messages[0].time, '1. traffic message').to.equal('14:01');

            expect(traffic.controls).to.have.length(6);
            expect(traffic.controls[0].msg, '1. traffic control').to.equal('B8: Roßbrunn - Richtung Würzburg Mobiler Blitzanhänger "Enforcement-Trailer"');
            expect(traffic.controls[0].date, '1. traffic control').to.equal('18.02.2019');
            expect(traffic.controls[0].time, '1. traffic control').to.equal('08:19');
            expect(traffic.controls[1].msg, '2. traffic control').to.equal('Würzburg Y-Spange Richtung Heuchelhof');
            expect(traffic.controls[1].date, '2. traffic control').to.equal('18.02.2019');
            expect(traffic.controls[1].time, '2. traffic control').to.equal('11:18');
            expect(traffic.controls[2].msg, '3. traffic control').to.equal('Würzburg Grombühlstr. bei Brauchbar 30er-Zone');
            expect(traffic.controls[2].date, '3. traffic control').to.equal('18.02.2019');
            expect(traffic.controls[2].time, '3. traffic control').to.equal('12:47');
            expect(traffic.controls[3].msg, '4. traffic control').to.equal('Kürnach Ecke Hauptstraße Übergang Semmelstraße (20er Zone) ortsauswärts');
            expect(traffic.controls[3].date, '4. traffic control').to.equal('18.02.2019');
            expect(traffic.controls[3].time, '4. traffic control').to.equal('11:33');
            expect(traffic.controls[4].msg, '5. traffic control').to.equal('Gemünden Richtung Lohr Ortsdurchfahrt (gegenüber Shell Tankstelle)');
            expect(traffic.controls[4].date, '5. traffic control').to.equal('18.02.2019');
            expect(traffic.controls[4].time, '5. traffic control').to.equal('12:27');
            expect(traffic.controls[5].msg, '6. traffic control').to.equal('Ortseinfahrt Mainstockheim von Kitzingen kommend');
            expect(traffic.controls[5].date, '6. traffic control').to.equal('18.02.2019');
            expect(traffic.controls[5].time, '6. traffic control').to.equal('12:52');
        });

        it('should parse 3 traffic messages and 3 traffic controls', () => {
            const body = fs.readFileSync('test/verkehr_3_blitzer_3.html');
            const traffic = radioGong.parseTrafficBody(body);

            expect(traffic.messages).to.have.length(3);
            expect(traffic.messages[0].msg, '1. traffic message').to.equal('A3 Frankfurt Richtung Würzburg zwischen Würzburg/Kist und Würzburg-Heidingsfeld Gefahr durch einen Reifen auf allen Fahrstreifen, bitte vorsichtig fahren');
            expect(traffic.messages[0].date, '1. traffic message').to.equal('18.02.2019');
            expect(traffic.messages[0].time, '1. traffic message').to.equal('14:40');
            expect(traffic.messages[1].msg, '2. traffic message').to.equal('A3 Nürnberg Richtung Würzburg zwischen Ausfahrt Rottendorf und Würzburg/Randersacker Gefahr durch defekten LKW auf dem Standstreifen, langsam fahren');
            expect(traffic.messages[1].date, '2. traffic message').to.equal('18.02.2019');
            expect(traffic.messages[1].time, '2. traffic message').to.equal('15:00');
            expect(traffic.messages[2].msg, '3. traffic message').to.equal('A7 Würzburg Richtung Fulda zwischen Hammelburg und Bad Kissingen/Oberthulba Stau, rechter Fahrstreifen gesperrt, defekter LKW, mittlerer Fahrstreifen gesperrt, benutzen Sie den linken Fahrstreifen, Reinigungsarbeiten, bis 18.02.2019 ca. 15:45 Uhr');
            expect(traffic.messages[2].date, '3. traffic message').to.equal('18.02.2019');
            expect(traffic.messages[2].time, '3. traffic message').to.equal('14:01');

            expect(traffic.controls).to.have.length(3);
            expect(traffic.controls[0].msg, '1. traffic control').to.equal('B8: Roßbrunn - Richtung Würzburg Mobiler Blitzanhänger "Enforcement-Trailer"');
            expect(traffic.controls[0].date, '1. traffic control').to.equal('18.02.2019');
            expect(traffic.controls[0].time, '1. traffic control').to.equal('08:19');
            expect(traffic.controls[1].msg, '2. traffic control').to.equal('Blitzer Würzburg Nordtangente 30er Zone von Veitshöchheim kommend');
            expect(traffic.controls[1].date, '2. traffic control').to.equal('18.02.2019');
            expect(traffic.controls[1].time, '2. traffic control').to.equal('14:13');
            expect(traffic.controls[2].msg, '3. traffic control').to.equal('Würzburg Höchberger Straße Stadteinwärts');
            expect(traffic.controls[2].date, '3. traffic control').to.equal('18.02.2019');
            expect(traffic.controls[2].time, '3. traffic control').to.equal('14:49');
        });
    });

    describe('#getTraffic()', () => {
        it('should give traffic controls', async function() {
            const traffic = await radioGong.getTraffic();
            expect(traffic.messages).to.exist;
            expect(traffic.controls).to.exist;
        });
    });
});
