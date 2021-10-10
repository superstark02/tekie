"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var _ = require("lodash");
var sequence = require('when/sequence');
function trackResolvers(spotifyApiClient) {
    return {
        artists: function (track, variables) {
            if (!!variables.full) {
                return utils_1.syncedPoll('Track.artists', function () {
                    return new Promise(function (resolve, reject) {
                        var queries = _(track.artists).
                            map('id').
                            compact().
                            chunk(50).
                            map(function (idsToQuery) {
                            return function () {
                                return utils_1.safeApiCall(spotifyApiClient, 'getArtists', function (response) { return response.body.artists; }, idsToQuery);
                            };
                        });
                        sequence(Array.from(queries)).then(function (results) {
                            resolve(_(results).flatten());
                        }, function (e) {
                            reject(e);
                        });
                    });
                }, variables.throttle || 5);
            }
            else {
                return track.artists;
            }
        },
        album: function (track, variables) {
            if (!!variables.full) {
                return utils_1.syncedPoll('Track.album', function () {
                    return utils_1.safeApiCall(spotifyApiClient, 'getAlbum', null, track.album.id).then(function (album) {
                        return album;
                    });
                }, variables.throttle || 5);
            }
            else {
                return Promise.resolve(track.album);
            }
        },
        audio_features: function (track) {
            return utils_1.safeApiCall(spotifyApiClient, 'getAudioFeaturesForTrack', null, track.id);
        }
    };
}
exports.trackResolvers = trackResolvers;
