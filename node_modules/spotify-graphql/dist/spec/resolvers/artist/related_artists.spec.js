"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../lib/utils");
var helpers_1 = require("../../helpers");
var index_1 = require("../../../index");
var nock = require("nock");
describe('Resolver : Artist.related_artists', function () {
    var artistResponse, artistRelatedArtists;
    beforeEach(function (done) {
        utils_1.clearCache();
        helpers_1.loadFixture('resolvers.artist.related_artists.artist').then(function (data) {
            artistResponse = data;
            helpers_1.loadFixture('resolvers.artist.related_artists.related_artists').then(function (data2) { return artistRelatedArtists = data2; }).then(done);
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
        var artistRequest, artistRelatedArtistsRequest;
        beforeEach(function () {
            artistRequest = nock('https://api.spotify.com:443')
                .get('/v1/artists/4Nrd0CtP8txoQhnnlRA6V6')
                .reply(200, artistResponse);
            artistRelatedArtistsRequest = nock('https://api.spotify.com:443')
                .get('/v1/artists/4Nrd0CtP8txoQhnnlRA6V6/related-artists')
                .reply(200, artistRelatedArtists);
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should call promise success callback', function (done) {
            var onSuccess = function (executionResult) {
                var data = executionResult.data;
                expect(data.artist.name).toBe('Vianney');
                expect(data.artist.id).toBe('4Nrd0CtP8txoQhnnlRA6V6');
                expect(data.artist.related_artists[0].id).toBe('4OV6uYSnHxSYkjDYuBVBUz');
                expect(data.artist.related_artists[0].name).toBe('Slimane');
                expect(!!executionResult.errors).toBeFalsy();
                expect(artistRequest.isDone()).toBeTruthy();
                expect(artistRelatedArtistsRequest.isDone()).toBeTruthy();
                done();
            };
            var onError = function () { throw 'should not be called'; };
            client.query("\n        query {\n          artist(id: \"4Nrd0CtP8txoQhnnlRA6V6\") {\n            id\n            name\n            related_artists {\n              id\n              name\n            }\n          }\n        }\n       ").then(onSuccess).catch(onError);
        });
    });
});
