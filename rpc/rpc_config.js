const { jsonresponse } = require('./rpc_common');
const fs  = require('fs');

module.exports = (config,req,res) => {
	switch (req.body.method) {
		case 'setconfig':
			fs.writeFileSync(config.configpath, JSON.stringify(req.body.config) );
		case 'getconfig':
			var conf = {};
			try {
				conf = JSON.parse(fs.readFileSync(config.configpath).toString());
			} catch (e) {
				conf = {};
			}

			if (conf === "") conf = {};

			jsonresponse(res, {
				config : conf
			});
			break;
	}
};
