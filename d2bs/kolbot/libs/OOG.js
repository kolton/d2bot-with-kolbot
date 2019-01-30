/**
*	@filename	OOG.js
*	@author		kolton, D3STROY3R
*	@desc		handle out of game operations like creating characters/accounts, maintaining profile datafiles, d2bot# logging etc.
*/

var D2Bot = {
	handle: 0,

	init: function () {
		var handle = DataFile.getStats().handle;

		if (handle) {
			this.handle = handle;
		}

		return this.handle;
	},

	sendMessage: function (handle, mode, msg) {
		sendCopyData(null, handle, mode, msg);
	},

	printToConsole: function (msg, color, tooltip, trigger) {
		var printObj = {
				msg: msg,
				color: color || 0,
				tooltip: tooltip || "",
				trigger: trigger || ""
			},

			obj = {
				profile: me.profile,
				func: "printToConsole",
				args: [JSON.stringify(printObj)]
			};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	printToItemLog: function (itemObj) {
		var obj = {
				profile: me.profile,
				func: "printToItemLog",
				args: [JSON.stringify(itemObj)]
			};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	uploadItem: function (itemObj) {
		var obj = {
				profile: me.profile,
				func: "uploadItem",
				args: [JSON.stringify(itemObj)]
			};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	writeToFile: function (filename, msg) {
		var obj = {
			profile: me.profile,
			func: "writeToFile",
			args: [filename, msg]
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	postToIRC: function (ircProfile, recepient, msg) {
		var obj = {
			profile: me.profile,
			func: "postToIRC",
			args: [ircProfile, recepient, msg]
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	ircEvent: function (mode) {
		var obj = {
			profile: me.profile,
			func: "ircEvent",
			args: [mode ? "true" : "false"]
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	notify: function (msg) {
		var obj = {
			profile: me.profile,
			func: "notify",
			args: [msg]
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	saveItem: function (itemObj) {
		var obj = {
				profile: me.profile,
				func: "saveItem",
				args: [JSON.stringify(itemObj)]
			};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	updateStatus: function (msg) {
		var obj = {
			profile: me.profile,
			func: "updateStatus",
			args: [msg]
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	updateRuns: function () {
		var obj = {
			profile: me.profile,
			func: "updateRuns",
			args: []
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	updateChickens: function () {
		var obj = {
			profile: me.profile,
			func: "updateChickens",
			args: []
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	updateDeaths: function () {
		var obj = {
			profile: me.profile,
			func: "updateDeaths",
			args: []
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	requestGameInfo: function () {
		var obj = {
			profile: me.profile,
			func: "requestGameInfo",
			args: []
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	restart: function (keySwap) {
		var obj = {
			profile: me.profile,
			func: "restartProfile",
			args: arguments.length > 0 ? [me.profile, keySwap] : [me.profile]
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	CDKeyInUse: function () {
		var obj = {
			profile: me.profile,
			func: "CDKeyInUse",
			args: []
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	CDKeyDisabled: function () {
		var obj = {
			profile: me.profile,
			func: "CDKeyDisabled",
			args: []
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	CDKeyRD: function () {
		var obj = {
			profile: me.profile,
			func: "CDKeyRD",
			args: []
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	stop: function (profile, release) {
		if (!profile) {
			profile = me.profile;
		}

		var obj = {
			profile: me.profile,
			func: "stop",
			args: [profile, release ? "True" : "False"]
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	start: function (profile) {
		var obj = {
			profile: me.profile,
			func: "start",
			args: [profile]
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	startSchedule: function (profile) {
		var obj = {
			profile: me.profile,
			func: "startSchedule",
			args: [profile]
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	stopSchedule: function (profile) {
		var obj = {
			profile: me.profile,
			func: "stopSchedule",
			args: [profile]
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	updateCount: function () {
		var obj = {
			profile: me.profile,
			func: "updateCount",
			args: ["1"]
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	shoutGlobal: function (msg, mode) {
		var obj = {
			profile: me.profile,
			func: "shoutGlobal",
			args: [msg, mode]
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	heartBeat: function () {
		var obj = {
			profile: me.profile,
			func: "heartBeat",
			args: []
		};

		//print("ÿc1Heart beat " + this.handle);
		sendCopyData(null, this.handle, 0xbbbb, JSON.stringify(obj));
	},

	sendWinMsg: function (wparam, lparam) {
		var obj = {
			profile: me.profile,
			func: "winmsg",
			args: [wparam, lparam]
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	ingame: function () {
		this.sendWinMsg(0x0086, 0x0000);
		this.sendWinMsg(0x0006, 0x0002);
		this.sendWinMsg(0x001c, 0x0000);
	},

	// Profile to profile communication
	joinMe: function (profile, gameName, gameCount, gamePass, isUp) {
		var obj = {
			gameName: gameName + gameCount,
			gamePass: gamePass,
			inGame: isUp === "yes"
		};

		sendCopyData(null, profile, 1, JSON.stringify(obj));
	},

	requestGame: function (profile) {
		var obj = {
			profile: me.profile
		};

		sendCopyData(null, profile, 3, JSON.stringify(obj));
	},

	getProfile: function () {
		var obj = {
			profile: me.profile,
			func: "getProfile",
			args: []
		};

        sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	setProfile: function (account, password, character, difficulty, realm, infoTag, gamePath) {
		var obj = {
			profile: me.profile,
			func: "setProfile",
			args: [account, password, character, difficulty, realm, infoTag, gamePath]
		};

        sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	setTag: function (tag) {
		var obj = {
			profile: me.profile,
			func: "setTag",
			args: [JSON.stringify(tag)]
		};

        sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	// Store info in d2bot# cache
	store: function (info) {
		this.remove();

		var obj = {
			profile: me.profile,
			func: "store",
			args: [me.profile, info]
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	// Get info from d2bot# cache
	retrieve: function () {
		var obj = {
			profile: me.profile,
			func: "retrieve",
			args: [me.profile]
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	},

	// Delete info from d2bot# cache
	remove: function () {
		var obj = {
			profile: me.profile,
			func: "delete",
			args: [me.profile]
		};

		sendCopyData(null, this.handle, 0, JSON.stringify(obj));
	}
};

var DataFile = {
	create: function () {
		var obj, string;

		obj = {
			runs: 0,
			experience: 0,
			deaths: 0,
			lastArea: "",
			gold: 0,
			level: 0,
			name: "",
			gameName: "",
			ingameTick: 0,
			handle: 0,
			nextGame: ""
		};

		string = JSON.stringify(obj);

		//FileTools.writeText("data/" + me.profile + ".json", string);
		Misc.fileAction("data/" + me.profile + ".json", 1, string);

		return obj;
	},

	getObj: function () {
		var obj, string;

		if (!FileTools.exists("data/" + me.profile + ".json")) {
			DataFile.create();
		}

		//string = FileTools.readText("data/" + me.profile + ".json");
		string = Misc.fileAction("data/" + me.profile + ".json", 0);

		try {
			obj = JSON.parse(string);
		} catch (e) {
			// If we failed, file might be corrupted, so create a new one
			obj = this.create();
		}

		if (obj) {
			return obj;
		}

		print("Error reading DataFile. Using null values.");

		return {runs: 0, experience: 0, lastArea: "", gold: 0, level: 0, name: "", gameName: "", ingameTick: 0, handle: 0, nextGame: ""};
	},

	getStats: function () {
		var obj = this.getObj();

		return Misc.clone(obj);
	},

	updateStats: function (arg, value) {
		while (me.ingame && !me.gameReady) {
			delay(100);
		}

		var i, obj, string,
			statArr = [];

		if (typeof arg === "object") {
			statArr = arg.slice();
		}

		if (typeof arg === "string") {
			statArr.push(arg);
		}

		obj = this.getObj();

		for (i = 0; i < statArr.length; i += 1) {
			switch (statArr[i]) {
			case "experience":
				obj.experience = me.getStat(13);
				obj.level = me.getStat(12);

				break;
			case "lastArea":
				if (obj.lastArea === Pather.getAreaName(me.area)) {
					return;
				}

				obj.lastArea = Pather.getAreaName(me.area);

				break;
			case "gold":
				if (!me.gameReady) {
					break;
				}

				obj.gold = me.getStat(14) + me.getStat(15);

				break;
			case "name":
				obj.name = me.name;

				break;
			case "ingameTick":
				obj.ingameTick = getTickCount();

				break;
			case "deaths":
				obj.deaths = (obj.deaths || 0) + 1;

				break;
			default:
				obj[statArr[i]] = value;

				break;
			}
		}

		string = JSON.stringify(obj);

		//FileTools.writeText("data/" + me.profile + ".json", string);
		Misc.fileAction("data/" + me.profile + ".json", 1, string);
	}
};

var ControlAction = {
	mutedKey: false,

	timeoutDelay: function (text, time, stopfunc, arg) {
		var currTime = 0,
			endTime = getTickCount() + time;

		while (getTickCount() < endTime) {
			if (typeof stopfunc === "function" && stopfunc(arg)) {
				break;
			}

			if (currTime !== Math.floor((endTime - getTickCount()) / 1000)) {
				currTime = Math.floor((endTime - getTickCount()) / 1000);

				D2Bot.updateStatus(text + " (" + Math.max(currTime, 0)  + "s)");
			}

			delay(10);
		}
	},

	click: function (type, x, y, xsize, ysize, targetx, targety) {
		var control = getControl(type, x, y, xsize, ysize);

		if (!control) {
			print("control not found " + type + " " + x + " " + y + " location " + getLocation());

			return false;
		}

		control.click(targetx, targety);

		return true;
	},

	setText: function (type, x, y, xsize, ysize, text) {
		if (!text) {
			return false;
		}

		var currText,
			control = getControl(type, x, y, xsize, ysize);

		if (!control) {
			return false;
		}

		currText = control.text;

		if (currText && currText === text) {
			return true;
		}

		currText = control.getText();

		if (currText && ((typeof currText === "string" && currText === text) || (typeof currText === "object" && currText.indexOf(text) > -1))) {
			return true;
		}

		//delay(200);
		control.setText(text);

		return true;
	},

	getText: function (type, x, y, xsize, ysize) {
		var control = getControl(type, x, y, xsize, ysize);

		if (!control) {
			return false;
		}

		return control.getText();
	},

	joinChannel: function (channel) {
		me.blockMouse = true;

		var i, currChan, tick,
			rval = false,
			timeout = 5000;

MainLoop:
		while (true) {
			switch (getLocation()) {
			case 1: // Lobby
				this.click(6, 27, 480, 120, 20);

				break;
			case 3: // Chat
				currChan = this.getText(4, 28, 138, 354, 60); // returns array

				if (currChan) {
					for (i = 0; i < currChan.length; i += 1) {
						if (currChan[i].split(" (") && currChan[i].split(" (")[0].toLowerCase() === channel.toLowerCase()) {
							rval = true;

							break MainLoop;
						}
					}
				}

				if (!tick) {
					this.click(6, 535, 490, 80, 20);

					tick = getTickCount();
				}

				break;
			case 7: // Channel
				this.setText(1, 432, 162, 155, 20, channel);
				this.click(6, 671, 433, 96, 32);

				break;
			}

			if (getTickCount() - tick >= timeout) {
				break MainLoop;
			}

			delay(100);
		}

		me.blockMouse = false;

		return rval;
	},

	createGame: function (name, pass, diff, delay) {
		var control;

		ControlAction.setText(1, 432, 162, 158, 20, name);
		ControlAction.setText(1, 432, 217, 158, 20, pass);

		switch (diff) {
		case "Normal":
			ControlAction.click(6, 430, 381, 16, 16);

			break;
		case "Nightmare":
			ControlAction.click(6, 555, 381, 16, 16);

			break;
		case "Highest":
			control = getControl(6, 698, 381, 16, 16);

			if (control.disabled !== 4) {
				ControlAction.click(6, 698, 381, 16, 16); // Click Hell

				break;
			}

			control = getControl(6, 555, 381, 16, 16);

			if (control.disabled !== 4) {
				ControlAction.click(6, 555, 381, 16, 16); // Click Nightmare

				break;
			}

			ControlAction.click(6, 430, 381, 16, 16); // Click Normal

			break;
		default:
			ControlAction.click(6, 698, 381, 16, 16); // Click Hell

			break;
		}

		if (delay) {
			this.timeoutDelay("Make Game Delay", delay);
		}

		me.blockMouse = true;

		print("Creating Game: " + name);
		ControlAction.click(6, 594, 433, 172, 32);

		me.blockMouse = false;
	},

	clickRealm: function (realm) {
		if (realm < 0 || realm > 3) {
			throw new Error("clickRealm: Invalid realm!");
		}

		var control, currentRealm;

		me.blockMouse = true;

MainLoop:
		while (true) {
			switch (getLocation()) {
			case 8:
				control = getControl(6, 264, 391, 272, 25);

				if (control) {
					switch (control.text.split(getLocaleString(11049).substring(0, getLocaleString(11049).length - 2))[1]) {
					case "U.S. EAST":
						currentRealm = 1;

						break;
					case "U.S. WEST":
						currentRealm = 0;

						break;
					case "ASIA":
						currentRealm = 2;

						break;
					case "EUROPE":
						currentRealm = 3;

						break;
					}
				}

				if (currentRealm === realm) {
					break MainLoop;
				}

				this.click(6, 264, 391, 272, 25);

				break;
			case 27:
				this.click(4, 257, 500, 292, 160, 403, 350 + realm * 25);
				this.click(6, 281, 538, 96, 32);

				break;
			}

			delay(500);
		}

		me.blockMouse = false;

		return true;
	},

	loginAccount: function (info) {
		me.blockMouse = true;

		var tick, locTick,
			realms = {
				"uswest": 0,
				"useast": 1,
				"asia": 2,
				"europe": 3
			};

		tick = getTickCount();

MainLoop:
		while (true) {
			switch (getLocation()) {
			case 0:
				break;
			case 8: // main menu
				if (info.realm) {
					ControlAction.clickRealm(realms[info.realm]);
				}

				this.click(6, 264, 366, 272, 35);

				break;
			case 9: // login screen
				this.setText(1, 322, 342, 162, 19, info.account);
				this.setText(1, 322, 396, 162, 19, info.password);
				this.click(6, 264, 484, 272, 35); // log in

				break;
			case 11:
			case 13: // realm down
				// Unable to connect, let the caller handle it.
				me.blockMouse = false;

				return false;
			case 12: // char screen - break
				break MainLoop;
			case 18: // splash
				this.click(2, 0, 599, 800, 600);

				break;
			case 16: // please wait
			case 21: // connecting
			case 23: // char screen connecting
				break;
			case 42: // empty char screen
				// make sure we're not on connecting screen
				locTick = getTickCount();

				while (getTickCount() - locTick < 3000 && getLocation() === 42) {
					delay(25);
				}

				// char screen connecting
				if (getLocation() === 23) {
					break;
				}

				break MainLoop; // break if we're sure we're on empty char screen
			default:
				print(getLocation());

				me.blockMouse = false;

				return false;
			}

			if (getTickCount() - tick >= 20000) {
				return false;
			}

			delay(100);
		}

		delay(1000);

		me.blockMouse = false;

		return getLocation() === 12 || getLocation() === 42;
	},

	makeAccount: function (info) {
		me.blockMouse = true;

		var realms = {
			"uswest": 0,
			"useast": 1,
			"asia": 2,
			"europe": 3
		};

		while (getLocation() !== 42) {// cycle until in empty char screen
			switch (getLocation()) {
			case 8: // main menu
				ControlAction.clickRealm(realms[info.realm]);
				this.click(6, 264, 366, 272, 35);

				break;
			case 9: // login screen
				this.click(6, 264, 572, 272, 35);

				break;
			case 18: // splash
				this.click(2, 0, 599, 800, 600);

				break;
			case 29: // Char create
				this.click(6, 33, 572, 128, 35);

				break;
			case 31: // ToU
				this.click(6, 525, 513, 128, 35);

				break;
			case 32: // new account
				this.setText(1, 322, 342, 162, 19, info.account);
				this.setText(1, 322, 396, 162, 19, info.password);
				this.setText(1, 322, 450, 162, 19, info.password);
				this.click(6, 627, 572, 128, 35);

				break;
			case 33: // please read
				this.click(6, 525, 513, 128, 35);

				break;
			case 34: // e-mail
				if (getControl(6, 415, 412, 128, 35)) {
					this.click(6, 415, 412, 128, 35);
				} else {
					this.click(6, 265, 572, 272, 35);
				}

				break;
			default:
				break;
			}

			delay(100);
		}

		me.blockMouse = false;

		return true;
	},

	findCharacter: function (info) {
		var control, text, tick,
			count = 0;

		tick = getTickCount();

		while (getLocation() !== 12) {
			if (getTickCount() - tick >= 5000) {
				break;
			}

			delay(25);
		}

		// start from beginning of the char list
		sendKey(0x24);

		while (getLocation() === 12 && count < 24) {
			control = getControl(4, 37, 178, 200, 92);

			if (control) {
				do {
					text = control.getText();

					if (text instanceof Array && typeof text[1] === "string") {
						count++;

						if (text[1].toLowerCase() === info.charName.toLowerCase()) {
							return true;
						}
					}
				} while (count < 24 && control.getNext());
			}

			if (count === 8 || count === 16) { // check for additional characters up to 24
				control = getControl(4, 237, 457, 72, 93);

				if (control) {
					me.blockMouse = true;

					control.click();
					sendKey(0x28);
					sendKey(0x28);
					sendKey(0x28);
					sendKey(0x28);

					me.blockMouse = false;
				}
			} else { // no further check necessary
				break;
			}
		}

		return false;
	},

	// get all characters
	getCharacters: function () {
		var control, text,
			count = 0,
			list = [];

		// start from beginning of the char list
		sendKey(0x24);

		while (getLocation() === 12 && count < 24) {
			control = getControl(4, 37, 178, 200, 92);

			if (control) {
				do {
					text = control.getText();

					if (text instanceof Array && typeof text[1] === "string") {
						count++;

						if (list.indexOf(text[1]) === -1) {
							list.push(text[1]);
						}
					}
				} while (count < 24 && control.getNext());
			}

			if (count === 8 || count === 16) { // check for additional characters up to 24
				control = getControl(4, 237, 457, 72, 93);

				if (control) {
					me.blockMouse = true;

					control.click();
					sendKey(0x28);
					sendKey(0x28);
					sendKey(0x28);
					sendKey(0x28);

					me.blockMouse = false;
				}
			} else { // no further check necessary
				break;
			}
		}

		// back to beginning of the char list
		sendKey(0x24);

		return list;
	},

	// get character position
	getPosition: function () {
		var control, text,
			position = 0;

		if (getLocation() === 12) {
			control = getControl(4, 37, 178, 200, 92);

			if (control) {
				do {
					text = control.getText();

					if (text instanceof Array && typeof text[1] === "string") {
						position += 1;
					}
				} while (control.getNext());
			}
		}

		return position;
	},

	loginCharacter: function (info, startFromTop = true) {
		me.blockMouse = true;

		var control, text,
			count = 0;

		if (startFromTop) { // start from beginning of the char list
			sendKey(0x24);
		}

MainLoop:
		while (getLocation() !== 1) { // cycle until in lobby
			switch (getLocation()) {
			case 12: // character select
				control = getControl(4, 37, 178, 200, 92);

				if (control) {
					do {
						text = control.getText();

						if (text instanceof Array && typeof text[1] === "string") {
							count++;

							if (text[1].toLowerCase() === info.charName.toLowerCase()) {
								control.click();
								this.click(6, 627, 572, 128, 35);
								me.blockMouse = false;

								return true;
							}
						}
					} while (control.getNext());
				}

				if (count === 8 || count === 16) { // check for additional characters up to 24
					control = getControl(4, 237, 457, 72, 93);

					if (control) {
						control.click();
						sendKey(0x28);
						sendKey(0x28);
						sendKey(0x28);
						sendKey(0x28);
					}
				} else { // no further check necessary
					break MainLoop;
				}

				break;
			case 42: // empty character select
				this.click(6, 33, 572, 128, 35);

				break;
			case 14: // disconnected?
			case 30: // player not found?
				break MainLoop;
			default:
				break;
			}

			delay(100);
		}

		me.blockMouse = false;

		return false;
	},

	makeCharacter: function (info) {
		me.blockMouse = true;

		if (!info.charClass) {
			info.charClass = "barbarian";
		}

		var control,
			clickCoords = [];

		while (getLocation() !== 1) { // cycle until in lobby
			switch (getLocation()) {
			case 12: // character select
			case 42: // empty character select
				control = getControl(6, 33, 528, 168, 60);

				if (control && control.disabled === 4) { // Create Character greyed out
					me.blockMouse = false;

					return false;
				}

				this.click(6, 33, 528, 168, 60);

				break;
			case 29: // select character
				switch (info.charClass) {
				case "barbarian":
					clickCoords = [400, 280];

					break;
				case "amazon":
					clickCoords = [100, 280];

					break;
				case "necromancer":
					clickCoords = [300, 290];

					break;
				case "sorceress":
					clickCoords = [620, 270];

					break;
				case "assassin":
					clickCoords = [200, 280];

					break;
				case "druid":
					clickCoords = [700, 280];

					break;
				case "paladin":
					clickCoords = [521, 260];

					break;
				}

				// coords:
				// zon: 100, 280
				// barb: 400, 280
				// necro: 300, 290
				// sin: 200, 280
				// paladin: 521 260
				// sorc: 620, 270
				// druid: 700, 280

				getControl().click(clickCoords[0], clickCoords[1]);
				delay(500);

				break;
			case 15: // new character
				if (getControl(6, 421, 337, 96, 32)) { // hardcore char warning
					this.click(6, 421, 337, 96, 32);
				} else {
					this.setText(1, 318, 510, 157, 16, info.charName);

					if (!info.expansion) {
						this.click(6, 319, 540, 15, 16);
					}

					if (!info.ladder) {
						this.click(6, 319, 580, 15, 16);
					}

					if (info.hardcore) {
						this.click(6, 319, 560, 15, 16);
					}

					this.click(6, 627, 572, 128, 35);
				}

				break;
			case 30: // char name exists (text box 4, 268, 320, 264, 120)
				ControlAction.click(6, 351, 337, 96, 32);
				ControlAction.click(6, 33, 572, 128, 35);

				me.blockMouse = false;

				return false;
			default:
				break;
			}

			delay(500);
		}

		me.blockMouse = false;

		return true;
	},

	// Test version - modified core only
	getGameList: function () {
		var i, text, gameList;

		text = this.getText(4, 432, 393, 160, 173);

		if (text) {
			gameList = [];

			for (i = 0; i < text.length; i += 1) {
				gameList.push({
					gameName: text[i][0],
					players: text[i][1]
				});
			}

			return gameList;
		}

		return false;
	}
};

var ShitList = {
	create: function () {
		var string,
			obj = {
				shitlist: []
			};

		string = JSON.stringify(obj);

		//FileTools.writeText("shitlist.json", string);
		Misc.fileAction("shitlist.json", 1, string);

		return obj;
	},

	getObj: function () {
		var obj,
			//string = FileTools.readText("shitlist.json");
			string = Misc.fileAction("shitlist.json", 0);

		try {
			obj = JSON.parse(string);
		} catch (e) {
			obj = this.create();
		}

		if (obj) {
			return obj;
		}

		print("Failed to read ShitList. Using null values");

		return {shitlist: []};
	},

	read: function () {
		var obj;

		if (!FileTools.exists("shitlist.json")) {
			this.create();
		}

		obj = this.getObj();

		return obj.shitlist;
	},

	add: function (name) {
		var obj, string;

		obj = this.getObj();

		obj.shitlist.push(name);

		string = JSON.stringify(obj);

		//FileTools.writeText("shitlist.json", string);
		Misc.fileAction("shitlist.json", 1, string);
	}
};
