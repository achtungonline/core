module.exports = function PowerUp(id, name, effectType, shape, effectStrength, effectDuration, affects) {
    var powerUp = {};
    powerUp.id = id;
    powerUp.name = name;
    powerUp.shape = shape;
    powerUp.effectType = effectType;
    powerUp.effectStrength = effectStrength;
    powerUp.effectDuration = effectDuration;
    powerUp.affects = affects;
    return powerUp;
};