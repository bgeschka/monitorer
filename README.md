# monitorer

## This is a __work-in-progress__ monitoring application written in node

## Features
* plugin support for 4 types of monitoring for now
  * ping
  * curl
  * portcheck
  * command
* supports gmail mailing of state changes
* cron like schedule with [cron-parser](https://www.npmjs.com/package/cron-parser)



## installation
for an adhoc run:
```
git clone https://github.com/bgeschka/monitorer.git
cd monitorer
npm install
node main
```


## Screenshots
![Dashboard](http://files.bgeschka.de/monitorer-screens/2018-08-21-204824_1045x399_scrot.png)
![Jobs](http://files.bgeschka.de/monitorer-screens/2018-08-21-204836_1053x400_scrot.png)
![Jobs - Curl](http://files.bgeschka.de/monitorer-screens/2018-08-21-204903_877x632_scrot.png)
![Jobs - Portscan](http://files.bgeschka.de/monitorer-screens/2018-08-21-204921_876x629_scrot.png)
![Jobs - Ping](http://files.bgeschka.de/monitorer-screens/2018-08-21-204935_880x625_scrot.png)
![Settings](http://files.bgeschka.de/monitorer-screens/2018-08-21-205009_886x458_scrot.png)


## adding plugins

One can simply add a file to the plugins/ folder, with the boilerplate below.
After that, args is exposed to UI and can be edited

```javascript
module.exports.command = "ping -c {count} {host}"; //a template for the command to run
module.exports.args = ["count", "host"]; //list of arguments visible in UI for editing

//optional parse function, if needed
module.exports.parse = function (resultstring) {
        var parts = resultstring.split(" ");
        var timepart = parts.filter( p => p.match(/time=/))[0];
        return timepart.split('=')[1];
};

//function detecting if the result is bad
module.exports.bad = function (parsedresult) {
        return (parsedresult > 200);
};

//configuration of display
module.exports.view = {
        module: "text"
};
```
