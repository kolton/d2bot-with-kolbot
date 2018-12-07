/**
*	@title	:	AutoBuildThread.js
*
*	@author	:	alogwe
*
*	@desc	:	A script that will automatically allocate skill and stat points based on a configurable
*				character build table. Point spending occurs on level up. Additional skill and stat points
*				rewarded by quests are currently not used by this script.
*/

js_strict(true);

if (!isIncluded("common/AutoSkill.js")) { include("common/AutoSkill.js"); };
if (!isIncluded("common/AutoStat.js")) { include("common/AutoStat.js"); };
if (!isIncluded("common/Config.js")) { include("common/Config.js"); };
if (!isIncluded("common/Cubing.js")) { include("common/Cubing.js"); };
if (!isIncluded("common/Prototypes.js")) { include("common/Prototypes.js"); };
if (!isIncluded("common/Runewords.js")) { include("common/Runewords.js"); };
if (!isIncluded("common/Town.js")) { include("common/Town.js"); };

Config.init(); // includes libs/common/AutoBuild.js

var	debug				= 	!!Config.AutoBuild.DebugMode;
var	prevLevel			= 	me.charlvl;
const SPEND_POINTS 		= 	true;						// For testing, it actually allows skill and stat point spending.
const STAT_ID_TO_NAME	=	[getLocaleString(4060),		// Strength
							getLocaleString(4069),		// Energy
						 	getLocaleString(4062),		// Dexterity
						 	getLocaleString(4066)];		// Vitality


// Will check if value exists in an Array
Array.prototype.contains = function (val) { return this.indexOf(val) > -1; };


function skillInValidRange (id) {
	switch (me.classid) {
		case 0:	return	6 <= id && id <= 35;	// Amazon
		case 1: return 36 <= id && id <= 65;	// Sorceress
		case 2:	return 66 <= id && id <= 95;	// Necromancer
		case 3:	return 96 <= id && id <= 125;	// Paladin
		case 4:	return 126 <= id && id <= 155;	// Barbarian
		case 5:	return 221 <= id && id <= 250;	// Druid
		case 6:	return 251 <= id && id <= 280;	// Assassin
		default:
	}
	return false;
};


function gainedLevels () { return me.charlvl - prevLevel; };


function canSpendPoints () {
	var unusedStatPoints = me.getStat(4);
	var haveUnusedStatpoints = unusedStatPoints >= 5;	// We spend 5 stat points per level up
	var unusedSkillPoints = me.getStat(5);
	var haveUnusedSkillpoints = unusedSkillPoints >= 1;	// We spend 1 skill point per level up
	if (debug) { AutoBuild.print("Stat points:", unusedStatPoints, "     Skill points:", unusedSkillPoints); }
	return haveUnusedStatpoints && haveUnusedSkillpoints;
};


function spendStatPoint (id) {
	var unusedStatPoints = me.getStat(4);
	if (SPEND_POINTS) {
		useStatPoint(id);
		AutoBuild.print("useStatPoint("+id+"): "+STAT_ID_TO_NAME[id]);
	} else {
		AutoBuild.print("Fake useStatPoint("+id+"): "+STAT_ID_TO_NAME[id]);
	}
	delay(100);											// TODO: How long should we wait... if at all?
	return (unusedStatPoints - me.getStat(4) === 1);	// Check if we spent one point
};


// TODO: What do we do if it fails? report/ignore/continue?
function spendStatPoints () {
	var stats = AutoBuildTemplate[me.charlvl].StatPoints;
	var errorMessage = "\nInvalid stat point set in build template "+getTemplateFilename()+" at level "+me.charlvl;
	var spentEveryPoint = true;
	var unusedStatPoints = me.getStat(4);
	var len = stats.length;

	if (Config.AutoStat.Enabled) {
		return spentEveryPoint;
	}

	if (len > unusedStatPoints) {
		len = unusedStatPoints;
		AutoBuild.print("Warning: Number of stats specified in your build template at level "+me.charlvl+" exceeds the available unused stat points"+
			"\nOnly the first "+len+" stats "+stats.slice(0, len).join(", ")+" will be added");
	}

	// We silently ignore stats set to -1
	for (var i = 0; i < len; i++) {
		var id = stats[i];
		var statIsValid = (typeof id === "number") && (0 <= id && id <= 3);

		if (id === -1) { continue; }
		else if (statIsValid) {
			var preStatValue = me.getStat(id);
			var pointSpent = spendStatPoint(id);
			if (SPEND_POINTS) {
				if (!pointSpent) {
					spentEveryPoint = false;
					AutoBuild.print("Attempt to spend point "+(i+1)+" in "+STAT_ID_TO_NAME[id]+" may have failed!");
				} else if (debug) {
					AutoBuild.print("Stat ("+(i+1)+"/"+len+") Increased "+STAT_ID_TO_NAME[id]+" from "+preStatValue+" to "+me.getStat(id));
				}
			}
		} else {
			throw new Error("Stat id must be one of the following:\n0:"+STAT_ID_TO_NAME[0] +
				",\t1:"+STAT_ID_TO_NAME[1]+",\t2:"+STAT_ID_TO_NAME[2]+",\t3:"+STAT_ID_TO_NAME[3] + errorMessage);
		}
	}

	return spentEveryPoint;
};


function getTemplateFilename () {
	var classname = ["Amazon", "Sorceress", "Necromancer", "Paladin", "Barbarian", "Druid", "Assassin"][me.classid];
	var buildType = Config.AutoBuild.Template;
	var templateFilename = "config/Builds/"+classname+"."+buildType+".js";
	return templateFilename;
};


