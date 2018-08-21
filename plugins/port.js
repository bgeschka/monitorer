module.exports.command = "nc -z {host} {port} ; echo $?";
module.exports.args = ["port", "host"];

module.exports.bad = function (parsedresult) {
        return (parsedresult != 0);
};

module.exports.view = {
	module: "ok"
};

