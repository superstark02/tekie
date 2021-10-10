"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../lib/utils");
var helpers_1 = require("../../helpers");
var index_1 = require("../../../index");
var nock = require("nock");
describe('Resolver : me.tracks', function () {
    var meResponse, meTracksResponse;
    beforeEach(function (done) {
        utils_1.clearCache();
        helpers_1.loadFixture('resolvers.privateUser.me').then(function (data) {
            meResponse = data;
            helpers_1.loadFixture('resolvers.privateUser.tracks.tracks').then(function (data2) { return meTracksResponse = data2; }).then(done);
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
        var meRequest, meTracksRequest;
        beforeEach(function () {
            meRequest = nock('https://api.spotify.com:443')
                .get('/v1/me')
                .reply(200, meResponse);
            meTracksRequest = nock('https://api.spotify.com:443')
                .get('/v1/me/tracks?limit=50&offset=0')
                .reply(200, meTracksResponse);
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should call promise success callback', function (done) {
            var onSuccess = function (executionResult) {
                var data = executionResult.data;
                expect(data.me.tracks[0].track.id).toBe('5mey7CLLuFToM2P68Qu1gF');
                expect(!!executionResult.errors).toBeFalsy();
                expect(meRequest.isDone()).toBeTruthy();
                expect(meTracksRequest.isDone()).toBeTruthy();
                done();
            };
            var onError = function () { throw 'should not be called'; };
            client.query("\n        query {\n          me {\n            id\n            tracks {\n              track {\n                id\n              }\n            }\n          }\n        }\n       ").then(onSuccess).catch(onError);
        });
    });
});
