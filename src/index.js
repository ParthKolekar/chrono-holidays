import chrono from 'chrono-node';
import path from 'path';
import fs from 'fs';

const holidays = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'holidays.json'), 'utf8'));
const custom = new chrono.Chrono();


const addHoliday = (pattern, startFn) => {
    const parser = new chrono.Parser();
    parser.pattern = () => new RegExp(pattern, 'i');
    parser.extract = (text, ref, match, opt) => {
        return new chrono.ParsedResult({
            ref: ref,
            text: match[0],
            index: match.index,
            start: startFn(ref, match),
        });
    };

    custom.parsers.push(parser);
};

const addNewRelativeHoliday = (holiday) => {
    const regex = holiday.name + '(?:\\s+(?:in\\s+)?(\\d+))?';
    addHoliday(regex, (ref, match) => {
        let year = 0;
        if (match[1] === undefined) {
            year = ref.getFullYear();
        } else {
            year = parseInt(match[1])
        }
        const temp_date = new Date();
        temp_date.setFullYear(year);
        temp_date.setMonth(holiday.month);
        temp_date.setDate(0);
        const date = (holiday.day - temp_date.getDay()) + (holiday.nth - 1) * 7
        temp_date.setDate(date);

        return {
            month: holiday.month,
            day: temp_date.getDate() + 1,
        };
    });
};
const addNewAbsoluteHoliday = (holiday) => {
    addHoliday(holiday.name, () => ({
        month: holiday.month,
        day: holiday.date,
    }));
};

holidays.forEach(holiday => {
    if (holiday.type === 'rel')
        addNewRelativeHoliday(holiday);
    else
        addNewAbsoluteHoliday(holiday);
});

export default custom;
