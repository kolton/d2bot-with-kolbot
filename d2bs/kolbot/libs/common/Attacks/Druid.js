/**
*	@filename	Druid.js
*	@author		kolton
*	@desc		Druid attack sequence
*/

var ClassAttack = {
	doAttack: function (unit, preattack) {
		if (Config.MercWatch && Town.needMerc()) {
			Town.visitTown();
		}

		if (me.getSkill(Skills.Druid.Hurricane, 1) && !me.getState(States.HURRICANE)) { // Rebuff Hurricane
			Skill.cast(Skills.Druid.Hurricane, 0);
		}

		if (me.getSkill(Skills.Druid.Cyclone_Armor, 1) && !me.getState(States.CYCLONEARMOR)) { // Rebuff Cyclone Armor
			Skill.cast(Skills.Druid.Cyclone_Armor, 0);
		}

		if (preattack && Config.AttackSkill[0] > 0 && Attack.checkResist(unit, Config.AttackSkill[0]) && (!me.getState(States.SKILLDELAY) || !Skill.isTimed(Config.AttackSkill[0]))) {
			if (Math.round(getDistance(me, unit)) > Skill.getRange(Config.AttackSkill[0]) || checkCollision(me, unit, 0x4)) {
				if (!Attack.getIntoPosition(unit, Skill.getRange(Config.AttackSkill[0]), 0x4)) {
					return false;
				}
			}

			Skill.cast(Config.AttackSkill[0], Skill.getHand(Config.AttackSkill[0]), unit);

			return true;
		}

		var index, checkSkill,
			timedSkill = -1,
			untimedSkill = -1;

		index = ((unit.spectype & 0x7) || unit.type === UnitType.Player) ? 1 : 3;

		// Get timed skill
		if (Attack.getCustomAttack(unit)) {
			checkSkill = Attack.getCustomAttack(unit)[0];
		} else {
			checkSkill = Config.AttackSkill[index];
		}

		if (Attack.checkResist(unit, checkSkill)) {
			timedSkill = checkSkill;
		} else if (Config.AttackSkill[5] > -1 && Attack.checkResist(unit, Config.AttackSkill[5]) && ([Skills.Sorceress.Meteor, Skills.Sorceress.Blizzard].indexOf(Config.AttackSkill[5]) === -1 || Attack.validSpot(unit.x, unit.y))) {
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
		} else if (Config.AttackSkill[6] > -1 && Attack.checkResist(unit, Config.AttackSkill[6]) && ([Skills.Sorceress.Meteor, Skills.Sorceress.Blizzard].indexOf(Config.AttackSkill[6]) === -1 || Attack.validSpot(unit.x, unit.y))) {
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

		switch (this.doCast(unit, timedSkill, untimedSkill)) {
		case 0: // Fail
			break;
		case 1: // Success
			return true;
		case 2: // Try to telestomp
			if (Config.TeleStomp && Attack.checkResist(unit, "physical") && !!me.getMerc()) {
				while (Attack.checkMonster(unit)) {
					if (getDistance(me, unit) > 3) {
						Pather.moveToUnit(unit);
					}

					this.doCast(unit, Config.AttackSkill[1], Config.AttackSkill[2]);
				}

				return true;
			}

			break;
		}

		// Couldn't attack
		return false;
	},

	afterAttack: function () {
		Misc.unShift();
		Precast.doPrecast(false);
	},

	// Returns: 0 - fail, 1 - success, 2 - no valid attack skills
	doCast: function (unit, timedSkill, untimedSkill) {
		var i, walk;

		// No valid skills can be found
		if (timedSkill < 0 && untimedSkill < 0) {
			return 2;
		}

		if (timedSkill > -1 && (!me.getState(States.SKILLDELAY) || !Skill.isTimed(timedSkill))) {
			switch (timedSkill) {
				case Skills.Druid.Tornado: // Tornado
				if (Math.round(getDistance(me, unit)) > Skill.getRange(timedSkill) || checkCollision(me, unit, 0x4)) {
					if (!Attack.getIntoPosition(unit, Skill.getRange(timedSkill), 0x4)) {
						return 0;
					}
				}

				// Randomized x coord changes tornado path and prevents constant missing
				if (!unit.dead) {
					Skill.cast(timedSkill, Skill.getHand(timedSkill), unit.x + rand(-2, 2), unit.y);
				}

				return 1;
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

				return 1;
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
			if (!me.getState(States.SKILLDELAY)) {
				break;
			}

			delay(40);
		}

		return 1;
	}
};