module.exports = function PowerUp(id, name, effectType, shape, effectStrength, effectDuration) {
    var powerUp = {};
    powerUp.id = id;
    powerUp.name = name;
    powerUp.shape = shape;
    powerUp.effectType = effectType;
    powerUp.effectStrength = effectStrength;
    powerUp.effectDuration = effectDuration;
    return powerUp;
};