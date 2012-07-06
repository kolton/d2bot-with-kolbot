/**
*	@filename	Andariel.js
*	@author		kolton
*	@desc		kill Andariel
*/

function Andariel() {
	this.killAndariel = function () {
		var i,
			target = getUnit(1, 156);

		if (!target) {
			throw new Error("Andariel not found.");
		}

		for (i = 0; i < 300; i += 1) {
			if (!me.getState(121)) {
				Skill.cast(Config.AttackSkill[1], ClassAttack.skillHand[1], target);
			} else {
				if (Config.AttackSkill[2] > -1) {
					Skill.cast(Config.AttackSkill[2], ClassAttack.skillHand[2], target);
				} else {
					delay(300);
				}
			}

			if (target.mode === 0 || target.mode === 12) {
				return true;
			}

			if (getDistance(me, target) <= 10) {
				Pather.moveTo(me.x > 22548 ? 22535 : 22560, 9520);
			}
		}

		return target.mode === 0 || target.mode === 12;
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