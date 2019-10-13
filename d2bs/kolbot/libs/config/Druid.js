// Druid config file

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
		Config.BattleOrders.Getters = []; // List of players to wait for before casting Battle Orders (mode 0). All players must be in the same area as the BOer.

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
		Config.Tristram.WalkClear = false; // Disable teleport while clearing to protect leechers
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
	Scripts.Coldworm = false;
		Config.Coldworm.KillBeetleburst = false;
		Config.Coldworm.ClearMaggotLair = false; // Clear all 3 levels
	Scripts.AncientTunnels = false;
		Config.AncientTunnels.OpenChest = false; // Open special chest in Lost City
		Config.AncientTunnels.KillDarkElder = false;
	Scripts.Summoner = false;
		Config.Summoner.FireEye = false;
	Scripts.Tombs = false;
	Scripts.Duriel = false;

	// *** act 3 ***
	Scripts.Stormtree = false;
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
		Config.Diablo.WalkClear = false; // Disable teleport while clearing to protect leechers
		Config.Diablo.Entrance = true; // Start from entrance
		Config.Diablo.SealWarning = "Leave the seals alone!";
		Config.Diablo.EntranceTP = "Entrance TP up";
		Config.Diablo.StarTP = "Star TP up";
		Config.Diablo.DiabloMsg = "Diablo";
	Scripts.SealLeader = false; // Clear a safe spot around seals and invite leechers in. Leechers should run SealLeecher script. Don't run with Diablo or FastDiablo.

	// *** act 5 ***
	Scripts.Pindleskin = false;
		Config.Pindleskin.UseWaypoint = false;
		Config.Pindleskin.KillNihlathak = true;
		Config.Pindleskin.ViperQuit = false; // End script if Tomb Vipers are found.
	Scripts.Nihlathak = false;
		Config.Nihlathak.ViperQuit = false; // End script if Tomb Vipers are found.
	Scripts.Eldritch = false;
		Config.Eldritch.OpenChest = true;
		Config.Eldritch.KillShenk = true;
		Config.Eldritch.KillDacFarren = true;
	Scripts.Eyeback = false;
	Scripts.SharpTooth = false;
	Scripts.ThreshSocket = false;
	Scripts.Abaddon = false;
	Scripts.Frozenstein = false;
		Config.Frozenstein.ClearFrozenRiver = true;
	Scripts.Bonesaw = false;
		Config.Bonesaw.ClearDrifterCavern = false;
	Scripts.Snapchip = false;
		Config.Snapchip.ClearIcyCellar = true;
	Scripts.Worldstone = false;
	Scripts.Baal = false;
		Config.Baal.HotTPMessage = "Hot TP!";
		Config.Baal.SafeTPMessage = "Safe TP!";
		Config.Baal.BaalMessage = "Baal!";
		Config.Baal.SoulQuit = false; // End script if Souls (Burning Souls) are found.
		Config.Baal.DollQuit = false; // End script if Dolls (Undead Soul Killers) are found.
		Config.Baal.KillBaal = true; // Kill Baal. Leaves game after wave 5 if false.

	/* ### leeching section ###
	* Unless stated otherwise, leader's character name isn't needed on order to run.
	* Don't use more scripts of the same type! (Run AutoBaal OR BaalHelper, not both)
	*/

	Config.Leader = ""; // Leader's ingame character name. Leave blank to try auto-detection (works in AutoBaal, Wakka, MFHelper)
	Config.QuitList = [""]; // List of character names to quit with. Example: Config.QuitList = ["MySorc", "MyDin"];
	Config.QuitListMode = 0; // 0 = use character names; 1 = use profile names (all profiles must run on the same computer).
	Config.QuitListDelay = []; // Quit the game with random delay in case of using Config.QuitList. Example: Config.QuitListDelay = [1, 10]; will exit with random delay between 1 and 10 seconds.

	Scripts.TristramLeech = false; // Enters Tristram, attempts to stay close to the leader and will try and help kill.
	Scripts.TravincalLeech = false; // Enters portal at back of Travincal.
		Config.TravincalLeech.Helper = true; // If set to true the character will teleport to the stairs and help attack.
	Scripts.MFHelper = false; // Run the same MF run as the MFLeader. Leader must have Config.MFLeader = true
	Scripts.Wakka = false; // Walking chaos leecher with auto leader assignment, stays at safe distance from the leader
	Scripts.SealLeecher = false; // Enter safe portals to Chaos. Leader should run SealLeader.
	Scripts.DiabloHelper = false; // Chaos helper, kills monsters and doesn't open seals on its own.
		Config.DiabloHelper.Wait = 120; // Seconds to wait for a runner to be in Chaos. If Config.Leader is set, it will wait only for the leader.
		Config.DiabloHelper.Entrance = true; // Start from entrance. Set to false to start from star.
		Config.DiabloHelper.SkipTP = false; // Don't wait for town portal and directly head to chaos. It will clear monsters around chaos entrance and wait for the runner.
		Config.DiabloHelper.SkipIfBaal = false; // End script if there are party members in a Baal run.
	Scripts.AutoBaal = false; // Baal leecher with auto leader assignment
		Config.AutoBaal.FindShrine = false; // false = disabled, 1 = search after hot tp message, 2 = search as soon as leader is found
		Config.AutoBaal.LeechSpot = [15115, 5050]; // X, Y coords of Throne Room leech spot
		Config.AutoBaal.LongRangeSupport = false; // Cast long distance skills from a safe spot
	Scripts.BaalHelper = false;
		Config.BaalHelper.Wait = 120; // Seconds to wait for a runner to be in Throne
		Config.BaalHelper.KillNihlathak = false; // Kill Nihlathak before going to Throne
		Config.BaalHelper.FastChaos = false; // Kill Diablo before going to Throne
		Config.BaalHelper.DollQuit = false;  // End script if Dolls (Undead Soul Killers) are found.
		Config.BaalHelper.KillBaal = true; // Kill Baal. If set to false, you must configure Config.QuitList or the bot will wait indefinitely.
		Config.BaalHelper.SkipTP = false; // Don't wait for a TP, go to WSK3 and wait for someone to go to throne. Anti PK measure.
	Scripts.Follower = false; // Script that follows a manually played leader around like a merc. For a list of commands, see Follower.js

	// *** special scripts ***
	Scripts.WPGetter = false; // Get missing waypoints
	Scripts.GetKeys = false;  // Hunt for T/H/D keys
	Scripts.OrgTorch = false;
		Config.OrgTorch.MakeTorch = true; // Convert organ sets to torches
		Config.OrgTorch.WaitForKeys = true; // Enable Torch System to get keys from other profiles. See libs/TorchSystem.js for more info
		Config.OrgTorch.WaitTimeout = 15; // Time in minutes to wait for keys before moving on
		Config.OrgTorch.UseSalvation = true; // Use Salvation aura on Mephisto (if possible)
		Config.OrgTorch.GetFade = false; // Get fade by standing in a fire. You MUST have Last Wish or Treachery on your character being worn.
	Scripts.Rusher = false; // Rush bot. For a list of commands, see Rusher.js
		Config.Rusher.WaitPlayerCount = 0; // Wait until game has a certain number of players (0 - don't wait, 8 - wait for full game).
		Config.Rusher.Radament = false; // Do Radament quest.
		Config.Rusher.LamEsen = false; // Do Lam Esen quest.
		Config.Rusher.Izual = false; // Do Izual quest.
		Config.Rusher.Shenk = false; // Do Shenk quest.
		Config.Rusher.Anya = false; // Do Anya quest.
		Config.Rusher.LastRun = ""; // End rush after this run. List of runs: http://pastebin.com/Uez3nZ6g
	Scripts.Rushee = false; // Automatic rushee, works with Rusher. Set Rusher's character name as Config.Leader
		Config.Rushee.Quester = false; // Enter portals and get quest items.
		Config.Rushee.Bumper = false; // Do Ancients and Baal. Minimum levels: 20 - norm, 40 - nightmare
	Scripts.CrushTele = false; // classic rush teleporter. go to area of interest and press "-" numpad key
	Scripts.Questing = false; // solves missing quests (skill/stat+shenk)
	Scripts.Gamble = false; // Gambling system, other characters will mule gold into your game so you can gamble infinitely. See Gambling.js
	Scripts.Crafting = false; // Crafting system, other characters will mule crafting ingredients. See CraftingSystem.js
	Scripts.GhostBusters = false; // Kill ghosts in most areas that contain them
	Scripts.Enchant = false;
		Config.Enchant.Triggers = ["chant", "cows", "wps"]; // Chat commands for enchant, cow level and waypoint giving
		Config.Enchant.GetLeg = false; // Get Wirt's Leg from Tristram. If set to false, it will check for the leg in town.
		Config.Enchant.AutoChant = false; // Automatically enchant nearby players and their minions
		Config.Enchant.GameLength = 20; // Game length in minutes
	Scripts.IPHunter = false;
		Config.IPHunter.IPList = []; // List of IPs to look for. example: [165, 201, 64]
		Config.IPHunter.GameLength = 3; // Number of minutes to stay in game if ip wasn't found
	Scripts.KillDclone = false; // Kill Diablo Clone by using Arcane Sanctuary waypoint. Diablo needs to walk the Earth in the game.
	Scripts.ShopBot = false; // Shopbot script. Automatically uses shopbot.nip and ignores other pickits.
		// Supported NPCs: Akara, Charsi, Gheed, Elzix, Fara, Drognan, Ormus, Asheara, Hratli, Jamella, Halbu, Anya. Multiple NPCs are also supported, example: [NPC.Elzix, NPC.Fara]
		// Use common sense when combining NPCs. Shopping in different acts will probably lead to bugs.
		Config.ShopBot.ShopNPC = NPC.Anya;
		// Put item classid numbers or names to scan (remember to put quotes around names). Leave blank to scan ALL items. See libs/config/templates/ShopBot.txt
		Config.ShopBot.ScanIDs = [];
		Config.ShopBot.CycleDelay = 0; // Delay between shopping cycles in milliseconds, might help with crashes.
		Config.ShopBot.QuitOnMatch = false; // Leave game as soon as an item is shopped.
	Scripts.ChestMania = false; // Open chests in configured areas. See sdk/areas.txt
		Config.ChestMania.Act1 = [13, 14, 15, 16, 18, 19]; // List of act 1 areas to open chests in
		Config.ChestMania.Act2 = [55, 59, 65, 66, 67, 68, 69, 70, 71, 72]; // List of act 2 areas to open chests in
		Config.ChestMania.Act3 = [79, 80, 81, 92, 93, 84, 85, 90]; // List of act 3 areas to open chests in
		Config.ChestMania.Act4 = []; // List of act 4 areas to open chests in
		Config.ChestMania.Act5 = [115, 116, 119, 125, 126, 127]; // List of act 5 areas to open chests in
	Scripts.ClearAnyArea = false; // Clear any area. Uses Config.ClearType to determine which type of monsters to kill.
		Config.ClearAnyArea.AreaList = []; // List of area ids to clear. See sdk/areas.txt

	// *** Guest scripts ***

	// Baal Assistant by YourGreatestMember
	Scripts.BaalAssistant = false; // Used to leech or help in baal runs.
		Config.BaalAssistant.Wait = 120; // Seconds to wait for a runner to be in the throne / portal wait / safe TP wait / hot TP wait...
		Config.BaalAssistant.KillNihlathak = false; // Kill Nihlathak before going to Throne
		Config.BaalAssistant.FastChaos = false; // Kill Diablo before going to Throne
		Config.BaalAssistant.Helper = true; // Set to true to help attack, set false to to leech.
		Config.BaalAssistant.GetShrine = false; // Set to true to get a experience shrine at the start of the run.
		Config.BaalAssistant.GetShrineWaitForHotTP = false; // Set to true to get a experience shrine after leader shouts the hot tp message as defined in Config.BaalAssistant.HotTPMessage
		Config.BaalAssistant.SkipTP = false; // Set to true to enable the helper to skip the TP and teleport down to the throne room.
		Config.BaalAssistant.WaitForSafeTP = false; // Set to true to wait for a safe TP message (defined in SafeTPMessage)
		Config.BaalAssistant.DollQuit = false; // Quit on dolls. (Hardcore players?)
		Config.BaalAssistant.SoulQuit = false; // Quit on Souls. (Hardcore players?)
		Config.BaalAssistant.KillBaal = true; // Set to true to kill baal, if you set to false you MUST configure Config.QuitList or Config.BaalAssistant.NextGameMessage or the bot will wait indefinitely.
		Config.BaalAssistant.HotTPMessage = ["Hot"]; // Configure safe TP messages.
		Config.BaalAssistant.SafeTPMessage = ["Safe", "Clear"]; // Configure safe TP messages.
		Config.BaalAssistant.BaalMessage = ["Baal"]; // Configure baal messages, this is a precautionary measure.
		Config.BaalAssistant.NextGameMessage = ["Next Game", "Next", "New Game"];	// Next Game message, this is a precautionary quit command, Reccomended setting up: Config.QuitList

	// Town settings
	Config.HealHP = 50; // Go to a healer if under designated percent of life.
	Config.HealMP = 0; // Go to a healer if under designated percent of mana.
	Config.HealStatus = false; // Go to a healer if poisoned or cursed
	Config.UseMerc = true; // Use merc. This is ignored and always false in d2classic.
	Config.MercWatch = false; // Instant merc revive during battle.

	// Potion settings
	Config.UseHP = 75; // Drink a healing potion if life is under designated percent.
	Config.UseRejuvHP = 40;  // Drink a rejuvenation potion if life is under designated percent.
	Config.UseMP = 30; // Drink a mana potion if mana is under designated percent.
	Config.UseRejuvMP = 0; // Drink a rejuvenation potion if mana is under designated percent.
	Config.UseMercHP = 75; // Give a healing potion to your merc if his/her life is under designated percent.
	Config.UseMercRejuv = 0; // Give a rejuvenation potion to your merc if his/her life is under designated percent.
	Config.HPBuffer = 0; // Number of healing potions to keep in inventory.
	Config.MPBuffer = 0; // Number of mana potions to keep in inventory.
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

	// Pickit config. Default folder is kolbot/pickit.
	Config.PickitFiles.push("kolton.nip");
	Config.PickitFiles.push("LLD.nip");
	Config.PickRange = 40; // Pick radius
	Config.FastPick = false; // Check and pick items between attacks

	/* Advanced automule settings
	 * Trigger - Having an item that is on the list will initiate muling. Useful if you want to mule something immediately upon finding.
	 * Force - Items listed here will be muled even if they are ingredients for cubing.
	 * Exclude - Items listed here will be ignored and will not be muled. Items on Trigger or Force lists are prioritized over this list.
	 *
	 * List can either be set as string in pickit format and/or as number referring to item classids. Each entries are separated by commas.
	 * Example :
	 *  Config.AutoMule.Trigger = [639, 640, "[type] == ring && [quality] == unique # [maxmana] == 20"];
	 *  	This will initiate muling when your character finds Ber, Jah, or SOJ.
	 *  Config.AutoMule.Force = [561, 566, 571, 576, 581, 586, 601];
	 *  	This will mule perfect gems/skull during muling.
	 *  Config.AutoMule.Exclude = ["[name] >= talrune && [name] <= solrune", "[name] >= 654 && [name] <= 657"];
	 *  	This will exclude muling of runes from tal through sol, and any essences.
	 */
	Config.AutoMule.Trigger = [];
	Config.AutoMule.Force = [];
	Config.AutoMule.Exclude = [];

	// Additional item info log settings. All info goes to \logs\ItemLog.txt
	Config.ItemInfo = false; // Log stashed, skipped (due to no space) or sold items.
	Config.ItemInfoQuality = []; // The quality of sold items to log. See NTItemAlias.dbl for values. Example: Config.ItemInfoQuality = [6, 7, 8];

	// Item identification settings
	Config.CainID.Enable = false; // Identify items at Cain
	Config.CainID.MinGold = 2500000; // Minimum gold (stash + character) to have in order to use Cain.
	Config.CainID.MinUnids = 3; // Minimum number of unid items in order to use Cain.
	Config.FieldID = false; // Identify items in the field instead of going to town.
	Config.DroppedItemsAnnounce.Enable = false;	// Announce Dropped Items to in-game newbs
	Config.DroppedItemsAnnounce.Quality = []; // Quality of item to announce. See NTItemAlias.dbl for values. Example: Config.DroppedItemsAnnounce.Quality = [6, 7, 8];

	// Manager Item Log Screen
	Config.LogKeys = false; // Log keys on item viewer
	Config.LogOrgans = true; // Log organs on item viewer
	Config.LogLowRunes = false; // Log low runes (El - Dol) on item viewer
	Config.LogMiddleRunes = false; // Log middle runes (Hel - Mal) on item viewer
	Config.LogHighRunes = true; // Log high runes (Ist - Zod) on item viewer
	Config.LogLowGems = false; // Log low gems (chipped, flawed, normal) on item viewer
	Config.LogHighGems = false; // Log high gems (flawless, perfect) on item viewer
	Config.SkipLogging = []; // Custom log skip list. Set as three digit item code or classid. Example: ["tes", "ceh", 656, 657] will ignore logging of essences.
	Config.ShowCubingInfo = true; // Show cubing messages on console

	// Repair settings
	Config.CubeRepair = false; // Repair weapons with Ort and armor with Ral rune. Don't use it if you don't understand the risk of losing items.
	Config.RepairPercent = 40; // Durability percent of any equipped item that will trigger repairs.

	// Gambling config
	Config.Gamble = false;
	Config.GambleGoldStart = 1000000;
	Config.GambleGoldStop = 500000;

	// List of item names or classids for gambling. Check libs/NTItemAlias.dbl file for other item classids.
	Config.GambleItems.push("Amulet");
	Config.GambleItems.push("Ring");
	Config.GambleItems.push("Circlet");
	Config.GambleItems.push("Coronet");

	/* Cubing config. All recipe names are available in Templates/Cubing.txt. For item names/classids check NTItemAlias.dbl
	 * The format is Config.Recipes.push([recipe_name, item_name_or_classid, etherealness]). Etherealness is optional and only applies to some recipes.
	 */
	Config.Cubing = false; // Set to true to enable cubing.

	// Ingredients for the following recipes will be auto-picked, for classids check libs/NTItemAlias.dbl

	//Config.Recipes.push([Recipe.Gem, "Flawless Amethyst"]); // Make Perfect Amethyst
	//Config.Recipes.push([Recipe.Gem, "Flawless Topaz"]); // Make Perfect Topaz
	//Config.Recipes.push([Recipe.Gem, "Flawless Sapphire"]); // Make Perfect Sapphire
	//Config.Recipes.push([Recipe.Gem, "Flawless Emerald"]); // Make Perfect Emerald
	//Config.Recipes.push([Recipe.Gem, "Flawless Ruby"]); // Make Perfect Ruby
	//Config.Recipes.push([Recipe.Gem, "Flawless Diamond"]); // Make Perfect Diamond
	//Config.Recipes.push([Recipe.Gem, "Flawless Skull"]); // Make Perfect Skull

	//Config.Recipes.push([Recipe.Token]); // Make Token of Absolution

	//Config.Recipes.push([Recipe.Rune, "Pul Rune"]); // Upgrade Pul to Um
	//Config.Recipes.push([Recipe.Rune, "Um Rune"]); // Upgrade Um to Mal
	//Config.Recipes.push([Recipe.Rune, "Mal Rune"]); // Upgrade Mal to Ist
	//Config.Recipes.push([Recipe.Rune, "Ist Rune"]); // Upgrade Ist to Gul
	//Config.Recipes.push([Recipe.Rune, "Gul Rune"]); // Upgrade Gul to Vex

	//Config.Recipes.push([Recipe.Caster.Amulet]); // Craft Caster Amulet
	//Config.Recipes.push([Recipe.Blood.Ring]); // Craft Blood Ring
	//Config.Recipes.push([Recipe.Blood.Helm, "Armet"]); // Craft Blood Armet
	//Config.Recipes.push([Recipe.HitPower.Gloves, "Vambraces"]); // Craft Hit Power Vambraces

	// The gems not used by other recipes will be used for magic item rerolling.

	//Config.Recipes.push([Recipe.Reroll.Magic, "Diadem"]); // Reroll magic Diadem
	//Config.Recipes.push([Recipe.Reroll.Magic, "Grand Charm"]); // Reroll magic Grand Charm (ilvl 91+)

	//Config.Recipes.push([Recipe.Reroll.Rare, "Diadem"]); // Reroll rare Diadem

	/* Base item for the following recipes must be in pickit. The rest of the ingredients will be auto-picked.
	 * Use Roll.Eth, Roll.NonEth or Roll.All to determine what kind of base item to roll - ethereal, non-ethereal or all.
	 */
	//Config.Recipes.push([Recipe.Socket.Weapon, "Thresher", Roll.Eth]); // Socket ethereal Thresher
	//Config.Recipes.push([Recipe.Socket.Weapon, "Cryptic Axe", Roll.Eth]); // Socket ethereal Cryptic Axe
	//Config.Recipes.push([Recipe.Socket.Armor, "Sacred Armor", Roll.Eth]); // Socket ethereal Sacred Armor
	//Config.Recipes.push([Recipe.Socket.Armor, "Archon Plate", Roll.Eth]); // Socket ethereal Archon Plate

	//Config.Recipes.push([Recipe.Unique.Armor.ToExceptional, "Heavy Gloves", Roll.NonEth]); // Upgrade Bloodfist to Exceptional
	//Config.Recipes.push([Recipe.Unique.Armor.ToExceptional, "Light Gauntlets", Roll.NonEth]); // Upgrade Magefist to Exceptional
	//Config.Recipes.push([Recipe.Unique.Armor.ToElite, "Sharkskin Gloves", Roll.NonEth]); // Upgrade Bloodfist or Grave Palm to Elite
	//Config.Recipes.push([Recipe.Unique.Armor.ToElite, "Battle Gauntlets", Roll.NonEth]); // Upgrade Magefist or Lavagout to Elite
	//Config.Recipes.push([Recipe.Unique.Armor.ToElite, "War Boots", Roll.NonEth]); // Upgrade Gore Rider to Elite

	/* Runeword config. All recipes are available in Templates/Runewords.txt
	 * Keep lines follow pickit format and any given runeword is tested vs ALL lines so you don't need to repeat them
	 */
	Config.MakeRunewords = false; // Set to true to enable runeword making/rerolling

	//Config.Runewords.push([Runeword.Insight, "Thresher", Roll.Eth]); // Make ethereal Insight Thresher
	//Config.Runewords.push([Runeword.Insight, "Cryptic Axe", Roll.Eth]); // Make ethereal Insight Cryptic Axe

	//Config.KeepRunewords.push("[type] == polearm # [meditationaura] == 17");

	//Config.Runewords.push([Runeword.Spirit, "Monarch", Roll.NonEth]); // Make Spirit Monarch
	//Config.Runewords.push([Runeword.Spirit, "Sacred Targe", Roll.NonEth]); // Make Spirit Sacred Targe

	//Config.KeepRunewords.push("[type] == shield || [type] == auricshields # [fcr] == 35");

	// Public game options

	// If LocalChat is enabled, chat can be sent via 'sendCopyData' instead of BNET
	// To allow 'say' to use BNET, use 'say("msg", true)', the 2nd parameter will force BNET
	// LocalChat messages will only be visible on clients running on the same PC
	Config.LocalChat.Enabled = false; // enable the LocalChat system
	Config.LocalChat.Toggle = false; // optional, set to KEY value to toggle through modes 0, 1, 2
	Config.LocalChat.Mode = 0; // 0 = disabled, 1 = chat from 'say' (recommended), 2 = all chat (for manual play)
	// If Config.Leader is set, the bot will only accept invites from leader. If Config.PublicMode is not 0, Baal and Diablo script will open Town Portals.
	Config.PublicMode = 0; // 1 = invite and accept, 2 = accept only, 3 = invite only, 0 = disable
	// Party message settings. Each setting represents an array of messages that will be randomly chosen.
	// $name, $level, $class and $killer are replaced by the player's name, level, class and killer
	Config.Greetings = []; // Example: ["Hello, $name (level $level $class)"]
	Config.DeathMessages = []; // Example: ["Watch out for that $killer, $name!"]
	Config.Congratulations = []; // Example: ["Congrats on level $level, $name!"]
	Config.ShitList = false; // Blacklist hostile players so they don't get invited to party.
	Config.UnpartyShitlisted = false; // Leave party if someone invited a blacklisted player.

	// General config
	Config.AutoMap = false; // Set to true to open automap at the beginning of the game.
	Config.LastMessage = ""; // Message or array of messages to say at the end of the run. Use $nextgame to say next game - "Next game: $nextgame" (works with lead entry point)
	Config.MinGameTime = 60; // Min game time in seconds. Bot will TP to town and stay in game if the run is completed before.
	Config.MaxGameTime = 0; // Maximum game time in seconds. Quit game when limit is reached.
	Config.TeleSwitch = false; // Switch to secondary (non-primary) slot when teleporting more than 5 nodes.
	Config.OpenChests = false; // Open chests. Controls key buying.
	Config.MiniShopBot = true; // Scan items in NPC shops.
	Config.PacketShopping = false; // Use packets to shop. Improves shopping speed.
	Config.TownCheck = false; // Go to town if out of potions
	Config.LogExperience = false; // Print experience statistics in the manager.
	Config.PingQuit = [{Ping: 0, Duration: 0}]; // Quit if ping is over the given value for over the given time period in seconds.

	// Shrine Scanner - scan for shrines while moving.
	// Put the shrine types in order of priority (from highest to lowest). For a list of types, see sdk/shrines.txt
	Config.ScanShrines = [];

	// MF Switch
	Config.MFSwitchPercent = 0; // Boss life % to switch to non-primiary weapon slot. Set to 0 to disable.

	// Primary Slot - Bot will try to determine primary slot if not used (non-cta slot that's not empty)
	Config.PrimarySlot = -1; // Set to use specific weapon slot as primary weapon slot: -1 = disabled, 0 = slot I, 1 = slot II

	// Fastmod config
	Config.FCR = 0; // 0 - disable, 1 to 255 - set value of faster cast rate
	Config.FHR = 0; // 0 - disable, 1 to 255 - set value of faster hit recovery
	Config.FBR = 0; // 0 - disable, 1 to 255 - set value of faster block recovery
	Config.IAS = 0; // 0 - disable, 1 to 255 - set value of increased attack speed
	Config.PacketCasting = 0; // 0 = disable, 1 = packet teleport, 2 = full packet casting.
	Config.WaypointMenu = true;

	// Anti-hostile config
	Config.AntiHostile = false; // Enable anti-hostile
	Config.HostileAction = 0; // 0 - quit immediately, 1 - quit when hostile player is sighted, 2 - attack hostile
	Config.TownOnHostile = false; // Go to town instead of quitting when HostileAction is 0 or 1
	Config.RandomPrecast = false; // Anti-PK measure, only supported in Baal and BaalHelper and BaalAssisstant at the moment.
	Config.ViperCheck = false; // Quit if revived Tomb Vipers are sighted

	// DClone config
	Config.StopOnDClone = true; // Go to town and idle as soon as Diablo walks the Earth
	Config.SoJWaitTime = 5; // Time in minutes to wait for another SoJ sale before leaving game. 0 = disabled
	Config.KillDclone = false; // Go to Palace Cellar 3 and try to kill Diablo Clone. Pointless if you already have Annihilus.
	Config.DCloneQuit = false; // 1 = quit when Diablo walks, 2 = quit on soj sales, 0 = disabled

	// Monster skip config
	// Skip immune monsters. Possible options: "fire", "cold", "lightning", "poison", "physical", "magic".
	// You can combine multiple resists with "and", for example - "fire and cold", "physical and cold and poison"
	Config.SkipImmune = [];
	// Skip enchanted monsters. Possible options: "extra strong", "extra fast", "cursed", "magic resistant", "fire enchanted", "lightning enchanted", "cold enchanted", "mana burn", "teleportation", "spectral hit", "stone skin", "multiple shots".
	// You can combine multiple enchantments with "and", for example - "cursed and extra fast", "mana burn and extra strong and lightning enchanted"
	Config.SkipEnchant = [];
	// Skip monsters with auras. Possible options: "fanaticism", "might", "holy fire", "blessed aim", "holy freeze", "holy shock". Conviction is bugged, don't use it.
	Config.SkipAura = [];
	// Uncomment the following line to always attempt to kill these bosses despite immunities and mods
	//Config.SkipException = [getLocaleString(2851), getLocaleString(2852), getLocaleString(2853)]; // vizier, de seis, infector

	/* Attack config
	 * To disable an attack, set it to -1
	 * Skills MUST be POSITIVE numbers. For reference see http://pastebin.com/baShRwWM
	 */
	Config.AttackSkill[0] = -1; // Preattack skill.
	Config.AttackSkill[1] = -1; // Primary skill to bosses.
	Config.AttackSkill[2] = -1; // Primary untimed skill to bosses. Keep at -1 if Config.AttackSkill[1] is untimed skill.
	Config.AttackSkill[3] = -1; // Primary skill to others.
	Config.AttackSkill[4] = -1; // Primary untimed skill to others. Keep at -1 if Config.AttackSkill[3] is untimed skill.
	Config.AttackSkill[5] = -1; // Secondary skill if monster is immune to primary.
	Config.AttackSkill[6] = -1; // Secondary untimed skill if monster is immune to primary untimed.

	// Low mana skills - these will be used if main skills can't be cast.
	Config.LowManaSkill[0] = -1; // Timed low mana skill.
	Config.LowManaSkill[1] = -1; // Untimed low mana skill.

	/* Advanced Attack config. Allows custom skills to be used on custom monsters.
	 *	Format: "Monster Name": [timed skill id, untimed skill id]
	 *	Multiple entries are separated by commas
	 */
	Config.CustomAttack = {
		//"Monster Name": [-1, -1]
	};

	Config.BossPriority = false; // Set to true to attack Unique/SuperUnique monsters first when clearing
	Config.ClearType = 0xF; // Monster spectype to kill in level clear scripts (ie. Mausoleum). 0xF = skip normal, 0x7 = champions/bosses, 0 = all
	Config.TeleStomp = false; // Use merc to attack bosses if they're immune to attacks, but not to physical damage

	// Wereform setup. Make sure you read Templates/Attacks.txt for attack skill format.
	Config.Wereform = false; // 0 / false - don't shapeshift, 1 / "Werewolf" - change to werewolf, 2 / "Werebear" - change to werebear

	// Class specific config
	Config.SummonRaven = false;
	Config.SummonAnimal = "Grizzly"; // 0 = disabled, 1 or "Spirit Wolf" = summon spirit wolf, 2 or "Dire Wolf" = summon dire wolf, 3 or "Grizzly" = summon grizzly
	Config.SummonSpirit = "Oak Sage"; // 0 = disabled, 1 / "Oak Sage", 2 / "Heart of Wolverine", 3 / "Spirit of Barbs"
	Config.SummonVine = "Poison Creeper"; // 0 = disabled, 1 / "Poison Creeper", 2 / "Carrion Vine", 3 / "Solar Creeper"

	/* AutoSkill builds character based on array defined by the user and it replaces AutoBuild's skill system.
	 * AutoSkill will automatically spend skill points and it can also allocate any prerequisite skills as required.
	 *
	 * Format: Config.AutoSkill.Build = [[skillID, count, satisfy], [skillID, count, satisfy], ... [skillID, count, satisfy]];
	 *	skill - skill id number (see /sdk/skills.txt)
	 *	count - maximum number of skill points to allocate for that skill
	 *	satisfy - boolean value to stop(true) or continue(false) further allocation until count is met. Defaults to true if not specified.
	 *
	 *	See libs/config/Templates/AutoSkillExampleBuilds.txt for Config.AutoSkill.Build examples.
	 */
	Config.AutoSkill.Enabled = false; // Enable or disable AutoSkill system
	Config.AutoSkill.Save = 0; // Number of skill points that will not be spent and saved
	Config.AutoSkill.Build = [];

	/* AutoStat builds character based on array defined by the user and this will replace AutoBuild's stat system.
	 * AutoStat will stat Build array order. You may want to stat strength or dexterity first to meet item requirements.
	 *
	 * Format: Config.AutoStat.Build = [[statType, stat], [statType, stat], ... [statType, stat]];
	 *	statType - defined as string, or as corresponding stat integer. "strength" or 0, "dexterity" or 2, "vitality" or 3, "energy" or 1
	 *	stat - set to an integer value, and it will spend stat points until it reaches desired *hard stat value (*+stats from items are ignored).
	 *	You can also set stat to string value "all", and it will spend all the remaining points.
	 *	Dexterity can be set to "block" and it will stat dexterity up the the desired block value specified in arguemnt (ignored in classic).
	 *
	 *	See libs/config/Templates/AutoStatExampleBuilds.txt for Config.AutoStat.Build examples.
	 */
	Config.AutoStat.Enabled = false; // Enable or disable AutoStat system
	Config.AutoStat.Save = 0; // Number stat points that will not be spent and saved.
	Config.AutoStat.BlockChance = 0; // An integer value set to desired block chance. This is ignored in classic.
	Config.AutoStat.UseBulk = true; // Set true to spend multiple stat points at once (up to 100), or false to spend singe point at a time.
	Config.AutoStat.Build = [];

	// AutoBuild System ( See /d2bs/kolbot/libs/config/Builds/README.txt for instructions )
	Config.AutoBuild.Enabled = false;			//	This will enable or disable the AutoBuild system

	Config.AutoBuild.Template = "BuildName";	//	The name of the build associated with an existing
												//	template filename located in libs/config/Builds/

	Config.AutoBuild.Verbose = true;			//	Allows script to print messages in console
	Config.AutoBuild.DebugMode = true;			//	Debug mode prints a little more information to console and
												//	logs activity to /logs/AutoBuild.CharacterName._MM_DD_YYYY.log
												//	It automatically enables Config.AutoBuild.Verbose
}