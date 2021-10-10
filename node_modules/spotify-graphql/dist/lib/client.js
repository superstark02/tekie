"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SpotifyWebApi = require('spotify-web-api-node');
function spotifyWebAPIClient(configuration) {
    var spotifyApi = new SpotifyWebApi({
        clientId: configuration.clientId,
        clientSecret: configuration.clientSecret,
        redirectUri: configuration.redirectUri
    });
    spotifyApi.setAccessToken(configuration.accessToken);
    return spotifyApi;
}
exports.spotifyWebAPIClient = spotifyWebAPIClient;
;
