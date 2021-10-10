"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
function queries(spotifyApiClient) {
    return {
        playlist: function (root, args, context, info) {
            return utils_1.safeApiCall(spotifyApiClient, 'getPlaylist', null, args.userId, args.id);
        },
        me: function (root, args, context, info) {
            return utils_1.safeApiCall(spotifyApiClient, 'getMe');
        },
        user: function (root, args, context, info) {
            return utils_1.safeApiCall(spotifyApiClient, 'getUser', null, args.id);
        },
        track: function (root, args, context, info) {
            if (args.name) {
                return utils_1.safeApiCall(spotifyApiClient, 'searchTracks', null, args.name).then(function (results) {
                    if (results.tracks && results.tracks.items.length) {
                        var result = results.tracks.items[0];
                        return utils_1.safeApiCall(spotifyApiClient, 'getTrack', null, result.id);
                    }
                    else {
                        return null;
                    }
                });
            }
            else {
                return utils_1.safeApiCall(spotifyApiClient, 'getTrack', null, args.id);
            }
        },
        tracks: function (root, args, context, info) {
            return utils_1.safeApiCall(spotifyApiClient, 'getTracks', function (response) { return response.body.tracks; }, args.ids.split(','));
        },
        audio_features: function (root, args, context, info) {
            return utils_1.safeApiCall(spotifyApiClient, 'getAudioFeaturesForTracks', function (response) { return response.body.audio_features; }, args.trackIds.split(','));
        },
        audio_feature: function (root, args, context, info) {
            return utils_1.safeApiCall(spotifyApiClient, 'getAudioFeaturesForTrack', null, args.trackId);
        },
        artist: function (root, args, context, info) {
            if (args.name) {
                return utils_1.safeApiCall(spotifyApiClient, 'searchArtists', null, args.name).then(function (results) {
                    if (results.artists && results.artists.items.length) {
                        var result = results.artists.items[0];
                        return utils_1.safeApiCall(spotifyApiClient, 'getArtist', null, result.id);
                    }
                    else {
                        return null;
                    }
                });
            }
            else {
                return utils_1.safeApiCall(spotifyApiClient, 'getArtist', null, args.id);
            }
        },
        artists: function (root, args, context, info) {
            return utils_1.safeApiCall(spotifyApiClient, 'getArtists', function (response) { return response.body.artists; }, args.ids.split(','));
        },
        album: function (root, args, context, info) {
            return utils_1.safeApiCall(spotifyApiClient, 'getAlbum', null, args.id);
        },
        albums: function (root, args, context, info) {
            return utils_1.safeApiCall(spotifyApiClient, 'getAlbums', function (response) { return response.body.albums; }, args.ids.split(','));
        },
    };
}
exports.queries = queries;
