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


var AutoBuildTemplate = {

	1:	{	
			//SkillPoint: -1,											// This doesn't matter. We don't have skill points to spend at lvl 1
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
			SkillPoint: 36, 											// Fire Bolt + 1
			StatPoints: [0, 3, 3, 3, 3],								// Strength + 1 , Vitality + 4
			Update: function () {
				// Config.PickitFiles.splice(Config.PickitFiles.indexOf("level/1.nip"), 1);	// Will remove index "level/1.nip" from Config.PickitFiles
				// Config.PickitFiles.push("level/2.nip");
				Config.BeltColumn = ["hp", "hp", "mp", "mp"];
				Config.MinColumn = [1, 1, 1, 1];
			}
		},
		
	3:	{
			SkillPoint: 39, 										// Ice Bolt + 1
			StatPoints: [0, 0, 3, 3, 3],							// Strength + 2 , Vitality + 3
			Update: function () {
				Config.AttackSkill = [39, 36, -1, 36, 0, 0, 0];		// Ice Bolt and Fire Bolt
			}
		},
		
	4:	{
			SkillPoint: 37,											// Warmth + 1
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
			SkillPoint: 38,											// Charged Bolt + 1
			StatPoints: [0, 0, 0, 0, 3],							// Strength + 4 , Vitality + 1
			Update: function () {
				
				Scripts.ClearAnyArea = true;						// Now we'll try enabling it again Cold Plains and Stony Field
					Config.ClearAnyArea.AreaList = [3, 4]; 				
				
				Config.ScanShrines	= [15, 13, 12];
				Config.AttackSkill 	= [39, 36, -1, 38, 0, 39, 0];	// All the bolts!
			}
		},

	6:	{
			SkillPoint: 36,											// Fire Bolt + 1
			StatPoints: [0, 0, 3, 3, 2],							// Strength + 2 , Vitality + 2, Dexterity + 1
			Update: function () {
				Config.AttackSkill = [39, 36, -1, 36, 0, 38, 0];	// All the bolts!
			}
		},

	7:	{
			SkillPoint: -1,											// TODO
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	8:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	9:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	10:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	11:	{	
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	12:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	13:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	14:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	15:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	16:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	17:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	18:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	19:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	20:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	21:	{	
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	22:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	23:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	24:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	25:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	26:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	27:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	28:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	29:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	30:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	31:	{	
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	32:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	33:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	34:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	35:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	36:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	37:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	38:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	39:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	40:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	41:	{	
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	42:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	43:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	44:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	45:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	46:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	47:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	48:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	49:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	50:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	51:	{	
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	52:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	53:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	54:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	55:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	56:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	57:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	58:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	59:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	60:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	61:	{	
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	62:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	63:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	64:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	65:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	66:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	67:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	68:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	69:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	70:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	71:	{	
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	72:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	73:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	74:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	75:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	76:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	77:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	78:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	79:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	80:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	81:	{	
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	82:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	83:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	84:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	85:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	86:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	87:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	88:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	89:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	90:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	91:	{	
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	92:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	93:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	94:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	95:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	96:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	97:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	98:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	99:	{
			SkillPoint: -1,
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		}
};
