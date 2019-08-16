/**
*	@filename	Mephisto.js
*	@author		kolton, njomnjomnjom
*	@desc		kill Mephisto
*/

function Mephisto(Config) {
	const Attack = require('Attack');
	const Precast = require('Precast');
	const TownPrecast = require('TownPrecast');
	this.killMephisto = function () {
		var i, angle, angles,
			pos = {},
			attackCount = 0,
			meph = getUnit(1, 242);

		if (!meph) {
			throw new Error("Mephisto not found!");
		}

		meph.kill();

		return (meph.mode === 0 || meph.mode === 12);
	};


	TownPrecast();
	Town.doChores();
	Pather.useWaypoint(101);
	Precast();

	if (!Pather.moveToExit(102, true)) {
		throw new Error("Failed to move to Durance Level 3");
	}

	Pather.moveTo(17566, 8069);
	this.killMephisto();
	Pickit.pickItems();

	if (Config.OpenChests) {
		Pather.moveTo(17572, 8011);
		Attack.openChests(5);
		Pather.moveTo(17572, 8125);
		Attack.openChests(5);
		Pather.moveTo(17515, 8061);
		Attack.openChests(5);
	}

	if (Config.Mephisto.TakeRedPortal) {
		Pather.moveTo(17590, 8068);
		delay(1500);
		Pather.moveTo(17601, 8070);
		Pather.usePortal(null);
	}
	return true;
}
