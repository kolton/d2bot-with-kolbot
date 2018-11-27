//	/d2bs/kolbot/libs/config/Builds/Class.Build.js

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
			//SkillPoints: [-1],								// This doesn't matter. We don't have skill points to spend at lvl 1
			//StatPoints: [-1,-1,-1,-1,-1],						// This doesn't matter. We don't have stat points to spend at lvl 1
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	2:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	3:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	4:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	5:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	6:	{
			SkillPoints: [-1],
			StatPoints: [-1,-1,-1,-1,-1],
			Update: function () {
				Config.AttackSkill = [-1,-1,-1,-1,-1,-1,-1];
				Config.LowManaSkill = [-1,-1];
			}
		},

	7:	{
			SkillPoints: [-1],
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