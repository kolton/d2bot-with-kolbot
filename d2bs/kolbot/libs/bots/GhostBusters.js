/**
*	@filename	GhostBusters.js
*	@author		kolton
*	@desc		who you gonna call?
*/

function GhostBusters() {
	this.clearGhosts = function () {
		var room, result, rooms, monster, monList;

		room = getRoom();

		if (!room) {
			return false;
		}

		rooms = [];

		do {
			rooms.push([room.x * 5 + room.xsize / 2, room.y * 5 + room.ysize / 2]);
		} while (room.getNext());

		while (rooms.length > 0) {
			rooms.sort(Sort.points);
			room = rooms.shift();

			result = Pather.getNearestWalkable(room[0], room[1], 15, 2);

			if (result) {
				Pather.moveTo(result[0], result[1], 3);

				monList = [];
				monster = getUnit(1);

				if (monster) {
					do {
						if ([38, 39, 40, 41, 42, 631, 632, 633].indexOf(monster.classid) > -1 && getDistance(me, monster) <= 30 && Attack.checkMonster(monster)) {
							monList.push(copyUnit(monster));
						}
					} while (monster.getNext());
				}

				if (!Attack.clearList(monList)) {
					return false;
				}
			}
		}

		return true;
	};

	this.cellar = function () { // black marsh wp
		var i;

		Pather.useWaypoint(6);
		Precast.doPrecast(true);

		for (i = 20; i <= 25; i += 1) {
			Pather.moveToExit(i, true);
			this.clearGhosts();
		}

		return true;
	};

	this.jail = function () { // gonna use inner cloister wp and travel backwards
		var i;

		Pather.useWaypoint(32);
		Precast.doPrecast(true);

		for (i = 31; i >= 29; i -= 1) {
			Pather.moveToExit(i, true);
			this.clearGhosts();
		}

		return true;
	};

	this.cathedral = function () { // inner cloister wp
		Pather.useWaypoint(32);
		Precast.doPrecast(true);
		Pather.moveToExit(33, true);
		this.clearGhosts();

		return true;
	};

	this.tombs = function () { // canyon wp
		var i;

		Pather.useWaypoint(46);
		Precast.doPrecast(true);

		for (i = 66; i <= 72; i += 1) {
			Pather.moveToExit(i, true);
			this.clearGhosts();
			Pather.moveToExit(46, true);
		}

		return true;
	};

	this.flayerDungeon = function () { // flayer jungle wp
		var areas = [88, 89, 91];

		Pather.useWaypoint(78);
		Precast.doPrecast(true);

		while (areas.length) {
			Pather.moveToExit(areas.shift(), true);
			this.clearGhosts();
		}

		return true;
	};

	this.crystalinePassage = function () { // crystaline passage wp
		Pather.useWaypoint(113);
		Precast.doPrecast(true);
		this.clearGhosts();
		Pather.moveToExit(114, true); // frozen river
		this.clearGhosts();

		return true;
	};

	this.glacialTrail = function () { // glacial trail wp
		Pather.useWaypoint(115);
		Precast.doPrecast(true);
		this.clearGhosts();
		Pather.moveToExit(116, true); // drifter
		this.clearGhosts();

		return true;
	};

	this.icyCellar = function () { // glacial trail wp
		Pather.useWaypoint(118);
		Precast.doPrecast(true);
		Pather.moveToExit(119, true); // drifter
		this.clearGhosts();

		return true;
	};

	var i,
		sequence = ["cellar", "jail", "cathedral", "tombs", "flayerDungeon", "crystalinePassage", "glacialTrail", "icyCellar"];

	for (i = 0; i < sequence.length; i += 1) {
		Town.doChores();

		try {
			this[sequence[i]]();
		} finally {
			Town.goToTown();
		}
	}

	return true;
}