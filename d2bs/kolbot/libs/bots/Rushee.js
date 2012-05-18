// experimental script

function Rushee() {
	var quester, leader, target,
		leaderName = "",
		action = "";

	this.findLeader = function (name) {
		var party = getParty(name);

		if (party) {
			return party;
		}

		return false;
	};

	this.getQuestItem = function (classid, chestid) {
		var chest, item;

		chest = getUnit(2, chestid);

		if (!chest) {
			return false;
		}

		Misc.openChest(chest);

		item = getUnit(4, classid);

		if (!item) {
			return false;
		}

		return Pickit.pickItem(item);
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

		for (i = 0; i < 5; i += 1) {
			if (getDistance(me, npc) > 3) {
				Pather.moveToUnit(npc);
			}

			npc.interact();
			delay(500);
			me.cancel();

			if (Pather.usePortal(null)) {
				return true;
			}
		}

		return false;
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
			orifice = getUnit(2, 152);

		if (!orifice) {
			return false;
		}

		Misc.openChest(orifice);

		staff = me.getItem(91);

		if (!staff) {
			return false;
		}

		staff.toCursor();
		submitItem();
		delay(250 + me.ping);

		return true;
	};

	this.changeAct = function (act) {
		var npc,
			preArea = me.area;

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

			npc.useMenu(0x0D36);

			break;
		case 3:
			if (me.act >= 3) {
				break;
			}

			Town.move("palace");

			npc = getUnit(1, "jerhyn");

			if (!npc || !npc.openMenu()) {
				return false;
			}

			me.cancel();
			Town.move("meshif");

			npc = getUnit(1, "meshif");

			if (!npc || !npc.openMenu()) {
				return false;
			}

			npc.useMenu(0x0D38);

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
				Pather.usePortal(102, null);
			}

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
			Pather.usePortal(null);
			break;
		}

		delay(2000 + me.ping);

		while (!me.area) {
			delay(500);
		}

		if (me.area === preArea) {
			me.cancel();
			Town.move("portalspot");
			say("Act change failed.");

			return false;
		}

		Town.move("portalspot");
		say("Act change done.");

		return true;
	};

	addEventListener("chatmsg",
		function (who, msg) {
			if (who === leaderName) {
				action = msg;
			}
		}
		);

	while (!leader) {
		leader = this.findLeader(leaderName);
		
		delay(500);
	}

	say("Leader found.");
	
	while (true) {
		switch (action) {
		case "1":
			while (!leader.area) {
				delay(500);
			}

			if (!quester) {
				break;
			}

			switch (leader.area) {
			case 37: // Catacombs level 4
				Pather.usePortal(37, leaderName);
				this.checkQuestMonster(156);

				if (me.mode === 17) {
					me.revive();
					
					while (!me.inTown) {
						delay(500);
					}
				} else {
					Pather.usePortal(1, leaderName);
				}

				this.changeAct(2);

				action = "";

				break;
			case 60: // Halls of the Dead level 3
				Pather.usePortal(60, leaderName);
				this.getQuestItem(549, 354);
				Pather.usePortal(40, leaderName);

				action = "";

				break;
			case 61: // Claw Viper Temple level 2
				Pather.usePortal(61, leaderName);
				this.getQuestItem(521, 149);
				Pather.usePortal(40, leaderName);
				Town.move("drognan");

				target = getUnit(1, "drognan");

				if (target) {
					target.openMenu();
					me.cancel();
				}

				Town.move("portalspot");
				say("drognan done");

				action = "";

				break;
			case 64: // Maggot Lair level 3
				Pather.usePortal(64, leaderName);
				this.getQuestItem(92, 356);
				Pather.usePortal(40, leaderName);
				this.cubeStaff();

				action = "";

				break;
			case 74: // Arcane Sanctuary
				Pather.usePortal(74, leaderName);
				this.checkQuestMonster(250);

				if (me.mode === 17) {
					me.revive();
					
					while (!me.inTown) {
						delay(500);
					}
				} else {
					Pather.usePortal(40, leaderName);
				}

				Town.move("atma");

				target = getUnit(1, "atma");

				if (target) {
					target.openMenu();
					me.cancel();
				}

				Town.move("portalspot");

				action = "";

				break;
			case 66: // Tal Rasha's Tombs
			case 67:
			case 68:
			case 69:
			case 70:
			case 71:
			case 72:
				Pather.usePortal(null, leaderName);
				this.placeStaff();
				Pather.usePortal(40, leaderName);

				action = "";

				break;
			case 73: // Duriel's Lair
				Pather.usePortal(73, leaderName);
				this.tyraelTalk();
				this.changeAct(3);

				action = "";

				break;
			case 83: // Travincal
				Pather.usePortal(83, leaderName);
				this.checkQuestMonster(getLocaleString(2863));
				this.checkQuestMonster(getLocaleString(2862));
				this.checkQuestMonster(getLocaleString(2860));

				if (me.mode === 17) {
					me.revive();
					
					while (!me.inTown) {
						delay(500);
					}
				} else {
					Pather.usePortal(75, leaderName);
				}

				Town.move("cain");

				target = getUnit(1, "deckard cain");

				if (target) {
					target.openMenu();
					me.cancel();
				}

				Town.move("portalspot");

				action = "";

				break;
			case 102: // Durance of Hate level 3
				Pather.usePortal(102, leaderName);
				this.checkQuestMonster(242);

				if (me.mode === 17) {
					me.revive();
					
					while (!me.inTown) {
						delay(500);
					}
					
					Town.move("portalspot");
					Pather.usePortal(102, leaderName);
				}

				this.changeAct(4);

				action = "";

				break;
			case 108: // Chaos Sanctuary
				Pather.usePortal(108, leaderName);

				while (!getUnit(1, 243)) {
					delay(500);
				}

				this.checkQuestMonster(243);
				
				if (me.gametype === 0) {
					//quitGame();
					quit();
				} else {
					if (me.mode === 17) {
						me.revive();
						
						while (!me.inTown) {
							delay(500);
						}
					}
					
					Pather.usePortal(103, leaderName);
					this.changeAct(5);
				}

				action = "";

				break;
			}

			break;
		case me.name + " quest":
			say("I am quester.");

			quester = true;
			action = "";

			break;
		case "quit":
			quit();
			break;
		case "exit":
			quitGame();
			break;
		case "a2":
			if (!quester && me.act !== 2) {
				this.changeAct(2);
			}

			action = "";

			break;
		case "a3":
			if (!quester && me.act !== 3) {
				this.changeAct(3);
			}

			action = "";

			break;
		case "a4":
			if (!quester && me.act !== 4) {
				this.changeAct(4);
			}

			action = "";

			break;
		case "a5":
			if (!quester && me.act !== 5) {
				this.changeAct(5);
			}

			action = "";

			break;
		}

		delay(500);
	}

	return true;
}