/**
*	@filename	CollMap.js
*	@author		kolton
*	@desc		manipulate map collision data
*/

var CollMap = new function () {
	this.rooms = [];
	this.maps = [];

	this.getNearbyRooms = function (x, y) {
		var i, room, rooms;

		room = getRoom(x, y);

		if (!room) {
			return false;
		}

		rooms = room.getNearby();

		if (!rooms) {
			return false;
		}

		for (i = 0; i < rooms.length; i += 1) {
			if (this.getRoomIndex(rooms[i].x * 5 + rooms[i].xsize / 2, rooms[i].y * 5 + rooms[i].ysize / 2, true) === undefined) {
				this.addRoom(rooms[i]);
			}
		}

		return true;
	};

	this.addRoom = function (x, y) {
		var room, coll;

		room = x instanceof Room ? x : getRoom(x, y);

		// Coords are not in the returned room.
		if (arguments.length === 2 && !this.coordsInRoom(x, y, room)) {
			return false;
		}

		if (room) {
			coll = room.getCollision();
		}

		if (coll) {
			this.rooms.push({x: room.x, y: room.y, xsize: room.xsize, ysize: room.ysize});
			this.maps.push(coll);

			return true;
		}

		return false;
	};

	this.getColl = function (x, y, cacheOnly) {
		var i, j,
			index = this.getRoomIndex(x, y, cacheOnly);

		if (index === undefined) {
			return 5;
		}

		j = x - this.rooms[index].x * 5;
		i = y - this.rooms[index].y * 5;

		if (this.maps[index] !== undefined && this.maps[index][i] !== undefined && this.maps[index][i][j] !== undefined) {
			return this.maps[index][i][j];
		}

		return 5;
	};

	this.getRoomIndex = function (x, y, cacheOnly) {
		if (this.rooms.length > 25) {
			this.reset();
		}

		var i;

		for (i = 0; i < this.rooms.length; i += 1) {
			if (this.coordsInRoom(x, y, this.rooms[i])) {
				return i;
			}
		}

		if (!cacheOnly && this.addRoom(x, y)) {
			return i;
		}

		return undefined;
	};

	this.coordsInRoom = function (x, y, room) {
		if (room && x >= room.x * 5 && x < room.x * 5 + room.xsize && y >= room.y * 5 && y < room.y * 5 + room.ysize) {
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
	this.checkColl = function (unitA, unitB, coll, thickness) {
		if (thickness === undefined) {
			thickness = 1;
		}

		var i, k, l, cx, cy, angle, distance;

		angle = Math.atan2(unitA.y - unitB.y, unitA.x - unitB.x);
		distance = Math.round(getDistance(unitA, unitB));

		for (i = 1; i < distance; i += 1) {
			cx = Math.round((Math.cos(angle)) * i + unitB.x);
			cy = Math.round((Math.sin(angle)) * i + unitB.y);

			for (k = cx - thickness; k <= cx + thickness; k += 1) { // check thicker line
				for (l = cy - thickness; l <= cy + thickness; l += 1) {
					if (this.getColl(k, l, false) & coll) {
						return true;
					}
				}
			}
		}

		return false;
	};
};