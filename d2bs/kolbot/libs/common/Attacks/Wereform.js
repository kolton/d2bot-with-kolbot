/**
*	@filename	Wereform.js
*	@author		kolton
*	@desc		Wereform attack sequence
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
			case 232: // Feral Rage
			case 233: // Maul
			case 238: // Rabies
			case 239: // Fire Claws
			case 242: // Hunger
			case 248: // Fury
				this.skillRange[i] = 3;
				this.skillHand[i] = 2;

				break;
			case 243: // Shock Wave
				this.skillRange[i] = 8;

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

		return this.doCast(unit, index);
	},

	afterAttack: function () {
		Misc.unShift();
		Precast.doPrecast(false);
	},

	doCast: function (unit, index) {
		// Low mana skill
		if (Config.AttackSkill[index] > -1 && Config.AttackSkill[Config.AttackSkill.length - 1] > -1 && Skill.getManaCost(Config.AttackSkill[index]) > me.mp) {
			index = Config.AttackSkill.length - 1;
		}

		// Check Immunities
		if (!Attack.checkResist(unit, this.skillElement[index])) {
			if (Config.AttackSkill[index + 1] > -1 && Attack.checkResist(unit, this.skillElement[index + 1])) {
				index = index + 1;
			} else {
				return 1;
			}
		}

		if (this.skillRange[index] < 4 && !Attack.validSpot(unit.x, unit.y)) {
			return 1;
		}

		// Teleport closer
		if (Math.round(getDistance(me, unit)) > 10) {
			Misc.unShift();

			if (!Attack.getIntoPosition(unit, 5, 0x4)) {
				return 1;
			}
		}

		Misc.shapeShift(Config.Wereform);

		// Walk closer
		if (Math.round(getDistance(me, unit)) > this.skillRange[index] || checkCollision(me, unit, 0x4)) {
			if (!Attack.getIntoPosition(unit, this.skillRange[index], 0x4, true)) {
				return 1;
			}
		}

		return Skill.cast(Config.AttackSkill[index], this.skillHand[index], unit) ? 3 : 2;
	}
};