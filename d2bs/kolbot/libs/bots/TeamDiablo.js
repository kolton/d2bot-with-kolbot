/**
 *    @filename    Teamdiablo.js
 *    @author      Jaenster
 *    @desc        Make a true party of a baalrun.
 */

/*
 */
function TeamDiablo() {
    var diablo = {
        run: function () {
            // Init the team, if not already done
            Team.init();
            Team.msg.requestData('diablo');

            // Get to throne
            if (Config.TeamDiablo.Teleport && !Team.communication.diablo.portalReady) {
                diablo.common.teleport();
            } else {
                Team.util.goBo();
                Town.doChores();
                Town.goToTown(4)
            }

            if (!Config.TeamDiablo.Teleport && Team.util.doingBaal() && Config.TeamDiablo.TeleportToThrone) {
                diablo.util.print('Teleporting to throne');
                Pather.useWaypoint(Areas.WorldstoneLvl2);

                if (!Pather.moveToExit([Areas.WorldstoneLvl3, Areas.ThroneOfDestruction], true)) {
                    throw new Error("Failed to move to Throne of Destruction.");
                }

                Pather.moveTo(Team.data.baalPortalSpot[0],Team.data.baalPortalSpot[1]);
                Pather.makePortal(true);

                Team.communication.baal.AtWorldstoneLvl3 = true;
                Team.communication.baal.portalReady = true;
                Team.msg.sendData('baal'); // send update so everyone know the portal is ready
            }

            // Run all seals
            var who;
            for (who in diablo.data.seals) {
                if (Config.TeamDiablo[who.toLowerCase()] && !Team.communication.diablo[who + 'Done'] && !Team.communication.diablo.diabloDone) {
                    this.common.doSeal(who);
                }
            }

            // In the you define teams to do the seals, but a teammember is missing, make sure we did all the seals
            if (Config.TeamDiablo.Viz || Config.TeamDiablo.Seis || Config.TeamDiablo.Inf) {

                // Either one is defined we should do. So make sure we did all. Or help others
                while (!Team.communication.diablo.vizDone || !Team.communication.diablo.seisDone || !Team.communication.diablo.vizDone) {

                    for (who in diablo.data.seals) {
                        if (!Team.communication.diablo[who + 'Done'] && !Team.communication.diablo.diabloDone) {
                            this.common.doSeal(who);
                        }
                    }
                }
            }

            if (Config.TeamDiablo.Diablo && !Team.communication.diablo.diabloDone) {
                this.common.killDia();
            }

            if (!Team.communication.diablo.diabloDone) {
                Town.goToTown(4);

                while (!baal.data.communication.diabloDone) {
                    // ToDo: Should make this more fail proof
                    delay(1000);
                }
            }
        },
        common: {
            teleport: function () {
                diablo.util.print('Teleporting to chaos');
                Town.doChores();


                Pather.useWaypoint(Areas.RiverOfFlame, true);
                Precast.doPrecast(true);

                // Doing chores & precast can take some time. So much time in fact, maybe another char already is at chaos, or almost
                if (Team.communication.diablo.portalReady || Team.communication.diablo.atChaos) {
                    return Pather.useWaypoint(Areas.PandemoniumFortress); // Returning true, since we succeed as a team already to go to choas
                }

                // Move to Chaos
                if (!Pather.moveToExit(Areas.ChaosSanctuary, false)) {
                    diablo.util.print("Failed to move to chaos sanctuary.");
                    return false;
                }

                // Let others know this char is at chaos
                Team.communication.diablo.atChaos = true;
                Team.msg.sendData('diablo');


                Pather.moveTo(diablo.data.portalSpot[0], diablo.data.portalSpot[1]);

                // Cast tp in ase there is no portal up yet
                if (!Pather.getPortal(Areas.PandemoniumFortress)) {
                    Pather.makePortal();
                    Team.communication.diablo.portalReady = true;
                    Team.msg.sendData('diablo');
                }
                return true;
            },
            doSeal: function (who) {
                if (Team.communication.diablo[who + 'Done']) {
                    return true;
                }
                if (!diablo.util.toChaos()) {
                    return false; // Failed to get to chaos
                }
                var i, data = undefined;
                for (i in diablo.data.seals) {
                    if (i === who) {
                        data = diablo.data.seals[i];
                    }
                }


                if (data === undefined) {
                    diablo.util.print('Failed to kill ' + i + '. No data available');
                    return false;
                }

                if (!Team.communication.diablo.fast) {
                    // Clear the path to the boss
                    diablo.util.print('Killing the path');
                    data.path.forEach(diablo.util.followPath);
                }

                // Open the seals
                data.seals.forEach(diablo.util.openSeal);

                // Move to the spot that is defined
                Pather.moveTo(data.spot[0], data.spot[1]);

                // Kill the boss
                var boss, glow = getUnit(2, 131);

                // Only do this if it isn't done yet
                for (i = 0; i < 24 && !Team.communication.diablo[who + 'Done']; i += 1) {
                    boss = getUnit(1, data.name);
                    if (!boss) {
                        delay(250);
                        continue;
                    }
                    try {
                        Attack.kill(data.name);
                        Pickit.pickItems();
                        break; // Exit loop on success
                    } catch (e) {
                        if (!Team.communication.diablo.fast) {
                            Attack.clear(10, 0, data.name);
                        }
                    }
                }

                // Let the others know we are done with the seal
                Team.communication.diablo[who + 'Done'] = !!glow;
                Team.msg.sendData('diablo');

                return !!glow;
            },
            killDia: function () {
                if (!diablo.util.toChaos()) {
                    return false; // Failed to get to chaos
                }

                // Move to dia's spot
                Pather.moveTo(7791, 5293);

                diablo.util.preattackDiablo();

                // Kill dia
                Attack.kill(243); // Diablo
                Pickit.pickItems();


                // Let others know
                Team.communication.diablo.diabloDone = true;
                Team.msg.sendData('diablo');

                if (!Pather.getPortal(Areas.PandemoniumFortress,null) && Team.util.doingBaal() && !Config.TeamDiablo.TeleportToThrone) {
                    Pather.makePortal(true);
                }
                Team.util.takePortal(Areas.PandemoniumFortress,5);
            },
        },
        util: {
            print: function (what) {
                print('\xffc4Baal\xffc0: ' + what);
            },
            init: function () {
                if (diablo.data.initialized) {
                    return true;
                }

                var id, layout;

                for (id in diablo.data.seals) {
                    switch (diablo.util.getLayout(diablo.data.seals[id].layoutSeal, diablo.data.seals[id].layoutCoord)) {
                        case 1:
                            print('Layout A for ' + id);
                            diablo.data.seals[id].path = diablo.data.paths[id].A;
                            diablo.data.seals[id].spot = diablo.data.paths[id].ASpot;
                            break;
                        case 2:
                            print('Layout B for ' + id);
                            diablo.data.seals[id].path = diablo.data.paths[id].B;
                            diablo.data.seals[id].spot = diablo.data.paths[id].BSpot;
                            break;
                        default:
                            throw new Error('No such path available for ' + id + '. Layout is: ' + layout);
                    }
                }
                diablo.data.initialized = true;
                return true;
            },
            toChaos: function () {
                if (me.area !== Areas.ChaosSanctuary) {
                    Town.goToTown(4);
                    // Wait 30 seconds for a tp
                    if (!Team.util.takePortal(Areas.ChaosSanctuary, 30)) {
                        // Failed to get to chaos
                        return false;
                    }
                }
                return this.init();
            },
            sort: function (a, b) {
                if (Config.BossPriority) {
                    if ((a.spectype & 0x5) && (b.spectype & 0x5)) {
                        return getDistance(me, a) - getDistance(me, b);
                    }

                    if (a.spectype & 0x5) {
                        return -1;
                    }

                    if (b.spectype & 0x5) {
                        return 1;
                    }
                }

                // Entrance to Star / De Seis
                if (me.y > 5325 || me.y < 5260) {
                    if (a.y > b.y) {
                        return -1;
                    }

                    return 1;
                }

                // Vizier
                if (me.x < 7765) {
                    if (a.x > b.x) {
                        return -1;
                    }

                    return 1;
                }

                // Infector
                if (me.x > 7825) {
                    if (!checkCollision(me, a, 0x1) && a.x < b.x) {
                        return -1;
                    }

                    return 1;
                }

                return getDistance(me, a) - getDistance(me, b);
            },
            openSeal: function (classid) {
                var i, seal;

                for (i = 0; i < 5; i += 1) {
                    // Try to get seal, if we fail we might be on a distance
                    seal = getUnit(2, classid);
                    if (!seal) {
                        // Move closer to the seal
                        Pather.moveToPreset(me.area, 2, classid, 2, 0, Team.communication.diablo.fast, true);
                        seal = getUnit(2, classid);
                    }

                    // Now we really failed to get the seal
                    if (!seal) {
                        return false;
                    }

                    // Don't open seal if it is open already
                    if (seal.mode) {
                        return true;
                    }

                    // It appears the seal isn't opened yet. Open it
                    Pather.moveToPreset(me.area, 2, classid, 2, 0);
                    seal.interact();
                    delay(500);

                    if (!seal.mode) {
                        if (classid === Units.DiabloSealSeizActive && Attack.validSpot(seal.x + 15, seal.y)) { // de seis optimization
                            Pather.moveTo(seal.x + 15, seal.y);
                        } else {
                            Pather.moveTo(seal.x - 5, seal.y - 5);
                        }
                    } else {
                        return true;
                    }
                }
                return false;
            },
            getLayout: function (seal, value) {
                var sealPreset = getPresetUnit(108, 2, seal);

                if (!seal) {
                    throw new Error("Seal (" + seal + ") preset not found. Can't continue.");
                }

                if (sealPreset.roomy * 5 + sealPreset.y === value || sealPreset.roomx * 5 + sealPreset.x === value) {
                    return 1;
                }

                return 2;
            },
            followPath: function (path) {

                Pather.moveTo(path[0], path[1], 3, getDistance(me, path[0], path[1]) > 50);
                Attack.clear(30, 0, false, diablo.util.sort);

            },
            preattack: function (who) {

            },
            preattackDiablo: function () {
                var trapCheck,
                    tick = getTickCount();

                while (getTickCount() - tick < 30000) {
                    if (getTickCount() - tick >= 8000) {
                        switch (me.classid) {
                            case 1: // Sorceress
                                if ([56, 59, 64].indexOf(Config.AttackSkill[1]) > -1) {
                                    if (me.getState(121)) {
                                        delay(500);
                                    } else {
                                        Skill.cast(Config.AttackSkill[1], 0, 7793, 5293);
                                    }

                                    break;
                                }

                                delay(500);

                                break;
                            case 3: // Paladin
                                Skill.setSkill(Config.AttackSkill[2]);
                                Skill.cast(Config.AttackSkill[1], 1);

                                break;
                            case 5: // Druid
                                if (Config.AttackSkill[1] === 245) {
                                    Skill.cast(Config.AttackSkill[1], 0, 7793, 5293);

                                    break;
                                }

                                delay(500);

                                break;
                            case 6: // Assassin
                                if (Config.UseTraps) {
                                    trapCheck = ClassAttack.checkTraps({x: 7793, y: 5293});

                                    if (trapCheck) {
                                        ClassAttack.placeTraps({x: 7793, y: 5293, classid: 243}, trapCheck);

                                        break;
                                    }
                                }

                                delay(500);

                                break;
                            default:
                                delay(500);

                                break;
                        }
                    } else {
                        delay(500);
                    }

                    if (getUnit(1, 243)) {
                        return true;
                    }
                }

                throw new Error("Diablo not found");
            }
        },
        data: {
            initialized: false,
            portalSpot: [7791, 5293], // Star
            seals: {
                viz: {
                    seals: [Units.DiabloSealVizierInactive, Units.DiabloSealVizierActive],
                    name: getLocaleString(Locale.monsters.GrandVizierOfChaos),
                    path: [],
                    spot: [],
                    layoutSeal: Units.DiabloSealVizierActive,
                    layoutCoord: 5275
                },
                seis: {
                    seals: [Units.DiabloSealSeizActive],
                    name: getLocaleString(Locale.monsters.LordDeSeis),
                    path: [],
                    spot: [],
                    layoutSeal: Units.DiabloSealSeizActive,
                    layoutCoord: 7773
                },
                inf: {
                    seals: [Units.DiabloSealInfectorActive, Units.DiabloSealInfectorInActive],
                    name: getLocaleString(Locale.monsters.InfectorOfSouls),
                    path: [],
                    spot: [],
                    layoutSeal: Units.DiabloSealInfectorActive,
                    layoutCoord: 7893

                }
            },
            paths: {
                viz: {
                    A: [[7759, 5295], [7734, 5295], [7716, 5295], [7718, 5276], [7697, 5292], [7678, 5293], [7665, 5276], [7662, 5314]],
                    B: [[7759, 5295], [7734, 5295], [7716, 5295], [7701, 5315], [7666, 5313], [7653, 5284]],
                    ASpot: [7662, 5314],
                    BSpot: [7653, 5284]
                },
                seis: {
                    A: [[7781, 5259], [7805, 5258], [7802, 5237], [7776, 5228], [7775, 5205], [7804, 5193], [7814, 5169], [7788, 5153]],
                    B: [[7781, 5259], [7805, 5258], [7802, 5237], [7776, 5228], [7811, 5218], [7807, 5194], [7779, 5193], [7774, 5160], [7803, 5154]],
                    ASpot: [7777, 5194], // Differs from last of A
                    BSpot: [7803, 5154]
                },
                inf: {
                    A: [[7809, 5268], [7834, 5306], [7852, 5280], [7852, 5310], [7869, 5294], [7895, 5295], [7919, 5290]],
                    B: [[7809, 5268], [7834, 5306], [7852, 5280], [7852, 5310], [7869, 5294], [7895, 5274], [7927, 5275], [7932, 5297], [7923, 5313]],
                    ASpot: [7919, 5290],
                    BSpot: [7923, 5313]
                }
            }
        }
    };
    return diablo.run();
}

