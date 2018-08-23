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
