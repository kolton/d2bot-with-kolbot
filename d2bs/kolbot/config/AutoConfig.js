/**
 * @description This is the new, simplified, unified, config file
 */
(function (module, require, Config, AutoConfig, StarterConfig, Scripts = {}) {

	// You can override here the settings of the entry script.
	Config.Follow = ''; // which profile you want to follow? join games and such. Leave blank for non


	// here you setup everything of the StarterConfig (what you did before in D2BotWhatever.dbj)
	StarterConfig.JoinChannel = '';

	// Run all auto configurations.
	// This sets everything to chosen defaults,
	AutoConfig();


	// In case you dont agree with some of the stuff the auto configuration came with,
	// feel free to override it here
	//
	// Note that most of original kolton's settings just work here

	// Example:
	//Config.PacketCasting = 2; // Rather use full packet casting


	// Here go your scripts as your used to. You can paste them from Scripts.txt.
	Scripts.Baal = true;


	// Here go the pickit files
	Config.PickitFiles.push("pots.nip");


// No touchy
	module.exports = Scripts; // and in the end, give this config back
})(module, require, require('Config'), require('AutoConfig'), require('Config').StarterConfig, undefined);