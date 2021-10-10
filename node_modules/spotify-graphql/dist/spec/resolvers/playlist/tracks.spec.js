"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../lib/utils");
var helpers_1 = require("../../helpers");
var index_1 = require("../../../index");
var nock = require("nock");
describe('Resolver : Playlist.tracks', function () {
    var playlistResponse, playlistTracksResponse;
    beforeEach(function (done) {
        utils_1.clearCache();
        helpers_1.loadFixture('resolvers.playlist.tracks.playlists').then(function (data) {
            playlistResponse = data;
            helpers_1.loadFixture('resolvers.playlist.tracks.playlistTracks').then(function (data2) { return playlistTracksResponse = data2; }).then(done);
        });
    });
    nock.disableNetConnect();
    var client = index_1.SpotifyGraphQLClient({
        clientId: "clientId",
        clientSecret: "clientSecret",
        redirectUri: "http://redirectUri.dev",
        accessToken: "accessToken"
    });
    describe('when fetching an existing Artist', function () {
        var playlistRequest, playlistTracksRequest;
        beforeEach(function () {
            playlistRequest = nock('https://api.spotify.com:443')
                .get('/v1/users/spotify/playlists/5UqllVe1ZknYIoptNFRueU')
                .reply(200, playlistResponse);
            playlistTracksRequest = nock('https://api.spotify.com:443')
                .get('/v1/users/spotify/playlists/5UqllVe1ZknYIoptNFRueU/tracks?limit=50&offset=0')
                .reply(200, playlistTracksResponse);
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should call promise success callback', function (done) {
            var onSuccess = function (executionResult) {
                var data = executionResult.data;
                expect(data.playlist.name).toBe('This Is: Daft Punk');
                expect(data.playlist.id).toBe('5UqllVe1ZknYIoptNFRueU');
                expect(data.playlist.tracks[0].track.id).toBe('7lQqaqZu0vjxzpdATOIsDt');
                expect(!!executionResult.errors).toBeFalsy();
                expect(playlistRequest.isDone()).toBeTruthy();
                expect(playlistTracksRequest.isDone()).toBeTruthy();
                done();
            };
            var onError = function () { throw 'should not be called'; };
            client.query("\n        query {\n          playlist(id: \"5UqllVe1ZknYIoptNFRueU\", userId: \"spotify\") {\n            id\n            name\n            tracks {\n              track {\n                id\n              }\n            }\n          }\n        }\n       ").then(onSuccess).catch(onError);
        });
    });
});
