/**
*	@filename	Sorceress.js
*	@author		kolton
*	@desc		Sorceress attack sequence
*/

var ClassAttack = {
	config: require('Config'),
	doAttack: function (unit, preattack) {
		if (ClassAttack.config.MercWatch && Town.needMerc()) {
			print("mercwatch");
			Town.visitTown();
		}

		if (!me.getState(30) && me.getSkill(58, 1)) {
			Skill.cast(58, 0);
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

		var index, staticRange, checkSkill, result,
			mercRevive = 0,
			timedSkill = -1,
			untimedSkill = -1;

		// Static
		if (ClassAttack.config.CastStatic < 100 && me.getSkill(42, 1) && Attack.checkResist(unit, "lightning") && ClassAttack.config.StaticList.some(
				function (id) {
					if (unit) {
						switch (typeof id) {
						case "number":
							if (unit.classid && unit.classid === id) {
								return 1;
							}

							break;
						case "string":
							if (unit.name && unit.name.toLowerCase() === id.toLowerCase()) {
								return 1;
							}

							break;
						default:
							throw new Error("Bad ClassAttack.config.StaticList settings.");
						}
					}

					return 0;
				}
		) && Math.round(unit.hp * 100 / unit.hpmax) > ClassAttack.config.CastStatic) {
			staticRange = Math.floor((me.getSkill(42, 1) + 4) * 2 / 3);

			while (!me.dead && Math.round(unit.hp * 100 / unit.hpmax) > ClassAttack.config.CastStatic && Attack.checkMonster(unit)) {
				if (getDistance(me, unit) > staticRange || checkCollision(me, unit, 0x4)) {
					if (!Attack.getIntoPosition(unit, staticRange, 0x4)) {
						return 0;
					}
				}

				if (!Skill.cast(42, 0)) {
					break;
				}
			}
		}

		index = ((unit.spectype & 0x7) || unit.type === 0) ? 1 : 3;

		// Get timed skill
		if (Attack.getCustomAttack(unit)) {
			checkSkill = Attack.getCustomAttack(unit)[0];
		} else {
			checkSkill = ClassAttack.config.AttackSkill[index];
		}

		if (Attack.checkResist(unit, checkSkill) && ([56, 59].indexOf(checkSkill) === -1 || Attack.validSpot(unit.x, unit.y))) {
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

		if (Attack.checkResist(unit, checkSkill) && ([56, 59].indexOf(checkSkill) === -1 || Attack.validSpot(unit.x, unit.y))) {
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

		if (result === 2 && ClassAttack.config.TeleStomp && Attack.checkResist(unit, "physical") && !!me.getMerc() && Attack.validSpot(unit.x, unit.y)) {
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

			if (!unit.dead && !checkCollision(me, unit, 0x4)) {
				Skill.cast(timedSkill, Skill.getHand(timedSkill), unit);
			}

			return 1;
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
	}
};