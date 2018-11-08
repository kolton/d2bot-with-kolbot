README.txt - AutoBuild Script Installation and Configuration


	DISCLAIMER:	By continuing to read this file and use these scripts you agree that I
	take no responsibility for anything that may happen to yourself, your character, or your account
	as a result of the use or misuse of these files.


	This file will help guide you through installing and configuring the AutoBuild scripts
	in kolbot Temp branch (SHA-1: c82de3efbdcd62b82ffda3a8d93eecd512cd956a)

	Also, I'm going to make and post a patch for anyone that wishes to use that instead.
	If you apply the patch, you can start reading at step 5.




1.	Extract the contents of the AutoBuild.zip file to base directory located at
	/d2bs/kolbot/  	(Do not add the filename to the extraction path)

	NOTE: Nothing should be overwritten in this step.. You can/should actually
	disable automatic overwrite of files in your zip extracting software.




2.	Verify that the following files exist in these locations:
	/d2bs/kolbot/tools/AutoBuildThread.js
	/d2bs/kolbot/libs/common/AutoBuild.js
	/d2bs/kolbot/libs/config/Builds/Class.Build.js
	/d2bs/kolbot/libs/config/Builds/README.txt
	/d2bs/kolbot/libs/config/Builds/Sorceress.ExampleBuild.js




3.	Add this "AutoBuild" sub-object enclosed in the lines of forward slashes to the end of your
	Config object in file /d2bs/kolbot/libs/common/Config.js. The ClearAnyArea, Rusher, and Rushee sub-objects
	have nothing to do with the AutoBuild scripts, they were included for context.

	ClearAnyArea: {
		AreaList: []
	},
	Rusher: {
		WaitPlayerCount: 0
	},
	Rushee: {
		Quester: false,
		Bumper: false
	},						// <------- NOTE THE ADDED COMMA!

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	AutoBuild: {
		Enabled: false,
		Template: "",
		Verbose: false,
		DebugMode: false
	}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

};




4.	Add the try/catch block enclosed in the lines of forward slashes to the end of your Config object's "init"
	function in file /d2bs/kolbot/libs/common/Config.js. The surrounding material is shown for context.

			try {
			LoadConfig.call();
		} catch (e2) {
			if (notify) {
				print("ÿc8Error in " + e2.fileName.substring(e2.fileName.lastIndexOf("\\") + 1, e2.fileName.length) + "(line " + e2.lineNumber + "): " + e2.message);

				throw new Error("Config.init: Error in character config.");
			}
		}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		try {
			if (Config.AutoBuild.Enabled === true && !isIncluded("common/AutoBuild.js") && include("common/AutoBuild.js")) {
				AutoBuild.initialize();
			}
		} catch (e3) {
			print("ÿc8Error in libs/common/AutoBuild.js (AutoBuild system is not active!)");
			print(e3.toSource());
		}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	},

	// Time
	StartDelay: 0,
	PickDelay: 0,
	AreaDelay: 0,
	MinGameTime: 0,
	MaxGameTime: 0,

	// Healing and chicken
	LifeChicken: 0,
	ManaChicken: 0,
	UseHP: 0,




5.	Next, create a copy of the base build template provided /d2bs/kolbot/libs/config/Builds/Class.Build.js
	and rename it in the following format: "CharacterClass.BuildName.js"

	For example, if you want to make a template for a hammerdin,
	you would name the file something like "Paladin.Hammerdin.js" or "Paladin.MyHdin.js"




6.	Add this section to your char config file.

	Config.AutoBuild.Enabled = false;			//	This will enable or disable the AutoBuild system

	Config.AutoBuild.Template = "BuildName";	//	The name of the build associated with an existing
												//	template filename located in libs/config/Builds/
												//	See libs/config/Builds/README.txt for instructions

	Config.AutoBuild.Verbose = true;			//	Allows script to print messages in console

	Config.AutoBuild.DebugMode = true;			//	Debug mode prints a little more information to console and
												//	logs activity to /logs/AutoBuild.CharacterName._MM_DD_YYYY.log
												//	It automatically enables Config.AutoBuild.Verbose




7.	Now you need to set your config variables.

	To enable or disable the AutoBuild system, adjust the boolean Config.AutoBuild.Enabled accordingly.
	Set Config.AutoBuild.Template to a string value which represents the "BuildName" part of your
	build template filename you created in step 5.

	For example, if your template filename is "Paladin.Hammerdin.js" you would write Config.AutoBuild.Template = "Hammerdin";
	in your char config file. If your template filename is "Paladin.MyHdin.js", you would write Config.AutoBuild.Template = "MyHdin";

	If you want to see script messages in the D2BS console, set Config.AutoBuild.Verbose = true;
	If you want to log script messages and display some extra information in certain cases in the console and log file,
	set Config.AutoBuild.DebugMode = true;




