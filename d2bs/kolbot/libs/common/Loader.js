/*
	Script loader library
	Based on mBot's Sequencer
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

	loadScripts: function () {
		var i;

		if (!this.scriptList.length) {
			showConsole();

			throw new Error("You don't have any valid scripts in bots folder.");
		}

		for (i in Scripts) {
			if (this.scriptList.indexOf(i) > -1) {
				if (!Scripts[i]) {
					continue;
				}

				include("bots/" + i + ".js");

				if (typeof (global[i]) !== "function") {
					print("ÿc1Loader: Error in script, skipping;");

					continue;
				}

				if (i !== "Test") {
					try {
						Town.goToTown();
					} catch (e) {
						print("ÿc1Loader: Failed to go to town, skipping to next script.");

						continue;
					}
				}

				try {
					print("ÿc2Starting script: ÿc9" + i);
					global[i]();
				} catch (e) {
					showConsole();
					print("ÿc1Error in ÿc0" + i + " ÿc1(" + e.fileName.substring(e.fileName.lastIndexOf("\\") + 1, e.fileName.length) + " line ÿc1" + e.lineNumber + ") : ÿc1" + e.message);
				}
			}
		}
	}
};