import { Assertion } from 'chai';

before(function() {
    Assertion.addMethod('parsedAs', function(dateString) {
        const parse = this._obj;
        new Assertion(parse).to.be.instanceof(Array);

        const actual = parse[0].start.date();
        const expecd = new Date(dateString);
        this.assert(
            actual.valueOf() === expecd.valueOf(),
            'expected date to be #{exp} but was #{act}',
            'expected date to not be #{act}',
            expecd.toString(),
            actual.toString(),
        );
    });

    Assertion.addMethod('matchYMD', function(dateString, error) {
        const parse = this._obj;
        new Assertion(parse, error).to.be.instanceof(Array);
        new Assertion(parse.length).to.not.equal(0, error + ': no parsing found');
        new Assertion(parse[0], error).to.have.property('start');
        const act = parse[0].start.date();
        const exp = new Date(dateString);
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
        this.assert(
            act.getFullYear() === exp.getFullYear() &&
            act.getUTCMonth() === exp.getUTCMonth() &&
            act.getUTCDate() === exp.getUTCDate(),
            'expected date to be #{exp} but was #{act}',
            'expected date to not be #{act}',
            exp.toLocaleDateString('en-US', options),
            act.toLocaleDateString('en-US', options),
        );
    });

});
