/**
 *    @filename    TeamBaal.js
 *    @author      Jaenster
 *    @desc        Make a true party of a baalrun.
 */

/*

    Why TeamBaal and not baal / baalassistant ?
    - The script is self aware of other bots in the same game (that run from the same pc). No config needed!
    - Multiple chars can teleport to throne, no more leader bullshit
    - Chars that don't do baal, go to town and leave party. So a baalparty is created
    - Script detects automatically what build you are, and maximizes the attacks with the waves
    - It does everything to prevent hydras being cast. Saves 8 seconds a run!
    - Use the full power of a javazon, javazons speedup the game dramatically compared to baal/baalassistant. By me, 30 seconds avg a run
    - No going to town anymore during a wave to make room for an item. Only after a wave
    - It clears the throne allot faster. And no more unnecessary monster killing in begin of throne.
    - No more teling around the throne, only kill the monsters that are needed to be killed for a wave to spawn
    - New portal location that makes the run faster
    - It predicts perfectly when a wave come. So, no more useless mana/javelin/arrows wasted
    - All chars kill intruding monsters, not only a part of your Team.
    - Auto detects if a char is weak, if so it waits for a safetp
    - Silence. The bot doesn't say anything
    - A late joining char doesn't teleport to throne if someone is already on their way
    - Good support for the non enigma chars

    Future?
    - XpShrine getting and sharing
    - Baal party quitters when baal is almost dead
    - Adding support for a teamed nihlathak run
    - Make a TeamDiablo so the highest levels can run a teamed fast diarun in the time of a baalrun, and join later the baalrun
    - Ideas? Let me know.
 */
