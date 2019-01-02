# monitorer

## This is a __work-in-progress__ monitoring application written in node

Monitorer has no built-in authentication in place, use basic-auth via htpasswd protection instead,
or run it in a closed up network environment like a VPN or LAN.
Monitorer has no Database dependency, all operating configuration is stored in flat files,
organized in a way that no lookup is required.

## Dependencies
* nodejs & npm
* systemd based system (optional if you can install by hand)

## Features
* transport support for
  * local
  * ssh
  * telnet
* plugin support for now
  * ping
  * curl
  * portcheck
  * command
  * disk space in %
  * ram usage in %
  * SMART status of disks
* supports gmail mailing of state changes
* cron like schedule with [cron-parser](https://www.npmjs.com/package/cron-parser)



## installation
```
git clone https://github.com/bgeschka/monitorer.git
cd monitorer
sudo ./install.sh
```


## Screenshots
![Dashboard](http://files.bgeschka.de/monitorer-screens/dash-icons.png)
![Dashboard](http://files.bgeschka.de/monitorer-screens/dash-list.png)
![Job-Curl](http://files.bgeschka.de/monitorer-screens/jobedit-curl.png)
![Job-SSH](http://files.bgeschka.de/monitorer-screens/jobedit-ssh.png)
![Jobs](http://files.bgeschka.de/monitorer-screens/jobs.png)
![Settings](http://files.bgeschka.de/monitorer-screens/settings.png)

## adding plugins

One can simply add a plugin to the plugins/ folder, with the boilerplate below.
The name of the file determines the plugins name
After that, args is exposed to UI and can be edited

```javascript
module.exports.command = "ping -c {count} {host}"; //a template for the command to run
module.exports.args = ["count", "host"]; //list of arguments visible in UI for editing

module.exports.bad = function (result) {
        return result.match(/error/);
};

//configuration of display
module.exports.view = {
        module: "text"
};
```
