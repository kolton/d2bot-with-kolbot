/**
*	@filename	Vizier.js
*	@author		kolton
*	@desc		kill Grand Vizier of Chaos
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Vizier() {
	var i, tick, seal;
	
	this.openSeal = function (id) {
        Pather.moveToPreset(Areas.Act4.Chaos_Sanctuary, UnitType.Object, id, 4);

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
    Pather.useWaypoint(Areas.Act4.River_Of_Flame);
	Precast.doPrecast(true);

    if (!this.openSeal(UniqueObjectIds.Diablo_Seal5) || !this.openSeal(UniqueObjectIds.Diablo_Seal4)) {
		throw new Error("Failed to open seals");
	}

    Pather.moveToPreset(Areas.Act4.Chaos_Sanctuary, UnitType.Object, UniqueObjectIds.Diablo_Seal5, ObjectModes.Special2);

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