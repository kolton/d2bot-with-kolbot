if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function OuterSteppes() {
	Town.goToTown(4);
	Town.doChores();

    if (!Pather.moveToExit(Areas.Act4.Outer_Steppes, true)) {
		throw new Error("Failed to move to Outer Steppes");
	}

	Precast.doPrecast(true);
	Attack.clearLevel(Config.ClearType);

	return true;
}