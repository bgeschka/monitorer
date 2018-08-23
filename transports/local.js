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
const exec = require('child_process').exec;
const Log = require('../Log')('transport-local');

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


