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

	Unit.prototype.getIntoPosition = function (distance, coll, walk) { //ToDo; refactor
		const CollMap = require('CollMap');
		if (!this.x) {
			return false;
		}

		if (walk === true) {
			walk = 1;
		}

		if (distance < 4 && (!this.hasOwnProperty("mode") || (this.mode !== 0 && this.mode !== 12))) {
			//me.overhead("Short range");

			walk && (this.distance > 8 || checkCollision(me, this, coll))
			&& Pather.walkTo(this.x, this.y, 3);

			// In case walking didnt go good, always do this
			Pather.moveTo(this.x, this.y, 0);

			return !CollMap.checkColl(me, this, coll);
		}

		var n, i, cx, cy, t,
			coords = [],
			fullDistance = distance,
			name = this.hasOwnProperty("name") ? this.name : "",
			angle = Math.round(Math.atan2(me.y - this.y, me.x - this.x) * 180 / Math.PI),
			angles = [0, 15, -15, 30, -30, 45, -45, 60, -60, 75, -75, 90, -90, 135, -135, 180];

		t = getTickCount();

		for (n = 0; n < 3; n += 1) {
			if (n > 0) {
				distance -= Math.floor(fullDistance / 3 - 1);
			}

			for (i = 0; i < angles.length; i += 1) {
				cx = Math.round((Math.cos((angle + angles[i]) * Math.PI / 180)) * distance + this.x);
				cy = Math.round((Math.sin((angle + angles[i]) * Math.PI / 180)) * distance + this.y);

				if (Pather.checkSpot(cx, cy, 0x1, false)) {
					coords.push({x: cx, y: cy});
				}
			}

			//print("ÿc9potential spots: ÿc2" + coords.length);

			if (coords.length > 0) {
				coords.sort((a, b) => a.distance - b.distance);

				for (i = 0; i < coords.length; i += 1) {
					// Valid position found
					if (!CollMap.checkColl({x: coords[i].x, y: coords[i].y}, this, coll, 1)) {
						//print("ÿc9optimal pos build time: ÿc2" + (getTickCount() - t) + " ÿc9distance from target: ÿc2" + getDistance(cx, cy, this.x, this.y));

						switch (walk) {
							case 1:
								Pather.walkTo(coords[i].x, coords[i].y, 2);

								break;
							case 2:
								if (getDistance(me, coords[i]) < 6 && !CollMap.checkColl(me, coords[i], 0x5)) {
									Pather.walkTo(coords[i].x, coords[i].y, 2);
								} else {
									Pather.moveTo(coords[i].x, coords[i].y, 1);
								}

								break;
							default:
								Pather.moveTo(coords[i].x, coords[i].y, 1);

								break;
						}

						return true;
					}
				}
			}
		}

		if (name) {
			print((new Error).stack);
			print("ÿc4Attackÿc0: No valid positions for: " + name);
		}

		return false;
	}
})(require);