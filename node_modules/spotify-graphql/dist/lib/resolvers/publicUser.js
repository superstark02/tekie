"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
function publicUserResolvers(spotifyApiClient) {
    return {
        playlists: function (user, variables) {
            return utils_1.paginatorFromVariables('OffsetPaging', variables)(spotifyApiClient, 'getUserPlaylists', function (response) { return response.body.items; }, user.id);
        }
    };
}
exports.publicUserResolvers = publicUserResolvers;
