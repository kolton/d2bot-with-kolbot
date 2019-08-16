/**
*	@filename	Assassin.js
*	@author		kolton
*	@desc		Assassin attack sequence
*/

var ClassAttack = {
	config: require('Config'),
	lastTrapPos: {},
	trapRange: 20,

	doAttack: function (unit, preattack) {
		if (ClassAttack.config.MercWatch && Town.needMerc()) {
			Town.visitTown();
		}

		if (preattack && ClassAttack.config.AttackSkill[0] > 0 && Attack.checkResist(unit, ClassAttack.config.AttackSkill[0]) && (!me.getState(121) || !Skill.isTimed(ClassAttack.config.AttackSkill[0]))) {
			if (Math.round(getDistance(me, unit)) > Skill.getRange(ClassAttack.config.AttackSkill[0]) || checkCollision(me, unit, 0x4)) {
				if (!Attack.getIntoPosition(unit, Skill.getRange(ClassAttack.config.AttackSkill[0]), 0x4)) {
					return 0;
				}
			}

			Skill.cast(ClassAttack.config.AttackSkill[0], Skill.getHand(ClassAttack.config.AttackSkill[0]), unit);

			return 1;
		}

		var index, checkTraps, checkSkill, result,
			mercRevive = 0,
			timedSkill = -1,
			untimedSkill = -1;

		index = ((unit.spectype & 0x7) || unit.type === 0) ? 1 : 3;

		// Cloak of Shadows (Aggressive) - can't be cast again until previous one runs out and next to useless if cast in precast sequence (won't blind anyone)
		if (ClassAttack.config.AggressiveCloak && ClassAttack.config.UseCloakofShadows && me.getSkill(264, 1) && !me.getState(121) && !me.getState(153)) {
			if (getDistance(me, unit) < 20) {
				Skill.cast(264, 0);
			} else if (!Attack.getIntoPosition(unit, 20, 0x4)) {
				return 0;
			}
		}

		checkTraps = this.checkTraps(unit);

		if (checkTraps) {
			if (Math.round(getDistance(me, unit)) > this.trapRange || checkCollision(me, unit, 0x4)) {
				if (!Attack.getIntoPosition(unit, this.trapRange, 0x4) || (checkCollision(me, unit, 0x1) && (getCollision(unit.area, unit.x, unit.y) & 0x1))) {
					return 0;
				}
			}

			this.placeTraps(unit, checkTraps);
		}

		// Cloak of Shadows (Defensive; default) - can't be cast again until previous one runs out and next to useless if cast in precast sequence (won't blind anyone)
		if (!ClassAttack.config.AggressiveCloak && ClassAttack.config.UseCloakofShadows && me.getSkill(264, 1) && getDistance(me, unit) < 20 && !me.getState(121) && !me.getState(153)) {
			Skill.cast(264, 0);
		}

		// Get timed skill
		if (Attack.getCustomAttack(unit)) {
			checkSkill = Attack.getCustomAttack(unit)[0];
		} else {
			checkSkill = ClassAttack.config.AttackSkill[index];
		}

		if (Attack.checkResist(unit, checkSkill)) {
			timedSkill = checkSkill;
		} else if (ClassAttack.config.AttackSkill[5] > -1 && Attack.checkResist(unit, ClassAttack.config.AttackSkill[5]) && ([56, 59].indexOf(ClassAttack.config.AttackSkill[5]) === -1 || Attack.validSpot(unit.x, unit.y))) {
			timedSkill = ClassAttack.config.AttackSkill[5];
		}

		// Get untimed skill
		if (Attack.getCustomAttack(unit)) {
			checkSkill = Attack.getCustomAttack(unit)[1];
		} else {
			checkSkill = ClassAttack.config.AttackSkill[index + 1];
		}

		if (Attack.checkResist(unit, checkSkill)) {
			untimedSkill = checkSkill;
		} else if (ClassAttack.config.AttackSkill[6] > -1 && Attack.checkResist(unit, ClassAttack.config.AttackSkill[6]) && ([56, 59].indexOf(ClassAttack.config.AttackSkill[6]) === -1 || Attack.validSpot(unit.x, unit.y))) {
			untimedSkill = ClassAttack.config.AttackSkill[6];
		}

		// Low mana timed skill
		if (ClassAttack.config.LowManaSkill[0] > -1 && Skill.getManaCost(timedSkill) > me.mp && Attack.checkResist(unit, ClassAttack.config.LowManaSkill[0])) {
			timedSkill = ClassAttack.config.LowManaSkill[0];
		}

		// Low mana untimed skill
		if (ClassAttack.config.LowManaSkill[1] > -1 && Skill.getManaCost(untimedSkill) > me.mp && Attack.checkResist(unit, ClassAttack.config.LowManaSkill[1])) {
			untimedSkill = ClassAttack.config.LowManaSkill[1];
		}

		result = this.doCast(unit, timedSkill, untimedSkill);

		if (result === 2 && ClassAttack.config.TeleStomp && Attack.checkResist(unit, "physical") && !!me.getMerc()) {
			while (Attack.checkMonster(unit)) {
				if (Town.needMerc()) {
					if (ClassAttack.config.MercWatch && mercRevive++ < 1) {
						Town.visitTown();
					} else {
						return 2;
					}
				}

				if (getDistance(me, unit) > 3) {
					Pather.moveToUnit(unit);
				}

				this.doCast(unit, ClassAttack.config.AttackSkill[1], ClassAttack.config.AttackSkill[2]);
			}

			return 1;
		}

		return result;
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

		if (timedSkill > -1 && (!me.getState(121) || !Skill.isTimed(timedSkill))) {
			switch (timedSkill) {
			case 151: // Whirlwind
				if (Math.round(getDistance(me, unit)) > Skill.getRange(timedSkill) || checkCollision(me, unit, 0x1)) {
					if (!Attack.getIntoPosition(unit, Skill.getRange(timedSkill), 0x1)) {
						return 0;
					}
				}

				if (!unit.dead) {
					this.whirlwind(unit);
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
			if (!me.getState(121)) {
				break;
			}

			delay(40);
		}

		return 1;
	},

	checkTraps: function (unit) {
		if (!ClassAttack.config.UseTraps) {
			return false;
		}

		// getDistance crashes when using an object with x, y props, that's why it's unit.x, unit.y and not unit
		if (me.getMinionCount(17) === 0 || !this.lastTrapPos.hasOwnProperty("x") || getDistance(unit.x, unit.y, this.lastTrapPos.x, this.lastTrapPos.y) > 15) {
			return 5;
		}

		return 5 - me.getMinionCount(17);
	},

	placeTraps: function (unit, amount) {
		var i, j,
			traps = 0;

		this.lastTrapPos = {x: unit.x, y: unit.y};

		for (i = -1; i <= 1; i += 1) {
			for (j = -1; j <= 1; j += 1) {
				if (Math.abs(i) === Math.abs(j)) { // used for X formation
					// unit can be an object with x, y props too, that's why having "mode" prop is checked
					if (traps >= amount || (unit.hasOwnProperty("mode") && (unit.mode === 0 || unit.mode === 12))) {
						return true;
					}

					if ((unit.hasOwnProperty("classid") && [211, 242, 243, 544].indexOf(unit.classid) > -1) || (unit.hasOwnProperty("type") && unit.type === 0)) { // Duriel, Mephisto, Diablo, Baal, other players
						if (traps >= ClassAttack.config.BossTraps.length) {
							return true;
						}

						Skill.cast(ClassAttack.config.BossTraps[traps], 0, unit.x + i, unit.y + j);
					} else {
						if (traps >= ClassAttack.config.Traps.length) {
							return true;
						}

						Skill.cast(ClassAttack.config.Traps[traps], 0, unit.x + i, unit.y + j);
					}

					traps += 1;
				}
			}
		}

		return true;
	},

	whirlwind: function (unit) {
		const CollMap = require('CollMap');
		if (!Attack.checkMonster(unit)) {
			return true;
		}

		var i, coords, angle,
			angles = [180, 175, -175, 170, -170, 165, -165, 150, -150, 135, -135, 45, -45, 90, -90];

		if (unit.spectype & 0x7) {
			angles.unshift(120);
		}

		me.runwalk = me.gametype;
		angle = Math.round(Math.atan2(me.y - unit.y, me.x - unit.x) * 180 / Math.PI);

		for (i = 0; i < angles.length; i += 1) { // get a better spot
			coords = [Math.round((Math.cos((angle + angles[i]) * Math.PI / 180)) * 4 + unit.x), Math.round((Math.sin((angle + angles[i]) * Math.PI / 180)) * 4 + unit.y)];

			if (!CollMap.checkColl(me, {x: coords[0], y: coords[1]}, 0x1, 1)) {
				return Skill.cast(151, 0, coords[0], coords[1]);
			}
		}

		if (!Attack.validSpot(unit.x, unit.y)) {
			return false;
		}

		return Skill.cast(151, 0, me.x, me.y);
	}
};