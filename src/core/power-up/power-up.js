module.exports = function PowerUp(id, effectType, shape, effectStrength, effectDuration) {
    var powerUp = {};
    powerUp.id = id;
    powerUp.shape = shape;
    powerUp.effectType = effectType;
    powerUp.effectStrength = effectStrength || 1;
    powerUp.effectDuration = effectDuration || 5;
    return powerUp;
};