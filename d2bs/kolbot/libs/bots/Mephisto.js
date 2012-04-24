/**
*	@filename	Mephisto.js
*	@author		kolton
*	@desc		kill Mephisto
*/

function Mephisto() {
	this.killMephisto = function () {
		var i, angle,
			pos = {},
			attackCount = 0,
			meph = getUnit(1, 242);

		if (!meph) {
			throw new Error("Mephisto not found!");
		}

		while (attackCount < 300 && Attack.checkMonster(meph)) {
			if (getUnit(3, 276)) {
				angle = Math.round(Math.atan2(me.y - meph.y, me.x - meph.x) * 180 / Math.PI);

				for (i = 30; i < 360; i += 30) {
					pos.dist = Math.round(getDistance(me, meph));
					pos.x = Math.round((Math.cos((angle + i) * Math.PI / 180)) * pos.dist + meph.x);
					pos.y = Math.round((Math.sin((angle + i) * Math.PI / 180)) * pos.dist + meph.y);

					if (Attack.validSpot(pos.x, pos.y)) {
						Pather.moveTo(pos.x, pos.y);

						break;
					}
				}
			}

			if (ClassAttack.doAttack(meph) < 2) {
				break;
			}

			attackCount += 1;
		}

		return (meph.mode === 0 || meph.mode === 12);
	}

	Town.doChores();
	Pather.useWaypoint(101);
	Precast.doPrecast(true);

	if (!Pather.moveToExit(102, true)) {
		throw new Error("Failed to move to Durance Level 3");
	}

	Pather.moveTo(17566, 8069);

	if (me.classid === 1) {
		this.killMephisto();
	} else {
		Attack.kill(242); // Mephisto
	}

	Pickit.pickItems();
	Pather.moveTo(17590, 8068);
	delay(1500);
	Pather.usePortal(null);

	return true;
}