/** FireBall Sorceress Lvl 1-30
* Instructions:	Intended for use as build until respec after Izual. 
* Skill IDs:	See /d2bs/kolbot/sdk/skills.txt for a list of skill IDs.
* Stat IDs:
* 	Strength	= 0
* 	Energy		= 1
* 	Dexterity	= 2
* 	Vitality	= 3
*
	Skills				Levelreq			SkillID			TotalPoints

	------------		--------			-------			-----------

	Fire Bolt			    1				  39				20 	- Done @ level 79

	Frozen Armor		    1				  40				 1 	- Done @ level 3

	Warmth 				    1				  37				 1 	- Done @ level 4

	Static Field		    6				  44				 1 	- Done @ level 7

	Telekinesis			    6				  45				20 	- Done @ level 8

	Inferno				    6				  42				 ? 	- Done @ level 6 *****PUMP SKILL QUEST POINTS HERE***** (12 + 4 = 16)

	Telekinesis			    6				  43				 1 	- Done @ level 6

	Blaze				   12				  50				 0 	- Done @ level 12

	Fireball	 		   12				  54				 1 	- Done @ level 18

	Teleport			   18				  55				20 	- Done @ level 93

	Fire Wall	 		   18				  59				20 	- Done @ level 24

	Meteor				   24				  64				 0	- Done @ level 49

	Fire Mastery 		   30				  65				 ?	- Done @ level 64

	TOTAL Points Spent --------------------------------------> 29+4=33 SkillPoints

	Attack Config Variables For Sorceress
	---------------------------------------------------------------------------------------------------------------------
	Config.AttackSkill[0] = -1; // Preattack skill.
	Config.AttackSkill[1] = 59; // Primary skill to bosses.
	Config.AttackSkill[2] = 45; // Primary untimed skill to bosses. Keep at -1 if Config.AttackSkill[1] is untimed skill.
	Config.AttackSkill[3] = 59; // Primary skill to others.
	Config.AttackSkill[4] = 45; // Primary untimed skill to others. Keep at -1 if Config.AttackSkill[3] is untimed skill.
	Config.AttackSkill[5] = -1; // Secondary skill if monster is immune to primary.
	Config.AttackSkill[6] = -1; // Secondary untimed skill if monster is immune to primary untimed.
*/

js_strict(true);



if (!isIncluded("common/Cubing.js")) { include("common/Cubing.js"); };

if (!isIncluded("common/Prototypes.js")) { include("common/Prototypes.js"); };

if (!isIncluded("common/Runewords.js")) { include("common/Runewords.js"); };



