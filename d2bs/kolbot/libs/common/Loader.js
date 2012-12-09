/**
*	@filename	Loader.js
*	@author		kolton
*	@desc		script loader, based on mBot's Sequencer.js
*/

var global = this;

var Loader = {
	scriptList: [],
	printToOOG: false,
	screenshotErrors: false,

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
	clone: function(obj) {
		// Handle the 3 simple types, and null or undefined
		if (null == obj || "object" != typeof obj) return obj;

		// Handle Date
		if (obj instanceof Date) {
			var copy = new Date();
			copy.setTime(obj.getTime());
			return copy;
		}

		// Handle Array
		if (obj instanceof Array) {
			var copy = [];
			for (var i = 0, len = obj.length; i < len; i++) {
				copy[i] = this.clone(obj[i]);
			}
			return copy;
		}

		// Handle Object
		if (obj instanceof Object) {
			var copy = {};
			for (var attr in obj) {
				if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
			}
			return copy;
		}

		throw new Error("Unable to copy obj! Its type isn't supported.");
	},
	
	copy: function(from,to){
		 for (i in from){
			if (from.hasOwnProperty(i)){
			   to[i] = this.clone(from[i]);                
			}            
		}
	},

	loadScripts: function () {
		var i, townCheck;
		var unmodifiedConfig = {};
		this.copy(Config, unmodifiedConfig); 

		if (!this.scriptList.length) {
			showConsole();

			throw new Error("You don't have any valid scripts in bots folder.");
		}

ScriptLoop:
		for (i in Scripts) {
			if (Scripts.hasOwnProperty(i) && this.scriptList.indexOf(i) > -1 && Scripts[i]) {
				include("bots/" + i + ".js");
				var reconfiguration = typeof Scripts[i] === 'object';

				if (typeof (global[i]) === "function") {
					if (i !== "Test" && i !== "Follower") {
						try {
							townCheck = Town.goToTown();
						} catch (e1) {
							print("ÿc1Loader: Failed to go to town, skipping to next script.");
						}
					} else {
						townCheck = true;
					}

					if (townCheck) {
						try {
							print("ÿc2Starting script: ÿc9" + i);
							if (reconfiguration){
								print("ÿc2Copying Config properties from " + i + " object.");
								this.copy(Scripts[i], Config);
							}
							global[i]();
						} catch (e) {
							if (this.printToOOG) {
								D2Bot.printToConsole(e.message + " in " + e.fileName.substring(e.fileName.lastIndexOf("\\") + 1, e.fileName.length) + " line " + e.lineNumber + ". Ping:" + me.ping + ";9");
							}

							Misc.errorReport("ÿc1Error in ÿc0" + i + " ÿc1(" + e.fileName.substring(e.fileName.lastIndexOf("\\") + 1, e.fileName.length) + " line ÿc1" + e.lineNumber + "): ÿc1" + e.message);

							if (this.screenshotErrors) {
								takeScreenshot();
								delay(500);
							}
						}
						if (reconfiguration){
							print("ÿc2Reverting back unmodified config properties.");
							this.copy(unmodifiedConfig, Config);
						}
					}
				} else {
					print("ÿc1Loader: Error in script, skipping;");
				}
			}
		}
	}
};