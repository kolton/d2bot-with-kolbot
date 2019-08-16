(function (require, _delay) {
	print('klasjdklafsdkjlfdaskljfsadkljasdfkljfasdkljfdsakljfsadlkjfsadkljasfd');
	const Skills = require('Skills');
	const ignoreMonster = [];

	Unit.prototype.clear = function (range) {
		//ToDo; keep track of the place we are at
		const getUnits_filted = () => getUnits(1, -1)
			.filter(unit => ignoreMonster.indexOf(unit.gid) === -1 && unit.hp > 0 && unit.attackable && getDistance(this, unit) < range && !checkCollision(me, unit, 0x0))
			.sort((a, b) => GameData.monsterEffort(a, a.area).effort - GameData.monsterEffort(b, b.area).effort - ((b.distance - a.distance) / 5));

		let units = getUnits_filted(), unit;
		if (units) for (; (units = getUnits_filted()) && units.length;) {
			delay(20);
			if (!(unit = units.first())) break; // shouldn't happen but to be sure
			let done = false;
			for (; !done && unit.attackable;) {
				done = !unit.attack();
			}
		}
		return true;
	};

	Unit.prototype.__defineGetter__('attackable', function () {
		if (this.type === 0 && this.mode !== 17 && this.mode !== 0) { //ToDo: build in here a check if player is hostiled
			return true;
		}


		if (this.hp === 0 || this.mode === 0 || this.mode === 12) { // Dead monster
			return false;
		}

		if (this.getStat(172) === 2) {	// Friendly monster/NPC
			return false;
		}

		if (this.charlvl < 1) { // catapults were returning a level of 0 and hanging up clear scripts
			return false;
		}

		if (getBaseStat("monstats", this.classid, "neverCount")) { // neverCount base stat - hydras, traps etc.
			return false;
		}


		// Monsters that are in flight
		if ([110, 111, 112, 113, 144, 608].indexOf(this.classid) > -1 && this.mode === 8) {
			return false;
		}

		// Monsters that are Burrowed/Submerged
		if ([68, 69, 70, 71, 72, 258, 258, 259, 260, 261, 262, 263].indexOf(this.classid) > -1 && this.mode === 14) {
			return false;
		}

		return [sdk.monsters.ThroneBaal].indexOf(this.classid) <= -1;


	});

	Unit.prototype.cast = function (skillId, hand, x, y, item) {
		// In case its called upon an item we own, redirect it to castChargedSkill
		if (this.type === 4 && Object.keys(sdk.storage).map(x => sdk.storage[x]).indexOf(this.location) !== -1) return this.castChargedSkill(skillId, x, y);
		//return Skill.cast(skillId, hand || Skills.hand[skillId], this);

		const Config = require('Config');
		// Some invalid crap

		switch (true) {
			case me.inTown && !this.townSkill(skillId): // cant cast this in town
			case !item && Skills.manaCost[skillId] > me.mp: // dont have enough mana for this
			case !item && !me.getSkill(skillId, 1): // Dont have this skill
				return false;
			case skillId === undefined:
				throw new Error("Unit.cast: Must supply a skill ID");
		}

		var i, n, clickType, shift;

		hand === undefined && (hand = Skills.hand[skillId]);

		x === undefined && (x = me.x);
		y === undefined && (y = me.y);

		if (!me.setSkill(skillId, hand, item)) return false;

		if (Config.PacketCasting > 1) {
			switch (typeof x) {
				case "number":
					Packet.castSkill(hand, x, y);
					delay(250);

					break;
				case "object":
					Packet.unitCast(hand, x);
					delay(250);

					break;
			}
		} else {
			switch (hand) {
				case 0: // Right hand + No Shift
					clickType = 3;
					shift = 0;

					break;
				case 1: // Left hand + Shift
					clickType = 0;
					shift = 1;

					break;
				case 2: // Left hand + No Shift
					clickType = 0;
					shift = 0;

					break;
				case 3: // Right hand + Shift
					clickType = 3;
					shift = 1;

					break;
			}

			MainLoop:
				for (n = 0; n < 3; n += 1) {
					if (this !== me) {
						clickMap(clickType, shift, this);
					} else {
						clickMap(clickType, shift, x, y);
					}

					delay(20);

					if (this !== me) {
						clickMap(clickType + 2, shift, this);
					} else {
						clickMap(clickType + 2, shift, x, y);
					}

					for (i = 0; i < 8; i += 1) {
						if (me.attacking) {
							break MainLoop;
						}

						delay(20);
					}
				}

			while (me.attacking) {
				delay(10);
			}
		}

		if (Skill.isTimed(skillId)) { // account for lag, state 121 doesn't kick in immediately
			for (i = 0; i < 10; i += 1) {
				if ([4, 9].indexOf(me.mode) > -1) {
					break;
				}

				if (me.getState(121)) {
					break;
				}

				delay(10);
			}
		}

		return true;
	};

	Unit.prototype.attack = function () {
		let monsterEffort = GameData.monsterEffort(this, this.area);

		if (!monsterEffort) return false; // dont know how to attack this
		let hand = 0;

		if (!Attack.validSpot(this.x, this.y)) {
			print('INVALID SPOT -- ');
			ignoreMonster.push(this.gid);
			return false;
		}

		//ToDo; remove deprecated tag Attack
		if (this.distance > Skills.range[monsterEffort.skill] || checkCollision(me, this, 0x4)) {
			if (!Attack.getIntoPosition(this, Skills.range[monsterEffort.skill], 0x4)) {
				ignoreMonster.push(this.gid);
				return false;
			}
		}

		//@ToDo; Here some specific class stuff.
		switch (true) {
			case me.classid === 2: // necro
				// recast bonearmor
				!me.getState(sdk.states.BoneArmor) && me.cast(sdk.skills.BoneArmor) && me.cast(sdk.skills.BoneArmor);

				// Take care of the curse
				getUnits(1)
					.filter(Attack.checkMonster)
					.filter(unit => !unit.getState(61))
					.forEach(function (unit) {
						let [x, y] = [unit.x, unit.y], spot;
						if (unit.getState(61)) return; //ToDo; fix here something less specific as lower res curse

						// Move to position if needed
						if ((getDistance(me, unit) > 40 || checkCollision(me, unit, 0x4))) {
							// We cant reach the monster, as it is too far away.
							// However we might can cast something close by.
							spot = unit.bestSpot(60); // get the best spot
							if (!spot) return;
							[x, y] = [spot.x, spot.y];
						}

						// cast lower res aura on the bastard
						me.cast(91, 0, x, y); //ToDo; fix here something less specific as lower res curse
					});

				let corpse = getUnit(1, -1, 12),
					range = Math.floor((me.getSkill(74, 1) + 7) / 3);

				if (corpse) for (; corpse.getNext();) {
					if (getDistance(this, corpse) <= range && this.checkCorpse(corpse)) {
						me.cast(74, 0, corpse);
					}
				}
				break;
			case me.classid === 3: //Paladin
				// Recast holyshield
				!me.getState(sdk.states.HolyShield) && me.getSkill(sdk.skills.HolyShield, 1) && me.cast(sdk.skills.HolyShield);

				// If the skill we gonna use is a left skill, we can use an aura with it
				if (getBaseStat('skills', monsterEffort.skill, 'leftskill')) {


				}

				// Be a healer, check for party members around us that have a low health
				let party = getParty();
				if (party) for (let unit; party.getNext();) {// If party member in same area, and can find the unit, that isnt dead, cast holy bolt on thje party member
					party.hp < 60 && party.area === me.area && (unit = getUnits(1, party.name).filter(x => !x.dead).first()) && unit && unit.cast(sdk.skills.HolyBolt);
				}

				if (monsterEffort.skill === sdk.skills.BlessedHammer) {
					if (!require('Paladin').getHammerPosition(this)) return false;
				}
				break;

		}


		me.overhead(getSkillById(monsterEffort.skill) + ' @ ' + monsterEffort.effort.toFixed(2));

		if (Skills.range[monsterEffort.skill] < this.distance) {
			this.moveTo(); // Move to monster if its on a too high distance
		}

		// Paladins have aura's
		if (Skills.hand[monsterEffort.skill] && me.classid === 3) { // Only for skills set on first hand, we can have an aura with it
			// First ask nishi's frame if it is Eligible for conviction, if so, we put conviction on, if we got it obv
			if (GameData.convictionEligible[monsterEffort.type] && GameData.skillLevel(123)) {
				me.getSkill(0) !== 123 && me.setSkill(123, 0);
				hand = 1;
			} else {
				let aura = Skills.aura[monsterEffort.skill];

				// Figure out aura on skill, and set it if we got it
				aura && me.getSkill(aura, 1) && me.setSkill(aura, 0)
			}
		}
		let val = this.attackable && this.cast(monsterEffort.skill);
		_delay(3); // legit delay
		Pickit.pickItems();
		return val;
	};

	Unit.prototype.kill = function () {
		print('Killing ' + this.name);
		let counter = 1;
		while (counter < 3000 && counter++ && this.attackable) if (!this.attack()) break;
		this.attackable && ignoreMonster.push(this.gid);
	};

})(require, delay);