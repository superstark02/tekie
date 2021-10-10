"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../lib/utils");
var helpers_1 = require("../../helpers");
var index_1 = require("../../../index");
var nock = require("nock");
describe('Resolver : me.top_tracks', function () {
    var meResponse, meTopTracksResponse;
    beforeEach(function (done) {
        utils_1.clearCache();
        helpers_1.loadFixture('resolvers.privateUser.me').then(function (data) {
            meResponse = data;
            helpers_1.loadFixture('resolvers.privateUser.top_tracks.tracks').then(function (data2) { return meTopTracksResponse = data2; }).then(done);
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
        var meRequest, meTopTracksRequest;
        beforeEach(function () {
            meRequest = nock('https://api.spotify.com:443')
                .get('/v1/me')
                .reply(200, meResponse);
            meTopTracksRequest = nock('https://api.spotify.com:443')
                .get('/v1/me/top/tracks?limit=50&offset=0')
                .reply(200, meTopTracksResponse);
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should call promise success callback', function (done) {
            var onSuccess = function (executionResult) {
                var data = executionResult.data;
                expect(data.me.top_tracks[0].id).toBe('0QpYkajexWrB0P3TWvkHlm');
                expect(!!executionResult.errors).toBeFalsy();
                expect(meRequest.isDone()).toBeTruthy();
                expect(meTopTracksRequest.isDone()).toBeTruthy();
                done();
            };
            var onError = function () { throw 'should not be called'; };
            client.query("\n        query {\n          me {\n            id\n            top_tracks {\n               id\n            }\n          }\n        }\n       ").then(onSuccess).catch(onError);
        });
    });
});
