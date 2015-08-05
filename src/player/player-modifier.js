module.exports = function PlayerModifier() {

    function setSteering(player, steering) {
        player.steering = steering;
    }

    return {
        setSteering: setSteering
    }


};


