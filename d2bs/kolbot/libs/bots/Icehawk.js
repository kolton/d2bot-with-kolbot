function Icehawk() {
	Town.doChores();
	Pather.useWaypoint(80);
	Precast.doPrecast(true);

	if (!Pather.moveToExit([92, 93], false)) {
		throw new Error("Failed to move to Icehawk");
	}

	Attack.clear(15, 0, "Icehawk Riftwing");

	return true;
}