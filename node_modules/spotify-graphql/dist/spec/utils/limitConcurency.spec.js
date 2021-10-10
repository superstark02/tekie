"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../lib/utils");
describe('limitConcurency', function () {
    describe('when lock doesnt exists for this name', function () {
        it('should not be locked by default', function () {
            utils_1.limitConcurency('test')(function (lock) {
                expect(lock()).toBeFalsy();
            });
        });
    });
    describe('call lock(true)', function () {
        it('should lock', function () {
            utils_1.limitConcurency('test')(function (lock) {
                lock(true);
            });
            utils_1.limitConcurency('test')(function (lock) {
                expect(lock()).toBeTruthy();
            });
        });
    });
    describe('call lock(true)', function () {
        it('should unlock', function () {
            utils_1.limitConcurency('test')(function (lock) {
                lock(true);
            });
            utils_1.limitConcurency('test')(function (lock) {
                lock(false);
            });
            utils_1.limitConcurency('test')(function (lock) {
                expect(lock()).toBeFalsy();
            });
        });
    });
});
