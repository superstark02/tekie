"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("./lib/schema");
var graphql_1 = require("graphql");
var graphql_tools_1 = require("graphql-tools");
var resolvers_1 = require("./lib/resolvers");
var client_1 = require("./lib/client");
function getSchema(spotifyClientConfiguration) {
    return graphql_tools_1.makeExecutableSchema({
        typeDefs: schema_1.default,
        resolvers: resolvers_1.default(client_1.spotifyWebAPIClient(spotifyClientConfiguration)),
    });
}
exports.getSchema = getSchema;
function SpotifyGraphQLClient(spotifyClientConfiguration) {
    var executableSchema = getSchema(spotifyClientConfiguration);
    return {
        query: function (requestString, rootValue, contextValue, variableValues, operationName) {
            var graphqlArgs = [executableSchema];
            graphqlArgs = graphqlArgs.concat(Array.from(arguments));
            return graphql_1.graphql.apply(graphql_1.graphql, graphqlArgs);
        }
    };
}
exports.SpotifyGraphQLClient = SpotifyGraphQLClient;
__export(require("./lib/decorators"));
