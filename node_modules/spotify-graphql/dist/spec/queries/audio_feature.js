"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../lib/utils");
var helpers_1 = require("../helpers");
var index_1 = require("../../index");
var nock = require("nock");
describe('Query: audio_feature(trackId: String): AudioFeatures', function () {
    var response;
    beforeEach(function (done) {
        utils_1.clearCache();
        helpers_1.loadFixture('queries.audio_feature').then(function (data) { return response = data; }).then(done);
    });
    nock.disableNetConnect();
    var client = index_1.SpotifyGraphQLClient({
        clientId: "clientId",
        clientSecret: "clientSecret",
        redirectUri: "http://redirectUri.dev",
        accessToken: "accessToken"
    });
    describe('when fetching AudioFeatures for existing Tracks', function () {
        var request;
        beforeEach(function () {
            request = nock('https://api.spotify.com:443')
                .get('/v1/audio-features/7ouMYWpwJ422jRcDASZB7P')
                .reply(200, response);
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should call promise success callback', function (done) {
            var onSuccess = function (executionResult) {
                var data = executionResult.data;
                expect(data.audio_feature.id).toBe('7ouMYWpwJ422jRcDASZB7P');
                expect(data.audio_feature.danceability).toBe('0.366');
                expect(!!executionResult.errors).toBeFalsy();
                expect(request.isDone()).toBeTruthy();
                done();
            };
            var onError = function () { throw 'should not be called'; };
            client.query("\n        query {\n          audio_feature(trackId: \"7ouMYWpwJ422jRcDASZB7P\") {\n            id\n            danceability\n          }\n        }\n       ").then(onSuccess).catch(onError);
        });
    });
});
