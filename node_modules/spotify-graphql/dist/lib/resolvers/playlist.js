"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var poll = require('when/poll');
function playlistResolvers(spotifyApiClient) {
    return {
        tracks: function (playlist, variables) {
            return utils_1.syncedPoll('Playlist.tracks', function () {
                return utils_1.paginatorFromVariables('OffsetPaging', variables)(spotifyApiClient, 'getPlaylistTracks', function (response) { return response.body.items; }, playlist.owner.id, playlist.id).then(function (tracks) {
                    return tracks;
                });
            }, variables.throttle || 5);
        }
    };
}
exports.playlistResolvers = playlistResolvers;
