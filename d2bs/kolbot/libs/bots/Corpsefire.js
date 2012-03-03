function Corpsefire() {
	Town.doChores();
	Pather.useWaypoint(3);
	Precast.doPrecast(true);

	if (!Pather.moveToExit([2, 8], true) || !Pather.moveToPreset(me.area, 1, 774, 0, 0, false, true)) {
		throw new Error("Failed to move to Corpsefire");
	}

	Attack.clear(15, 0, "corpsefire");

	if (Config.Corpsefire.ClearDen) {
		Attack.clearLevel();
	}

	return true;
}