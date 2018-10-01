/**
 *    @filename    SpeedBaal.js
 *    @author        Jaenster
 *    @desc        clear Throne of Destruction and kill Baal
 *
 * Some highlights
 * 1) Faster clearing of the throne by only killing the necessary monsters for a wave to spawn
 * 2) Lighting / Blizzard / Meteor / Hammers / Fury, and many more skills are cast just on time before wave comes. To save mana, but also to have maximum impact
 * 3) Added some custom pickit lines to avoid NPC interactions, to make runs go faster. (again this isn't an mf run, its an xp run)
 * 4) Overrides Attack.clear function to be quicker better for the throne, but don't worry after the script is done (or crashed), it puts the original clear script back.
 */

function SpeedBaal() {
	// Debug function
	function debug(what) {
		var stackNumber = 1, // exclude this function
			stack = new Error().stack.match(/[^\r\n]+/g),
			line = stack[stackNumber].substr(stack[stackNumber].lastIndexOf(':') + 1),
			functionName = stack[stackNumber].substr(0, stack[stackNumber].indexOf('@')),
			filename = stack[stackNumber].substr(stack[stackNumber].lastIndexOf('\\') + 1),
			self = getScript(true).name.toLowerCase();

		filename = filename.substr(0, filename.indexOf('.'));

		if (typeof what === 'object') {
			what = JSON.stringify(what);
		}
		switch (true) {
			case self.endsWith('default.dbj'):
				print('\xFFc:[\xFFc5' + filename + '\xFFc:] (\xFFc:' + functionName + ':' + line + '\xFFc:):\xFFc0 ' + what);
				break;
			case self.endsWith(getCurrentFileName().substr(0, getCurrentFileName().indexOf(':'))):
				print('\xFFc:[\xFFc5Thread\xFFc:] (\xFFc:' + functionName + ':' + line + '\xFFc:):\xFFc0 ' + what);
		}
	}

	function getCurrentFileName() {
		var stack = new Error().stack.match(/[^\r\n]+/g);
		return stack[1].substr(stack[1].lastIndexOf('\\') + 1);
	}

	function addToPickit(line) {
		var i = NTIP_CheckList.length + 1,
			info = {
				line: i + 1,
				file: '',
				string: line
			}
		line = NTIP.ParseLineInt(line, info);
		if (line) {

			NTIP_CheckList.push(line);
			stringArray.push(info);
		}
	}

	function startThread() {
		// We either are the thread, that needs booting, or we are the script that needs to start the thread
		var self = getScript(true).name.toLowerCase(),
			filename = getCurrentFileName().substr(0, getCurrentFileName().indexOf(':'));

		switch (true) {
			case self.endsWith('default.dbj'):
				addEventListener("copydata", Communication.events.copydata);
				delay(250);
				load('libs/bots/' + filename); // Load our selfs
				return false; // did start the thread, but we aren't the thread
			case self.endsWith(filename):
				include("common/Config.js");
				include("common/Storage.js");
				include("common/Pather.js");
				include("common/Prototypes.js");
				Config.init(true);
				Storage.Init();
				Thread.run();
				break;
		}
		return true;
	}

	var Thread = {
		vault: {
			tick: 0,
			oldtick: 0,
			packetListenerOn: false
		},
		checks: {
			tickUpdate: function () {
				if (Thread.vault.tick !== Thread.vault.oldtick) {
					removeEventListener('gamepacket', Thread.events.gamePacket); // disable it a second
					debug('Throne ready for wave. Will spawn in 12 seconds');
					delay(500); // Do this or get massive lag spikes! (weird buggy stuff of d2bs)
					Communication.setVariable('tick', Thread.vault.tick);
					addEventListener('gamepacket', Thread.events.gamePacket); // enable it
					Thread.vault.oldtick = Thread.vault.tick;
				}

				// In throne and packet listner is off?
				if (!Thread.vault.packetListenerOn && me.area === Areas.ThroneOfDestruction) {
					addEventListener('gamepacket', Thread.events.gamePacket);
					Thread.vault.packetListenerOn = true;
				}

				// Not in throne but packet listner on?
				if (Thread.vault.packetListenerOn && me.area !== Areas.ThroneOfDestruction) {
					removeEventListener('gamepacket', Thread.events.gamePacket);
					Thread.vault.packetListenerOn = false;
				}
			}
		},
		events: {
			gamePacket: function (bytes) {
				// Quickly return if it isn't the desired packet.
				// This will avoid the "too much recursion" issues @ javascript
				if (bytes[0] !== 0xA4) {
					return false;
				}

				// 0xA4 -- Throne is ready.  Listed as a undefined packet by the general info about the packets but that is what it means.
				// Its what triggers the typical "baal laugh" after you finished a wave, or cleared the throne.
				Thread.vault.tick = getTickCount();
				return false; // False to not block the packet
			},
		},
		run: function () {
			debug('thread started');

			// This is a special thread, only listing for the gamepacket and send it.
			//addEventListener("copydata", Communication.events.copydata);
			Communication.setVariable('threadStarted', true);
			delay(5000);
			while (me.ingame) {
				for (var i in this.checks) {
					if (this.checks.hasOwnProperty(i) && typeof this.checks[i] === "function" && i !== "go") {
						this.checks[i]();
					}
				}
			}
		}
	};
	var Skills = {
		// General
		Attack: 0,
		Kick: 1,
		Throw: 2,
		Unsummon: 3,
		LeftHandThrow: 4,
		LeftHandSwing: 5,

		// Amazone
		MagicArrow: 6,
		FireArrow: 7,
		InnerSight: 8,
		CriticalStrike: 9,
		Jab: 10,
		ColdArrow: 11,
		MultipleShot: 12,
		Dodge: 13,
		PowerStrike: 14,
		PoisonJavelin: 15,
		ExplodingArrow: 16,
		SlowMissiles: 17,
		Avoid: 18,
		Impale: 19,
		LightningBolt: 20,
		IceArrow: 21,
		GuidedArrow: 22,
		Penetrate: 23,
		ChargedStrike: 24,
		PlagueJavelin: 25,
		Strafe: 26,
		ImmolationArrow: 27,
		Dopplezon: 28,
		Evade: 29,
		Fend: 30,
		FreezingArrow: 31,
		Valkyrie: 32,
		Pierce: 33,
		LightningStrike: 34,
		LightningFury: 35,

		// Sorc
		FireBolt: 36,
		Warmth: 37,
		ChargedBolt: 38,
		IceBolt: 39,
		FrozenArmor: 40,
		Inferno: 41,
		StaticField: 42,
		Telekinesis: 43,
		FrostNova: 44,
		IceBlast: 45,
		Blaze: 46,
		FireBall: 47,
		Nova: 48,
		Lightning: 49,
		ShiverArmor: 50,
		FireWall: 51,
		Enchant: 52,
		ChainLightning: 53,
		Teleport: 54,
		GlacialSpike: 55,
		Meteor: 56,
		ThunderStorm: 57,
		EnergyShield: 58,
		Blizzard: 59,
		ChillingArmor: 60,
		FireMastery: 61,
		Hydra: 62,
		LightningMastery: 63,
		FrozenOrb: 64,
		ColdMastery: 65,

		// Necro
		AmplifyDamage: 66,
		Teeth: 67,
		BoneArmor: 68,
		SkeletonMastery: 69,
		RaiseSkeleton: 70,
		DimVision: 71,
		Weaken: 72,
		PoisonDagger: 73,
		CorpseExplosion: 74,
		ClayGolem: 75,
		IronMaiden: 76,
		Terror: 77,
		BoneWall: 78,
		GolemMastery: 79,
		RaiseSkeletalMage: 80,
		Confuse: 81,
		LifeTap: 82,
		PoisonExplosion: 83,
		BoneSpear: 84,
		BloodGolem: 85,
		Attract: 86,
		Decrepify: 87,
		BonePrison: 88,
		SummonResist: 89,
		IronGolem: 90,
		LowerResist: 91,
		PoisonNova: 92,
		BoneSpirit: 93,
		FireGolem: 94,
		Revive: 95,

		// Paladin
		Sacrifice: 96,
		Smite: 97,
		Might: 98,
		Prayer: 99,
		ResistFire: 100,
		HolyBolt: 101,
		HolyFire: 102,
		Thorns: 103,
		Defiance: 104,
		ResistCold: 105,
		Zeal: 106,
		Charge: 107,
		BlessedAim: 108,
		Cleansing: 109,
		ResistLightning: 110,
		Vengeance: 111,
		BlessedHammer: 112,
		Concentration: 113,
		HolyFreeze: 114,
		Vigor: 115,
		Conversion: 116,
		HolyShield: 117,
		HolyShock: 118,
		Sanctuary: 119,
		Meditation: 120,
		FistoftheHeavens: 121,
		Fanaticism: 122,
		Conviction: 123,
		Redemption: 124,
		Salvation: 125,

		// Barb
		Bash: 126,
		SwordMastery: 127,
		AxeMastery: 128,
		MaceMastery: 129,
		Howl: 130,
		FindPotion: 131,
		Leap: 132,
		DoubleSwing: 133,
		PoleArmMastery: 134,
		ThrowingMastery: 135,
		SpearMastery: 136,
		Taunt: 137,
		Shout: 138,
		Stun: 139,
		DoubleThrow: 140,
		IncreasedStamina: 141,
		FindItem: 142,
		LeapAttack: 143,
		Concentrate: 144,
		IronSkin: 145,
		BattleCry: 146,
		Frenzy: 147,
		IncreasedSpeed: 148,
		BattleOrders: 149,
		GrimWard: 150,
		Whirlwind: 151,
		Berserk: 152,
		NaturalResistance: 153,
		WarCry: 154,
		BattleCommand: 155,

		// Druid
		Raven: 221,
		PlaguePoppy: 222,
		Wearwolf: 223,
		ShapeShifting: 224,
		Firestorm: 225,
		OakSage: 226,
		SummonSpiritWolf: 227,
		Wearbear: 228,
		MoltenBoulder: 229,
		ArcticBlast: 230,
		CycleofLife: 231,
		FeralRage: 232,
		Maul: 233,
		Eruption: 234,
		CycloneArmor: 235,
		HeartofWolverine: 236,
		SummonFenris: 237,
		Rabies: 238,
		FireClaws: 239,
		Twister: 240,
		Vines: 241,
		Hunger: 242,
		ShockWave: 243,
		Volcano: 244,
		Tornado: 245,
		SpiritofBarbs: 246,
		SummonGrizzly: 247,
		Fury: 248,
		Armageddon: 249,
		Hurricane: 250,

		// Sorc
		FireTrauma: 251,
		ClawMastery: 252,
		PsychicHammer: 253,
		TigerStrike: 254,
		DragonTalon: 255,
		ShockField: 256,
		BladeSentinel: 257,
		Quickness: 258,
		FistsofFire: 259,
		DragonClaw: 260,
		ChargedBoltSentry: 261,
		WakeofFireSentry: 262,
		WeaponBlock: 263,
		CloakofShadows: 264,
		CobraStrike: 265,
		BladeFury: 266,
		Fade: 267,
		ShadowWarrior: 268,
		ClawsofThunder: 269,
		DragonTail: 270,
		LightningSentry: 271,
		InfernoSentry: 272,
		MindBlast: 273,
		BladesofIce: 274,
		DragonFlight: 275,
		DeathSentry: 276,
		BladeShield: 277,
		Venom: 278,
		ShadowMaster: 279,
		RoyalStrike: 280,
		WakeOfDestructionSentry: 281,
		tabs: {
			// Ama
			BowCrossbow: 0,
			PassiveMagic: 1,
			JavelinSpear: 2,

			//sorc
			Fire: 8,
			Lightning: 9,
			Cold: 10,

			// Necro
			Curses: 16,
			PosionBone: 17,
			NecroSummoning: 18,

			// Pala
			PalaCombat: 24,
			Offensive: 25,
			Defensive: 26,

			// Barb
			CombatBarb: 32,
			Masteries: 33,
			Warcries: 34,

			// Druid
			DruidSummon: 40,
			ShapeShifting: 41,
			Elemental: 42,

			// Assa
			Traps: 48,
			ShadowDisciplines: 49,
			MartialArts: 50,
		}
	};
	var Areas = {

		Harrogath: 109,

		WorldstoneLvl2: 129,
		WorldstoneLvl3: 130,
		ThroneOfDestruction: 131,
		WorldstoneChamber: 132,
	};
	var Builds = {
		vault: {},
		mine: undefined,
		Javazon: 1,
		FireBall: 2,
		Blizzard: 3,
		Lighting: 4,
		SuperNova: 5,
		Avengerdin: 6,
		Hammerdin: 7,
		Trapsin: 8,
		WarCry: 9,
		CurseNecro: 10,
		Hurricane: 11,
		// get build of char
		init: function () {
			function sum(array) {
				var k, total = 0;
				for (k = 0; k < array.length; k++) {
					total += array[k];
				}
				return total;
			}

			var i, max = 0, attacks, score, who;
			for (i in this.attackSequences) {
				attacks = this.attackSequences[i].skills.map(function (skill) {
					skill = me.getSkill(skill, 0); // get amount of hardpoints
					if (skill === false) {
						skill = 0;
					}
					return skill;
				});
				score = sum(attacks) / attacks.length * (attacks.length / 3);
				//debug('who: ' + i + ' score: ' + score);
				if (score > max) {
					max = score;
					who = i;
				}
			}
			debug('my build: ' + who + ' == ' + Builds[who]);
			Builds.mine = Builds[who];

			// In case doAttack is defined
			if (this.attackSequences[who].hasOwnProperty('doAttack')) {
				debug('Overloading for ' + who + ' - ClassAttack.doAttack');
				if (typeof Overloading.vault.ClassAttack !== Object) {
					Overloading.vault.ClassAttack = {};
				}
				Overloading.vault.ClassAttack.doAttack = ClassAttack.doAttack; // Store original
				ClassAttack.doAttack = this.attackSequences[who].doAttack; // the real override
			}
		},
		getMonsters: function () {
			var monster = getUnit(1), monsters = [];
			do {
				monsters.push(copyUnit(monster));
			} while (monster.getNext());
			return monsters;
		},
		filters: {
			inRangeMe: function (range, unit) {
				return this.inRangeUnit({
					source: me,
					range: range
				}, unit)
			},
			inRangeUnit: function (compare, unit) {
				var source = compare.source,
					range = compare.range;
				return !!getDistance(source, unit) < range;
			}
		},
		// get attack sequence
		attackSequences: {
			Javazon: {
				skills: [Skills.Fury, Skills.ChargedStrike],
				vault: {
					timer: 0
				},
				doAttack: function (unit) {
					// Typical merc check
					if (Config.MercWatch && Town.needMerc()) {
						Town.visitTown();
					}

					debug(getTickCount() - Builds.attackSequences.Javazon.vault.timer);
					if (getTickCount() - Builds.attackSequences.Javazon.vault.timer > 1000) {
						// Get list of nearby monsters
						var monster = getUnit(1), monsters = [copyUnit(unit)], currentMonster;
						do {
							currentMonster = copyUnit(monster);
							// If monsters are near eachother
							if (Attack.checkMonster(currentMonster)
								&& getDistance(currentMonster, unit) < 7           // Distance between monster and monster are low
							//&& checkCollision(monster, unit, 0x4) // As long there are no collisions between monster and monster
							//&& Attack.checkResist(currentMonster, Skill.LightningFury) // and accually can be attacked
							) {
								monsters.push(currentMonster);
							}
						} while (monster.getNext());

						if (monsters.length > 3) { // if 3 or more monsters are around the unit (the unit itself is included in the list)
							debug('Fury!');
							monsters.sort(Sort.units); // Get the one that the most close to me
							Builds.attackSequences.Javazon.vault.timer = getTickCount();
							Skill.cast(Skills.LightningFury, 0, monsters[0]); // Cast fury
							// Continue with normal attack sequence now
						}
					} else {
						debug('Skipping fury atm');
					}

					// Get timed skill
					var checkSkill = Skills.ChargedStrike;

					if (Math.round(getDistance(me, unit)) > Skill.getRange(checkSkill) || checkCollision(me, unit, 0x4)) {
						if (!Attack.getIntoPosition(unit, Skill.getRange(checkSkill), 0x4)) {
							return 0;
						}
					}

					// check resistance for charged strike
					if (!Attack.checkResist(unit, checkSkill)) {
						checkSkill = Skills.Jab; // Jab if we cant use lighting
					}

					var success = Skill.cast(checkSkill, 1, unit);
					return success;
				}
			},
			FireBall: {
				skills: [Skills.FireBall, Skills.Meteor, Skills.FireMastery],
			},
			Blizzard: {
				skills: [Skills.Blizzard, Skills.IceBlast, Skills.ColdMastery],
			},
			Lighting: {
				skills: [Skills.Lightning, Skills.ChainLightning, Skills.LightningMastery, Skills.Nova],
			},
			SuperNova: {
				skills: [Skills.FrostNova, Skills.Nova, Skills.StaticField, Skills.FireBall, Skills.FireBolt],

				// Overwrite doAttack for this class
				doAttack: function (unit) {
					var castSome = false;
					if (Math.round(getDistance(me, unit)) > Skill.getRange(Skills.Nova) || checkCollision(me, unit, 0x4)) {
						if (!Attack.getIntoPosition(unit, Skill.getRange(Skills.Nova), 0x4)) {
							return true;
						}
					}
					var monster = getUnit(1), monsters = [];
					do {
						monsters.push(copyUnit(monster));
					} while (monster.getNext());
					do {
						monsters.sort(Sort.units)
							.filter(Attack.checkMonster) // Only valid monsters
							.forEach(function (currentMonster) {
									//debug('checking ' + monster.name);
									[
										[Skills.FrostNova, !currentMonster.getState(1)], // only unfrozen monsters
										[Skills.Nova, 100 / currentMonster.hpmax * currentMonster.hp < 50], // From 50% life
										[Skills.StaticField, 100 / currentMonster.hpmax * currentMonster.hp > 40], // above 45% hp
										[Skills.FireBall, true], // just always
										[Skills.Normal, 100 / me.mpmax * me.mp < 20] // only if we have low mana
									].forEach(function (currentCheck) {
										var check;
										if (!me.getSkill(currentCheck[0], 0)) {
											return; // Dont have current skill, next
										}
										if (getDistance(me, currentMonster) > Skill.getRange(currentCheck[0])) {
											return; // out of range, next
										}
										if (checkCollision(me, unit, 0x4)) {
											return; // Not a clear path to monster, next
										}
										if (!Attack.checkResist(currentMonster, currentCheck[0])) {
											return; // cant harm monster with this skill, next
										}
										if (currentMonster.dead) {
											return; // dead monster doesn't need to die again, next
										}

										if (typeof currentCheck[1] === 'function') {
											check = currentCheck[1](currentMonster);
										} else {
											//debug('Always true?' + currentCheck[1]);
											check = currentCheck[1];
										}

										// Attack?
										if (check) {
											//debug('Casting: ' + getSkillById(currentCheck[0]));
											castSome |= Skill.cast(currentCheck[0], Skill.getHand(currentCheck[0]), currentMonster.x, currentMonster.y);
										}
									});

								}
							);
					} while (!unit.dead && !me.dead);
					return castSome;
				},
			},

			Avengerdin: {
				skills: [Skills.Conviction, Skills.Vengeance],
			},

			Hammerdin: {
				skills: [Skills.BlessedHammer, Skills.BlessedAim, Skills.Concentration, Skills.Vigor],
			},

			CurseNecro: {
				skills: [Skills.LowerResist, Skills.CorpseExplosion], // its skill, or the other
			},

			Trapsin: {
				skills: [Skills.LightningSentry, Skills.DeathSentry, Skills.ShockField],
			},

			WarCry: {
				skills: [Skills.WarCry, Skills.BattleCommand, Skills.BattleOrders],
			},
		},

		getAttackSequence: function () {
			switch (this.mine) {
				case this.WarCry:
					return this.attackSequences.WarCry;
				case this.CurseNecro:
					return this.attackSequences.CurseNecro;
				case this.Avengerdin:
					return this.attackSequences.Avengerdin;
				case this.Javazon:
					return this.attackSequences.Javazon;
				case this.FireBall:
					return this.attackSequences.FireBall;
				case this.SuperNova:
					return this.attackSequences.SuperNova;
				default:
					return [ // Just plain attack
						Skills.Normal,
						true
					]
			}
		},

	};
	var Communication = {
		vault: {tick: 0},
		events: {
			copydata: function (mode, msg) {
				if (mode !== 0xDEAD && mode !== 0xBEEF && mode !== 0xDEADBEEF) {
					return true;
				}
				var obj = JSON.parse(msg);
				//debug(mode);
				//debug(msg);
				if (obj.who === false || getScript(true).name.toLowerCase().endsWith(obj.who)) {

					switch (mode) {
						case 0xDEADBEEF: // Run if it is directed at me
							if (Communication.runnable.hasOwnProperty(obj.callable)) {
								debug('\xFFc1can\'t run! ' + obj.callable);
							}
							Communication.runnable[obj.callable](obj.arguments);
							break;
						case 0xBEEF: // set value if directed to me
							Communication.vault[obj.key] = obj.value;
							//debug(obj.key + '=' + obj.value);
							break;
					}

				}
				return true;
			}
		},
		runnable: {},
		copyData: function (callable, arg, who) {
			if (who === undefined) {
				// Is it the thread?
				if (getScript(true).name.toLowerCase().endsWith(getCurrentFileName())) {
					who = 'default.dbj';
				} else { // Or anyone else?
					who = getCurrentFileName();
				}
			}
			//debug('sending: ' + callable + ' -- ' + arg);
			sendCopyData(null, me.windowtitle, 0xDEADBEEF, JSON.stringify({
				callable: callable,
				script: getScript(true).name.toLowerCase(),
				who: who,
				arguments: arg
			}));
		},

		setVariable: function (key, value) {
			//debug('setting var');
			sendCopyData(null, me.windowtitle, 0xBEEF, JSON.stringify({
				script: getScript(true).name.toLowerCase(),
				who: false, // false = everyone
				key: key,
				value: value
			}));
		},

		waitFor: function (key, value) {
			while (true) {
				if (this.vault.hasOwnProperty(key)) {
					if (this.vault[key] === value) {
						break;
					}
				}
				delay(5);
			}
			return true;
		}
	};
	var baal = {
		// Go to preattack position
		vault: {currentWave: 0},
		// Do certain stuff like replacing the traps after a wave
		run: function () {
			// Get to throne
			var i;

			// In case we are the teleporter, we need/want speed. Id just in town, its quick
			if (Config.FieldID && !Config.SpeedBaal.Follower) {
				Town.fieldID();
			}

			Town.doChores();

			// Non teling
			if (Config.SpeedBaal.Follower) {
				// Taking portal
				if (me.area < Areas.Harrogath) {
					Town.goToTown(4);

					Town.move("tyrael");

					var npc = getUnit(1, "tyrael");
					if (!npc || !npc.openMenu()) {
						Town.goToTown(5); // Looks like we failed, lets go to act 5 by wp
					} else {
						Misc.useMenu(0x58D2); // Travel to Harrogath
					}

				}
				Town.goToTown(5);
				Town.move("portalspot");

				for (i = 0; i < 30 * 10; i += 1) {
					if (Pather.usePortal(Areas.ThroneOfDestruction, null)) {
						break;
					}

					delay(100);
				}
			} else { // teling
				Pather.useWaypoint(Areas.WorldstoneLvl2);
				Precast.doPrecast();
				Pather.moveToExit([Areas.WorldstoneLvl3, Areas.ThroneOfDestruction], true);
				Pather.moveTo(15078, 5026);
				// Make sure we find a relativily safe spot to cast portal
				Attack.deploy({x: 15078, y: 5026}, 7, 2, 15);
				Pather.makePortal();
			}
			new Line(15070, 5000, 15120, 5000, 0x62, true);
			new Line(15120, 5000, 15120, 5075, 0x62, true);
			new Line(15120, 5075, 15070, 5075, 0x62, true);
			new Line(15070, 5075, 15070, 5000, 0x62, true);

			Attack.clear(0); // Clearing throne
			// Do the waves
			while (this.waves.doWaves()) {
				delay(1);
			}

			this.killBaal();

		},
		killBaal: function () {
			Pather.moveTo(15092, 5011);
			Precast.doPrecast(false); // Not on true, we might have a more powerful barb bo

			while (getUnit(1, 543)) {
				delay(500);
			}
			delay(500);

			var portal = getUnit(2, 563);
			if (portal) {
				Pather.usePortal(null, null, portal);
			} else {
				//debug('\xffc5Error: Portal not found');
				return false;
			}
			// We can assume we are now in the Worldstone Chamber
			if ((me.classid === 1 && me.getSkill(Skills.Teleport, 1)) || me.getStat(97, Skills.Teleport)) {
				// teleport to baal
				Pather.moveTo(15146, 5892);
			} else {
				// walk to baal
				Pather.moveTo(15136, 5943);
			}
			Pather.moveToUnit(getUnit(1, 544));
			Attack.kill(544); // Baal
			Pickit.pickItems();
			delay(me.ping * 2);
			return true;
		},
		waves: {
			moveToPreattack: function () {
				if (this.checkThrone()) {
					return true; // in wave, who cares if we are at the preattack spot
				}
				var spot;
				switch (Builds.mine) {
					case Builds.Javazon:
					case Builds.FireBall:
						spot = {x: 15091, y: 5018}; // they all benifit from standing next to baal, to attack like crazy once the waves come
						break;
					case Builds.Blizzard:
					case Builds.Lighting:
						spot = {x: 15078, y: 5026}; // On the side, left
						break;
					case Builds.WarCry:
					case Builds.SuperNova:
					case Builds.Hammerdin:
						spot = {x: 15093, y: 5029}; // Right in the heart of the wave
						break;
					default:
						spot = {x: 15094, y: 5038};// Just behind the waves, safe distance
				}
				if (getDistance(me, spot) < 5) {
					return true; // Already pretty close, no need to move
				}
				return Pather.moveTo(spot.x, spot.y);
			},
			checkThrone: function () {
				var monster = getUnit(1);
				if (monster) {
					do {
						// Is monster in the throne, or in entrance of throne
						if (Attack.checkMonster(monster)
							&& (
								monster.x > 15070 && monster.x < 15120 // Between the x coords
								&& monster.y > 5000 && monster.y < 5075 // And between the y coords
							)) {
							switch (monster.classid) {
								case 23:
								case 62:
									debug('Detected wave 1');
									return 1;
								case 105:
								case 381:
									debug('Detected wave 2');
									return 2;
								case 557:
									debug('Detected wave 3');
									return 3;
								case 558:
									debug('Detected wave 4');
									return 4;
								case 571:
									debug('Detected wave 5');
									return 5;
								default:
									Attack.clear(0); // Clear the throne
							}
						}
					} while (monster.getNext());
				}
				return false;
			},
			// Spawn all kinds of stuff while we wait for the wave to come
			beforeWaveCasting: function (wave, counter) {
				//Baal.print('timer:'+counter);
				switch (Builds.mine) {

					case Builds.SuperNova:
					case Builds.FireBall:
						if ((counter > 27e2 || counter < -1e3)) {
							return false;
						}

						if (counter > 2000) { // 15091,5027
							return Skill.cast(Skills.Meteor, 0, 15091 + rand(-1, 1), 5027 + rand(-1, 1));
						}
						if (Builds.mine === Builds.SuperNova) {
							return Skill.cast(Skills.Nova, 0, 15094 + rand(-1, 1), 5028 + rand(-1, 1));
						} else {
							return Skill.cast(Skills.FireBall, 0, 15094 + rand(-1, 1), 5028 + rand(-1, 1));
						}

					case Builds.Blizzard:
						if ((counter > 45e2 || counter < -1e3)) {
							return false;
						}
						return Skill.cast(Skills.Blizzard, 0, 15091 + rand(-1, 1), 5027 + rand(-1, 1));

					case Builds.CurseNecro:
						if ((counter > 15e2 || counter < -1e3)) {
							return false;
						}
						return Skill.cast(Skills.LowerResist, 0, 15091, 5027);

					case Builds.Avengerdin:
						Skill.setSkill(Skills.Conviction, 0);
						break;
					case Builds.Hammerdin: // Paladin
						if ((counter > 45e2 || counter < -1e3)) {
							return false;
						}
						Skill.setSkill(Skills.Concentration, 0);
						return Skill.cast(Skills.BlessedHammer, 1);

					case Builds.Javazon:
						if ((counter > 15e2 || counter < -1e3)) {
							return false;
						}
						return Skill.cast(Skills.LightningFury, 0, 15091, 5028);

					case Builds.WarCry:
						if (counter > 2e3 || counter < -1e3) {
							return false;
						}
						Skill.cast(Skills.WarCry, 0); // cast war cry
						Pather.moveTo(15087, 5024);
						Skill.cast(Skills.WarCry, 0); // cast war cry
						Pather.moveTo(15094, 5024);
						return Skill.cast(Skills.WarCry, 0); // cast war cry

					case Builds.Hurricane: // Druid
						switch (wave) {
							case 3:
								// Twister gives a stun, and that prevents hydra's
								return Skill.cast(Skills.Twister, 0, 15091, 5018);
							default:
								return Skill.cast(Skills.Tornado, 0, 15091, 5018);
						}

					case Builds.Trapsin: // Assassin
						// Don't do this 1 second before the wave come, so we can cast cloak of shadow directly
						if (counter > 4e3 || counter < 1e3) {
							return false;
						}
						return Skill.cast(Skills.ShockField);

					case Builds.Lighting:
						if (counter > 2e3 || counter < -1e3) {
							return false;
						}
						return Skill.cast(Skills.ChainLightning, 0, 15091, 5018); // cast chainlighting for max dmg
				}
				return true;
			},
			// Relay traps at wave 5, and so on
			afterWaveChecks: function (wave) {
				// Don't do this after wave 5
				if (wave === 5) {
					return true;
				}
				Precast.doPrecast(false); // Make sure everything is still here

				/*
				ToDo: This broke, need to fix good
				// Check if we need to go to town to heal incase we are psn'ed and have low psn res
				if (me.getState(2) && (me.getStat(45) - 100) < 50) {
					if (!Pather.usePortal(Areas.Harrogath, null)) {
						Pather.makePortal(true);
					}
					Town.initNPC("Heal", "heal"); // Talk to Malah

					if (Config.PacketShopping) { // Only with packet shopping. Otherwise its too fast
						Town.buyPotions(); // Since we are talking with Malah, we might as well buy some pots.
						Town.fillTome(518); // Since we are already in trade with Malah, we can also refill the tp tome
					}

					me.cancel();
					Town.moveToSpot('portal');

					// Go back
					if (!Pather.usePortal(Areas.ThroneOfDestruction, null)) {
						throw new Error('Portal to throne disappeared, wtf?'); // Portal is gone? wtf.
					}

					// Did we take our own portal, if so recast it
					if (!Pather.getPortal(Areas.Harrogath, null)) {
						Pather.makePortal();
					}
				}
				*/
				var i;
				switch (Builds.mine) {
					case Builds.Trapsin:
						// Place traps again
						for (i = 0; i < 4; i += 1) {
							if (i === 2) {
								// Place a death sentry in the middle
								Skill.cast(Skills.DeathSentry, 0, 15090 + (i * 2), 5035);
							} else {
								Skill.cast(Skills.LightningSentry, 0, 15090 + (i * 2), 5035);
							}
						}
						return true;
					// Just a bo barb
					case Builds.WarCry:
						// Give everyone a bo, to avoid stupid people with cta
						debug('precast');
						return Precast.doPrecast(true);
				}
				return false;
			},
			doWaves: function () {
				var wave;
				// This sadly have sometimes some false positives. So move to preattack place and check again
				if (!getUnit(1, 543) && this.moveToPreattack() && !getUnit(1, 543)) {

					debug('Baal\'s gone');
					return false;
				}
				// Check the throne
				wave = this.checkThrone();
				if (!wave) {
					// Get to preattack spot
					this.moveToPreattack();

					// pre attack
					this.beforeWaveCasting(baal.vault.currentWave + 1, 12000 - (getTickCount() - Communication.vault.tick));

					return true;
				}

				// We are in wave:
				baal.vault.currentWave = wave;

				// Clear it
				Attack.clear(wave);

				// On wave 5 we return a false, so we know the waves are done
				return wave !== 5;
			},
		},
	};
	var Overloading = {
		vault: {}, // to store data in
		do: function () { // override them
			var i, j;
			for (i in Overloading.funcs) {
				for (j in Overloading.funcs[i]) {
					debug('Overloading - ' + i + '.' + j);

					// Create vault for overloaded function
					if (typeof Overloading.vault[i] !== Object) {
						Overloading.vault[i] = {};
					}

					// Store original function
					if (typeof Overloading.vault[i][j] !== Function) {
						Overloading.vault[i][j] = global[i][j];
					}

					// Overload the actual function
					global[i][j] = Overloading.funcs[i][j]
				}
			}
		},
		rollback: function () { // rolling them back
			var i, j;
			for (i in Overloading.funcs) {
				for (j in Overloading.funcs[i]) {
					debug('Overloading -- rollback - ' + i + '.' + j);
					global[i][j] = Overloading.vault[i][j]
				}
			}
		},
		funcs: {
			Attack: {
				// Optimized clear function for the throne
				clear: function (wave) {
					var i, result,
						gidAttack = [],
						attackCount = 0,
						monsterList = [],
						target = getUnit(1);

					do {
						if (Attack.checkMonster(target) && Attack.skipCheck(target)) {
							// Baal check, Be sure in throne we only clear *in* the chamber of the throne, not outside it
							/*if (me.area !== Areas.ThroneOfDestruction || ((target.y > 5002 && target.y < 5073
								&& target.x > 15072 && target.x < 15118)
								|| (target.y > 5073 && target.y < 5096
									&& target.x > 15088 && target.x < 15103))) {*/
							if (me.area !== Areas.ThroneOfDestruction
								|| (
									target.x > 15070 && target.x < 15120 // Between the x coords
									&& target.y > 5000 && target.y < 5075 // And between the y coords
								)) {
								monsterList.push(copyUnit(target));
							}
						}
					} while (target.getNext());
					if (wave === undefined) {
						wave = 0;
					}

					monsterList.sort(function (unitA, unitB) {
						return getDistance(me, unitA) - getDistance(me, unitB);
					});

					//Builds.preattack(wave);

					while (monsterList.length > 0 && attackCount < 300) {
						// Did i die? If so revive and pickup corpse
						if (me.dead) {
							var corpse_x = me.x, corpse_y = me.y;
							delay(200 + (me.ping * 2));
							me.revive();
							delay(200 + (me.ping * 2));
							Pather.usePortal(Areas.ThroneOfDestruction, null);
							Pather.moveTo(corpse_x, corpse_y);
							//ToDo: redo this
							if (!Town.getCorpse()) {
								quit(); // failed to pick up corpse, probably cuz we died again. Fuck this, bye
							}
						}

						// resort
						monsterList.sort(function (unitA, unitB) {
							return getDistance(me, unitA) - getDistance(me, unitB);
						});
						target = copyUnit(monsterList[0]);

						// Monster still in reach?
						if (target.x !== undefined && // Only if defined
							!(
								target.x > 15070 && target.x < 15120 // Between the x coords
								&& target.y > 5000 && target.y < 5075 // And between the y coords
							)) {
							monsterList.shift();
							continue; // Next!
						}

						if (!(
							me.x > 15070 && me.x < 15120 // Between the x coords
							&& me.y > 5000 && me.y < 5075 // And between the y coords
						)) {
							Pather.moveTo(15094, 5038);
						}

						if (target.x !== undefined && Attack.checkMonster(target)) {
							// Dodge or get in position
							if (Config.Dodge && me.hp * 100 / me.hpmax <= Config.DodgeHP) {
								Attack.deploy(target, Config.DodgeRange, 5, 9);
							} else {
								Attack.getIntoPosition(target, Skill.getRange(Config.AttackSkill[(target.spectype & 0x7) ? 1 : 3]), 0x4)
							}

							if (wave === 0) {
								// Only during clearing the throne, not during a wave.
								Misc.townCheck(true);
								Pickit.pickItems();
							}

							me.overhead("attacking " + target.name + " spectype " + target.spectype + " id " + target.classid);

							result = ClassAttack.doAttack(target);
							if (result) {
								for (i = 0; i < gidAttack.length; i += 1) {
									if (gidAttack[i].gid === target.gid) {
										break;
									}
								}
								if (i === gidAttack.length) {
									gidAttack.push({gid: target.gid, attacks: 0, name: target.name});
								}

								gidAttack[i].attacks += 1;
								attackCount += 1;

								// Flash with melee skills
								if (gidAttack[i].attacks > 0 && gidAttack[i].attacks % ((target.spectype & 0x7) ? 15 : 5) === 0 && Skill.getRange(Config.AttackSkill[(target.spectype & 0x7) ? 1 : 3]) < 4) {
									Pather.moveTo(me.x + rand(-1, 1) * 5, me.y + rand(-1, 1) * 5);
								}

							} else {
								monsterList.shift();
								Pickit.pickItems();
							}
						} else {
							monsterList.shift();
							Pickit.pickItems();
						}

						// It happens from time to time, the one that teleported chickend and there is no tp to throne anymore,
						// only if we still can find baal's sitting in the throne
						if (!Pather.getPortal(Areas.Harrogath, null) && getUnit(1, 543)) {
							Pather.makePortal(); // Make portal to Harrogath
						}
					}

					ClassAttack.afterAttack();

					// We don't check if we did any attack, since waves can go quick and die before we did any attack
					// Or, now a potion can be dropped and used that was already laying on the floor
					Pickit.pickItems();

					// ToDo: Build in some check for bad psn res chars, they should go to town and heal

					debug('Done killing');
					// Prepare for next wave
					baal.waves.moveToPreattack();
					baal.waves.afterWaveChecks();

					return true;
				},
			}
		}
	};

	// Either run the thread functions, or load the thread
	if (startThread()) {
		return; // We where the thread, returning now
	}

	// If we are teleporting, we want to start fast in new game.
	// Try to avoid NPC visits as much as possible
	if (!Config.SpeedBaal.Follower) {
		addToPickit('[name] == ScrollofTownPortal');
		if (Config.FieldID) {
			addToPickit('[name] == ScrollofIdentify'); // Pick identifying scrolls

		}
	}

	var freespots = 0;
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 10; j++) {
			freespots += Config.Inventory[i][j]
		}
	}
	// Low free spots? Add gold to the pickit line, we might get stuck otherwise
	if (freespots < 8 || Config.FieldID) {
		addToPickit('[name] == gold # [gold] >= 100');
	}

	debug('Starting baal');
	Builds.init();

	Communication.waitFor('threadStarted', true);
	try {
		Overloading.do();
		baal.run();
	} catch (e) {
		throw e;
	} finally {
		Overloading.rollback(); // always roll back functions
	}
}

// enclosed function to detect if we are running as the thread, and not override main() from default.dbj
// If running as thread, start SpeedBaal()m
(function () {

	// Get filename of current stack location
	var basefilename, stack = new Error().stack.match(/[^\r\n]+/g),
		filename = stack[0].substr(stack[0].lastIndexOf('\\') + 1);

	filename = filename.substr(0, filename.indexOf(':'));
	basefilename = filename.substring(0, filename.indexOf('.'));

	print(basefilename);
	// Is this filename, the same as the script name? ifso, we run as a thread
	if (getScript(true).name.toLowerCase().endsWith(filename)) {
		SpeedBaal(); // Start speedbaal
	}
})();