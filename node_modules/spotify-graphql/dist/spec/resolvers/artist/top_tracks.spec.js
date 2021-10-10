"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../lib/utils");
var helpers_1 = require("../../helpers");
var index_1 = require("../../../index");
var nock = require("nock");
describe('Resolver : Artist.top_tracks', function () {
    var artistResponse, artistTopTracksResponse;
    beforeEach(function (done) {
        utils_1.clearCache();
        helpers_1.loadFixture('resolvers.artist.top_tracks.artist').then(function (data) {
            artistResponse = data;
            helpers_1.loadFixture('resolvers.artist.top_tracks.top_tracks').then(function (data2) { return artistTopTracksResponse = data2; }).then(done);
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
        var artistRequest, artistTopTracksRequest;
        beforeEach(function () {
            artistRequest = nock('https://api.spotify.com:443')
                .get('/v1/artists/0TnOYISbd1XYRBk9myaseg')
                .reply(200, artistResponse);
            artistTopTracksRequest = nock('https://api.spotify.com:443')
                .get('/v1/artists/0TnOYISbd1XYRBk9myaseg/top-tracks?country=US')
                .reply(200, artistTopTracksResponse);
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should call promise success callback', function (done) {
            var onSuccess = function (executionResult) {
                var data = executionResult.data;
                expect(data.artist.name).toBe('Pitbull');
                expect(data.artist.id).toBe('0TnOYISbd1XYRBk9myaseg');
                expect(data.artist.top_tracks[0].id).toBe('2bJvI42r8EF3wxjOuDav4r');
                expect(!!executionResult.errors).toBeFalsy();
                expect(artistRequest.isDone()).toBeTruthy();
                expect(artistTopTracksRequest.isDone()).toBeTruthy();
                done();
            };
            var onError = function () { throw 'should not be called'; };
            client.query("\n        query {\n          artist(id: \"0TnOYISbd1XYRBk9myaseg\") {\n            id\n            name\n            top_tracks {\n              id\n            }\n          }\n        }\n       ").then(onSuccess).catch(onError);
        });
    });
});
