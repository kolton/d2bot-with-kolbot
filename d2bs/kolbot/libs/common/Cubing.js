/**
*	@filename	Cubing.js
*	@author		kolton
*	@desc		transmute Horadric Cube recipes
*/

if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

var Roll = {
	All: 0,
	Eth: 1,
	NonEth: 2
};

var Recipe = {
	Gem: 0,
	HitPower: {
		Helm: 1,
		Boots: 2,
		Gloves: 3,
		Belt: 4,
		Shield: 5,
		Body: 6,
		Amulet: 7,
		Ring: 8,
		Weapon: 9
	},
	Blood: {
		Helm: 10,
		Boots: 11,
		Gloves: 12,
		Belt: 13,
		Shield: 14,
		Body: 15,
		Amulet: 16,
		Ring: 17,
		Weapon: 18
	},
	Caster: {
		Helm: 19,
		Boots: 20,
		Gloves: 21,
		Belt: 22,
		Shield: 23,
		Body: 24,
		Amulet: 25,
		Ring: 26,
		Weapon: 27
	},
	Safety: {
		Helm: 28,
		Boots: 29,
		Gloves: 30,
		Belt: 31,
		Shield: 32,
		Body: 33,
		Amulet: 34,
		Ring: 35,
		Weapon: 36
	},
	Unique: {
		Weapon: {
			ToExceptional: 37,
			ToElite: 38
		},
		Armor: {
			ToExceptional: 39,
			ToElite: 40
		}
	},
	Rare: {
		Weapon: {
			ToExceptional: 41,
			ToElite: 42
		},
		Armor: {
			ToExceptional: 43,
			ToElite: 44
		}
	},
	Socket: {
		Shield: 45,
		Weapon: 46,
		Armor: 47,
		Helm: 48
	},
	Reroll: {
		Magic: 49,
		Rare: 50,
		HighRare: 51
	},
	Rune: 52,
	Token: 53,
	LowToNorm: {
		Armor: 54,
		Weapon: 55
	}
};

