"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../lib/utils");
var helpers_1 = require("../../helpers");
var index_1 = require("../../../index");
var nock = require("nock");
describe('Resolver : user.playlists', function () {
    var userResponse, userPlaylistsResponse;
    beforeEach(function (done) {
        utils_1.clearCache();
        helpers_1.loadFixture('resolvers.publicUser.playlists.user').then(function (data) {
            userResponse = data;
            helpers_1.loadFixture('resolvers.publicUser.playlists.userPlaylists').then(function (data2) { return userPlaylistsResponse = data2; }).then(done);
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
        var userRequest, userPlaylistsRequest;
        beforeEach(function () {
            userRequest = nock('https://api.spotify.com:443')
                .get('/v1/users/11879785')
                .reply(200, userResponse);
            userPlaylistsRequest = nock('https://api.spotify.com:443')
                .get('/v1/users/11879785/playlists?limit=50&offset=0')
                .reply(200, userPlaylistsResponse);
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should call promise success callback', function (done) {
            var onSuccess = function (executionResult) {
                var data = executionResult.data;
                expect(data.user.playlists[0].id).toBe('5UqllVe1ZknYIoptNFRueU');
                expect(!!executionResult.errors).toBeFalsy();
                expect(userRequest.isDone()).toBeTruthy();
                expect(userPlaylistsRequest.isDone()).toBeTruthy();
                done();
            };
            var onError = function () { throw 'should not be called'; };
            client.query("\n        query {\n          user(id: \"11879785\") {\n            id\n            playlists {\n              id\n              name\n            }\n          }\n        }\n       ").then(onSuccess).catch(onError);
        });
    });
});
