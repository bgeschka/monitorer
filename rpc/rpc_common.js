function jsonresponse(res,jso) {
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(jso));
}

function jsonresponseDone(res) {
	jsonresponse(res, { code: 0 });
}



module.exports.jsonresponse = jsonresponse;
module.exports.jsonresponseDone = jsonresponseDone;
