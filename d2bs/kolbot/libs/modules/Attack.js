/**
 * @description An attack script determins what skill to use, whenever it can
 * @Author Jaenster
 */

(function (module, require) {

	const Attack = function () {

	};

	Attack.clear = function (range) {
		return me.clear.apply(me, [range]);
	};

	Attack.clearLevel = function (spectype) {
		let room = getRoom(), rooms = [], result, myRoom, currentArea = getArea().id, previousArea;

		if (!room) return false;

		spectype === undefined && (spectype = 0);

		for (; room.getNext();) rooms.push([room.x * 5 + room.xsize / 2, room.y * 5 + room.ysize / 2]);

		while (rooms.length > 0) {
			// get the first room + initialize myRoom var
			!myRoom && (room = getRoom(me.x, me.y));

			if (room) {
				if (room instanceof Array) { // use previous room to calculate distance
					myRoom = [room[0], room[1]];
				} else { // create a new room to calculate distance (first room, done only once)
					myRoom = [room.x * 5 + room.xsize / 2, room.y * 5 + room.ysize / 2];
				}
			}

			rooms.sort(getDistance(myRoom[0], myRoom[1], a[0], a[1]) - getDistance(myRoom[0], myRoom[1], b[0], b[1]));
			room = rooms.shift();

			result = Pather.getNearestWalkable(room[0], room[1], 18, 3);

			if (result) {
				Pather.moveTo(result[0], result[1], 3, spectype);
				previousArea = result;

				if (!this.clear(40, spectype)) break;

			} else if (currentArea !== getArea().id) { // Make sure bot does not get stuck in different area.
				Pather.moveTo(previousArea[0], previousArea[1], 3, spectype);
			}
		}
		return true;
	};

	Attack.kill = function (classId) {
		if (!classId) throw TypeError('Should call Attack.Kill upon something');
		const unit = classId instanceof Unit && classId || getUnit(1, classId);
		if (!unit) throw new Error("Attack.kill: Target not found");

		return unit.kill();
	};


	module.exports = Attack;
})(module, require);
