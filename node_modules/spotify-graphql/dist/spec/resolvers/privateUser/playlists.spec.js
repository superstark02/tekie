"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../lib/utils");
var helpers_1 = require("../../helpers");
var index_1 = require("../../../index");
var nock = require("nock");
describe('Resolver : me.playlists', function () {
    var meResponse, mePlaylistsResponse;
    beforeEach(function (done) {
        utils_1.clearCache();
        helpers_1.loadFixture('resolvers.privateUser.me').then(function (data) {
            meResponse = data;
            helpers_1.loadFixture('resolvers.privateUser.playlists.playlists').then(function (data2) { return mePlaylistsResponse = data2; }).then(done);
        });
    });
    nock.disableNetConnect();
    var client = index_1.SpotifyGraphQLClient({
        clientId: "clientId",
        clientSecret: "clientSecret",
        redirectUri: "http://redirectUri.dev",
        accessToken: "accessToken"
    });
    describe('when fetching', function () {
        var meRequest, mePlaylistsRequest;
        beforeEach(function () {
            meRequest = nock('https://api.spotify.com:443')
                .get('/v1/me')
                .reply(200, meResponse);
            mePlaylistsRequest = nock('https://api.spotify.com:443')
                .get('/v1/users/11879785/playlists?limit=50&offset=0')
                .reply(200, mePlaylistsResponse);
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should call promise success callback', function (done) {
            var onSuccess = function (executionResult) {
                var data = executionResult.data;
                expect(data.me.playlists[0].id).toBe('5UqllVe1ZknYIoptNFRueU');
                expect(!!executionResult.errors).toBeFalsy();
                expect(meRequest.isDone()).toBeTruthy();
                expect(mePlaylistsRequest.isDone()).toBeTruthy();
                done();
            };
            var onError = function () { throw 'should not be called'; };
            client.query("\n        query {\n          me {\n            id\n            playlists {\n              id\n            }\n          }\n        }\n       ").then(onSuccess).catch(onError);
        });
    });
});
