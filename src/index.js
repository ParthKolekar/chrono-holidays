import chrono from 'chrono-node';
import path from 'path';
import fs from 'fs';

const holidays = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'holidays.json'), 'utf8'));
const custom = new chrono.Chrono();


const addHoliday = (pattern, startFn) => {
    const parser = new chrono.Parser();
    parser.pattern = () => new RegExp(pattern.replace(/ /g, '(?:\\s+)'), 'i');
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
    let regex = holiday.name.replace(/\(/g, '(?:')
    regex = regex + '(?:\\s+(?:in\\s+)?(\\d+))?';  // add date parsing
    addHoliday(regex, (ref, match) => {
        let year = 0;
        if (match[1] === undefined) {
            year = ref.getFullYear();
        } else {
            year = parseInt(match[1])
        }

        let date = 0;
        if (holiday.nth > 0) {
            const temp_date = new Date(Date.UTC(
                year, holiday.month - 1, 1,
                0,1,0,0 // 1 minute so i don't have to think about midnight
            ));
            date = (holiday.day - temp_date.getUTCDay() + 7) % 7 + (holiday.nth - 1) * 7 + 1
        } else {
            const temp_date = new Date(Date.UTC(
                year, holiday.month, 0, // will get the last day of holiday.month - 1
                0,1,0,0
            ));
            date = temp_date.getUTCDate() - (temp_date.getUTCDay() - holiday.day + 7) % 7 + (holiday.nth + 1) * 7
        }

        return {
            year: year,
            month: holiday.month,
            day: date,
        };
    });
};
const addNewAbsoluteHoliday = (holiday) => {
    const regex = holiday.name.replace(/\(/g, '(?:')
    addHoliday(regex, () => ({
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
