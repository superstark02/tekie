"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../lib/utils");
var helpers_1 = require("../helpers");
var index_1 = require("../../index");
var nock = require("nock");
describe('Query : artists(ids: String): [Artist]', function () {
    var response;
    beforeEach(function (done) {
        utils_1.clearCache();
        helpers_1.loadFixture('queries.artists').then(function (data) { return response = data; }).then(done);
    });
    nock.disableNetConnect();
    var client = index_1.SpotifyGraphQLClient({
        clientId: "clientId",
        clientSecret: "clientSecret",
        redirectUri: "http://redirectUri.dev",
        accessToken: "accessToken"
    });
    describe('when fetching existing Artists', function () {
        var request;
        beforeEach(function () {
            request = nock('https://api.spotify.com:443')
                .get('/v1/artists?ids=2CIMQHirSU0MQqyYHq0eOx%2C57dN52uHvrHOxijzpIgu3E%2C1vCWHaC5f2uS3yhpwWbIA6')
                .reply(200, response);
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('should call promise success callback', function (done) {
            var onSuccess = function (executionResult) {
                var data = executionResult.data;
                expect(data.artists[0].name).toBe('deadmau5');
                expect(data.artists[0].id).toBe('2CIMQHirSU0MQqyYHq0eOx');
                expect(!!executionResult.errors).toBeFalsy();
                expect(request.isDone()).toBeTruthy();
                done();
            };
            var onError = function () { throw 'should not be called'; };
            client.query("\n        query {\n          artists(ids: \"2CIMQHirSU0MQqyYHq0eOx,57dN52uHvrHOxijzpIgu3E,1vCWHaC5f2uS3yhpwWbIA6\") {\n            id\n            name\n          }\n        }\n       ").then(onSuccess).catch(onError);
        });
    });
});
