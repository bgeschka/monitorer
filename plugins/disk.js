module.exports.command = "df {disk}";
module.exports.args = ["disk"];

module.exports.parse = function (resultstring) {
	var l = resultstring.split('\n')[1];
	var parts = l.split(/\s+/)[4];
	parts = parts.replace( /\D+/g, '');
	return parts;	
};

module.exports.bad = function (parsedresult) {
        return (parsedresult > 90);
};

module.exports.view = {
	module: "gauge",
	bad : 80,
	max : 100,
	min : 1
};


