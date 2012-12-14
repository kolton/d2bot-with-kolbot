/**
*	@filename	Assassin.js
*	@author		kolton
*	@desc		Assassin attack sequence
*/

var ClassAttack = {
	skillRange: [],
	skillHand: [],
	skillElement: [],
	lastTrapPos: {},
	trapRange: 20,

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
			case 251: // Fire Blast
			case 256: // Shock Web
			case 257: // Blade Sentinel
			case 266: // Blade Fury
				this.skillRange[i] = 15;

				break;
			case 255: // Dragon Talon
			case 260: // Dragon Claw
			case 270: // Dragon Tail
				this.skillRange[i] = 2;
				this.skillHand[i] = 2; // shift bypass

				break;
			case 273: // Mind Blast
			case 253: // Psychic Hammer
			case 275: // Dragon Flight
				this.skillRange[i] = 20;

				break;
			// oskills
			case 151: // Whirlwind
				this.skillRange[i] = 10;

				break;
			default: // Every other skill
				this.skillRange[i] = 20;

				break;
			}
		}
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

		var index, checkTraps;

		index = ((unit.spectype & 0x7) || unit.type === 0) ? 1 : 3;
		checkTraps = this.checkTraps(unit);

		if (checkTraps) {
			if (Math.round(getDistance(me, unit)) > this.trapRange || checkCollision(me, unit, 0x4)) {
				if (!Attack.getIntoPosition(unit, this.trapRange, 0x4) || (checkCollision(me, unit, 0x1) && (getCollision(unit.area, unit.x, unit.y) & 0x1))) {
					return 1;
				}
			}

			this.placeTraps(unit, checkTraps);
		}

		// Cloak of Shadows - can't be cast again until previous one runs out and next to useless if cast in precast sequence (won't blind anyone)
		if (Config.UseCloakofShadows && me.getSkill(264, 1) && getDistance(me, unit) < 20 && !me.getState(121) && !me.getState(153)) {
			Skill.cast(264, 0);
		}

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

		return 1;
	},

	afterAttack: function () {
		Precast.doPrecast(false);
	},

	doCast: function (unit, index) {
		var i,
			timed = index,
			untimed = index + 1;

		// Low mana timed skill
		if (Config.AttackSkill[timed] > -1 && Config.AttackSkill[Config.AttackSkill.length - 2] > -1 && Skill.getManaCost(Config.AttackSkill[timed]) > me.mp) {
			timed = Config.AttackSkill.length - 2;
		}

		if (Config.AttackSkill[timed] === 151) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[timed] || checkCollision(me, unit, 0x1)) {
				if (!Attack.getIntoPosition(unit, this.skillRange[timed], 0x1)) {
					return 0;
				}
			}

			return this.whirlwind(unit, timed);
		}

		if (!me.getState(121) || !Skill.isTimed(Config.AttackSkill[timed])) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[timed] || checkCollision(me, unit, 0x4)) {
				if (!Attack.getIntoPosition(unit, this.skillRange[timed], 0x4)) {
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
	},

	checkTraps: function (unit) {
		if (!Config.UseTraps) {
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
						if (traps >= Config.BossTraps.length) {
							return true;
						}

						Skill.cast(Config.BossTraps[traps], 0, unit.x + i, unit.y + j);
					} else {
						if (traps >= Config.Traps.length) {
							return true;
						}

						Skill.cast(Config.Traps[traps], 0, unit.x + i, unit.y + j);
					}

					traps += 1;
				}
			}
		}

		return true;
	},

	whirlwind: function (unit, index) {
		var i, j, coords, angle,
			//angles = [180, 45, -45, 90, -90]; // Angle offsets
			angles = [120, -120, 180, 45, -45, 90, -90]; // Angle offsets

		angle = Math.round(Math.atan2(me.y - unit.y, me.x - unit.x) * 180 / Math.PI);

MainLoop:
		for (i = 0; i < angles.length; i += 1) { // get a better spot
			for (j = 0; j < 5; j += 1) {
				coords = [Math.round((Math.cos((angle + angles[i]) * Math.PI / 180)) * j + unit.x), Math.round((Math.sin((angle + angles[i]) * Math.PI / 180)) * j + unit.y)];

				if (CollMap.getColl(coords[0], coords[1]) & 0x1) {
					continue MainLoop;
				}
			}

			if (getDistance(me, coords[0], coords[1]) >= 3) {
				CollMap.reset();

				return Skill.cast(Config.AttackSkill[index], this.skillHand[index], coords[0], coords[1]);
			}
		}

		CollMap.reset();

		return false;
	}
};