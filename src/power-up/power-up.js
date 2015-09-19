module.exports = function PowerUp(id, effectType, shape) {
    var powerUp = {};
    powerUp.id = id;
    powerUp.shape = shape;
    powerUp.effectType = effectType;
    return powerUp;
};