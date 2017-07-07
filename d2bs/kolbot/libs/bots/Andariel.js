/**
*	@filename	Andariel.js
*	@author		kolton
*	@desc		kill Andariel
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Andariel() {
	this.killAndariel = function () {
		var i,
            target = getUnit(UnitType.NPC, UnitClassID.andariel);

		if (!target) {
			throw new Error("Andariel not found.");
		}

		if (Config.MFLeader) {
			Pather.makePortal();
            say("kill " + UnitClassID.andariel);
		}

		for (i = 0; i < 300; i += 1) {
			ClassAttack.doCast(target, Config.AttackSkill[1], Config.AttackSkill[2]);

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
    Pather.useWaypoint(Areas.Act1.Catacombs_Level_2);
	Precast.doPrecast(true);

    if (!Pather.moveToExit([Areas.Act1.Catacombs_Level_3, Areas.Act1.Catacombs_Level_4], true)) {
		throw new Error("Failed to move to Catacombs Level 4");
	}

	Pather.moveTo(22549, 9520);

    if (me.classid === ClassID.Sorceress && me.gametype === GameType.Classic) {
		this.killAndariel();
	} else {
        Attack.kill(UnitClassID.andariel); // Andariel
	}

	delay(2000); // Wait for minions to die.
	Pickit.pickItems();

	return true;
}