"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../lib/utils");
var helpers_1 = require("../helpers");
var index_1 = require("../../index");
var nock = require("nock");
describe('Query : artist(id: String): Artist', function () {
    var response;
    beforeEach(function (done) {
        utils_1.clearCache();
        helpers_1.loadFixture('queries.artist.response').then(function (data) { return response = data; }).then(done);
    });
    nock.disableNetConnect();
    var client = index_1.SpotifyGraphQLClient({
        clientId: "clientId",
        clientSecret: "clientSecret",
        redirectUri: "http://redirectUri.dev",
        accessToken: "accessToken"
    });
    describe('when fetching an existing Artist', function () {
        var request;
        beforeEach(function () {
            request = nock('https://api.spotify.com:443')
                .get('/v1/artists/0TnOYISbd1XYRBk9myaseg')
                .reply(200, response);
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should call promise success callback', function (done) {
            var onSuccess = function (executionResult) {
                var data = executionResult.data;
                expect(data.artist.name).toBe('Pitbull');
                expect(data.artist.id).toBe('0TnOYISbd1XYRBk9myaseg');
                expect(data.artist.images[0].url).toBe('https://i.scdn.co/image/d6955bc790b818df4efb719a863e4d26f0c2522b');
                expect(!!executionResult.errors).toBeFalsy();
                expect(request.isDone()).toBeTruthy();
                done();
            };
            var onError = function () { throw 'should not be called'; };
            client.query("\n        query {\n          artist(id: \"0TnOYISbd1XYRBk9myaseg\") {\n            id\n            name\n            images {\n              url\n            }\n          }\n        }\n       ").then(onSuccess).catch(onError);
        });
    });
    describe('when fetching a existing Artist by name', function () {
        var searchResults;
        var johnMayerArtist;
        beforeEach(function (done) {
            utils_1.clearCache();
            helpers_1.loadFixture('queries.artist.searchResults').then(function (data) { return searchResults = data; }).then(function () {
                helpers_1.loadFixture('queries.artist.johnMayerArtist').then(function (data) { return johnMayerArtist = data; }).then(done);
            });
        });
        var requestArtistById;
        var requestArtistByName;
        beforeEach(function () {
            requestArtistById = nock('https://api.spotify.com:443')
                .get('/v1/artists/0hEurMDQu99nJRq8pTxO14')
                .reply(200, johnMayerArtist);
            requestArtistByName = nock('https://api.spotify.com:443')
                .get('/v1/search/?type=artist&q=John%20Mayer')
                .reply(200, searchResults);
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should call promise success callback', function (done) {
            var onSuccess = function (executionResult) {
                var data = executionResult.data;
                expect(data.artist.name).toBe('John Mayer');
                expect(data.artist.id).toBe('0hEurMDQu99nJRq8pTxO14');
                expect(!!executionResult.errors).toBeFalsy();
                expect(requestArtistByName.isDone()).toBeTruthy();
                expect(requestArtistById.isDone()).toBeTruthy();
                done();
            };
            var onError = function () { throw 'should not be called'; };
            client.query("\n        query {\n          artist(name: \"John Mayer\") {\n            id\n            name\n          }\n        }\n       ").then(onSuccess).catch(onError);
        });
    });
    describe('when fetching a non-existing Artist', function () {
        var request;
        beforeEach(function () {
            request = nock('https://api.spotify.com:443')
                .get('/v1/albums/0TnOYISbd1XYRBk9myase')
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
            client.query("\n        query {\n          album(id: \"0TnOYISbd1XYRBk9myase\") {\n            id\n            name\n          }\n        }\n       ").then(onSuccess).catch(onError);
        });
    });
});
