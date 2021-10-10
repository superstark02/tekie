"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function playerResolvers(spotifyApiClient) {
    return {
        item: function (player) {
            return player.item;
        },
    };
}
exports.playerResolvers = playerResolvers;
