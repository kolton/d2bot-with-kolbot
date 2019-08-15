/**
*	@filename	Amazon.js
*	@author		kolton,jaenster
*	@desc		Amazon attack sequence
*/

var ClassAttack = (function () { // wrapper to not leak stuff to global scope
	let internalLightFuryTick = 0;
	let mercHasInfinity = undefined;
	let Java = {
		skills: {
			Jab: 10,
			ChargedStrike: 24,
			LightningStrike: 34,
			LightningFury: 35,
		},
		range: {
			Jab: 3,
			ChargedStrike: 3,
			LightningStrike: 3,
			LightningFury: 7,
		}
	};

	/**
     * @param {Unit} unit
     */
	function checkResistance (unit) {
		return Attack.checkResist(unit, "lightning", infinityMerc() ? 117 : 100);
	}

	/**
     * @param args
     * @returns {Unit[]}
     */
	function getUnits (...args) {
		let units = [], unit = getUnit.apply(null, args);

		if (!unit) {
			return [];
		}

		do {
			units.push(copyUnit(unit));
		} while (unit.getNext());

		return units;
	}

	function infinityMerc () {
		let merc = me.getMerc();

		if (mercHasInfinity) {

			return merc; // Check if our merc is alive, and if so, that is the answer

		} else if (mercHasInfinity === undefined && merc) { // If we dont know if merc has infinity yet, check it
			mercHasInfinity = !!(merc.getItems(-1).filter((item) => item.getPrefix(20566)).length);

			return mercHasInfinity;
		}

		return false; // Nope.
	}

	// Get the attack frame for throwing
	function getAttackFramesThrowing () {
		let ias = me.getStat(93), // I gonna asume you have a -10 weapon (x40's/titan/thunderstroke all have -10 base)
			breakpoints = [6, 16, 30, 52, 89]; // throw -10 weapon speed

		// 14 minus the count of breakpoints, is the amount of fpa your char has
		return 14 - breakpoints.filter(bp => ias < bp).length;
	}

	return {
		bowCheck: false,
		lightFuryTick: 0,

		doAttack: function (unit, preattack) {
			var needRepair = Town.needRepair();

			if ((Config.MercWatch && Town.needMerc()) || needRepair.length > 0) {
				Town.visitTown(!!needRepair.length);
			}

			if (preattack && Config.AttackSkill[0] > 0 && Attack.checkResist(unit, Config.AttackSkill[0]) && (!me.getState(121) || !Skill.isTimed(Config.AttackSkill[0]))) {
				if (Math.round(getDistance(me, unit)) > Skill.getRange(Config.AttackSkill[0]) || checkCollision(me, unit, 0x4)) {
					if (!Attack.getIntoPosition(unit, Skill.getRange(Config.AttackSkill[0]), 0x4)) {
						return 0;
					}
				}

				Skill.cast(Config.AttackSkill[0], Skill.getHand(Config.AttackSkill[0]), unit);

				return 1;
			}

			var index, checkSkill, result,
				mercRevive = 0,
				timedSkill = -1,
				untimedSkill = -1;

			index = ((unit.spectype & 0x7) || unit.type === 0) ? 1 : 3;

			// Get timed skill
			if (Attack.getCustomAttack(unit)) {
				checkSkill = Attack.getCustomAttack(unit)[0];
			} else {
				checkSkill = Config.AttackSkill[index];
			}

			if (Attack.checkResist(unit, checkSkill)) {
				timedSkill = checkSkill;
			} else if (Config.AttackSkill[5] > -1 && Attack.checkResist(unit, Config.AttackSkill[5]) && ([56, 59].indexOf(Config.AttackSkill[5]) === -1 || Attack.validSpot(unit.x, unit.y))) {
				timedSkill = Config.AttackSkill[5];
			}

			// Get untimed skill
			if (Attack.getCustomAttack(unit)) {
				checkSkill = Attack.getCustomAttack(unit)[1];
			} else {
				checkSkill = Config.AttackSkill[index + 1];
			}

			if (Attack.checkResist(unit, checkSkill)) {
				untimedSkill = checkSkill;
			} else if (Config.AttackSkill[6] > -1 && Attack.checkResist(unit, Config.AttackSkill[6]) && ([56, 59].indexOf(Config.AttackSkill[6]) === -1 || Attack.validSpot(unit.x, unit.y))) {
				untimedSkill = Config.AttackSkill[6];
			}

			// Low mana timed skill
			if (Config.LowManaSkill[0] > -1 && Skill.getManaCost(timedSkill) > me.mp && Attack.checkResist(unit, Config.LowManaSkill[0])) {
				timedSkill = Config.LowManaSkill[0];
			}

			// Low mana untimed skill
			if (Config.LowManaSkill[1] > -1 && Skill.getManaCost(untimedSkill) > me.mp && Attack.checkResist(unit, Config.LowManaSkill[1])) {
				untimedSkill = Config.LowManaSkill[1];
			}

			result = this.doCast(unit, timedSkill, untimedSkill);

			if (result === 2 && Config.TeleStomp && Attack.checkResist(unit, "physical") && !!me.getMerc()) {
				while (Attack.checkMonster(unit)) {
					if (Town.needMerc()) {
						if (Config.MercWatch && mercRevive++ < 1) {
							Town.visitTown();
						} else {
							return 2;
						}
					}

					if (getDistance(me, unit) > 3) {
						Pather.moveToUnit(unit);
					}

					this.doCast(unit, Config.AttackSkill[1], Config.AttackSkill[2]);
				}

				return 1;
			}

			return result;
		},

		afterAttack: function () {
			var needRepair;

			Misc.unShift();
			Precast.doPrecast(false);

			needRepair = Town.needRepair();

			if (needRepair && needRepair.length > 0) { // Repair check, mainly to restock arrows
				Town.visitTown(true);
			}

			this.lightFuryTick = 0;
		},

		// Returns: 0 - fail, 1 - success, 2 - no valid attack skills
		doCast: function (unit, timedSkill, untimedSkill) {
			var i, walk;

			// No valid skills can be found
			if (timedSkill < 0 && untimedSkill < 0) {
				return 2;
			}

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

			// First get the best javelin weapon we are wearing
			let javelin = me.getItems().filter(
				(item) =>
					(me.weaponswitch === 0 ? [4, 5] : [11, 12]).indexOf(item.bodylocation) !== -1 // Only weapons/shield
                    && item.getStat(70)
                    // Only items with Quantity
                    && [526, 528].indexOf(item.classid) === -1 // Filter out arrows/bolts
			).first();

			if (javelin) {
				let waitTime,
					replenish_quantity = !!javelin.getStat(253), // We have a javelin that replenish itself (aka titans/highend 5/40)
					ethereal = !!javelin.getFlag(0x400000); // Check if item is ethereal

				// Determine waiting time, if eth, we dont want to run out
				if (ethereal && replenish_quantity && javelin.getStat(70) < 20) { // If eth and low on quantity
					waitTime = 3e3; // 3 seconds
				} else {
					// Note; this is max attack you can have, but it doesnt do this if a fury isn't usefull at the moment
					waitTime = (25 / getAttackFramesThrowing()); // whatever speed you have
				}

				let monsters = getUnits(1)
					.filter(Attack.checkMonster) // Only attackable monsters
					.filter(checkResistance) // Filter out those immune monsters
					.filter(monster => monster.distance <= Skill.getRange(Java.skills.LightningFury)) // Low radius
					.sort(Sort.units); // Sort by distance

				if (unit.dead) {
					return 1; //
				}

				// Only use fury if there are more as 3 monsters around, that are applicable for fury and not dead
				if (getTickCount() - internalLightFuryTick > waitTime && monsters.length > 3) {

					// Get the closest monster that isn't
					let monster = monsters
						.filter(monster => !checkCollision(me, monster, 0x4)) // Only those i can hit (nothing between me and the monster)
						.sort((a, b) => a.distance - b.distance) // The one that is most close to me
						.first();

					// Get in position. Worst case, we still have to get into position, just a safety check.
					if (unit.distance > Skill.getRange(Java.skills.LightningFury) && !checkCollision(me, unit, 0x4) && !Attack.getIntoPosition(unit, 30, 0x4)) {
						return 0;
					}

					internalLightFuryTick = getTickCount();

					// Since fury hits multiple targets, we better can focus it on the monster closest to us, giving more potential on multiple javelin splitting (pierce).
					return Skill.cast(Java.skills.LightningFury, 0, monster);
				}

				// Lighting strike, strikes with quite a punch, specially monster is near you and multiple targets.
				// This clears faster as a singular targeted charged strike. Only do this if we are next to the monster already
				if (unit.distance <= Java.range.LightningStrike && monsters.length > 2) {
					return Skill.cast(Java.skills.LightningStrike, 1, unit);
				}

				// Good old charged strike
				if (Math.round(unit.distance) > Skill.getRange(Java.skills.ChargedStrike) || checkCollision(me, unit, 0x4)) {
					// Allow short-distance walking for melee skills
					walk = Skill.getRange(timedSkill) < 4 && getDistance(me, unit) < 10 && !checkCollision(me, unit, 0x1);

					if (!Attack.getIntoPosition(unit, Skill.getRange(Java.skills.ChargedStrike), 0x4, walk)) {
						return 0;
					}
				}

				// check resistance for charged strike. Since all (suitable) attacks are lighting, use a hardcoded jab here as alternative.
				// We already moved into position for charged strike if needed, which is the same range as jab
				if (!checkResistance(unit)) {
					return Skill.cast(Java.skills.Jab, 1, unit);
				}

				return Skill.cast(Java.skills.ChargedStrike, 1, unit);

			}

			// Not a javelin char, just the old stuff here
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

				if (!unit.dead) {
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
				if (!me.getState(121)) { // wait for skill delay
					break;
				}

				delay(40);
			}

			return 1;
		}
	};
})();
