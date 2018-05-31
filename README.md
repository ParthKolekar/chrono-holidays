chrono-holidays
===
[![pipeline status](https://gitlab.com/rperce/chrono-holidays/badges/master/pipeline.svg)](https://gitlab.com/rperce/chrono-holidays/commits/master)
![npm](https://img.shields.io/npm/dt/chrono-holidays.svg)

An extension for [chrono](https://github.com/wanasit/chrono) to provide parsing for
holidays.

It knows things like `thanksgiving in 2017` and `christmas`!

## Usage
For now, just grab the source and run `yarn build` to get the includable `lib` directory.
This'll be on NPM soon, I promise.

## Why not merge into chrono?
I don't want people to have to install holidays if they don't care. I expect the JSON file
will end up getting fairly large. This doesn't duplicate chrono though, just includes it
and uses its excellent custom parser support.

## So you want even more holidays?
The object you get from importing `chrono-holidays` has an `addHoliday` method that
accepts a holiday in the format in the json files. For example,

```javascript
import chrono from 'chrono-holidays';
chrono.addHoliday({
    name: "robert'?s birthday",
    type: 'abs',
    month: 11,
    date: 5,
});

chrono.parseDate("robert's birthday", new Date(2018,1,1)).toDateString()
// outputs 'Mon Nov 05 2018'
```

## Contributing
Commit `yarn.lock`, not `package-lock.json`. Add holidays. Fix bugs. As long as it passes
tests, you're good to go and I'll almost certainly accept your MR.

Add at least one test for every new holiday by putting a json file in `test/holidays/`
that matches the format of the ones already there (or edit an existing file).

### Holidays json files
There are two types of holidays.

Relative (`"type": "rel"`) holidays are like Thanksgiving, the fourth Thursday of
November. That is, it is identified by a month, day of week, and week count. Day of week
is indexed with 0 for Sunday, the same way JavaSCript's Date uses the `day` field. Months
start with January at 1, and the first week of the month is `"nth": 1`.

Absolute holidays are like Christams, December 25. They are identified by a month and
date.

The name field is actually a regex. Slashes must be escaped twice, since it must be
expressed as a string to be stored in JSON. However, it will be made case-insensitive, and
all literal spaces will be replaced with `/\s+/` to allow for any whitespace, so you
shouldn't need many slashes if any.

### Test json files
The test json files are just an object with input strings (date-qualified) as the keys and
expected dates parsable by `new Date()` as the values. Every entry will be tested against
the custom parser.
