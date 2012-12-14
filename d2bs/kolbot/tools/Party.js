/**
*	@filename	Party.js
*	@author		kolton
*	@desc		handle party procedure ingame
*/

function main() {
	include("OOG.js");
	include("json2.js");
	include("common/Config.js");
	include("common/Cubing.js");
	include("common/Runewords.js");
	include("common/Misc.js");
	Config.init();

	var myPartyId, player, otherParty, shitList,
		partyTick = getTickCount();

	print("ÿc2Party thread loaded. Mode: " + (Config.PublicMode > 1 ? "Accept" : "Invite"));

	if (Config.ShitList) {
		shitList = ShitList.read();

		print(shitList.length + " entries in shit list.");
	}

	// Main loop
	while (true) {
		player = getParty();

		if (player) {
			myPartyId = player.partyid;

			while (player.getNext()) {
				switch (Config.PublicMode) {
				case 1:
					if (getPlayerFlag(me.gid, player.gid, 8)) {
						if (Config.ShitList && shitList.indexOf(player.name) === -1) {
							say(player.name + " has been shitlisted.");
							shitList.push(player.name);
							ShitList.add(player.name);
						}

						if (player.partyflag === 4) {
							clickParty(player, 2); // cancel invitation
							delay(100);
						}

						break;
					}

					if (Config.ShitList && shitList.indexOf(player.name) > -1) {
						break;
					}

					if (player.partyflag !== 4 && player.partyid === 65535) {
						clickParty(player, 2);
						delay(100);
					}

					break;
				case 2:
					/*if (myPartyId !== 65535) {
						return;
					}*/

					if (player.partyid !== 65535 && player.partyid !== myPartyId) {
						otherParty = player.partyid;
					}

					if (player.partyflag === 2 && (!otherParty || player.partyid === otherParty) && (getTickCount() - partyTick >= 2000)) {
						clickParty(player, 2);
						delay(100);
					}

					break;
				}
			}
		}

		delay(500);
	}
}