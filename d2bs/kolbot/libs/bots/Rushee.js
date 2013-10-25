/**
*	@filename	Rushee.js
*	@author		kolton
*	@desc		Rushee script that works with Rusher
*/

function Rushee() {
	var act, leader, target,
		actions = [];

	this.findLeader = function (name) {
		var party = getParty(name);

		if (party) {
			return party;
		}

		return false;
	};

	// Get leader's act from Party Unit
	this.checkLeaderAct = function (unit) {
		if (unit.area <= 39) {
			return 1;
		}

		if (unit.area >= 40 && unit.area <= 74) {
			return 2;
		}

		if (unit.area >= 75 && unit.area <= 102) {
			return 3;
		}

		if (unit.area >= 103 && unit.area <= 108) {
			return 4;
		}

		return 5;
	};

	this.checkQuest = function (id, state) {
		sendPacket(1, 0x40);
		delay(500);

		return me.getQuest(id, state);
	};

	this.getQuestItem = function (classid, chestid) {
		var chest, item,
			tick = getTickCount();

		if (me.getItem(classid)) {
			return true;
		}

		if (me.inTown) {
			return false;
		}

		chest = getUnit(2, chestid);

		if (!chest) {
			return false;
		}

		Misc.openChest(chest);

		item = getUnit(4, classid);

		if (!item) {
			if (getTickCount() - tick < 500) {
				delay(500);
			}

			return false;
		}

		return Pickit.pickItem(item) && delay(1000);
	};

	this.checkQuestMonster = function (classid) {
		var monster = getUnit(1, classid);

		if (monster) {
			while (monster.mode !== 12) {
				delay(500);
			}

			return true;
		}

		return false;
	};

	this.tyraelTalk = function () {
		var i,
			npc = getUnit(1, "tyrael");

		if (!npc) {
			return false;
		}

		for (i = 0; i < 3; i += 1) {
			if (getDistance(me, npc) > 3) {
				Pather.moveToUnit(npc);
			}

			npc.interact();
			delay(1000 + me.ping);
			me.cancel();

			if (Pather.getPortal(null)) {
				me.cancel();

				break;
			}
		}

		return Pather.usePortal(null) || Pather.usePortal(null, Config.Leader);
	};

	this.cubeStaff = function () {
		var staff = me.getItem("vip"),
			amulet = me.getItem("msf");

		if (!staff || !amulet) {
			return false;
		}

		Storage.Cube.MoveTo(amulet);
		Storage.Cube.MoveTo(staff);
		Cubing.openCube();
		transmute();
		delay(750 + me.ping);
		Cubing.emptyCube();
		me.cancel();

		return true;
	};

	this.placeStaff = function () {
		var staff,
			tick = getTickCount(),
			orifice = getUnit(2, 152);

		if (!orifice) {
			return false;
		}

		Misc.openChest(orifice);

		staff = me.getItem(91);

		if (!staff) {
			if (getTickCount() - tick < 500) {
				delay(500);
			}

			return false;
		}

		staff.toCursor();
		submitItem();
		delay(750 + me.ping);

		return true;
	};

	this.changeAct = function (act) {
		var npc,
			preArea = me.area;

		if (me.mode === 17) {
			me.revive();

			while (!me.inTown) {
				delay(500);
			}
		}

		if (me.act === act) {
			return true;
		}

		try {
			switch (act) {
			case 2:
				if (me.act >= 2) {
					break;
				}

				Town.move("warriv");

				npc = getUnit(1, "warriv");

				if (!npc || !npc.openMenu()) {
					return false;
				}

				Misc.useMenu(0x0D36);

				break;
			case 3:
				if (me.act >= 3) {
					break;
				}

				Town.move("palace");

				npc = getUnit(1, "jerhyn");

				if (!npc || !npc.openMenu()) {
					Pather.moveTo(5166, 5206);

					return false;
				}

				me.cancel();
				Town.move("meshif");

				npc = getUnit(1, "meshif");

				if (!npc || !npc.openMenu()) {
					return false;
				}

				Misc.useMenu(0x0D38);

				break;
			case 4:
				if (me.act >= 4) {
					break;
				}

				if (me.inTown) {
					Town.move("cain");

					npc = getUnit(1, "deckard cain");

					if (!npc || !npc.openMenu()) {
						return false;
					}

					me.cancel();
					Pather.usePortal(102, Config.Leader);
				} else {
					delay(1500);
				}

				Pather.moveTo(17591, 8070);
				Pather.usePortal(null);

				break;
			case 5:
				if (me.act >= 5) {
					break;
				}

				Town.move("tyrael");

				npc = getUnit(1, "tyrael");

				if (!npc || !npc.openMenu()) {
					return false;
				}

				me.cancel();
				Pather.useUnit(2, 566, 109);

				break;
			}

			delay(1000 + me.ping * 2);

			while (!me.area) {
				delay(500);
			}

			if (me.area === preArea) {
				me.cancel();
				Town.move("portalspot");
				say("Act change failed.");

				return false;
			}

			say("Act change done.");
		} catch (e) {
			return false;
		}

		return true;
	};

	addEventListener("chatmsg",
		function (who, msg) {
			if (who === Config.Leader) {
				actions.push(msg);
			}
		});

	// START
	if (me.inTown) {
		Town.move("portalspot");
	}

	while (!leader) {
		leader = this.findLeader(Config.Leader);

		delay(500);
	}

	say("Leader found.");

	while (true) {
		try {
			if (actions.length > 0) {
				switch (actions[0]) {
				case "1":
					print("command: 1");

					while (!leader.area) {
						delay(500);
					}

					if (!Config.Rushee.Quester) {
						actions.shift();

						break;
					}

					act = this.checkLeaderAct(leader);

					if (me.act !== act) {
						Town.goToTown(act);
						Town.move("portalspot");
					}

					switch (leader.area) {
					case 37: // Catacombs level 4
						if (!Pather.usePortal(37, Config.Leader)) {
							break;
						}

						target = Pather.getPortal(null, Config.Leader);

						if (target) {
							Pather.walkTo(target.x, target.y);
						}

						actions.shift();

						break;
					case 60: // Halls of the Dead level 3
						Pather.usePortal(60, Config.Leader);
						this.getQuestItem(549, 354);
						Pather.usePortal(40, Config.Leader);

						actions.shift();

						break;
					case 61: // Claw Viper Temple level 2
						Pather.usePortal(61, Config.Leader);
						this.getQuestItem(521, 149);
						Pather.usePortal(40, Config.Leader);
						Town.move("drognan");

						target = getUnit(1, "drognan");

						if (target && target.openMenu()) {
							actions.shift();
							me.cancel();
							say("drognan done");
						}

						Town.move("portalspot");

						break;
					case 64: // Maggot Lair level 3
						Pather.usePortal(64, Config.Leader);
						this.getQuestItem(92, 356);
						delay(500);
						Pather.usePortal(40, Config.Leader);
						this.cubeStaff();

						actions.shift();

						break;
					case 74: // Arcane Sanctuary
						if (!Pather.usePortal(74, Config.Leader)) {
							break;
						}

						actions.shift();

						break;
					case 66: // Tal Rasha's Tombs
					case 67:
					case 68:
					case 69:
					case 70:
					case 71:
					case 72:
						Pather.usePortal(null, Config.Leader);
						this.placeStaff();
						Pather.usePortal(40, Config.Leader);
						actions.shift();

						break;
					case 73: // Duriel's Lair
						Pather.usePortal(73, Config.Leader);
						this.tyraelTalk();

						actions.shift();

						break;
					case 83: // Travincal
						if (me.inTown) {
							if (!Pather.usePortal(83, Config.Leader)) {
								me.cancel();

								break;
							}

							target = Pather.getPortal(null, Config.Leader);

							if (target) {
								Pather.walkTo(target.x, target.y);
							}
						}

						actions.shift();

						break;
					case 102: // Durance of Hate level 3
						if (me.area === 75) {
							Pather.usePortal(102, Config.Leader);
						}

						if (me.area === 102) {
							//this.checkQuestMonster(242);
							while (leader.area === me.area) {
								delay(500);
							}

							if (me.mode === 17) {
								me.revive();

								while (!me.inTown) {
									delay(500);
								}

								Town.move("portalspot");
								Pather.usePortal(102, Config.Leader);
							}

							actions.shift();
						}

						break;
					case 108: // Chaos Sanctuary
						Pather.usePortal(108, Config.Leader);

						while (!getUnit(1, 243)) {
							delay(500);
						}

						Pather.moveTo(7763, 5267);
						this.checkQuestMonster(243);

						if (me.gametype === 0) {
							D2Bot.restart();
						} else {
							if (me.mode === 17) {
								me.revive();

								while (!me.inTown) {
									delay(500);
								}
							}

							Pather.usePortal(103, Config.Leader);
						}

						actions.shift();

						break;
					default: // unsupported area
						actions.shift();

						break;
					}

					break;
				case "2": // Go back to town and check quest
					print("command: 2");

					// If dying, wait until animation is over
					while (me.mode === 0) {
						delay(40);
					}

					// Revive if dead
					if (me.mode === 17) {
						me.revive();

						// Wait until revive is complete
						while (!me.inTown) {
							delay(40);
						}
					}

					switch (me.area) {
					case 1:
					case 37: // Catacombs level 4
						// Go to town if not there, break if procedure fails
						if (!me.inTown && !Pather.usePortal(1, Config.Leader)) {
							break;
						}

						if (!this.checkQuest(6, 4)) {
							D2Bot.printToConsole("Andariel quest failed", 9);
							quit();
						}

						actions.shift();

						break;
					case 40:
					case 74: // Arcane Sanctuary
						if (!me.inTown && !Pather.usePortal(40, Config.Leader)) {
							break;
						}

						Town.move("atma");

						target = getUnit(1, 176); // Atma

						if (target && target.openMenu()) {
							me.cancel();
						} else {
							break;
						}

						if (!this.checkQuest(13, 0)) {
							D2Bot.printToConsole("Summoner quest failed", 9);
							quit();
						}

						Town.move("portalspot");
						actions.shift();

						break;
					case 75:
					case 83: // Travincal
						if (!me.inTown && !Pather.usePortal(75, Config.Leader)) {
							break;
						}

						Town.move("cain");

						target = getUnit(1, NPC.Cain);

						if (target && target.openMenu()) {
							me.cancel();
						} else {
							break;
						}

						if (!this.checkQuest(21, 0)) {
							D2Bot.printToConsole("Travincal quest failed", 9);
							quit();
						}

						Town.move("portalspot");
						actions.shift();

						break;
					}

					break;
				case "3": // Bumper
					if (!Config.Rushee.Bumper) {
						break;
					}

					while (!leader.area) {
						delay(500);
					}

					act = this.checkLeaderAct(leader);

					if (me.act !== act) {
						Town.goToTown(act);
						Town.move("portalspot");
					}

					switch (leader.area) {
					case 120: // Arreat Summit
						if (!Pather.usePortal(120, Config.Leader)) {
							break;
						}

						// Wait until portal is gone
						while (Pather.getPortal(109, Config.Leader)) {
							delay(500);
						}

						// Wait until portal is up again
						while (!Pather.getPortal(109, Config.Leader)) {
							delay(500);
						}

						if (!Pather.usePortal(109, Config.Leader)) {
							break;
						}

						actions.shift();

						break;
					case 132: // Worldstone Chamber
						if (!Pather.usePortal(132, Config.Leader)) {
							break;
						}

						actions.shift();

						break;
					}

					break;
				case "quit":
					quit();

					break;
				case "exit":
					D2Bot.restart();

					break;
				case "a2":
					if (!this.changeAct(2)) {
						break;
					}

					target = getUnit(1, "jerhyn");

					if (target) {
						target.openMenu();
					}

					me.cancel();

					if (Config.Rushee.Quester) {
						Town.move("portalspot");
					} else {
						Town.move("palace");
					}

					actions.shift();

					break;
				case "a3":
					if (!this.changeAct(3)) {
						break;
					}

					Town.move("portalspot");
					actions.shift();

					break;
				case "a4":
					if (!this.changeAct(4)) {
						break;
					}

					Town.move("portalspot");
					actions.shift();

					break;
				case "a5":
					if (!this.changeAct(5)) {
						break;
					}

					Town.move("portalspot");
					actions.shift();

					break;
				default: // Invalid command
					actions.shift();

					break;
				}
			}
		} catch (e) {
			if (me.mode === 17) {
				me.revive();

				while (!me.inTown) {
					delay(500);
				}
			}
		}

		if (getUIFlag(0x17)) {
			me.cancel();
		}

		delay(500);
	}

	return true;
}