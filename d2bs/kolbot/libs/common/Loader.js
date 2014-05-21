/**
*	@filename	Loader.js
*	@author		kolton
*	@desc		script loader, based on mBot's Sequencer.js
*/

var global = this;

var Loader = {
	scriptList: [],

	init: function () {
		this.getScripts();
		this.loadScripts();
	},

	getScripts: function () {
		var i,
			fileList = dopen("libs/bots/").getFiles();

		for (i = 0; i < fileList.length; i += 1) {
			if (fileList[i].indexOf(".js") > -1) {
				this.scriptList.push(fileList[i].substring(0, fileList[i].indexOf(".js")));
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
		var i, townCheck, reconfiguration,
			unmodifiedConfig = {};

		this.copy(Config, unmodifiedConfig);

		if (!this.scriptList.length) {
			showConsole();

			throw new Error("You don't have any valid scripts in bots folder.");
		}

		for (i in Scripts) {
			if (Scripts.hasOwnProperty(i)) {
				if (this.scriptList.indexOf(i) > -1) {
					if (!!Scripts[i]) {
						if (!include("bots/" + i + ".js")) {
							Misc.errorReport("Failed to include script: " + i);
						}

						if (isIncluded("bots/" + i + ".js")) {
							try {
								reconfiguration = typeof Scripts[i] === 'object';

								if (typeof (global[i]) === "function") {
									if (i !== "Test" && i !== "Follower") {
										townCheck = Town.goToTown();
									} else {
										townCheck = true;
									}

									if (townCheck) {
										print("ÿc2Starting script: ÿc9" + i);
										//scriptBroadcast(JSON.stringify({currScript: i}));
										Messaging.sendToScript("tools/toolsthread.js", JSON.stringify({currScript: i}));

										if (reconfiguration) {
											print("ÿc2Copying Config properties from " + i + " object.");
											this.copy(Scripts[i], Config);
										}

										global[i]();

										if (reconfiguration) {
											print("ÿc2Reverting back unmodified config properties.");
											this.copy(unmodifiedConfig, Config);
										}
									}
								} else {
									throw new Error("Invalid script function name");
								}
							} catch (error) {
								Misc.errorReport(error, i);
							}
						}
					}
				} else {
					Misc.errorReport("ÿc1Script " + i + " doesn't exist.");
				}
			}
		}
	}
};