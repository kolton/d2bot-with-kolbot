function DiabloHelper() {
	// sort functions
	this.entranceSort = function (a, b) {
		return getDistance(a.x, a.y, 7790, 5544) - getDistance(b.x, b.y, 7790, 5544);
	};

	this.starSort = function (a, b) {
		return getDistance(a.x, a.y, 7774, 5305) - getDistance(b.x, b.y, 7774, 5305);
	};

	// general functions
	this.getLayout = function (seal, value) {
		var sealPreset = getPresetUnit(108, 2, seal);

		if (!seal) {
			throw new Error("Seal preset not found. Can't continue.");
		}

		if (sealPreset.roomy * 5 + sealPreset.y === value || sealPreset.roomx * 5 + sealPreset.x === value) {
			return 1;
		}

		return 2;
	};

	this.initLayout = function () {
		this.vizLayout = this.getLayout(396, 5275);
		this.seisLayout = this.getLayout(394, 7773);
		this.infLayout = this.getLayout(392, 7893);
	};

	this.getBoss = function (name) {
		var i, boss, glow;

		while (true) {
			glow = getUnit(2, 131);

			if (glow) {
				break;
			}

			delay(500);
		}

		for (i = 0; i < name === "infector of souls" ? 20 : 8; i += 1) {
			boss = getUnit(1, name);

			if (boss) {
				return Attack.clear(40, 0, name);
			}

			delay(250);
		}

		return !!glow;
	};

	this.vizierSeal = function () {
		this.followPath(this.vizLayout === 1 ? this.starToVizA : this.starToVizB, this.starSort);
		this.vizLayout === 1 ? Pather.moveTo(7691, 5292) : Pather.moveTo(7695, 5316);

		if (!this.getBoss("grand vizier of chaos")) {
			throw new Error("Failed to kill Vizier");
		}

		return true;
	};

	this.seisSeal = function () {
		this.followPath(this.seisLayout === 1 ? this.starToSeisA : this.starToSeisB, this.starSort);
		this.seisLayout === 1 ? Pather.moveTo(7790, 5200) : Pather.moveTo(7798, 5186);

		if (!this.getBoss("lord de seis")) {
			throw new Error("Failed to kill de Seis");
		}

		return true;
	};

	this.infectorSeal = function () {
		this.followPath(this.infLayout === 1 ? this.starToInfA : this.starToInfB, this.starSort);
		this.infLayout === 1 ? Pather.moveTo(7908, 5269) : Pather.moveTo(7932, 5305);

		if (!this.getBoss("infector of souls")) {
			throw new Error("Failed to kill Infector");
		}

		return true;
	};

	this.diabloPrep = function () {
		var i,
			tick = getTickCount();

		while (getTickCount() - tick < 17500) {
			if (getTickCount() - tick >= 8000) {
				switch (me.classid) {
				case 1: // Sorceress
					if ([56, 59, 64].indexOf(Config.AttackSkill[1])) {
						if (me.getState(121)) {
							delay(500);
						} else {
							Skill.cast(Config.AttackSkill[1], 0, 7793, 5293);
						}
					}

					break;
				case 3: // Paladin
					Skill.setSkill(Config.AttackSkill[2]);
					Skill.cast(Config.AttackSkill[1], 1);
					break;
				default:
					delay(500);
				}
			} else {
				delay(500);
			}

			if (getUnit(1, 243)) {
				return true;
			}
		}

		throw new Error("Diablo not found");
	};

	this.followPath = function (path, sortfunc) {
		var i;

		for (i = 0; i < path.length; i += 2) {
			Pather.moveTo(path[i], path[i + 1]);
			Attack.clear(30, 0, false, sortfunc);
		}
	};

	// path coordinates
	this.entranceToStar = [7794, 5517, 7791, 5491, 7768, 5459, 7775, 5424, 7817, 5458, 7777, 5408, 7769, 5379, 7777, 5357, 7809, 5359, 7805, 5330, 7780, 5317, 7774, 5305];
	this.starToVizA = [7759, 5295, 7734, 5295, 7716, 5295, 7718, 5276, 7697, 5292, 7678, 5293, 7665, 5276, 7662, 5314];
	this.starToVizB = [7759, 5295, 7734, 5295, 7716, 5295, 7701, 5315, 7666, 5313, 7653, 5284];
	this.starToSeisA = [7781, 5259, 7805, 5258, 7802, 5237, 7776, 5228, 7775, 5205, 7804, 5193, 7814, 5169, 7788, 5153];
	this.starToSeisB = [7781, 5259, 7805, 5258, 7802, 5237, 7776, 5228, 7811, 5218, 7807, 5194, 7779, 5193, 7774, 5160, 7803, 5154];
	this.starToInfA = [7809, 5268, 7834, 5306, 7852, 5280, 7852, 5310, 7869, 5294, 7895, 5295, 7919, 5290];
	this.starToInfB = [7809, 5268, 7834, 5306, 7852, 5280, 7852, 5310, 7869, 5294, 7895, 5274, 7927, 5275, 7932, 5297, 7923, 5313];

	var i;
	
	// start
	Town.doChores();
	Pather.useWaypoint(107);
	Precast.doPrecast(true);
	Pather.useWaypoint(103);
	Town.move("portalspot");

	for (i = 0; i < 120; i += 1) {
		if (Pather.usePortal(108, null)) {
			break;
		}

		delay(1000);
	}

	if (i === 120) {
		throw new Error("No portals to Chaos");
	}

	this.initLayout();

	if (Config.DiabloHelper.Entrance) {
		Attack.clear(35, 0, false, this.entranceSort);
		Pather.moveTo(7790, 5544);
		Precast.doPrecast(true);
		this.followPath(this.entranceToStar, this.entranceSort);
	} else {
		Pather.moveTo(7774, 5305);
		Attack.clear(35, 0, false, this.starSort);
	}

	Pather.moveTo(7774, 5305);
	Attack.clear(35, 0, false, this.starSort);
	this.vizierSeal();
	this.seisSeal();
	Precast.doPrecast(true);
	this.infectorSeal();
	Pather.moveTo(7788, 5292);
	this.diabloPrep();
	Attack.kill("diablo");
	Pickit.pickItems();

	return true;
}