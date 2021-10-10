"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../lib/utils");
var helpers_1 = require("../helpers");
var index_1 = require("../../index");
var nock = require("nock");
describe('Query : album(id: String): Album', function () {
    var response;
    beforeEach(function (done) {
        utils_1.clearCache();
        helpers_1.loadFixture('queries.album').then(function (data) { return response = data; }).then(done);
    });
    nock.disableNetConnect();
    var client = index_1.SpotifyGraphQLClient({
        clientId: "clientId",
        clientSecret: "clientSecret",
        redirectUri: "http://redirectUri.dev",
        accessToken: "accessToken"
    });
    describe('when fetching an existing Album', function () {
        var request;
        beforeEach(function () {
            request = nock('https://api.spotify.com:443')
                .get('/v1/albums/4aawyAB9vmqN3uQ7FjRGTy')
                .reply(200, response);
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should call promise success callback', function (done) {
            var onSuccess = function (executionResult) {
                var data = executionResult.data;
                expect(data.album.name).toBe('Global Warming');
                expect(data.album.id).toBe('4aawyAB9vmqN3uQ7FjRGTy');
                expect(data.album.images[0].url).toBe("https://i.scdn.co/image/3edb3f970f4a3af9ef922efd18cdb4dabaf85ced");
                expect(!!executionResult.errors).toBeFalsy();
                expect(request.isDone()).toBeTruthy();
                done();
            };
            var onError = function (e) { throw e; };
            client.query("\n        query {\n          album(id: \"4aawyAB9vmqN3uQ7FjRGTy\") {\n            id\n            name\n            images {\n              url\n            }\n          }\n        }\n       ").then(onSuccess).catch(onError);
        });
    });
    describe('when fetching a non-existing Album', function () {
        var request;
        beforeEach(function () {
            request = nock('https://api.spotify.com:443')
                .get('/v1/albums/1zHlj4dQ8ZAtrayhuDDmk4')
                .reply(404, {
                "error": {
                    "status": 404,
                    "message": "non existing id"
                }
            });
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should call promise success callback with errors', function (done) {
            var onSuccess = function (executionResult) {
                expect(!!executionResult.errors).toBeTruthy();
                expect(request.isDone()).toBeTruthy();
                done();
            };
            var onError = function () { throw 'should not be called'; };
            client.query("\n        query {\n          album(id: \"1zHlj4dQ8ZAtrayhuDDmk4\") {\n            id\n            name\n          }\n        }\n       ").then(onSuccess).catch(onError);
        });
    });
});
