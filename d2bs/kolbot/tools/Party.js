function main() {
	include("common/Config.js");
	include("common/Cubing.js");
	include("common/Runewords.js");
	Config.init();

	var myPartyId, player, otherParty,
		partyTick = getTickCount();

	print("ÿc2Party thread loaded. Mode: " + (Config.PublicMode > 1 ? "Accept" : "Invite"));

	// Main loop
	while (true) {
		player = getParty();

		if (player) {
			myPartyId = player.partyid;

			while (player.getNext()) {
				if (Config.PublicMode === 1) {
					if (player.partyflag !== 4 && player.partyid === 65535) {
						clickParty(player, 2);
						delay(100);
					}
				} else {
					if (player.partyid !== 65535 && player.partyid !== myPartyId) {
						otherParty = player.partyid;
					}

					if (player.partyflag === 2 && (!otherParty || player.partyid === otherParty) && (getTickCount() - partyTick >= 2000)) {
						clickParty(player, 2);
						delay(100);
					}
				}
			}
		}

		delay(500);
	}
}