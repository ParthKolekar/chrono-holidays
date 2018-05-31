import { expect } from 'chai';
import path from 'path';
import fs from 'fs';

import chrono from '../lib/index';

const holidayFiles = fs.readdirSync(path.resolve('.', 'lib', 'holidays')).map(file => {
    const fname = path.resolve('.', 'lib', 'holidays', file);
    return JSON.parse(fs.readFileSync(fname, 'utf8'));
});

describe('holidays match', function() {
    fs.readdirSync(path.resolve(__dirname, 'holidays')).forEach(file => {
        const fname = path.resolve(__dirname, 'holidays', file);
        const entries = JSON.parse(fs.readFileSync(fname, 'utf8'));

        Object.keys(entries).forEach(key => {
            it(`${key} parses to ${entries[key]}`, function() {
                const input = chrono.parse(key);

                const error = `Date error for input "${key}"`;
                expect(input, error).to.matchYMD(entries[key], error);
            });
        });
    });
});
