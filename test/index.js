import { expect } from 'chai';

import chrono from '../lib/index';

describe('Chrono', function() {
    it('still parses normal things', function() {
        expect(chrono.parse('12:00 on Sep 12 2018 UTC'))
            .to.be.parsedAs('12 Sep 2018 12:00:00 UTC');
    });

    it('parses Christmas', function() {
        expect(chrono.parse('12:00 on Christmas UTC', new Date(2018,1,1)))
            .to.be.parsedAs('25 Dec 2018 12:00:00 UTC');
    });

    it('parses 2017 from ref', function() {
        expect(chrono.parse('12:00 on Thanksgiving UTC', new Date(2017,1,1)))
            .to.be.parsedAs('23 Nov 2017 12:00:00 UTC');
    });

    it('parses 2018 from ref', function() {
        expect(chrono.parse('12:00 on Thanksgiving UTC', new Date(2018,1,1)))
            .to.be.parsedAs('22 Nov 2018 12:00:00 UTC');
    });

    it('parses explicit 2017 date', function() {
        expect(chrono.parse('12:00 on Thanksgiving 2017 UTC', new Date(2016,1,1)))
            .to.be.parsedAs('23 Nov 2017 12:00:00 UTC');
    });

    it('parses explicit 2018 date', function() {
        expect(chrono.parse('12:00 on Thanksgiving in 2018 UTC', new Date(2016,1,1)))
            .to.be.parsedAs('22 Nov 2018 12:00:00 UTC');
    });

    it('takes arbitrary whitespace for spaces', function() {
        expect(chrono.parse("12:00 on Mother's   \t        day UTC", new Date(2018, 1, 1)))
            .to.be.parsedAs('13 May 2018 12:00 UTC');
    });
});
