function BoneAsh() {
	Town.doChores();
	Pather.useWaypoint(32);
	Precast.doPrecast(true);

	if (!Pather.moveTo(20047, 4898)) {
		throw new Error("Failed to move to Bone Ash");
	}

	Attack.kill("bone ash");
	Pickit.pickItems();

	return true;
}