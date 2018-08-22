const Telnet = require('telnet-client');

var _args = [
	'host',
	'port',
	'username',
	'password',
	'loginPrompt',
	'passwordPrompt',
	'shellPrompt',
];
module.exports.args = _args;
module.exports.exec = async (args,cmd) => {
	let connection = new Telnet();

	let params = {
		host: args[_args[0]],
		port: args[_args[1]] || 23,
		username: args[_args[2]] || process.env.USER,
		password: args[_args[3]],
		loginPrompt: args[_args[4]],
		passwordPrompt : args[_args[5]],
		shellPrompt: args[_args[6]], //'/ # ',
		timeout: 1500
	};

	await connection.connect(params);
	return await connection.exec(cmd);
};
