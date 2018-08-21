const Log = require('./Log')('RUNTIMEDIR');
const config = require("./config");
const fs = require('fs');

function tryCreateDir(dir) {
	try {
		fs.mkdirSync(dir);
	} catch (e) {
		//Log.warn("initialize errored", e);
	}
	
}

(() => {
	tryCreateDir(config.datadir);
	tryCreateDir(config.jobsdir);
})();


