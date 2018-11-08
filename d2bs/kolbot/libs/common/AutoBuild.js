/**
*	@title	:	AutoBuild.js
*
*	@author	:	alogwe
*
*	@desc	:	This script is included when any script includes libs/common/Config.js and calls Config.init().
*				If enabled, loads a threaded helper script that will monitor changes in character level and
*				upon level up detection, it will spend skill and stat points based on a configurable
*				character build template file located in libs/config/Builds/*.
*
*				Any skill and stat points obtained as quest rewards are currently
*				invisible to this script and must be spent manually.
*
*	@todo	:	Make this file "libs/config/Builds/README.txt"
*/
js_strict(true);

if (!isIncluded("common/Cubing.js")) { include("common/Cubing.js"); };
if (!isIncluded("common/Prototypes.js")) { include("common/Prototypes.js"); };
if (!isIncluded("common/Runewords.js")) { include("common/Runewords.js"); };

var AutoBuild = new function AutoBuild () {

	if (Config.AutoBuild.DebugMode) { Config.AutoBuild.Verbose = true; }

	var debug = !!Config.AutoBuild.DebugMode,
		verbose = !!Config.AutoBuild.Verbose,
		configUpdateLevel = 0;


	// Apply all Update functions from the build template in order from level 1 to me.charlvl.
	// By reapplying all of the changes to the Config object, we preserve
	// the state of the Config file without altering the saved char config.
	function applyConfigUpdates () {
		if (debug) { this.print("Updating Config from level "+configUpdateLevel+" to "+me.charlvl)}
		while (configUpdateLevel < me.charlvl) {
			configUpdateLevel += 1;
			AutoBuildTemplate[configUpdateLevel].Update.apply(Config); // TODO: Make sure this works
		}
	};


	function getBuildType () {
		var build = Config.AutoBuild.Template;
		if (!build) {
			this.print("Config.AutoBuild.Template is either 'false', or invalid ("+build+")");
			throw new Error("Invalid build template, read libs/config/Builds/README.txt for information");
		}
		return build;
	};


	function getCurrentScript () {
		return getScript(true).name.toLowerCase();
	};


	function getLogFilename () {
		var d = new Date();
		var dateString = d.getMonth()+"_"+d.getDate()+"_"+d.getFullYear();
		return "logs/AutoBuild."+me.realm+"."+me.charname+"."+dateString+".log";
	};


	function getTemplateFilename () {
		var classname = ["Amazon", "Sorceress", "Necromancer", "Paladin", "Barbarian", "Druid", "Assassin"][me.classid];
		var build = getBuildType();
		var template = "config/Builds/"+classname+"."+build+".js";
		return template.toLowerCase();
	};


	function initialize () {
		var currentScript = getCurrentScript();
		var template = getTemplateFilename();
		this.print("Including build template "+template+" into "+currentScript);
		if (!include(template)) {
			throw new Error("Failed to include template: "+template);
		}

		// Only load() helper thread from default.dbj if it isn't loaded
		if (currentScript === "default.dbj" && !getScript("tools\\autobuildthread.js")) {
			load("tools/autobuildthread.js");
		}

		// All threads except autobuildthread.js use this event listener
		// to update their thread-local Config object
		if (currentScript !== "tools\\autobuildthread.js") {
			addEventListener("scriptmsg", levelUpHandler);
		}

		// Resynchronize our Config object with all past changes
		// made to it by AutoBuild system
		applyConfigUpdates();
	};


	function levelUpHandler (obj) {
		if (typeof obj === "object" && obj.hasOwnProperty("event") && obj["event"] === "level up") {
			applyConfigUpdates();
		}
	};


	function log (message) { FileTools.appendText(getLogFilename(), message+"\n"); };


	// Only print to console from autobuildthread.js,
	// but log from all scripts
	function myPrint () {
		var args = Array.prototype.slice.call(arguments);
		args.unshift("AutoBuild:");
		var result = args.join(" ");
		if (verbose) { print.call(this, result); }
		if (debug) { log.call(this, result); }
	};


	this.print = myPrint;
	this.initialize = initialize;
	this.applyConfigUpdates = applyConfigUpdates;

};
