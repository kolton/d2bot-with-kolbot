/**
 *    @filename    TeamBaal.js
 *    @author      Jaenster
 *    @desc        Throws a teamed baal run
 */

function TeamBaal() {
    var baal = {
        run: function () {
            baal.util.init();

            // Get to throne
            if (Config.TeamBaal.Teleport && !baal.data.communication.portalReady) {
                baal.common.teleport();
            }

            // Do the waves
            if (Config.TeamBaal.Waves && !baal.data.communication.wavesDone) {
                baal.common.waves();
            }

            // Do baal
            if (Config.TeamBaal.KillBaal && !baal.data.communication.bossDone) {
                baal.common.baal();
            }

            if (!baal.data.communication.bossDone) {
                // Idle here until boss is done
                baal.common.waitForOthers();
            }
            return true;
        },
        common: {
            teleport: function () {
                baal.util.print('Teleporting to throne');
                Town.doChores();

                // Doing chores can take some time. So much time in fact, maybe another char already is at throne or almost
                if (baal.data.communication.portalReady || baal.data.communication.AtWorldstoneLvl3) {
                    return true; // Returning true, since we succeed as a team to get to throne
                }

                Pather.useWaypoint(Pather.area.WorldstoneLvl2, true);
                Precast.doPrecast(true);

                // Move to lvl 3
                if (!Pather.moveToExit(Pather.area.WorldstoneLvl3, true)) {
                    baal.util.print("Failed to move to throne.");
                    return false;
                }
                //ToDo: build in a check if other char is already in Throne, if so teleport

                // Let others know this char is at worldstone 3. So starting to teleport to throne is useless now
                baal.data.communication.AtWorldstoneLvl3 = true;
                baal.util.msg.sendData();

                // Move to throne
                if (!Pather.moveToExit(Pather.area.ThroneOfDestruction, true)) {
                    baal.util.print("Failed to move to throne.");
                    return false;
                }
                Pather.moveTo(baal.data.throne.BaalPortalSpot[0], baal.data.throne.BaalPortalSpot[1]);

                // Cast tp in ase there is no portal up yet
                if (!Pather.getPortal(Pather.area.Harrogath)) {
                    Pather.makePortal();
                    baal.data.communication.portalReady = true;
                    baal.util.msg.sendData();
                }
                return true;
            },
            waves: function () {
                // Go to throne
                if (me.area !== Pather.area.ThroneOfDestruction) {
                    baal.util.goBo();
                    baal.util.print('Go to throne');
                    baal.util.toAct5();

                    Town.doChores();

                    /*
                    while (!baal.data.communication.portalSafe || (baal.communication.portalReady && !baal.data.char.isWeak)) {
                        delay(20);
                    }*/

                    if (!baal.util.takePortal(Pather.area.ThroneOfDestruction)) {
                        return false; // failed to get to throne
                    }
                }

                // Listen for the packet that baal generates when he does his typical laugh
                addEventListener('gamepacket', baal.util.events.gamePacket);

                // Barb's should bo here, since they have a good bo.
                baal.util.buildSpecific.Barb.Bo();

                // Shouldn't be necessary, since chars with cta go bo and precast, and the rest precast in town.
                Precast.doPrecast(false);

                // Clear the throne if needed
                if (!baal.data.communication.portalSafe)
                {
                    baal.util.waves.clearThrone(0); // Clearing throne
                }

                // Now it's safe. Let the others know too
                baal.data.communication.portalSafe = true;
                baal.util.msg.sendData();

                // From here, we don't want that an trapsin cast mindblast
                baal.util.buildSpecific.Assasin.removeMindBlast();

                // Do the waves
                while (baal.util.waves.doWaves()) {
                    delay(1);
                }

                // From here, it's save to use mindblast again
                baal.util.buildSpecific.Assasin.addMindBlast();

                // Done with the waves. Let the others know too.
                baal.data.communication.wavesDone = true;
                baal.util.msg.sendData();

                baal.util.print('Done with the waves');
                return true;
            },
            baal: function () {
                this.useBaalPortal = function () {
                    Pather.moveTo(15092, 5011);
                    Precast.doPrecast(false); // Not on true, we might have a more powerfull barb bo

                    while (getUnit(1, 543)) {
                        delay(500);
                    }
                    delay(500);

                    var portal = getUnit(2, 563);
                    if (portal) {
                        return Pather.usePortal(null, null, portal);
                    } else {
                        baal.util.print('\xffc5Error: Portal not found');
                        return false;
                    }
                };
                this.getToChamber = function () {
                    // Are we not in worldstone or throne?
                    if (me.area !== Pather.area.WorldstoneChamber && me.area !== Pather.area.ThroneOfDestruction) {

                        baal.util.toAct5();
                        Town.moveToSpot('portal');

                        // There might be a portal up for the chamber
                        if (!baal.util.takePortal(Area.WorldstoneChamber, 5)) {

                            // Failed to get to chamber, let's see if there is a throne portal up
                            if (!baal.util.takePortal(Area.ThroneOfDestruction, 2)) {

                                // Its highly unlikely, but maybe now a portal to camber is up (leader could have recasted)
                                baal.util.takePortal(Area.WorldstoneChamber, 2);
                            }
                        }
                    }

                    // Are we in throne?
                    if (me.area === Pather.area.ThroneOfDestruction) {
                        return this.useBaalPortal(); // We are in the throne, so lets use the baal portal
                    }
                    return me.area === Pather.area.WorldstoneChamber;
                };

                if (!this.getToChamber()) {
                    return false;
                }
                // We can assume we are now in the Worldstone Chamber
                Pather.moveTo(15136, 5943); //ToDo: Make a check here for teleport. Walking need different coordinates
                try {
                    Attack.kill(544); // Baal
                } catch (e) {
                    // can happen if we joined the party too fast. Killing baal can go quick ;)
                }
                Pickit.pickItems();
                baal.data.communication.bossDone = true;
                baal.util.msg.sendData();
            },
            waitForOthers: function () {
                if (me.area !== 131) {
                    baal.util.takePortal(baal.common.area.Harrogath);
                }
                baal.util.print('Wait until others did baal');
                baal.party.leave();

                // To start in act 4 in next game is faster.
                // Specially if not the entire team is in act 5, there are less desyncing issues
                Town.goToTown(4);

                while (!baal.data.communication.bossDone) {
                    // ToDo: Should make this more fail proof
                    delay(1000);
                }

                //ToDo: Detect here if this is the last script running, if so, no point of rejoining the party
                //baal.party.join();
            }
        },
        util: {
            print: function (what) {
                print('\xffc4Baal\xffc0: ' + what);
            },
            haveCTA: function () {
                var item = me.getItem(-1, 1);
                do {
                    if (item.getPrefix(20519)) { // 20519 = CTA
                        return true;
                    }
                } while (item.getNext());
                return false
            },
            goBo: function () {
                // Why a barb doesn't bo here. He does it straight away when everyone gets in the portal so everyone have a good bo
                if (!this.haveCTA() || me.classid === 4) {
                    return true;
                }

                this.print('Go bo in a random location');
                Town.heal(); // This can be called before a do chores, so lets be sure we have enough health in before we go to a random location
                me.cancel();
                Pather.useWaypoint('random');
                Precast.doPrecast(true);
                return Pather.useWaypoint(Pather.area.PandemoniumFortress);
            },
            takePortal: function (area, waittime) {
                var portal,
                    tick = getTickCount(),
                    failed = false;

                if (waittime === undefined) {
                    waittime = 30;
                }

                this.print('Taking portal to area' + area);

                // With the new portal delays of blizzard, this might be tricky
                while (getTickCount() - tick < waittime * 1000) {

                    // Get a portal to the specific area
                    portal = Pather.getPortal(area, null);
                    if (portal && Misc.inMyParty(portal.getParent())) {

                        if (Pather.usePortal(null, null, portal)) {
                            return true;
                        }
                        failed = true;
                    } else {
                        delay(me.ping); // No portal yet, lets wait
                    }

                    if (failed) { // We tried to enter but failed.

                        // Walk around a bit. It resets the denial of using a portal
                        Pather.walkTo(me.x + rnd(-2, 2), me.y + rnd(-2, 2));

                        // Wait around a bit so blizzard realises we moved
                        delay(rnd(me.ping * 2, me.ping * 3));
                        failed = false; // Dont keep walking around, reset var
                    }
                }
                return false; // Failed to take any portal
            },
            toAct5: function () {
                if (me.area >= Pather.area.Harrogath) {
                    return Town.goToTown(5); // if we cast a portal we are in act 5.
                }
                Town.goToTown(4); // Go to act 4.

                // Separated move to to avoid de-syncing with pillars
                Pather.moveTo(5034, 5022); // Trough the pillars
                Pather.moveTo(5022, 5019); // move close to Tyreal

                delay(me.ping * 2);

                // Can we use any red portal?
                if (getUnit(2, 566)) {

                    // We found a red portal to act4. Highly unlikely but it could be
                    Pather.useUnit(2, 566, 109);

                } else {
                    var npc = getUnit(1, "tyrael");
                    if (!npc || !npc.openMenu()) {
                        return Town.goToTown(5); // Looks like we failed, lets go to act 5 by wp
                    }
                    Misc.useMenu(0x58D2); // Travel to Harrogath
                }

                // Just to be sure. Sometimes stuff goes wrong, de-syncing / lag / whatever
                return me.area !== Pather.area.Harrogath ? Town.goToTown(5) : true;
            },
            events: {
                gamePacket: function (bytes) {
                    // Quickly return if it isn't the desired packet.
                    // This will avoid the "too much recursion" issues @ javascript
                    if (bytes[0] !== 0xA4) {
                        return false;
                    }

                    // 0xA4 -- Throne is ready.  Listed as a undefined packet by the general info about the packets but that is what it means.
                    // Its what triggers the typical "baal laugh" after you finished a wave, or cleared the throne.
                    baal.util.print('Throne ready for wave. Will spawn in 12 seconds');
                    baal.data.throne.wavetick = getTickCount();
                    return false; // False to not block the packet
                },

                gameEvent: function (mode, param1, param2, name1, name2) {
                    switch (mode) {
                        case 0x00: // "%Name1(%Name2) dropped due to time out."
                        case 0x02: // "%Name1(%Name2) joined our world. Diablo's minions grow stronger."
                        case 0x01: // "%Name1(%Name2) dropped due to errors."
                        case 0x03: // "%Name1(%Name2) left our world. Diablo's minions weaken."

                            // Someone left or joined. We might need to update our other's list
                            baal.data.others.needUpdate = true;
                            break;
                    }
                },

                receivingData: function (mode, msg) {
                    var json;
                    var propertyCheck = function(json) {
                        // Check if a json we received contains all the same variables in this version of communication
                        for (var i in baal.data.communication) {
                            if (!json.hasOwnProperty(i)) {
                                return false;
                            }
                        }
                        return true;
                    };
                    baal.util.print('Got msg: '+mode+' - '+msg);
                    switch (mode) {
                        case 107: // Requesting our data;
                            try {
                                 json =  JSON.parse(msg);
                                if (!json && propertyCheck(json)) {
                                    baal.data.communication = json;
                                    return true;
                                }
                            } catch (e) {
                                // Nothing, shouldn't happen but you never know
                            }
                            break;

                        case 108: // received data
                            try {
                                json =  JSON.parse(msg);
                                if (!json && propertyCheck(json)) {
                                    baal.data.communication = json;
                                    return true;
                                }
                            } catch (e) {
                                // Nothing, shouldn't happen but you never know
                            }
                            baal.util.print('Got a unexpected msg. Running any other profiles doing other things?');
                            break;
                    }
                }
            },
            msg: {
                rawsend: function (mode, action) {
                    this.getOthers();
                    var i;
                    for (i = 0; i < baal.data.others.d2bsProfileName.length; i += 1) {
                        sendCopyData(null, baal.data.others.d2bsProfileName[i], mode, action);
                    }
                },
                getOthers: function () {
                    this.getParty = function () {
                        var i,
                            party = getParty();

                        // I noticed it failes from time to time. So a few retry's here
                        for (i = 0; i < 3 && !party; i += 1) {
                            delay(me.ping * 2);
                            party = getParty();
                        }
                        return party;
                    };

                    if (!baal.data.others.needUpdate) {
                        return false; // Only do this if someone joined/left since the last time we checked
                    }

                    var i, tmpparty, party = this.getParty(), content, json,
                        fileList = dopen("data/").getFiles();

                    // Loop trough all files in data/
                    for (i = 0; i < fileList.length; i += 1) {
                        // Get the content of the profile file we found
                        content = Misc.fileAction('data/' + fileList[i].substring(0, fileList[i].indexOf(".json")) + '.json', 0);

                        if (!content) {
                            continue; // Empty file or failed to retrieve data
                        }

                        // Parse the json
                        json = JSON.parse(content);
                        if (json && json.hasOwnProperty("name")) {

                            // Create a copy of the party, since we alter it
                            tmpparty = copyUnit(party);
                            if (!tmpparty) {
                                continue;
                            }

                            do {
                                // Is the ingame name the same as the ingame name listed in the json file?
                                if (tmpparty.name === json.name) {

                                    // Same name, so a char that is running with us
                                    baal.data.others.d2bsProfileName.push(fileList[i].substring(0, fileList[i].indexOf(".json")));
                                    baal.data.others.inGameName.push(tmpparty.name);
                                }
                            } while (tmpparty.getNext());
                        }
                    }
                    baal.data.others.needUpdate = false; // Updated now, so no need to update
                    return true;
                },
                requestData: function () { // Request what kind of data is already set. For example, is the portal up?
                    //ToDo: Write
                    this.rawsend(107,JSON.stringify({profile: me.profile}))
                },
                sendData: function () { // Send data to others that run from the same pc

                    this.rawsend(108,JSON.stringify(baal.data.communication))
                }

            },
            buildSpecific: {
                preattack: function (wave) {
                    switch (baal.data.char.build.me) {
                        case baal.data.char.build.JavaZon:
                            this.Amazon.fury();
                            break;

                        case baal.data.char.build.LightSorc: // Sorceress
                        case baal.data.char.build.Blizzy: // Sorceress
                            Skill.cast(Skill.byName.StaticField);
                            break;

                        case baal.data.char.build.CurseNecro: // Necro
                            if (wave === 3) {
                                // Dim vision, prevents hydra
                                Skill.cast(Skill.byName.DimVision, 0, 15094, 5028)
                            } else {
                                // Lower resist, helps every sorc/java. Every good fast run have either of those
                                Skill.cast(Skill.byName.LowerResist, 0, 15094, 5028)
                            }
                            break;

                        case baal.data.char.build.Trapsin: // Assassin
                            if ([3, 4, 5].indexOf(wave) !== -1) {
                                // cloak of shadows. Prevents hydra
                                Skill.cast(Skill.byName.CloakOfShadows);
                            }
                            break;
                        case baal.data.char.build.Warcry:
                            // Prevents hydra's
                            if (wave !== 0) {
                                Skill.cast(Skill.byName.WarCry, 0, 15094 + rand(-1, 1), 5028 + rand(-1, 1));
                            }
                    }
                    return true;
                },
                midattack: function (wave, target,count) {
                    switch (baal.data.char.build.me) {
                        case baal.data.char.build.JavaZon:
                            if (count % 4) {
                                this.Amazon.fury(target); // need to spam fury?
                            }
                            break;

                        case baal.data.char.build.LightSorc:
                        case baal.data.char.build.Blizzy:
                            Skill.cast(Skill.byName.StaticField);
                            break;

                        case baal.data.char.build.CurseNecro:
                            //ToDo: explode corpses like crazy. Great damage in a baalrun and makes waves go faster
                    }
                },
                Amazon: {
                    repairJavalin: function () {
                        switch (Team.myRoleType) {
                            case Team.RoleType.JavaZon:
                                Util.print('Repairing my javalin', 'Amazon');
                                Town.initNPC("Repair", "repair"); // Force repair
                                me.repair();
                                me.cancel();
                                break;
                        }
                    },
                    fury: function () {
                        var targets = baal.util.waves.getMonsterList();
                        if (targets < 5) { // More as 5 monsters, otherwise skip the spam
                            return true;
                        }
                        var i;
                        for (i = 0; i < 2 && targets.length > 5; i += 1) {
                            print('Spamming fury');
                            Skill.cast(Skill.byName.LightningFury, 0, targets[0].x, targets[1].y); // Spam a lightingfury
                        }
                    }
                },
                Barb: {
                    Bo: function () {
                        switch (baal.data.char.build.me) {
                            case baal.data.char.build.Warcry:
                                Precast.doPrecast(true);
                                break;
                            default:
                                delay(250); // We it aint a boing barb, wait a sec here to get the bo
                        }
                    }
                },
                Assasin: {
                    oldAttack: [],
                    removeMindBlast: function () {
                        var i;
                        this.oldAttack = Config.AttackSkill;
                        for (i = 0; i < Config.AttackSkill.length; i += 1) {
                            if (Config.AttackSkill[i] === Skill.byName.MindBlast) {
                                Config.AttackSkill[i] = -1;
                            }
                        }
                    },
                    addMindBlast: function () {
                        Config.AttackSkill = this.oldAttack;
                    }
                },
                init: function () {
                    var getSk = function (number) {
                            return me.getSkill(number, 1);
                        },
                        classes = ["Amazon", "Sorceress", "Necromancer", "Paladin", "Barbarian", "Druid", "Assassin"],
                        skill,
                        detectBuild = function () {
                            switch (classes[me.classid]) {
                                case 'Amazon':
                                    skill = getSk(Skill.byName.ChargedStrike) + getSk(Skill.byName.LightningFury);
                                    if (skill > 38) {
                                        baal.data.char.build.me = baal.data.char.build.JavaZon;
                                    }
                                    break;
                                case 'Sorceress':
                                    var light = getSk(Skill.byName.ChainLightning) + getSk(Skill.byName.Lightning),
                                        blizz = getSk(Skill.byName.Blizzard) + getSk(Skill.byName.IceBlast);

                                    switch (true) {
                                        case light > blizz && light > 38:
                                            baal.data.char.build.me = baal.data.char.build.LightSorc;
                                            break;
                                        case light < blizz && blizz > 38:
                                            baal.data.char.build.me = baal.data.char.build.Blizzy;
                                            break;
                                    }
                                    break;
                                case 'Necromancer':
                                    skill = getSk(Skill.byName.LowerResist);
                                    if (skill > 1) {
                                        baal.data.char.build.me = baal.data.char.build.CurseNecro;
                                    }
                                    break;
                                case 'Paladin':
                                    var hammers = getSk(Skill.byName.Concentration) + getSk(Skill.byName.BlessedHammer),
                                        smiting = getSk(Skill.byName.HolyShield) + getSk(Skill.byName.Fanaticism);
                                    switch (true) {
                                        case hammers > smiting && hammers > 38:
                                            baal.data.char.build.me = baal.data.char.build.Hammerdin;
                                            break;
                                        case hammers < smiting && smiting > 38:
                                            baal.data.char.build.me = baal.data.char.build.Smiter;
                                            break;
                                    }
                                    break;
                                case 'Barbarian':
                                    skill = getSk(Skill.byName.WarCry);
                                    if (skill > 1) {
                                        baal.data.char.build.me = baal.data.char.build.Warcry;
                                    }
                                    break;
                                case 'Druid':
                                    skill = getSk(Skill.byName.Tornado) + getSk(Skill.byName.Twister);
                                    if (skill > 38) {
                                        baal.data.char.build.me = baal.data.char.build.EleDruid;
                                    }
                                    break;
                                case 'Assassin':
                                    skill = getSk(Skill.byName.LightningSentry) + getSk(Skill.byName.DeathSentry);
                                    if (skill > 38) {
                                        baal.data.char.build.me = baal.data.char.build.Trapsin;
                                    }
                                    Config.SummonShadow = "Warrior"; // Master can cast MindBlast, we dont want that @ baalwaves

                                    Config.UseFade = baal.util.resistanceAvg() < 45 && getSk(Presets.skill.Fade) !== 0; // Use fade if our avg res is less as 50 and we have the skill
                                    Config.UseBoS = !Config.UseFade; // Use BoS if we dont use Fade
                                    break;
                            }
                        },
                        setBuildDefaults = function () {
                            var TownSummon = [], spot = baal.data.throne.preattackSpot.default;
                            switch (baal.data.char.build.me) {
                                case baal.data.char.build.Trapsin:
                                    TownSummon = [Skill.byName.ShadowWarrior];
                                    break;

                                case baal.data.char.build.EleDruid:
                                    TownSummon = [Skill.byName.Oak, Skill.byName.Grizzly];
                                // no break here, warning!
                                case baal.data.char.build.Hammerdin:
                                case baal.data.char.build.Warcry:
                                    spot = baal.data.throne.preattackSpot.center;
                                    break;

                                case baal.data.char.build.JavaZon:
                                    TownSummon = [Skill.byName.Valkyrie];
                                    spot = baal.data.throne.preattackSpot.byBaal;
                                    break;

                                case baal.data.char.build.CurseNecro:
                                    TownSummon = [Skill.byName.BoneArmor];
                                    break;


                                case baal.data.char.build.LightSorc:
                                    spot = baal.data.throne.preattackSpot.left;
                                    break;
                            }

                            // The spot where we will be standing @ throne
                            baal.data.throne.preattackSpot.mine = spot;

                            // Only if we don't teleport, or dont have CTA
                            if (!(Config.TeamBaal.teleport || baal.util.haveCTA())) {
                                // Its better to cast stuff in town if we dont have CTA and we wait for tp anyway. Saves time in throne
                                TownCast.forEach(Precast.summon);
                            }
                            baal.util.print('Init done');
                        };
                    detectBuild();
                    setBuildDefaults();
                }
            },
            resistanceAvg: function () {
                var minus = 0; // zero for normal
                switch (me.diff) {
                    case 1:
                        minus = 50; // minus 50 for nightmare
                        break;
                    case 2:
                        minus = 100; // minus 100 for hell
                        break;
                }
                return (me.getStat(45) + me.getStat(43) + me.getStat(41) + me.getStat(39) - (minus * 4)) / 4
            },
            waves: {
                doWaves: function () {
                    var wave;
                    if (!getUnit(1, 543) && this.moveToPreattack() && !getUnit(1, 543)) {
                        // This sadly have sometimes some false positives. So move to preattack place and check again
                        baal.util.print('Baal\'s gone');
                        return false;
                    }
                    // Check the throne
                    wave = this.checkThrone();
                    if (!wave) {
                        this.moveToPreattack();
                        this.beforeWaveCasting(baal.data.throne.currentWave + 1, 12000 - (getTickCount() - baal.data.throne.wavetick));
                        return true;
                    }

                    // We are in wave:
                    baal.data.throne.currentWave = wave;

                    // Clear it
                    this.clearThrone(wave);

                    // On wave 5 we return a false, so we know the waves are done
                    return wave !== 5;
                },

                // Weaker chars need to clear out for hydra's
                checkHydra: function () {
                    var monster = getUnit(1, "hydra");

                    if (monster) {
                        do {
                            if (monster.mode !== 12 && monster.getStat(172) !== 2) {
                                // Weak char?
                                if (baal.data.char.isWeak) {
                                    Pather.moveTo(15118, 5002)
                                }

                                while (monster.mode !== 12) {
                                    delay(500);

                                    if (!copyUnit(monster).x) {
                                        break;
                                    }
                                }

                                break;
                            }
                            delay(50);
                        } while (monster.getNext());
                    } else {
                        baal.util.print('No hydra, making the run 8 seconds faster <3');
                    }

                    return true;
                },

                // Spawn all kinds of stuff while we wait for the wave to come
                beforeWaveCasting: function (wave, counter) {
                    //Baal.print('timer:'+counter);
                    switch (baal.data.char.build.me) {
                        case baal.data.char.build.Blizzy:
                            if ((counter > 45e2 || counter < -1e3)) {
                                return false;
                            }
                            return Skill.cast(Skill.byName.Blizzard, 0, 15094 + rand(-1, 1), 5028 + rand(-1, 1)); // cast blizzard

                        case baal.data.char.build.CurseNecro:
                            if ((counter > 15e2 || counter < -1e3)) {
                                return false;
                            }
                            return Skill.cast(Skill.byName.LowerResist, 0, 15094, 5028);

                        case baal.data.char.build.Hammerdin: // Paladin
                            if ((counter > 45e2 || counter < -1e3)) {
                                return false;
                            }
                            Skill.setSkill(Skill.byName.Concentration, 0);
                            return Skill.cast(Skill.byName.BlessedHammer, 1);

                        case baal.data.char.build.JavaZon:
                            if ((counter > 15e2 || counter < -1e3)) {
                                return false;
                            }
                            return Skill.cast(Skill.byName.LightningFury, 0, 15091, 5031);

                        case baal.data.char.build.Warcry:
                            if (counter > 2e3 || counter < -1e3) {
                                return false;
                            }
                            Pather.moveTo(15087, 5024);
                            Skill.cast(Skill.byName.WarCry, 0); // cast war cry
                            Pather.moveTo(15094, 5024);
                            return Skill.cast(Skill.byName.WarCry, 0); // cast war cry


                        case baal.data.char.build.EleDruid: // Druid
                            switch (wave) {
                                case 3:
                                    // Twister gives a stun, and that prevents hydra's
                                    return Skill.cast(Skill.byName.Twister, 0, baal.data.throne.preattackSpot.byBaal[0], baal.data.throne.preattackSpot.byBaal[1]);
                                default:
                                    return Skill.cast(Skill.byName.Tornado, 0, baal.data.throne.preattackSpot.byBaal[0], baal.data.throne.preattackSpot.byBaal[1]);
                            }

                        case baal.data.char.build.Trapsin: // Assassin
                            // Don't do this 1 second before the wave come, so we can cast cloak of shadow directly
                            if (counter > 4e3 || counter < 1e3) {
                                return false;
                            }
                            return Skill.cast(Skill.byName.ShockField);

                        case baal.data.char.build.LightSorc:
                            if (counter > 2e3 || counter < -1e3) {
                                return false;
                            }
                            return Skill.cast(Skill.byName.ChainLightning, 0, baal.data.throne.preattackSpot.byBaal[0], baal.data.throne.preattackSpot.byBaal[1]); // cast chainlighting for max dmg
                    }
                    return true;
                },

                // Do certain stuff like replacing the traps after a wave
                afterWaveCasting: function (wave) {
                    // Don't do this after wave 5
                    if (wave === 5) {
                        return true;
                    }
                    Precast.doPrecast(false); // Make sure everything is still here

                    var i;
                    switch (baal.data.char.build.me) {
                        case baal.data.char.build.Trapsin:
                            // Place traps again
                            for (i = 0; i < 4; i += 1) {
                                if (i === 2) {
                                    // Place a death sentry in the middle
                                    Skill.cast(Skill.byName.DeathSentry, 0, 15090 + (i * 2), 5035);
                                } else {
                                    Skill.cast(Skill.byName.LightningSentry, 0, 15090 + (i * 2), 5035);
                                }
                            }
                            return true;
                        case baal.data.char.build.Warcry:
                            // Give everyone a bo, to avoid stupid people with cta
                            return Precast.doPrecast(true);
                    }
                    return false;
                },

                // Go to preattack position
                moveToPreattack: function () {
                    if (getDistance(me, baal.data.throne.preattackSpot.mine[0], baal.data.throne.preattackSpot.mine[1]) < 5) {
                        return true; // Already pretty close, no need to move
                    }
                    return Pather.moveTo(baal.data.throne.preattackSpot.mine[0], baal.data.throne.preattackSpot.mine[1]);
                },

                checkThrone: function () {
                    var monster = getUnit(1);
                    if (monster) {
                        do {
                            // Is monster in the throne, or in entrance of throne
                            if (Attack.checkMonster(monster)
                                && ((monster.y > 5002 && monster.y < 5073
                                    && monster.x > 15072 && monster.x < 15118)
                                    || (monster.y > 5073 && monster.y < 5096
                                        && monster.x > 15088 && monster.x < 15103))) {
                                switch (monster.classid) {
                                    case 23:
                                    case 62:
                                        baal.util.print('Detected wave 1');
                                        return 1;
                                    case 105:
                                    case 381:
                                        baal.util.print('Detected wave 2');
                                        return 2;
                                    case 557:
                                        baal.util.print('Detected wave 3');
                                        return 3;
                                    case 558:
                                        baal.util.print('Detected wave 4');
                                        return 4;
                                    case 571:
                                        baal.util.print('Detected wave 5');
                                        return 5;
                                    default:
                                        this.clearThrone(); // Clear the throne
                                }
                            }
                        } while (monster.getNext());
                    }
                    return false;
                },
                getMonsterList: function () {
                    var monsterList = [],
                        target = getUnit(1);

                    if (target) {
                        do {
                            if (Attack.checkMonster(target) && Attack.skipCheck(target)) {
                                // Baal check, Be sure in throne we only clear *in* the chamber of the throne, not outside it
                                if (( target.y > 5002 && target.y < 5073
                                        && target.x > 15072 && target.x < 15118)
                                    || (target.y > 5073 && target.y < 5096
                                        && target.x > 15088 && target.x < 15103)) {
                                    monsterList.push(copyUnit(target));
                                }
                            }
                        } while (target.getNext());
                    }

                    monsterList.sort(Attack.sortMonsters);
                    return monsterList;
                },
                clearThrone: function (wave) {
                    // Temp
                    baal.util.print('clearing');
                    var i, target, result,
                        gidAttack = [],
                        attackCount = 0,
                        monsterList = this.getMonsterList();

                    if (Config.AttackSkill[1] < 0 || Config.AttackSkill[3] < 0) {
                        Pickit.pickItems(); // We might not able to attack, but we can pick a pot
                        return false;
                    }

                    if (wave === undefined) {
                        wave = 0;
                    }


                    baal.util.buildSpecific.preattack(wave);

                    while (monsterList.length > 0 && attackCount < 300) {
                        if (me.dead) {
                            return false;
                            //ToDo: Revive, come back to throne and pick up body
                        }

                        monsterList.sort(Attack.sortMonsters);
                        target = copyUnit(monsterList[0]);

                        if (target.x !== undefined && Attack.checkMonster(target)) {
                            if (Config.Dodge && me.hp * 100 / me.hpmax <= Config.DodgeHP) {
                                Attack.deploy(target, Config.DodgeRange, 5, 9);
                            } else {
                                baal.util.print('Getting into position');
                                Attack.getIntoPosition(target, Skill.getRange(Config.AttackSkill[(target.spectype & 0x7) ? 1 : 3]), 0x4)
                            }

                            if (wave === 0) {
                                // Only during clearing the throne, not during a wave.
                                Misc.townCheck(true);
                                Pickit.pickItems();
                            }

                            me.overhead("attacking " + target.name + " spectype " + target.spectype + " id " + target.classid);

                            // Some class specifics
                            baal.util.buildSpecific.midattack(wave,target,attackCount);

                            // Using here a lower modulo so we do more often a timed attack @ waves
                            result = ClassAttack.doAttack(target, attackCount % 7 === 0);
                            baal.util.print('Clearing');

                            if (result) {
                                for (i = 0; i < gidAttack.length; i += 1) {
                                    if (gidAttack[i].gid === target.gid) {
                                        break;
                                    }
                                }
                                if (i === gidAttack.length) {
                                    gidAttack.push({gid: target.gid, attacks: 0, name: target.name});
                                }

                                gidAttack[i].attacks += 1;
                                attackCount += 1;

                                switch (Config.AttackSkill[(target.spectype & 0x7) ? 1 : 3]) {
                                    case 112:
                                        //print(gidAttack[i].name + " " + gidAttack[i].attacks);

                                        // Tele in random direction with Blessed Hammer
                                        if (gidAttack[i].attacks > 0 && gidAttack[i].attacks % ((target.spectype & 0x7) ? 4 : 2) === 0) {
                                            Pather.moveTo(me.x + rand(-1, 1) * 5, me.y + rand(-1, 1) * 5);
                                        }

                                        break;
                                    default:
                                        // Flash with melee skills
                                        if (gidAttack[i].attacks > 0 && gidAttack[i].attacks % ((target.spectype & 0x7) ? 15 : 5) === 0 && Skill.getRange(Config.AttackSkill[(target.spectype & 0x7) ? 1 : 3]) < 4) {
                                            //Packet.flash(me.gid);
                                            Pather.moveTo(me.x + rand(-1, 1) * 5, me.y + rand(-1, 1) * 5);
                                        }

                                        break;
                                }
                            } else {
                                monsterList.shift();
                            }
                        } else {
                            monsterList.shift();
                        }
                    }

                    ClassAttack.afterAttack();

                    // We don't check if we did any attack, since waves can go quick and die before we did any attack
                    // Or, now a potion can be dropped and used that was already laying on the floor
                    Pickit.pickItems();

                    // ToDo: Build in some check for bad psn res chars, they should go to town and heal

                    // Prepare for next wave
                    this.moveToPreattack();
                    this.afterWaveCasting();

                    // Some specific things after a wave?
                    if (wave === 3) {
                        this.checkHydra();
                    }

                    return true;
                },
            },
            init: function () {
                // Set some basic information about the char
                baal.util.buildSpecific.init();

                // Register a event listener for the other profiles to send data to
                addEventListener('copydata', baal.util.events.receivingData);

                // Register a event listener for game events, "joining/creating stuff"
                addEventListener('gamevent', baal.util.events.gameEvent);


                // Later in the script (baal.common.waves function) we also register a game packet listener.
                // We not here to avoid any problems with "too much recursion"

                // Request data the data we have from the others
                baal.util.msg.requestData();
            }
        },
        party: {
            toggleScript: function (to) {
                var script = getScript("tools/Party.js");
                if (!script || script.running === to) {
                    return false; // Party script not found, or already on/off
                }
                return to ? script.resume() : script.pause();
            },
            leave: function () {
                return this.toggleScript(false) && clickParty(getParty(), 3); // Pause the party script and pause it
            },
            join: function () {
                return this.toggleScript(true);  // Just resume the party script. It will do the rest
            }
        },
        data: {
            throne: {
                currentWave: 0,
                wavetick: 0,
                BaalPortalSpot: [15118, 5002],
                preattackSpot: {
                    mine: [],

                    // Where baal is sitting
                    byBaal: [15091, 5018],

                    // Where the wave spawns
                    center: [15093, 5029],

                    // Just behind the waves, safe distance
                    default: [15094, 5038],

                    // To the left of the wave
                    left: [15078, 5026],

                    // The spot a leecher to idle
                    leecher: [15108, 5043]
                }
            },
            communication: {
                AtWorldstoneLvl3: false,
                portalReady: false,
                portalSafe: false,
                wavesDone: false,
                bossDone: false
            },
            char: {
                isWeak: false,
                build: {
                    me: 0,
                    Trapsin: 1,
                    Warcry: 2,
                    JavaZon: 3,
                    CurseNecro: 4,
                    EleDruid: 5,
                    Blizzy: 6,
                    Hammerdin: 7,
                    LightSorc: 8,
                    Smiter: 9
                }
            },
            others: {
                needUpdate: true,
                d2bsProfileName: [],    // Array with the profile names of others in our games
                inGameName: []          // Array with the char names of the others in our games
            }
        }
    };
    return baal.run();
}