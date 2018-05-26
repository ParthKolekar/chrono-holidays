import { expect } from 'chai';
import path from 'path';
import fs from 'fs';

import chrono from '../lib/index';

let holidayFiles = [];
describe('holidays match', function() {
    before(function() {
        holidayFiles = fs.readdirSync(path.resolve('.', 'lib', 'holidays')).map(file => {
            const fname = path.resolve('.', 'lib', 'holidays', file);
            return JSON.parse(fs.readFileSync(fname, 'utf8'));
        });
    });

    it('each entry in test passes', function() {
        fs.readdirSync(path.resolve(__dirname, 'holidays')).forEach(file => {
            const fname = path.resolve(__dirname, 'holidays', file);
            const entries = JSON.parse(fs.readFileSync(fname, 'utf8'));

            Object.keys(entries).forEach(key => {
                const input = chrono.parse(key);

                const error = `Date error for input "${key}"`;
                expect(input, error).to.matchYMD(entries[key], error);
            });
        });
    });
});
