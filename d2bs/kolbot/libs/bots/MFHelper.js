/**
*	@filename	MFHelper.js
*	@author		kolton
*	@desc		help another player kill bosses or clear areas
*/

function MFHelper() {
	var player, playerAct, split,
		oldCommand = "",
		command = "";

	function ChatEvent(who, msg) {
		command = msg;
	}
	
	this.findPlayer = function () {
		var party = getParty();

		if (party) {
			do {
				if (party.name !== me.name && !party.inTown) {
					return party;
				}
			} while (party.getNext());
		}

		return false;
	};

	this.getPlayerAct = function (player) {
		switch (true) {
		case player.area > 0 && player.area <= 39:
			return 1;
		case player.area >= 40 && player.area <= 74:
			return 2;
		case player.area >= 75 && player.area <= 102:
			return 3;
		case player.area >= 103 && player.area <= 108:
			return 4;
		case player.area >= 109:
			return 5;
		}

		return false;
	};

	this.buildCowRooms = function () {
		var i, j, room, kingPreset, badRooms, badRooms2,
			finalRooms = [],
			indexes = [];

		kingPreset = getPresetUnit(me.area, 1, 773);
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

	addEventListener("chatmsg", ChatEvent);
	Town.doChores();
	Town.move("portalspot");

MainLoop:
	while (true) {
		if (!player) {
			player = this.findPlayer();
		}

		if (player) {
			playerAct = this.getPlayerAct(player);
		
			if (playerAct && playerAct !== me.act) {
				Town.goToTown(this.getPlayerAct(player));
				Town.move("portalspot");
			}
		}

		if (command !== oldCommand) {
			oldCommand = command;

			switch (true) {
			case command.indexOf("kill") > -1:
				print("Received command: kill");
				delay(500);

				split = command.split("kill ")[1];

				if (!Pather.usePortal(player.area, player.name)) {
					me.overhead("Failed to use TP");

					break;
				}

				Precast.doPrecast(false);

				try {
					if (!!parseInt(split, 10)) {
						split = parseInt(split, 10);
					}

					Attack.kill(split);
					Pickit.pickItems();
				} catch (killerror) {
					print(killerror);
				}

				delay(1000);

				if (!me.inTown && !Pather.usePortal(null, player.name)) {
					Town.goToTown();
				}

				break;
			case command.indexOf("clearlevel") > -1:
				print("Received command: clearlevel");
				delay(500);

				if (!Pather.usePortal(player.area, player.name)) {
					me.overhead("Failed to use TP");

					break;
				}

				Precast.doPrecast(false);
				Attack.clearLevel(Config.ClearType);
				Precast.doPrecast(true);

				if (!Pather.usePortal(null, player.name)) {
					Town.goToTown();
				}

				break;
			case command.indexOf("clear") > -1:
				print("Received command: clear");
				delay(500);

				split = command.split("clear ")[1]

				if (!Pather.usePortal(player.area, player.name)) {
					me.overhead("Failed to use TP");

					break;
				}

				Precast.doPrecast(false);

				try {
					if (!!parseInt(split, 10)) {
						split = parseInt(split, 10);
					}

					Attack.clear(15, 0, split);
				} catch (killerror) {
					print(killerror);
				}

				delay(1000);

				if (!me.inTown && !Pather.usePortal(null, player.name)) {
					Town.goToTown();
				}

				break;
			case command.indexOf("quit") > -1:
				break MainLoop;
			case command.indexOf("cows") > -1:
				print("Received command: clear cows");
				delay(500);

				if (!Pather.usePortal(39)) {
					me.overhead("Failed to use the portal");

					break;
				}

				Precast.doPrecast(false);
				this.clearCowLevel();
				delay(1000);

				if (!Pather.usePortal(null, player.name)) {
					Town.goToTown();
				}

				break;
			}
		}

		delay(100);
	}

	return true;
}