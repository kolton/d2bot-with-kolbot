// Assassin config file

/* Brief instructions:
 * Notepad++ is HIGHLY recommended to use for editing these files. Visit http://notepad-plus-plus.org/
 * To comment out something, put // in front of that line
 * !!!Never comment out something you're not sure about, set it to false or disable as noted in description if you don't want to use it.
 * true and false are case sensitive. Good: Config.SomeVar = true; Bad: Config.SomeVar = True;
 */

function LoadConfig() {
	/* Sequence config
	 * Set to true if you want to run it, set to false if not.
	 * If you want to change the order of the scripts, just change the order of their lines by using cut and paste.
	 */
	 
	// User addon script. Read the description in libs/bots/UserAddon.js
	Scripts.UserAddon = true; // !!!YOU MUST SET THIS TO FALSE IF YOU WANT TO RUN BOSS/AREA SCRIPTS!!!

	// Battle orders script - Use this for 2+ characters (for example BO barb + sorc)
	Scripts.BattleOrders = false;
		Config.BattleOrders.Mode = 0; // 0 = give BO, 1 = get BO
		Config.BattleOrders.Wait = false; // Idle until the player that received BO leaves.

	// Team MF system
	Config.MFLeader = false; // Set to true if you have one or more MFHelpers. Opens TP and gives commands when doing normal MF runs.

	// Boss/area scripts

	// *** act 1 ***
	Scripts.Corpsefire = false;
		Config.Corpsefire.ClearDen = false;
	Scripts.Mausoleum = false;
		Config.Mausoleum.KillBloodRaven = false;
		Config.Mausoleum.ClearCrypt = false;
	Scripts.Rakanishu = false;
		Config.Rakanishu.KillGriswold = true;
	Scripts.UndergroundPassage = false;
	Scripts.Coldcrow = false;
	Scripts.Tristram = false;
		Config.Tristram.PortalLeech = false; // Set to true to open a portal for leechers.
	Scripts.Pit = false;
		Config.Pit.ClearPit1 = true;
	Scripts.Treehead = false;
	Scripts.Smith = false;
	Scripts.BoneAsh = false;
	Scripts.Countess = false;
		Config.Countess.KillGhosts = false;
	Scripts.Andariel = false;
	Scripts.Cows = false;

	// *** act 2 ***
	Scripts.Radament = false;
	Scripts.AncientTunnels = false;
	Scripts.Summoner = false;
		Config.Summoner.FireEye = false; // Kill Fire Eye
	Scripts.Tombs = false;
	Scripts.Duriel = false;

	// *** act 3 ***
	Scripts.Stormtree = false;
	Scripts.KurastChests = false;
		Config.KurastChests.LowerKurast = true;
		Config.KurastChests.Bazaar = false;
		Config.KurastChests.Sewers1 = false;
		Config.KurastChests.Sewers2 = false;
	Scripts.KurastTemples = false;
	Scripts.Icehawk = false;
	Scripts.Endugu = false;
	Scripts.Travincal = false;
		Config.Travincal.PortalLeech = false; // Set to true to open a portal for leechers.
	Scripts.Mephisto = false;
		Config.Mephisto.MoatTrick = false;
		Config.Mephisto.KillCouncil = false;
		Config.Mephisto.TakeRedPortal = true;

	// *** act 4 ***
	Scripts.OuterSteppes = false;
	Scripts.Izual = false;
	Scripts.Hephasto = false;
	Scripts.Vizier = false; // Intended for classic sorc, kills Vizier only.
	Scripts.FastDiablo = false;
	Scripts.Diablo = false;
		Config.Diablo.Entrance = true; // Start from entrance
		Config.Diablo.SealWarning = "Leave the seals alone!";
		Config.Diablo.EntranceTP = "Entrance TP up";
		Config.Diablo.StarTP = "Star TP up";

	// *** act 5 ***
	Scripts.Pindleskin = false;
		Config.Pindleskin.KillNihlathak = true;
		Config.Pindleskin.ViperQuit = false; // End script if Tomb Vipers are found.
	Scripts.Nihlathak = false;
		Config.Nihlathak.ViperQuit = false; // End script if Tomb Vipers are found.
	Scripts.Eldritch = false;
		Config.Eldritch.OpenChest = true;
		Config.Eldritch.KillShenk = true;
		Config.Eldritch.KillDacFarren = true;
	Scripts.Eyeback = false;
	Scripts.ThreshSocket = false;
	Scripts.Abaddon = false;
	Scripts.Frozenstein = false;
		Config.Frozenstein.ClearFrozenRiver = true;
	Scripts.Bonesaw = false;
	Scripts.Snapchip = false;
		Config.Snapchip.ClearIcyCellar = true;
	Scripts.Baal = false;
		Config.Baal.HotTPMsg = "Hot TP!";
		Config.Baal.SafeTPMsg = "TP safe!";
		Config.Baal.BaalMsg = "Baal";
		Config.Baal.DollQuit = false; // End script if Dolls (Undead Soul Killers) are found.
		Config.Baal.KillBaal = true; // Kill Baal. Leaves game after wave 5 if false.
		Config.Baal.RandomPrecast = true; // Use random WP to precast. Anti PK measure.

	/* ### leeching section ###
	* Unless stated otherwise, leader's character name isn't needed on order to run.
	* Don't use more scripts of the same type! (Run AutoBaal OR BaalHelper, not both)
	*/

	Scripts.TristramLeech = false; // Enters Tristram, attempts to stay close to the leader and will try and help kill.
		Config.TristramLeech.Leader = ""; // Leader's ingame name.
	Scripts.TravincalLeech = false; // Enters portal at back of Travincal.
		Config.TravincalLeech.Leader = ""; // Leader's ingame name.
		Config.TravincalLeech.Helper = true // If set to true the character will teleport to the stairs and help attack.
	Scripts.MFHelper = false; // Run the same MF run as the MFLeader. Leader must have Config.MFLeader = true
	Scripts.Wakka = false; // Walking chaos leecher with auto leader assignment, stays at safe distance from the leeader
	Scripts.DiabloHelper = false; // Chaos helper, kills monsters and doesn't open seals on its own.
		Config.DiabloHelper.Entrance = true; // Start from entrance
	Scripts.AutoBaal = false; // Baal leecher with auto leader assignment
		Config.AutoBaal.FindShrine = false; // Find shrine when hot tp message is sent. You can change messages in AutoBaal.js
	Scripts.BaalHelper = false;
		Config.BaalHelper.KillNihlathak = false; // Kill Nihlathak before going to Throne
		Config.BaalHelper.FastChaos = false; // Kill Diablo before going to Throne
		Config.BaalHelper.DollQuit = false;  // End script if Dolls (Undead Soul Killers) are found.
		Config.BaalHelper.KillBaal = true; // Kill Baal. If set to false, you must configure Config.QuitList or the bot will wait indefinitely.
		Config.BaalHelper.RandomPrecast = true; // Use random WP to precast. Anti PK measure.
		Config.BaalHelper.SkipTP = true; // Don't wait for a TP, go to WSK3 and wait for someone to go to throne. Anti PK measure.
	Scripts.Follower = false; // Script that follows a manually played leader around like a merc. For a list of commands, see Follower.js
		Config.Follower.Leader = ""; // Leader's ingame name. This only applies to Follower script

	Config.QuitList = []; // List of character names to quit with. Example: Config.QuitList = ["MySorc", "MyDin"];

	// *** special scripts ***
	Scripts.WPGetter = false; // Get missing waypoints
	Scripts.OrgTorch = false;
		Config.OrgTorch.WaitForKeys = true; // Enable Torch System to get keys from other profiles. See libs/TorchSystem.js for more info
		Config.OrgTorch.WaitTimeout = 15; // Time in minutes to wait for keys before moving on
		Config.OrgTorch.UseSalvation = true; // Use Salvation aura on Mephisto (if possible)
		Config.OrgTorch.GetFade = false; // Get fade by standing in a fire. You MUST have Last Wish or Treachery on your character being worn.
	Scripts.Rusher = false; // Rush bot alpha version (no questing yet, only rushing), for a list of commands, see Rusher.js
	Scripts.CrushTele = false; // classic rush teleporter. go to area of interest and press "-" numpad key
	Scripts.Questing = false; // solves missing quests (skill/stat+shenk)
	Scripts.Gamble = false; // Gambling system, other characters will mule gold into your game so you can gamble infinitely. See Gambling.js
	Scripts.GhostBusters = false; // Kill ghosts in most areas that contain them
	Scripts.Enchant = false;
		Config.Enchant.Triggers = ["chant", "cows", "wps"]; // Chat commands for enchant, cow level and waypoint giving
		Config.Enchant.GameLength = 20; // Game length in minutes
	Scripts.IPHunter = false;
		Config.IPHunter.IPList = []; // List of IPs to look for. example: [165, 201, 64]
		Config.IPHunter.GameLength = 3; // Number of minutes to stay in game if ip wasn't found
	Scripts.ShopBot = false; // Fast waypoint-based shopbot, alpha version
		Config.ShopBot.ShopNPC = "Anya"; // Only Anya for now
		// Scan only selected classids for maximum speed. See libs/config/templates/ShopBot.txt
		Config.ShopBot.ScanIDs = [187, 188, 194, 195, 326, 327, 338, 373, 397, 443, 449];

	// Town settings
	Config.HealHP = 50; // Go to a healer if under designated percent of life.
	Config.HealMP = 0; // Go to a healer if under designated percent of mana.
	Config.HealPoison = false; // Go to a healer if poisoned
	Config.HealCurse = false; // Go to a healer if cursed
	Config.UseMerc = true; // Use merc. This is ignored and always false in d2classic.
	Config.MercWatch = false; // Instant merc revive during battle.

	// Potion settings
	Config.UseHP = 75; // Drink a healing potion if life is under designated percent.
	Config.UseRejuvHP = 40;  // Drink a rejuvenation potion if life is under designated percent.
	Config.UseMP = 30; // Drink a mana potion if mana is under designated percent.
	Config.UseRejuvMP = 0; // Drink a rejuvenation potion if mana is under designated percent.
	Config.UseMercHP = 75; // Give a healing potion to your merc if his/her life is under designated percent.
	Config.UseMercRejuv = 0; // Give a rejuvenation potion to your merc if his/her life is under designated percent.
	Config.RejuvBuffer = 0; // Number of rejuvenation potions to keep in inventory.

	// Chicken settings
	Config.LifeChicken = 30; // Exit game if life is less or equal to designated percent.
	Config.ManaChicken = 0; // Exit game if mana is less or equal to designated percent.
	Config.MercChicken = 0; // Exit game if merc's life is less or equal to designated percent.
	Config.TownHP = 0; // Go to town if life is under designated percent.
	Config.TownMP = 0; // Go to town if mana is under designated percent.

	/* Inventory lock configuration. !!!READ CAREFULLY!!!
	 * 0 = item is locked and won't be moved. If item occupies more than one slot, ALL of those slots must be set to 0 to lock it in place.
	 * Put 0s where your torch, annihilus and everything else you want to KEEP is.
	 * 1 = item is unlocked and will be dropped, stashed or sold.
	 * If you don't change the default values, the bot won't stash items.
	 */
	Config.Inventory[0] = [0,0,0,0,0,0,0,0,0,0];
	Config.Inventory[1] = [0,0,0,0,0,0,0,0,0,0];
	Config.Inventory[2] = [0,0,0,0,0,0,0,0,0,0];
	Config.Inventory[3] = [0,0,0,0,0,0,0,0,0,0];

	Config.StashGold = 100000; // Minimum amount of gold to stash.

	/* Potion types for belt columns from left to right.
	 * Rejuvenation potions must always be rightmost.
	 * Supported potions - Healing ("hp"), Mana ("mp") and Rejuvenation ("rv")
	 */
	Config.BeltColumn[0] = "hp";
	Config.BeltColumn[1] = "mp";
	Config.BeltColumn[2] = "rv";
	Config.BeltColumn[3] = "rv";

	/* Minimum amount of potions. If we have less, go to vendor to purchase more.
	 * Set rejuvenation columns to 0, because they can't be bought.
	 */
	Config.MinColumn[0] = 3;
	Config.MinColumn[1] = 3;
	Config.MinColumn[2] = 0;
	Config.MinColumn[3] = 0;

	// Pickit config
	Config.PickitFiles.push("kolton.nip"); // Pickit filenames in /pickit/ folder
	Config.PickitFiles.push("LLD.nip");
	Config.PickRange = 40; // Pick radius
	Config.FastPick = false; // Check and pick items between attacks

	// Item identification settings
	Config.CainID.Enable = false; // Identify items at Cain
	Config.CainID.MinGold = 2500000; // Minimum gold (stash + character) to have in order to use Cain.
	Config.CainID.MinUnids = 3; // Minimum number of unid items in order to use Cain.
	Config.FieldID = false; // Identify items in the field instead of going to town.

	// Gambling config
	Config.Gamble = false;
	Config.GambleGoldStart = 1000000;
	Config.GambleGoldStop = 500000;
	
	// Check libs/NTItemAlias.dbl file for other item classids
	Config.GambleItems.push(520); // Amulet
	Config.GambleItems.push(522); // Ring
	Config.GambleItems.push(418); // Circlet
	Config.GambleItems.push(419); // Coronet
	
	// Cubing config. All recipes are available in Templates/Cubing.txt
	Config.Cubing = false; // Set to true to enable cubing.

	// All ingredients will be auto-picked, for classids check libs/NTItemAlias.dbl
	//Config.Recipes.push([Recipe.Gem, 560]); // perfect amethyst
	//Config.Recipes.push([Recipe.Gem, 565]); // perfect topaz
	//Config.Recipes.push([Recipe.Gem, 570]); // perfect sapphire
	//Config.Recipes.push([Recipe.Gem, 575]); // perfect emerald
	//Config.Recipes.push([Recipe.Gem, 580]); // perfect ruby
	//Config.Recipes.push([Recipe.Gem, 585]); // perfect diamond
	//Config.Recipes.push([Recipe.Gem, 600]); // perfect skull

	//Config.Recipes.push([Recipe.Token]); // token of absolution
	
	Config.Recipes.push([Recipe.Rune, 630]); // pul -> um
	Config.Recipes.push([Recipe.Rune, 631]); // um -> mal
	Config.Recipes.push([Recipe.Rune, 632]); // mal -> ist
	Config.Recipes.push([Recipe.Rune, 633]); // ist -> gul
	Config.Recipes.push([Recipe.Rune, 634]); // gul -> vex

	Config.Recipes.push([Recipe.Caster.Amulet]); // Craft Caster Amulet
	Config.Recipes.push([Recipe.Blood.Ring]); // Craft Blood Ring
	Config.Recipes.push([Recipe.Blood.Helm, 424]); // Craft Blood Armet
	Config.Recipes.push([Recipe.HitPower.Gloves, 452]); // Craft Hit Power Vambraces

	Config.Recipes.push([Recipe.Reroll.Magic, 421]); // Reroll magic Diadem
	Config.Recipes.push([Recipe.Reroll.Rare, 421]); // Reroll rare Diadem

	// Base item must be in the pickit, rest is auto-picked
	Config.Recipes.push([Recipe.Socket.Weapon, 255]); // Socket Thresher
	Config.Recipes.push([Recipe.Socket.Weapon, 256]); // Socket Cryptic Axe
	Config.Recipes.push([Recipe.Socket.Armor, 442]); // Socket Sacred Armor
	Config.Recipes.push([Recipe.Socket.Armor, 443]); // Socket Archon Plate

	/* Runeword config. All recipes are available in Templates/Runewords.txt
	 * !!!NOTE!!! enhanced damage and enhanced defense on runewords are broken in the core right now
	 * Keep lines follow pickit format and any given runeword is tested vs ALL lines so you don't need to repeat them
	 */
	Config.MakeRunewords = false; // Set to true to enable runeword making/rerolling

	Config.Runewords.push([Runeword.Insight, 255]); // Thresher
	Config.Runewords.push([Runeword.Insight, 256]); // Cryptic Axe

	Config.KeepRunewords.push("[type] == polearm # [meditationaura] == 17");

	Config.Runewords.push([Runeword.Spirit, 447]); // Monarch
	Config.Runewords.push([Runeword.Spirit, 498]); // Sacred Targe

	Config.KeepRunewords.push("[type] == shield || [type] == auricshields # [fcr] == 35");

	// General config
	Config.PublicMode = 0; // 1 = invite, 2 = accept, 0 = disable
	Config.LastMessage = ""; // Message to say at the end of the run.
	Config.ShitList = false; // Blacklist hostile players so they don't get invited to party.
	Config.MinGameTime = 60; // Min game time in seconds. Bot will TP to town and stay in game if the run is completed before.
	Config.MaxGameTime = 0; // Maximum game time in seconds. Quit game when limit is reached.
	Config.TeleSwitch = false; // Switch to slot II when teleporting more than 1 node.
	Config.OpenChests = false; // Open chests. Controls key buying.
	Config.MiniShopBot = true; // Scan items in NPC shops.
	Config.TownCheck = false; // Go to town if out of potions
	Config.LogExperience = false; // Print experience statistics in the manager.
	
	// Fastmod config
	Config.FCR = 0; // 0 - disable, 1 to 255 - set value of faster cast rate 
	Config.FHR = 0; // 0 - disable, 1 to 255 - set value of faster hit recovery 
	Config.FBR = 0; // 0 - disable, 1 to 255 - set value of faster block recovery 
	Config.IAS = 0; // 0 - disable, 1 to 255 - set value of increased attack speed 
	Config.PacketCasting = 2; // 0 = disable, 1 = packet teleport, 2 = full packet casting.

	// Anti-hostile config
	Config.AntiHostile = false; // Enable anti-hostile
	Config.HostileAction = 0; // 0 - quit immediately, 1 - quit when hostile player is sighted, 2 - attack hostile

	// DClone config
	Config.StopOnDClone = true; // Go to town and idle as soon as Diablo walks the Earth
	Config.SoJWaitTime = 5; // Time in minutes to wait for another SoJ sale before leaving game. 0 = disabled

	// Monster skip config
	// Skip immune monsters. Possible options: "fire", "cold", "lightning", "poison", "physical", "magic".
	// You can combine multiple resists with "and", for example - "fire and cold", "physical and cold and poison"
	Config.SkipImmune = [];
	// Skip enchanted monsters. Possible options: "extra strong", "extra fast", "cursed", "magic resistant", "fire enchanted", "lightning enchanted", "cold enchanted", "mana burn", "teleportation", "spectral hit", "stone skin", "multiple shots".
	// You can combine multiple enchantments with "and", for example - "cursed and extra fast", "mana burn and extra strong and lightning enchanted"
	Config.SkipEnchant = [];
	// Skip monsters with auras. Possible options: "fanaticism", "might", "holy fire", "blessed aim", "holy freeze", "holy shock". Conviction is bugged, don't use it.
	Config.SkipAura = [];

	/* Attack config
	 * To disable an attack, set it to -1
	 * Skills MUST be POSITIVE numbers. For reference see http://pastebin.com/baShRwWM
	 * Don't put traps here! Use Config. UseTraps, Config.Traps and Config.BossTraps
	 */
	Config.AttackSkill[0] = -1; // Preattack skill.
	Config.AttackSkill[1] = -1; // Primary skill to bosses.
	Config.AttackSkill[2] = -1; // Primary untimed skill to bosses. Keep at -1 if Config.AttackSkill[1] is untimed skill.
	Config.AttackSkill[3] = -1; // Primary skill to others.
	Config.AttackSkill[4] = -1; // Primary untimed skill to others. Keep at -1 if Config.AttackSkill[3] is untimed skill.
	Config.AttackSkill[5] = -1; // Secondary skill if monster is immune to primary.
	Config.AttackSkill[6] = -1; // Secondary untimed skill if monster is immune to primary untimed.

	Config.BossPriority = false; // Set to true to attack Unique/SuperUnique monsters first when clearing
	Config.ClearType = 0xF; // Monster spectype to kill in level clear scripts (ie. Mausoleum). 0xF = skip normal, 0x7 = champions/bosses, 0 = all

	// Class specific config
	Config.UseTraps = true; // Set to true to use traps
	Config.Traps = [271, 271, 271, 276, 276]; // Skill IDs for traps to be cast on all mosters except act bosses.
	Config.BossTraps = [271, 271, 271, 271, 271]; // Skill IDs for traps to be cast on act bosses.

	Config.SummonShadow = "Master"; // 0 = don't summon, 1 or "Warrior" = summon Shadow Warrior, 2 or "Master" = summon Shadow Master
	Config.UseFade = true; // Set to true to use Fade prebuff.
	Config.UseBoS = false; // Set to true to use Burst of Speed prebuff. TODO: Casting in town + UseFade compatibility
	Config.UseVenom = false; // Set to true to use Venom prebuff. Set to false if you don't have the skill and have Arachnid Mesh - it will cause connection drop otherwise.
	Config.UseCloakofShadows = true; // Set to true to use Cloak of Shadows while fighting. Useful for blinding regular monsters/minions.
}