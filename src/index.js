import chrono from 'chrono-node';
import path from 'path';
import file from 'file';
import fs from 'fs';

const custom = new chrono.Chrono();

const regexFromName = (name) => (name
    .replace(/ /g, '(\\s+)')            // space to whitespace
    .replace(/\(/g, '(?:')              // all groups non-capturing
    + '(?:\\s+(?:in\\s+)?(\\d+))?'      // add date parsing
);

const determineYear = (ref, match) => {
    if (match[1] === undefined)
        return ref.getFullYear();

    return parseInt(match[1])
};

const determineDate = (year, holiday) => {
    if (holiday.type === 'abs')
        return holiday.date;

    if (holiday.nth > 0) {
        const temp_date = new Date(Date.UTC(
            year, holiday.month - 1, 1,
            0,1,0,0 // 1 minute so i don't have to think about midnight
        ));
        return (holiday.day - temp_date.getUTCDay() + 7) % 7 + (holiday.nth - 1) * 7 + 1;
    }

    const temp_date = new Date(Date.UTC(
        year, holiday.month, 0, // will get the last day of holiday.month - 1
        0,1,0,0
    ));
    return temp_date.getUTCDate() - (temp_date.getUTCDay() - holiday.day + 7) % 7 + (holiday.nth + 1) * 7;
};

chrono.Chrono.prototype.addHoliday = function(holiday) {
    const parser = new chrono.Parser();
    parser.pattern = () => new RegExp(regexFromName(holiday.name), 'i');
    parser.extract = (text, ref, match, opt) => {
        const year = determineYear(ref, match);
        const date = determineDate(year, holiday);

        return new chrono.ParsedResult({
            ref: ref,
            pattern: parser.pattern(),
            text: match[0],
            index: match.index,
            start: {
                year: year,
                month: holiday.month,
                day: date,
            },
        });
    };

    this.parsers.push(parser);
};

fs.readdir(path.resolve(__dirname, 'holidays'), (err, files) => {
    files.forEach(holidaysFile => {
        const filename = path.resolve(__dirname, 'holidays', holidaysFile);
        const holidays = JSON.parse(fs.readFileSync(filename, 'utf8'));
        holidays.forEach(holiday => {
            custom.addHoliday(holiday);
        });
    });
});

module.exports = custom;
export default custom;
