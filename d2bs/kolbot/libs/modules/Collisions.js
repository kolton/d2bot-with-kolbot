(function (module, require) {

    module.exports = {
        validSpot: function (x, y) {
            if (typeof x === 'object') {
                [x, y] = [x.x, x.y];
            }
            var result;

            if (!me.area || !x || !y) { // Just in case
                return false;
            }

            try { // Treat thrown errors as invalid spot
                result = getCollision(me.area, x, y);
            } catch (e) {
                return false;
            }

            // Avoid non-walkable spots, objects
            return !(result === undefined || (result & 0x1) || (result & 0x400));

        },
        lineOfSight: function (x, y, x2, y2) {
            return checkCollision(x, y, x2, y2, 0x1);
        }
    };
})(module, require);