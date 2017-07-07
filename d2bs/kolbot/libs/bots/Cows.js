/**
*	@filename	Cows.js
*	@author		kolton
*	@desc		clear the Moo Moo Farm without killing the Cow King
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Cows() {
	this.buildCowRooms = function () {
		var i, j, room, kingPreset, badRooms, badRooms2,
			finalRooms = [],
			indexes = [];

        kingPreset = getPresetUnit(me.area, UnitType.NPC, SuperUniques.The_Cow_King);
		badRooms = getRoom(kingPreset.roomx * 5 + kingPreset.x, kingPreset.roomy * 5 + kingPreset.y).getNearby();

		for (i = 0; i < badRooms.length; i += 1) {
			badRooms2 = badRooms[i].getNearby();

			for (j = 0; j < badRooms2.length; j += 1) {
				if (indexes.indexOf(badRooms2[j].x + "" + badRooms2[j].y) === -1) {
					indexes.push(badRooms2[j].x + "" + badRooms2[j].y);
				}
			}
		}

		room = getRoom();

		do {
			if (indexes.indexOf(room.x + "" + room.y) === -1) {
				finalRooms.push([room.x * 5 + room.xsize / 2, room.y * 5 + room.ysize / 2]);
			}
		} while (room.getNext());

		return finalRooms;
	};

	this.clearCowLevel = function () {
		if (Config.MFLeader) {
			Pather.makePortal();
			say("cows");
		}

		var room, result, myRoom,
			rooms = this.buildCowRooms();

		function RoomSort(a, b) {
			return getDistance(myRoom[0], myRoom[1], a[0], a[1]) - getDistance(myRoom[0], myRoom[1], b[0], b[1]);
		}

		while (rooms.length > 0) {
			// get the first room + initialize myRoom var
			if (!myRoom) {
				room = getRoom(me.x, me.y);
			}

			if (room) {
				if (room instanceof Array) { // use previous room to calculate distance
					myRoom = [room[0], room[1]];
				} else { // create a new room to calculate distance (first room, done only once)
					myRoom = [room.x * 5 + room.xsize / 2, room.y * 5 + room.ysize / 2];
				}
			}

			rooms.sort(RoomSort);
			room = rooms.shift();

			result = Pather.getNearestWalkable(room[0], room[1], 10, 2);

			if (result) {
				Pather.moveTo(result[0], result[1], 3);

				if (!Attack.clear(30)) {
					return false;
				}
			}
		}

		return true;
	};
	
	this.getLeg = function () {
		var i, portal, wirt, leg, gid;

        if (me.getItem(ItemClassIds.Wirts_Leg)) {
            return me.getItem(ItemClassIds.Wirts_Leg);
		}

        Pather.useWaypoint(Areas.Act1.Stony_Field);
		Precast.doPrecast(true);
        Pather.moveToPreset(me.area, UnitType.NPC, SuperUniques.Rakanishu, 8, 8);

		for (i = 0; i < 6; i += 1) {
            portal = Pather.getPortal(Areas.Act1.Tristram);

			if (portal) {
				Pather.usePortal(null, null, portal);

				break;
			}

			delay(500);
		}

		if (!portal) {
			throw new Error("Tristram portal not found");
		}

		Pather.moveTo(25048, 5177);

        wirt = getUnit(UnitType.Object, UniqueObjectIds.Wirts_Body);

		for (i = 0; i < 8; i += 1) {
			wirt.interact();
			delay(500);

            leg = getUnit(UnitType.Item, ItemClassIds.Wirts_Leg);

			if (leg) {
				gid = leg.gid;

				Pickit.pickItem(leg);
				Town.goToTown();

				return me.getItem(-1, -1, gid);
			}
		}

		throw new Error("Failed to get the leg");
	};
	
	this.getTome = function () {
		var tome,
            myTome = me.findItem("tbk", ItemModes.Item_In_Inventory_Stash_Cube_Or_Store, ItemLocation.Inventory),
			akara = Town.initNPC("Shop");

		tome = me.getItem("tbk");

		if (tome) {
			do {
				if (!myTome || tome.gid !== myTome.gid) {
					return copyUnit(tome);
				}
			} while (tome.getNext());
		}
		
		if (!akara) {
			throw new Error("Failed to buy tome");
		}

		tome = akara.getItem("tbk");

		if (tome.buy()) {
			tome = me.getItem("tbk");
			
			if (tome) {
				do {
					if (!myTome || tome.gid !== myTome.gid) {
						return copyUnit(tome);
					}
				} while (tome.getNext());
			}
		}

		throw new Error("Failed to buy tome");
	};

	this.openPortal = function (leg, tome) {
		var i;

		if (!Town.openStash()) {
			throw new Error("Failed to open stash");
		}

		if (!Cubing.emptyCube()) {
			throw new Error("Failed to empty cube");
		}

		if (!Storage.Cube.MoveTo(leg) || !Storage.Cube.MoveTo(tome) || !Cubing.openCube()) {
			throw new Error("Failed to cube leg and tome");
		}

		transmute();
		delay(500);

		for (i = 0; i < 10; i += 1) {
            if (Pather.getPortal(Areas.Act1.Moo_Moo_Farm)) {
				return true;
			}

			delay(200);
		}

		throw new Error("Portal not found");
	};

	var leg, tome;

	// we can begin now
    if (me.getQuest(Quests.Act1.The_Search_for_Cain, 10)) { // king dead or cain not saved
		throw new Error("Already killed the Cow King.");
	}

    if (!me.getQuest(Quests.Act1.The_Search_for_Cain, 0)) {
		throw new Error("Cain quest incomplete");
	}

	switch (me.gametype) {
	case GameType.Classic: // classic
            if (!me.getQuest(Quests.Act4.Terrors_End, 0)) { // diablo not completed
			throw new Error("Diablo quest incomplete.");
		}

		break;
	case GameType.Expansion: // expansion
            if (!me.getQuest(Quests.Act5.Eve_of_Destruction, 0)) { // baal not completed
			throw new Error("Baal quest incomplete.");
		}

		break;
	}

	Town.goToTown(1);
	Town.doChores();

	leg = this.getLeg();
	tome = this.getTome();

	this.openPortal(leg, tome);
    Pather.usePortal(Areas.Act1.Moo_Moo_Farm);
	Precast.doPrecast(false);
	this.clearCowLevel();

	return true;
}