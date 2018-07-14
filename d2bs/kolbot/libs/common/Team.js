/**
 *    @filename    Team.js
 *    @author      Jaenster
 *    @desc        A little lib used by TeamDiablo / TeamBaal
 */

var Team = {
    init: function () {
        // To avoid blockage of the first char
        Pather.moveTo(me.x+rand(-2,2),me.y+rand(-2,2));
        if (Team.data.initialized) {
            return true;
        }

        Team.util.print('Init team');

        // Set some basic information about the char
        Team.buildSpecific.init();

        // Register a event listener for the other profiles to send data to
        addEventListener('copydata', Team.events.receivingData);

        // Register a event listener for game events, "joining/creating stuff"
        addEventListener('gamevent', Team.events.gameEvent);

        // Listen for the packet that baal generates when he does his typical laugh
        addEventListener('gamepacket', Team.events.gamePacket);

        Team.data.initialized = true;

        // Request data the data we have from the others
        return true;
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
    util: {
        print: function (what) {
            print('\xffc4Team\xffc0: ' + what);
        },
        toAct5: function () {
            if (me.area >= Areas.Harrogath) {
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
                Misc.useMenu(NPCMenu.TravelToHarrogath); // Travel to Harrogath
            }

            // Just to be sure. Sometimes stuff goes wrong, de-syncing / lag / whatever
            return me.area !== Areas.Harrogath ? Town.goToTown(5) : true;
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
            return Pather.useWaypoint(Areas.PandemoniumFortress);
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

                    if (!Pather.usePortal(null, null, portal)) {

                        // Walk around a bit. It resets the denial of using a portal
                        Pather.walkTo(me.x + rand(-2, 2), me.y + rand(-2, 2));

                        // Wait around a bit so blizzard realises we moved
                        delay(rand(me.ping * 2, me.ping * 3));
                        continue;
                    }
                    return true;
                }
                delay(me.ping);
            }

            return false; // Failed to take any portal
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
        getMonsterList: function () {
            var monsterList = [],
                target = getUnit(1);

            if (target) {
                do {
                    if (Attack.checkMonster(target) && Attack.skipCheck(target)) {
                        // Baal check, Be sure in throne we only clear *in* the chamber of the throne, not outside it
                        if (me.area !== Areas.ThroneOfDestruction || ((target.y > 5002 && target.y < 5073
                            && target.x > 15072 && target.x < 15118)
                            || (target.y > 5073 && target.y < 5096
                                && target.x > 15088 && target.x < 15103))) {
                            monsterList.push(copyUnit(target));
                        }
                    }
                } while (target.getNext());
            }

            monsterList.sort(Attack.sortMonsters);
            return monsterList;
        },
        doingBaal: function () {
            return Scripts.hasOwnProperty('TeamBaal');
        },
        doingDiablo: function () {
            return Scripts.hasOwnProperty('TeamDiablo');
        },
    },
    msg: {
        needUpdate: true,
        d2bsProfileName: [],    // Array with the profile names of others in our games
        inGameName: [],          // Array with the char names of the others in our games
        rawsend: function (mode, action) {
            this.getOthers();
            var i;

            // Ugly but works for now
            removeEventListener('gamepacket', Team.events.gamePacket);

            print('Sending: ' + action);
            for (i = 0; i < this.d2bsProfileName.length; i += 1) {
                sendCopyData(null, this.d2bsProfileName[i], mode, action);
            }

            // Ugly but works for now
            addEventListener('gamepacket', Team.events.gamePacket);

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
            if (!this.needUpdate) {
                return false; // Only do this if someone joined/left since the last time we checked
            }

            var i, party, content, json,
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
                    party = this.getParty();
                    if (!party) {
                        continue;
                    }

                    do {
                        // Is the ingame name the same as the ingame name listed in the json file?
                        if (party.name === json.name) {

                            // Same name, so a char that is running with us
                            this.d2bsProfileName.push(fileList[i].substring(0, fileList[i].indexOf(".json")));
                            this.inGameName.push(party.name);

                        }
                    } while (party.getNext());
                }
            }
            this.needUpdate = false; // Updated now, so no need to update
            return true;
        },
        requestData: function (to) {
            // Request what kind of data is already set. For example, is the portal up?
            switch (to) {
                case 'baal':
                    this.rawsend(107, JSON.stringify({profile: me.profile}));
                    break;
                case 'diablo':
                    this.rawsend(109, JSON.stringify({profile: me.profile}));
                    break;
            }
        },
        sendData: function (to) {
            // Send data to others that run from the same pc
            // Make sure we have a new object to avoid sendcopy issues
            // Sending copy
            switch (to) {
                case 'baal':
                    this.rawsend(108, JSON.stringify(Team.communication.baal));
                    break;
                case 'diablo':
                    this.rawsend(110, JSON.stringify(Team.communication.diablo));
                    break;
            }

        }

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
            Team.util.print('Throne ready for wave. Will spawn in 12 seconds');
            Team.data.baaltick = getTickCount();
            return false; // False to not block the packet
        },

        gameEvent: function (mode, param1, param2, name1, name2) {
            switch (mode) {
                case 0x00: // "%Name1(%Name2) dropped due to time out."
                case 0x02: // "%Name1(%Name2) joined our world. Diablo's minions grow stronger."
                case 0x01: // "%Name1(%Name2) dropped due to errors."
                case 0x03: // "%Name1(%Name2) left our world. Diablo's minions weaken."
                    // Someone left or joined. We might need to update our other's list
                    this.needUpdate = true;
                    break;
            }
        },

        receivingData: function (mode, msg) {
            var json;
            //print('Recv msg: ' + mode + ' - ' + msg);
            switch (mode) {
                case 107: // Requesting our data for baal
                    try {
                        json = JSON.parse(msg);
                        if (json && json.hasOwnProperty('profile')) {
                            sendCopyData(null, json.profile, 108, JSON.stringify(Team.communication.baal));
                            return true;
                        }
                    } catch (e) {
                        // Nothing, shouldn't happen but you never know
                    }
                    break;
                case 108: // received data for baal
                    json = JSON.parse(msg);
                    if (json) {
                        for (var i in Team.communication.baal) {
                            if (!json.hasOwnProperty(i)) {
                                if (Team.communication.baal.hasOwnProperty(i) && json[i] !== undefined && Team.communication.baal[i] !== json[i]) {
                                    print('updated ' + i + ' to:' + json[i]);
                                    // Note the bitwise OR here, only set a var to true, not to false, unless it already was false
                                    Team.communication.baal[i] = json[i] | Team.communication.baal[i];
                                }
                            }
                        }
                    }
                    break;

                /***
                 *  Yes im aware there is duplication code here, need to fix it neatly. Good enough for now
                 */
                case 109: // Requesting our data for diablo
                    try {
                        json = JSON.parse(msg);
                        if (json && json.hasOwnProperty('profile')) {
                            sendCopyData(null, json.profile, 108, JSON.stringify(Team.communication.diablo));
                            return true;
                        }
                    } catch (e) {
                        // Nothing, shouldn't happen but you never know
                    }
                    break;
                case 110: // received data for baal
                    json = JSON.parse(msg);
                    if (json) {
                        for (var i in Team.communication.diablo) {
                            if (!json.hasOwnProperty(i)) {
                                if (Team.communication.diablo.hasOwnProperty(i) && json[i] !== undefined && Team.communication.diablo[i] !== json[i]) {
                                    print('updated ' + i + ' to:' + json[i]);
                                    // Note the bitwise OR here, only set a var to true, not to false, unless it already was false
                                    Team.communication.diablo[i] = json[i] | Team.communication.diablo[i];
                                }
                            }
                        }
                    }
                    break;
            }
        }
    },
    buildSpecific: {
        preattack: function (wave) {
            switch (Team.build.me) {
                case Team.build.JavaZon:
                    this.Amazon.fury();
                    break;

                case Team.build.LightSorc: // Sorceress
                case Team.build.Blizzy: // Sorceress
                    Skill.cast(Skills.StaticField);
                    break;

                case Team.build.CurseNecro: // Necro
                    if (wave === 3) {
                        // Dim vision, prevents hydra
                        Skill.cast(Skills.DimVision, 0, 15094, 5028)
                    } else {
                        // Lower resist, helps every sorc/java. Every good fast run have either of those
                        Skill.cast(Skills.LowerResist, 0, 15094, 5028)
                    }
                    break;

                case Team.build.Trapsin: // Assassin
                    if ([3, 4, 5].indexOf(wave) !== -1) {
                        // cloak of shadows. Prevents hydra
                        Skill.cast(Skills.CloakofShadows);
                    }
                    break;
                case Team.build.Warcry:
                    // Prevents hydra's
                    if (wave !== 0) {
                        Skill.cast(Skills.WarCry);
                    }
            }
            return true;
        },
        midattack: function (wave, target, count) {
            switch (Team.build.me) {
                case Team.build.JavaZon:
                    if (count % 4) {
                        this.Amazon.fury(target); // need to spam fury?
                    }
                    break;

                case Team.build.LightSorc:
                case Team.build.Blizzy:
                    Skill.cast(Skills.StaticField);
                    break;

                case Team.build.CurseNecro:
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
                var targets = Team.util.getMonsterList();
                if (targets < 5) { // More as 5 monsters, otherwise skip the spam
                    return true;
                }
                var i;
                for (i = 0; i < 2 && targets.length > 5; i += 1) {
                    Skill.cast(Skills.LightningFury, 0, targets[0].x, targets[1].y); // Spam a lightingfury
                }
                return true;
            }
        },
        Barb: {
            Bo: function () {
                switch (Team.build.me) {
                    case Team.build.Warcry:
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
                    if (Config.AttackSkill[i] === Skills.MindBlast) {
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
                            skill = getSk(Skills.ChargedStrike) + getSk(Skills.LightningFury);
                            if (skill > 38) {
                                Team.build.me = Team.build.JavaZon;
                            }
                            break;
                        case 'Sorceress':
                            var light = getSk(Skills.ChainLightning) + getSk(Skills.Lightning),
                                blizz = getSk(Skills.Blizzard) + getSk(Skills.IceBlast),
                                fire = getSk(Skills.FireBall) + getSk(Skills.Meteor);

                            switch (true) {
                                case light > blizz
                                && light > fire
                                && light > 38:
                                    Team.build.me = Team.build.LightSorc;
                                    break;
                                case blizz > light
                                && blizz > fire
                                && blizz > 38:
                                    Team.build.me = Team.build.Blizzy;
                                    break;
                                case fire > blizz
                                && fire > light
                                && fire > 38:
                                    Team.build.me = Team.build.FireBall;
                            }
                            break;
                        case 'Necromancer':
                            skill = getSk(Skills.LowerResist);
                            if (skill > 1) {
                                Team.build.me = Team.build.CurseNecro;
                            }
                            break;
                        case 'Paladin':
                            var hammers = getSk(Skills.Concentration) + getSk(Skills.BlessedHammer),
                                smiting = getSk(Skills.HolyShield) + getSk(Skills.Fanaticism),
                                conviction = getSk(Skills.Vengeance) + getSk(Skills.Conviction);
                            switch (true) {
                                case conviction > hammers
                                && conviction > smiting:
                                    Team.build.me = Team.build.Conviction;
                                    Config.Vigor = false; // Don't use vigor, always have conviction
                                    Config.AttackSkill[1] = Skills.Vengeance; // none
                                    Config.AttackSkill[2] = Skills.Conviction; // none
                                    Config.AttackSkill[3] = Skills.Vengeance; // none
                                    Config.AttackSkill[4] = Skills.Conviction; // none
                                    break;
                                case hammers > smiting
                                && hammers > 38:
                                    Team.build.me = Team.build.Hammerdin;
                                    break;
                                case hammers < smiting
                                && smiting > 38:
                                    Team.build.me = Team.build.Smiter;
                                    break;

                            }
                            break;
                        case 'Barbarian':
                            skill = getSk(Skills.WarCry);
                            if (skill > 1) {
                                Team.build.me = Team.build.Warcry;
                            }
                            break;
                        case 'Druid':
                            skill = getSk(Skills.Tornado) + getSk(Skills.Twister);
                            if (skill > 38) {
                                Team.build.me = Team.build.EleDruid;
                            }
                            break;
                        case 'Assassin':
                            skill = getSk(Skills.LightningSentry) + getSk(Skills.DeathSentry);
                            if (skill > 38) {
                                Team.build.me = Team.build.Trapsin;
                            }
                            Config.SummonShadow = "Warrior"; // Master can cast MindBlast, we dont want that @ baalwaves

                            Config.UseFade = Team.util.resistanceAvg() < 45 && getSk(Skills.Fade) !== 0; // Use fade if our avg res is less as 50 and we have the skill
                            Config.UseBoS = !Config.UseFade; // Use BoS if we dont use Fade
                            break;
                    }
                },
                setBuildDefaults = function () {
                    // Only if we don't teleport, or dont have CTA
                    if (!(Config.TeamDiablo.teleport || Team.util.haveCTA())) {
                        var TownSummon = [], skill;
                        switch (Team.build.me) {
                            case Team.build.Trapsin:
                                TownSummon = [Skills.ShadowWarrior];
                                break;

                            case Team.build.EleDruid:
                                TownSummon = [Skills.OakSage, Skills.SummonGrizzly];
                                break;

                            case Team.build.Smiter:
                            case Team.build.Conviction:
                            case Team.build.Hammerdin:
                                TownSummon = [Skills.HolyShield];
                                break;

                            case Team.build.JavaZon:
                                TownSummon = [Skills.Valkyrie];
                                break;

                            case Team.build.CurseNecro:
                                TownSummon = [Skills.BoneArmor];
                                break;

                            case Team.build.Blizzy:
                            case Team.build.LightSorc:
                            case Team.build.FireBall:
                                if (!me.getSkill(Skills.ShiverArmor, 1)) {
                                    if (!me.getSkill(Skills.ChillingArmor, 1)) {
                                        if (me.getSkill(Skills.FrozenArmor)) {
                                            skill = Skills.FrozenArmor;
                                        }
                                    } else {
                                        skill = Skills.ChillingArmor;
                                    }
                                } else {
                                    skill = Skills.ShiverArmor;
                                }
                                TownSummon = [skill, Skills.EnergyShield]; // Cast the best armor & energy shield in town
                                break;
                        }
                        // Its better to cast stuff in town if we dont have CTA and we wait for tp anyway. Saves time in throne
                        TownSummon.forEach(Precast.summon);
                    }
                    Team.util.print('Init done');
                };
            detectBuild();
            setBuildDefaults();
        }
    },
    communication: {
        diablo: {
            vizDone: false,
            seisDone: false,
            infDone: false,
            atChaos: false,
            portalChaosReady: false,
            portalChaosSafe: false,
            diabloDone: false,
            // If one puts it on fast, we all do it fast. Look up the bitwise check in diablo.events.receivingData (number 108)
            fast: Config.TeamDiablo.fast
        },
        baal: {
            AtWorldstoneLvl3: false,
            portalReady: false,
            portalSafe: false,
            wavesDone: false,
            bossDone: false
        },
    },
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
        Smiter: 9,
        Conviction: 10,
        FireBall: 11,

    },
    data: {
        initialized: false,
        baaltick: 0,
        //baalPortalSpot: [15118, 5002], // classic spot
        baalPortalSpot: [15076, 5031], // improved spot
        others: {}
    }
};