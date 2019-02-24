/**
 *	@filename	BaalAssistant.js
 *	@author		kolton, modified by YGM
 *	@desc		Help or Leech Baal Runs.
 */

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
			case 1:
				// Sorceress
				if ([49].indexOf(Config.AttackSkill[1]) > -1) {
					if (me.getState(121)) {
						delay(500);
					} else {
						Skill.cast(Config.AttackSkill[1], 0, 15094, 5028);
					}
				}
				if ([53].indexOf(Config.AttackSkill[1]) > -1) {
					if (me.getState(121)) {
						delay(500);
					} else {
						Skill.cast(Config.AttackSkill[1], 0, 15094, 5028);
					}
				}
				if ([56].indexOf(Config.AttackSkill[1]) > -1) {
					if (me.getState(121)) {
						delay(500);
					} else {
						Skill.cast(Config.AttackSkill[1], 0, 15093, 5028);
					}
				}
				if ([59].indexOf(Config.AttackSkill[1]) > -1) {
					if (me.getState(121)) {
						delay(500);
					} else {
						Skill.cast(Config.AttackSkill[1], 0, 15095, 5028);
					}
				}
				if ([64].indexOf(Config.AttackSkill[1]) > -1) {
					if (me.getState(121)) {
						delay(500);
					} else {
						Skill.cast(Config.AttackSkill[1], 0, 15094, 5028);
					}
				}
				return true;
			case 3:
				// Paladin
				if (Config.AttackSkill[3] !== 112) {
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
			case 5:
				// Druid
				if (Config.AttackSkill[3] === 245) {
					Skill.cast(Config.AttackSkill[3], 0, 15094, 5028);
					return true;
				}
				break;
			case 6:
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
		var monster = getUnit(1);
		if (monster) {
			do {
				if (Attack.checkMonster(monster) && monster.y < 5080) {
					switch (monster.classid) {
						case 23:
						case 62:
							return 1;
						case 105:
						case 381:
							return 2;
						case 557:
							return 3;
						case 558:
							return 4;
						case 571:
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
			monster = getUnit(1, 691);
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
		var hydra = getUnit(1, getLocaleString(3325));
		if (hydra) {
			do {
				if (hydra.mode !== 12 && hydra.getStat(172) !== 2) {
					Pather.moveTo(15072, 5002);
					while (hydra.mode !== 12) {
						delay(500);
						if (!copyUnit(hydra).x) {
							break;
						}
					}
					break;
				}
			} while (hydra.getNext());
		}
		return true;
	};

	this.checkParty = function () {
		var i, partycheck;
		for (i = 0; i < Wait; i += 1) {
			partycheck = getParty();
			if (partycheck) {
				do {
					if (partycheck.area === 131) {
						return false;
					}
					if (partycheck.area === 107 || partycheck.area === 108) {
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

	if (Leader || autoLeaderDetect(109) || autoLeaderDetect(130) || autoLeaderDetect(131)) {
		print("ÿc<Leader: " + Leader);
		while (Misc.inMyParty(Leader)) {
			if (!secondAttempt && !safeCheck && !baalCheck && !ShrineStatus && GetShrine && me.area === 109 && me.area !== 131 && me.area !== 132) {

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
					Pather.useWaypoint(4);
					Precast.doPrecast(true);

					for (i = 4; i > 1; i -= 1) {
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
							Pather.useWaypoint(5);
							Precast.doPrecast(true);

							for (i = 5; i < 8; i += 1) {
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

			if (firstAttempt && !secondAttempt && !safeCheck && !baalCheck && me.area !== 131 && me.area !== 132) {
				if (RandomPrecast) {
					Pather.useWaypoint("random");
					Precast.doPrecast(true);
				} else {
					Pather.useWaypoint(129);
					Precast.doPrecast(true);
				}
			}

			if (me.area !== 131 && me.area !== 132) {
				if (SkipTP) {
					if (firstAttempt && !secondAttempt) {
						if (me.area !== 129) {
							Pather.useWaypoint(129);
						}
						if (!Pather.moveToExit([130, 131], false)) {
							throw new Error("Failed to move to WSK3.");
						}

						this.checkParty();

						for (i = 0; i < 3; i += 1) {
							entrance = getUnit(5, 82);

							if (entrance) {
								break;
							}

							delay(200);
						}

						if (entrance) {
							Pather.moveTo(entrance.x > me.x ? entrance.x - 5 : entrance.x + 5, entrance.y > me.y ? entrance.y - 5 : entrance.y + 5);
						}

						if (!Pather.moveToExit(131, true) || !Pather.moveTo(15118, 5002)) {
							throw new Error("Failed to move to Throne of Destruction.");
						}

						Pather.moveTo(15095, 5029);

						if ((SoulQuit && getUnit(1, 641)) || (DollQuit && getUnit(1, 691))) {
							print("Burning Souls or Undead Soul Killers found, ending script.");
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
							Pather.usePortal(131, null);
							if (me.mode === 17) {
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
						if (me.area !== 109) {
							Pather.useWaypoint(109);
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
							if (Pather.usePortal(131, null)) {
								break;
							}

							delay(1000);
						}

						if (i === Wait) {
							throw new Error("No portals to Throne.");
						}

						if ((SoulQuit && getUnit(1, 641)) || (DollQuit && getUnit(1, 691))) {
							print("Burning Souls or Undead Soul Killers found, ending script.");
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
							Pather.usePortal(131, null);
							if (me.mode === 17) {
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

			if (safeCheck && !baalCheck && me.area === 131 && me.area !== 132) {
				if (!baalCheck && !throneStatus) {
					if (Helper) {
						Attack.clear(15);
						this.clearThrone();

						Pather.moveTo(15094, me.classid === 3 ? 5029 : 5038);
						Precast.doPrecast(true);
					}

					tick = getTickCount();

					MainLoop: while (true) {
						if (Helper) {
							if (getDistance(me, 15094, me.classid === 3 ? 5029 : 5038) > 3) {
								Pather.moveTo(15094, me.classid === 3 ? 5029 : 5038);
							}
						}

						if (!getUnit(1, 543)) {
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
									while (Attack.checkMonster(getUnit(1, 571)) || Attack.checkMonster(getUnit(1, 572)) || Attack.checkMonster(getUnit(1, 573))) {
										delay(1000);
									}
									delay(1000);
								}

								break MainLoop;
							default:
								if (getTickCount() - tick < 7e3) {
									if (me.getState(2)) {
										Skill.setSkill(109, 0);
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

			if ((throneStatus || baalCheck) && KillBaal && me.area === 131) {
				if (Helper) {
					Pather.moveTo(15090, 5008);
					delay(2000);
					Precast.doPrecast(true);
				} else {
					Pather.moveTo(15090, 5010);
					Precast.doPrecast(true);
				}

				while (getUnit(1, 543)) {
					delay(500);
				}

				portal = getUnit(2, 563);

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

				if (me.mode === 17) {
					me.revive();
				}

				if (Helper) {
					delay(1000);
					Pather.moveTo(15134, 5923);
					baal = getUnit(1, 544);
					Attack.kill(544);
					Pickit.pickItems();
					if (ngCheck) {
						return true;
					}
					if (baal && (baal.mode === 0 || baal.mode === 12)) {
						return true;
					}
				} else {
					Pather.moveTo(15177, 5952);
					baal = getUnit(1, 544);
					while (baal) {
						delay(1000);
						if (ngCheck) {
							return true;
						}
						if (baal && (baal.mode === 0 || baal.mode === 12)) {
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