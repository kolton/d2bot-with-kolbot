//	/d2bs/kolbot/libs/Builds/Sorceress.ExampleBuild.js

/**
*
* Instructions:	See /d2bs/kolbot/libs/config/Builds/README.txt
*
* Skill IDs:	See /d2bs/kolbot/sdk/skills.txt for a list of skill IDs.
*
* Stat IDs:
*
* 	Strength	= 0
* 	Energy		= 1
* 	Dexterity	= 2
* 	Vitality	= 3
*
*/
js_strict(true);

if (!isIncluded("common/Cubing.js")) { include("common/Cubing.js"); };
if (!isIncluded("common/Prototypes.js")) { include("common/Prototypes.js"); };
if (!isIncluded("common/Runewords.js")) { include("common/Runewords.js"); };
if (!isIncluded("common/Town.js")) { include("common/Town.js"); };

var AutoBuildTemplate = {

	1:	{
			//SkillPoints: [-1],											// This doesn't matter. We don't have skill points to spend at lvl 1
			//StatPoints: [-1,-1,-1,-1,-1],								// This doesn't matter. We don't have stat points to spend at lvl 1
			Update: function () {

				Scripts.ClearAnyArea = true;							// We are only level 1 so we will start by clearing Blood Moor
					Config.ClearAnyArea.AreaList = [2];
				Config.ClearType = 0; 									// Monster spectype to kill in level clear scripts (0 = all)

				// Config.PickitFiles.push("level/1.nip");				// File "level/1.nip" is not included, it's just an example.

				Config.OpenChests		= true; 						// Open chests. Controls key buying.
				Config.LogExperience	= false; 						// Print experience statistics in the manager.
				Config.StashGold 		= 200;							// Minimum amount of gold to stash.
				Config.AttackSkill		= [0, 36, -1, 36, 36, 0, 0];	// At level 1 we start with a +1 Fire Bolt staff
				Config.LowManaSkill		= [0, 0];
				Config.PublicMode		= 1;
				Config.ScanShrines		= [15, 13, 12, 14, 7, 6, 2];
				Config.BeltColumn		= ["hp", "hp", "hp", "mp"];		// Keep tons of health potions!
			}
		},

	2:	{
			SkillPoints: [36], 											// Fire Bolt + 1
			StatPoints: [0, 3, 3, 3, 3],								// Strength + 1 , Vitality + 4
			Update: function () {
				// Config.PickitFiles.splice(Config.PickitFiles.indexOf("level/1.nip"), 1);	// Will remove index "level/1.nip" from Config.PickitFiles
				// Config.PickitFiles.push("level/2.nip");
				Config.BeltColumn = ["hp", "hp", "mp", "mp"];
				Config.MinColumn = [1, 1, 1, 1];
			}
		},

	3:	{
			SkillPoints: [39], 										// Ice Bolt + 1
			StatPoints: [0, 0, 3, 3, 3],							// Strength + 2 , Vitality + 3
			Update: function () {
				Config.AttackSkill = [39, 36, -1, 36, 0, 0, 0];		// Ice Bolt and Fire Bolt
			}
		},

	4:	{
			SkillPoints: [37],											// Warmth + 1
			StatPoints: [0, 0, 0, 3, 3],							// Strength + 3 , Vitality + 2
			Update: function () {
				Scripts.Corpsefire = true;							// Lets try Corpsefire now that we're level 4
					Config.Corpsefire.ClearDen = true;

				Scripts.ClearAnyArea = false;						// Don't want to clear Blood Moor anymore (See lvl 1 above)
					Config.ClearAnyArea.AreaList = [];

				Config.BeltColumn = ["hp", "hp", "mp", "rv"]; 		// Start keeping rejuvs since we have +1 Warmth
				Config.MinColumn	= [1, 1, 1, 0];
			}
		},

	5:	{
			SkillPoints: [38],											// Charged Bolt + 1
			StatPoints: [0, 0, 0, 0, 3],							// Strength + 4 , Vitality + 1
			Update: function () {

				Scripts.ClearAnyArea = true;						// Now we'll try enabling it again Cold Plains and Stony Field
					Config.ClearAnyArea.AreaList = [3, 4];

				Config.ScanShrines	= [15, 13, 12];
				Config.AttackSkill 	= [39, 36, -1, 38, 0, 39, 0];	// All the bolts!
			}
		},

	6:	{
			SkillPoints: [36],											// Fire Bolt + 1
			StatPoints: [0, 0, 3, 3, 2],							// Strength + 2 , Vitality + 2, Dexterity + 1
			Update: function () {
				Config.AttackSkill = [39, 36, -1, 36, 0, 38, 0];	// All the bolts!
			}
		},

	7:	{
			SkillPoints: [-1],											// TODO
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	8:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	9:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	10:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	11:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	12:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	13:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	14:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	15:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	16:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	17:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	18:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	19:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	20:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	21:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	22:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	23:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	24:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	25:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	26:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	27:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	28:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	29:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	30:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	31:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	32:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	33:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	34:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	35:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	36:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	37:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	38:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	39:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	40:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	41:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	42:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	43:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	44:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	45:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	46:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	47:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	48:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	49:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	50:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	51:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	52:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	53:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	54:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	55:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	56:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	57:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	58:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	59:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	60:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	61:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	62:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	63:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	64:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	65:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	66:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	67:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	68:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	69:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	70:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	71:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	72:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	73:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	74:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	75:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	76:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	77:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	78:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	79:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	80:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	81:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	82:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	83:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	84:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	85:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	86:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	87:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	88:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	89:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	90:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	91:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	92:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	93:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	94:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	95:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	96:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	97:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	98:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	99:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		}
};