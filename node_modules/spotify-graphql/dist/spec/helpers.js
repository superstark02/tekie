"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
function loadFixture(name) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path.resolve(__filename, "../fixtures/" + name + ".json"), function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                try {
                    resolve(JSON.parse(data.toString()));
                }
                catch (error) {
                    reject(error);
                }
            }
        });
    });
}
exports.loadFixture = loadFixture;
