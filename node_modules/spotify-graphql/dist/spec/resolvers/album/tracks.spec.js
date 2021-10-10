"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../lib/utils");
var helpers_1 = require("../../helpers");
var index_1 = require("../../../index");
var nock = require("nock");
describe('Resolver : Album.tracks', function () {
    var albumResponse, albumTracksResponse;
    beforeEach(function (done) {
        utils_1.clearCache();
        helpers_1.loadFixture('resolvers.album.tracks.album').then(function (data) {
            albumResponse = data;
            helpers_1.loadFixture('resolvers.album.tracks.albumTracks').then(function (data2) { return albumTracksResponse = data2; }).then(done);
        });
    });
    nock.disableNetConnect();
    var client = index_1.SpotifyGraphQLClient({
        clientId: "clientId",
        clientSecret: "clientSecret",
        redirectUri: "http://redirectUri.dev",
        accessToken: "accessToken"
    });
    describe('when fetching a existing Albums', function () {
        var albumRequest, albumTracksRequest;
        beforeEach(function () {
            albumRequest = nock('https://api.spotify.com:443')
                .get('/v1/albums/382ObEPsp2rxGrnsizN5TX')
                .reply(200, albumResponse);
            albumTracksRequest = nock('https://api.spotify.com:443')
                .get('/v1/albums/382ObEPsp2rxGrnsizN5TX/tracks?limit=50&offset=0')
                .reply(200, albumTracksResponse);
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should call promise success callback', function (done) {
            var onSuccess = function (executionResult) {
                var data = executionResult.data;
                expect(data.album.name).toBe('TRON: Legacy Reconfigured');
                expect(data.album.id).toBe('382ObEPsp2rxGrnsizN5TX');
                expect(data.album.tracks[0].id).toBe('4lteJuSjb9Jt9W1W7PIU2U');
                expect(!!executionResult.errors).toBeFalsy();
                expect(albumRequest.isDone()).toBeTruthy();
                expect(albumTracksRequest.isDone()).toBeTruthy();
                done();
            };
            var onError = function () { throw 'should not be called'; };
            client.query("\n        query {\n          album(id: \"382ObEPsp2rxGrnsizN5TX\") {\n            id\n            name\n            tracks {\n              id\n            }\n          }\n        }\n       ").then(onSuccess).catch(onError);
        });
    });
});
