const SSH2Promise = require('ssh2-promise');

function connect(host,port,user,password) {
        var user = user || process.env.USER;

	var conn = {
		keepaliveInterval : 1000,
		host: host,
		username: user,
		port: port || 22,
		reconnectDelay: 5000,
		reconnectTries: 20,
	};

	if (password) {
		conn.password = password;
	} else {
		//use default key
		conn.identity = '/home/' + user + '/.ssh/id_rsa';
	}

	var ssh = new SSH2Promise(conn);
	return ssh.connect();
}

var _args = ['host','port','username','password'];
module.exports.args = _args;
module.exports.exec = async (args,cmd) => {
	var ssh = await connect(
		args[_args[0]],
		args[_args[1]],
		args[_args[2]],
		args[_args[3]]
	);

	var res = await ssh.exec(cmd);
	await ssh.close();
	return res;
};



