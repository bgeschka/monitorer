/*
 * Copyright 2018 Björn Geschka <bjoern@geschka.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
const SSH2Promise = require('ssh2-promise');
const Log = require('../Log')('transport-ssh');

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
	var ssh = null;
	try {
		ssh = await connect(
			args[_args[0]],
			args[_args[1]],
			args[_args[2]],
			args[_args[3]]
		);
	} catch (e) {
		throw Log.error('failed to connect');
	}

	var res = '';
	try {
		res = await ssh.exec(cmd);
	} catch (e) {
		throw Log.error('failed to execute ssh command:',cmd,e);
	}

	await ssh.close();
	return res;
};



