/**
*	@filename	Barbarian.js
*	@author		kolton
*	@desc		Barbarian attack sequence
*/

var ClassAttack = {
	doAttack: function (unit, preattack) {
		var needRepair = Town.needRepair();

		if ((Config.MercWatch && Town.needMerc()) || needRepair.length > 0) {
			Town.visitTown(!!needRepair.length);
		}

		if (preattack && Config.AttackSkill[0] > 0 && Attack.checkResist(unit, Attack.getSkillElement(Config.AttackSkill[0])) && (!me.getState(121) || !Skill.isTimed(Config.AttackSkill[0]))) {
			if (Math.round(getDistance(me, unit)) > Skill.getRange(Config.AttackSkill[0]) || checkCollision(me, unit, 0x4)) {
				if (!Attack.getIntoPosition(unit, Skill.getRange(Config.AttackSkill[0]), 0x4)) {
					return 0;
				}
			}

			Skill.cast(Config.AttackSkill[0], Skill.getHand(Config.AttackSkill[0]), unit);

			return 1;
		}

		var index,
			attackSkill = -1;

		index = ((unit.spectype & 0x7) || unit.type === 0) ? 1 : 3;

		if (Attack.getCustomAttack(unit)) {
			attackSkill = Attack.getCustomAttack(unit)[0];
		} else {
			attackSkill = Config.AttackSkill[index];
		}

		if (!Attack.checkResist(unit, attackSkill)) {
			attackSkill = -1;

			if (Config.AttackSkill[index + 1] > -1 && Attack.checkResist(unit, Config.AttackSkill[index + 1])) {
				attackSkill = Config.AttackSkill[index + 1];
			}
		}

		// Low mana skill
		if (Skill.getManaCost(attackSkill) > me.mp && Config.LowManaSkill[0] > -1 && Attack.checkResist(unit, Config.LowManaSkill[0])) {
			attackSkill = Config.LowManaSkill[0];
		}

		// Telestomp with barb is pointless
		return this.doCast(unit, attackSkill);
	},

	afterAttack: function (pickit) {
		var needRepair;

		Misc.unShift();
		Precast.doPrecast(false);

		needRepair = Town.needRepair();

		if (needRepair && needRepair.length > 0) { // Repair check
			Town.visitTown(true);
		}

		if (pickit) {
			this.findItem(me.area === 83 ? 60 : 20);
		}
	},

	doCast: function (unit, attackSkill) {
		var walk;

		if (attackSkill < 0) {
			return 2;
		}

		switch (attackSkill) {
		case 151:
			if (Math.ceil(getDistance(me, unit)) > Skill.getRange(attackSkill) || checkCollision(me, unit, 0x1)) {
				if (!Attack.getIntoPosition(unit, Skill.getRange(attackSkill), 0x1, 2)) {
					return 0;
				}
			}

			if (!unit.dead) {
				this.whirlwind(unit);
			}

			return 1;
		default:
			if (Skill.getRange(attackSkill) < 4 && !Attack.validSpot(unit.x, unit.y)) {
				return 0;
			}

			if (Math.round(getDistance(me, unit)) > Skill.getRange(attackSkill) || checkCollision(me, unit, 0x4)) {
				walk = Skill.getRange(attackSkill) < 4 && getDistance(me, unit) < 10 && !checkCollision(me, unit, 0x1);

				if (!Attack.getIntoPosition(unit, Skill.getRange(attackSkill), 0x4, walk)) {
					return 0;
				}
			}

			if (!unit.dead) {
				Skill.cast(attackSkill, Skill.getHand(attackSkill), unit);
			}

			return 1;
		}
	},

	whirlwind: function (unit) {
		if (!Attack.checkMonster(unit)) {
			return true;
		}

		var i, coords, angle,
			angles = [180, 175, -175, 170, -170, 165, -165, 150, -150, 135, -135, 45, -45, 90, -90];

		if (unit.spectype & 0x7) {
			angles.unshift(120);
		}

		//me.runwalk = 0;
		angle = Math.round(Math.atan2(me.y - unit.y, me.x - unit.x) * 180 / Math.PI);

		for (i = 0; i < angles.length; i += 1) { // get a better spot
			coords = [Math.round((Math.cos((angle + angles[i]) * Math.PI / 180)) * 4 + unit.x), Math.round((Math.sin((angle + angles[i]) * Math.PI / 180)) * 4 + unit.y)];

			if (!CollMap.checkColl(me, {x: coords[0], y: coords[1]}, 0x1, 1)) {
				return Skill.cast(151, Skill.getHand(151), coords[0], coords[1]);
			}
		}

		if (!Attack.validSpot(unit.x, unit.y)) {
			return false;
		}

		return Skill.cast(151, Skill.getHand(151), me.x, me.y);
	},

	checkCloseMonsters: function (range) {
		var monster;

		monster = getUnit(1);

		if (monster) {
			do {
				if (getDistance(me, monster) <= range && Attack.checkMonster(monster) && !checkCollision(me, monster, 0x4) &&
						(Attack.checkResist(monster, Attack.getSkillElement(Config.AttackSkill[(monster.spectype & 0x7) ? 1 : 3])) ||
						(Config.AttackSkill[3] > -1 && Attack.checkResist(monster, Attack.getSkillElement(Config.AttackSkill[3]))))) {
					return true;
				}
			} while (monster.getNext());
		}

		return false;
	},

	findItem: function (range) {
		if (!Config.FindItem || !me.getSkill(142, 1)) {
			return false;
		}

		var i, j, tick, corpse, orgX, orgY, retry,
			corpseList = [];

		orgX = me.x;
		orgY = me.y;

MainLoop:
		for (i = 0; i < 3; i += 1) {
			corpse = getUnit(1);

			if (corpse) {
				do {
					if ((corpse.mode === 0 || corpse.mode === 12) && getDistance(corpse, orgX, orgY) <= range && this.checkCorpse(corpse)) {
						corpseList.push(copyUnit(corpse));
					}
				} while (corpse.getNext());
			}

			while (corpseList.length > 0) {
				if (this.checkCloseMonsters(5)) {
					if (Config.FindItemSwitch) {
						Attack.weaponSwitch(Attack.getPrimarySlot());
					}

					Attack.clear(10, false, false, false, false);

					retry = true;

					break MainLoop;
				}

				corpseList.sort(Sort.units);

				corpse = corpseList.shift();

				if (this.checkCorpse(corpse)) {
					if (getDistance(me, corpse) > 30 || checkCollision(me, corpse, 0x1)) {
						Pather.moveToUnit(corpse);
					}

					if (Config.FindItemSwitch) {
						Attack.weaponSwitch(Attack.getPrimarySlot() ^ 1);
					}

CorpseLoop:
					for (j = 0; j < 3; j += 1) {
						Skill.cast(142, 0, corpse);

						tick = getTickCount();

						while (getTickCount() - tick < 1000) {
							if (corpse.getState(118)) {
								Pickit.fastPick();

								break CorpseLoop;
							}

							delay(10);
						}
					}
				}
			}
		}

		if (retry) {
			return this.findItem(me.area === 83 ? 60 : 20);
		}

		if (Config.FindItemSwitch) {
			Attack.weaponSwitch(Attack.getPrimarySlot());
		}

		Pickit.pickItems();

		return true;
	},

	checkCorpse: function (unit) {
		if (unit.mode !== 0 && unit.mode !== 12) {
			return false;
		}

		if ([345, 346, 347].indexOf(unit.classid) === -1 && unit.spectype === 0) {
			return false;
		}

		if (unit.classid <= 575 && !getBaseStat("monstats2", unit.classid, "corpseSel")) { // monstats2 doesn't contain guest monsters info. sigh..
			return false;
		}

		if (getDistance(me, unit) <= 25 &&
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