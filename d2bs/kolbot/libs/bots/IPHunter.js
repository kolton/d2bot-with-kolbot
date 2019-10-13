/**
*	@filename	IPHunter.js
*	@author		kolton, Mercoory
*	@desc		search for a "hot" IP and stop if the correct server is found
*	@changes	(2019.10.06) More beeps when IP found; More often movement when IP found (Anti drop measure); Overhead messages with countdown; Logs to D2BS console
*/

function IPHunter() {
    let ip = Number(me.gameserverip.split(".")[3]);

    if (Config.IPHunter.IPList.indexOf(ip) > -1) {
        D2Bot.printToConsole("IPHunter: IP found! - [" + ip + "] Game is : " + me.gamename + "//" + me.gamepassword, 7);
        print("IP found! - [" + ip + "] Game is : " + me.gamename + "//" + me.gamepassword);
        me.overhead(":D IP found! - [" + ip + "]");
        me.maxgametime = 0;

        for (let i = 12; i > 0; i -= 1) {
            me.overhead(":D IP found! - [" + ip + "]" + (i - 1) + " beep left");
            beep(); // works if windows sounds are enabled
            delay(250);
        }

        while (true) {

            /* // If you want beeping at every movement
            for (let i = 12; i != 0; i -= 1) {
                me.overhead(":D IP found! - [" + ip + "]" + (i-1) + " beep left");
                beep(); // works if windows sounds are enabled
                delay(250);
            }
            */

            me.overhead(":D IP found! - [" + ip + "]");
            try {
                Town.move("waypoint");
                Town.move("stash");
            } catch (e) {
                // ensure it doesnt leave game by failing to walk due to desyncing.
            }

            for (let i = (12 * 60); i > 0; i -= 1) {
                me.overhead(":D IP found! - [" + ip + "] Next movement in: " + i + " sec.");
                delay(1000);
            }
        }
    }

    for (let i = (Config.IPHunter.GameLength * 60); i > 0; i -= 1) {
        me.overhead(":( IP : [" + (ip) + "] NG: " + w + " sec");
        delay(1000);
    }

    D2Bot.printToConsole("IPHunter: IP was [" + ip + "]", 10);

    return true;
}