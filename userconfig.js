const config = require("./config");
const fs = require("fs");
const UCFGDEFAULT = '{}';

module.exports.get = function () {
        var ucfgstr = UCFGDEFAULT;

	try {
		ucfgstr = fs.readFileSync(config.configpath);
	} catch (e) {
		ucfgstr = UCFGDEFAULT;
		/* handle error */
	}

	return JSON.parse(ucfgstr);
};