function getRequiredSkills (id) {

	function searchSkillTree (id) {
		var results = [];
		var skillTreeRight	= getBaseStat("skills", id, 181);
		var skillTreeMiddle	= getBaseStat("skills", id, 182);
		var skillTreeLeft	= getBaseStat("skills", id, 183);

		results.push(skillTreeRight);
		results.push(skillTreeMiddle);
		results.push(skillTreeLeft);

		for (var i = 0; i < results.length; i++) {
			var skill = results[i];
			var skillInValidRange = (0 < skill && skill <= 280) && (![217, 218, 219, 220].contains(skill));
			var hardPointsInSkill = me.getSkill(skill, 0);

			if (skillInValidRange && !hardPointsInSkill) {
				requirements.push(skill);
				searchSkillTree(skill);	// search children;
			}
		}
	};

	var requirements = [];
	searchSkillTree(id);
	function increasing (a, b) { return a-b; };
	return requirements.sort(increasing);
};


function spendSkillPoint (id) {
	var unusedSkillPoints = me.getStat(5);
	var skillName = getSkillById(id)+" ("+id+")";		// TODO: Use let ?
	if (SPEND_POINTS) {
		useSkillPoint(id);
		AutoBuild.print("useSkillPoint(): "+skillName);
	} else {
		AutoBuild.print("Fake useSkillPoint(): "+skillName);
	}
	delay(200);											// TODO: How long should we wait... if at all?
	return (unusedSkillPoints - me.getStat(5) === 1);	// Check if we spent one point
};


function spendSkillPoints () {
	var skills = AutoBuildTemplate[me.charlvl].SkillPoints;
	var errInvalidSkill = "\nInvalid skill point set in build template "+getTemplateFilename()+" for level "+me.charlvl;
	var spentEveryPoint = true;
	var unusedSkillPoints = me.getStat(5);
	var len = skills.length;

	if (Config.AutoSkill.Enabled) {
		return spentEveryPoint;
	}

	if (len > unusedSkillPoints) {
		len = unusedSkillPoints;
		AutoBuild.print("Warning: Number of skills specified in your build template at level "+me.charlvl+" exceeds the available unused skill points"+
			"\nOnly the first "+len+" skills "+skills.slice(0, len).join(", ")+" will be added");
	}

	// We silently ignore skills set to -1
	for (var i = 0; i < len; i++) {
		var id = skills[i];								// TODO: Use let ?

		if (id === -1) { continue; }
		else if (!skillInValidRange(id)) {
			throw new Error("Skill id "+id+" is not a skill for your character class"+errInvalidSkill);
		}

		var skillName = getSkillById(id)+" ("+id+")";	// TODO: Use let ?
		var requiredSkills = getRequiredSkills(id);
		if (requiredSkills.length > 0) {
			throw new Error("You need prerequisite skills "+requiredSkills.join(", ")+" before adding "+skillName+errInvalidSkill);
		}

		var requiredLevel = getBaseStat("skills", id, 176);
		if (me.charlvl < requiredLevel) {
			throw new Error("You need to be at least level "+requiredLevel+" before you get "+skillName+errInvalidSkill);
		}

		var pointSpent = spendSkillPoint(id);

		if (SPEND_POINTS) {
			if (!pointSpent) {
				spentEveryPoint = false;
				AutoBuild.print("Attempt to spend skill point "+(i+1)+" in "+skillName+" may have failed!");
			} else if (debug) {
				var actualSkillLevel = me.getSkill(id, 1);
				AutoBuild.print("Skill ("+(i+1)+"/"+len+") Increased "+skillName+" by one (level: ", actualSkillLevel+")");
			}
		}

		delay(200);	// TODO: How long should we wait... if at all?
	}

	return spentEveryPoint;
};



/*
*	TODO: determine if changes need to be made for
*	the case of gaining multiple levels at once so as
*	not to bombard the d2bs event system
*/

function main () {
	try {
		AutoBuild.print("Loaded helper thread");

		while (true) {
			var levels = gainedLevels();

			if (levels > 0 && (canSpendPoints() || Config.AutoSkill.Enabled || Config.AutoStat.Enabled)) {
				scriptBroadcast("toggleQuitlist");
				AutoBuild.print("Level up detected (", prevLevel, "-->", me.charlvl, ")");
				spendSkillPoints();
				spendStatPoints();
				scriptBroadcast({event: "level up"});
				AutoBuild.applyConfigUpdates(); // scriptBroadcast() won't trigger listener on this thread.

				if (debug) {
					AutoBuild.print("Incrementing cached character level to", prevLevel + 1);
				}

				if (Config.AutoSkill.Enabled) {
					AutoSkill.init(Config.AutoSkill.Build, Config.AutoSkill.Save);
				}

				if (Config.AutoStat.Enabled) {
					AutoStat.init(Config.AutoStat.Build, Config.AutoStat.Save, Config.AutoStat.BlockChance, Config.AutoStat.UseBulk);
				}

				// prevLevel doesn't get set to me.charlvl because
				// we may have gained multiple levels at once
				prevLevel += 1;

				scriptBroadcast("toggleQuitlist");
			}

			delay(1e3);
		}
	} catch (err) {
		print("Something broke!");
		print("Error:"+ err.toSource());
		print("Stack trace: \n"+ err.stack);
		return false;
	}

	return true;
};