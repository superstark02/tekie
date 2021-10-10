"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../lib/utils");
var client_1 = require("../../lib/client");
var nock = require("nock");
describe('safeApiCall', function () {
    beforeEach(function () {
        utils_1.clearCache();
    });
    nock.disableNetConnect();
    var client = client_1.spotifyWebAPIClient({
        "clientId": "clientId",
        "clientSecret": "clientSecret",
        "redirectUri": "http://redirectUri.dev",
        "accessToken": "accessToken"
    });
    describe('when response is 200', function () {
        var request;
        beforeEach(function () {
            request = nock('https://api.spotify.com:443')
                .get('/v1/me')
                .reply(200, {});
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should call promise success callback', function (done) {
            var onSuccess = function () {
                expect(request.isDone()).toBeTruthy();
                done();
            };
            var onError = function () { throw 'should not be called'; };
            utils_1.safeApiCall(client, 'getMe').then(onSuccess).catch(onError);
        });
    });
    describe('when response is an error', function () {
        var request;
        beforeEach(function () {
            request = nock('https://api.spotify.com:443')
                .get('/v1/me')
                .reply(500, {});
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should call promise error callback', function (done) {
            var onError = function () {
                expect(request.isDone()).toBeTruthy();
                done();
            };
            var onSuccess = function () { throw 'should not be called'; };
            utils_1.safeApiCall(client, 'getMe').then(onSuccess).catch(onError);
        });
    });
    describe('when formatter is provided', function () {
        var request;
        beforeEach(function () {
            request = nock('https://api.spotify.com:443')
                .get('/v1/me')
                .reply(200, { results: [1, 2, 3] });
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should apply given formatter on results', function (done) {
            var onSuccess = function (results) {
                expect(results).toEqual([1, 2, 3]);
                expect(request.isDone()).toBeTruthy();
                done();
            };
            var onError = function () { throw 'should not be called'; };
            utils_1.safeApiCall(client, 'getMe', function (response) { return response.body.results; }).then(onSuccess).catch(onError);
        });
    });
});
