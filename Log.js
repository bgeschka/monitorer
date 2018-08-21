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


