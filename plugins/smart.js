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
module.exports.command = "{prefix} smartctl -H {disk} 2>&1; echo 'done'";
module.exports.args = ["disk", "prefix"];
module.exports.descr = `Test smart status on disk(e.g. /dev/sda) using smartctl,
	if you're executing as non-root and require sudo to run, 
	enter \"sudo\" into the prefix field. For this to work, sudoers has to be setup for 
	your user using NOPASSWD: ALL`;

module.exports.bad = function (parsedresult, args) {
	var match = !!parsedresult.match(/test result: PASSED/);
	if (!match) {
		console.log("smart failed as for:", parsedresult);
	}
	return !match;
};

module.exports.view = {
	module: "ok"
};

