/**
*	@filename	MFHelper.js
*	@author		kolton
*	@desc		help another player kill bosses or clear areas
*/

function MFHelper() {
	var i, player, playerAct, split,
		oldCommand = "",
		command = "";

	function ChatEvent(name, msg) {
		if (!player) {
			var i,
				match = ["kill", "clearlevel", "clear", "quit", "cows"];

			if (msg) {
				for (i = 0; i < match.length; i += 1) {
					if (msg.match(match[i])) {
						player = this.findPlayer(name);

						break;
					}
				}
			}
		}

		if (player && name === player.name) {
			command = msg;
		}
	}

	this.findPlayer = function (name) {
		var party = getParty();

		if (party) {
			do {
				if (party.name !== me.name && party.name === name) {
					return party;
				}
			} while (party.getNext());
		}

		return false;
	};

	this.getPlayerAct = function (player) {
		if (player.area > 0 && player.area <= 39) {
			return 1;
		}

		if (player.area >= 40 && player.area <= 74) {
			return 2;
		}

		if (player.area >= 75 && player.area <= 102) {
			return 3;
		}

		if (player.area >= 103 && player.area <= 108) {
			return 4;
		}

		if (player.area >= 109) {
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
				if (indexes.indexOf(badRooms2[j].x.toString() + badRooms2[j].y.toString()) === -1) {
					indexes.push(badRooms2[j].x.toString() + badRooms2[j].y.toString());
				}
			}
		}

		room = getRoom();

		do {
			if (indexes.indexOf(room.x.toString() + room.y.toString()) === -1) {
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

	if (Config.Leader) {
		for (i = 0; i < 30; i += 1) {
			if (Misc.inMyParty(Config.Leader)) {
				break;
			}

			delay(1000);
		}

		if (i === 30) {
			throw new Error("Autobaal: Leader not partied");
		}

		player = this.findPlayer(Config.Leader);
	}

MainLoop:
	while (true) {
		if (player) {
			playerAct = this.getPlayerAct(player);

			if (playerAct && playerAct !== me.act) {
				Town.goToTown(this.getPlayerAct(player));
				Town.move("portalspot");
			}

			// Finish if leader is in chaos or throne
			if ([108, 131].indexOf(player.area) > -1) {
				break;
			}

			if (command !== oldCommand) {
				oldCommand = command;

				if (command.indexOf("kill") > -1) {
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
				} else if (command.indexOf("clearlevel") > -1) {
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
				} else if (command.indexOf("clear") > -1) {
					print("Received command: clear");
					delay(500);

					split = command.split("clear ")[1];

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
					} catch (killerror2) {
						print(killerror2);
					}

					delay(1000);

					if (!me.inTown && !Pather.usePortal(null, player.name)) {
						Town.goToTown();
					}
				} else if (command.indexOf("quit") > -1) {
					break MainLoop;
				} else if (command.indexOf("cows") > -1) {
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
				}
			}
		}

		delay(100);
	}

	return true;
}