function TeamBaal() {
    var baal = {
        run: function () {
            Team.init();
            Team.msg.requestData('baal');
            baal.util.init();

            // Get to throne
            if (Config.TeamBaal.Teleport && !Team.communication.baal.portalReady) {
                baal.common.teleport();
            }

            // Do the waves
            if (Config.TeamBaal.Waves && !Team.communication.baal.wavesDone) {
                baal.common.waves();
            }

            // Do baal
            if (Config.TeamBaal.KillBaal && !Team.communication.baal.bossDone) {
                baal.common.baal();
            }

            if (!Team.communication.baal.bossDone) {
                // Idle here until boss is done
                baal.common.waitForOthers();
            }

            return true;
        },
        common: {
            teleport: function () {
                baal.util.print('Teleporting to throne');
                Town.doChores();


                Pather.useWaypoint(Areas.WorldstoneLvl2, true);
                Precast.doPrecast(true);

                // Doing chores & precast can take some time. So much time in fact, maybe another char already is at throne or almost
                if (Team.communication.baal.portalReady || Team.communication.baal.AtWorldstoneLvl3) {
                    return Pather.useWaypoint(Areas.PandemoniumFortress); // Returning true, since we succeed as a team to get to throne
                }

                // Move to lvl 3
                if (!Pather.moveToExit(Areas.WorldstoneLvl3, true)) {
                    baal.util.print("Failed to move to throne.");
                    return false;
                }
                //ToDo: build in a check if other char is already in Throne, if so teleport

                // Let others know this char is at worldstone 3. So starting to teleport to throne is useless now
                Team.communication.baal.AtWorldstoneLvl3 = true;
                Team.msg.sendData('baal');

                // Move to throne
                if (!Pather.moveToExit(Areas.ThroneOfDestruction, true)) {
                    baal.util.print("Failed to move to throne.");
                    return false;
                }
                Pather.moveTo(Team.data.baalPortalSpot[0], Team.data.baalPortalSpot[1]);

                // Cast tp in ase there is no portal up yet
                if (!Pather.getPortal(Areas.Harrogath)) {
                    Pather.makePortal();
                    if (Config.TeamBaal.AnnounceChannel) {
                        say(Config.TeamBaal.AnnounceChannel);
                    }
                    Team.communication.baal.portalReady = true;
                    Team.msg.sendData('baal');
                }
                return true;
            },
            waves: function () {

                // Go to throne, if we are not already in the throne
                if (me.area !== Areas.ThroneOfDestruction) {

                    // In case we abandoned teleporting to throne, we dont need to bo again
                    if (!Config.TeamBaal.Teleport) {
                        Team.util.goBo();
                    }

                    baal.util.print('Go to throne');
                    Team.util.toAct5();

                    Town.doChores();
                    Town.moveToSpot('portal'); // wait at tp

                    if (!Team.util.takePortal(Areas.ThroneOfDestruction)) {
                        return false; // failed to get to throne
                    }
                };

                // Make sure the portal is safe. This can avoid quite deadly behaviour from throne
                switch(Team.build.me) {

                    case Team.build.Conviction:
                    case Team.build.Smiter:
                    case Team.build.Hammerdin:
                        // Setup the best aura we can find for the leechers for a second
                        break;

                    case Team.build.JavaZon:
                        // Spam a few javelins
                        //Team.buildSpecific.Amazon.fury(); // Spam some fury's right away first
                        break;

                    case Team.build.Blizzy:
                        Skill.cast(Skills.Blizzard,me.x,me.y); // Make a blizzard over our heads for us
                        break;

                    case Team.build.Trapsin:
                        // Lay traps at baal's throne
                        for (i = 0; i < 4; i += 1) {
                            if (i === 2) {
                                Skill.cast(Skills.DeathSentry, 0,15091, 5018);
                            } else {
                                Skill.cast(Skills.LightningSentry, 0, 15091, 5018);
                            }
                        }
                        break;

                    case Team.build.CurseNecro:
                        // We want to lower curse everyone, But in the begin, its more handy to confuse everyone around us
                        Skill.cast(Skills.Confuse);
                        break;
                }

                // If we don't have a bo yet, wait a second after getting in the portal to get bo.
                if (me.getState(!me.getState(States.BattleOrders))
                    && me.classid !== 4) {
                    delay(500);
                } else {
                    // Barb's should bo here, since they have a good bo.
                    Team.buildSpecific.Barb.Bo();
                }

                // Shouldn't be necessary, since chars with cta go bo and precast, and the rest precast in town.
                Precast.doPrecast(false);

                // Clear the throne if needed
                if (!Team.communication.baal.portalSafe) {
                    baal.util.clearThrone(0); // Clearing throne
                }

                // Let the others know the portal is safe now
                Team.communication.baal.portalSafe = true;
                Team.msg.sendData('baal');

                // From here, we don't want that an trapsin cast mindblast
                Team.buildSpecific.Assasin.removeMindBlast();

                // Do the waves
                while (baal.util.doWaves()) {
                    delay(1);
                }

                // From here, it's save to use mindblast again
                Team.buildSpecific.Assasin.addMindBlast();

                // Let the others know the waves are done
                Team.communication.baal.wavesDone = true;
                Team.msg.sendData('baal');

                baal.util.print('Done with the waves');
                return true;
            },
            baal: function () {
                this.useBaalPortal = function () {
                    Pather.moveTo(15092, 5011);
                    Precast.doPrecast(false); // Not on true, we might have a more powerful barb bo

                    while (getUnit(1, Units.BaalSitting)) {
                        delay(500);
                    }
                    delay(500);

                    var portal = getUnit(2, Units.RedPortalToChamber);
                    if (portal) {
                        return Pather.usePortal(null, null, portal);
                    } else {
                        baal.util.print('\xffc5Error: Portal not found');
                        return false;
                    }
                };
                this.getToChamber = function () {
                    // Are we not in worldstone or throne?
                    if (me.area !== Areas.WorldstoneChamber && me.area !== Areas.ThroneOfDestruction) {

                        Team.util.toAct5();
                        Town.moveToSpot('portal');

                        // There might be a portal up for the chamber
                        if (!Team.util.takePortal(Areas.WorldstoneChamber, 2)) {

                            // Failed to get to chamber, let's see if there is a throne portal up
                            if (!Team.util.takePortal(Areas.ThroneOfDestruction, 2)) {

                                // Its highly unlikely, but maybe now a portal to camber is up (leader could have recasted)
                                Team.util.takePortal(Areas.WorldstoneChamber, 2);
                            }
                        }
                    }

                    // Are we in throne?
                    if (me.area === Areas.ThroneOfDestruction) {
                        return this.useBaalPortal(); // We are in the throne, so lets use the baal portal
                    }

                    return me.area === Areas.WorldstoneChamber;
                };

                if (!this.getToChamber()) {
                    return false;
                }
                // We can assume we are now in the Worldstone Chamber
                if ((me.classid === 1 && me.getSkill(54, 1)) || me.getStat(97, 54)) {
                    // teleport to baal
                    Pather.moveTo(15146, 5892);
                } else {
                    // walk to baal
                    Pather.moveTo(15136, 5943);
                }
                try {
                    Attack.kill(544); // Baal
                } catch (e) {
                    // can happen if we joined the party too fast. Killing baal can go quick ;)
                }
                Pickit.pickItems();
                Team.communication.baal.bossDone = true;
                Team.msg.sendData('baal');
                delay(me.ping * 2);
                return true;
            },
            waitForOthers: function () {
                if (me.area !== 131) {
                    Team.util.takePortal(Areas.Harrogath);
                }
                baal.util.print('Wait until others did baal');
                Team.party.leave();

                // To start in act 4 in next game is faster.
                // Specially if not the entire team is in act 5, there are less desyncing issues
                Town.goToTown(4);

                while (!Team.communication.baal.bossDone) {
                    // ToDo: Should make this more fail proof
                    delay(1000);
                }

                //ToDo: Detect here if this is the last script running, if so, no point of rejoining the party
                //Team.party.join();
            }
        },
        util: {
            init: function () {
                var spot = baal.data.preattackSpot.default;
                switch (Team.build.me) {
                    case Team.build.EleDruid:
                    case Team.build.Hammerdin:
                    case Team.build.Warcry:
                        spot = baal.data.preattackSpot.center;
                        break;

                    case Team.build.Conviction:
                    case Team.build.JavaZon:
                        spot = baal.data.preattackSpot.byBaal;
                        break;

                    case Team.build.LightSorc:
                        spot = baal.data.preattackSpot.left;
                        break;
                }

                // The spot where we will be standing @ throne
                baal.data.preattackSpot.mine = spot;
            },
            print: function (what) {
                print('\xffc4Baal\xffc0: ' + what);
            },
            doWaves: function () {
                var wave;
                if (!getUnit(1, Units.BaalSitting) && this.moveToPreattack() && !getUnit(1, Units.BaalSitting)) {
                    // This sadly have sometimes some false positives. So move to preattack place and check again
                    baal.util.print('Baal\'s gone');
                    return false;
                }
                // Check the throne
                wave = this.checkThrone();
                if (!wave) {

                    // Get to preattack spot
                    this.moveToPreattack();

                    // pre attack
                    this.beforeWaveCasting(baal.data.currentWave + 1, 12000 - (getTickCount() - Team.data.baaltick));

                    return true;
                }

                // We are in wave:
                baal.data.currentWave = wave;

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
                            // Incase we have the fire res aura, lets put it
                            if (me.getSkill(Skills.ResistFire, 1)) {
                                Skill.setSkill(Skills.ResistFire);
                                break;
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
                switch (Team.build.me) {

                    case Team.build.FireBall:
                        if ((counter > 27e2 || counter < -1e3)) {
                            return false;
                        }

                        if (counter > 2000) {

                            return Skill.cast(Skills.Meteor, 0, 15094 + rand(-1, 1), 5028 + rand(-1, 1));
                        }
                        return Skill.cast(Skills.FireBall, 0, 15094 + rand(-1, 1), 5028 + rand(-1, 1));


                    case Team.build.Blizzy:
                        if ((counter > 45e2 || counter < -1e3)) {
                            return false;
                        }
                        return Skill.cast(Skills.Blizzard, 0, 15094 + rand(-1, 1), 5028 + rand(-1, 1));

                    case Team.build.CurseNecro:
                        if ((counter > 15e2 || counter < -1e3)) {
                            return false;
                        }
                        return Skill.cast(Skills.LowerResist, 0, 15094, 5028);

                    case Team.build.Conviction:
                        Skill.setSkill(Skills.Conviction, 0);
                        break;
                    case Team.build.Hammerdin: // Paladin
                        if ((counter > 45e2 || counter < -1e3)) {
                            return false;
                        }
                        Skill.setSkill(Skills.Concentration, 0);
                        return Skill.cast(Skills.BlessedHammer, 1);

                    case Team.build.JavaZon:
                        if ((counter > 15e2 || counter < -1e3)) {
                            return false;
                        }
                        return Skill.cast(Skills.LightningFury, 0, 15091, 5031);

                    case Team.build.Warcry:
                        if (counter > 2e3 || counter < -1e3) {
                            return false;
                        }
                        Skill.cast(Skills.WarCry, 0); // cast war cry
                        Pather.walkTo(15087, 5024);
                        Skill.cast(Skills.WarCry, 0); // cast war cry
                        Pather.walkTo(15094, 5024);
                        return Skill.cast(Skills.WarCry, 0); // cast war cry


                    case Team.build.EleDruid: // Druid
                        switch (wave) {
                            case 3:
                                // Twister gives a stun, and that prevents hydra's
                                return Skill.cast(Skills.Twister, 0, baal.data.preattackSpot.byBaal[0], baal.data.preattackSpot.byBaal[1]);
                            default:
                                return Skill.cast(Skills.Tornado, 0, baal.data.preattackSpot.byBaal[0], baal.data.preattackSpot.byBaal[1]);
                        }

                    case Team.build.Trapsin: // Assassin
                        // Don't do this 1 second before the wave come, so we can cast cloak of shadow directly
                        if (counter > 4e3 || counter < 1e3) {
                            return false;
                        }
                        return Skill.cast(Skills.ShockField);

                    case Team.build.LightSorc:
                        if (counter > 2e3 || counter < -1e3) {
                            return false;
                        }
                        return Skill.cast(Skills.ChainLightning, 0, baal.data.preattackSpot.byBaal[0], baal.data.preattackSpot.byBaal[1]); // cast chainlighting for max dmg
                }
                return true;
            },

            // Do certain stuff like replacing the traps after a wave
            afterWaveChecks: function (wave) {
                // Don't do this after wave 5
                if (wave === 5) {
                    return true;
                }
                Precast.doPrecast(false); // Make sure everything is still here

                // Check if we need to go to town to heal incase we are psn'ed and have low psn res
                if (me.getState(2) && (me.getStat(Stats.Me.Poisonresist) - 100) < 50) {
                    if (!Pather.usePortal(Areas.Harrogath, null)) {
                        Pather.makePortal(true);
                    }
                    Town.initNPC("Heal", "heal"); // Talk to Malah

                    if (Config.PacketShopping) { // Only with packet shopping. Otherwise its too fast
                        Town.buyPotions(); // Since we are talking with Malah, we might as well buy some pots.
                        Town.fillTome(518); // Since we are already in trade with Malah, we can also refill the tp tome
                    }

                    me.cancel();
                    Town.moveToSpot('portal');

                    // Go back
                    if (!Pather.usePortal(Areas.ThroneOfDestruction, null)) {
                        throw new Error('Portal to throne disappeared, wtf?'); // Portal is gone? wtf.
                    }

                    // Did we take our own portal, if so recast it
                    if (!Pather.getPortal(Areas.Harrogath, null)) {
                        Pather.makePortal();
                    }
                }


                var i;
                switch (Team.build.me) {
                    case Team.build.Trapsin:
                        // Place traps again
                        for (i = 0; i < 4; i += 1) {
                            if (i === 2) {
                                // Place a death sentry in the middle
                                Skill.cast(Skills.DeathSentry, 0, 15090 + (i * 2), 5035);
                            } else {
                                Skill.cast(Skills.LightningSentry, 0, 15090 + (i * 2), 5035);
                            }
                        }
                        return true;
                    case Team.build.Warcry:
                        // Give everyone a bo, to avoid stupid people with cta
                        return Precast.doPrecast(true);
                }
                return false;
            },

            // Go to preattack position
            moveToPreattack: function () {
                if (this.checkThrone()) {
                    return;
                }
                if (getDistance(me, baal.data.preattackSpot.mine[0], baal.data.preattackSpot.mine[1]) < 5) {
                    return true; // Already pretty close, no need to move
                }
                return Pather.moveTo(baal.data.preattackSpot.mine[0], baal.data.preattackSpot.mine[1]);
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
                                case Monsters.WarpedFallen:
                                case Monsters.WarpedShaman:
                                    baal.util.print('Detected wave 1');
                                    return 1;
                                case Monsters.Mummy:
                                case Monsters.BaalColdMage:
                                    baal.util.print('Detected wave 2');
                                    return 2;
                                case Monsters.Council4:
                                    baal.util.print('Detected wave 3');
                                    return 3;
                                case Monsters.VenomLord2:
                                    baal.util.print('Detected wave 4');
                                    return 4;
                                case Monsters.ListerTheTormenter:
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
            clearThrone: function (wave) {
                // Temp
                var i, target, result,
                    gidAttack = [],
                    attackCount = 0,
                    monsterList = Team.util.getMonsterList();

                if (Config.AttackSkill[1] < 0 || Config.AttackSkill[3] < 0) {
                    Pickit.pickItems(); // We might not able to attack, but we can pick a pot
                    return false;
                }

                if (wave === undefined) {
                    wave = 0;
                }

                monsterList.sort(function(unitA,unitB) {
                    return getDistance(me, unitA) - getDistance(me, unitB);
                });

                Team.buildSpecific.preattack(wave);

                while (monsterList.length > 0 && attackCount < 300) {

                    // Did i die? If so revive and pickup corpse
                    if (me.dead) {
                        var corpse_x = me.x, corpse_y = me.y;
                        me.revive();
                        Pather.usePortal(Areas.ThroneOfDestruction,null)
                        Pather.moveTo(corpse_x,corpse_y);
                        if (!Town.getCorpse()) {
                            quit(); // failed to pick up corpse, probably cuz we died again. Fuck this, bye
                        }
                    }

                    // resort
                    monsterList.sort(function(unitA,unitB) {
                        return getDistance(me, unitA) - getDistance(me, unitB);
                    });
                    target = copyUnit(monsterList[0]);

                    if (target.x !== undefined && Attack.checkMonster(target)) {


                        // Dodge or get in position
                        if (Config.Dodge && me.hp * 100 / me.hpmax <= Config.DodgeHP) {
                            Attack.deploy(target, Config.DodgeRange, 5, 9);
                        } else {
                            Attack.getIntoPosition(target, Skill.getRange(Config.AttackSkill[(target.spectype & 0x7) ? 1 : 3]), 0x4)
                        }

                        if (wave === 0) {
                            // Only during clearing the throne, not during a wave.
                            Misc.townCheck(true);
                            Pickit.pickItems();
                        }

                        me.overhead("attacking " + target.name + " spectype " + target.spectype + " id " + target.classid);

                        // Some class specifics
                        Team.buildSpecific.midattack(wave, target, attackCount);

                        // Using here a lower modulo so we do more often a timed attack @ waves
                        switch (Team.build.me) {
                            case Team.build.Conviction: // Doesn't need to attack, just convict like crazy
                                Skill.setSkill(Skills.Conviction, 0);
                                break;
                            default:
                                result = ClassAttack.doAttack(target, attackCount % 7 === 0);
                        }


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

                            // Flash with melee skills
                            if (gidAttack[i].attacks > 0 && gidAttack[i].attacks % ((target.spectype & 0x7) ? 15 : 5) === 0 && Skill.getRange(Config.AttackSkill[(target.spectype & 0x7) ? 1 : 3]) < 4) {
                                Pather.moveTo(me.x + rand(-1, 1) * 5, me.y + rand(-1, 1) * 5);
                            }

                        } else {
                            monsterList.shift();
                            Pickit.pickItems();
                        }
                    } else {
                        monsterList.shift();
                        Pickit.pickItems();
                    }

                    // It happens from time to time, the one that teleported chickend and there is no tp to throne anymore,
                    // only if we still can find baal's sitting in the throne
                    if (!Pather.getPortal(Areas.Harrogath, null) && getUnit(1, Units.BaalSitting))  {
                        Pather.makePortal(); // Make portal to Harrogath
                    }
                }

                ClassAttack.afterAttack();

                // We don't check if we did any attack, since waves can go quick and die before we did any attack
                // Or, now a potion can be dropped and used that was already laying on the floor
                Pickit.pickItems();

                // ToDo: Build in some check for bad psn res chars, they should go to town and heal

                // Prepare for next wave
                this.moveToPreattack();
                this.afterWaveChecks();

                // Some specific things after a wave?
                if (wave === 3) {
                    this.checkHydra();
                }

                return true;
            },
        },
        data: {
            currentWave: 0,
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
        }
    };
    return baal.run();
}

