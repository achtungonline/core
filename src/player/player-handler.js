module.exports = function PlayerHandler(eventHandler, aiHandler) {
    eventHandler.on(eventHandler.events.WORM_DIED, function (players, player, worm) {
        function isAnyWormAlive(player) {
            player.worms.forEach(function (worm) {
                if (worm.alive) {
                    return true;
                }
            });
            return false;
        }

        function kill(player) {
            if (!player.alive) {
                throw Error("Trying to kill player that is already dead");
            }
            player.alive = false;
            eventHandler.emit(eventHandler.events.PLAYER_DIED, players, player)
        }

        if(!player.alive) {
            throw Error("A worm died for a already dead player.");
        }

        if (!isAnyWormAlive(player)) {
            kill(player);
        }
    });

    function setAIPlayer(player, ai) {
        aiHandler.addAIPlayer(player, ai);
    }

    function removeAIPlayer(player) {
        aiHandler.removeAIPlayer(player);
    }

    function updateAIPlayers() {
        aiHandler.update();
    }

    function setSteering(player, steering) {
        player.steering = steering;
    }

    return {
        setSteering: setSteering,
        setAIPlayer: setAIPlayer,
        updateAIPlayers: updateAIPlayers,
        removeAIPlayer: removeAIPlayer
    }
};