var Cubing = {
	recipes: [],
	gemList: [],

	init: function () {
		if (!Config.Cubing) {
			return;
		}

		//print("We have " + Config.Recipes.length + " cubing recipe(s).");

		var i;

		for (i = 0; i < Config.Recipes.length; i += 1) {
			if (Config.Recipes[i].length > 1 && isNaN(Config.Recipes[i][1])) {
				if (NTIPAliasClassID.hasOwnProperty(Config.Recipes[i][1].replace(/\s+/g, "").toLowerCase())) {
					Config.Recipes[i][1] = NTIPAliasClassID[Config.Recipes[i][1].replace(/\s+/g, "").toLowerCase()];
				} else {
					Misc.errorReport("ÿc1Invalid cubing entry:ÿc0 " + Config.Recipes[i][1]);
					Config.Recipes.splice(i, 1);

					i -= 1;
				}
			}
		}

		this.buildRecipes();
		this.buildGemList();
		this.buildLists();
	},

	buildGemList: function () {
		var i, j,
            gemList = [ItemClassIds.Perfect_Amethyst, ItemClassIds.Perfect_Topaz, ItemClassIds.Perfect_Sapphire, ItemClassIds.Perfect_Emerald, ItemClassIds.Perfect_Ruby, ItemClassIds.Perfect_Diamond, ItemClassIds.Perfect_Skull];

		for (i = 0; i < this.recipes.length; i += 1) {
			if ([0, 49].indexOf(this.recipes[i].Index) === -1) { // Skip gems and other magic rerolling recipes
				for (j = 0; j < this.recipes[i].Ingredients.length; j += 1) {
					if (gemList.indexOf(this.recipes[i].Ingredients[j]) > -1) {
						gemList.splice(gemList.indexOf(this.recipes[i].Ingredients[j]), 1);
					}
				}
			}
		}

		this.gemList = gemList.slice(0);

		return true;
	},

	getCube: function () {
		// Don't activate from townchicken
		if (getScript(true).name === "tools\\townchicken.js") {
			return false;
		}

		var i, cube, chest;
        
        Pather.useWaypoint(Areas.Act2.Halls_Of_The_Dead_Level_2, true);
		Precast.doPrecast(true);

        if (Pather.moveToExit(Areas.Act2.Halls_Of_The_Dead_Level_3, true) && Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Horadric_Cube_Chest)) {
            chest = getUnit(UnitType.Object, UniqueObjectIds.Horadric_Cube_Chest);

			if (chest) {
				Misc.openChest(chest);

				for (i = 0; i < 5; i += 1) {
                    cube = getUnit(UnitType.Item, ItemClassIds.Horadric_Cube);

					if (cube) {
						Pickit.pickItem(cube);

						break;
					}

					delay(200);
				}
			}
		}

		Town.goToTown();

        cube = me.getItem(ItemClassIds.Horadric_Cube);

		if (cube) {
			return Storage.Stash.MoveTo(cube);
		}

		return false;
	},

	buildRecipes: function () {
		var i;

		this.recipes = [];

		for (i = 0; i < Config.Recipes.length; i += 1) {
			if (typeof Config.Recipes[i] !== "object" || (Config.Recipes[i].length > 2 && typeof Config.Recipes[i][2] !== "number") || Config.Recipes[i].length < 1) {
				throw new Error("Cubing.buildRecipes: Invalid recipe format.");
			}

			switch (Config.Recipes[i][0]) {
			case Recipe.Gem:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], Config.Recipes[i][1], Config.Recipes[i][1]], Index: Recipe.Gem, AlwaysEnabled: true});

				break;
            case Recipe.HitPower.Helm:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Ith_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Sapphire], Level: 84, Index: Recipe.HitPower.Helm });

				break;
			case Recipe.HitPower.Boots:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Ral_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Sapphire], Level: 71, Index: Recipe.HitPower.Boots});

				break;
			case Recipe.HitPower.Gloves:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Ort_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Sapphire], Level: 79, Index: Recipe.HitPower.Gloves});

				break;
			case Recipe.HitPower.Belt:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Tal_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Sapphire], Level: 71, Index: Recipe.HitPower.Belt});

				break;
			case Recipe.HitPower.Shield:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Eth_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Sapphire], Level: 82, Index: Recipe.HitPower.Shield});

				break;
			case Recipe.HitPower.Body:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Nef_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Sapphire], Level: 85, Index: Recipe.HitPower.Body});

				break;
			case Recipe.HitPower.Amulet:
                    this.recipes.push({ Ingredients: [ItemClassIds.Amulet, ItemClassIds.Thul_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Sapphire], Level: 90, Index: Recipe.HitPower.Amulet});

				break;
			case Recipe.HitPower.Ring:
                    this.recipes.push({ Ingredients: [ItemClassIds.Ring, ItemClassIds.Amn_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Sapphire], Level: 77, Index: Recipe.HitPower.Ring});

				break;
			case Recipe.HitPower.Weapon:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Tir_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Sapphire], Level: 85, Index: Recipe.HitPower.Weapon});

				break;
			case Recipe.Blood.Helm:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Ral_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Ruby], Level: 84, Index: Recipe.Blood.Helm});

				break;
			case Recipe.Blood.Boots:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Eth_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Ruby], Level: 71, Index: Recipe.Blood.Boots});

				break;
			case Recipe.Blood.Gloves:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Nef_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Ruby], Level: 79, Index: Recipe.Blood.Gloves});

				break;
			case Recipe.Blood.Belt:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Tal_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Ruby], Level: 71, Index: Recipe.Blood.Belt});

				break;
			case Recipe.Blood.Shield:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Ith_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Ruby], Level: 82, Index: Recipe.Blood.Shield});

				break;
			case Recipe.Blood.Body:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Thul_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Ruby], Level: 85, Index: Recipe.Blood.Body});

				break;
			case Recipe.Blood.Amulet:
                    this.recipes.push({ Ingredients: [ItemClassIds.Amulet, ItemClassIds.Amn_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Ruby], Level: 90, Index: Recipe.Blood.Amulet});

				break;
			case Recipe.Blood.Ring:
                    this.recipes.push({ Ingredients: [ItemClassIds.Ring, ItemClassIds.Sol_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Ruby], Level: 77, Index: Recipe.Blood.Ring});

				break;
			case Recipe.Blood.Weapon:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Ort_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Ruby], Level: 85, Index: Recipe.Blood.Weapon});

				break;
			case Recipe.Caster.Helm:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Nef_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Amethyst], Level: 84, Index: Recipe.Caster.Helm});

				break;
			case Recipe.Caster.Boots:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Thul_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Amethyst], Level: 71, Index: Recipe.Caster.Boots});

				break;
			case Recipe.Caster.Gloves:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Ort_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Amethyst], Level: 79, Index: Recipe.Caster.Gloves});

				break;
			case Recipe.Caster.Belt:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Ith_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Amethyst], Level: 71, Index: Recipe.Caster.Belt});

				break;
			case Recipe.Caster.Shield:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Eth_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Amethyst], Level: 82, Index: Recipe.Caster.Shield});

				break;
			case Recipe.Caster.Body:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Tal_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Amethyst], Level: 85, Index: Recipe.Caster.Body});

				break;
			case Recipe.Caster.Amulet:
                    this.recipes.push({ Ingredients: [ItemClassIds.Amulet, ItemClassIds.Ral_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Amethyst], Level: 90, Index: Recipe.Caster.Amulet});

				break;
			case Recipe.Caster.Ring:
                    this.recipes.push({ Ingredients: [ItemClassIds.Ring, ItemClassIds.Amn_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Amethyst], Level: 77, Index: Recipe.Caster.Ring});

				break;
			case Recipe.Caster.Weapon:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Tir_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Amethyst], Level: 85, Index: Recipe.Caster.Weapon});

				break;
			case Recipe.Safety.Helm:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Ith_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Emerald], Level: 84, Index: Recipe.Safety.Helm});

				break;
			case Recipe.Safety.Boots:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Ort_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Emerald], Level: 71, Index: Recipe.Safety.Boots});

				break;
			case Recipe.Safety.Gloves:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Ral_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Emerald], Level: 79, Index: Recipe.Safety.Gloves});

				break;
			case Recipe.Safety.Belt:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Tal_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Emerald], Level: 71, Index: Recipe.Safety.Belt});

				break;
			case Recipe.Safety.Shield:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Nef_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Emerald], Level: 82, Index: Recipe.Safety.Shield});

				break;
			case Recipe.Safety.Body:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Eth_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Emerald], Level: 85, Index: Recipe.Safety.Body});

				break;
			case Recipe.Safety.Amulet:
                    this.recipes.push({ Ingredients: [ItemClassIds.Amulet, ItemClassIds.Thul_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Emerald], Level: 90, Index: Recipe.Safety.Amulet});

				break;
			case Recipe.Safety.Ring:
                    this.recipes.push({ Ingredients: [ItemClassIds.Ring, ItemClassIds.Amn_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Emerald], Level: 77, Index: Recipe.Safety.Ring});

				break;
			case Recipe.Safety.Weapon:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Sol_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Emerald], Level: 85, Index: Recipe.Safety.Weapon});

				break;
			case Recipe.Unique.Weapon.ToExceptional:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Ral_Rune, ItemClassIds.Jewel, ItemClassIds.Perfect_Emerald], Index: Recipe.Unique.Weapon.ToExceptional, Ethereal: Config.Recipes[i][2]});

				break;
			case Recipe.Unique.Weapon.ToElite: // Ladder only
				if (me.ladder) {
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Lum_Rune, ItemClassIds.Pul_Rune, ItemClassIds.Perfect_Emerald], Index: Recipe.Unique.Weapon.ToElite, Ethereal: Config.Recipes[i][2]});
				}

				break;
			case Recipe.Unique.Armor.ToExceptional:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Tal_Rune, ItemClassIds.Shael_Rune, ItemClassIds.Perfect_Diamond], Index: Recipe.Unique.Armor.ToExceptional, Ethereal: Config.Recipes[i][2]});

				break;
			case Recipe.Unique.Armor.ToElite: // Ladder only
				if (me.ladder) {
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Lem_Rune, ItemClassIds.Ko_Rune, ItemClassIds.Perfect_Diamond], Index: Recipe.Unique.Armor.ToElite, Ethereal: Config.Recipes[i][2]});
				}

				break;
			case Recipe.Rare.Weapon.ToExceptional:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Ort_Rune, ItemClassIds.Amn_Rune, ItemClassIds.Perfect_Sapphire], Index: Recipe.Rare.Weapon.ToExceptional, Ethereal: Config.Recipes[i][2]});

				break;
			case Recipe.Rare.Weapon.ToElite:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Fal_Rune, ItemClassIds.Um_Rune, ItemClassIds.Perfect_Sapphire], Index: Recipe.Rare.Weapon.ToElite, Ethereal: Config.Recipes[i][2]});

				break;
			case Recipe.Rare.Armor.ToExceptional:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Ral_Rune, ItemClassIds.Thul_Rune, ItemClassIds.Perfect_Amethyst], Index: Recipe.Rare.Armor.ToExceptional, Ethereal: Config.Recipes[i][2]});

				break;
			case Recipe.Rare.Armor.ToElite:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Ko_Rune, ItemClassIds.Pul_Rune, ItemClassIds.Perfect_Amethyst], Index: Recipe.Rare.Armor.ToElite, Ethereal: Config.Recipes[i][2]});

				break;
			case Recipe.Socket.Shield:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Tal_Rune, ItemClassIds.Amn_Rune, ItemClassIds.Perfect_Ruby], Index: Recipe.Socket.Shield, Ethereal: Config.Recipes[i][2]});

				break;
			case Recipe.Socket.Weapon:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Ral_Rune, ItemClassIds.Amn_Rune, ItemClassIds.Perfect_Amethyst], Index: Recipe.Socket.Weapon, Ethereal: Config.Recipes[i][2]});

				break;
			case Recipe.Socket.Armor:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Tal_Rune, ItemClassIds.Thul_Rune, ItemClassIds.Perfect_Topaz], Index: Recipe.Socket.Armor, Ethereal: Config.Recipes[i][2]});

				break;
			case Recipe.Socket.Helm:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Ral_Rune, ItemClassIds.Thul_Rune, ItemClassIds.Perfect_Sapphire], Index: Recipe.Socket.Helm, Ethereal: Config.Recipes[i][2]});

				break;
			case Recipe.Reroll.Magic: // Hacky solution ftw
				this.recipes.push({Ingredients: [Config.Recipes[i][1], "pgem", "pgem", "pgem"], Level: 91, Index: Recipe.Reroll.Magic});

				break;
			case Recipe.Reroll.Rare:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Perfect_Skull, ItemClassIds.Perfect_Skull, ItemClassIds.Perfect_Skull, ItemClassIds.Perfect_Skull, ItemClassIds.Perfect_Skull, ItemClassIds.Perfect_Skull], Index: Recipe.Reroll.Rare});

				break;
			case Recipe.Reroll.HighRare:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Perfect_Skull, ItemClassIds.Ring], Index: Recipe.Reroll.HighRare, Enabled: false});

				break;
			case Recipe.LowToNorm.Weapon:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.Eld_Rune, "cgem"], Index: Recipe.LowToNorm.Weapon});

				break;
			case Recipe.LowToNorm.Armor:
                    this.recipes.push({ Ingredients: [Config.Recipes[i][1], ItemClassIds.El_Rune, "cgem"], Index: Recipe.LowToNorm.Armor});

				break;
			case Recipe.Rune:
				switch (Config.Recipes[i][1]) {
                    case ItemClassIds.El_Rune: // el
                    case ItemClassIds.Eld_Rune: // eld
                    case ItemClassIds.Tir_Rune: // tir
                    case ItemClassIds.Nef_Rune: // nef
                    case ItemClassIds.Eth_Rune: // eth
                    case ItemClassIds.Ith_Rune: // ith
                    case ItemClassIds.Tal_Rune: // tal
                    case ItemClassIds.Ral_Rune: // ral
                    case ItemClassIds.Ort_Rune: // ort
					this.recipes.push({Ingredients: [Config.Recipes[i][1], Config.Recipes[i][1], Config.Recipes[i][1]], Index: Recipe.Rune, AlwaysEnabled: true});

					break;
                    case ItemClassIds.Thul_Rune: // thul->amn
                        this.recipes.push({ Ingredients: [ItemClassIds.Thul_Rune, ItemClassIds.Thul_Rune, ItemClassIds.Thul_Rune, ItemClassIds.Chipped_Topaz], Index: Recipe.Rune});

					break;
                    case ItemClassIds.Amn_Rune: // amn->sol
                        this.recipes.push({ Ingredients: [ItemClassIds.Amn_Rune, ItemClassIds.Amn_Rune, ItemClassIds.Amn_Rune, ItemClassIds.Chipped_Amethyst], Index: Recipe.Rune});

					break;
                    case ItemClassIds.Sol_Rune: // sol->shael
                        this.recipes.push({ Ingredients: [ItemClassIds.Sol_Rune, ItemClassIds.Sol_Rune, ItemClassIds.Sol_Rune, ItemClassIds.Chipped_Sapphire], Index: Recipe.Rune});

					break;
                    case ItemClassIds.Shael_Rune: // shael->dol
                        this.recipes.push({ Ingredients: [ItemClassIds.Shael_Rune, ItemClassIds.Shael_Rune, ItemClassIds.Shael_Rune, ItemClassIds.Chipped_Ruby], Index: Recipe.Rune});

					break;
                    case ItemClassIds.Dol_Rune: // dol->hel
					if (me.ladder) {
                        this.recipes.push({ Ingredients: [ItemClassIds.Dol_Rune, ItemClassIds.Dol_Rune, ItemClassIds.Dol_Rune, ItemClassIds.Chipped_Emerald], Index: Recipe.Rune});
					}

					break;
                    case ItemClassIds.Hel_Rune: // hel->io
					if (me.ladder) {
                        this.recipes.push({ Ingredients: [ItemClassIds.Hel_Rune, ItemClassIds.Hel_Rune, ItemClassIds.Hel_Rune, ItemClassIds.Chipped_Diamond], Index: Recipe.Rune});
					}

					break;
                    case ItemClassIds.Io_Rune: // io->lum
					if (me.ladder) {
                        this.recipes.push({ Ingredients: [ItemClassIds.Io_Rune, ItemClassIds.Io_Rune, ItemClassIds.Io_Rune, ItemClassIds.Flawed_Topaz], Index: Recipe.Rune});
					}

					break;
                    case ItemClassIds.Lum_Rune: // lum->ko
					if (me.ladder) {
                        this.recipes.push({ Ingredients: [ItemClassIds.Lum_Rune, ItemClassIds.Lum_Rune, ItemClassIds.Lum_Rune, ItemClassIds.Flawed_Amethyst], Index: Recipe.Rune});
					}

					break;
                    case ItemClassIds.Ko_Rune: // ko->fal
					if (me.ladder) {
                        this.recipes.push({ Ingredients: [ItemClassIds.Ko_Rune, ItemClassIds.Ko_Rune, ItemClassIds.Ko_Rune, ItemClassIds.Flawed_Sapphire], Index: Recipe.Rune});
					}

					break;
                    case ItemClassIds.Fal_Rune: // fal->lem
					if (me.ladder) {
                        this.recipes.push({ Ingredients: [ItemClassIds.Fal_Rune, ItemClassIds.Fal_Rune, ItemClassIds.Fal_Rune, ItemClassIds.Flawed_Ruby], Index: Recipe.Rune});
					}

					break;
                    case ItemClassIds.Lem_Rune: // lem->pul
					if (me.ladder) {
                        this.recipes.push({ Ingredients: [ItemClassIds.Lem_Rune, ItemClassIds.Lem_Rune, ItemClassIds.Lem_Rune, ItemClassIds.Flawed_Emerald], Index: Recipe.Rune});
					}

					break;
                    case ItemClassIds.Pul_Rune: // pul->um
					if (me.ladder) {
                        this.recipes.push({ Ingredients: [ItemClassIds.Pul_Rune, ItemClassIds.Pul_Rune, ItemClassIds.Flawed_Diamond], Index: Recipe.Rune});
					}

					break;
                    case ItemClassIds.Um_Rune: // um->mal
					if (me.ladder) {
                        this.recipes.push({ Ingredients: [ItemClassIds.Um_Rune, ItemClassIds.Um_Rune, ItemClassIds.Topaz], Index: Recipe.Rune});
					}

					break;
                    case ItemClassIds.Mal_Rune: // mal->ist
					if (me.ladder) {
                        this.recipes.push({ Ingredients: [ItemClassIds.Mal_Rune, ItemClassIds.Mal_Rune, ItemClassIds.Amethyst], Index: Recipe.Rune});
					}

					break;
                    case ItemClassIds.Ist_Rune: // ist->gul
					if (me.ladder) {
                        this.recipes.push({ Ingredients: [ItemClassIds.Ist_Rune, ItemClassIds.Ist_Rune, ItemClassIds.Sapphire], Index: Recipe.Rune});
					}

					break;
                    case ItemClassIds.Gul_Rune: // gul->vex
					if (me.ladder) {
                        this.recipes.push({ Ingredients: [ItemClassIds.Gul_Rune, ItemClassIds.Gul_Rune, ItemClassIds.Ruby], Index: Recipe.Rune});
					}

					break;
                    case ItemClassIds.Vex_Rune: // vex->ohm
					if (me.ladder) {
                        this.recipes.push({ Ingredients: [ItemClassIds.Vex_Rune, ItemClassIds.Vex_Rune, ItemClassIds.Emerald], Index: Recipe.Rune});
					}

					break;
                    case ItemClassIds.Ohm_Rune: // ohm->lo
					if (me.ladder) {
                        this.recipes.push({ Ingredients: [ItemClassIds.Ohm_Rune, ItemClassIds.Ohm_Rune, ItemClassIds.Diamond], Index: Recipe.Rune});
					}

					break;
                    case ItemClassIds.Lo_Rune: // lo->sur
					if (me.ladder) {
                        this.recipes.push({ Ingredients: [ItemClassIds.Lo_Rune, ItemClassIds.Lo_Rune, ItemClassIds.Flawless_Topaz], Index: Recipe.Rune});
					}

					break;
                    case ItemClassIds.Sur_Rune: // sur->ber
					if (me.ladder) {
                        this.recipes.push({ Ingredients: [ItemClassIds.Sur_Rune, ItemClassIds.Sur_Rune, ItemClassIds.Flawless_Amethyst], Index: Recipe.Rune});
					}

					break;
                    case ItemClassIds.Ber_Rune: // ber->jah
					if (me.ladder) {
                        this.recipes.push({ Ingredients: [ItemClassIds.Ber_Rune, ItemClassIds.Ber_Rune, ItemClassIds.Flawless_Sapphire], Index: Recipe.Rune});
					}

					break;
                    case ItemClassIds.Jah_Rune: // jah->cham
					if (me.ladder) {
                        this.recipes.push({ Ingredients: [ItemClassIds.Jah_Rune, ItemClassIds.Jah_Rune, ItemClassIds.Flawless_Ruby], Index: Recipe.Rune});
					}

					break;
                    case ItemClassIds.Cham_Rune: // cham->zod
					if (me.ladder) {
                        this.recipes.push({ Ingredients: [ItemClassIds.Cham_Rune, ItemClassIds.Cham_Rune, ItemClassIds.Flawless_Emerald], Index: Recipe.Rune});
					}

					break;
				}

				break;
			case Recipe.Token:
                    this.recipes.push({ Ingredients: [ItemClassIds.Twisted_Essence_Of_Suffering, ItemClassIds.Charged_Essence_Of_Hatred, ItemClassIds.Burning_Essence_Of_Terror, ItemClassIds.Festering_Essence_Of_Destruction], Index: Recipe.Token, AlwaysEnabled: true});

				break;
			}
		}
	},

	validIngredients: [], // What we have
	neededIngredients: [], // What we need
	subRecipes: [],

	buildLists: function () {
		var i, j, k, items;

		CraftingSystem.checkSubrecipes();

		this.validIngredients = [];
        this.neededIngredients = [];
        items = me.findItems(-1, ItemLocation.Ground);

		for (i = 0; i < this.recipes.length; i += 1) {
			// Set default Enabled property - true if recipe is always enabled, false otherwise
			this.recipes[i].Enabled = this.recipes[i].hasOwnProperty("AlwaysEnabled");

IngredientLoop:
			for (j = 0; j < this.recipes[i].Ingredients.length; j += 1) {
				for (k = 0; k < items.length; k += 1) {
					if (((this.recipes[i].Ingredients[j] === "pgem" && this.gemList.indexOf(items[k].classid) > -1) ||
                        (this.recipes[i].Ingredients[j] === "cgem" && [ItemClassIds.Chipped_Amethyst, ItemClassIds.Chipped_Topaz, ItemClassIds.Chipped_Sapphire, ItemClassIds.Chipped_Emerald, ItemClassIds.Chipped_Ruby, ItemClassIds.Chipped_Diamond, ItemClassIds.Chipped_Skull].indexOf(items[k].classid) > -1) ||
						items[k].classid === this.recipes[i].Ingredients[j]) && this.validItem(items[k], this.recipes[i])) {

						// push the item's info into the valid ingredients array. this will be used to find items when checking recipes
						this.validIngredients.push({classid: items[k].classid, gid: items[k].gid});

						// Remove from item list to prevent counting the same item more than once
						items.splice(k, 1);

						k -= 1;

						// Enable recipes for gem/jewel pickup
						if (this.recipes[i].Index !== Recipe.Rune || (this.recipes[i].Index === Recipe.Rune && j >= 1)) { // Enable rune recipe after 2 bases are found
							this.recipes[i].Enabled = true;
						}

						continue IngredientLoop;
					}
				}

				// add the item to needed list - enable pickup
				this.neededIngredients.push({classid: this.recipes[i].Ingredients[j], recipe: this.recipes[i]});

				// skip flawless gems adding if we don't have the main item (Recipe.Gem and Recipe.Rune for el-ort are always enabled)
				if (!this.recipes[i].Enabled) {
					break;
				}

				// if the recipe is enabled (we have the main item), add flawless gem recipes (if needed)

                // Make perf amethyst
                if (this.subRecipes.indexOf(ItemClassIds.Perfect_Amethyst) === -1 && (this.recipes[i].Ingredients[j] === ItemClassIds.Perfect_Amethyst || (this.recipes[i].Ingredients[j] === "pgem" && this.gemList.indexOf(ItemClassIds.Perfect_Amethyst) > -1))) {
                    this.recipes.push({ Ingredients: [ItemClassIds.Flawless_Amethyst, ItemClassIds.Flawless_Amethyst, ItemClassIds.Flawless_Amethyst], Index: Recipe.Gem, AlwaysEnabled: true, MainRecipe: this.recipes[i].Index});
                    this.subRecipes.push(ItemClassIds.Perfect_Amethyst);
				}

				// Make perf topaz
                if (this.subRecipes.indexOf(ItemClassIds.Perfect_Topaz) === -1 && (this.recipes[i].Ingredients[j] === ItemClassIds.Perfect_Topaz || (this.recipes[i].Ingredients[j] === "pgem" && this.gemList.indexOf(ItemClassIds.Perfect_Topaz) > -1))) {
                    this.recipes.push({ Ingredients: [ItemClassIds.Flawless_Topaz, ItemClassIds.Flawless_Topaz, ItemClassIds.Flawless_Topaz], Index: Recipe.Gem, AlwaysEnabled: true, MainRecipe: this.recipes[i].Index});
                    this.subRecipes.push(ItemClassIds.Perfect_Topaz);
				}

				// Make perf sapphire
                if (this.subRecipes.indexOf(ItemClassIds.Perfect_Sapphire) === -1 && (this.recipes[i].Ingredients[j] === ItemClassIds.Perfect_Sapphire || (this.recipes[i].Ingredients[j] === "pgem" && this.gemList.indexOf(ItemClassIds.Perfect_Sapphire) > -1))) {
                    this.recipes.push({ Ingredients: [ItemClassIds.Flawless_Sapphire, ItemClassIds.Flawless_Sapphire, ItemClassIds.Flawless_Sapphire], Index: Recipe.Gem, AlwaysEnabled: true, MainRecipe: this.recipes[i].Index});
                    this.subRecipes.push(ItemClassIds.Perfect_Sapphire);
				}

				// Make perf emerald
                if (this.subRecipes.indexOf(ItemClassIds.Perfect_Emerald) === -1 && (this.recipes[i].Ingredients[j] === ItemClassIds.Perfect_Emerald || (this.recipes[i].Ingredients[j] === "pgem" && this.gemList.indexOf(ItemClassIds.Perfect_Emerald) > -1))) {
                    this.recipes.push({ Ingredients: [ItemClassIds.Flawless_Emerald, ItemClassIds.Flawless_Emerald, ItemClassIds.Flawless_Emerald], Index: Recipe.Gem, AlwaysEnabled: true, MainRecipe: this.recipes[i].Index});
                    this.subRecipes.push(ItemClassIds.Perfect_Emerald);
				}

				// Make perf ruby
                if (this.subRecipes.indexOf(ItemClassIds.Perfect_Ruby) === -1 && (this.recipes[i].Ingredients[j] === ItemClassIds.Perfect_Ruby || (this.recipes[i].Ingredients[j] === "pgem" && this.gemList.indexOf(ItemClassIds.Perfect_Ruby) > -1))) {
                    this.recipes.push({ Ingredients: [ItemClassIds.Flawless_Ruby, ItemClassIds.Flawless_Ruby, ItemClassIds.Flawless_Ruby], Index: Recipe.Gem, AlwaysEnabled: true, MainRecipe: this.recipes[i].Index});
                    this.subRecipes.push(ItemClassIds.Perfect_Ruby);
				}

				// Make perf diamond
                if (this.subRecipes.indexOf(ItemClassIds.Perfect_Diamond) === -1 && (this.recipes[i].Ingredients[j] === ItemClassIds.Perfect_Diamond || (this.recipes[i].Ingredients[j] === "pgem" && this.gemList.indexOf(ItemClassIds.Perfect_Diamond) > -1))) {
                    this.recipes.push({ Ingredients: [ItemClassIds.Flawless_Diamond, ItemClassIds.Flawless_Diamond, ItemClassIds.Flawless_Diamond], Index: Recipe.Gem, AlwaysEnabled: true, MainRecipe: this.recipes[i].Index});
                    this.subRecipes.push(ItemClassIds.Perfect_Diamond);
				}

				// Make perf skull
                if (this.subRecipes.indexOf(ItemClassIds.Perfect_Skull) === -1 && (this.recipes[i].Ingredients[j] === ItemClassIds.Perfect_Skull || (this.recipes[i].Ingredients[j] === "pgem" && this.gemList.indexOf(ItemClassIds.Perfect_Skull) > -1))) {
                    this.recipes.push({ Ingredients: [ItemClassIds.Flawless_Skull, ItemClassIds.Flawless_Skull, ItemClassIds.Flawless_Skull], Index: Recipe.Gem, AlwaysEnabled: true, MainRecipe: this.recipes[i].Index});
                    this.subRecipes.push(ItemClassIds.Perfect_Skull);
				}
			}
		}
	},

	// Remove unneeded flawless gem recipes
	clearSubRecipes: function () {
		var i;

		this.subRecipes = [];

		for (i = 0; i < this.recipes.length; i += 1) {
			if (this.recipes[i].hasOwnProperty("MainRecipe")) {
				this.recipes.splice(i, 1);

				i -= 1;
			}
		}
	},

	update: function () {
		this.clearSubRecipes();
		this.buildLists();
	},

	checkRecipe: function (recipe) {
		var i, j, item,
			usedGids = [],
			matchList = [];

		for (i = 0; i < recipe.Ingredients.length; i += 1) {
			for (j = 0; j < this.validIngredients.length; j += 1) {
				if (usedGids.indexOf(this.validIngredients[j].gid) === -1 && (
						this.validIngredients[j].classid === recipe.Ingredients[i] ||
						(recipe.Ingredients[i] === "pgem" && this.gemList.indexOf(this.validIngredients[j].classid) > -1) ||
                    (recipe.Ingredients[i] === "cgem" && [ItemClassIds.Chipped_Amethyst, ItemClassIds.Chipped_Topaz, ItemClassIds.Chipped_Sapphire, ItemClassIds.Chipped_Emerald, ItemClassIds.Chipped_Ruby, ItemClassIds.Chipped_Diamond, ItemClassIds.Chipped_Skull].indexOf(this.validIngredients[j].classid) > -1)
					)) {
					item = me.getItem(this.validIngredients[j].classid, -1, this.validIngredients[j].gid);

					if (item && this.validItem(item, recipe)) { // 26.11.2012. check if the item actually belongs to the given recipe
						// don't repeat the same item
						usedGids.push(this.validIngredients[j].gid);
						// push the item into the match list
						matchList.push(copyUnit(item));

						break;
					}
				}
			}

			// no new items in the match list = not enough ingredients
			if (matchList.length !== i + 1) {
				return false;
			}
		}

		// return the match list. these items go to cube
		return matchList;
	},

	// debug function - get what each recipe needs
	getRecipeNeeds: function (index) {
		var i,
			rval = " [";

		for (i = 0; i < this.neededIngredients.length; i += 1) {
			if (this.neededIngredients[i].recipe.Index === index) {
				rval += this.neededIngredients[i].classid + (i === this.neededIngredients.length - 1 ? "" : " ");
			}
		}

		rval += "]";

		return rval;
	},

	checkItem: function (unit) { // Check an item on ground for pickup
		if (!Config.Cubing) {
			return false;
		}

		if (this.keepItem(unit)) {
			return true;
		}

		var i;

		for (i = 0; i < this.neededIngredients.length; i += 1) {
			if (unit.classid === this.neededIngredients[i].classid && this.validItem(unit, this.neededIngredients[i].recipe)) {
				//debugLog("Cubing: " + unit.name + " " + this.neededIngredients[i].recipe.Index + " " + (this.neededIngredients[i].recipe.hasOwnProperty("MainRecipe") ? this.neededIngredients[i].recipe.MainRecipe : "") + this.getRecipeNeeds(this.neededIngredients[i].recipe.Index));

				return true;
			}
		}

		return false;
	},

	keepItem: function (unit) { // Don't drop an item from inventory if it's a part of cubing recipe
		if (!Config.Cubing) {
			return false;
		}

		var i;

		for (i = 0; i < this.validIngredients.length; i += 1) {
            if (unit.mode === ItemModes.Item_In_Inventory_Stash_Cube_Or_Store && unit.gid === this.validIngredients[i].gid) {
				return true;
			}
		}

		return false;
	},

	validItem: function (unit, recipe) {
        // Don't use items in locked inventory space
        if (unit.mode === ItemModes.Item_In_Inventory_Stash_Cube_Or_Store && unit.location === ItemLocation.Inventory && Storage.Inventory.IsLocked(unit, Config.Inventory)) {
			return false;
		}

		// Excluded items
		if (Runewords.validGids.indexOf(unit.gid) > -1 || CraftingSystem.validGids.indexOf(unit.gid) > -1) {
			return false;
		}

		// Gems and runes
        if ((unit.itemType >= NTItemTypes.amethyst && unit.itemType <= NTItemTypes.skull) || unit.itemType === NTItemTypes.rune) {
			if (!recipe.Enabled && recipe.Ingredients[0] !== unit.classid && recipe.Ingredients[1] !== unit.classid) {
				return false;
			}

			return true;
		}

		if (recipe.Index >= Recipe.HitPower.Helm && recipe.Index <= Recipe.Safety.Weapon) {
			// Junk jewels (NOT matching a pickit entry)
            if (unit.itemType === NTItemTypes.jewel) {
				if (recipe.Enabled && NTIP.CheckItem(unit) === 0) {
					return true;
				}
                // Main item, NOT matching a pickit entry
            } else if (unit.quality === ItemQuality.Magic && Math.floor(me.charlvl / 2) + Math.floor(unit.ilvl / 2) >= recipe.Level && NTIP.CheckItem(unit) === 0) {
				return true;
			}

			return false;
		}

		if (recipe.Index >= Recipe.Unique.Weapon.ToExceptional && recipe.Index <= Recipe.Unique.Armor.ToElite) {
            // Unique item matching pickit entry
            if (unit.quality === ItemQuality.Unique && NTIP.CheckItem(unit) === 1) {
				switch (recipe.Ethereal) {
				case 0:
				case undefined:
					return NTIP.CheckItem(unit) === 1;
                case 1:
                        return unit.getFlag(ItemFlags.isEthereal) && NTIP.CheckItem(unit) === 1;
				case 2:
                        return !unit.getFlag(ItemFlags.isEthereal) && NTIP.CheckItem(unit) === 1;
				}
			}

			return false;
		}

		if (recipe.Index >= Recipe.Rare.Weapon.ToExceptional && recipe.Index <= Recipe.Rare.Armor.ToElite) {
            // Rare item matching pickit entry
            if (unit.quality === ItemQuality.Rare && NTIP.CheckItem(unit) === 1) {
				switch (recipe.Ethereal) {
				case 0:
				case undefined:
					return NTIP.CheckItem(unit) === 1;
				case 1:
                        return unit.getFlag(ItemFlags.isEthereal) && NTIP.CheckItem(unit) === 1;
				case 2:
                        return !unit.getFlag(ItemFlags.isEthereal) && NTIP.CheckItem(unit) === 1;
				}
			}

			return false;
		}

		if (recipe.Index >= Recipe.Socket.Shield && recipe.Index <= Recipe.Socket.Helm) {
            // Normal item matching pickit entry, no sorcets
            if (unit.quality === ItemQuality.Normal && unit.getStat(Stats.item_numsockets) === 0) {
				switch (recipe.Ethereal) {
				case 0:
				case undefined:
					return NTIP.CheckItem(unit) === 1;
				case 1:
                        return unit.getFlag(ItemFlags.isEthereal) && NTIP.CheckItem(unit) === 1;
				case 2:
                        return !unit.getFlag(ItemFlags.isEthereal) && NTIP.CheckItem(unit) === 1;
				}
			}

			return false;
		}

        if (recipe.Index === Recipe.Reroll.Magic) {
            if (unit.quality === ItemQuality.Magic && unit.ilvl >= recipe.Level && NTIP.CheckItem(unit) === 0) {
				return true;
			}

			return false;
		}

        if (recipe.Index === Recipe.Reroll.Rare) {
            if (unit.quality === ItemQuality.Rare && NTIP.CheckItem(unit) === 0) {
				return true;
			}

			return false;
		}

        if (recipe.Index === Recipe.Reroll.HighRare) {
            if (recipe.Ingredients[0] === unit.classid && unit.quality === ItemQuality.Rare && NTIP.CheckItem(unit) === 0) {
				recipe.Enabled = true;

				return true;
			}

            if (recipe.Enabled && recipe.Ingredients[2] === unit.classid && unit.itemType === NTItemTypes.ring && unit.getStat(Stats.item_maxmana_percent) && !Storage.Inventory.IsLocked(unit, Config.Inventory)) {
				return true;
			}

			return false;
		}

        if (recipe.Index === Recipe.LowToNorm.Armor || recipe.Index === Recipe.LowToNorm.Weapon) {
            if (unit.quality === ItemQuality.Low_Quality && NTIP.CheckItem(unit) === 0) {
				return true;
			}

			return false;
		}

		if (recipe.Index === Recipe.Token) {
			return true;
		}

		return false;
	},

	doCubing: function () {
		if (!Config.Cubing) {
			return false;
		}

        if (!me.getItem(ItemClassIds.Horadric_Cube) && !this.getCube()) {
			return false;
		}

		var i, j, items, string, result, tempArray;

		// Randomize the recipe array to prevent recipe blocking (multiple caster items etc.)
		tempArray = this.recipes.slice().shuffle();

		for (i = 0; i < tempArray.length; i += 1) {
			string = "Transmuting: ";
			items = this.checkRecipe(tempArray[i]);

			if (items) {
                // If cube isn't open, attempt to open stash (the function returns true if stash is already open)
                if ((!getUIFlag(UIFlags.Cube_is_open) && !Town.openStash()) || !this.emptyCube()) {
					return false;
				}

				this.cursorCheck();

				i = -1;

				while (items.length) {
					string += (items[0].name.trim() + (items.length > 1 ? " + " : ""));
					Storage.Cube.MoveTo(items[0]);
					items.shift();
				}

				if (!this.openCube()) {
					return false;
				}

				transmute();
				delay(700 + me.ping);
				print("ÿc4Cubing: " + string);
				D2Bot.printToConsole(string, 5);
				this.update();

                items = me.findItems(-1, -1, ItemLocation.Cube);

				if (items) {
					for (j = 0; j < items.length; j += 1) {
						result = Pickit.checkItem(items[j]);

						switch (result.result) {
						case 0:
							Misc.itemLogger("Dropped", items[j], "doCubing");
							items[j].drop();

							break;
						case 1:
							Misc.itemLogger("Cubing Kept", items[j]);
							Misc.logItem("Cubing Kept", items[j], result.line);

							break;
						case 5: // Crafting System
							CraftingSystem.update(items[j]);

							break;
						}
					}
				}

				if (!this.emptyCube()) {
					break;
				}
			}
		}

        if (getUIFlag(UIFlags.Cube_is_open) || getUIFlag(UIFlags.Stash_is_open)) {
			delay(1000);

            while (getUIFlag(UIFlags.Cube_is_open) || getUIFlag(UIFlags.Stash_is_open)) {
				me.cancel();
				delay(300);
			}
		}

		return true;
	},

	cursorCheck: function () {
		var item;

		if (me.itemoncursor) {
            item = getUnit(Cursor_Item.Warp);

			if (item) {
				if (Storage.Inventory.CanFit(item) && Storage.Inventory.MoveTo(item)) {
					return true;
				}

				if (Storage.Stash.CanFit(item) && Storage.Stash.MoveTo(item)) {
					return true;
				}

				Misc.itemLogger("Dropped", item, "cursorCheck");

				if (item.drop()) {
					return true;
				}
			}

			return false;
		}

		return true;
	},

	openCube: function () {
        var i, tick,
            cube = me.getItem(ItemClassIds.Horadric_Cube);

		if (!cube) {
			return false;
		}

        if (getUIFlag(UIFlags.Cube_is_open)) {
			return true;
		}

		for (i = 0; i < 3; i += 1) {
			cube.interact();

			tick = getTickCount();

			while (getTickCount() - tick < 1000) {
                if (getUIFlag(UIFlags.Cube_is_open)) {
					delay(500);

					return true;
				}

				delay(10);
			}
		}

		return false;
	},

    emptyCube: function () {
        var cube = me.getItem(ItemClassIds.Horadric_Cube),
            items = me.findItems(-1, -1, ItemLocation.Cube);

		if (!cube) {
			return false;
		}

		if (!items) {
			return true;
		}

		while (items.length) {
			if (Storage.Inventory.CanFit(items[0])) {
				Storage.Inventory.MoveTo(items[0]);
			} else if (Storage.Stash.CanFit(items[0])) {
				Storage.Stash.MoveTo(items[0]);
			} else {
				return false;
			}

			items.shift();
		}

		return true;
	}
};