/**
*	@filename	Gamble.js
*	@author		kolton
*	@desc		keep gambling while other players supply you with gold
*/

function Gamble() {
	var gold,
		info = Gambling.getInfo(),
		needGold = false;

	if (!info) {
		throw new Error("Bad Gambling System config.");
	}

	me.maxgametime = 0;
	Town.goToTown(1);

	addEventListener('copydata',
		function (mode, msg) {
			if (needGold && mode === 0 && info.goldFinders.indexOf(msg) > -1) {
				print("Got game request from " + msg);
				sendCopyData(null, msg, 4, me.gamename + "/" + me.gamepassword);
			}
		});

	while (true) {
		if (Town.needGamble()) {
			Town.gamble();
		} else {
			needGold = true;
		}

		Town.move("stash");

		while (needGold) {
			while (true) {
				if (Town.needGamble()) {
					needGold = false;
				}

				Town.stash();

				gold = getUnit(4, 523, 3);

				if (!gold || !Pickit.canPick(gold)) {
					break;
				}

				Pickit.pickItem(gold);
				delay(500);
			}

			delay(500);
		}

		delay(1000);
	}

	return true;
}