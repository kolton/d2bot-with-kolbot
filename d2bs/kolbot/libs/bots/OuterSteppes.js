function OuterSteppes() {
	Town.goToTown(4);
	Town.doChores();

	if (!Pather.moveToExit(104, true)) {
		throw new Error("Failed to move to Outer Steppes");
	}

	Precast.doPrecast(true);
	Attack.clearLevel(Config.ClearType);

	return true;
}