define([], function() {
	return {
		bytesToSize: function(bytes) {
			var sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
			if (bytes == 0) return '0 Byte';
			var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
			return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
		},

		secondsToTimeElapsed: function(times) {
			var seconds = parseInt(times, 10);
			var days = Math.floor(seconds / (3600 * 24));
			seconds -= days * 3600 * 24;
			var hrs = Math.floor(seconds / 3600);
			seconds -= hrs * 3600;
			var mnts = Math.floor(seconds / 60);
			seconds -= mnts * 60;
			return days + " days, " + hrs + " Hrs, " + mnts + " Minutes, " + seconds + " Seconds";

		},
	};
});
