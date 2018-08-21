module.exports.command = "curl {host}";
module.exports.args = ["host", "expectstring"];

module.exports.bad = function (parsedresult, args) {
	if (args["expectstring"]) {
		if (parsedresult.indexOf(args["expectstring"]) === -1) return true;
	}

	return false;
};

module.exports.view = {
	module: "ok"
};

