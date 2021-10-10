"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../lib/utils");
var helpers_1 = require("../../helpers");
var index_1 = require("../../../index");
var nock = require("nock");
describe('Resolver : me.albums', function () {
    var meResponse, meAlbumsResponse;
    beforeEach(function (done) {
        utils_1.clearCache();
        helpers_1.loadFixture('resolvers.privateUser.me').then(function (data) {
            meResponse = data;
            helpers_1.loadFixture('resolvers.privateUser.albums.albums').then(function (data2) { return meAlbumsResponse = data2; }).then(done);
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
        var meRequest, meAlbumsRequest;
        beforeEach(function () {
            meRequest = nock('https://api.spotify.com:443')
                .get('/v1/me')
                .reply(200, meResponse);
            meAlbumsRequest = nock('https://api.spotify.com:443')
                .get('/v1/me/albums?limit=50&offset=0')
                .reply(200, meAlbumsResponse);
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should call promise success callback', function (done) {
            var onSuccess = function (executionResult) {
                var data = executionResult.data;
                expect(data.me.albums[0].album.id).toBe('0RwyuV6gqs9zKVsMUNF73l');
                expect(!!executionResult.errors).toBeFalsy();
                expect(meRequest.isDone()).toBeTruthy();
                expect(meAlbumsRequest.isDone()).toBeTruthy();
                done();
            };
            var onError = function () { throw 'should not be called'; };
            client.query("\n        query {\n          me {\n            id\n            albums {\n              album {\n                id\n              }\n            }\n          }\n        }\n       ").then(onSuccess).catch(onError);
        });
    });
});
