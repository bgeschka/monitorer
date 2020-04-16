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
module.exports.command = "{prefix} smartctl -AH {disk} 2>&1";
module.exports.args = ["disk", "prefix", "health"];
module.exports.descr = `Test smart status on disk(e.g. /dev/sda) using smartctl,
if you're executing as non-root and require sudo to run,
enter \"sudo\" into the prefix field. For this to work, sudoers has to be setup for
your user using NOPASSWD: ALL
	

This tests checks if 
 - SMART overall-health self-assessment test result: PASSED
 - any non-informational vendor-smart attribute
   is below health(defaults to 20)
`;



function parseSmartAttributes(cmdout) {
	var lines = cmdout.split("\n");
	var startattributes = 0;
	var endattributes = 0;
	for (var i = 0; i < lines.length; i++) {
		if (lines[i].match(/Vendor Specific SMART Attributes with Thresholds:/)) {
			startattributes = i;
		}

		if (lines[i].length < 10)
			endattributes = i;
	}

	function parseSmartBase10(val) {
		return parseInt(val, 10);
	}

	function percRange(min, max, input) {
		var range = max - min;
		var correctedStartValue = input - min;
		var percentage = (correctedStartValue * 100) / range;
		return percentage;
	}

	return lines.slice(startattributes + 2, endattributes).filter(function(line) {
		return line.length > 1;
	}).map(function(line) {
		var parts = line.trim().split(/\s+/);
		return {
			id: parts[0],
			name: parts[1],
			flag: parts[2],
			value: parseSmartBase10(parts[3]),
			worst: parseSmartBase10(parts[4]),
			thresh: parseSmartBase10(parts[5]),
			type: parts[6],
			updated: parts[7],
			when_failed: parts[8],
			raw_value: parts[9]
		};
	}).filter(function(smartattribute) {
		return smartattribute.thresh != '000'; //skip only info
	}).map(function(smartattribute) {
		var health = percRange(smartattribute.thresh, parseSmartBase10("255"), smartattribute.value);
		smartattribute.health = health;
		return smartattribute;
	});
}


module.exports.parse = function (parsedresult, args) {
	var match = !!parsedresult.match(/SMART overall-health self-assessment test result: PASSED/);
	if(!match) return "0";

	var smartattributes = parseSmartAttributes(parsedresult);
	var lowest_smart_health = 100;
	smartattributes.forEach(function(smartattribute){
		if(smartattribute.health < lowest_smart_health)
			lowest_smart_health = smartattribute.health;
	});
	console.log("SMART_RESULT:", smartattributes);
	console.log("lowest_heatlh:", lowest_smart_health);
	return ""+lowest_smart_health.toFixed(2);
};

module.exports.bad = function (parsedresult, args) {
	if(!args.health) args.health = "20";
	var healthi = parseInt(args.health, 10);
        return (parseInt(parsedresult, 10) < healthi);
};

//module.exports.view = {
//	module: "ok"
//};
module.exports.view = {
	module: "gauge",
	bad : 0,
	max : 100,
	min : 0
};

