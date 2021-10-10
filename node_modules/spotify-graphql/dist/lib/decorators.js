"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function SpotifyDecorators(client) {
    return {
        SpotifyQuery: function (query) {
            return function (target, propertyKey, descriptor) {
                var originalMethod = descriptor.value;
                descriptor.value = function (variables) {
                    return new Promise(function (resolve, reject) {
                        client.query(query, null, null, variables).then(function (executionResult) {
                            if (!executionResult.errors) {
                                resolve(originalMethod.call(originalMethod, executionResult.data));
                            }
                            else {
                                reject(executionResult.errors);
                            }
                        }, reject).catch(reject);
                    });
                };
                return descriptor;
            };
        }
    };
}
exports.SpotifyDecorators = SpotifyDecorators;
