/**
*	@filename	FastDiablo.js
*	@author		kolton
*	@desc		kill seal bosses and Diablo
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function FastDiablo() {
	this.getLayout = function (seal, value) {
        var sealPreset = getPresetUnit(Areas.Act4.Chaos_Sanctuary, UnitType.Object, seal);

		if (!seal) {
			throw new Error("Seal preset not found");
		}

		if (sealPreset.roomy * 5 + sealPreset.y === value || sealPreset.roomx * 5 + sealPreset.x === value) {
			return 1;
		}

		return 2;
	};

	this.initLayout = function () {
        this.vizLayout = this.getLayout(UniqueObjectIds.Diablo_Seal5, 5275);
        this.seisLayout = this.getLayout(UniqueObjectIds.Diablo_Seal3, 7773);
        this.infLayout = this.getLayout(UniqueObjectIds.Diablo_Seal1, 7893);
	};

	this.getBoss = function (name) {
		var i, boss,
            glow = getUnit(UnitType.Object, UniqueObjectIds.Vile_Dog_Afterglow);

		for (i = 0; i < 24; i += 1) {
			boss = getUnit(1, name);

			if (boss) {
				this.chaosPreattack(name, 8);

				try {
					Attack.kill(name);
				} catch (e) {
					Attack.clear(10, 0, name);
				}

				Pickit.pickItems();

				return true;
			}

			delay(250);
		}

		return !!glow;
	};

	this.chaosPreattack = function (name, amount) {
		var i, n, target, positions;

        switch (me.classid) {
            case ClassID.Amazon:
                break;
            case ClassID.Sorceress:
                break;
            case ClassID.Necromancer:
                break;
            case ClassID.Paladin:
                target = getUnit(UnitType.NPC, name);

                if (!target) {
                    return;
                }

                positions = [[6, 11], [0, 8], [8, -1], [-9, 2], [0, -11], [8, -8]];

                for (i = 0; i < positions.length; i += 1) {
                    if (Attack.validSpot(target.x + positions[i][0], target.y + positions[i][1])) { // check if we can move there
                        Pather.moveTo(target.x + positions[i][0], target.y + positions[i][1]);
                        Skill.setSkill(Config.AttackSkill[2], 0);

                        for (n = 0; n < amount; n += 1) {
                            Skill.cast(Config.AttackSkill[1], 1);
                        }

                        break;
                    }
                }

                break;
            case ClassID.Barbarian:
                break;
            case ClassID.Druid:
                break;
            case ClassID.Assassin:
                break;
        }
	};

	this.diabloPrep = function () {
		var trapCheck,
			tick = getTickCount();

		while (getTickCount() - tick < 20000) {
			if (getTickCount() - tick >= 8000) {
                switch (me.classid) {
                    case ClassID.Sorceress: // Sorceress
                        if ([Skills.Sorceress.Meteor, Skills.Sorceress.Blizzard, Skills.Sorceress.Frozen_Orb].indexOf(Config.AttackSkill[1]) > -1) {
                            if (me.getState(States.SKILLDELAY)) {
                                delay(500);
                            } else {
                                Skill.cast(Config.AttackSkill[1], 0, 7793, 5293);
                            }

                            break;
                        }

                        delay(500);

                        break;
                    case ClassID.Paladin: // Paladin
                        Skill.setSkill(Config.AttackSkill[2]);
                        Skill.cast(Config.AttackSkill[1], 1);

                        break;
                    case ClassID.Druid: // Druid
                        if (Config.AttackSkill[1] === Skills.Druid.Tornado) {
                            Skill.cast(Config.AttackSkill[1], 0, 7793, 5293);

                            break;
                        }

                        delay(500);

                        break;
                    case ClassID.Assassin: // Assassin
                        if (Config.UseTraps) {
                            trapCheck = ClassAttack.checkTraps({ x: 7793, y: 5293 });

                            if (trapCheck) {
                                ClassAttack.placeTraps({ x: 7793, y: 5293, classid: UnitClassID.diablo }, trapCheck);

                                break;
                            }
                        }

                        delay(500);

                        break;
                    default:
                        delay(500);
                }
			} else {
				delay(500);
			}

            if (getUnit(UnitType.NPC, UnitClassID.diablo)) {
				return true;
			}
		}

		throw new Error("Diablo not found");
	};

	this.openSeal = function (classid) {
		var i, j, seal;

		for (i = 0; i < 5; i += 1) {
            Pather.moveToPreset(Areas.Act4.Chaos_Sanctuary, UnitType.Object, classid, classid === UniqueObjectIds.Diablo_Seal3 ? 5 : 2, classid === UniqueObjectIds.Diablo_Seal3 ? 5 : 0);

			if (i > 1) {
				Attack.clear(10);
			}

			for (j = 0; j < 3; j += 1) {
                seal = getUnit(UnitType.Object, classid);

				if (seal) {
					break;
				}

				delay(100);
			}

			if (!seal) {
				throw new Error("Seal not found (id " + classid + ")");
			}

			if (seal.mode) {
				return true;
			}

			sendPacket(1, 0x13, 4, 0x2, 4, seal.gid);
            delay(classid === UniqueObjectIds.Diablo_Seal3 ? 1000 : 500);

			if (!seal.mode) {
                if (classid === UniqueObjectIds.Diablo_Seal3 && Attack.validSpot(seal.x + 15, seal.y)) { // de seis optimization
					Pather.moveTo(seal.x + 15, seal.y);
				} else {
					Pather.moveTo(seal.x - 5, seal.y - 5);
				}

				delay(500);
			} else {
				return true;
			}
		}

		throw new Error("Failed to open seal (id " + classid + ")");
	};

	Town.doChores();
    Pather.useWaypoint(Areas.Act4.River_Of_Flame);
	Precast.doPrecast(true);
	this.initLayout();
    this.openSeal(UniqueObjectIds.Diablo_Seal4);
    this.openSeal(UniqueObjectIds.Diablo_Seal5);

	if (this.vizLayout === 1) {
		Pather.moveTo(7691, 5292);
	} else {
		Pather.moveTo(7695, 5316);
	}

	if (!this.getBoss(getLocaleString(2851))) {
		throw new Error("Failed to kill Vizier");
	}

    this.openSeal(UniqueObjectIds.Diablo_Seal3);

	if (this.seisLayout === 1) {
		Pather.moveTo(7771, 5196);
	} else {
		Pather.moveTo(7798, 5186);
	}

	if (!this.getBoss(getLocaleString(2852))) {
		throw new Error("Failed to kill de Seis");
	}

    this.openSeal(UniqueObjectIds.Diablo_Seal1);
    this.openSeal(UniqueObjectIds.Diablo_Seal2);

	if (this.infLayout === 1) {
		delay(1);
	} else {
		Pather.moveTo(7928, 5295); // temp
	}

	if (!this.getBoss(getLocaleString(2853))) {
		throw new Error("Failed to kill Infector");
	}

	Pather.moveTo(7788, 5292);
	this.diabloPrep();
    Attack.kill(UnitClassID.diablo); // Diablo
	Pickit.pickItems();

	return true;
}