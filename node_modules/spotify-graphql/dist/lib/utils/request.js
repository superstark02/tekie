"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
function apiRequest(spotifyApiClient) {
    return function (url, params, formatter) {
        var options = {
            url: url,
            qs: params || {},
            headers: {
                Authorization: "Bearer " + spotifyApiClient._credentials.accessToken,
            }
        };
        return new Promise(function (resolve, reject) {
            request(options, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var json = JSON.parse(body);
                    resolve(!!formatter ? formatter(json) : json);
                }
                else {
                    try {
                        var json = JSON.parse(body);
                        if (json.error) {
                            reject(json.error);
                        }
                        else {
                            reject(error);
                        }
                    }
                    catch (e) {
                        reject(error);
                    }
                }
            });
        });
    };
}
exports.apiRequest = apiRequest;
