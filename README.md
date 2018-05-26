chrono-holidays
===

An extension for [chrono](https://github.com/wanasit/chrono) to provide parsing for
holidays.

## Usage
For now, just grab the source and run `yarn build` to get the includable `lib` directory.
This'll be on NPM soon, I promise.

## Why not merge into chrono?
I don't people to have to install holidays if they don't care. Probably the JSON file will
end up getting fairly large.

## Contributing
Commit `yarn.lock`, not `package-lock.json`. Add holidays. Fix bugs. As long as it passes
tests, you're good to go and I'll almost certainly accept your MR.

### Holidays.json
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
