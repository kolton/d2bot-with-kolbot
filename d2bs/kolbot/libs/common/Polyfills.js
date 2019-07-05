(function (global) {
	/**
	 * @description Promise polyfill for d2bs. Try's to re-create the entire
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
	 * @author Jaenster
	 */

	const recursiveCheck = function (stackNumber) {
		let stack = new Error().stack.match(/[^\r\n]+/g),
			functionName = stack[stackNumber || 1].substr(0, stack[stackNumber || 1].indexOf('@'));

		for (let i = (stackNumber || 1) + 1; i < stack.length; i++) {
			let curFunc = stack[i].substr(0, stack[i].indexOf('@'));

			if (functionName === curFunc) {
				return true;
			} // recursion appeared
		}

		return false;
	};

	global.Worker = new (function () {
		let work = [], workLowPrio = [], self = this;

		this.push = function (newWork) {
			return work.push(newWork);
		};

		this.pushLowPrio = function (newWork) {
			return workLowPrio.push(newWork);
		};

		const checker = function (val) {
			try {
				!self.workDisabled && val.length && val.splice(0, val.length).forEach(self.work);
			} catch (error) {
				if (!error.message.endsWith('too much recursion')) {
					throw error;
				} // keep on throwing

				print('[ÿc9Warningÿc0] Too much recursion');
			}
		};

		this.check = function () {
			return checker(work);
		};

		this.checkLowPrio = function () {
			return checker(workLowPrio);
		};

		this.work = function (what) {
			return typeof what === 'function' && what(self) || (Array.isArray(what) && what.forEach(self.work));
		};

		/**
		 *
		 * @param {function({Worker}):boolean} callback
		 */
		this.runInBackground = new Proxy({processes: {}}, {
			set: function (target, name, callback) {
				target.processes[name] = {callback: callback, running: true};

				let proxyCallback = function () {
					target.processes.running = (callback() && self.pushLowPrio(proxyCallback) > -1);
				};

				self.pushLowPrio(proxyCallback);
			},
		});

		global.await = function (promise) {
			while (delay() && !promise.stopped) {}

			return promise.value;
		};

		this.workDisabled = 0;

		global._delay = delay; // The original delay function

		// Override the delay function, to check for background work while we wait anyway
		global.delay = function (amount) {
			let recursive = recursiveCheck();
			let start = getTickCount();
			amount = amount || 0;

			do {
				self.check();
				global._delay(getTickCount() - start > 3 ? 3 : 1);
				!recursive && self.checkLowPrio();
			} while (getTickCount() - start <= amount);

			return true; // always return true
		};

	})();

	/**
	 *
	 * @param {function({resolve},{reject}):boolean} callback
	 * @constructor
	 */
	global.Promise = function (callback) {
		typeof Promise.__promiseCounter === 'undefined' && (Promise.__promiseCounter = 0);

		this._after = [];
		this._catchers = [];
		this._finally = [];
		this.stopped = false;
		this.value = this;
		const self = this;

		const final = function () {
				typeof self._finally !== 'undefined' && self._catchers.forEach(function (callback) {
					return callback(self.value);
				});
			}, resolve = function (result) {
				self.value = result;
				self.stopped = true;

				typeof self._after !== 'undefined' && self._after.forEach(function (callback) {
					return callback(result);
				});
				final();
			},
			reject = function (e) {
				self.stopped = true;
				typeof self._catchers !== 'undefined' && self._catchers.forEach(function (callback) {
					return callback(e);
				});
				final();
			};


		if (this.__proto__.constructor !== global.Promise) {
			throw new Error("Promise must be called with 'new' operator!");
		}

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf
		// override the valueOf as primitive value function
		this.valueOf = () => self.stopped ? self.value : self;

		this.then = function (handler) {
			typeof self._after !== 'undefined' && (self._after = []);
			self._after.push(handler);

			return self;
		};

		this.catch = function (handler) {
			typeof self._catchers !== 'undefined' && (self._catchers = []);
			self._catchers.push(handler);

			return self;
		};

		this.finally = function (handler) {
			typeof self._finally !== 'undefined' && (self._finally = []);
			self._finally.push(handler);

			return self;
		};

		global.Worker.runInBackground['promise__' + (++Promise.__promiseCounter)] = function () {
			try {
				callback(resolve, reject);
			} catch (e) {
				reject(e);
			}

			return !self.stopped;
		};
	};

	/**
	 * @description wait for an array of promises to be ran.
	 * @param promises Array
	 */
	Promise.all = function (promises) {
		while (promises.some(x => !x.stopped)) {
			delay();
		}
	};

	Promise.allSettled = (promises) => new Promise(resolve => promises.every(x => x.stopped) && resolve(promises));

})(typeof global !== 'undefined' ? global : this, delay);

