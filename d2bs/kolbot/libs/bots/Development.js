/**
 * @author Jaenster
 * @description Easy way to develop your scripts. Press Ctrl + R to reload the script. On restart,
 *              it doesnt necessarily go to town unlike default kolton behaviour

 I had to make the hotkey Ctrl + R. you need to have the Ctrl down for a sec, keep this in mind
 *
 * @config

 Scripts.Development = true;
 	Config.Development = 'Baal'; // name of script here (case sensitive, basically the filename in /libs/bots)
 */

const Development = (function (global) {
	const thisFilename = 'libs/bots/Development.js';
	const Config = !isIncluded('GameData.js') && require('Config')() || require('Config'); // Either load the config file, or get the config
	// If config is not set (can happen), create empty object
	typeof Config === 'undefined' && (global.Config = {});
	// In case it hasnt set the a variable Development
	!Config.hasOwnProperty('Development') && (Config.Development = '');

	// In case no specific script is given
	typeof Config.Development !== 'string' && (Config.Development = '');


	function debug(what) {
		what === 'ÿc2Starting script: ÿc9Development' && (what = 'ÿc2Starting script: ÿc9' + Config.Development + ' (in development)');
		var stackNumber = 1, // exclude this function
			stack = new Error().stack.match(/[^\r\n]+/g),
			line = stack[stackNumber].substr(stack[stackNumber].lastIndexOf(':') + 1),
			functionName = stack[stackNumber].substr(0, stack[stackNumber].indexOf('@')),
			filename = stack[stackNumber].substr(stack[stackNumber].lastIndexOf('\\') + 1);

		typeof what === 'object' && (what = JSON.stringify(what));

		_print('ÿc:[ÿc5' + filename + 'ÿc:] (ÿc:' + functionName + ':' + line + 'ÿc:):ÿc0 ' + what);


	}

	// override the normal print function
	typeof global._print === 'undefined' && (global._print = print); // store original
	print !== debug && (print = debug);

	// The thread part
	global.main = function () {
		const defaultdbj = getScript('default.dbj');
		let ready = false, includeList = [], restart = false;

		addEventListener('scriptmsg', function (data) {
			try {
				typeof data !== 'object' && (data = JSON.parse(data));
			} catch (e) {
				return; // cant parse, dont care
			}
			data.hasOwnProperty('Development') && typeof data.Development === 'string' && (ready = !!(Config.Development = data.Development));

			data.hasOwnProperty('include')
			&& Array.isArray(data.include)
			&& (includeList = data.include);

			data.hasOwnProperty('restart')
			&& (restart = data.restart);

		});
		defaultdbj.send({Development: {Up: true}}); // send msg to say we are up

		// As long we are not ready, wait
		for (; !ready; delay(10)) ;

		includeList.some(x => {
			let success = include(x);
			!success && print('fail include file ' + x);
			return !success;
		});

		// Load the config file
		typeof LoadConfig === 'function' && LoadConfig();

		// Make sure checkInfinity is re-inited
		typeof Attack === 'object' && Attack.hasOwnProperty('checkInfinity') && typeof Attack.checkInfinity === 'function' && Attack.checkInfinity();

		// init localchat, if loaded
		typeof LocalChat === 'object' && LocalChat.hasOwnProperty('init') && typeof LocalChat.init === 'function' && LocalChat.init();

		// init pickit, if loaded
		typeof Pickit === 'object' && Pickit.hasOwnProperty('init') && typeof Pickit.init === 'function' && Pickit.init(true);

		// init d2bot (get handle)
		typeof D2Bot === 'object' && D2Bot.hasOwnProperty('init') && typeof D2Bot.init === 'function' && D2Bot.init();

		// init storage
		typeof Storage === 'object' && Storage.hasOwnProperty('Init') && typeof Storage.Init === 'function' && Storage.Init();

		restart && _print('ÿc2Restarting script: ÿc9' + Config.Development + ' (in development)');
		try {
			include('bots/' + Config.Development + '.js') && global[Config.Development]() || print('failed to load ' + Config.Development);
		} catch (e) {
			try {
				Misc.errorReport(e, Config.Development);
				print('\r\n' + e.stack);
			} catch (e2) {
				_print('cant load the file ' + e.message);
			}

			// Just idle, incase we will be resetted
			while (me.ingame) {
				delay(1000);
			}
		}
	};

	function restartScript() {
		let script = getScript(thisFilename);
		// If script is running, stop it
		script && script.stop();

		// (re)load the script
		load(thisFilename);
		script = getScript(thisFilename);

		// make sure we have the script
		if (!script) for (; !(script = getScript(thisFilename)); delay(10)) ;
		return script;
	}

	function getIncludeList() {
		/** @type String[] */
		let files = [],
			dirs = ['', '/common', '/common/Attacks', '/config', '/config/Builds', '/config/Templates', '/bots'];


		// open all directories
		dirs.forEach(dir => (dopen('libs' + dir).getFiles() || []).forEach(file => files.push(dir + '/' + file)));

		// remove the trailing slash
		files = files.map(x => x.startsWith('/') && x.substr(1) || x)
			.filter(isIncluded); // Only those that are included

		return files;
	}

	return function (Config) {
		let restart = false;
		if (!Config.Development) throw Error('Nothing to develop'); // Nothing to develop
		addEventListener('scriptmsg', function (data) {
			try {
				typeof data !== 'object' && (data = JSON.parse(data));
			} catch (e) {
				return; // cant parse, dont care
			}
			// If we have Developement in the name
			data.hasOwnProperty('Development')
			&& typeof data.Development === 'object'
			&& data.Development.hasOwnProperty('Up')
			&& (script || getScript(thisFilename)).send({
				Development: Config.Development,
				include: getIncludeList(),
				restart: restart
			});
		});

		let controlDown = false, reload = false;
		addEventListener('keydown', key => key && key === 17 && (controlDown = true));
		addEventListener('keyup', key => key
			&&
			(
				(key === 17 && (controlDown = false))
				||
				(key === 82 && controlDown && (reload = true))
			)
		);
		// make sure we have the script
		let script = restartScript();

		const waitUntilUp = () => {
			// Loops aslong the script runs,
			while (!script.running) {
				delay(10);
			}
		};

		waitUntilUp();

		while (me.ingame && script.running) {
			if (reload) {
				restart = true;
				reload = false;
				script = restartScript();
				waitUntilUp();
			}
			delay(10);
		}

		print = _print; // old print statements back
	};
})(this);