var AutoBuildTemplate = {



	1:	{	

			Update: function () {

				Config.AttackSkill = [-1, 36, -1, 0, -1, -1, -1];
				Config.LowManaSkill = [0,0];
				Config.HPBuffer = 2;
				Config.MPBuffer = 8;
				Config.RejuvBuffer = 4; 
				Config.BeltColumn = ["hp", "hp", "hp", "hp"];
				Config.TownCheck = false;
				Config.Dodge = false;
				Config.UseHP = 60;
				Config.UseMP = 20;
				Config.OpenChests = true;

			}

		},

		

	2:	{

			SkillPoints: [36], 											// Fire Bolt + 1 (level 1)

			StatPoints: [0, 0, 0, 0, 0],								// Strength 15

			Update: function () {

			}

		},

		

	3:	{

			SkillPoints: [40], 											// Frozen Armor + 1 (level 1)

			StatPoints: [3, 3, 3, 3, 3],								// Vitality 15

			Update: function () {

			}

		},

		

	4:	{

			SkillPoints: [37],											// Warmth + 1 (level 1)

			StatPoints: [0, 0, 0, 0, 0],								// Strength 20

			Update: function () {

			}

		},



	5:	{

			SkillPoints: [36],											// Fire Bolt + 1 (level 2)

			StatPoints: [3, 3, 3, 3, 3],								// Vitality 20

			Update: function () {



			}

		},



	6:	{

			SkillPoints: [36],										// Fire Bolt + 1 (level 3)

			StatPoints: [0, 0, 0, 0, 0],								// Strength 25

			Update: function () {

				Config.AttackSkill = [-1,36,-1,36,-1,-1,-1];
				Config.BeltColumn = ["hp", "hp", "mp", "mp"];
				Config.UseMP = 30;

			}

		},



	7:	{

			SkillPoints: [36],											// Fire Bolt + 1 (level 4)
			StatPoints: [3, 3, 3, 0, 0],								// Strength 27, Vitality 23

			Update: function () {

			}

		},



	8:	{

			SkillPoints: [36],											// Fire Bolt + 1 (level 5)

			StatPoints: [3, 3, 3, 3, 3],								// Vitality 28

			Update: function () {

				

			}

		},



	9:	{

			SkillPoints: [36],											// Fire Bolt + 1 (level 4)

			StatPoints: [3, 3, 3, 1, 3],								// Vitality 33

			Update: function () {

				

			}

		},



	10:	{

			SkillPoints: [36],											// Fire Bolt + 1 (level 5)

			StatPoints: [3, 3, 3, 3, 1],								// Vitality 38

			Update: function () {

			}

		},



	11:	{	

			SkillPoints: [36],											// Fire Bolt + 1 (level 6)

			StatPoints: [3, 3, 3, 3, 3],								// Vitality 43

			Update: function () {

				

			}

		},



	12:	{

			SkillPoints: [47],											// Fireball + 1 (level 1)

			StatPoints: [0, 0, 0, 0, 0],								// Strength 32

			Update: function () {

				Config.LowManaSkill = [0, 0];
				Config.AttackSkill = [-1, 47, -1, 47, -1, -1, -1];
				Config.UseMP = 45;
			}

		},



	13:	{

			SkillPoints: [47, 42],											// Fireball + 1 (level 2), Static Field + 1 (level 1)

			StatPoints: [0, 0, 0, 0, 0],								// Strength 37

			Update: function () {

				

			}

		},



	14:	{

			SkillPoints: [47],											// Fireball + 1 (level 3)

			StatPoints: [3, 3, 3, 3, 3],								// Vitality 48

			Update: function () {

			}

		},



	15:	{

			SkillPoints: [47],											// Fireball + 1 (level 4)

			StatPoints: [3, 3, 3, 3, 1],								// Vitality 53

			Update: function () {
				Config.OpenChests = false;
				Config.TownCheck = true;
				//Config.PickitFiles.push("auto/MercWeapon.nip"); *For Act 2 Merc

			}

		},



	16:	{
			SkillPoints: [47],											// Fireball + 1 (level 5)
			StatPoints: [0, 0, 0, 0, 0],								// Strength 42
			Update: function () {
				
			}

		},



	17:	{
			SkillPoints: [43],											// Telekinesis + 1 (level 1)
			StatPoints: [0, 0, 0, 0, 0],								// Strength 47
			Update: function () {
				
			}

		},



	18:	{
			SkillPoints: [54, 47],											// Teleport + 1 (level 1) 
			StatPoints: [0, 0, 0, 3, 3],								// Strength 50, Vitality 55
			Update: function () {		
				Config.Cubing = true;
				Config.UseMP = 70;
				Config.UseHP = 80;

			}

		},



	19:	{
			SkillPoints: [47],											// Fireball + 1 (level 6)
			StatPoints: [3, 3, 3, 3, 3],								// Vitality 60
			Update: function () {
			Config.LowGold = 75000;
			}

		},



	20:	{
			SkillPoints: [47],											// Fireball + 1 (level 7)
			StatPoints: [3, 3, 3, 3, 3],								// Vitality 65
			Update: function () {

			}

		},



	21:	{	
			SkillPoints: [47],											// Fireball + 1 (level 8)
			StatPoints: [3, 3, 3, 3, 3],								// Vitality 70
			Update: function () {

			}

		},



	22:	{
			SkillPoints: [47],											// Fireball + 1 (level 9)
			StatPoints: [3, 3, 3, 3, 3],								// Vitality 75
			Update: function () {

			}

		},



	23:	{
			SkillPoints: [47],											// Fireball + 1 (level 10)
			StatPoints: [3, 3, 3, 3, 3],								// Vitality 80
			Update: function () {

			}

		},



	24:	{
			SkillPoints: [47],											// Fireball + 1 (level 11)
			StatPoints: [3, 3, 3, 3, 3],								// Vitality 85
			Update: function () {
				Config.BeltColumn = ["hp", "mp", "mp", "mp"];

			}

		},



	25:	{
			SkillPoints: [47],											// Fireball + 1 (level 12)
			StatPoints: [0, 0, 0, 0, 0],								// Strength 55
			Update: function () {

			}

		},



	26:	{
			SkillPoints: [47],											// Fireball + 1 (level 12)							
			StatPoints: [0, 0, 0, 3, 3],								// Strength 58 Vitality 87
			Update: function () {	
				Config.Dodge = true;
			}

		},



	27:	{
			SkillPoints: [47],											// Fireball + 1 (level 13)
			StatPoints: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],					// Vitality 97
			Update: function () {
				
			}

		},



	28:	{
			SkillPoints: [47],											// Fireball + 1 (level 14)
			StatPoints: [3, 3, 3, 3, 3],								// Vitality 103
			Update: function () {

			}

		},



	29:	{
			SkillPoints: [47],											// Fireball + 1 (level 15)
			StatPoints: [3, 3, 3, 3, 3],								// Vitality 108
			Update: function () {

			}

		},



	30:	{
			SkillPoints: [61],										// Fire Mastery + 1 (level 1)
			StatPoints: [3, 3, 3, 3, 3],								// Vitality 113
			Update: function () {
				
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
