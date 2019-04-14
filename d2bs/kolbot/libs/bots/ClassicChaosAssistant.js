/**
 *	@filename	ClassicChaosAssistant.js
 *	@author		YGM
 *	@desc		Assistant to help sorcs in public chaos runs games on classic.
 */
function Idle() {

	var stargo, infgo, seisgo, vizgo, infseal, seisseal, vizseal, diablopickup, normalpickup = false, i, tick, seal, boss, n, target, positions, trapCheck;

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

	this.openSeal = function (id) {
		Pather.moveToPreset(108, 2, id, id === 394 ? 5 : 2, id === 394 ? 5 : 0);

		seal = getUnit(2, id);

		if (seal) {
			for (i = 0; i < 3; i += 1) {

				if (id === 394) {
					Misc.click(0, 0, seal);
				} else {
					seal.interact();
				}

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

	addEventListener("keyup",

	function (key) {
		if (key === 97) { // Numpad 1
			stargo = true;
		}
		if (key === 98) { // Numpad 2
			infgo = true;
		}
		if (key === 99) { // Numpad 3
			infseal = true;
		}
		if (key === 100) { // Numpad 4
			seisgo = true;
		}
		if (key === 101) { // Numpad 5 (YOU MUST DISABLE KOLTONS MULETRIGGER!)
			seisseal = true;
		}
		if (key === 102) { // Numpad 6
			vizgo = true;
		}
		if (key === 103) { // Numpad 7
			vizseal = true;
		}
		if (key === 104) { // Numpad 8 (Open last seal, teleport to star and pickup for 30 seconds)
			diablopickup = true;
		}
		if (key === 105) { // Numpad 9 (Pickup at current location)
			normalpickup = true;
		}
	});

	while (true) {
		if (stargo) {
			switch (me.area) {
				case 107:
					Precast.doPrecast(true);
					Pather.moveToPreset(108, 2, 255);
					this.initLayout();
					break;
			}
			stargo = false;
		}

		if (infgo) {
			switch (me.area) {
				case 108:
					if (this.infLayout === 1) {
						Pather.moveTo(7893, 5306);
					} else {
						Pather.moveTo(7929, 5294);
					}
					Pather.makePortal();
					say("Infector of Souls TP Up!");
					break;
			}
			infgo = false;
		}

		if (seisgo) {
			switch (me.area) {
				case 108:
					if (this.seisLayout === 1) {
						Pather.moveTo(7773, 5191);
					} else {
						Pather.moveTo(7794, 5189);
					}
					Pather.makePortal();
					say("Lord De Seis TP Up!");
					break;
			}
			seisgo = false;
		}

		if (vizgo) {
			switch (me.area) {
				case 108:
					if (this.vizLayout === 1) {
						Pather.moveTo(7681, 5302);
					} else {
						Pather.moveTo(7675, 5305);
					}
					Pather.makePortal();
					say("Grand Vizier of Chaos TP Up!");
					break;
			}
			vizgo = false;
		}

		if (infseal) {
			switch (me.area) {
				case 108:
					this.openSeal(393)
					this.openSeal(392)
					say("Infector of Souls spawned!");
					if (this.infLayout === 1) {
						Pather.moveTo(7893, 5306);
					} else {
						Pather.moveTo(7929, 5294);
					}
					break;
			}
			infseal = false;
		}

		if (seisseal) {
			switch (me.area) {
				case 108:
					this.openSeal(394)
					say("Lord De Seis spawned!");
					if (this.seisLayout === 1) {
						Pather.moveTo(7773, 5191);
					} else {
						Pather.moveTo(7794, 5189);
					}
					break;
			}
			seisseal = false;
		}

		if (vizseal) {
			switch (me.area) {
				case 108:
					this.openSeal(396)
					say("Grand Vizier of Chaos spawned!");
					if (this.vizLayout === 1) {
						Pather.moveTo(7681, 5302);
					} else {
						Pather.moveTo(7675, 5305);
					}
					break;
			}
			vizseal = false;
		}

		if (diablopickup) {
			switch (me.area) {
				case 108:
					this.openSeal(395)
					Pather.moveToPreset(108, 2, 255);
					for (i = 0; i < 300; i += 1) {
						Pickit.pickItems();
						delay(100);
					}
					break;
			}
			diablopickup = false;
		}

		if (normalpickup) {
			switch (me.area) {
				case 108:
					Pickit.pickItems();
					break;
			}
			normalpickup = false;
		}

		delay(10);
	}

}