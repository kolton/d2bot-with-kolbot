function main() {
	include("common/Config.js");
	include("common/Cubing.js");
	include("common/Runewords.js");
	Config.init();

	var party, myPartyId, player, otherParty,
		partyTick = getTickCount(),
		mode = 0; // mode: 0 = invite, 1+ = accept

	// Determine mode. Someone else already in game = accept, empty game = invite
	party = getParty();

	if (party) {
		do {
			if (party.name !== me.name) { // Check for other players
				mode += 1;
			}
		} while (party.getNext());
	}

	print("ÿc2Party thread loaded. Mode: " + (mode >= 1 ? "Accept" : "Invite"));

	// Main loop
	while (true) {
		if (Config.PublicMode) {
			player = getParty();

			if (player) {
				myPartyId = player.partyid;

				while (player.getNext()) {
					if (mode === 0) {
						if (player.partyflag !== 4 && player.partyid === 65535) {
							clickParty(player, 2);
							delay(100);
						}
					} else {
						if (player.partyid !== 65535 && player.partyid !== myPartyId) {
							otherParty = player.partyid;
						}

						if (((player.partyflag !== 4 && (!otherParty || myPartyId === otherParty) && (getTickCount() - partyTick >= (mode + 1) * 2000)) || (player.partyflag === 2 && (!otherParty || player.partyid === otherParty) && (getTickCount() - partyTick >= 2000)))) {
							clickParty(player, 2);
							delay(100);
						}
					}
				}
			}
		}

		delay(500);
	}
}