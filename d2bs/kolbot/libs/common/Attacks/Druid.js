// Druid attack

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
			case 225: // Firestorm
			case 229: // Molten Boulder
			case 230: // Arctic Blast
				this.skillRange[i] = 10;
				break;
			case 234: // Fissure
			case 244: // Volcano
				this.skillRange[i] = 15;
				break;
			case 240: // Twister
			case 245: // Tornado
				this.skillRange[i] = 5;
				break;
			case 232: // Feral Rage
			case 233: // Maul
			case 238: // Rabies
			case 239: // Fire Claws
			case 242: // Hunger
			case 248: // Fury
				this.skillRange[i] = 3;
				break;
			case 243: // Shock Wave
				this.skillRange[i] = 8;
				break;
			default: // Every other skill
				this.skillRange[i] = 20;
				break;
			}
		}
	},

	doAttack: function (unit, preattack) {
		if (Town.needMerc()) {
			Town.visitTown();
		}

		if (me.getSkill(250, 1) && !me.getState(144)) { // Rebuff Hurricane
			Skill.cast(250, 0);
		}

		if (me.getSkill(235, 1) && !me.getState(151)) { // Rebuff Cyclone Armor
			Skill.cast(235, 0);
		}

		if (preattack && Config.AttackSkill[0] > 0 && Attack.checkResist(unit, this.skillElement[0]) && (!me.getState(121) || !Skill.isTimed(Config.AttackSkill[0]))) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[0] || checkCollision(me, unit, 0x4)) {
				Attack.getIntoPosition(unit, this.skillRange[0], 0x4);
			}

			if (!Skill.cast(Config.AttackSkill[0], this.skillHand[0], unit)) {
				return 2;
			}

			return 3;
		}

		var index;

		index = (unit.spectype & 0x7) ? 1 : 3;

		if (Attack.checkResist(unit, this.skillElement[index])) {
			if (!this.doCast(unit, index)) {
				return 2;
			}

			return 3;
		}

		if (Config.AttackSkill[5] > -1 && Attack.checkResist(unit, this.skillElement[5])) {
			if (!this.doCast(unit, 5)) {
				return 2;
			}

			return 3;
		}

		if (me.getState(144) && Attack.checkResist(unit, "cold") || Config.TeleStomp && me.getMerc() && Attack.checkResist(unit, "physical")) {
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
	},

	doCast: function (unit, index) {
		var i;

		if (!me.getState(121) || !Skill.isTimed(Config.AttackSkill[index])) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[index] || checkCollision(me, unit, 0x4)) {
				Attack.getIntoPosition(unit, this.skillRange[index], 0x4);
			}

			if (Config.AttackSkill[index] === 245) {
				return Skill.cast(Config.AttackSkill[index], this.skillHand[index], unit.x + rand(-2, 2), unit.y);
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