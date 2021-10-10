"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("../../lib/client");
var utils_1 = require("../../lib/utils");
var nock = require("nock");
describe('paginator', function () {
    beforeEach(function () {
        utils_1.clearCache();
    });
    nock.disableNetConnect();
    function buildOffsetResponse(_a) {
        var _b = _a.offset, offset = _b === void 0 ? 0 : _b, _c = _a.limit, limit = _c === void 0 ? 100 : _c, _d = _a.size, size = _d === void 0 ? 1 : _d;
        var items = [];
        for (var i = 0; i < size; i++) {
            items.push({});
        }
        return {
            items: items,
            limit: limit,
            next: null,
            offset: offset,
            previous: null,
            total: size
        };
    }
    function buildCursorResponse(_a) {
        var _b = _a.ressource, ressource = _b === void 0 ? 'default' : _b, _c = _a.after, after = _c === void 0 ? '' : _c, _d = _a.size, size = _d === void 0 ? 1 : _d, _e = _a.total, total = _e === void 0 ? 1 : _e, _f = _a.limit, limit = _f === void 0 ? 20 : _f;
        var items = [];
        for (var i = 0; i < size; i++) {
            items.push({});
        }
        return _g = {},
            _g[ressource] = {
                items: items,
                total: total,
                limit: limit,
                cursors: {
                    after: after
                }
            },
            _g;
        var _g;
    }
    var client = client_1.spotifyWebAPIClient({
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        redirectUri: 'http://redirectUri.dev',
        accessToken: 'accessToken'
    });
    describe('when using OffsetPaging strategy', function () {
        describe('without options (default factory)', function () {
            describe('when response have 1 page', function () {
                var request;
                beforeEach(function () {
                    request = nock('https://api.spotify.com:443')
                        .get('/v1/users/playlist_owner_id/playlists/playlist_id/tracks')
                        .query({ offset: 0, limit: 50 })
                        .reply(200, buildOffsetResponse({}));
                });
                afterEach(function () {
                    nock.cleanAll();
                });
                it('should make 1 call', function (done) {
                    var paginator = utils_1.paginatorFactory('OffsetPaging', { limit: -1 });
                    var finished = function () {
                        expect(request.isDone()).toBeTruthy();
                        done();
                    };
                    paginator(client, 'getPlaylistTracks', function (response) { return response.body; }, 'playlist_owner_id', 'playlist_id').then(finished).catch(finished);
                });
            });
            describe('when response have 2 pages', function () {
                var firstRequest, secondRequest;
                beforeEach(function () {
                    firstRequest = nock('https://api.spotify.com:443')
                        .get('/v1/users/playlist_owner_id/playlists/playlist_id/tracks')
                        .query({ offset: 0, limit: 50 })
                        .reply(200, buildOffsetResponse({ size: 100, offset: 0 }));
                    secondRequest = nock('https://api.spotify.com:443')
                        .get('/v1/users/playlist_owner_id/playlists/playlist_id/tracks')
                        .query({ offset: 50, limit: 50 })
                        .reply(200, buildOffsetResponse({ size: 100, offset: 50 }));
                });
                afterEach(function () {
                    nock.cleanAll();
                });
                it('should make 2 calls', function (done) {
                    var paginator = utils_1.paginatorFactory('OffsetPaging', { limit: -1 });
                    var finished = function () {
                        expect(firstRequest.isDone()).toBeTruthy();
                        expect(secondRequest.isDone()).toBeTruthy();
                        done();
                    };
                    paginator(client, 'getPlaylistTracks', function (response) { return response.body; }, 'playlist_owner_id', 'playlist_id').then(finished).catch(finished);
                });
            });
            describe('when response have 3 pages, and second fails', function () {
                var firstRequest, secondRequest, thirdRequest;
                beforeEach(function () {
                    firstRequest = nock('https://api.spotify.com:443')
                        .get('/v1/users/playlist_owner_id/playlists/playlist_id/tracks')
                        .query({ offset: 0, limit: 50 })
                        .reply(200, buildOffsetResponse({ size: 150, offset: 0 }));
                    secondRequest = nock('https://api.spotify.com:443')
                        .get('/v1/users/playlist_owner_id/playlists/playlist_id/tracks')
                        .query({ offset: 50, limit: 50 })
                        .reply(500, buildOffsetResponse({ size: 150, offset: 50 }));
                    thirdRequest = nock('https://api.spotify.com:443')
                        .get('/v1/users/playlist_owner_id/playlists/playlist_id/tracks')
                        .query({ offset: 100, limit: 50 })
                        .reply(200, buildOffsetResponse({ size: 150, offset: 100 }));
                });
                afterEach(function () {
                    nock.cleanAll();
                });
                it('should make 2 calls', function (done) {
                    var paginator = utils_1.paginatorFactory('OffsetPaging', { limit: -1 });
                    var finished = function () {
                        expect(firstRequest.isDone()).toBeTruthy();
                        expect(secondRequest.isDone()).toBeTruthy();
                        expect(thirdRequest.isDone()).toBeFalsy();
                        done();
                    };
                    paginator(client, 'getPlaylistTracks', function (response) { return response.body; }, 'playlist_owner_id', 'playlist_id').then(finished).catch(finished);
                });
            });
        });
        describe('continueOnError options enabled', function () {
            describe('when response have 3 pages, and second fails', function () {
                var firstRequest, secondRequest, thirdRequest;
                beforeEach(function () {
                    firstRequest = nock('https://api.spotify.com:443')
                        .get('/v1/users/playlist_owner_id/playlists/playlist_id/tracks')
                        .query({ offset: 0, limit: 50 })
                        .reply(200, buildOffsetResponse({ size: 150, offset: 0 }));
                    secondRequest = nock('https://api.spotify.com:443')
                        .get('/v1/users/playlist_owner_id/playlists/playlist_id/tracks')
                        .query({ offset: 50, limit: 50 })
                        .reply(500, buildOffsetResponse({ size: 150, offset: 50 }));
                    thirdRequest = nock('https://api.spotify.com:443')
                        .get('/v1/users/playlist_owner_id/playlists/playlist_id/tracks')
                        .query({ offset: 100, limit: 50 })
                        .reply(200, buildOffsetResponse({ size: 150, offset: 100 }));
                });
                afterEach(function () {
                    nock.cleanAll();
                });
                it('should make 3 calls', function (done) {
                    var paginator = utils_1.paginatorFactory('OffsetPaging', { continueOnError: true, limit: -1 });
                    var finished = function () {
                        expect(firstRequest.isDone()).toBeTruthy();
                        expect(secondRequest.isDone()).toBeTruthy();
                        expect(thirdRequest.isDone()).toBeTruthy();
                        done();
                    };
                    paginator(client, 'getPlaylistTracks', function (response) { return response.body; }, 'playlist_owner_id', 'playlist_id').then(finished).catch(finished);
                });
            });
        });
        describe('limit options', function () {
            describe('when response have 3 pages, and limit set to -1', function () {
                var firstRequest, secondRequest, thirdRequest;
                beforeEach(function () {
                    firstRequest = nock('https://api.spotify.com:443')
                        .get('/v1/users/playlist_owner_id/playlists/playlist_id/tracks')
                        .query({ offset: 0, limit: 50 })
                        .reply(200, buildOffsetResponse({ size: 150, offset: 0 }));
                    secondRequest = nock('https://api.spotify.com:443')
                        .get('/v1/users/playlist_owner_id/playlists/playlist_id/tracks')
                        .query({ offset: 50, limit: 50 })
                        .reply(200, buildOffsetResponse({ size: 150, offset: 50 }));
                    thirdRequest = nock('https://api.spotify.com:443')
                        .get('/v1/users/playlist_owner_id/playlists/playlist_id/tracks')
                        .query({ offset: 100, limit: 50 })
                        .reply(200, buildOffsetResponse({ size: 150, offset: 100 }));
                });
                afterEach(function () {
                    nock.cleanAll();
                });
                it('should make 3 calls', function (done) {
                    var paginator = utils_1.paginatorFactory('OffsetPaging', { continueOnError: true, limit: -1 });
                    var finished = function () {
                        expect(firstRequest.isDone()).toBeTruthy();
                        expect(secondRequest.isDone()).toBeTruthy();
                        expect(thirdRequest.isDone()).toBeTruthy();
                        done();
                    };
                    paginator(client, 'getPlaylistTracks', function (response) { return response.body; }, 'playlist_owner_id', 'playlist_id').then(finished).catch(finished);
                });
            });
            describe('when response have 3 pages, and limit set to 50', function () {
                var firstRequest, secondRequest, thirdRequest;
                beforeEach(function () {
                    firstRequest = nock('https://api.spotify.com:443')
                        .get('/v1/users/playlist_owner_id/playlists/playlist_id/tracks')
                        .query({ offset: 0, limit: 50 })
                        .reply(200, buildOffsetResponse({ size: 50, offset: 0 }));
                    secondRequest = nock('https://api.spotify.com:443')
                        .get('/v1/users/playlist_owner_id/playlists/playlist_id/tracks')
                        .query({ offset: 50, limit: 50 })
                        .reply(200, buildOffsetResponse({ size: 50, offset: 50 }));
                    thirdRequest = nock('https://api.spotify.com:443')
                        .get('/v1/users/playlist_owner_id/playlists/playlist_id/tracks')
                        .query({ offset: 100, limit: 50 })
                        .reply(200, buildOffsetResponse({ size: 50, offset: 100 }));
                });
                afterEach(function () {
                    nock.cleanAll();
                });
                it('should make 1 call', function (done) {
                    var paginator = utils_1.paginatorFactory('OffsetPaging', { continueOnError: true, limit: 50 });
                    var finished = function () {
                        expect(firstRequest.isDone()).toBeTruthy();
                        expect(secondRequest.isDone()).toBeFalsy();
                        expect(thirdRequest.isDone()).toBeFalsy();
                        done();
                    };
                    paginator(client, 'getPlaylistTracks', function (response) { return response.body; }, 'playlist_owner_id', 'playlist_id').then(finished).catch(finished);
                });
            });
        });
    });
    describe('when using CursorPaging strategy', function () {
        describe('without options (default factory)', function () {
            describe('when response have 1 page', function () {
                var request;
                beforeEach(function () {
                    request = nock('https://api.spotify.com:443')
                        .get('/v1/me/following?type=artist')
                        .reply(200, buildOffsetResponse({}));
                });
                afterEach(function () {
                    nock.cleanAll();
                });
                it('should make 1 call', function (done) {
                    var paginator = utils_1.paginatorFactory('CursorPaging', { limit: -1 });
                    var finished = function () {
                        expect(request.isDone()).toBeTruthy();
                        done();
                    };
                    paginator(client, 'getFollowedArtists', function (response) { return response.body.artists.items; }).then(finished).catch(finished);
                });
            });
            describe('when response have 2 pages', function () {
                var firstRequest, secondRequest, after = 'my_cursor';
                beforeEach(function () {
                    firstRequest = nock('https://api.spotify.com:443')
                        .get('/v1/me/following?type=artist')
                        .reply(200, buildCursorResponse({ after: after, ressource: 'artists', total: 20, size: 10 }));
                    secondRequest = nock('https://api.spotify.com:443')
                        .get('/v1/me/following')
                        .query({ after: after, type: 'artist' })
                        .reply(200, buildCursorResponse({ ressource: 'artists', total: 20, size: 10 }));
                });
                afterEach(function () {
                    nock.cleanAll();
                });
                it('should make 2 calls', function (done) {
                    var paginator = utils_1.paginatorFactory('CursorPaging', { limit: -1 });
                    var finished = function () {
                        expect(firstRequest.isDone()).toBeTruthy();
                        expect(secondRequest.isDone()).toBeTruthy();
                        done();
                    };
                    paginator(client, 'getFollowedArtists', function (response) { return response.body.artists.items; }).then(finished).catch(finished);
                });
            });
        });
        describe('limit options', function () {
            describe('when response have 3 pages, and limit set to 20', function () {
                var firstRequest, secondRequest, thirdRequest;
                beforeEach(function () {
                    firstRequest = nock('https://api.spotify.com:443')
                        .get('/v1/me/following?type=artist')
                        .reply(200, buildCursorResponse({ after: 'cursor_1', ressource: 'artists', total: 30, size: 10 }));
                    secondRequest = nock('https://api.spotify.com:443')
                        .get('/v1/me/following')
                        .query({ after: 'cursor_1', type: 'artist' })
                        .reply(200, buildCursorResponse({ after: 'cursor_2', ressource: 'artists', total: 30, size: 10 }));
                    thirdRequest = nock('https://api.spotify.com:443')
                        .get('/v1/me/following')
                        .query({ after: 'cursor_2', type: 'artist' })
                        .reply(200, buildCursorResponse({ ressource: 'artists', total: 30, size: 10 }));
                });
                afterEach(function () {
                    nock.cleanAll();
                });
                it('should make 2 call', function (done) {
                    var paginator = utils_1.paginatorFactory('CursorPaging', { limit: 20 });
                    var finished = function () {
                        expect(firstRequest.isDone()).toBeTruthy('first request should be done');
                        expect(secondRequest.isDone()).toBeTruthy('second request should be done');
                        expect(thirdRequest.isDone()).toBeFalsy('third request should NOT be done');
                        done();
                    };
                    paginator(client, 'getFollowedArtists', function (response) { return response.body.artists.items; }).then(finished).catch(finished);
                });
            });
        });
    });
});
