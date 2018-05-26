import { expect, Assertion } from 'chai';

import chrono from '../lib/index';

Assertion.addMethod('parsedAs', function(dateString) {
    const parse = this._obj;
    new Assertion(parse).to.be.instanceof(Array);

    const actual = parse[0].start.date();
    const expecd = new Date(dateString);
    this.assert(
        actual.valueOf() === expecd.valueOf(),
        'expected #{this} to be #{exp} but was #{act}',
        'expected #{this} to not be #{act}',
        expecd.toString(),
        actual.toString(),
    );
});

describe('Chrono', function() {
    it('still parses normal things', function() {
        expect(chrono.parse('12:00 on Sep 12 2018 UTC'))
            .to.be.parsedAs('12 Sep 2018 12:00:00 UTC');
    });

    it('parses Christmas', function() {
        expect(chrono.parse('12:00 on Christmas UTC', new Date(2018,1,1)))
            .to.be.parsedAs('25 Dec 2018 12:00:00 UTC');
    });

    it('parses Thanksgiving 2017 from ref', function() {
        expect(chrono.parse('12:00 on Thanksgiving UTC', new Date(2017,1,1)))
            .to.be.parsedAs('23 Nov 2017 12:00:00 UTC');
    });

    it('parses Thanksgiving 2018 from ref', function() {
        expect(chrono.parse('12:00 on Thanksgiving UTC', new Date(2018,1,1)))
            .to.be.parsedAs('22 Nov 2018 12:00:00 UTC');
    });

    it('parses Thanksgiving 2017 explicit', function() {
        expect(chrono.parse('12:00 on Thanksgiving 2017 UTC', new Date(2017,1,1)))
            .to.be.parsedAs('23 Nov 2017 12:00:00 UTC');
    });

    it('parses Thanksgiving 2018 explicit', function() {
        expect(chrono.parse('12:00 on Thanksgiving in 2018 UTC', new Date(2018,1,1)))
            .to.be.parsedAs('22 Nov 2018 12:00:00 UTC');
    });

});
