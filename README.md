# D2BS IS NOT SAFE FROM DETECTION!

#Improved version of kolton
Hi, first of all, welcome to this improved version of kolton. What exactly is the difference compared to original kolton?
- Node like require. You can write your own modules in lib/module
- ES6 Promises, full support
- SpeedDiablo. A faster version diablo run
- Quite some custom libs
- Development script, easily reload your current script.


## to do list
- Assasin:
    - automatic switching to burst of speed in town
    - automatic switching to fade, when leaving town 

- Scripts:
    - SpeedBaal. A high performance baalrun. Some versions are already leaked

- Config:
    - Autoconfig, taking allot out of hand to setup yourself. 

## Documentation
- Development script:
    - currently it bugs with D2BotMap. Causes unknown.
    - fill in `Config.Development = 'Script';` and put `Script.Development = true;`.
    - reload current script with ctrl + r. (make sure you press ctrl for a sec)

- SpeedDiablo
    - Both a leader as a follower script, which you toggle with the follower config. Example configuration in config file.
# Promises?
As we mostly write in ancient javascript, this may needs some [explanation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). The idea is that you can give a promise, that something will happen in the future. This is a javascript ES6 standard, and not implemented in the old firefox version we are using in d2bs. This implements it (polyfill) it for the old engine we run on
# Simple example

```javascript
let promises = [
		new Promise(resolve => me.area === 109 && resolve()),
		new Promise(resolve => me.area === 103 && resolve()),
		new Promise(resolve => me.area === 75 && resolve()),
		new Promise(resolve => me.area === 40 && resolve()),
		new Promise(resolve => me.area === 1 && resolve()),
	];

	Promise.allSettled(promises).then(_ => me.overhead('been in all acts'));
```
[Simple example in action](https://user-images.githubusercontent.com/31186222/60744835-f90fd600-9f77-11e9-998f-f680ddd5dfb8.gif)

# Why is this handy?
The ability to do stuff on the background can be very useful. As it can be defined anywhere, and it just jumps to this code once it is called. Where, you can make another promise.


# Other stuff
To make this ability, i also wrote a background worker.
You can simply write a function that runs on the background, by doing this;
```javascript
let lastArea = me.area;
Worker.runInBackground.name = function() {
    // Gets executed all the time, aslong you return true;
    if (me.area !== lastArea) {
        print('now in area: '+me.area);
    }
    return true;
}
```
# Original readme:

[**Join the Forums!**](https://d2bot.discourse.group/)

[**Join the Discord Channel!**](https://discord.gg/FuBG8N2)

[**Documentation Repo**](https://github.com/blizzhackers/documentation)

## Install Dependencies - DO THIS FIRST!
- [Microsoft Visual C++ 2010 Redistributable Package (x86)](https://www.microsoft.com/en-us/download/details.aspx?id=5555)
- [Microsoft .NET Framework 4.0 (or higher)](https://dotnet.microsoft.com/download/dotnet-framework)

## MASTER Branch (also known as TRUNK)

The package contains 3 distinct components:
- D2BS - core
- D2Bot# - manager
- kolbot - script library

If you want to contribute to kolbot code, make sure you use JSLint or ESLint for final polish.
If you want to contribute to d2bs/d2bot#, come to irc.synirc.net/d2bs and ask around.

- [JSLint options for kolbot code](https://gist.githubusercontent.com/noah-/d917342e52281d54c404e0b2c18b0c6e/raw/fbade95e38b103d2654b90d85ef62a51c4295153/jslint.config)
- [ESLint options for kolbot code](https://gist.githubusercontent.com/Nishimura-Katsuo/2d6866666c7acf10047c486a15a7fe60/raw/99ef9c2995929c492ef856772ff346e0f19709cd/.eslintrc.js)

## Getting Started
- [D2Bot # Manager Setup](https://github.com/kolton/d2bot-with-kolbot/wiki/D2Bot-%23-Manager-Setup)
- [Installing D2Bot # with Kolbot](https://github.com/kolton/d2bot-with-kolbot/wiki/Installing-d2bot%23-with-kolbot)
- [.dbj .dbl syntax highlighting](https://github.com/kolton/d2bot-with-kolbot/wiki/.dbj-.dbl-syntax-highlighting)
- [FAQ](https://github.com/kolton/d2bot-with-kolbot/wiki/FAQ)

## Guides
**Starter Config**
- [Kolbot Leader config](https://github.com/kolton/d2bot-with-kolbot/wiki/Kolbot-Leader-config)
- [Kolbot Leecher config](https://github.com/kolton/d2bot-with-kolbot/wiki/Kolbot-Leecher-Starter)
- [Kolbot Character config](https://github.com/kolton/d2bot-with-kolbot/wiki/Kolbot-Character-config)

# LimeDrop Web Based Item Manager and Dropper
## Setup
**Limedrop is available by default on the master and unicode branches.**
- [Limedrop Install and Usage](https://github.com/blizzhackers/documentation/blob/master/limedrop/README.md)


![](https://i.imgur.com/bsmEv3j.png)
