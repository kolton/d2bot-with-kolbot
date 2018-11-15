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

	this.revive = function () {
		while (me.mode === 0) {
			delay(40);
		}

		if (me.mode === 17) {
			me.revive();

			while (!me.inTown) {
				delay(40);
			}
		}
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
			while (monster.mode !== 12 && monster.mode !== 0) {
				delay(500);
			}

			return true;
		}

		return false;
	};

	this.tyraelTalk = function () {
		var i,
			npc = getUnit(1, NPC.Tyrael);

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
		print("making staff");
		transmute();
		delay(750 + me.ping);

		staff = me.getItem(91);

		if (!staff) {
			return false;
		}

		Storage.Inventory.MoveTo(staff);
		me.cancel();

		return true;
	};

	this.placeStaff = function () {
		var staff, item,
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

		// unbug cursor
		item = me.findItem(-1, 0, 3);

		if (item && item.toCursor()) {
			Storage.Inventory.MoveTo(item);
		}

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

				Town.move(NPC.Warriv);

				npc = getUnit(1, NPC.Warriv);

				if (!npc || !npc.openMenu()) {
					return false;
				}

				Misc.useMenu(0x0D36);

				break;
			case 3:
				if (me.act >= 3) {
					break;
				}

				Pather.usePortal(50, Config.Leader);
				Pather.moveToExit(40, true);

				npc = getUnit(1, NPC.Jerhyn);

				if (!npc || !npc.openMenu()) {
					Pather.moveTo(5166, 5206);

					return false;
				}

				me.cancel();
				Pather.moveToExit(50, true);
				Pather.usePortal(40, Config.Leader);
				Town.move(NPC.Meshif);

				npc = getUnit(1, NPC.Meshif);

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
					Town.move(NPC.Cain);

					npc = getUnit(1, NPC.Cain);

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

				Town.move(NPC.Tyrael);

				npc = getUnit(1, NPC.Tyrael);

				if (!npc || !npc.openMenu()) {
					return false;
				}

				delay(me.ping + 1);

				if (getUnit(2, 566)) {
					me.cancel();
					Pather.useUnit(2, 566, 109);
				} else {
					Misc.useMenu(0x58D2);
				}

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
				case "all in":
					switch (leader.area) {
					case 49: // Pick Book of Skill, use Book of Skill
						Town.move("portalspot");
						Pather.usePortal(49, Config.Leader);
						delay(500);

						while (true) {
							target = getUnit(4, 552);

							if (!target) {
								break;
							}

							Pickit.pickItem(target);
							delay(250);

							if (me.getItem(552)) {
								print("Using book of skill");
								clickItem(1, me.getItem(552));

								break;
							}
						}

						Pather.usePortal(40, Config.Leader);
						actions.shift();

						break;
					}

					actions.shift();

					break;
				case "1":
					while (!leader.area) {
						delay(500);
					}

					//print(leader.area);

					if (!Config.Rushee.Quester) {
						//print("not a quester");
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
					case 49:
						Town.move("portalspot");

						if (Pather.usePortal(49, Config.Leader)) {
							actions.shift();
						}

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
						Town.move(NPC.Drognan);

						target = getUnit(1, NPC.Drognan);

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
						if (!Pather.usePortal(83, Config.Leader)) {
							me.cancel();

							break;
						}

						actions.shift();

						break;
					case 94: // Ruined Temple
						if (!Pather.usePortal(94, Config.Leader)) {
							me.cancel();

							break;
						}

						target = getUnit(2, 193);

						Misc.openChest(target);
						delay(300);

						target = getUnit(4, 548);

						Pickit.pickItem(target);
						Pather.usePortal(75, Config.Leader);
						Town.move(NPC.Alkor);

						target = getUnit(1, NPC.Alkor);

						if (target && target.openMenu()) {
							me.cancel();
						}

						Town.move("portalspot");
						actions.shift();

						break;
					case 102: // Durance of Hate level 3
						if (!Pather.usePortal(102, Config.Leader)) {
							me.cancel();

							break;
						}

						actions.shift();

						break;
					case 104: // sometimes the portal can be in city of the damned...
					case 105:
						if (Pather.usePortal(null, Config.Leader)) {
							actions.shift();
						}

						break;
					case 108: // Chaos Sanctuary
						Pather.usePortal(108, Config.Leader);
						Pather.moveTo(7762, 5268);
						Packet.flash(me.gid);
						delay(500);
						Pather.walkTo(7763, 5267, 2);

						while (!getUnit(1, 243)) {
							delay(500);
						}

						Pather.moveTo(7763, 5267);
						actions.shift();

						break;
					case 110: // Bloody Foothils
						Pather.usePortal(110, Config.Leader);
						actions.shift();

						break;
					case 114: // Frozen River
						Town.move(NPC.Malah);

						target = getUnit(1, NPC.Malah);

						if (target && target.openMenu()) {
							me.cancel();
						}

						Pather.usePortal(114, Config.Leader);
						delay(500);

						target = getUnit(2, 558);

						if (target) {
							Pather.moveToUnit(target);
							sendPacket(1, 0x13, 4, 0x2, 4, target.gid);
							delay(1000);
							me.cancel();
						}

						actions.shift();

						break;
					default: // unsupported area
						actions.shift();

						break;
					}

					break;
				case "2": // Go back to town and check quest
					if (!Config.Rushee.Quester) {
						switch (leader.area) {
						// Non-questers can piggyback off quester out messages
						case 110: // Shenk
							if (me.act === 5) {
								Town.move(NPC.Larzuk);

								target = getUnit(1, NPC.Larzuk);

								if (target && target.openMenu()) {
									me.cancel();
								}
							}

							break;
						case 114: // Anya
							if (me.act === 5) {
								Town.move(NPC.Malah);

								target = getUnit(1, NPC.Malah);

								if (target && target.openMenu()) {
									me.cancel();
								}

								if (me.getItem(646)) {
									print("Using scroll of resistance");
									clickItem(1, me.getItem(646));
								}
							}

							break;
						case 104:
						case 105:
							if (me.act === 4 && this.checkQuest(25, 1)) {
								Town.move(NPC.Tyrael);

								target = getUnit(1, NPC.Tyrael);

								if (target && target.openMenu()) {
									me.cancel();
								}
							}

							break;
						}

						actions.shift();

						break;
					}

					switch (me.area) {
					case 37: // Catacombs level 4
						this.revive();

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
					case 49: // Sewers 3
						this.revive();

						if (!me.inTown && !Pather.usePortal(40, Config.Leader)) {
							break;
						}

						actions.shift();

						break;
					case 74: // Arcane Sanctuary
						this.revive();

						if (!me.inTown && !Pather.usePortal(40, Config.Leader)) {
							break;
						}

						Town.move(NPC.Atma);

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
					case 83: // Travincal
						this.revive();

						if (!me.inTown && !Pather.usePortal(75, Config.Leader)) {
							break;
						}

						Town.move(NPC.Cain);

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
					case 102: // Durance 2
						this.revive();

						if (!Pather.usePortal(75, Config.Leader)) {
							break;
						}

						actions.shift();

						break;
					case 104:
					case 105:
						this.revive();

						if (!me.inTown && !Pather.usePortal(103, Config.Leader)) {
							break;
						}

						if (this.checkQuest(25, 1)) {
							Town.move(NPC.Tyrael);

							target = getUnit(1, NPC.Tyrael);

							if (target && target.openMenu()) {
								me.cancel();
							}

							Town.move("portalspot");
						}

						actions.shift();

						break;
					case 108: // Chaos Sanctuary
						this.revive();

						if (me.gametype === 0) {
							D2Bot.restart();

							break;
						}

						if (!me.inTown && !Pather.usePortal(103, Config.Leader)) {
							break;
						}

						actions.shift();

						break;
					case 110: // Bloody Foothils
						this.revive();

						if (!me.inTown && !Pather.usePortal(109, Config.Leader)) {
							break;
						}

						Town.move(NPC.Larzuk);

						target = getUnit(1, NPC.Larzuk);

						if (target && target.openMenu()) {
							me.cancel();
						}

						Town.move("portalspot");
						actions.shift();

						break;
					case 114: // Frozen River
						this.revive();

						if (!me.inTown && !Pather.usePortal(109, Config.Leader)) {
							break;
						}

						Town.move(NPC.Malah);

						target = getUnit(1, NPC.Malah);

						if (target && target.openMenu()) {
							me.cancel();
						}

						if (me.getItem(646)) {
							print("Using Scroll of Resistance");
							clickItem(1, me.getItem(646));
						}

						Town.move("portalspot");
						actions.shift();

						break;
					default:
						Town.move("portalspot");
						actions.shift();

						break;
					}

					break;
				case "3": // Bumper
					if (!Config.Rushee.Bumper) {
						actions.shift();

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
				case "bye ~":
					D2Bot.restart();

					break;
				case "a2":
					if (!this.changeAct(2)) {
						break;
					}

					target = getUnit(1, NPC.Jerhyn);

					if (target) {
						target.openMenu();
					}

					me.cancel();
					Town.move("portalspot");
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
				case me.name + " quest":
					say("I am quester.");

					Config.Rushee.Quester = true;

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