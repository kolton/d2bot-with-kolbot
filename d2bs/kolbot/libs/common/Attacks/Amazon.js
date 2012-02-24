// Amazon attack

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
			case 10: // Jab
			case 14: // Power Strike
			case 19: // Impale
			case 24: // Charged Strike
			case 30: // Fend
			case 34: // Lightning Strike
				this.skillRange[i] = 3;
				break;
			default: // Every other skill
				this.skillRange[i] = 20;
				break;
			}
		}
	},

	doAttack: function (unit) {
		// TODO: preattack, merc stomp, better resist check

		var index,
			resist = 117;

		index = (unit.spectype & 0x7) ? 1 : 3;

		if (Attack.getResist(unit, this.skillElement[index]) < resist) {
			if (!this.doCast(unit, index)) {
				return 2;
			}

			return 3;
		}

		if (Config.AttackSkill[5] > -1 && Attack.getResist(unit, this.skillElement[5]) < resist) {
			if (!this.doCast(unit, 5)) {
				return 2;
			}

			return 3;
		}

		print(unit.name + " immune to attacks.");
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

		if (!me.getState(121)) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[index] || checkCollision(me, unit, 0x4)) {
				Attack.getIntoPosition(unit, this.skillRange[index], 0x4);
			}

			return Skill.cast(Config.AttackSkill[index], this.skillHand[index], unit);
		}

		if (Config.AttackSkill[index + 1] > -1) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[index + 1] || checkCollision(me, unit, 0x4)) {
				Attack.getIntoPosition(unit, this.skillRange[index + 1], 0x4);
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