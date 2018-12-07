/**
*	@filename	AutoSkill.js
*	@author		Original work by Nad42, edited by IMBA
*	@desc		Automatically allocate skill points and its pre-requisites if necessary
*/

var AutoSkill = new function () {
	this.skillBuildOrder = [];
	this.save = 0;

	/*	skillBuildOrder - array of skill points to spend in order
		save - number of skill points that will not be spent and saved

		skillBuildOrder Settings
		Set skillBuildOrder in the array form: [[skill, count, satisfy], [skill, count, satisfy], ... [skill, count, satisfy]]
		 skill - skill id number (see /sdk/skills.txt)
		 count - maximum number of skill points to allocate for that skill
		 satisfy - boolean value to stop(true) or continue(false) further allocation until count is met. Defaults to true if not specified.

		skillBuildOrder = [
			[37, 1, true], [42, 1, true], [54, 1, true],  //warmth, static, teleport
			[59, 1, false], [55, 7, true], [45, 13, true], //blizzard, glacial spike, ice blast
			[59, 7, false], [65, 1, true], //blizzard, cold mastery
			[59, 20, false], [65, 20, true], //max blizzard, max cold mastery
			[55, 20, true], [45, 20, true], //max glacial spike, max ice blast
		];
	*/

	this.needPreReq = function (skillid) {	//a function to return false if have all prereqs or a skill if not
		for (var t = 183; t >=181; t--) {		//a loop to go through each reqskill
			var preReq = (getBaseStat('skills', skillid, t));      // Check ReqSkills

			if (preReq > 0 && preReq < 356 && !me.getSkill(preReq, 0)) {
				return preReq;
			}
		}

		return false;
	};

	this.skillCheck = function (skillid, count){
		if (me.getSkill(skillid, 0) <= me.charlvl - getBaseStat("skills", skillid, 176) && me.getSkill(skillid, 0) < count) {
			return true;
		}

		return false;
	};

	this.skillToAdd = function (inputArray) {
		for (var i = 0; i < inputArray.length; i += 1) {
			// limit maximum allocation count to 20
			if (inputArray[i][1] > 20) {
				print("AutoSkill: Skill build index " + i + " has allocation count of " + inputArray[i][1] + " and it will be limited to 20");
				inputArray[i][1] = 20;
			}

			// set satify condition as default if not specified
			if (inputArray[i][2] === undefined)
				inputArray[i][2] = true;

			// check to see if skill count in previous array is satisfied
			if (i > 0 && inputArray[i-1][2] && (!me.getSkill(inputArray[i-1][0], 0) ? 0 : me.getSkill(inputArray[i-1][0], 0)) < inputArray[i-1][1]) {
				return false;
			}

			if (me.getSkill(inputArray[i][0], 0) && this.skillCheck(inputArray[i][0], inputArray[i][1])) {
				return inputArray[i][0];
			}

			var reqIn,
				reqOut = this.needPreReq(inputArray[i][0]);

			if (!reqOut && this.skillCheck(inputArray[i][0], inputArray[i][1])) {
				return inputArray[i][0];
			}

			while (reqOut) {
				reqIn = reqOut;
				reqOut = this.needPreReq(reqIn);
			}

			if (this.skillCheck(reqIn, 1)) {
				return reqIn;
			}
		}

		return false;
	};

	this.allocate = function () {
		var tick = getTickCount();

		this.remaining = me.getStat(5);

		if (!getUIFlag(0x17)) {
			var addTo = this.skillToAdd(this.skillBuildOrder);

			if (addTo) {
				print("AutoSkill: Using skill point in Skill ID: " + addTo);
				delay(100);
				useSkillPoint(addTo, 1);
			}
		}

		while (getTickCount() - tick < 1500 + 2 * me.ping) {
			if (this.remaining > me.getStat(5)) {
				return true;
			}

			delay(100);
		}

		return false;
	};

	this.remaining = 0;
	this.count = 0;

	this.init = function (skillBuildOrder, save = 0) {
		this.skillBuildOrder = skillBuildOrder;
		this.save = save;

		if (!this.skillBuildOrder || !this.skillBuildOrder.length) {
			print("AutoSkill: No build array specified");

			return false;
		}

		while (me.getStat(5) > this.save) {
			this.allocate();
			delay(200 + me.ping); // may need longer delay under high ping

			// break out of loop if we have skill points available but cannot allocate further due to unsatisfied skill
			if (me.getStat(5) === this.remaining) {
				this.count += 1;
			}

			if (this.count > 2) {
				break;
			}
		}

		print("AutoSkill: Finished allocating skill points");

		return true;
	};

	return true;
};