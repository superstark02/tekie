"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../lib/utils");
var helpers_1 = require("../../helpers");
var index_1 = require("../../../index");
var nock = require("nock");
describe('Resolver : Artist.albums', function () {
    beforeEach(function () {
        utils_1.clearCache();
    });
    describe('without album_type not provided', function () {
        var artistResponse, artistAlbums;
        beforeEach(function (done) {
            helpers_1.loadFixture('resolvers.artist.albums.artist').then(function (data) {
                artistResponse = data;
                helpers_1.loadFixture('resolvers.artist.albums.albums').then(function (data2) { return artistAlbums = data2; }).then(done);
            });
        });
        nock.disableNetConnect();
        var client = index_1.SpotifyGraphQLClient({
            clientId: "clientId",
            clientSecret: "clientSecret",
            redirectUri: "http://redirectUri.dev",
            accessToken: "accessToken"
        });
        describe('when fetching an existing Artist', function () {
            var artistRequest, artistAlbumsRequest;
            beforeEach(function () {
                artistRequest = nock('https://api.spotify.com:443')
                    .get('/v1/artists/4Nrd0CtP8txoQhnnlRA6V6')
                    .reply(200, artistResponse);
                artistAlbumsRequest = nock('https://api.spotify.com:443')
                    .get('/v1/artists/4Nrd0CtP8txoQhnnlRA6V6/albums?limit=50&offset=0')
                    .reply(200, artistAlbums);
            });
            afterEach(function () {
                nock.cleanAll();
            });
            it('should call promise success callback', function (done) {
                var onSuccess = function (executionResult) {
                    var data = executionResult.data;
                    expect(data.artist.name).toBe('Vianney');
                    expect(data.artist.id).toBe('4Nrd0CtP8txoQhnnlRA6V6');
                    expect(data.artist.albums[0].id).toBe('3sb3TaTkw7pdVD2V5cSBGi');
                    expect(!!executionResult.errors).toBeFalsy();
                    expect(artistRequest.isDone()).toBeTruthy();
                    expect(artistAlbumsRequest.isDone()).toBeTruthy();
                    done();
                };
                var onError = function () { throw 'should not be called'; };
                client.query("\n          query {\n            artist(id: \"4Nrd0CtP8txoQhnnlRA6V6\") {\n              id\n              name\n              albums {\n                id\n              }\n            }\n          }\n        ").then(onSuccess).catch(onError);
            });
        });
    });
    describe('with album_type = "album"', function () {
        var artistResponse, artistAlbums;
        beforeEach(function (done) {
            helpers_1.loadFixture('resolvers.artist.albums.album_type.artist').then(function (data) {
                artistResponse = data;
                helpers_1.loadFixture('resolvers.artist.albums.album_type.albums').then(function (data2) { return artistAlbums = data2; }).then(done);
            });
        });
        nock.disableNetConnect();
        var client = index_1.SpotifyGraphQLClient({
            clientId: "clientId",
            clientSecret: "clientSecret",
            redirectUri: "http://redirectUri.dev",
            accessToken: "accessToken"
        });
        describe('when fetching an existing Artist', function () {
            var artistRequest, artistAlbumsRequest;
            beforeEach(function () {
                artistRequest = nock('https://api.spotify.com:443')
                    .get('/v1/artists/0hEurMDQu99nJRq8pTxO14')
                    .reply(200, artistResponse);
                artistAlbumsRequest = nock('https://api.spotify.com:443')
                    .get('/v1/artists/0hEurMDQu99nJRq8pTxO14/albums?album_type=album&limit=50&offset=0')
                    .reply(200, artistAlbums);
            });
            afterEach(function () {
                nock.cleanAll();
            });
            it('should call promise success callback', function (done) {
                var onSuccess = function (executionResult) {
                    var data = executionResult.data;
                    expect(data.artist.name).toBe('John Mayer');
                    expect(data.artist.id).toBe('0hEurMDQu99nJRq8pTxO14');
                    expect(data.artist.albums[0].id).toBe('712VoD72K500yLhhgqCyVe');
                    expect(!!executionResult.errors).toBeFalsy();
                    expect(artistRequest.isDone()).toBeTruthy();
                    expect(artistAlbumsRequest.isDone()).toBeTruthy();
                    done();
                };
                var onError = function () { throw 'should not be called'; };
                client.query("\n          query {\n            artist(id: \"0hEurMDQu99nJRq8pTxO14\") {\n              id\n              name\n              albums(album_type: \"album\") {\n                id\n              }\n            }\n          }\n        ").then(onSuccess).catch(onError);
            });
        });
    });
});
