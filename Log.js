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
const {
	createLogger,
	format,
	transports
} = require('winston');

const {
	combine
} = format;
const util = require('util');

/*
 * possible loglevels:
 *	error    
 * 	warn     
 * 	info     
 * 	verbose  
 * 	debug    
 * 	silly    
 *
 */

var config = require("./config");

const L = createLogger({
	level: config.loglevel || 'silly',
	format: combine(
		format.colorize(),
		format.simple()
	),

	transports: [
		new transports.Console(),
		//for later logging to files
		//new transports.File({
		//	filename: 'combined.log',
		//	level: 'info'
		//})
		new transports.File({ filename: config.logfile || "/tmp/monitorer.log ", level: 'silly' }),
	]
});

function argsToStr(v) {
	// convert arguments object to real array
	var args = Array.prototype.slice.call(v);
	for (var k in args) {
		if (typeof args[k] === "object") {
			// args[k] = JSON.stringify(args[k]);
			args[k] = util.inspect(args[k], false, null, true);
		}
	}
	var str = args.join(" ");
	return str;
}

module.exports = function(LOGN) {
	var nwrap = {};
	['error', 'warn', 'debug', 'info', 'verbose', 'debug', 'silly'].forEach(t => {
		nwrap[t] = function() {
			var argsm = "[" + LOGN + "]:" +  argsToStr(arguments);
			L.log.apply(L, [t, argsm]);
			return argsm;
		};
	});
	nwrap.trace=console.trace;
	nwrap.argsToStr = argsToStr;
	return nwrap;
};


