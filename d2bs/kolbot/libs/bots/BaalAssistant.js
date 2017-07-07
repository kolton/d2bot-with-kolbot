/**
 *	@filename	BaalAssistant.js
 *	@author		kolton, modified by YGM
 *	@desc		Help or Leech Baal Runs.
 */
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };
 
function BaalAssistant() {
	
	var Leader = Config.Leader, // Not entriely needed in the configs.
		KillNihlathak = Config.BaalAssistant.KillNihlathak,
		FastChaos = Config.BaalAssistant.FastChaos,
		Wait = Config.BaalAssistant.Wait, // Not entriely needed in the configs.
		Helper = Config.BaalAssistant.Helper,
		GetShrine = Config.BaalAssistant.GetShrine,
		GetShrineWaitForHotTP = Config.BaalAssistant.GetShrineWaitForHotTP,
		RandomPrecast = Config.RandomPrecast, // Not entriely needed in the configs.
		SkipTP = Config.BaalAssistant.SkipTP,
		WaitForSafeTP = Config.BaalAssistant.WaitForSafeTP,
		DollQuit = Config.BaalAssistant.DollQuit,
		SoulQuit = Config.BaalAssistant.SoulQuit,
		KillBaal = Config.BaalAssistant.KillBaal, 
		hotTPMessage = Config.BaalAssistant.HotTPMessage, // Not entriely needed in the configs.
		safeTPMessage = Config.BaalAssistant.SafeTPMessage, // Not entriely needed in the configs.
		baalMessage = Config.BaalAssistant.BaalMessage, // Doesn't need to be in configs.
		nextGameMessage = Config.BaalAssistant.NextGameMessage, // Doesn't need to be in configs.
		hotCheck = false,
		safeCheck = false,
		baalCheck = false,
		ngCheck = false,
		ShrineStatus = false,
		secondAttempt = false,
		throneStatus = false,
		firstAttempt = true,
		i, solofail, partymembers, baal, portal, tick, entrance;

	addEventListener('chatmsg',

	function (nick, msg) {
		if (nick === Leader) {
			for (i = 0; i < hotTPMessage.length; i += 1) {
				if (msg.toLowerCase().indexOf(hotTPMessage[i].toLowerCase()) > -1) {
					hotCheck = true;
					break;
				}
			}

			for (i = 0; i < safeTPMessage.length; i += 1) {
				if (msg.toLowerCase().indexOf(safeTPMessage[i].toLowerCase()) > -1) {
					safeCheck = true;
					break;
				}
			}

			for (i = 0; i < baalMessage.length; i += 1) {
				if (msg.toLowerCase().indexOf(baalMessage[i].toLowerCase()) > -1) {
					baalCheck = true;
					break;
				}
			}

			for (i = 0; i < nextGameMessage.length; i += 1) {
				if (msg.toLowerCase().indexOf(nextGameMessage[i].toLowerCase()) > -1) {
					ngCheck = true;
					break;
				}
			}
		}
	});

	function autoLeaderDetect(destination) {
		do {
			solofail = 0;
			partymembers = getParty();

			do {
				if (partymembers.name !== me.name) {
					solofail += 1;
				}

				if (partymembers.area === destination) {
					Leader = partymembers.name;
					return true;
				}
			} while (partymembers.getNext());

			if (solofail === 0) {
				throw new Error("BaalHelper: You were alone!");
			}

			delay(500);

		} while (!Leader);

		return false;
	}

	this.preattack = function () {
		var check;
		switch (me.classid) {
            case ClassID.Sorceress:
				// Sorceress
                if ([Skills.Sorceress.Lightning].indexOf(Config.AttackSkill[1]) > -1) {
                    if (me.getState(States.SKILLDELAY)) {
						delay(500);
					} else {
						Skill.cast(Config.AttackSkill[1], 0, 15094, 5028);
					}
				}
                if ([Skills.Sorceress.Chain_Lightning].indexOf(Config.AttackSkill[1]) > -1) {
                    if (me.getState(States.SKILLDELAY)) {
						delay(500);
					} else {
						Skill.cast(Config.AttackSkill[1], 0, 15094, 5028);
					}
				}
                if ([Skills.Sorceress.Meteor].indexOf(Config.AttackSkill[1]) > -1) {
                    if (me.getState(States.SKILLDELAY)) {
						delay(500);
					} else {
						Skill.cast(Config.AttackSkill[1], 0, 15093, 5028);
					}
				}
                if ([Skills.Sorceress.Blizzard].indexOf(Config.AttackSkill[1]) > -1) {
                    if (me.getState(States.SKILLDELAY)) {
						delay(500);
					} else {
						Skill.cast(Config.AttackSkill[1], 0, 15095, 5028);
					}
				}
                if ([Skills.Sorceress.Frozen_Orb].indexOf(Config.AttackSkill[1]) > -1) {
                    if (me.getState(States.SKILLDELAY)) {
						delay(500);
					} else {
						Skill.cast(Config.AttackSkill[1], 0, 15094, 5028);
					}
				}
				return true;
            case ClassID.Paladin:
				// Paladin
                if (Config.AttackSkill[3] !== Skills.Paladin.Blessed_Hammer) {
					return false;
				}
				if (getDistance(me, 15094, 5029) > 3) {
					Pather.moveTo(15094, 5029);
				}
				if (Config.AttackSkill[4] > 0) {
					Skill.setSkill(Config.AttackSkill[4], 0);
				}
				Skill.cast(Config.AttackSkill[3], 1);
				return true;
            case ClassID.Druid:
				// Druid
                if (Config.AttackSkill[3] === Skills.Druid.Tornado) {
					Skill.cast(Config.AttackSkill[3], 0, 15094, 5028);
					return true;
				}
				break;
            case ClassID.Assassin:
				// Assassin
				if (Config.UseTraps) {
					check = ClassAttack.checkTraps({
						x: 15094,
						y: 5028
					});
					if (check) {
						ClassAttack.placeTraps({
							x: 15094,
							y: 5028
						}, 5);
						return true;
					}
				}
				break;
		}
		return false;
	};

	this.checkThrone = function () {
        var monster = getUnit(UnitType.NPC);
		if (monster) {
			do {
				if (Attack.checkMonster(monster) && monster.y < 5080) {
					switch (monster.classid) {
                        case UnitClassID.fallen5:
                        case UnitClassID.fallenshaman5:
							return 1;
                        case UnitClassID.unraveler5:
                        case UnitClassID.skmage_cold3:
							return 2;
                        case UnitClassID.baalhighpriest:
							return 3;
                        case UnitClassID.venomlord:
							return 4;
                        case UnitClassID.baalminion1:
							return 5;
						default:
							if (Helper) {
								Attack.getIntoPosition(monster, 10, 0x4);
								Attack.clear(15);
							}
							return false;

					}
				}
			} while (monster.getNext());
		}
		return false;
	};

	this.clearThrone = function () {
		var i, monster,
		monList = [],
			pos = [15094, 5022, 15094, 5041, 15094, 5060, 15094, 5041, 15094, 5022];
		if (Config.AvoidDolls) {
            monster = getUnit(UnitType.NPC, UnitClassID.bonefetish7);
			if (monster) {
				do {
					if (monster.x >= 15072 && monster.x <= 15118 && monster.y >= 5002 && monster.y <= 5079 && Attack.checkMonster(monster) && Attack.skipCheck(monster)) {
						monList.push(copyUnit(monster));
					}
				} while (monster.getNext());
			}
			if (monList.length) {
				Attack.clearList(monList);
			}
		}
		for (i = 0; i < pos.length; i += 2) {
			Pather.moveTo(pos[i], pos[i + 1]);
			Attack.clear(25);
		}
	};

	this.checkHydra = function () {
        var monster = getUnit(UnitType.NPC, "hydra");
		if (monster) {
			do {
                if (monster.mode !== NPCModes.dead && monster.getStat(Stats.alignment) !== 2) {
					Pather.moveTo(15072, 5002);
                    while (monster.mode !== NPCModes.dead) {
						delay(500);
						if (!copyUnit(monster).x) {
							break;
						}
					}
					break;
				}
			} while (monster.getNext());
		}
		return true;
	};

	this.checkParty = function () {
		var i, partycheck;
		for (i = 0; i < Wait; i += 1) {
			partycheck = getParty();
			if (partycheck) {
				do {
                    if (partycheck.area === Areas.Act5.Throne_Of_Destruction) {
						return false;
					}
                    if (partycheck.area === Areas.Act4.River_Of_Flame || partycheck.area === Areas.Act4.Chaos_Sanctuary) {
						return true;
					}
				} while (partycheck.getNext());
			}
			delay(1000);
		}

		if (i === Wait) {
			throw new Error("No players in Throne of Destruction");
		}

		return false;
	};

	// Start
	if (Leader) {
		for (i = 0; i < 30; i += 1) {
			if (Misc.inMyParty(Leader)) {
				break;
			}
			delay(1000);
		}

		if (i === 30) {
			throw new Error("BaalHelper: Leader not partied");
		}
	}

	if (KillNihlathak) {
		include("bots/Nihlathak.js");

		try {
			Nihlathak();
		} catch (e) {
			print(e);
		}
	}

	if (FastChaos) {
		include("bots/FastDiablo.js");

		try {
			Town.goToTown();
			FastDiablo();
		} catch (e2) {
			print(e2);
		}
	}

	Town.goToTown(5);
	Town.doChores();

    if (Leader || autoLeaderDetect(Areas.Act5.Harrogath) || autoLeaderDetect(Areas.Act5.The_Worldstone_Keep_Level_3) || autoLeaderDetect(Areas.Act5.Throne_Of_Destruction)) {
		print("ÿc<Leader: " + Leader);
		while (Misc.inMyParty(Leader)) {
            if (!secondAttempt && !safeCheck && !baalCheck && !ShrineStatus && GetShrine && me.area === Areas.Act5.Harrogath && me.area !== Areas.Act5.Throne_Of_Destruction && me.area !== Areas.Act5.The_Worldstone_Chamber) {

				if (GetShrineWaitForHotTP) {
					for (i = 0; i < Wait; i += 1) {
						if (hotCheck) {
							break;
						}
						delay(1000);
					}

					if (!hotCheck) {
						print("ÿc1" + "Leader didn't tell me to start hunting for an experience shrine.");
						ShrineStatus = true;
					}

				}

				if (!ShrineStatus) {
                    Pather.useWaypoint(Areas.Act1.Stony_Field);
					Precast.doPrecast(true);

                    for (i = Areas.Act1.Stony_Field; i > Areas.Act1.Rogue_Encampment; i -= 1) {
						if (safeCheck) {
							break;
						}
						if (Misc.getShrinesInArea(i, 15, true)) {
							break;
						}
					}

					if (!safeCheck) {
						if (i === 1) {
							Town.goToTown();
                            Pather.useWaypoint(Areas.Act1.Dark_Wood);
							Precast.doPrecast(true);

                            for (i = Areas.Act1.Dark_Wood; i < Areas.Act1.Den_Of_Evil; i += 1) {
								if (safeCheck) {
									break;
								}
								if (Misc.getShrinesInArea(i, 15, true)) {
									break;
								}
							}
						}
					}
				}
				Town.goToTown(5);
				ShrineStatus = true;
			}

            if (firstAttempt && !secondAttempt && !safeCheck && !baalCheck && me.area !== Areas.Act5.Throne_Of_Destruction && me.area !== Areas.Act5.The_Worldstone_Chamber) {
				if (RandomPrecast) {
					Pather.useWaypoint("random");
					Precast.doPrecast(true);
				} else {
                    Pather.useWaypoint(Areas.Act5.The_Worldstone_Keep_Level_2);
					Precast.doPrecast(true);
				}
			}

            if (me.area !== Areas.Act5.Throne_Of_Destruction && me.area !== Areas.Act5.The_Worldstone_Chamber) {
				if (SkipTP) {
					if (firstAttempt && !secondAttempt) {
                        if (me.area !== Areas.Act5.The_Worldstone_Keep_Level_2) {
                            Pather.useWaypoint(Areas.Act5.The_Worldstone_Keep_Level_2);
						}
                        if (!Pather.moveToExit([Areas.Act5.The_Worldstone_Keep_Level_3, Areas.Act5.Throne_Of_Destruction], false)) {
							throw new Error("Failed to move to WSK3.");
						}

						this.checkParty();

						for (i = 0; i < 3; i += 1) {
                            entrance = getUnit(UnitType.Warp, 82);

							if (entrance) {
								break;
							}

							delay(200);
						}

						if (entrance) {
							Pather.moveTo(entrance.x > me.x ? entrance.x - 5 : entrance.x + 5, entrance.y > me.y ? entrance.y - 5 : entrance.y + 5);
						}

                        if (!Pather.moveToExit(Areas.Act5.Throne_Of_Destruction, true) || !Pather.moveTo(15118, 5002)) {
							throw new Error("Failed to move to Throne of Destruction.");
						}

						Pather.moveTo(15095, 5029);

                        if ((SoulQuit && getUnit(UnitType.NPC, UnitClassID.willowisp7)) || (DollQuit && getUnit(UnitType.NPC, UnitClassID.bonefetish7))) {
							print("Undead soul killers or Undead stygian dolls found, ending script.");
							return true;
						}

						Pather.moveTo(15118, 5002);
						if (Helper) {
							Attack.clear(15);
							Pather.moveTo(15118, 5002);
						} else {
							Pather.moveTo(15117, 5045);
						}

						secondAttempt = true;
						safeCheck = true;
					} else {
						if (me.intown) {
							Town.move("portalspot");
                            Pather.usePortal(Areas.Act5.Throne_Of_Destruction, null);
                            if (me.mode === PlayerModes.Dead) {
								me.revive();
							}
							if (Helper) {
								Attack.clear(15);
								Pather.moveTo(15118, 5002);
							} else {
								Pather.moveTo(15117, 5045);
							}
						}
					}
				} else {
					if (firstAttempt && !secondAttempt) {
                        if (me.area !== Areas.Act5.Harrogath) {
                            Pather.useWaypoint(Areas.Act5.Harrogath);
						}

						Town.move("portalspot");

						if (WaitForSafeTP) {
							for (i = 0; i < Wait; i += 1) {
								if (safeCheck) {
									break;
								}
								delay(1000);
							}

							if (i === Wait) {
								throw new Error("No safe TP message.");
							}
						}

						for (i = 0; i < Wait; i += 1) {
                            if (Pather.usePortal(Areas.Act5.Throne_Of_Destruction, null)) {
								break;
							}

							delay(1000);
						}

						if (i === Wait) {
							throw new Error("No portals to Throne.");
						}

                        if ((SoulQuit && getUnit(UnitType.NPC, UnitClassID.bonefetish7)) || (DollQuit && getUnit(UnitType.NPC, UnitClassID.bonefetish6))) {
							print("Undead soul killers or Undead stygian dolls found, ending script.");
							return true;
						}

						if (Helper) {
							Attack.clear(15);
							Pather.moveTo(15118, 5002);
						} else {
							Pather.moveTo(15117, 5045);
						}

						secondAttempt = true;
						safeCheck = true;
					} else {
						if (me.intown) {
							Town.move("portalspot");
                            Pather.usePortal(Areas.Act5.Throne_Of_Destruction, null);
                            if (me.mode === PlayerModes.Dead) {
								me.revive();
							}
							if (Helper) {
								Attack.clear(15);
								Pather.moveTo(15118, 5002);
							} else {
								Pather.moveTo(15117, 5045);
							}
						}
					}
				}
			}

			for (i = 0; i < 5; i += 1) {
				if (ngCheck) {
					return true;
				}
				delay(100);
			}

            if (safeCheck && !baalCheck && me.area === Areas.Act5.Throne_Of_Destruction && me.area !== Areas.Act5.The_Worldstone_Chamber) {
				if (!baalCheck && !throneStatus) {
					if (Helper) {
						Attack.clear(15);
						this.clearThrone();

                        Pather.moveTo(15094, me.classid === ClassID.Paladin ? 5029 : 5038);
						Precast.doPrecast(true);
					}

					tick = getTickCount();

					MainLoop: while (true) {
						if (Helper) {
                            if (getDistance(me, 15094, me.classid === ClassID.Paladin ? 5029 : 5038) > 3) {
                                Pather.moveTo(15094, me.classid === ClassID.Paladin ? 5029 : 5038);
							}
						}

                        if (!getUnit(UnitType.NPC, UnitClassID.baalthrone)) {
							break MainLoop;
						}

						switch (this.checkThrone()) {
							case 1:
								if (Helper) {
									Attack.clear(40);
								}
								tick = getTickCount();

								break;
							case 2:
								if (Helper) {
									Attack.clear(40);
								}
								tick = getTickCount();

								break;
							case 4:
								if (Helper) {
									Attack.clear(40);
								}
								tick = getTickCount();

								break;
							case 3:
								if (Helper) {
									Attack.clear(40);
									this.checkHydra();
								}

								tick = getTickCount();

								break;
							case 5:
								if (Helper) {
									Attack.clear(40);
								} else {
                                    while (Attack.checkMonster(getUnit(UnitType.NPC, UnitClassID.baalminion1)) || Attack.checkMonster(getUnit(UnitType.NPC, UnitClassID.baalminion2)) || Attack.checkMonster(getUnit(UnitType.NPC, UnitClassID.baalminion3))) {
										delay(1000);
									}
									delay(1000);
								}

								break MainLoop;
							default:
								if (getTickCount() - tick < 7e3) {
                                    if (me.getState(States.POISON)) {
                                        Skill.setSkill(Skills.Paladin.Cleansing, 0);
									}

									break;
								}

								if (Helper) {
									if (!this.preattack()) {
										delay(100);
									}
								}

								break;
						}
						delay(10);
					}
					throneStatus = true;
					baalCheck = true;
				}
			}

			for (i = 0; i < 5; i += 1) {
				if (ngCheck) {
					return true;
				}
				delay(100);
			}

            if ((throneStatus || baalCheck) && KillBaal && me.area === Areas.Act5.Throne_Of_Destruction) {
				if (Helper) {
					Pather.moveTo(15090, 5008);
					delay(2000);
					Precast.doPrecast(true);
				} else {
					Pather.moveTo(15090, 5010);
					Precast.doPrecast(true);
				}

                while (getUnit(UnitType.NPC, UnitClassID.baalthrone)) {
					delay(500);
				}

                portal = getUnit(UnitType.Object, UniqueObjectIds.Worldstone_Chamber);

				if (portal) {
					if (Helper) {
						delay(1000);
					} else {
						delay(4000);
					}
					Pather.usePortal(null, null, portal);
				} else {
					throw new Error("Couldn't find portal.");
				}

                if (me.mode === PlayerModes.Dead) {
					me.revive();
				}

				if (Helper) {
					delay(1000);
					Pather.moveTo(15134, 5923);
                    baal = getUnit(UnitType.NPC, UnitClassID.baalcrab);
                    Attack.kill(UnitClassID.baalcrab);
					Pickit.pickItems();
					if (ngCheck) {
						return true;
					}
                    if (baal && (baal.mode === NPCModes.death || baal.mode === NPCModes.dead)) {
						return true;
					}
				} else {
					Pather.moveTo(15177, 5952);
                    baal = getUnit(UnitType.NPC, UnitClassID.baalcrab);
					while (baal) {
						delay(1000);
						if (ngCheck) {
							return true;
						}
                        if (baal && (baal.mode === NPCModes.death || baal.mode === NPCModes.dead)) {
							return true;
						}
					}
					return true;
				}

			} else {
				while (true) {
					if (ngCheck) {
						return true;
					}
					delay(500);
				}
			}

			delay(500);
		}
	} else {
		throw new Error("Empty game.");
	}

	return true;
}