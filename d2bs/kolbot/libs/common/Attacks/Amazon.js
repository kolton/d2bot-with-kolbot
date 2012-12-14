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
	lightFuryTick: 0,

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
				this.skillRange[i] = Attack.usingBow() ? 20 : 2;
				this.skillHand[i] = 2; // shift bypass

				break;
			case 10: // Jab
			case 14: // Power Strike
			case 19: // Impale
			case 30: // Fend
			case 34: // Lightning Strike
				this.skillRange[i] = 2;

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

		this.lightFuryTick = 0;
	},

	doCast: function (unit, index) {
		var i,
			timed = index,
			untimed = index + 1;

		// Arrow/bolt check
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

		// Low mana timed skill
		if (Config.AttackSkill[timed] > -1 && Config.AttackSkill[Config.AttackSkill.length - 2] > -1 && Skill.getManaCost(Config.AttackSkill[timed]) > me.mp) {
			timed = Config.AttackSkill.length - 2;
		}

		if (Config.AttackSkill[timed] === 35) {
			if (!this.lightFuryTick || getTickCount() - this.lightFuryTick > Config.LightningFuryDelay * 1000) {
				if (Math.round(getDistance(me, unit)) > this.skillRange[timed] || checkCollision(me, unit, 0x4)) {
					if (!Attack.getIntoPosition(unit, this.skillRange[timed], 0x4)) {
						return 0;
					}
				}

				if (Skill.cast(Config.AttackSkill[timed], this.skillHand[timed], unit)) {
					this.lightFuryTick = getTickCount();

					return true;
				}

				return false;
			}
		} else if (!me.getState(121) || !Skill.isTimed(Config.AttackSkill[timed])) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[timed] || checkCollision(me, unit, 0x4)) {
				// Walk short distances instead of tele for melee attacks
				if (!Attack.getIntoPosition(unit, this.skillRange[timed], 0x4, this.skillRange[timed] < 4 && getDistance(me, unit) < 10 && !checkCollision(me, unit, 0x1))) {
					return 0;
				}
			}

			return Skill.cast(Config.AttackSkill[timed], this.skillHand[timed], unit);
		}

		// Low mana untimed skill
		if (Config.AttackSkill[untimed] > -1 && Config.AttackSkill[Config.AttackSkill.length - 1] > -1 && Skill.getManaCost(Config.AttackSkill[untimed]) > me.mp) {
			untimed = Config.AttackSkill.length - 1;
		}

		if (Config.AttackSkill[untimed] > -1) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[untimed] || checkCollision(me, unit, 0x4)) {
				// Walk short distances instead of tele for melee attacks
				if (!Attack.getIntoPosition(unit, this.skillRange[untimed], 0x4, this.skillRange[untimed] < 4 && getDistance(me, unit) < 10 && !checkCollision(me, unit, 0x1))) {
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

		while (this.lightFuryTick && getTickCount() - this.lightFuryTick < Config.LightningFuryDelay * 1000) {
			delay(40);
		}

		return false;
	}
};