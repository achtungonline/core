var CHANGE = 4;
var DURATION = 10;
var FAT_TYPE = "fat";

var me = module.exports = {};

me.type = FAT_TYPE;

me.FatEffectHandler = function FatEffectHandler(deps) {

    function activate(gameState, worm) {
        //deps.wormHandler.changeSize(worm, CHANGE);
        //return {
        //    duration: DURATION,
        //    change: CHANGE,
        //    worm: worm,
        //    type: FAT_TYPE
        //};
    }

    return {
        activate: activate,
        deactivate: function () {
        }
    };
};