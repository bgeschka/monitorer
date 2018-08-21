/*
 *  schedule can be set
 *  and checked
 *
 *
 */

var parser = require('cron-parser');
const Log = require('./Log')('Schedule');
class Schedule {
	constructor() {}

	/*
	 * set a cronstring to provide when to run the task
	 * */
	set(cronstring){
		this.cronstring = cronstring;
		this.interval = parser.parseExpression(cronstring);

	}

	fitsNow(next){
		var cd = new Date();
		var compares = ["getFullYear", "getMonth", "getDate", "getHours", "getMinutes"];

		for(var i = 0 ; i < compares.length; i++)
		{
			var fn = compares[i];
			var now = cd[fn]();
			var nxt = next[fn]();

			if(now != nxt) {
				//Log.silly("not now as for:", fn, now, "!=", nxt);
				return false;
			}
		}

		this.next = undefined;

		return true;
	}

	/*
	 * checks if this.crontstring should be executed by now
	 * */
	check(){
		if(!this.next)  this.next = this.interval.next();
		return this.fitsNow(this.next);
	}


}

module.exports = Schedule;
