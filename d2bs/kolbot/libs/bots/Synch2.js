var Synched2 = false;

var uRdyMsg2 = "Yo, I'm rdy, u?";
var rdyMsg2 = "Let's go";

function messageHandler2(nick, msg) {
	if (nick !== me.name) {
		if (msg === uRdyMsg2) {
			say(rdyMsg2);
			Synched2 = true;
		} else if (msg === rdyMsg2) {
			Synched2 = true;
		} else if (msg === "I'm rdy, u?") {
			say("No");
			quit();
		}
	}
}

function Synch2() {
	var i, party, j;

	addEventListener("chatmsg", messageHandler2);

	delay(1000);
	say(uRdyMsg2);

	delay(1000);

	for (i = 0; i < 720 && !Synched2; i += 1) {
		for (j = 0; j < Config.Synch.WaitFor.length; j += 1) {
			party = getParty(Config.Synch.WaitFor[j]);
			if (!party) {
				D2Bot.printToConsole("WaitFor not in game: " +
						Config.Synch.WaitFor[j] + " so quitting.");

				removeEventListener("chatmsg", messageHandler2);
				quit();
				return false;
			}
		}

		delay(1000);
	}

	if (!Synched) {
		D2Bot.printToConsole("Failed to sync.");
		quit();
	}

	delay(1000);

	removeEventListener("chatmsg", messageHandler2);

	return true;
}
