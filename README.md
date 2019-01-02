# monitorer

## This is a monitoring application written in node

Monitorer is built to provide a simple way for monitoring UNIX commands and more on remote and local machines.
It can be setup to inform you with an E-Mail message if a task goes into bad state.
What a bad state is, is defined by the plugin used, or if the command exits with non-0.

Examples:
You can monitor websites you're in charge of with the curl plugin,
and test for a given String in the result(e.g. the sites \<title>), to validate its up and healthy.
If your webserver goes down, or the certificate runs out, the curl plugin can no longer get the page
and validate the expected String in the result.
Then Monitorer sends you an email that the job has gone into BAD state.
Once you fixed the issue after receiving the email,
you'll receive another email telling you the job has gone into GOOD state again.

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
