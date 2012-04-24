/**
*	@filename	Gamble.js
*	@author		kolton
*	@desc		keep gambling while other players supply you with gold
*/

function Gamble() {
	var gold,
		needGold = false;

	me.maxgametime = 0;
	Town.goToTown(1);

	addEventListener('copydata',
		function (mode, msg) {
			if (needGold && mode === 0 && Gambling.goldFinders.indexOf(msg) > -1) {
				print("got game request from " + msg);
				sendCopyData(null, msg, 4, me.gamename + "/" + me.gamepassword);
			}
		}
		);

	while (true) {
		if (Town.needGamble()) {
			Town.gamble();
		} else {
			needGold = true;
		}

		Town.move("stash");

		while (needGold) {
			while (true) {
				gold = getUnit(4, 523, 3);

				if (!gold) {
					break;
				}

				Pickit.pickItem(gold);
				Town.stash();
				delay(500);

				if (Town.needGamble()) {
					needGold = false;
				}
			}
			
			delay(500);
		}

		delay(1000);
	}

	return true;
}