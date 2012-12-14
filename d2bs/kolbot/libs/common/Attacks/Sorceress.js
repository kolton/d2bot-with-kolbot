/**
*	@filename	Sorceress.js
*	@author		kolton
*	@desc		Sorceress attack sequence
*/

var ClassAttack = {
	skillRange: [],
	skillHand: [],
	skillElement: [],

	init: function () {
		var i;

		for (i = 0; i < Config.LowManaSkill.length; i += 1) {
			Config.AttackSkill.push(Config.LowManaSkill[i]);
		}

		for (i = 0; i < Config.AttackSkill.length; i += 1) {
			this.skillHand[i] = getBaseStat("skills", Config.AttackSkill[i], "leftskill");
			this.skillElement[i] = Attack.getSkillElement(Config.AttackSkill[i]);

			switch (Config.AttackSkill[i]) {
			case 0: // Normal Attack
				this.skillRange[i] = Attack.usingBow() ? 20 : 3;
				this.skillHand[i] = 2; // shift bypass

				break;
			case 38: // Charged Bolt
				this.skillRange[i] = 6;

				break;
			case 42: // Static Field
				if (me.gametype) {
					this.skillRange[i] = Math.floor((me.getSkill(42, 1) + 4) * 2 / 3);
				} else {
					this.skillRange[i] = 25;
				}

				break;
			case 44: // Frost Nova
				this.skillRange[i] = 5;

				break;
			case 48: // Nova
				this.skillRange[i] = 7;

				break;
			case 49: // Lightning
			case 53: // Chain Lightning
				this.skillRange[i] = 15;

				break;
			case 64: // Frozen Orb
				this.skillRange[i] = 15;

				break;
			// oskills
			case 106: // Zeal
				this.skillRange[i] = 2;

				break;
			default: // Every other skill
				this.skillRange[i] = 25;

				break;
			}
		}
	},

	doAttack: function (unit, preattack) {
		if (Config.MercWatch && Town.needMerc()) {
			Town.visitTown();
		}

		if (!me.getState(30) && me.getSkill(58, 1)) {
			Skill.cast(58, 0);
		}

		if (preattack && Config.AttackSkill[0] > 0 && Attack.checkResist(unit, this.skillElement[0]) && (!me.getState(121) || !Skill.isTimed(Config.AttackSkill[0]))) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[0] || checkCollision(me, unit, 0x4)) {
				if (!Attack.getIntoPosition(unit, this.skillRange[0], 0x4)) {
					return 1;
				}
			}

			if (!Skill.cast(Config.AttackSkill[0], this.skillHand[0], unit)) {
				return 2;
			}

			return 3;
		}

		var index, staticRange, timedIndex, untimedIndex;

		// Static
		if (Config.CastStatic < 100 && me.getSkill(42, 1) && Attack.checkResist(unit, "lightning") && Config.StaticList.indexOf(unit.name) > -1 && Math.round(unit.hp * 100 / unit.hpmax) > Config.CastStatic) {
			staticRange = Math.floor((me.getSkill(42, 1) + 4) * 2 / 3);

			while (Math.round(unit.hp * 100 / unit.hpmax) > Config.CastStatic && Attack.checkMonster(unit)) {
				if (getDistance(me, unit) > staticRange || checkCollision(me, unit, 0x4)) {
					if (!Attack.getIntoPosition(unit, staticRange, 0x4)) {
						return 1;
					}
				}

				if (!Skill.cast(42, 0)) {
					return 2;
				}
			}
		}

		index = ((unit.spectype & 0x7) || unit.type === 0) ? 1 : 3;

		// Get timed skill
		if (Attack.checkResist(unit, this.skillElement[index]) && ([56, 59].indexOf(Config.AttackSkill[index]) === -1 || Attack.validSpot(unit.x, unit.y))) { // added a check for blizz/meteor because they can't be cast on invalid spot
			timedIndex = index;
		} else if (Config.AttackSkill[5] > -1 && Attack.checkResist(unit, this.skillElement[5]) && ([56, 59].indexOf(Config.AttackSkill[5]) === -1 || Attack.validSpot(unit.x, unit.y))) {
			timedIndex = 5;
		}

		// Get untimed skill
		if (Config.AttackSkill[index + 1] > -1 && Attack.checkResist(unit, this.skillElement[index + 1]) && (Config.AttackSkill[index + 1] !== 42 || Math.round(unit.hp * 100 / unit.hpmax) > Config.CastStatic)) {
			untimedIndex = index + 1;
		} else if (Config.AttackSkill[6] > -1 && Attack.checkResist(unit, this.skillElement[6]) && (Config.AttackSkill[6] !== 42 || Math.round(unit.hp * 100 / unit.hpmax) > Config.CastStatic)) {
			untimedIndex = 6;
		}

		if (!timedIndex && !untimedIndex) {
			// Check if we can merc stomp the boss
			if (Config.TeleStomp && index === 1 && !!me.getMerc() && Attack.checkResist(unit, "physical")) {
				// Spam attacks
				timedIndex = 1;
				untimedIndex = Config.AttackSkill[2] > -1 ? 2 : false;

				// dirty override until a good solution presents itself
				while (Attack.checkMonster(unit)) {
					if (getDistance(me, unit) > 5) {
						Pather.moveToUnit(unit);
					}

					this.doCast(unit, timedIndex, untimedIndex);
				}
			} else {
				return 1;
			}
		}

		switch (this.doCast(unit, timedIndex, untimedIndex)) {
		case 0: // total fail
			return 1;
		case false: // fail to cast
			return 2;
		}

		return 3;
	},

	afterAttack: function () {
		Precast.doPrecast(false);
	},

	doCast: function (unit, timed, untimed) {
		var i;

		// Low mana timed skill
		if (timed && Config.AttackSkill[timed] > -1 && Config.AttackSkill[Config.AttackSkill.length - 2] > -1 && Skill.getManaCost(Config.AttackSkill[timed]) > me.mp) {
			timed = Config.AttackSkill.length - 2;
		}

		if (timed && (!me.getState(121) || !Skill.isTimed(Config.AttackSkill[timed]))) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[timed] || checkCollision(me, unit, 0x4)) {
				if (!Attack.getIntoPosition(unit, this.skillRange[timed], 0x4)) {
					return 0;
				}
			}

			if (Config.AttackSkill[timed] === 59) {
				return Skill.cast(Config.AttackSkill[timed], this.skillHand[timed], unit.x + rand(-2, 2), unit.y + rand(-2, 2));
			}

			return Skill.cast(Config.AttackSkill[timed], this.skillHand[timed], unit);
		}

		// Low mana untimed skill
		if (untimed && Config.AttackSkill[untimed] > -1 && Config.AttackSkill[Config.AttackSkill.length - 1] > -1 && Skill.getManaCost(Config.AttackSkill[untimed]) > me.mp) {
			untimed = Config.AttackSkill.length - 1;
		}

		if (untimed && Config.AttackSkill[untimed] > -1) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[untimed] || checkCollision(me, unit, 0x4)) {
				if (!Attack.getIntoPosition(unit, this.skillRange[untimed], 0x4)) {
					return 0;
				}
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