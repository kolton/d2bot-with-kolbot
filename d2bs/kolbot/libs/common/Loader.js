/**
*	@filename	Loader.js
*	@author		kolton
*	@desc		script loader, based on mBot's Sequencer.js
*/

var global = this;

var Loader = {
	fileList: [],
	scriptList: [],
	scriptIndex: -1,
	skipTown: ["Test", "Follower"],

	init: function () {
		this.getScripts();
		this.loadScripts();
	},

	getScripts: function () {
		var i,
			fileList = dopen("libs/bots/").getFiles();

		for (i = 0; i < fileList.length; i += 1) {
			if (fileList[i].indexOf(".js") > -1) {
				this.fileList.push(fileList[i].substring(0, fileList[i].indexOf(".js")));
			}
		}
	},

	// see http://stackoverflow.com/questions/728360/copying-an-object-in-javascript#answer-728694
	clone: function (obj) {
		var i, copy, attr;

		// Handle the 3 simple types, and null or undefined
		if (null === obj || "object" !== typeof obj) {
			return obj;
		}

		// Handle Date
		if (obj instanceof Date) {
			copy = new Date();

			copy.setTime(obj.getTime());

			return copy;
		}

		// Handle Array
		if (obj instanceof Array) {
			copy = [];

			for (i = 0; i < obj.length; i += 1) {
				copy[i] = this.clone(obj[i]);
			}

			return copy;
		}

		// Handle Object
		if (obj instanceof Object) {
			copy = {};

			for (attr in obj) {
				if (obj.hasOwnProperty(attr)) {
					copy[attr] = this.clone(obj[attr]);
				}
			}

			return copy;
		}

		throw new Error("Unable to copy obj! Its type isn't supported.");
	},

	copy: function (from, to) {
		var i;

		for (i in from) {
			if (from.hasOwnProperty(i)) {
				to[i] = this.clone(from[i]);
			}
		}
	},

	loadScripts: function () {
		var reconfiguration, s, script,
			unmodifiedConfig = {};

		this.copy(Config, unmodifiedConfig);

		if (!this.fileList.length) {
			showConsole();

			throw new Error("You don't have any valid scripts in bots folder.");
		}

		for (s in Scripts) {
			if (Scripts.hasOwnProperty(s) && Scripts[s]) {
				this.scriptList.push(s);
			}
		}

		for (this.scriptIndex = 0; this.scriptIndex < this.scriptList.length; this.scriptIndex++) {
			script = this.scriptList[this.scriptIndex];

			if (this.fileList.indexOf(script) < 0) {
				Misc.errorReport("ÿc1Script " + script + " doesn't exist.");
				continue;
			}

			if (!include("bots/" + script + ".js")) {
				Misc.errorReport("Failed to include script: " + script);
				continue;
			}

			if (isIncluded("bots/" + script + ".js")) {
				try {
					if (typeof (global[script]) !== "function") {
						throw new Error("Invalid script function name");
					}

					if (this.skipTown.indexOf(script) > -1 || Town.goToTown()) {
						print("ÿc2Starting script: ÿc9" + script);
						//scriptBroadcast(JSON.stringify({currScript: script}));
						Messaging.sendToScript("tools/toolsthread.js", JSON.stringify({currScript: script}));

						reconfiguration = typeof Scripts[script] === 'object';

						if (reconfiguration) {
							print("ÿc2Copying Config properties from " + script + " object.");
							this.copy(Scripts[script], Config);
						}

						global[script]();

						if (reconfiguration) {
							print("ÿc2Reverting back unmodified config properties.");
							this.copy(unmodifiedConfig, Config);
						}
					}
				} catch (error) {
					Misc.errorReport(error, script);
				}
			}
		}
	},

	scriptName: function (offset = 0) {
		let index = this.scriptIndex + offset;

		if (index >= 0 && index < this.scriptList.length) {
			return this.scriptList[index];
		}

		return null;
	}
};
