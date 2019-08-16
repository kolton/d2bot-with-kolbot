/**
 * @author Jaenster
 * @description Some prototypes on objects
 */
(function (global) {
    let coords = function () {
        if (Array.isArray(this) && this.length > 1) {
            return [this[0], this[1]];
        }

        if (typeof this.x !== 'undefined' && typeof this.y !== 'undefined') {
            return this instanceof PresetUnit && [this.roomx * 5 + this.x, this.roomy * 5 + this.y] || [this.x, this.y]
        }

        return [undefined, undefined];
    };

    Object.defineProperties(Object.prototype, {
        distance: {
            get: function() {
                return !me.gameReady ? NaN : getDistance.apply(null, [me, ...coords.apply(this)]);
            },
            enumerable:false,
        },
        moveTo: {
            get: function() {
                return () => Pather.moveTo.apply(Pather, coords.apply(this))
            },
            enumerable:false,
        },
        path: {
            get: function() {
                let useTeleport = Pather.useTeleport();
                return getPath.apply(this, [typeof this.area !== 'undefined' ? this.area : me.area, me.x, me.y, ...coords.apply(this), useTeleport ? 1 : 0, useTeleport ? ([62, 63, 64].indexOf(me.area) > -1 ? 30 : Pather.teleDistance) : Pather.walkDistance])
            },
            enumerable: false,
        },
        validSpot: {
            get: function () {
                let [x, y] = coords.apply(this), result;
                if (!me.area || !x || !y) { // Just in case
                    return false;
                }

                try { // Treat thrown errors as invalid spot
                    result = getCollision(me.area, x, y);
                } catch (e) {
                    // Dont care
                }

                // Avoid non-walkable spots, objects
                return !(result === undefined || (result & 0x1) || (result & 0x400));
            },
            enumerable: false,
        },
    });
})(typeof global !== 'undefined' ? global : this);