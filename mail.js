/*
 * write email to recipent, based on the user-config
 */

const nodemailer = require('nodemailer');
const config = require("./config");
const Log = require("./Log")('MAIL');
const userconfig = require('./userconfig');

module.exports = (subj, message) => {
	var usercfg = userconfig.get();
	Log.debug("sending message", usercfg);

	if (!usercfg.emailalert) {
		Log.silly("not mailing, as is disabled");
		return new Promise( (resolve) => {
			resolve("not mailing");
		});
	}

	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: usercfg.email_smtp_user, //'begeschka@gmail.com',
			pass: usercfg.email_smtp_pass //'+9V0EFD7Zz+IJKTG4qJZZQTYnHwT96ttOTx4CDIyLiveru6hxVv5XbqErMZMfhXR'
		}
	});

	var sender = '"'+config.systemname+'" ' + usercfg.email_smtp_user;
	Log.silly("sending message as:", sender);

	var mailOptions = {
		//’“Sender Name” sender@server.com‘,
		//from: usercfg.smtp_user, //'sender@email.com', // sender address
		from : sender,

		to: usercfg.email_target, //'to@email.com', // list of receivers
		//subject: 'Subject of your email', // Subject line
		//html: '<p>Your html here</p>' // plain text body
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
