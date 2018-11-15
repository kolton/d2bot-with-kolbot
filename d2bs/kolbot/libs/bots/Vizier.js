/**
*	@filename	Vizier.js
*	@author		kolton
*	@desc		kill Grand Vizier of Chaos
*/

function Vizier() {
	var i, tick, seal;

	this.openSeal = function (id) {
		Pather.moveToPreset(108, 2, id, 4);

		seal = getUnit(2, id);

		if (seal) {
			for (i = 0; i < 3; i += 1) {
				seal.interact();

				tick = getTickCount();

				while (getTickCount() - tick < 500) {
					if (seal.mode) {
						return true;
					}

					delay(10);
				}
			}
		}

		return false;
	};

	Town.doChores();
	Pather.useWaypoint(107);
	Precast.doPrecast(true);

	if (!this.openSeal(396) || !this.openSeal(395)) {
		throw new Error("Failed to open seals");
	}

	Pather.moveToPreset(108, 2, 396, 4);

	for (i = 0; i < 10; i += 1) {
		if (getUnit(1, getLocaleString(2851))) {
			break;
		}

		delay(250);
	}

	Attack.kill(getLocaleString(2851)); // Grand Vizier of Chaos
	Pickit.pickItems();

	return true;
}