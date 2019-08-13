(function (module, require) {
    const Events = module.exports = function () {
        Worker = require('Worker');
        let self = this;
        this.hooks = [];

        function Hook(name, callback) {
            this.name = name;
            this.callback = callback;
            this.id = self.hooks.push(this)
        }

        this.on = function (name, callback) {
            return new Hook(name, callback);
        };

        this.trigger = function (name, ...args) {
            return self.hooks.forEach(hook => !hook.name || hook.name === name && Worker.push(() => hook.callback.apply(hook, args)));
        };

        this.once = function (name, callback) {
            return new Hook(name, function (...args) {
                callback.apply(undefined, args);
                delete self.hooks[this.id];
            });
        }
    };
})(module, require);