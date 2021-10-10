"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var utils_2 = require("../utils");
function artistResolvers(spotifyApiClient) {
    return {
        top_tracks: function (artist, variables) {
            return utils_2.safeApiCall(spotifyApiClient, 'getArtistTopTracks', function (response) { return response.body.tracks; }, artist.id, variables.country || 'US');
        },
        albums: function (artist, variables) {
            return utils_1.paginatorFromVariables('OffsetPaging', variables)(spotifyApiClient, 'getArtistAlbums', function (response) { return response.body.items; }, artist.id, variables.album_type ? { album_type: variables.album_type } : {});
        },
        related_artists: function (artist, variables) {
            return utils_2.safeApiCall(spotifyApiClient, 'getArtistRelatedArtists', function (response) { return response.body.artists; }, artist.id);
        }
    };
}
exports.artistResolvers = artistResolvers;
