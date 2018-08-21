define([
	"app",
], function(app) {
	app.service("config", function($rootScope) {
		var cfg = {
			headless: false,
			/*fake ubus*/
			debug: false,
			encryptions: ['psk2', 'psk', 'none'], //there might be more https://wiki.openwrt.org/doc/uci/wireless#wpa_modes
			loadingSymbol: '⏳',
			restrictChannels: true,
			dbgtriggercount: 20,
			dbgtriggerkey: 19 /*pause*/ ,
			tetristriggercount: 20,
			tetristriggerkey: 84 /*t*/ ,
			/*pause key*/
			polltimeout: 5000,
			maxchartdata: 30,
			pinregex: /^\d{4}$/,
			sitename: "Monitorer",
			CGI: "/ubus",
			defaultroute: "/status",
			loginsuccessroute: '/linkstatus',
			defaultroutenoperm: "/login",
			defaultubussessiontimeout: 1000,
			/*where to redirect on permisssion denied calls*/
			defaultuser: "root", //if this is set, this user will be used and username is not shown in login page
			/*to in ms*/

			keypress: function(keycode) {
				switch (keycode) {
					case this.tetristriggerkey:
						this.triggerTetris();
						break;
					case this.dbgtriggerkey:
						this.triggerDebug();
						break;
					default:
						break;
						
				}
			},

			dbg: 0,
			triggerDebug: function() {
				console.info("debug trigger");
				this.dbg++;
				if (this.dbg > this.dbgtriggercount && !this.debug) {
					console.info("Debug mode");
					this.debug = true;
					$rootScope.$apply();
				}
			},

			ttrs: 0,
			triggerTetris: function() {
				console.info("Tetris trigger", this.ttrs, this.tetristriggercount);
				this.ttrs++;
				if (this.ttrs > this.tetristriggercount && !this.tetris) {
					console.info("Tetris mode");
					this.tetris = true;
					$rootScope.$apply();
				}
			},

			wifisignal: {
				signalstrength: {
					0: 'good',
					40: 'medium',
					60: 'weak',
					80: 'none',
				}
			},
		};

		console.log("config:", cfg);
		window.cfg = cfg;
		return cfg;
	});
});
