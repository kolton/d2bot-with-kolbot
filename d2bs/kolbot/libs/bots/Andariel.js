/**
*	@filename	Andariel.js
*	@author		kolton
*	@desc		kill Andariel
*/

function Andariel () {
	this.killAndariel = function () {
		var i,
			target = getUnit(1, 156);

		if (!target) {
			throw new Error("Andariel not found.");
		}

		if (Config.MFLeader) {
			Pather.makePortal();
			say("kill " + 156);
		}

		for (i = 0; i < 300; i += 1) {
			ClassAttack.doAttack(target);

			if (target.dead) {
				return true;
			}

			if (getDistance(me, target) <= 10) {
				Pather.moveTo(me.x > 22548 ? 22535 : 22560, 9520);
			}
		}

		return target.dead;
	};

	Town.doChores();
	Pather.useWaypoint(35);
	Precast.doPrecast(true);

	if (!Pather.moveToExit([36, 37], true)) {
		throw new Error("Failed to move to Catacombs Level 4");
	}

	Pather.moveTo(22549, 9520);

	if (me.classid === 1 && me.gametype === 0) {
		this.killAndariel();
	} else {
		Attack.kill(156); // Andariel
	}

	delay(2000); // Wait for minions to die.
	Pickit.pickItems();

	return true;
}
