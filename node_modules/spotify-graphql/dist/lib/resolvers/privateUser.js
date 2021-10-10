"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
function privateUserResolvers(spotifyApiClient) {
    return {
        tracks: function (user, variables) {
            return utils_1.paginatorFromVariables('OffsetPaging', variables)(spotifyApiClient, 'getMySavedTracks', function (response) { return response.body.items; });
        },
        playlists: function (user, variables) {
            return utils_1.paginatorFromVariables('OffsetPaging', variables)(spotifyApiClient, 'getUserPlaylists', function (response) { return response.body.items; }, user.id);
        },
        albums: function (user, variables) {
            return utils_1.paginatorFromVariables('OffsetPaging', variables)(spotifyApiClient, 'getMySavedAlbums', function (response) { return response.body.items; });
        },
        top_tracks: function (user, variables) {
            return utils_1.paginatorFromVariables('OffsetPaging', variables)(spotifyApiClient, 'getMyTopTracks', function (response) { return response.body.items; });
        },
        top_artists: function (user, variables) {
            return utils_1.paginatorFromVariables('OffsetPaging', variables)(spotifyApiClient, 'getMyTopArtists', function (response) { return response.body.items; });
        },
        artists: function (user, variables) {
            return utils_1.paginatorFromVariables('CursorPaging', variables)(spotifyApiClient, 'getFollowedArtists', function (response) { return response.body.artists.items; });
        },
        devices: function (user, variables) {
            return utils_1.apiRequest(spotifyApiClient)('https://api.spotify.com/v1/me/player/devices', {}, function (response) { return response.devices; });
        },
        player: function (user, variables) {
            return utils_1.apiRequest(spotifyApiClient)('https://api.spotify.com/v1/me/player');
        },
    };
}
exports.privateUserResolvers = privateUserResolvers;
