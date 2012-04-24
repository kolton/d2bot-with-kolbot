/**
*	@filename	Enchant.js
*	@author		kolton
*	@desc		Enchant other players on command
*/

function Enchant() {
	Town.doChores();
	Pather.useWaypoint(35);
	Pather.makePortal(false);

	var chant;
	
	function ChatEvent(nick, msg) {
		if (msg === Config.Enchant.Trigger) {
			chant = true;
		}
	}

	addEventListener("chatmsg", ChatEvent);

	while (true) {
		if (chant) {
			var player = getUnit(0);

			do {
				if (player.name !== me.name && getDistance(me, player) <= 20) {
					Skill.cast(52, 0, player);
					delay(200);
				}
			} while (player.getNext());

			chant = false;
		}

		if (getTickCount() - me.gamestarttime >= Config.Enchant.GameLength * 1e6) {
			say("Next Game!");

			break;
		}

		delay(500);
	}

	return true;
}