var D2Bot = {
	printToConsole: function (msg) {
		sendCopyData(null, "D2Bot #", 0, "printToConsole;" + msg);
	},
	printToItemLog: function (msg) {
		sendCopyData(null, "D2Bot #", 0, "printToItemLog;" + msg);
	},
	updateStatus: function (msg) {
		sendCopyData(null, "D2Bot #", 0, "updateStatus;" + msg);
	},
	updateRuns: function () {
		sendCopyData(null, "D2Bot #", 0, "updateRuns");
	},
	updateChickens: function () {
		sendCopyData(null, "D2Bot #", 0, "updateChickens");
	},
	requestGameInfo: function () {
		sendCopyData(null, "D2Bot #", 0, "requestGameInfo");
	},
	restart: function (reset) {
		if (arguments.length > 0) {
			sendCopyData(null, "D2Bot #", 0, "restartProfile;" + reset.toString());
		} else {
			sendCopyData(null, "D2Bot #", 0, "restartProfile");
		}
	},
	CDKeyInUse: function () {
		sendCopyData(null, "D2Bot #", 0, "CDKeyInUse");
	},
	CDKeyDisabled: function () {
		sendCopyData(null, "D2Bot #", 0, "CDKeyDisabled");
	},
	joinMe: function(window, gameName, gameCount, gamePass, isUp) {
		sendCopyData(null, window, 1, gameName + gameCount + "/" + gamePass + "/" + isUp);
	},
	requestGame: function (who) {
		sendCopyData(null, who, 3, me.profile);
	},
	stop: function () {
		sendCopyData(null, "D2Bot #", 0, "stop"); //this stops current window
	},
	start: function (profile) {
		sendCopyData(null, "D2Bot #", 0, "start;" + profile); //this starts a particular profile.ini
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
			gold: 0
		};

		string = JSON.stringify(obj);

		FileTools.writeText("data/" + me.profile + ".json", string);
	},

	getStats: function () {
		var obj, string;
		
		string = FileTools.readText("data/" + me.profile + ".json");
		obj = JSON.parse(string);
		
		return {runs: obj.runs, experience: obj.experience, lastArea: obj.lastArea, gold: obj.gold};
	},

	updateStats: function (arg, value) {
		var obj, string;

		string = FileTools.readText("data/" + me.profile + ".json");		
		obj = JSON.parse(string);

		switch (arg) {
		case "runs":
			obj.runs = value;
			break;
		case "experience":
			obj.experience = value;
			break;
		case "lastArea":
			if (obj.lastArea === getArea().name) {
				return;
			}

			obj.lastArea = value;
			break;
		case "gold":
			obj.gold = me.getStat(14) + me.getStat(15);
			break;
		}

		string = JSON.stringify(obj);

		FileTools.writeText("data/" + me.profile + ".json", string);
	},

	updateDeaths: function () {
		var obj, string;

		string = FileTools.readText("data/" + me.profile + ".json");
		obj = JSON.parse(string);
		obj.deaths = obj.deaths + 1;
		string = JSON.stringify(obj);

		FileTools.writeText("data/" + me.profile + ".json", string);
	}
};

var ControlAction = {
	click: function () {
		var control = getControl(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);

		if (!control) {
			print("control not found " + arguments[0] + " " + arguments[1] + " " + arguments[2])
			return false;
		}

		//delay(clickdelay);
		delay(200);
		control.click(arguments[5], arguments[6]);

		return true;
	},

	setText: function () {
		var control = getControl(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);

		if (!control) {
			return false;
		}

		//delay(textdelay);
		delay(200);
		control.setText(arguments[5]);
		
		return true;
	},

	getText: function () {
		var control = getControl(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);

		if (!control) {
			return false;
		}

		return control.getText();
	},

	clickRealm: function () {
		this.click(6,264,391,272,25);
		this.click(4, 257, 500, 292, 160, 403, 350 + arguments[0] * 25);
		this.click(6,281,538,96,32);
	},

	loginAccount: function (info) {
		var realms = {
			"uswest": 0,
			"useast": 1,
			"asia": 2,
			"europe": 3
			};

		while (getLocation() !== 12 && getLocation() !== 42) {
			switch (getLocation()) {
			case 8: // main menu
				ControlAction.clickRealm(realms[info.realm]);
				this.click(6,264,366,272,35); // OK
				break;
			case 9: // login screen
				this.setText(1,322,342,162,19, info.account);
				this.setText(1,322,396,162,19, info.password);
				this.click(6,264,484,272,35); // log in
				break;
			case 10: // login error - acc doesn't exist? TODO: handle all login errors
				this.click(6,335,412,128,35); // OK
				return false;
			case 18: // splash
				this.click(2, 0, 599, 800, 600);
				break;
			default:
				break;
			}

			delay(500);
		}

		delay(1000);

		return getLocation() === 12 || getLocation() === 42;
	},

	makeAccount: function (info) {
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
				this.click(6,264,366,272,35);
				break;
			case 9: // login screen
				this.click(6,264,572,272,35);
				break;
			case 18: // splash
				this.click(2, 0, 599, 800, 600);
				break;
			case 31: // ToU
				this.click(6,525,513,128,35);
				break;
			case 32: // new account
				this.setText(1,322,342,162,19, info.account);
				this.setText(1,322,396,162,19, info.password);
				this.setText(1,322,450,162,19, info.password);
				this.click(6,627,572,128,35);
				break;
			case 33: // please read
				this.click(6,525,513,128,35);
				break;
			case 34: // e-mail
				if (getControl(6,415,412,128,35)) {
					this.click(6,415,412,128,35);
				} else {
					this.click(6,265,572,272,35);
				}

				break;
			default:
				break;
			}

			delay(500);
		}

		return true;
	},

	findCharacter: function (info) {
		var control, text;

		if (getLocation() === 12) {
			control = getControl(4,37,178,200,92);

			if (control) {
				do {
					text = control.getText();

					if (text instanceof Array && typeof text[1] === "string" && text[1] === info.charName) {
						return true;
					}
				} while (control.getNext());
			}
		}

		return false;
	},

	loginCharacter: function (info) {
		var control, text;

		while (getLocation() !== 1) { // cycle until in lobby
			switch (getLocation()) {
			case 12: // character select
				control = getControl(4,37,178,200,92);

				if (control) {
					do {
						text = control.getText();

						if (text instanceof Array && typeof text[1] === "string" && text[1] === info.charName) {
							control.click();
							this.click(6,627,572,128,35);

							break;
						}
					} while (control.getNext());
				}

				break;
			case 42: // empty character select
				this.click(6,33,572,128,35);
				break;
			default:
				break;
			}

			delay(500);
		}

		return true;
	},

	makeCharacter: function (info) {
		if (!info.charClass) {
			info.charClass = "barbarian";
		}
		
		var clickCoords = [];
		
		while (getLocation() !== 1) { // cycle until in lobby
			switch (getLocation()) {
			case 12: // character select
			case 42: // empty character select
				this.click(6,33,528,168,60);
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
				this.setText(1,318,510,157,16, info.charName);
				
				if (!this.expansion) {
					this.click(6,319,540,15,16);
				}
				
				if (!info.ladder) {
					this.click(6,319,580,15,16);
				}
				
				if (info.hardcore) {
					this.click(6,319,560,15,16);
				}

				this.click(6,627,572,128,35);
				break;
			default:
				break;
			}

			delay(500);
		}

		return true;
	}
}