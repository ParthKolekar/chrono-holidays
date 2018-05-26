import { expect } from 'chai';
import fs from 'fs';

let holidays = null;
describe('holidays.json', function() {
    before(function() {
        holidays = JSON.parse(fs.readFileSync('./lib/holidays.json', 'utf8'));
    });

    it('has all rels first', function() {
        let foundAbs = false;
        holidays.forEach(holiday => {
            const name = holiday.name;

            expect(holiday.type).to.be.oneOf(['rel', 'abs'],
                'only valid holiday types are "rel" and "abs"')
            if (holiday.type === 'rel') {
                expect(foundAbs).to.equal(false,
                    'Error: abs-type found after rel-type for name ' + name);
            } else {
                foundAbs = true;
            }
        });
    });

    it('has everything in order', function() {
        let prev = {
            month: 0,
            index: 0,
        };
        let inRel = true;
        holidays.forEach(holiday => {
            if (inRel && holiday.type === 'abs') {
                inRel = false;
                prev.month = 0;
                prev.index = 0;
            }

            const name = holiday.name;

            expect(holiday.month).to.be.above(prev.month - 1,
                `Error: holiday [${name}]'s month is before previous`);

            let index = 0;
            if (holiday.type === 'rel') {
                // pretend the month always starts on a sunday
                index = (holiday.nth - 1) * 7 + holiday.day;
            } else {
                index = holiday.date;
            }

            if (holiday.month === prev.month) {
                expect(index).to.be.above(prev.index - 1,
                    `Error: holiday [${name}]'s index is before previous`);

            }

            prev.month = holiday.month;
            prev.index = index;
        });
    });
});
