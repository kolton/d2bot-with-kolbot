function MFHelper() {
	var player, playerAct, split,
		oldCommand = "",
		command = "";

	function ChatEvent(who, msg) {
		command = msg;
	}
	
	this.findPlayer = function () {
		var party = getParty();

		if (party) {
			do {
				if (party.name !== me.name && !party.inTown) {
					return party;
				}
			} while (party.getNext());
		}

		return false;
	};

	this.getPlayerAct = function (player) {
		switch (true) {
		case player.area > 0 && player.area <= 39:
			return 1;
		case player.area >= 40 && player.area <= 74:
			return 2;
		case player.area >= 75 && player.area <= 102:
			return 3;
		case player.area >= 103 && player.area <= 108:
			return 4;
		case player.area >= 109:
			return 5;
		}

		return false;
	};

	addEventListener("chatmsg", ChatEvent);
	Town.doChores();
	Town.move("portalspot");

MainLoop:
	while (true) {
		if (!player) {
			player = this.findPlayer();
		}

		if (player) {
			playerAct = this.getPlayerAct(player);
		
			if (playerAct && playerAct !== me.act) {
				Town.goToTown(this.getPlayerAct(player));
				Town.move("portalspot");
			}
		}

		if (command !== oldCommand) {
			oldCommand = command;

			switch (true) {
			case command.indexOf("kill") > -1:
				print("Received command: kill");

				split = command.split("kill ")[1];
				
				Pather.usePortal(player.area, player.name);
				Precast.doPrecast(false);

				try {
					if (!!parseInt(split, 10)) {
						split = parseInt(split, 10);
					}

					Attack.kill(split);
					Pickit.pickItems();
				} catch (killerror) {
					print(killerror);
				}

				if (!me.inTown && !Pather.usePortal(null, player.name)) {
					Town.goToTown();
				}

				break;
			case command.indexOf("clearlevel") > -1:
				print("Received command: clearlevel");
				Pather.usePortal(player.area, player.name);
				Precast.doPrecast(false);
				Attack.clearLevel(Config.ClearType);

				if (!Pather.usePortal(null, player.name)) {
					Town.goToTown();
				}

				break;
			case command.indexOf("clear") > -1:
				print("Received command: clear");

				split = command.split("clear ")[1]

				Pather.usePortal(player.area, player.name);
				Precast.doPrecast(false);

				try {
					if (!!parseInt(split, 10)) {
						split = parseInt(split, 10);
					}

					Attack.clear(15, 0, split);
				} catch (killerror) {
					print(killerror);
				}

				if (!me.inTown && !Pather.usePortal(null, player.name)) {
					Town.goToTown();
				}

				break;
			case command.indexOf("quit") > -1:
				break MainLoop;
			}
		}

		delay(100);
	}

	return true;
}