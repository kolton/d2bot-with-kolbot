var answer = false,
	request = false,

	AutoAssign = {
		recursion: true,
		Barbs: [],
		Sorcs: [],
		Pallys: [],
		Jobs: {
				Barb: "",
				Sorc: "",
				Pally: "",
				Mine: 0
		},
	init: function () {
		AutoAssign.updateNames(); //initiates all scripts

		//Do something else? What else do we need to do...

		return true;
	},

	receiveCopyData: function (mode, msg) {
		switch (mode) {
			case 69: // request
				if (msg === me.name) {
					D2Bot.shoutGlobal("bot", 70);
				}

				break;
			case 70: // Received answer
				if (msg == "bot" && request == true) {
					answer = true;
				}

				break;
			default:
				break;
			}
	},

	gameEvent: function (mode, param1, param2, name1, name2) {
        switch (mode) {
        case 0x00: //Left game due to time-out
			AutoAssign.updateNames(name1);

			break;
		case 0x02: //Joined game
			AutoAssign.updateNames();

			break;
        case 0x03://left game
			AutoAssign.updateNames(name1);
			break;

		}
		delay (250);
    },

	getJobs: function () {

		var i, y, current, quitCheck,
			array = [this.Barbs, this.Pallys, this.Sorcs];

		for (i = 0; i < array.length; i++) {
			current = array[i];

			switch (i) {
			case 0:
				quitCheck = getParty(this.Jobs.Barb);

				if (!quitCheck) {
					this.Jobs.Barb = "";
				}

				if (current.length > 0) {
					this.Jobs.Barb = current[0].name;
					//print ("setting leader Barb to: " + AutoAssign.Jobs.Barb);
				}
				break;
			case 1:
				quitCheck = getParty(this.Jobs.Pally);

				if (!quitCheck) {
					this.Jobs.Pally = "";
				}

				if (current.length > 0) {
					this.Jobs.Pally = current[0].name;
					//print ("setting leader Pally to: " + AutoAssign.Jobs.Pally);
				}
				break;
			case 2:
				quitCheck = getParty(this.Jobs.Sorc);

				if (!quitCheck) {
					this.Jobs.Sorc = "";
				}

				if (current.length > 0) {
					this.Jobs.Sorc = current[0].name;
					//print ("setting leader Sorc to: " + AutoAssign.Jobs.Sorc);
				}
				break;
			}

			for (y = 0; y < current.length; y++) {
				if (current[y].name === me.name) {
					this.Jobs.Mine = y;
				}
			}
		}
		return true;
	},

	pushNames: function (name, level, classid) {

		var obj = {name : name, level : level};

			switch (classid) {
				case 1:
					this.Sorcs.push(obj);
				break;
				case 3:
					this.Pallys.push(obj);
				break;
				case 4:
					this.Barbs.push(obj);
				break;
			}
		return true;
	},

	checkNames: function (name, type) {
	var	tick, i,
		timeout = 1000;

		for (i = 0; i < type.length; i++) {
			if (type[i].name === name) {
				break;
			}
		}

		if (i == type.length) {

			D2Bot.shoutGlobal(name, 69);
			tick = getTickCount();
			request = true;

			while (!answer) {
				if (getTickCount() - tick > timeout) {
					break;
				}
				delay (100);
			}
		}

		if (answer) {
			answer = false;
			request = false;
			//print ("Char: " + name + " Came back true.");
			return true;
		}

		answer = false;
		request = false;

		return false;
	},

	sortNames: function () {
		var i, type,
			arrays = [this.Barbs, this.Pallys, this.Sorcs];

		for (i = 0; i < arrays.length; i++) {
			type = arrays[i];

			type.sort(function (a, b) {
				if (a.name > b.name)
					return 1;
				if (a.name < b.name)
					return -1;
				return 0;
			});

			type.sort(function (a, b) {
				return b.level - a.level;
			});

		}
		return true;
	},

	removeNames: function (quitter) {
		print (quitter + " has left. updating..");
		var i, y, currentClass,
			arrays = [this.Barbs, this.Pallys, this.Sorcs];

		for (i = 0; i < arrays.length; i++) {
			currentClass = arrays[i];

			for (y = 0; y < currentClass.length; y++) {
				if (currentClass[y].name === quitter) {
					currentClass.splice(y, 1);
				}
			}
		}
		return true;
	},

	getNames: function () {
		print ("Updating names.");

		for (var i = 0; i < 3; i++) {
			var party = getParty();

				if (party) {
					do {
						switch (party.classid) {
							case 1:
								if (this.checkNames(party.name, this.Sorcs)) {
									this.pushNames(party.name, party.level, party.classid);
								}

							break;
							case 3:
								if (this.checkNames(party.name, this.Pallys)) {
									this.pushNames(party.name, party.level, party.classid);
								}

							break;
							case 4:
								if (this.checkNames(party.name, this.Barbs)) {
									this.pushNames(party.name, party.level, party.classid);
								}

							break;
							default:
							break;
						}
					} while (party.getNext());
				}
		}

		this.sortNames();
		this.getJobs();

		return this.Jobs;
	},

	updateNames: function (quitter) {
		if (this.recursion) {
			this.recursion = false;

			if (quitter) {
				this.removeNames(quitter);
			}

			this.getNames();

		this.recursion = true;
		}
		return true;
	}
}
	//addEventListener("scriptmsg", AutoAssign.ScriptMsgEvent);
	addEventListener('copydata', AutoAssign.receiveCopyData);
	addEventListener("gameevent", AutoAssign.gameEvent);
