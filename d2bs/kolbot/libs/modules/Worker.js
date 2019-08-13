(function(module,require) {
    /**
     * @description Simple worker class for async behavior
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

    let Worker = module.exports  = new (function () {
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
})(module,require);