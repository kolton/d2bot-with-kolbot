/**
*	@filename	Paladin.js
*	@author		kolton
*	@desc		Paladin attack sequence
*/

var ClassAttack = {
	doAttack: function (unit, preattack) {
		if (Config.MercWatch && Town.needMerc()) {
			print("mercwatch");
			Town.visitTown();
		}

		if (preattack && Config.AttackSkill[0] > 0 && Attack.checkResist(unit, Config.AttackSkill[0]) && (!me.getState(121) || !Skill.isTimed(Config.AttackSkill[0]))) {
			if (getDistance(me, unit) > Skill.getRange(Config.AttackSkill[0]) || checkCollision(me, unit, 0x4)) {
				if (!Attack.getIntoPosition(unit, Skill.getRange(Config.AttackSkill[0]), 0x4)) {
					return false;
				}
			}

			Skill.cast(Config.AttackSkill[0], Skill.getHand(Config.AttackSkill[0]), unit);

			return true;
		}

		var index,
			attackSkill = -1,
			aura = -1;

		index = ((unit.spectype & 0x7) || unit.type === 0) ? 1 : 3;

		if (Attack.getCustomAttack(unit)) {
			attackSkill = Attack.getCustomAttack(unit)[0];
			aura = Attack.getCustomAttack(unit)[1];
		} else {
			attackSkill = Config.AttackSkill[index];
			aura = Config.AttackSkill[index + 1];
		}

		// Monster immune to primary skill
		if (!Attack.checkResist(unit, attackSkill)) {
			// Reset skills
			attackSkill = -1;
			aura = -1;

			// Set to secondary if not immune
			if (Config.AttackSkill[5] > -1 && Attack.checkResist(unit, Config.AttackSkill[5])) {
				attackSkill = Config.AttackSkill[5];
				aura = Config.AttackSkill[6];
			}
		}

		// Low mana skill
		if (Config.LowManaSkill[0] > -1 && Skill.getManaCost(attackSkill) > me.mp && Attack.checkResist(unit, Config.LowManaSkill[0])) {
			attackSkill = Config.LowManaSkill[0];
			aura = Config.LowManaSkill[1];
		}

		switch (this.doCast(unit, attackSkill, aura)) {
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

		if (Config.Redemption instanceof Array && (me.hp * 100 / me.hpmax < Config.Redemption[0] || me.mp * 100 / me.mpmax < Config.Redemption[1]) && Skill.setSkill(124, 0)) {
			delay(1500);
		}
	},

	doCast: function (unit, attackSkill, aura) {
		var i, walk;

		if (attackSkill < 0) {
			return false;
		}

		switch (attackSkill) {
		case 112:
			if (unit.classid === 691 && Config.AvoidDolls) {
				this.dollAvoid(unit);

				if (aura > -1) {
					Skill.setSkill(aura, 0);
				}

				Skill.cast(attackSkill, Skill.getHand(attackSkill), unit);

				return 1;
			}

			if (!this.getHammerPosition(unit)) {
				//print("Can't get to " + unit.name);

				// Fallback to secondary skill if it exists
				if (Config.AttackSkill[5] > -1 && Config.AttackSkill[5] !== 112 && Attack.checkResist(unit, Config.AttackSkill[5])) {
					return this.doCast(unit, Config.AttackSkill[5], Config.AttackSkill[6]);
				}

				return 0;
			}

			if (getDistance(me, unit) > 9 || unit.dead) {
				//print(getDistance(me, unit));

				return 1;
			}

			if (aura > -1) {
				Skill.setSkill(aura, 0);
			}

			for (i = 0; i < 3; i += 1) {
				Skill.cast(attackSkill, Skill.getHand(attackSkill), unit);

				if (!Attack.checkMonster(unit) || getDistance(me, unit) > 9 || unit.type === 0) {
					break;
				}
			}

			return 1;
		case 101:
			if (getDistance(me, unit) > Skill.getRange(attackSkill) + 3 || CollMap.checkColl(me, unit, 0x4)) {
				if (!Attack.getIntoPosition(unit, Skill.getRange(attackSkill), 0x4)) {
					return 0;
				}
			}

			CollMap.reset();

			if (getDistance(me, unit) > Skill.getRange(attackSkill) || CollMap.checkColl(me, unit, 0x2004, 2)) {
				if (!Attack.getIntoPosition(unit, Skill.getRange(attackSkill), 0x2004, true)) {
					return 0;
				}
			}

			if (!unit.dead) {
				if (aura > -1) {
					Skill.setSkill(aura, 0);
				}

				Skill.cast(attackSkill, Skill.getHand(attackSkill), unit);
			}

			return 1;
		case 121: // FoH
			if (!me.getState(121)) {
				if (getDistance(me, unit) > Skill.getRange(attackSkill) || CollMap.checkColl(me, unit, 0x2004, 2)) {
					if (!Attack.getIntoPosition(unit, Skill.getRange(attackSkill), 0x2004, true)) {
						return 0;
					}
				}

				if (!unit.dead) {
					if (aura > -1) {
						Skill.setSkill(aura, 0);
					}

					Skill.cast(attackSkill, Skill.getHand(attackSkill), unit);

					return 1;
				}
			}

			break;
		default:
			if (Skill.getRange(attackSkill) < 4 && !Attack.validSpot(unit.x, unit.y)) {
				return 0;
			}

			if (Math.floor(getDistance(me, unit)) > Skill.getRange(attackSkill) || checkCollision(me, unit, 0x4)) {
				walk = attackSkill !== 97 && Skill.getRange(attackSkill) < 4 && getDistance(me, unit) < 10 && !checkCollision(me, unit, 0x1);

				// walk short distances instead of tele for melee attacks. teleport if failed to walk
				if (!Attack.getIntoPosition(unit, Skill.getRange(attackSkill), 0x4, walk)) {
					return 0;
				}
			}

			if (!unit.dead) {
				if (aura > -1) {
					Skill.setSkill(aura, 0);
				}

				Skill.cast(attackSkill, Skill.getHand(attackSkill), unit);
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

	dollAvoid: function (unit) {
		var i,
			positions = [[10, 10], [-10, 10], [10, -10], [-10, -10]];

		for (i = 0; i < positions.length; i += 1) {
			if (Attack.validSpot(unit.x + positions[i][0], unit.y + positions[i][1])) {
				return Pather.moveTo(unit.x + positions[i][0], unit.y + positions[i][1]);
			}
		}

		return false;
	},

	getHammerPosition: function (unit) {
		var i, x, y, positions, check,
			baseId = getBaseStat("monstats", unit.classid, "baseid"),
			size = getBaseStat("monstats2", baseId, "sizex");

		// in case base stat returns something outrageous
		if (typeof size !== "number" || size < 1 || size > 3) {
			size = 3;
		}

		switch (unit.type) {
		case 0: // Player
			x = unit.x;
			y = unit.y;
			positions = [[x + 2, y], [x + 2, y + 1]];

			break;
		case 1: // Monster
			x = (unit.mode === 2 || unit.mode === 15) && getDistance(me, unit) < 10 && getDistance(me, unit.targetx, unit.targety) > 5 ? unit.targetx : unit.x;
			y = (unit.mode === 2 || unit.mode === 15) && getDistance(me, unit) < 10 && getDistance(me, unit.targetx, unit.targety) > 5 ? unit.targety : unit.y;
			positions = [[x + 2, y + 1], [x, y + 3], [x + 2, y - 1], [x - 2, y + 2], [x - 5, y]];

			if (size === 3) {
				positions.unshift([x + 2, y + 2]);
			}

			break;
		}

		for (i = 0; i < positions.length; i += 1) {
			if (getDistance(me, positions[i][0], positions[i][1]) < 1) {
				return true;
			}
		}

		for (i = 0; i < positions.length; i += 1) {
			check = {
				x: positions[i][0],
				y: positions[i][1]
			};

			if (Attack.validSpot(check.x, check.y) && !CollMap.checkColl(unit, check, 0x4, 0)) {
				if (this.reposition(positions[i][0], positions[i][1])) {
					return true;
				}
			}
		}

		return false;
	},

	reposition: function (x, y) {
		var i;

		if (Math.round(getDistance(me, x, y) > 0)) {
			if (Pather.teleport && !me.inTown && me.getStat(97, 54)) {
				if (getDistance(me, x, y) > 40) {
					Pather.moveTo(x, y);
				} else {
					Pather.teleportTo(x, y, 3);
				}
			} else {
				Misc.click(0, 0, x, y);
				delay(200);
			}
		}

		return true;
	}
};