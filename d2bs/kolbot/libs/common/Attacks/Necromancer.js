/**
*	@filename	Necromancer.js
*	@author		kolton
*	@desc		Necromancer attack sequence
*/

var ClassAttack = {
	novaTick: 0,
	cursesSet: false,
	curseState: [],

	initCurses: function () {
		var i;

		for (i = 0; i < Config.Curse.length; i += 1) {
			switch (Config.Curse[i]) {
			case 0: //nothing
				this.curseState[i] = 0;

				break;
			case 66: //amplify damage
				this.curseState[i] = 9;

				break;
			case 71: //dim vision
				this.curseState[i] = 23;

				break;
			case 72: //weaken
				this.curseState[i] = 19;

				break;
			case 76: //iron maiden
				this.curseState[i] = 55;

				break;
			case 77: //terror
				this.curseState[i] = 56;

				break;
			case 81: //confuse
				this.curseState[i] = 59;

				break;
			case 82: //life tap
				this.curseState[i] = 58;

				break;
			case 86: //attract
				this.curseState[i] = 57;

				break;
			case 87: //decrepify
				this.curseState[i] = 60;

				break;
			case 91: //lower resist
				this.curseState[i] = 61;

				break;
			default:
				Config.Curse[i] = 0;
				print("Invalid curse id");

				break;
			}
		}

		this.cursesSet = true;
	},

	doAttack: function (unit, preattack) {
		if (!this.cursesSet) {
			this.initCurses();
		}

		if (Config.MercWatch && Town.needMerc()) {
			Town.visitTown();
		}

		if (preattack && Config.AttackSkill[0] > 0 && Attack.checkResist(unit, Config.AttackSkill[0]) && (!me.getState(121) || !Skill.isTimed(Config.AttackSkill[0]))) {
			if (Math.round(getDistance(me, unit)) > Skill.getRange(Config.AttackSkill[0]) || checkCollision(me, unit, 0x4)) {
				if (!Attack.getIntoPosition(unit, Skill.getRange(Config.AttackSkill[0]), 0x4)) {
					return 0;
				}
			}

			Skill.cast(Config.AttackSkill[0], Skill.getHand(Config.AttackSkill[0]), unit);

			return 1;
		}

		var index, checkSkill, result,
			mercRevive = 0,
			timedSkill = -1,
			untimedSkill = -1;

		index = ((unit.spectype & 0x7) || unit.type === 0) ? 1 : 3;

		if (Config.Curse[0] > 0 && this.isCursable(unit) && (unit.spectype & 0x7) && !unit.getState(this.curseState[0])) {
			if (getDistance(me, unit) > 25 || checkCollision(me, unit, 0x4)) {
				if (!Attack.getIntoPosition(unit, 25, 0x4)) {
					return 0;
				}
			}

			Skill.cast(Config.Curse[0], 0, unit);

			return 1;
		}

		if (Config.Curse[1] > 0 && this.isCursable(unit) && !(unit.spectype & 0x7) && !unit.getState(this.curseState[1])) {
			if (getDistance(me, unit) > 25 || checkCollision(me, unit, 0x4)) {
				if (!Attack.getIntoPosition(unit, 25, 0x4)) {
					return 0;
				}
			}

			Skill.cast(Config.Curse[1], 0, unit);

			return 1;
		}

		// Get timed skill
		if (Attack.getCustomAttack(unit)) {
			checkSkill = Attack.getCustomAttack(unit)[0];
		} else {
			checkSkill = Config.AttackSkill[index];
		}

		if (Attack.checkResist(unit, checkSkill)) {
			timedSkill = checkSkill;
		} else if (Config.AttackSkill[5] > -1 && Attack.checkResist(unit, Config.AttackSkill[5]) && ([56, 59].indexOf(Config.AttackSkill[5]) === -1 || Attack.validSpot(unit.x, unit.y))) {
			timedSkill = Config.AttackSkill[5];
		}

		// Get untimed skill
		if (Attack.getCustomAttack(unit)) {
			checkSkill = Attack.getCustomAttack(unit)[1];
		} else {
			checkSkill = Config.AttackSkill[index + 1];
		}

		if (Attack.checkResist(unit, checkSkill)) {
			untimedSkill = checkSkill;
		} else if (Config.AttackSkill[6] > -1 && Attack.checkResist(unit, Config.AttackSkill[6]) && ([56, 59].indexOf(Config.AttackSkill[6]) === -1 || Attack.validSpot(unit.x, unit.y))) {
			untimedSkill = Config.AttackSkill[6];
		}

		// Low mana timed skill
		if (Config.LowManaSkill[0] > -1 && Skill.getManaCost(timedSkill) > me.mp && Attack.checkResist(unit, Config.LowManaSkill[0])) {
			timedSkill = Config.LowManaSkill[0];
		}

		// Low mana untimed skill
		if (Config.LowManaSkill[1] > -1 && Skill.getManaCost(untimedSkill) > me.mp && Attack.checkResist(unit, Config.LowManaSkill[1])) {
			untimedSkill = Config.LowManaSkill[1];
		}

		result = this.doCast(unit, timedSkill, untimedSkill);

		if (result === 1) {
			if (Config.ActiveSummon) {
				this.raiseArmy();
			}

			this.explodeCorpses(unit);
		} else if (result === 2 && Config.TeleStomp && Attack.checkResist(unit, "physical") && !!me.getMerc()) {
			while (Attack.checkMonster(unit)) {
				if (Town.needMerc()) {
					if (Config.MercWatch && mercRevive++ < 1) {
						Town.visitTown();
					} else {
						return 2;
					}
				}

				if (getDistance(me, unit) > 3) {
					Pather.moveToUnit(unit);
				}

				this.doCast(unit, Config.AttackSkill[1], Config.AttackSkill[2]);

				if (Config.ActiveSummon) {
					this.raiseArmy();
				}

				this.explodeCorpses(unit);
			}

			return 1;
		}

		return result;
	},

	afterAttack: function () {
		Misc.unShift();
		Precast.doPrecast(false);
		this.raiseArmy();
		this.novaTick = 0;
	},

	// Returns: 0 - fail, 1 - success, 2 - no valid attack skills
	doCast: function (unit, timedSkill, untimedSkill) {
		var i, walk;

		// No valid skills can be found
		if (timedSkill < 0 && untimedSkill < 0) {
			return 2;
		}

		// Check for bodies to exploit for CorpseExplosion before committing to an attack for non-summoner type necros
		if (Config.Skeletons + Config.SkeletonMages + Config.Revives === 0) {
			if (this.checkCorpseNearMonster(unit)) {
				this.explodeCorpses(unit);
			}
		}

		if (timedSkill > -1 && (!me.getState(121) || !Skill.isTimed(timedSkill))) {
			switch (timedSkill) {
			case 92: // Poison Nova
				if (!this.novaTick || getTickCount() - this.novaTick > Config.PoisonNovaDelay * 1000) {
					if (Math.round(getDistance(me, unit)) > Skill.getRange(timedSkill) || checkCollision(me, unit, 0x4)) {
						if (!Attack.getIntoPosition(unit, Skill.getRange(timedSkill), 0x4)) {
							return 0;
						}
					}

					if (!unit.dead && Skill.cast(timedSkill, Skill.getHand(timedSkill), unit)) {
						this.novaTick = getTickCount();
					}
				}

				break;
			case 500: // Pure Summoner
				if (Math.round(getDistance(me, unit)) > Skill.getRange(timedSkill) || checkCollision(me, unit, 0x4)) {
					if (!Attack.getIntoPosition(unit, Skill.getRange(timedSkill), 0x4)) {
						return 0;
					}
				}

				delay(300);

				break;
			default:
				if (Skill.getRange(timedSkill) < 4 && !Attack.validSpot(unit.x, unit.y)) {
					return 0;
				}

				if (Math.round(getDistance(me, unit)) > Skill.getRange(timedSkill) || checkCollision(me, unit, 0x4)) {
					// Allow short-distance walking for melee skills
					walk = Skill.getRange(timedSkill) < 4 && getDistance(me, unit) < 10 && !checkCollision(me, unit, 0x1);

					if (!Attack.getIntoPosition(unit, Skill.getRange(timedSkill), 0x4, walk)) {
						return 0;
					}
				}

				if (!unit.dead) {
					Skill.cast(timedSkill, Skill.getHand(timedSkill), unit);
				}

				break;
			}
		}

		if (untimedSkill > -1) {
			if (Skill.getRange(untimedSkill) < 4 && !Attack.validSpot(unit.x, unit.y)) {
				return 0;
			}

			if (Math.round(getDistance(me, unit)) > Skill.getRange(untimedSkill) || checkCollision(me, unit, 0x4)) {
				// Allow short-distance walking for melee skills
				walk = Skill.getRange(untimedSkill) < 4 && getDistance(me, unit) < 10 && !checkCollision(me, unit, 0x1);

				if (!Attack.getIntoPosition(unit, Skill.getRange(untimedSkill), 0x4, walk)) {
					return 0;
				}
			}

			if (!unit.dead) {
				Skill.cast(untimedSkill, Skill.getHand(untimedSkill), unit);
			}

			return 1;
		}

		for (i = 0; i < 25; i += 1) {
			if (!me.getState(121)) {
				break;
			}

			delay(40);
		}

		// Delay for Poison Nova
		while (this.novaTick && getTickCount() - this.novaTick < Config.PoisonNovaDelay * 1000) {
			delay(40);
		}

		return 1;
	},

	isCursable: function (unit) {
		if (copyUnit(unit).name === undefined || unit.name.indexOf(getLocaleString(11086)) > -1) { // "Possessed"
			return false;
		}

		if (unit.getState(57)) { // attract can't be overridden
			return false;
		}

		switch (unit.classid) {
		case 206: // Foul Crow Nest
		case 258: // Water Watcher
		case 261: // Water Watcher
		case 266: // Flavie
		case 528: // Evil Demon Hut
			return false;
		}

		return true;
	},

	raiseArmy: function (range) {
		var i, tick, count, corpse, corpseList, skill, maxSkeletons, maxMages, maxRevives;

		if (!range) {
			range = 25;
		}

		if (Config.Skeletons === "max") {
			skill = me.getSkill(70, 1);
			maxSkeletons = skill < 4 ? skill : (Math.floor(skill / 3) + 2);
		} else {
			maxSkeletons = Config.Skeletons;
		}

		if (Config.SkeletonMages === "max") {
			skill = me.getSkill(80, 1);
			maxMages = skill < 4 ? skill : (Math.floor(skill / 3) + 2);
		} else {
			maxMages = Config.SkeletonMages;
		}

		if (Config.Revives === "max") {
			skill = me.getSkill(95, 1);
			maxRevives = skill;
		} else {
			maxRevives = Config.Revives;
		}

		for (i = 0; i < 3; i += 1) {
			corpse = getUnit(1, -1, 12);
			corpseList = [];

			if (corpse) {
				do {
					if (getDistance(me, corpse) <= range && this.checkCorpse(corpse)) { // within casting distance
						corpseList.push(copyUnit(corpse));
					}
				} while (corpse.getNext());
			}

MainLoop:
			while (corpseList.length > 0) {
				corpse = corpseList.shift();

				if (me.getMinionCount(4) < maxSkeletons) {
					if (!Skill.cast(70, 0, corpse)) {
						return false;
					}

					count = me.getMinionCount(4);
					tick = getTickCount();

					while (getTickCount() - tick < 200) {
						if (me.getMinionCount(4) > count) {
							break;
						}

						delay(10);
					}
				} else if (me.getMinionCount(5) < maxMages) {
					if (!Skill.cast(80, 0, corpse)) {
						return false;
					}

					count = me.getMinionCount(5);
					tick = getTickCount();

					while (getTickCount() - tick < 200) {
						if (me.getMinionCount(5) > count) {
							break;
						}

						delay(10);
					}
				} else if (me.getMinionCount(6) < maxRevives) {
					if (this.checkCorpse(corpse, true)) {
						print("Reviving " + corpse.name);

						if (!Skill.cast(95, 0, corpse)) {
							return false;
						}

						count = me.getMinionCount(6);
						tick = getTickCount();

						while (getTickCount() - tick < 200) {
							if (me.getMinionCount(6) > count) {
								break;
							}

							delay(10);
						}
					}
				} else {
					return true;
				}
			}
		}

		return true;
	},

	explodeCorpses: function (unit) {
		if (Config.ExplodeCorpses === 0 || unit.mode === 0 || unit.mode === 12) {
			return false;
		}

		var i,
			corpseList = [],
			range = Math.floor((me.getSkill(Config.ExplodeCorpses, 1) + 7) / 3),
			corpse = getUnit(1, -1, 12);

		if (corpse) {
			do {
				if (getDistance(unit, corpse) <= range && this.checkCorpse(corpse)) {
					corpseList.push(copyUnit(corpse));
				}
			} while (corpse.getNext());

			//Shuffle the corpseList so if running multiple necrobots they explode separate corpses not the same ones
			if (corpseList.length > 1) {
				corpseList = corpseList.shuffle();
			}

			if (Config.Skeletons + Config.SkeletonMages + Config.Revives === 0) {
				// We don't need corpses as we are not a Summoner Necro, Spam CE till monster dies or we run out of bodies.
				do {
					corpse = corpseList.shift();

					if (corpse) {
						if (!unit.dead && this.checkCorpse(corpse) && getDistance(corpse, unit) <= range) {
							me.overhead("Exploding: " + corpse.classid + " " + corpse.name + " id:" + corpse.gid); // Added corpse ID so I can see when it blows another monster with the same ClassID and Name

							if (Skill.cast(Config.ExplodeCorpses, 0, corpse)) {
								delay(me.ping + 1);
							}
						}
					}
				} while (corpseList.length > 0);
			} else {
				// We are a Summoner Necro, we should conserve corpses, only blow 2 at a time so we can check for needed re-summons.
				for (i = 0; i <= 1; i += 1) {
					if (corpseList.length > 0) {
						corpse = corpseList.shift();

						if (corpse) {
							me.overhead("Exploding: " + corpse.classid + " " + corpse.name);

							if (Skill.cast(Config.ExplodeCorpses, 0, corpse)) {
								delay(200);
							}
						}
					} else {
						break;
					}
				}
			}
		}

		return true;
	},

	checkCorpseNearMonster: function (monster, range) {
		var corpse = getUnit(1, -1, 12);

		if (range === undefined) { // Assume CorpseExplosion if no range specified
			range = Math.floor((me.getSkill(Config.ExplodeCorpses, 1) + 7) / 3);
		}

		if (corpse) {
			do {
				if (getDistance(corpse, monster) <= range) {
					return true;
				}
			} while (corpse.getNext());
		}

		return false;
	},

	checkCorpse: function (unit, revive) {
		if (unit.mode !== 12) {
			return false;
		}

		if (revive === undefined) {
			revive = false;
		}

		var baseId = getBaseStat("monstats", unit.classid, "baseid"),
			badList = [312, 571];

		if (revive && ((unit.spectype & 0x7) || badList.indexOf(baseId) > -1 || (Config.ReviveUnstackable && getBaseStat("monstats2", baseId, "sizex") === 3))) {
			return false;
		}

		if (!getBaseStat("monstats2", baseId, revive ? "revive" : "corpseSel")) {
			return false;
		}

		if (getDistance(me, unit) <= 25 && !checkCollision(me, unit, 0x4) &&
				!unit.getState(1) && // freeze
				!unit.getState(96) && // revive
				!unit.getState(99) && // redeemed
				!unit.getState(104) && // nodraw
				!unit.getState(107) && // shatter
				!unit.getState(118) // noselect
				) {
			return true;
		}

		return false;
	}
};