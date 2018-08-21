module.exports.command = "ping -c {count} {host}";
module.exports.args = ["count", "host"];

module.exports.parse = function (resultstring) {
	var parts = resultstring.split(" ");
	var timepart = parts.filter( p => p.match(/time=/))[0];
	return timepart.split('=')[1];
};

module.exports.bad = function (parsedresult) {
        return (parsedresult > 200);
};

module.exports.view = {
	module: "gauge",
	bad : +200,
	max : 300,
	min : 1
};

