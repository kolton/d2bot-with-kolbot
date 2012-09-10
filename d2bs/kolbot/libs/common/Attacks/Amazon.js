/**
*	@filename	Amazon.js
*	@author		kolton
*	@desc		Amazon attack sequence
*/

var ClassAttack = {
	skillRange: [],
	skillHand: [],
	skillElement: [],
	bowCheck: false,

	init: function () {
		var i;

		for (i = 0; i < Config.AttackSkill.length; i += 1) {
			this.skillHand[i] = getBaseStat("skills", Config.AttackSkill[i], "leftskill");
			this.skillElement[i] = Attack.getSkillElement(Config.AttackSkill[i]);

			switch (Config.AttackSkill[i]) {
			case 0: // Normal Attack
				this.skillRange[i] = Attack.usingBow() ? 20 : 3;
				this.skillHand[i] = 2; // shift bypass
				break;
			case 10: // Jab
			case 14: // Power Strike
			case 19: // Impale
			case 30: // Fend
			case 34: // Lightning Strike
				this.skillRange[i] = 3;
				break;
			case 24: // Charged Strike
				this.skillRange[i] = 20;
				break;
			default: // Every other skill
				this.skillRange[i] = 20;
				break;
			}
		}

		this.bowCheck = Attack.usingBow();
	},

	doAttack: function (unit, preattack) {
		if (Config.MercWatch && Town.needMerc()) {
			Town.visitTown();
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

		var index;

		index = ((unit.spectype & 0x7) || unit.type === 0) ? 1 : 3;

		if (Attack.checkResist(unit, this.skillElement[index])) {
			switch (this.doCast(unit, index)) {
			case 0: // total fail
				return 1;
			case false: // fail to cast
				return 2;
			}

			return 3;
		}

		if (Config.AttackSkill[5] > -1 && Attack.checkResist(unit, this.skillElement[5])) {
			switch (this.doCast(unit, 5)) {
			case 0: // total fail
				return 1;
			case false: // fail to cast
				return 2;
			}

			return 3;
		}

		if (Config.TeleStomp && me.getMerc() && Attack.checkResist(unit, "physical")) {
			if (getDistance(me, unit) > 4) {
				Pather.moveToUnit(unit);
			}

			delay(300);

			return 3;
		}

		return 1;
	},

	afterAttack: function () {
		Precast.doPrecast(false);

		if (Town.needRepair()) { // Repair check, mainly to restock arrows
			Town.visitTown();
		}
	},

	doCast: function (unit, index) {
		var i;

		// arrow/bolt check
		if (this.bowCheck) {
			switch (this.bowCheck) {
			case "bow":
				if (!me.getItem("aqv", 1)) {
					Town.visitTown();
				}

				break;
			case "crossbow":
				if (!me.getItem("cqv", 1)) {
					Town.visitTown();
				}

				break;
			}
		}

		if (!me.getState(121) || !Skill.isTimed(Config.AttackSkill[index])) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[index] || checkCollision(me, unit, 0x4)) {
				// walk short distances instead of tele for melee attacks
				if (!Attack.getIntoPosition(unit, this.skillRange[index], 0x4, this.skillRange[index] < 4 && getDistance(me, unit) < 10 && !checkCollision(me, unit, 0x1))) {
					return 0;
				}
			}

			return Skill.cast(Config.AttackSkill[index], this.skillHand[index], unit);
		}

		if (Config.AttackSkill[index + 1] > -1) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[index + 1] || checkCollision(me, unit, 0x4)) {
				// walk short distances instead of tele for melee attacks
				if (!Attack.getIntoPosition(unit, this.skillRange[index + 1], 0x4, this.skillRange[index + 1] < 4 && getDistance(me, unit) < 10 && !checkCollision(me, unit, 0x1))) {
					return 0;
				}
			}

			return Skill.cast(Config.AttackSkill[index + 1], this.skillHand[index + 1], unit);
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