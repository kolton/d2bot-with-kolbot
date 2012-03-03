function Eyeback() {
	Town.doChores();
	Pather.useWaypoint(112);
	Precast.doPrecast(true);

	if (!Pather.moveToPreset(111, 1, 784, 0, 0, false, true)) {
		throw new Error("Failed to move to Thresh Socket");
	}

	Attack.clear(15, 0, "Eyeback the Unleashed");

	return true;
}