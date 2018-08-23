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
 * write email to recipent, based on the user-config
 */

const nodemailer = require('nodemailer');
const config = require("./config");
const Log = require("./Log")('MAIL');
const userconfig = require('./userconfig');

module.exports = (subj, message) => {
	var usercfg = userconfig.get();
	Log.debug("sending message because:", usercfg);

	Log.debug('subject',subj);
	Log.debug('message',message);

	if (!usercfg.emailalert) {
		Log.debug("not mailing, as is disabled");
		return new Promise( (resolve) => {
			resolve("not mailing");
		});
	}

	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: usercfg.email_smtp_user,
			pass: usercfg.email_smtp_pass
		}
	});

	var sender = '"'+config.systemname+'" ' + usercfg.email_smtp_user;
	Log.silly("sending message as:", sender);

	var mailOptions = {
		from : sender,
		to: usercfg.email_target,
	};

	return new Promise((resolve, reject) => {
		mailOptions.subject = subj;
		mailOptions.html = message;

		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				Log.error(err);
				reject(err);
			} else {
				Log.debug(info);
				resolve(info);
			}
		});
	});
};
