(function (require, _delay) {
	const Skills = require('Skills');
	const ignoreMonster = [];

	Unit.prototype.clear = function (range) {
		//ToDo; keep track of the place we are at
		const getUnits_filted = () => getUnits(1, -1)
			.filter(unit => ignoreMonster.indexOf(unit.gid) === -1 && unit.hp > 0 && unit.attackable && getDistance(this, unit) < range && !checkCollision(me, unit, 0x0))
			.sort((a, b) => GameData.monsterEffort(a, a.area).effort - GameData.monsterEffort(b, b.area).effort - ((b.distance - a.distance) / 5));

		let units = getUnits_filted(), unit;

		print('getting units');
		if (units) for (; (units = getUnits_filted()) && units.length;) {
			delay(20);
			if (!(unit = units.first())) break; // shouldn't happen but to be sure
			let done = false;
			for (; !done && unit.attackable;) {
				done = !unit.attack();
				print(done);
			}
		}
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

	Unit.prototype.cast = function (skillId, hand) {
		return Skill.cast(skillId, hand || Skills.hand[skillId], this);
	};

	Unit.prototype.attack = function () {
		let monsterEffort = GameData.monsterEffort(this, this.area);

		if (!monsterEffort) return false; // dont know how to attack this
		let hand = 0;

		//ToDo; remove deprecated tag Attack
		if (this.distance > Skills.range[monsterEffort.skill] || checkCollision(me, this, 0x4)) {
			if (!Attack.getIntoPosition(this, Skills.range[monsterEffort.skill], 0x4)) {
				return false;
			}
		}

		//@ToDo; Here some specific class stuff.
		switch (true) {
			case me.classid === 2: // necro
				// recast bonearmor
				!me.getState(sdk.states.BoneArmor) && Skill.cast(sdk.skills.BoneArmor) && Skill.cast(sdk.skills.BoneArmor);

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
						Skill.cast(91, 0, x, y); //ToDo; fix here something less specific as lower res curse
					});

				let corpse = getUnit(1, -1, 12),
					range = Math.floor((me.getSkill(74, 1) + 7) / 3);

				if (corpse) for (; corpse.getNext();) {
					if (getDistance(this, corpse) <= range && this.checkCorpse(corpse)) {
						Skill.cast(74, 0, corpse);
						print('Explodeded ' + corpse.name);
					}
				}
				break;
			case me.classid === 3: //Paladin
				// Recast holyshield
				!me.getState(sdk.states.HolyShield) && me.getSkill(sdk.skills.HolyShield, 1) && me.cast(sdk.skills.HolyShield);

				// If the skill we gonna use is a left skill, we can use an aura with it
				if (getBaseStat('skills', monsterEffort.skill, 'leftskill')) {

					// First ask nishi's frame if it is Eligible for conviction, if so, we put conviction on, if we got it obv
					if (GameData.convictionEligible[monsterEffort.type] && GameData.skillLevel(123)) {
						me.getSkill(0) !== 123 && Skill.setSkill(123, 0);
						hand = 1;
					} else {
						let aura = Skills.aura[monsterEffort.skill];

						// Figure out aura on skill, and set it if we got it
						aura && me.getSkill(aura, 1) && me.setSkill(aura, 0)
					}
				}

				// Be a healer, check for party members around us that have a low health
				let party = getParty();
				if (party) for (let unit; party.getNext();) {// If party member in same area, and can find the unit, that isnt dead, cast holy bolt on thje party member
					party.hp < 60 && party.area === me.area && (unit = getUnits(1, party.name).filter(x => !x.dead).first()) && unit && unit.cast(sdk.skills.HolyBolt);
				}
				break;

				if (monsterEffort.skill === sdk.skills.BlessedHammer) {
					if (!require('Paladin').getHammerPosition(this)) return false;
				}

		}
		me.overhead(getSkillById(monsterEffort.skill) + ' @ ' + monsterEffort.effort.toFixed(2));
		if (Skills.range[monsterEffort.skill] < this.distance) {
			this.moveTo(); // Move to monster if its on a too high distance
		}
		let val = this.attackable && this.cast(monsterEffort.skill);
		_delay(3); // legit delay
		return val;
	};

	Unit.prototype.kill = function () {
		let counter = 1;
		while (counter < 3000 && counter++ && this.attackable) if (!this.attack()) break;
		this.attackable && ignoreMonster.push(this.gid);
	};

})(require, delay);