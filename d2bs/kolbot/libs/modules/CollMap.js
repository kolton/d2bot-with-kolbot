/**
*	@filename	CollMap.js
*	@author		kolton
*	@desc		manipulate map collision data
*/
var CollMap = {};

(function (module, require) {
	const CollMap = {};
	CollMap.rooms = [];
	CollMap.maps = [];

	CollMap.getNearbyRooms = function (x, y) {
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
			if (CollMap.getRoomIndex(rooms[i].x * 5 + rooms[i].xsize / 2, rooms[i].y * 5 + rooms[i].ysize / 2, true) === undefined) {
				CollMap.addRoom(rooms[i]);
			}
		}

		return true;
	};

	CollMap.addRoom = function (x, y) {
		var room, coll;

		room = x instanceof Room ? x : getRoom(x, y);

		// Coords are not in the returned room.
		if (arguments.length === 2 && !CollMap.coordsInRoom(x, y, room)) {
			return false;
		}

		if (room) {
			coll = room.getCollision();
		}

		if (coll) {
			CollMap.rooms.push({x: room.x, y: room.y, xsize: room.xsize, ysize: room.ysize});
			CollMap.maps.push(coll);

			return true;
		}

		return false;
	};

	CollMap.getColl = function (x, y, cacheOnly) {
		var i, j,
			index = CollMap.getRoomIndex(x, y, cacheOnly);

		if (index === undefined) {
			return 5;
		}

		j = x - CollMap.rooms[index].x * 5;
		i = y - CollMap.rooms[index].y * 5;

		if (CollMap.maps[index] !== undefined && CollMap.maps[index][i] !== undefined && CollMap.maps[index][i][j] !== undefined) {
			return CollMap.maps[index][i][j];
		}

		return 5;
	};

	CollMap.getRoomIndex = function (x, y, cacheOnly) {
		if (CollMap.rooms.length > 25) {
			CollMap.reset();
		}

		var i;

		for (i = 0; i < CollMap.rooms.length; i += 1) {
			if (CollMap.coordsInRoom(x, y, CollMap.rooms[i])) {
				return i;
			}
		}

		if (!cacheOnly && CollMap.addRoom(x, y)) {
			return i;
		}

		return undefined;
	};

	CollMap.coordsInRoom = function (x, y, room) {
		if (room && x >= room.x * 5 && x < room.x * 5 + room.xsize && y >= room.y * 5 && y < room.y * 5 + room.ysize) {
			return true;
		}

		return false;
	};

	CollMap.reset = function () {
		CollMap.rooms = [];
		CollMap.maps = [];
	};

	// Check collision between unitA and unitB. true = collision present, false = collision not present
	// If checking for blocking collisions (0x1, 0x4), true means blocked, false means not blocked
	CollMap.checkColl = function (unitA, unitB, coll, thickness) {
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
					if (CollMap.getColl(k, l, false) & coll) {
						return true;
					}
				}
			}
		}

		return false;
	};

	CollMap.getTelePoint = function (room) {
		// returns {x, y, distance} of a valid point with lowest distance from room center
		// distance is from room center, handy for keeping bot from trying to teleport on walls

		if (!room) {
			throw new Error("Invalid room passed to getTelePoint");
		}

		let roomx = room.x * 5, roomy = room.y * 5;

		if (getCollision(room.area, roomx, roomy) & 1) {
			let collision = room.getCollision(), validTiles = [];
			let aMid = Math.round(collision.length / 2), bMid = Math.round(collision[0].length / 2);

			for (let a = 0; a < collision.length; a++) {
				for (let b = 0; b < collision[a].length; b++) {
					if (!(collision[a][b] & 1)) {
						validTiles.push({
							x: roomx + b - bMid,
							y: roomy + a - aMid,
							distance: getDistance(0, 0, a - aMid, b - bMid)
						});
					}
				}
			}

			if (validTiles.length) {
				validTiles.sort((a, b) => {
					return a.distance - b.distance;
				});

				return validTiles[0];
			}

			return null;
		}

		return {x: roomx, y: roomy, distance: 0};
	};

	CollMap.getRandCoordinate = function (cX, xmin, xmax, cY, ymin, ymax, factor = 1) {
		// returns randomized {x, y} object with valid coordinates
		var coordX, coordY,
			retry = 0;

		do {
			if (retry > 30) {
				print("failed to get valid coordinate");
				coordX = cX;
				coordY = cY;

				break;
			}

			coordX = cX + factor * rand(xmin, xmax);
			coordY = cY + factor * rand(ymin, ymax);

			if (cX === coordX && cY === coordY) { // recalculate if same coordiante
				coordX = 0;
				continue;
			}

			retry++;
		} while (getCollision(me.area, coordX, coordY) & 1);

		// print("Move " + retry + " from (" + cX + ", " + cY + ") to (" + coordX + ", " + coordY + ")");
		return {x: coordX, y: coordY};
	};

	module.exports = CollMap;
})(module, require);
