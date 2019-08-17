function OuterSteppes(Config, Attack) {
	Town.doChores();

	if (!Pather.journeyTo(104)) {
		throw new Error("Failed to move to Outer Steppes");
	}

	Attack.clearLevel(Config.ClearType);

	return true;
}