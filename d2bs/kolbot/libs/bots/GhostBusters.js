/**
*	@filename	GhostBusters.js
*	@author		kolton
*	@desc		who you gonna call?
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

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
                        if ([UnitClassID.wraith1, UnitClassID.wraith2, UnitClassID.wraith3, UnitClassID.wraith4, UnitClassID.wraith5, UnitClassID.wraith6,
                            UnitClassID.wraith7, UnitClassID.wraith8].indexOf(monster.classid) > -1 && getDistance(me, monster) <= 30 && Attack.checkMonster(monster)) {

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

        Pather.useWaypoint(Areas.Act1.Black_Marsh);
		Precast.doPrecast(true);

        for (i = Areas.Act1.Forgotten_Tower; i <= Areas.Act1.Tower_Cellar_Level_5; i += 1) {
			Pather.moveToExit(i, true);
			this.clearGhosts();
		}

		return true;
	};

	this.jail = function () { // gonna use inner cloister wp and travel backwards
		var i;

        Pather.useWaypoint(Areas.Act1.Inner_Cloister);
		Precast.doPrecast(true);

        for (i = Areas.Act1.Jail_Level_3; i >= Areas.Act1.Jail_Level_1; i -= 1) {
			Pather.moveToExit(i, true);
			this.clearGhosts();
		}

		return true;
	};

	this.cathedral = function () { // inner cloister wp
        Pather.useWaypoint(Areas.Act1.Inner_Cloister);
		Precast.doPrecast(true);
        Pather.moveToExit(Areas.Act1.Cathedral, true);
		this.clearGhosts();

		return true;
	};

	this.tombs = function () { // canyon wp
		var i;

        Pather.useWaypoint(Areas.Act2.Canyon_Of_The_Magi);
		Precast.doPrecast(true);

        for (i = Areas.Act2.Tal_Rashas_Tomb_1; i <= Areas.Act2.Tal_Rashas_Tomb_7; i += 1) {
			Pather.moveToExit(i, true);
			this.clearGhosts();
            Pather.moveToExit(Areas.Act2.Canyon_Of_The_Magi, true);
		}

		return true;
	};

	this.flayerDungeon = function () { // flayer jungle wp
        var areas = [Areas.Act3.Flayer_Dungeon_Level_1, Areas.Act3.Flayer_Dungeon_Level_2, Areas.Act3.Flayer_Dungeon_Level_3];

        Pather.useWaypoint(Areas.Act3.Flayer_Jungle);
		Precast.doPrecast(true);

		while (areas.length) {
			Pather.moveToExit(areas.shift(), true);
			this.clearGhosts();
		}

		return true;
	};

	this.crystalinePassage = function () { // crystaline passage wp
        Pather.useWaypoint(Areas.Act5.Crystalized_Passage);
		Precast.doPrecast(true);
		this.clearGhosts();
        Pather.moveToExit(Areas.Act5.Frozen_River, true); // frozen river
		this.clearGhosts();

		return true;
	};

	this.glacialTrail = function () { // glacial trail wp
        Pather.useWaypoint(Areas.Act5.Glacial_Trail);
		Precast.doPrecast(true);
		this.clearGhosts();
        Pather.moveToExit(Areas.Act5.Drifter_Cavern, true); // drifter
		this.clearGhosts();

		return true;
	};

	this.icyCellar = function () { // glacial trail wp
        Pather.useWaypoint(Areas.Act5.Ancients_Way);
		Precast.doPrecast(true);
        Pather.moveToExit(Areas.Act5.Icy_Cellar, true); // drifter
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