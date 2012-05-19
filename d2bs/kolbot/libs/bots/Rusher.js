/**
*	@filename	Rusher.js
*	@author		kolton
*	@desc		Rusher script. ALPHA VERSION
*				Chat commands:
*				master - assigns player as master and listens to his commands
*				release - resets master
*				pause - pause the rusher
*				resume - resume the rusher
*				do sequence - stop current action and start the given sequence.
*				supported sequences are: andariel, cube, amulet, staff, summoner, duriel, travincal, mephisto, diablo
*				example: do travincal
*/

function Rusher() {
	load("tools/rushthread.js");
	delay(500);

	var rushThread, command, master,
		commands = [];

	rushThread = getScript("tools/rushthread.js");

	this.reloadThread = function () {
		rushThread.stop();
		load("tools/rushthread.js");
		delay(500);

		rushThread = getScript("tools/rushthread.js");
	};

	this.chatEvent = function (nick, msg) {
		if (nick !== me.name) {
			switch (msg) {
			case "master":
				if (!master) {
					say(nick + " is my master.");

					master = nick;
				} else {
					say("I already have a master.");
				}

				break;
			case "release":
				if (nick === master) {
					say("I have no master now.");

					master = false;
				} else {
					say("I'm only accepting commands from my master.");
				}

				break;
			case "quit":
				if (nick === master) {
					say("bye ~");
					quit();
				} else {
					say("I'm only accepting commands from my master.");
				}

				break;
			default:
				if (nick === master) {
					commands.push(msg);
				} else {
					say("I'm only accepting commands from my master.");
				}

				break;
			}
		}
	};

	addEventListener("chatmsg", this.chatEvent);
	rushThread.send("go");

	while (true) {
		if (commands.length > 0) {
			command = commands.shift();

			switch (command) {
			case "pause":
				if (rushThread.running) {
					rushThread.pause();
				}

				break;
			case "resume":
				if (!rushThread.running) {
					rushThread.resume();
				}

				break;
			default:
				if (command.split(" ")[0] !== undefined && command.split(" ")[0] === "do") {
					this.reloadThread();
					rushThread.send(command.split(" ")[1]);
				}

				break;
			}
		}

		delay(100);
	}

	return true;
}