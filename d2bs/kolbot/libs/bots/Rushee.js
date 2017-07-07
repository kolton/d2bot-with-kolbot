/**
*	@filename	Rushee.js
*	@author		kolton
*	@desc		Rushee script that works with Rusher
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

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
        if (unit.area <= Areas.Act1.Moo_Moo_Farm) {
			return 1;
		}

        if (unit.area >= Areas.Act2.Lut_Gholein && unit.area <= Areas.Act2.Arcane_Sanctuary) {PlayerModes.Dead
			return 2;
		}

        if (unit.area >= Areas.Act3.Kurast_Docktown && unit.area <= Areas.Act3.Durance_Of_Hate_Level_3) {
			return 3;
		}

        if (unit.area >= Areas.Act4.The_Pandemonium_Fortress && unit.area <= Areas.Act4.Chaos_Sanctuary) {
			return 4;
		}

		return 5;
	};

	this.revive = function () {
        while (me.mode === PlayerModes.Death) {
			delay(40);
		}

        if (me.mode === PlayerModes.Dead) {
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

        chest = getUnit(UnitType.Object, chestid);

		if (!chest) {
			return false;
		}

		Misc.openChest(chest);

        item = getUnit(UnitType.Item, classid);

		if (!item) {
			if (getTickCount() - tick < 500) {
				delay(500);
			}

			return false;
		}

		return Pickit.pickItem(item) && delay(1000);
	};

	this.checkQuestMonster = function (classid) {
        var monster = getUnit(UnitType.NPC, classid);

		if (monster) {
            while (monster.mode !== NPCModes.dead && monster.mode !== NPCModes.death) {
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
		print("making staff");
		transmute();
		delay(750 + me.ping);
		Cubing.emptyCube();
		me.cancel();

		return true;
	};

	this.placeStaff = function () {
		var staff, item,
			tick = getTickCount(),
            orifice = getUnit(UnitType.Object, UniqueObjectIds.Holder_For_Horadric_Staff);

		if (!orifice) {
			return false;
		}

		Misc.openChest(orifice);

        staff = me.getItem(ItemClassIds.Horadric_Staff);

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
        item = me.findItem(-1, ItemModes.Item_In_Inventory_Stash_Cube_Or_Store, ItemLocation.Inventory);

		if (item && item.toCursor()) {
			Storage.Inventory.MoveTo(item);
		}

		return true;
	};

	this.changeAct = function (act) {
		var npc,
			preArea = me.area;

        if (me.mode === PlayerModes.Dead) {
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

                npc = getUnit(UnitType.NPC, "warriv");

				if (!npc || !npc.openMenu()) {
					return false;
				}

                Misc.useMenu(NPCMenu.Go_East);

				break;
			case 3:
				if (me.act >= 3) {
					break;
				}

                Pather.usePortal(Areas.Act2.Harem_Level_1, Config.Leader);
                Pather.moveToExit(Areas.Act2.Lut_Gholein, true);

                npc = getUnit(UnitType.NPC, "jerhyn");

				if (!npc || !npc.openMenu()) {
					Pather.moveTo(5166, 5206);

					return false;
				}

				me.cancel();
                Pather.moveToExit(Areas.Act2.Harem_Level_1, true);
                Pather.usePortal(Areas.Act2.Lut_Gholein, Config.Leader);
				Town.move("meshif");

				npc = getUnit(1, "meshif");

				if (!npc || !npc.openMenu()) {
					return false;
				}

                Misc.useMenu(NPCMenu.Sail_East);

				break;
			case 4:
				if (me.act >= 4) {
					break;
				}

				if (me.inTown) {
					Town.move("cain");

                    npc = getUnit(UnitType.NPC, "deckard cain");

					if (!npc || !npc.openMenu()) {
						return false;
					}

					me.cancel();
                    Pather.usePortal(Areas.Act3.Durance_Of_Hate_Level_3, Config.Leader);
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

                npc = getUnit(UnitType.NPC, "tyrael");

				if (!npc || !npc.openMenu()) {
					return false;
				}

				delay(me.ping + 1);

                if (getUnit(UnitType.Object, UniqueObjectIds.Harrogath_LastPortal)) {
					me.cancel();
                    Pather.useUnit(UnitType.Object, UniqueObjectIds.Harrogath_LastPortal, Areas.Act5.Harrogath);
				} else {
                    Misc.useMenu(NPCMenu.Travel_to_Harrogath);
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
                        case Areas.Act2.A2_Sewers_Level_3: // Pick Book of Skill, use Book of Skill
						Town.move("portalspot");
                        Pather.usePortal(Areas.Act2.A2_Sewers_Level_3, Config.Leader);
						delay(500);

						while (true) {
                            target = getUnit(UnitType.Item, ItemClassIds.Book_Of_Skill);

							if (!target) {
								break;
							}

							Pickit.pickItem(target);
							delay(250);

                            if (me.getItem(ItemClassIds.Book_Of_Skill)) {
								print("Using book of skill");
                                clickItem(ClickType.Right_Click, me.getItem(ItemClassIds.Book_Of_Skill));

								break;
							}
						}

                        Pather.usePortal(Areas.Act2.Lut_Gholein, Config.Leader);
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
                        case Areas.Act1.Catacombs_Level_4: // Catacombs level 4
                            if (!Pather.usePortal(Areas.Act1.Catacombs_Level_4, Config.Leader)) {
							break;
						}

						target = Pather.getPortal(null, Config.Leader);

						if (target) {
							Pather.walkTo(target.x, target.y);
						}

						actions.shift();

						break;
                        case Areas.Act2.A2_Sewers_Level_3:
						Town.move("portalspot");

                        if (Pather.usePortal(Areas.Act2.A2_Sewers_Level_3, Config.Leader)) {
							actions.shift();
						}

						break;
                        case Areas.Act2.Halls_Of_The_Dead_Level_3: // Halls of the Dead level 3
                            Pather.usePortal(Areas.Act2.Halls_Of_The_Dead_Level_3, Config.Leader);
                            this.getQuestItem(ItemClassIds.Horadric_Cube, ItemClassIds.Casque);
                        Pather.usePortal(Areas.Act2.Lut_Gholein, Config.Leader);

						actions.shift();

						break;
                        case Areas.Act2.Claw_Viper_Temple_Level_2: // Claw Viper Temple level 2
                            Pather.usePortal(Areas.Act2.Claw_Viper_Temple_Level_2, Config.Leader);
                            this.getQuestItem(ItemClassIds.Viper_Amulet, ItemClassIds.Lance);
                        Pather.usePortal(Areas.Act2.Lut_Gholein, Config.Leader);
						Town.move("drognan");

                        target = getUnit(UnitType.NPC, "drognan");

						if (target && target.openMenu()) {
							actions.shift();
							me.cancel();
							say("drognan done");
						}

						Town.move("portalspot");

						break;
                        case Areas.Act2.Maggot_Lair_Level_3: // Maggot Lair level 3
                            Pather.usePortal(Areas.Act2.Maggot_Lair_Level_3, Config.Leader);
                            this.getQuestItem(ItemClassIds.Staff_of_Kings, ItemClassIds.Winged_Helm);
						delay(500);
                        Pather.usePortal(Areas.Act2.Lut_Gholein, Config.Leader);
						this.cubeStaff();

						actions.shift();

						break;
                        case Areas.Act2.Arcane_Sanctuary: // Arcane Sanctuary
                            if (!Pather.usePortal(Areas.Act2.Arcane_Sanctuary, Config.Leader)) {
							break;
						}

						actions.shift();

						break;
                        case Areas.Act2.Tal_Rashas_Tomb_1: // Tal Rasha's Tombs
					case Areas.Act2.Tal_Rashas_Tomb_2:
					case Areas.Act2.Tal_Rashas_Tomb_3:
					case Areas.Act2.Tal_Rashas_Tomb_4:
					case Areas.Act2.Tal_Rashas_Tomb_5:
					case Areas.Act2.Tal_Rashas_Tomb_6:
                    case Areas.Act2.Tal_Rashas_Tomb_7:
						Pather.usePortal(null, Config.Leader);
						this.placeStaff();
                        Pather.usePortal(Areas.Act2.Lut_Gholein, Config.Leader);
						actions.shift();

						break;
                    case Areas.Act2.Duriels_Lair: // Duriel's Lair
                            Pather.usePortal(Areas.Act2.Duriels_Lair, Config.Leader);
						this.tyraelTalk();

						actions.shift();

						break;
                    case Areas.Act3.Travincal: // Travincal
                            if (!Pather.usePortal(Areas.Act3.Travincal, Config.Leader)) {
							me.cancel();

							break;
						}

						actions.shift();

						break;
                    case Areas.Act3.Ruined_Temple: // Ruined Temple
                            if (!Pather.usePortal(Areas.Act3.Ruined_Temple, Config.Leader)) {
							me.cancel();

							break;
						}

                            target = getUnit(UnitType.Object, UniqueObjectIds.Lam_Esens_Tome);

						Misc.openChest(target);
						delay(300);

                        target = getUnit(UnitType.Item, ItemClassIds.Lam_Esens_Tome);

						Pickit.pickItem(target);
                        Pather.usePortal(Areas.Act3.Kurast_Docktown, Config.Leader);
						Town.move("alkor");

                        target = getUnit(UnitType.NPC, "alkor");

						if (target && target.openMenu()) {
							me.cancel();
						}

						Town.move("portalspot");
						actions.shift();

						break;
                    case Areas.Act3.Durance_Of_Hate_Level_3: // Durance of Hate level 3
                            if (!Pather.usePortal(Areas.Act3.Durance_Of_Hate_Level_3, Config.Leader)) {
							me.cancel();

							break;
						}

						actions.shift();

						break;
                    case Areas.Act4.Outer_Steppes: // sometimes the portal can be in city of the damned...
                    case Areas.Act4.Plains_Of_Despair:
						if (Pather.usePortal(null, Config.Leader)) {
							actions.shift();
						}

						break;
                    case Areas.Act4.Chaos_Sanctuary: // Chaos Sanctuary
                            Pather.usePortal(Areas.Act4.Chaos_Sanctuary, Config.Leader);
						Pather.moveTo(7762, 5268);
						Packet.flash(me.gid);
						delay(500);
						Pather.walkTo(7763, 5267, 2);

                        while (!getUnit(UnitType.NPC, UnitClassID.diablo)) {
							delay(500);
						}

						Pather.moveTo(7763, 5267);
						actions.shift();

						break;
                    case Areas.Act5.Bloody_Foothills: // Bloody Foothils
                            Pather.usePortal(Areas.Act5.Bloody_Foothills, Config.Leader);
						actions.shift();

						break;
                    case Areas.Act5.Frozen_River: // Frozen River
						Town.move("malah");

                        target = getUnit(UnitType.NPC, "malah");

						if (target && target.openMenu()) {
							me.cancel();
						}

                        Pather.usePortal(Areas.Act5.Frozen_River, Config.Leader);
						delay(500);

                        target = getUnit(UnitType.Object, UniqueObjectIds.Frozen_Anya);

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
                            case Areas.Act5.Bloody_Foothills: // Shenk
							if (me.act === 5) {
								Town.move("larzuk");

                                target = getUnit(UnitType.NPC, "larzuk");

								if (target && target.openMenu()) {
									me.cancel();
								}
							}

							break;
                            case Areas.Act5.Frozen_River: // Anya
							if (me.act === 5) {
								Town.move("malah");

                                target = getUnit(UnitType.NPC, "malah");

								if (target && target.openMenu()) {
									me.cancel();
								}

                                if (me.getItem(ItemClassIds.Scroll_Of_Resistance)) {
									print("Using scroll of resistance");
                                    clickItem(ClickType.Right_Click, me.getItem(ItemClassIds.Scroll_Of_Resistance));
								}
							}

							break;
                            case Areas.Act4.Outer_Steppes:
                            case Areas.Act4.Plains_Of_Despair:
                                if (me.act === 4 && this.checkQuest(Quests.Act4.The_Fallen_Angel, 1)) {
								Town.move(NPC.Tyrael);

                                target = getUnit(UnitType.NPC, "tyrael");

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
                        case Areas.Act1.Catacombs_Level_4: // Catacombs level 4
						this.revive();

						// Go to town if not there, break if procedure fails
						if (!me.inTown && !Pather.usePortal(1, Config.Leader)) {
							break;
						}

                        if (!this.checkQuest(Quests.Act1.Sisters_to_the_Slaughter, 4)) {
							D2Bot.printToConsole("Andariel quest failed", 9);
							quit();
						}

						actions.shift();

						break;
                        case Areas.Act2.A2_Sewers_Level_3: // Sewers 3
						this.revive();

                        if (!me.inTown && !Pather.usePortal(Areas.Act2.Lut_Gholein, Config.Leader)) {
							break;
						}

						actions.shift();

						break;
                        case Areas.Act2.Arcane_Sanctuary: // Arcane Sanctuary
						this.revive();

                        if (!me.inTown && !Pather.usePortal(Areas.Act2.Lut_Gholein, Config.Leader)) {
							break;
						}

						Town.move("atma");

                        target = getUnit(UnitType.NPC, UnitClassID.atma); // Atma

						if (target && target.openMenu()) {
							me.cancel();
						} else {
							break;
						}

                        if (!this.checkQuest(Quests.Act2.The_Summoner, 0)) {
							D2Bot.printToConsole("Summoner quest failed", 9);
							quit();
						}

						Town.move("portalspot");
						actions.shift();

						break;
                        case Areas.Act3.Travincal: // Travincal
						this.revive();

                        if (!me.inTown && !Pather.usePortal(Areas.Act3.Kurast_Docktown, Config.Leader)) {
							break;
						}

						Town.move("cain");

                        target = getUnit(UnitType.NPC, NPC.Cain);

						if (target && target.openMenu()) {
							me.cancel();
						} else {
							break;
						}

                        if (!this.checkQuest(Quests.Act3.The_Blackened_Temple, 0)) {
							D2Bot.printToConsole("Travincal quest failed", 9);
							quit();
						}

						Town.move("portalspot");
						actions.shift();

						break;
                        case Areas.Act3.Durance_Of_Hate_Level_3: // Durance 2
						this.revive();

                        if (!Pather.usePortal(75, Config.Leader)) {
							break;
						}

						actions.shift();

						break;
                        case Areas.Act4.Outer_Steppes:
                        case Areas.Act4.Plains_Of_Despair:
						this.revive();

                        if (!me.inTown && !Pather.usePortal(Areas.Act4.The_Pandemonium_Fortress, Config.Leader)) {
							break;
						}

                        if (this.checkQuest(Quests.Act4.The_Fallen_Angel, 1)) {
							Town.move(NPC.Tyrael);

                            target = getUnit(UnitType.NPC, "tyrael");

							if (target && target.openMenu()) {
								me.cancel();
							}

							Town.move("portalspot");
						}

						actions.shift();

						break;
                        case Areas.Act4.Chaos_Sanctuary: // Chaos Sanctuary
						this.revive();

						if (me.gametype === GameType.Classic) {
							D2Bot.restart();

							break;
						}

                        if (!me.inTown && !Pather.usePortal(Areas.Act4.The_Pandemonium_Fortress, Config.Leader)) {
							break;
						}

						actions.shift();

						break;
                        case Areas.Act5.Bloody_Foothills: // Bloody Foothils
						this.revive();

                        if (!me.inTown && !Pather.usePortal(Areas.Act5.Harrogath, Config.Leader)) {
							break;
						}

						Town.move("larzuk");

                        target = getUnit(UnitType.NPC, "larzuk");

						if (target && target.openMenu()) {
							me.cancel();
						}

						Town.move("portalspot");
						actions.shift();

						break;
                        case Areas.Act5.Frozen_River: // Frozen River
						this.revive();

                        if (!me.inTown && !Pather.usePortal(Areas.Act5.Harrogath, Config.Leader)) {
							break;
						}

						Town.move("malah");

                        target = getUnit(UnitType.NPC, "malah");

						if (target && target.openMenu()) {
							me.cancel();
						}

                        if (me.getItem(ItemClassIds.Scroll_Of_Resistance)) {
							print("Using Scroll of Resistance");
                            clickItem(ClickType.Right_Click, me.getItem(ItemClassIds.Scroll_Of_Resistance));
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
                        case Areas.Act5.Arreat_Summit: // Arreat Summit
                            if (!Pather.usePortal(Areas.Act5.Arreat_Summit, Config.Leader)) {
							break;
						}

						// Wait until portal is gone
                            while (Pather.getPortal(Areas.Act5.Harrogath, Config.Leader)) {
							delay(500);
						}

						// Wait until portal is up again
                            while (!Pather.getPortal(Areas.Act5.Harrogath, Config.Leader)) {
							delay(500);
						}

                            if (!Pather.usePortal(Areas.Act5.Harrogath, Config.Leader)) {
							break;
						}

						actions.shift();

						break;
                        case Areas.Act5.The_Worldstone_Chamber: // Worldstone Chamber
                            if (!Pather.usePortal(Areas.Act5.The_Worldstone_Chamber, Config.Leader)) {
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

                    target = getUnit(UnitType.NPC, "jerhyn");

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
            if (me.mode === PlayerModes.Dead) {
				me.revive();

				while (!me.inTown) {
					delay(500);
				}
			}
		}

        if (getUIFlag(UIFlags.Trade_Prompt_up_ok_cancel_player_or_in_Trade_w_player)) {
			me.cancel();
		}

		delay(500);
	}

	return true;
}