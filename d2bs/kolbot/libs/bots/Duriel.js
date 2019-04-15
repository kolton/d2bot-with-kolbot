/**
*	@filename	Duriel.js
*	@author		kolton
*	@desc		kill Duriel
*/

function Duriel () {
	this.killDuriel = function () {
		var i, target;

		for (i = 0; i < 3; i += 1) {
			target = getUnit(1, 211);

			if (target) {
				break;
			}

			delay(500);
		}

		if (!target) {
			throw new Error("Duriel not found.");
		}

		if (Config.MFLeader) {
			Pather.makePortal();
			say("kill " + 211);
		}

		for (i = 0; i < 300; i += 1) {
			ClassAttack.doAttack(target);

			if (target.dead) {
				return true;
			}

			if (getDistance(me, target) <= 10) {
				Pather.moveTo(22638, me.y < target.y ? 15722 : 15693);
			}
		}

		return target.dead;
	};

	var i, unit;

	if (me.area !== 46) {
		Town.doChores();
		Pather.useWaypoint(46);
	}

	Precast.doPrecast(true);

	if (!Pather.moveToExit(getRoom().correcttomb, true)) {
		throw new Error("Failed to move to Tal Rasha's Tomb");
	}

	if (!Pather.moveToPreset(me.area, 2, 152, -11, 3)) {
		throw new Error("Failed to move to Orifice");
	}

	for (i = 0; i < 10; i += 1) {
		if (getUnit(2, 100)) {
			break;
		}

		delay(500);
	}

	if (me.gametype === 1 && me.classid !== 1) {
		Attack.clear(5);
	}

	unit = getUnit(2, 100);

	if (unit) {
		for (i = 0; i < 3; i += 1) {
			if (me.area === unit.area) {
				Skill.cast(43, 0, unit);
			}

			if (me.area === 73) {
				break;
			}
		}
	}

	if (me.area !== 73 && !Pather.useUnit(2, 100, 73)) {
		Attack.clear(10);
		Pather.useUnit(2, 100, 73);
	}

	if (me.area !== 73) {
		throw new Error("Failed to move to Duriel");
	}

	if (me.classid === 1 && me.gametype === 0) {
		this.killDuriel();
	} else {
		Attack.kill(211); // Duriel
	}

	Pickit.pickItems();

	return true;
}
