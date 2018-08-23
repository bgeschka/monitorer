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
const Telnet = require('telnet-client');
const Log = require('../Log')('transport-telnet');

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
