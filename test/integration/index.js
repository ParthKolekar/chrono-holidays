import { expect } from 'chai';

import chrono from '../..';

describe('Chrono', function() {
    it('still parses normal things', function() {
        expect(chrono.parse('12:00 on Sep 12 2018 UTC'))
            .to.be.parsedAs('12 Sep 2018 12:00:00 UTC');
    });

    it('parses Christmas', function() {
        expect(chrono.parse('Christmas', new Date(2018,1,1)))
            .to.matchYMD('25 Dec 2018');
    });

    it('uses the current year without any ref', function() {
        const current_year = new Date().getFullYear();
        expect(chrono.parse('Christmas')).to.matchYMD('25 Dec ' + current_year);
    });

    it('parses 2018 from ref', function() {
        expect(chrono.parse('Thanksgiving', new Date(2017,1,1)))
            .to.matchYMD('23 Nov 2017');

        expect(chrono.parse('Thanksgiving', new Date(2018,1,1)))
            .to.matchYMD('22 Nov 2018');
    });

    it('parses explicit date', function() {
        expect(chrono.parse('Thanksgiving 2017', new Date(2016,1,1)))
            .to.matchYMD('23 Nov 2017');
    });

    it('parses explicit date with "in"', function() {
        expect(chrono.parse('Thanksgiving in 2018', new Date(2016,1,1)))
            .to.matchYMD('22 Nov 2018');
    });

    it('takes arbitrary whitespace for spaces', function() {
        expect(chrono.parse("Mother's   \t        day", new Date(2018, 1, 1)))
            .to.matchYMD('13 May 2018');
    });

    it('can add new holidays', function() {
        chrono.addHoliday({ name: 'asdf', type: 'abs', month: 3, date: 3 })
        expect(chrono.parse("12:00 on asdf UTC", new Date(2013, 1, 1)))
            .to.be.parsedAs('3 Mar 2013 12:00 UTC');
    });
});
