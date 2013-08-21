/**
*	@filename	HeartBeat.js
*	@author		kolton
*	@desc		Keep a link with d2bot#. If it's lost, the d2 window is killed
*/

function main() {
	include("oog.js");
	include("json2.js");
	include("common/misc.js");
	D2Bot.init();

	var tick = getTickCount(),
		startTick = getTickCount();

	function doubleScriptCheck() {
		if (getTickCount() - startTick < 2000) {
			return false;
		}

		var list = [],
			threads = [],
			script = getScript();

		if (script) {
			do {
				if (list.indexOf(script.name) === -1) {
					list.push(script.name);
					threads.push(script.threadid);
				} else if (script.threadid !== threads[list.indexOf(script.name)]) {
					D2Bot.printToConsole("Script loaded twice " + script.name);
					D2Bot.restart();
				}
			} while (script.getNext());
		}

		return true;
	}

	function CopyDataEvent(mode, msg) {
		switch (mode) {
		case 4:
			if (msg === "pingrep") {
				tick = getTickCount();
			}

			break;
		}
	}

	addEventListener("copydata", CopyDataEvent);

	while (true) {
		D2Bot.heartBeat();
		delay(1000);

		/*sendCopyData(null, me.windowtitle, 4, "pingreq");
		delay(500);

		if (getTickCount() - tick >= 20000) {
			D2Bot.printToConsole("Starter not responding.");
			D2Bot.restart();
		}*/

		doubleScriptCheck();
	}
}