8.	Now that the easy part is done you will need to edit your build template that you created in step 5.
	This is the point where it's worth explaining some of the internal behavior of these scripts.
	Please read the whole section below before actually editing any of the file!

	The best way to think of this AutoBuild system is an automation system for your char config settings.
	You still need to make and setup a basic char config file for your character or profile
	just as you normally would to run without the AutoBuild system enabled. (See https://github.com/kolton/d2bot-with-kolbot/wiki)
	This script just adjusts and overwrites anything you want it to within your Config object once it's loaded by kolbot.
	(NOTE: Overwrites the char config in memory, not on disk!)

	When the threaded helper script detects that your character has gained a level, it looks up the skills and stats
	you have set in your build template file (step 5), validates them, and spends them according to your template.

	Then the helper script broadcasts to the other scripts that your character has gained a level.
	When this happens, all scripts that are using the AutoBuild system will update their local copy of the "Config" object which,
	as you know, is where all of your character configuration settings live while your bot is running. This occurs through the "Update"
	functions that are defined for each level of your build template.

	This system gives you the power to adjust your character configuration settings on-the-fly, without having to reload any
	scripts or wait for the next game (for some things). Since all of the kolbot libraries use your char config settings to make decisions,
	you can alter the overall behavior of the bot on a per-level basis without having to spend time making manual changes
	to your character config file every time you want to bot a different area.

	For example, when you level up, you can set this to add a new skill point, and then immediately adjust the Config object
	to use this newly acquired skill as your main attack.

	The build template is one large object named "AutoBuildTemplate". Don't change the name.
	It's comprised of 99 sub-objects which are indexed by character level (Number).
	At every character level (except level 1) you may set skill and stat points which the bot will spend when it reaches that level.
	Lookup skill ids in the /d2bs/kolbot/sdk/ folder. Valid stat ids are 0 (Strength), 1 (Energy), 2 (Dexterity), or 3 (Vitality).
	You may set multiple skill and stat points per level. Anything set to -1 will be silently ignored, so you can use -1 if
	you don't want to spend points at a certain level. (Or just completely remove the value from the array)

	NOTE: The scripts DO NOT limit the number of skills and stats spent upon each level up event.
	You are responsible for keeping track of the number of accrued points versus the number of points spent
	at each level in your build template. However, there are safety measures in place to prevent spending points your character doesn't have.
	I suggest not trying to spend points based on whether a quest was completed or not, unless you really know what you are doing and write
	the additional logic required to make that determination.

	Every time you level up, the "Update" function within the corresponding character level is called.
	This is where you make CHANGES to the "Config" object. You can make changes in the same format you usually do in your char config file.

	For example, at level four if you want to start running the Corpsefire/Den of Evil script, you would do something like this.


	4:	{
			SkillPoint: 37,											// Warmth + 1
			StatPoints: [0, 0, 0, 3, 3],							// Strength + 3 , Vitality + 2
			Update: function () {
				Scripts.Corpsefire = true;							// Try going for Corpsefire now that we're level 4
				Config.Corpsefire.ClearDen = true;
				Config.BeltColumn = ["hp", "hp", "mp", "rv"]; 		// Replace mana pots with rejuvs since we have +1 Warmth
				Config.MinColumn	= [1, 1, 1, 0];
			}
		},


	If you know javascript you may be interested to know that the "Update" function is called with its "this" identifier pointing to the "Config" object.
	Therefore changing the values using "this" instead of "Config" (ie, this.BeltColumn = ... vs Config.BeltColumn = ...) might be marginally faster,
	but I'm not sure it really matters so much.

	It's also worth noting that at the start of every game, each "Update" function in your build template is executed, in order, from level 1 to
	your current character level. This is done in order to preserve the integrity of the Config object across multiple games without having
	to save over the char config file on disk.

	So basically, any changes you want to undo from a previous level's Update function, you need to do programmatically or
	comment it out in the previous level's Update function. Making changes programatically is MUCH better and will lead to less hastle,
	especially if you are using the same build template for multiple characters!

	Please take a look at the "ExampleBuild" for Sorceresses at /d2bs/kolbot/libs/config/Builds/Sorceress.ExampleBuild.js
	for more example code/setup/usage.

	Enjoy the ladder reset and good luck!


	- alogwe

