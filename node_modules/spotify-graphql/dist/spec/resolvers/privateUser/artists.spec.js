"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../lib/utils");
var helpers_1 = require("../../helpers");
var index_1 = require("../../../index");
var nock = require("nock");
describe('Resolver : me.artists', function () {
    var meResponse, meArtistsResponse;
    beforeEach(function (done) {
        utils_1.clearCache();
        helpers_1.loadFixture('resolvers.privateUser.me').then(function (data) {
            meResponse = data;
            helpers_1.loadFixture('resolvers.privateUser.artists.artists').then(function (data2) { return meArtistsResponse = data2; }).then(done);
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
        var meRequest, meTopArtistsRequest;
        beforeEach(function () {
            meRequest = nock('https://api.spotify.com:443')
                .get('/v1/me')
                .reply(200, meResponse);
            meTopArtistsRequest = nock('https://api.spotify.com:443')
                .get('/v1/me/following?type=artist')
                .reply(200, meArtistsResponse);
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should call promise success callback', function (done) {
            var onSuccess = function (executionResult) {
                var data = executionResult.data;
                expect(data.me.artists[0].id).toBe('04gDigrS5kc9YWfZHwBETP');
                expect(!!executionResult.errors).toBeFalsy();
                expect(meRequest.isDone()).toBeTruthy();
                expect(meTopArtistsRequest.isDone()).toBeTruthy();
                done();
            };
            var onError = function (e) { throw e; };
            client.query("\n        query {\n          me {\n            id\n            artists {\n               id\n            }\n          }\n        }\n       ").then(onSuccess).catch(onError);
        });
    });
});
