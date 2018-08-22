const exec = require('child_process').exec;

module.exports.args = [];
module.exports.exec = (args,cmd) => {
	console.log(args);
	return new Promise((resolve, reject) => {
		var res = "";
		var _e = "";
		var child = exec(cmd, {
			env: process.env
		});

		child.stderr.on('data', function(data) {
			_e += data.toString();
		});

		child.stdout.on('data', function(data) {
			res += data.toString();
		});

		child.on('close', function(code) {
			if (code !== 0) {
				reject(_e);
				return;
			}

			resolve(res);
		});
	});
};


