"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
function albumResolvers(spotifyApiClient) {
    return {
        artists: function (album) {
            return album.artists;
        },
        tracks: function (album, variables) {
            return utils_1.syncedPoll('Album.tracks', function () {
                return utils_1.paginatorFromVariables('OffsetPaging', variables)(spotifyApiClient, 'getAlbumTracks', function (response) { return response.body.items; }, album.id).then(function (tracks) {
                    return tracks;
                });
            }, variables.throttle || 2);
        }
    };
}
exports.albumResolvers = albumResolvers;
