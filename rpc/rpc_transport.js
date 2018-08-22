const fs = require('fs');
const { jsonresponse } = require('./rpc_common');

function lsdir(dir) {
	return fs.readdirSync(dir);
}


const transportdir = './transports/';
async function listtransports(){
	var files = lsdir(transportdir);

	var ret = [];
	for(var i = 0 ; i < files.length; i++)
	{
		var file = files[i];
		var transport = require('.'+transportdir + file);
		transport.name = file.replace(".js", "");
		ret.push(transport);
	}

	return ret;
}
module.exports = async (req,res) => {
	switch (req.body.method) {
		case 'listtransports':
			jsonresponse(res, await listtransports() );
			break;
	}
};
