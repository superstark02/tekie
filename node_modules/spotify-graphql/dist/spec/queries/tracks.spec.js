"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../lib/utils");
var helpers_1 = require("../helpers");
var index_1 = require("../../index");
var nock = require("nock");
describe('Query: tracks(ids: String): [Track]', function () {
    var response;
    beforeEach(function (done) {
        utils_1.clearCache();
        helpers_1.loadFixture('queries.tracks').then(function (data) { return response = data; }).then(done);
    });
    nock.disableNetConnect();
    var client = index_1.SpotifyGraphQLClient({
        clientId: "clientId",
        clientSecret: "clientSecret",
        redirectUri: "http://redirectUri.dev",
        accessToken: "accessToken"
    });
    describe('when fetching existing Tracks', function () {
        var request;
        beforeEach(function () {
            request = nock('https://api.spotify.com:443')
                .get('/v1/tracks?ids=7ouMYWpwJ422jRcDASZB7P%2C4VqPOruhp5EdPBeR92t6lQ%2C2takcwOaAZWiXQijPHIx7B')
                .reply(200, response);
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should call promise success callback', function (done) {
            var onSuccess = function (executionResult) {
                var data = executionResult.data;
                expect(data.tracks[0].name).toBe('Knights Of Cydonia');
                expect(data.tracks[0].id).toBe('7ouMYWpwJ422jRcDASZB7P');
                expect(!!executionResult.errors).toBeFalsy();
                expect(request.isDone()).toBeTruthy();
                done();
            };
            var onError = function () { throw 'should not be called'; };
            client.query("\n        query {\n          tracks(ids: \"7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B\") {\n            id\n            name\n          }\n        }\n       ").then(onSuccess).catch(onError);
        });
    });
});
