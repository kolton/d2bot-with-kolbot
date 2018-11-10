/** This is for Blizzard Sorceress
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

Finished Char Build:

	Stats													Base Stats
	----------												----------
 	Strength: 45 (35 points used)								10
 	Energy: 35 (no points)										35
 	Dexterity: 25 (no points) (+35 from gear)					25
 	Vitality: 460 (includes points from quests)					10

	Skills				Levelreq			SkillID			TotalPoints
	------------		--------			-------			-----------
	Ice Bolt			    1				  39				20 	- Done @ level 79
	Frozen Armor		    1				  40				 1 	- Done @ level 3
	Warmth 				    1				  37				 1 	- Done @ level 4
	Frost Nova			    6				  44				 1 	- Done @ level 7
	Ice Blast			    6				  45				20 	- Done @ level 8
	Static Field		    6				  42				 ? 	- Done @ level 6 *****PUMP SKILL QUEST POINTS HERE***** (12 + 4 = 16)
	Telekinesis			    6				  43				 1 	- Done @ level 6
	Shiver Armor		   12				  50				 0 	- Done @ level 12
	Teleport	 		   18				  54				 1 	- Done @ level 18
	Glacial Spike		   18				  55				20 	- Done @ level 93
	Blizzard	 		   24				  59				20 	- Done @ level 24
	Frozen Orb 			   30				  64				 0	- Done @ level 49
	Cold Mastery 		   30				  65				 ?	- Done @ level 64

	TOTAL Points Spent --------------------------------------> 106

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

				Config.LowManaSkill = [0,0];
				Config.HPBuffer = 2;
				Config.MPBuffer = 8;
				Config.RejuvBuffer = 4; 
				Config.BeltColumn = ["hp", "hp", "hp", "hp"];
				Config.TownCheck = false;
				Config.Dodge = false;
				Config.UseHP = 60;
				Config.UseMP = 20;

			}

		},

		

	2:	{

			SkillPoints: [37],	//Warmth

			StatPoints: [0, 0, 0, 0, 0],	//Str 15

			Update: function () {

			}

		},

		

	3:	{

			SkillPoints: [40],	//Frozen Armor 

			StatPoints: [0, 0, 0, 0, 0],	//Str 20

			Update: function () {

			}

		},

		

	4:	{

			SkillPoints: [42],	//Static Field

			StatPoints: [0, 0, 0, 0, 0],	//Str 25

			Update: function () {

			}

		},



	5:	{

			SkillPoints: [43],	//Telekinesis

			StatPoints: [0, 0, 0, 0, 0],	//Str 30

			Update: function () {



			}

		},



	6:	{

			SkillPoints: [54],	//Teleport

			StatPoints: [0, 0, 0, 0, 0],	//Str 35

			Update: function () {

			}

		},



	7:	{

			SkillPoints: [39], //Ice Bolt1
			StatPoints: [0, 0, 0, 0, 0],	//Str 40

			Update: function () {

			}

		},



	8:	{

			SkillPoints: [44], //Frost Nova

			StatPoints: [0, 0, 0, 0, 0],	//Str 45

			Update: function () {

				

			}

		},



	9:	{

			SkillPoints: [45],	//Ice Blast

			StatPoints: [0, 0, 0, 0, 0],	//Str 50

			Update: function () {

				

			}

		},



	10:	{

			SkillPoints: [55],	//Glacial Spike

			StatPoints: [0, 0, 0, 0, 0],	//Str 55

			Update: function () {

			}

		},



	11:	{	

			SkillPoints: [45],	//Ice Blast2

			StatPoints: [0, 0, 0, 0, 0],	//Str 60

			Update: function () {

				

			}

		},



	12:	{

			SkillPoints: [45],	//Ice Blast3

			StatPoints: [3, 3, 3, 3, 3],	//Vit 15

			Update: function () {
				
			}

		},



	13:	{

			SkillPoints: [45],	//Ice Blast4

			StatPoints: [3, 3, 3, 3, 3],	//Vit 20

			Update: function () {

				

			}

		},



	14:	{

			SkillPoints: [45],	//Ice Blast5

			StatPoints: [3, 3, 3, 3, 3],	//Vit 25

			Update: function () {

			}

		},



	15:	{

			SkillPoints: [45],	//Ice Blast6	

			StatPoints: [3, 3, 3, 3, 3],	//Vit 30

			Update: function () {
				//Config.PickitFiles.push("auto/MercWeapon.nip"); *For Act 2 Merc

			}

		},



	16:	{
			SkillPoints: [45],	//Ice Blast7
			StatPoints: [3, 3, 3, 3, 3],	//Vit 35
			Update: function () {
				
			}

		},



	17:	{
			SkillPoints: [45],	//Ice Blast8
			StatPoints: [3, 3, 3, 3, 3],	//Vit 40
			Update: function () {
				
			}

		},



	18:	{
			SkillPoints: [45],	//Ice Blast9
			StatPoints: [3, 3, 3, 3, 3],	//Vit 45
			Update: function () {		

			}

		},



	19:	{
			SkillPoints: [45],	//Ice Blast10
			StatPoints: [3, 3, 3, 3, 3],	//Vit 50
			Update: function () {

			}

		},



	20:	{
			SkillPoints: [45],	//Ice Blast11
			StatPoints: [3, 3, 3, 3, 3],	//Vit 55
			Update: function () {

			}

		},



	21:	{	
			SkillPoints: [45],	//Ice Blast12
			StatPoints: [3, 3, 3, 3, 3],	//Vit 60
			Update: function () {

			}

		},



	22:	{
			SkillPoints: [45],	//Ice Blast13
			StatPoints: [3, 3, 3, 3, 3],	//Vit 65
			Update: function () {

			}

		},



	23:	{
			SkillPoints: [45, 45, 45],	//Ice Blast14,15,16
			StatPoints: [3, 3, 3, 3, 3],	//Vit 70
			Update: function () {

			}

		},



	24:	{
			SkillPoints: [59],	//Blizzard1
			StatPoints: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],	//Vit 80
			Update: function () {
				Config.BeltColumn = ["hp", "mp", "mp", "mp"];
				Config.LowGold = 75000;
				Config.Cubing = true;
				Config.UseMP = 70;
				Config.UseHP = 80;
				Config.OpenChests = false;
				Config.TownCheck = true;
				Config.AttackSkill = [-1, 59, 45, 59, 45, -1, -1];
				

			}

		},



	25:	{
			SkillPoints: [59],	//Blizzard2
			StatPoints: [3, 3, 3, 3, 3],	//Vit 85
			Update: function () {

			}

		},



	26:	{
			SkillPoints: [59],	//Blizzard3						
			StatPoints: [3, 3, 3, 3, 3],	//Vit 90
			Update: function () {	
			}

		},



	27:	{
			SkillPoints: [59],	//Blizzard4
			StatPoints: [3, 3, 3, 3, 3],	//Vit 95
			Update: function () {
				
			}

		},



	28:	{
			SkillPoints: [59],	//Blizzard5
			StatPoints: [3, 3, 3, 3, 3],	//Vit 100
			Update: function () {

			}

		},



	29:	{
			SkillPoints: [59],	//Blizzard6
			StatPoints: [3, 3, 3, 3, 3],	//Vit 105
			Update: function () {

			}

		},



	30:	{
			SkillPoints: [65, 39, 39],	//Cold Mastery1 & Ice Bolt2,3
			StatPoints: [3, 3, 3, 3, 3],	//Vit 110
			Update: function () {
				
			}

		},

	31:	{	
			SkillPoints: [59],	//Blizzard7
			StatPoints: [3, 3, 3, 3, 3],	//Vit 115
			Update: function () {
				
			}
		},

	32:	{
			SkillPoints: [59],	//Blizzard8
			StatPoints: [3, 3, 3, 3, 3],	//Vit 120
			Update: function () {
				
			}
		},

	33:	{
			SkillPoints: [59],	//Blizzard9
			StatPoints: [3, 3, 3, 3, 3],	//Vit 125
			Update: function () {
				
			}
		},

	34:	{
			SkillPoints: [59],	//Blizzard10
			StatPoints: [3, 3, 3, 3, 3],	//Vit 130
			Update: function () {
				
			}
		},

	35:	{
			SkillPoints: [59],	//Blizzard11
			StatPoints: [3, 3, 3, 3, 3],	//Vit 135
			Update: function () {
			}
		},

	36:	{
			SkillPoints: [59],	//Blizzard12
			StatPoints: [0, 0, 0, 0, 0],	//Str 65
			Update: function () {
				
			}
		},

	37:	{
			SkillPoints: [59],	//Blizzard13
			StatPoints: [0, 0, 0, 0, 0],	//Str 70
			Update: function () {
				Config.Dodge = true;
			}
		},

	38:	{
			SkillPoints: [59],	//Blizzard14
			StatPoints: [0, 0, 0, 0, 0],	//Str 75
			Update: function () {
				
			}
		},

	39:	{
			SkillPoints: [59],	//Blizzard15
			StatPoints: [0, 0, 0, 0, 0],	//Str 80
			Update: function () {
				
			}
		},

	40:	{
			SkillPoints: [59],	//Blizzard16
			StatPoints: [0, 0, 0, 0, 0],	//Str 85
			Update: function () {
				Config.LowGold = 300000;
			}
		},

	41:	{	
			SkillPoints: [59],	//Blizzard17
			StatPoints: [0, 0, 0, 0, 0],	//Str 90
			Update: function () {
				
			}
		},

	42:	{
			SkillPoints: [59],	//Blizzard18
			StatPoints: [0, 0, 0, 0, 0],	//Str 95
			Update: function () {
				
			}
		},

	43:	{
			SkillPoints: [59],	//Blizzard19
			StatPoints: [3, 3, 3, 3, 3],	//Vit 140
			Update: function () {
				
			}
		},

	44:	{
			SkillPoints: [59],	//Blizzard20
			StatPoints: [3, 3, 3, 3, 3],	//Vit 145
			Update: function () {
				
			}
		},

	45:	{
			SkillPoints: [65],	//Cold Mastery2
			StatPoints: [3, 3, 3, 3, 3],	//Vit 150
			Update: function () {
				Config.CastStatic = 70;
				Config.StaticList = ["Baal", "Andariel", "Izual"];
			}
		},

	46:	{
			SkillPoints: [65],	//Cold Mastery3
			StatPoints: [3, 3, 3, 3, 3],	//Vit 155
			Update: function () {
				
			}
		},

	47:	{
			SkillPoints: [65],	//Cold Mastery4
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	48:	{
			SkillPoints: [65],	//Cold Mastery5
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	49:	{
			SkillPoints: [65],	//Cold Mastery6
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	50:	{
			SkillPoints: [65],	//Cold Mastery7
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
			
			}
		},

	51:	{	
			SkillPoints: [65],	//Cold Mastery8
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	52:	{
			SkillPoints: [65],	//Cold Mastery9
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	53:	{
			SkillPoints: [65],	//Cold Mastery10
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	54:	{
			SkillPoints: [45],	//Ice Blast17
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	55:	{
			SkillPoints: [45],	//Ice Blast18
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				Config.LowGold = 50000;
			}
		},

	56:	{
			SkillPoints: [45],	//Ice Blast19
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	57:	{
			SkillPoints: [45],	//Ice Blast20
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	58:	{
			SkillPoints: [55],	//Glacial Spike2
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	59:	{
			SkillPoints: [55],	//Glacial Spike3
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	60:	{
			SkillPoints: [55, 55, 55, 39, 39],	//Glacial Spike4,5,6 & Ice Bolt4,5
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				Config.AttackSkill = [-1, 59, 55, 59, 55, -1, -1];
			}
		},

	61:	{	
			SkillPoints: [55],	//Glacial Spike7
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	62:	{
			SkillPoints: [55],	//Glacial Spike8
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	63:	{
			SkillPoints: [55],	//Glacial Spike9
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	64:	{
			SkillPoints: [55],	//Glacial Spike10
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	65:	{
			SkillPoints: [55],	//Glacial Spike11
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				Config.LowGold = 60000;
			}
		},

	66:	{
			SkillPoints: [55],	//Glacial Spike12
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	67:	{
			SkillPoints: [55],	//Glacial Spike13
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	68:	{
			SkillPoints: [55],	//Glacial Spike14
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	69:	{
			SkillPoints: [55],	//Glacial Spike15
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	70:	{
			SkillPoints: [55],	//Glacial Spike16
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
			}
		},

	71:	{	
			SkillPoints: [55],	//Glacial Spike17
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	72:	{
			SkillPoints: [55],	//Glacial Spike18
			StatPoints: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],		//Vit
			Update: function () {
				
			}
		},

	73:	{
			SkillPoints: [55],	//Glacial Spike19
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	74:	{
			SkillPoints: [55],	//Glacial Spike20
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	75:	{
			SkillPoints: [39], //Ice Bolt6
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	76:	{
			SkillPoints: [39], //Ice Bolt7
			StatPoints: [3, 3, 3, 3, 3],								// Vitality + 5
			Update: function () {
				
			}
		},

	77:	{
			SkillPoints: [39], //Ice Bolt8
			StatPoints: [3, 3, 3, 3, 3],								// Vitality + 5
			Update: function () {
				
			}
		},

	78:	{
			SkillPoints: [39], //Ice Bolt9
			StatPoints: [3, 3, 3, 3, 3],								// Vitality + 5
			Update: function () {
				
			}
		},

	79:	{
			SkillPoints: [39], //Ice Bolt10
			StatPoints: [3, 3, 3, 3, 3],								// Vitality + 5
			Update: function () {
				
			}
		},

	80:	{
			SkillPoints: [39], //Ice Bolt11
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				Config.Gamble = true;									// Time to spend dat ca$h!!
				Config.ScanShrines	= [];
			}
		},

	81:	{	
			SkillPoints: [39], //Ice Bolt12
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	82:	{
			SkillPoints: [39], //Ice Bolt13
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	83:	{
			SkillPoints: [39], //Ice Bolt14
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	84:	{
			SkillPoints: [39], //Ice Bolt15
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	85:	{
			SkillPoints: [39], //Ice Bolt16
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	86:	{
			SkillPoints: [39], //Ice Bolt17
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	87:	{
			SkillPoints: [39], //Ice Bolt18
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	88:	{
			SkillPoints: [39], //Ice Bolt19
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	89:	{
			SkillPoints: [39], //Ice Bolt20
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	90:	{
			SkillPoints: [65],	//Cold Mastery11
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	91:	{	
			SkillPoints: [65],	//Cold Mastery12
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	92:	{
			SkillPoints: [65],	//Cold Mastery13
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	93:	{
			SkillPoints: [65],	//Cold Mastery14
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	94:	{
			SkillPoints: [65],	//Cold Mastery15
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	95:	{
			SkillPoints: [65],	//Cold Mastery16
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	96:	{
			SkillPoints: [65],	//Cold Mastery17
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	97:	{
			SkillPoints: [65],	//Cold Mastery18
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	98:	{
			SkillPoints: [65],	//Cold Mastery19
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		},

	99:	{
			SkillPoints: [65],	//Cold Mastery20
			StatPoints: [3, 3, 3, 3, 3],	//Vit
			Update: function () {
				
			}
		}
};