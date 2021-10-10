"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../lib/utils");
var helpers_1 = require("../helpers");
var index_1 = require("../../index");
var nock = require("nock");
describe('Query : playlist(id: String): Playlist', function () {
    var response;
    beforeEach(function (done) {
        utils_1.clearCache();
        helpers_1.loadFixture('queries.playlist').then(function (data) { return response = data; }).then(done);
    });
    nock.disableNetConnect();
    var client = index_1.SpotifyGraphQLClient({
        clientId: "clientId",
        clientSecret: "clientSecret",
        redirectUri: "http://redirectUri.dev",
        accessToken: "accessToken"
    });
    describe('when fetching an existing Playlist', function () {
        var request;
        beforeEach(function () {
            request = nock('https://api.spotify.com:443')
                .get('/v1/users/spotify/playlists/5UqllVe1ZknYIoptNFRueU')
                .reply(200, response);
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should call promise success callback', function (done) {
            var onSuccess = function (executionResult) {
                var data = executionResult.data;
                expect(data.playlist.name).toBe('This Is: Daft Punk');
                expect(data.playlist.id).toBe('5UqllVe1ZknYIoptNFRueU');
                expect(data.playlist.images[0].url).toBe('https://u.scdn.co/images/pl/default/70d4565bfd6f51ad19de67b47cc91c156bf5dacd');
                expect(!!executionResult.errors).toBeFalsy();
                expect(request.isDone()).toBeTruthy();
                done();
            };
            var onError = function () { throw 'should not be called'; };
            client.query("\n        query {\n          playlist(id: \"5UqllVe1ZknYIoptNFRueU\", userId: \"spotify\") {\n            id\n            name\n            images {\n              url\n            }\n          }\n        }\n       ").then(onSuccess).catch(onError);
        });
    });
});
