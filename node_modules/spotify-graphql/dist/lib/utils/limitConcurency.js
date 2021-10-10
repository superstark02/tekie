"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var locks = {};
var counter = {};
function limitConcurency(name) {
    if (lodash_1.isUndefined(locks[name])) {
        locks[name] = false;
        counter[name] = 0;
    }
    return function (context) {
        counter[name]++;
        function lockGetterSetter(lock) {
            if (typeof lock !== 'undefined') {
                if (lock === false) {
                    counter[name]--;
                }
                locks[name] = lock;
            }
            else {
                return locks[name];
            }
        }
        return context(lockGetterSetter);
    };
}
exports.limitConcurency = limitConcurency;
