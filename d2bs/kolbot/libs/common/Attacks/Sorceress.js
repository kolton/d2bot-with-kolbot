// Sorceress attack

var ClassAttack = {
	skillRange: [],
	skillHand: [],
	skillElement: [],

	init: function () {
		var i;

		for (i = 0; i < Config.AttackSkill.length; i += 1) {
			this.skillHand[i] = getBaseStat("skills", Config.AttackSkill[i], "leftskill");
			this.skillElement[i] = Attack.getSkillElement(Config.AttackSkill[i]);

			switch (Config.AttackSkill[i]) {
			case 0: // Normal Attack
				this.skillRange[i] = Attack.usingBow() ? 20 : 3;
				break;
			case 38: // Charged Bolt
				this.skillRange[i] = 6;
				break;
			case 42: // Static Field
				this.skillRange[i] = Math.floor((me.getSkill(42, 1) + 4) * 2 / 3);
				break;
			case 44: // Frost Nova
				this.skillRange[i] = 5;
				break;
			case 48: // Nova
				this.skillRange[i] = 7;
				break;
			case 49: // Lightning
			case 53: // Chain Lightning
				this.skillRange[i] = 13;
				break;
			case 64: // Frozen Orb
				this.skillRange[i] = 15;
				break;
			// oskills
			case 106: // Zeal
				this.skillRange[i] = 3;
				break;
			default: // Every other skill
				this.skillRange[i] = 20;
				break;
			}
		}
	},

	doAttack: function (unit) {
		// TODO: preattack, infinity calc
		if (Town.needMerc()) {
			Town.visitTown();
		}

		var index, staticRange, timedIndex, untimedIndex;

		// Static
		if (Config.CastStatic < 100 && me.getSkill(42, 1) && Math.round(unit.hp * 100 / unit.hpmax) > Config.CastStatic && Attack.getResist(unit, "lightning") < 100 && Config.StaticList.indexOf(unit.name) > -1) {
			staticRange = Math.floor((me.getSkill(42, 1) + 4) * 2 / 3);

			if (getDistance(me, unit) > staticRange || checkCollision(me, unit, 0x4)) {
				Attack.getIntoPosition(unit, staticRange, 0x4);
			}

			if (!Skill.cast(42, 0)) {
				return 2;
			}

			return 3;
		}

		index = (unit.spectype & 0x7) ? 1 : 3;

		// Get timed skill
		if (Attack.getResist(unit, this.skillElement[index]) < 100 && ([56, 59].indexOf(Config.AttackSkill[index]) === -1 || Attack.validSpot(unit.x, unit.y))) { // added a check for blizz/meteor because they can't be cast on invalid spot
			timedIndex = index;
		} else if (Config.AttackSkill[5] > -1 && Attack.getResist(unit, this.skillElement[5]) < 100 && ([56, 59].indexOf(Config.AttackSkill[5]) === -1 || Attack.validSpot(unit.x, unit.y))) {
			timedIndex = 5;
		}

		// Get untimed skill
		if (Config.AttackSkill[index + 1] > -1 && Attack.getResist(unit, this.skillElement[index + 1]) < 100 && (Config.AttackSkill[index + 1] !== 42 || Math.round(unit.hp * 100 / unit.hpmax) > Config.CastStatic)) {
			untimedIndex = index + 1;
		} else if (Config.AttackSkill[6] > -1 && Attack.getResist(unit, this.skillElement[6]) < 100 && (Config.AttackSkill[6] !== 42 || Math.round(unit.hp * 100 / unit.hpmax) > Config.CastStatic)) {
			untimedIndex = 6;
		}

		if (!timedIndex && !untimedIndex) {
			// Check if we can merc stomp the boss
			if (Config.TeleStomp && index === 1 && !!me.getMerc() && Attack.getResist(unit, "physical") < 100) {
				if (getDistance(me, unit) > 5) {
					Pather.moveToUnit(unit);
				}

				// Spam attacks
				timedIndex = 1;
				untimedIndex = Config.AttackSkill[2] > -1 ? 2 : false;
			} else {
				print(unit.name + " immune to all attacks.");
				return 1;
			}
		}

		if (!this.doCast(unit, timedIndex, untimedIndex)) {
			return 2;
		}

		return 3;
	},

	afterAttack: function () {
		Precast.doPrecast(false);
	},

	doCast: function (unit, timed, untimed) {
		var i;

		if (timed && (!me.getState(121) || !Skill.isTimed(Config.AttackSkill[timed]))) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[timed] || checkCollision(me, unit, 0x4)) {
				Attack.getIntoPosition(unit, this.skillRange[timed], 0x4);
			}

			return Skill.cast(Config.AttackSkill[timed], this.skillHand[timed], unit);
		}

		if (untimed && Config.AttackSkill[untimed] > -1) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[untimed] || checkCollision(me, unit, 0x4)) {
				Attack.getIntoPosition(unit, this.skillRange[untimed], 0x4);
			}

			return Skill.cast(Config.AttackSkill[untimed], this.skillHand[untimed], unit);
		}

		for (i = 0; i < 25; i += 1) {
			delay(40);

			if (!me.getState(121)) {
				break;
			}
		}

		return false;
	}
};