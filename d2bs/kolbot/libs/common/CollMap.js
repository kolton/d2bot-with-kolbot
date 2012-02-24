var CollMap = new function () {
	this.rooms = [];
	this.maps = [];

	this.addRoom = function (x, y) {
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

		if (typeof (this.maps[index][i]) === "undefined" || typeof (this.maps[index][i][j]) === "undefined") {
			return 5;
		}

		return this.maps[index][i][j];
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
};