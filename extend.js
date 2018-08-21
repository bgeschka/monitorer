module.exports = (dst, _src) => {
	var src = JSON.parse(JSON.stringify(_src));
	for(var f in src) dst[f] = src[f];
};

