/**
 * @description Some movement prototypes
 * @author Jaenster
 */
(function (require) {
	Unit.prototype.moveTo = function () {
		return this.distance > 5 && Pather.moveTo(this.x, this.y);
	};

	PresetUnit.prototype.moveTo = function () {
		return Pather.moveTo(this.roomx * 5 + this.x, this.roomy * 5 + this.y);
	};

	Unit.prototype.bestSpot = (unit, distance) => {
		const CollMap = require('CollMap');
		let n, i, coll = 0x04,
			coords = [],
			fullDistance = distance,
			angle = Math.round(Math.atan2(me.y - unit.y, me.x - unit.x) * 180 / Math.PI),
			angles = [0, 15, -15, 30, -30, 45, -45, 60, -60, 75, -75, 90, -90, 135, -135, 180];

		for (n = 0; n < 3; n += 1) {
			n > 0 && (distance -= Math.floor(fullDistance / 3 - 1));

			angles.forEach(c => ((cx, cy) => Pather.checkSpot(cx, cy, 0x1, false)
				&& coords.push({
					x: cx,
					y: cy
				}))
				(
					Math.round((Math.cos((angle + c) * Math.PI / 180)) * distance + unit.x),
					Math.round((Math.sin((angle + c) * Math.PI / 180)) * distance + unit.y)
				)
			);
		}
		coords.sort((a, b) => a.distance - b.distance);

		return coords.find(c => !CollMap.checkColl({x: c.x, y: c.y}, unit, coll, 1));
	};
})(require);