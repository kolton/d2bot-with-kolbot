/**
*	@filename	CollMap.js
*	@author		kolton
*	@desc		manipulate map collision data
*/

var CollMap = new function () {
	this.rooms = [];
	this.maps = [];

	this.addRoom = function (x, y) {
		// In case a room is passed directly
		if (x instanceof Room) {
			this.rooms.push(x);
			this.maps.push(x.getCollision());

			return true;
		}

		var room = getRoom(x, y);

		if (room instanceof Room && this.coordsInRoom(x, y, room)) {
			this.rooms.push(room);
			this.maps.push(room.getCollision());
		} else {
			return false;
		}

		return true;
	};

	this.getColl = function (x, y) {
		var i, j,
			index = this.getRoomIndex(x, y, true);

		if (index === undefined) {
			return 5;
		}

		j = x - this.rooms[index].x * 5;
		i = y - this.rooms[index].y * 5;
		
		if (typeof this.maps[index] !== "undefined" && typeof this.maps[index][i] !== "undefined" && typeof this.maps[index][i][j] !== "undefined") {
			return this.maps[index][i][j];
		}

		return 5;
	};

	this.getRoomIndex = function (x, y) {
		var i;

		for (i = 0; i < this.rooms.length; i += 1) {
			if (this.coordsInRoom(x, y, this.rooms[i])) {
				return i;
			}
		}

		if (this.addRoom(x, y)) {
			return i;
		}

		return undefined;
	};

	this.coordsInRoom = function (x, y, room) {
		if (x >= room.x * 5 && x < room.x * 5 + room.xsize && y >= room.y * 5 && y < room.y * 5 + room.ysize) {
			return true;
		}

		return false;
	};

	this.reset = function () {
		this.rooms = [];
		this.maps = [];
	};

	// Check collision between unitA and unitB. true = collision present, false = collision not present
	// If checking for blocking collisions (0x1, 0x4), true means blocked, false means not blocked
	this.checkColl = function (unitA, unitB, coll) {
		var i, k, l, cx, cy, angle, distance;

		angle = Math.round(Math.atan2(unitA.y - unitB.y, unitA.x - unitB.x) * 180 / Math.PI);
		distance = Math.round(getDistance(unitA, unitB));

		for (i = 1; i < distance; i += 1) {
			cx = Math.round((Math.cos(angle * Math.PI / 180)) * i + unitB.x);
			cy = Math.round((Math.sin(angle * Math.PI / 180)) * i + unitB.y);

			for (k = cx - 1; k <= cx + 1; k += 1) { // check thicker line
				for (l = cy - 1; l <= cy + 1; l += 1) {
					if (this.getColl(k, l) & coll) {
						return true;
					}
				}
			}
		}

		return false;
	};

	/*this.checkColl = function (unitA, unitB, coll) {
		var i, x, y, a, b,
			lineLength = Math.sqrt((unitA.x - unitB.x) * (unitA.x - unitB.x) + (unitA.y - unitB.y) * (unitA.y - unitB.y));

		for (i = 0; i < lineLength; i += 1) {
			x = Math.round(unitA.x + (unitB.x - unitA.x) * i / lineLength);
			y = Math.round(unitA.y + (unitB.y - unitA.y) * i / lineLength);

			for (a = x - 1; a <= x + 1; a += 1) {
				for (b = y - 1; b <= y + 1; b += 1) {
					if (this.getColl(a, b) & coll) {
						return true;
					}
				}
			}
		}

		return false;
	};*/
};