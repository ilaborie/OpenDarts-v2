/*
   Copyright 2012 Igor Laborie

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
// Define stats
/** Keys
	count60, count100, count140, count180,
	plus60, plus100, plus140,
	avgDart, avg3Dart,
	avgLeg, bestLeg,
	bestOut, OutOver100,
	totalScore, totalDart,
*/
var normalSorter = function(a, b) {
	var result;
	if ((a===null || isNaN(a)) && (b===null || isNaN(b))) {
		result = NaN;
	} else if (b===null || isNaN(b)) {
		result = 1;
	} else if (a===null || isNaN(a)) {
		result = -1;
	} else {
		result =  (a - b);
	}
	return result;
};
var reverseSorter = function(a, b) {
	var result;
	if ((a===null || isNaN(a)) && (b===null || isNaN(b))) {
		result = NaN;
	} else if (b===null || isNaN(b)) {
		result = 1;
	} else if (a===null || isNaN(a)) {
		result = -1;
	} else {
		result =  (b - a);
	}
	return result;
};


x01.stats = {
	game: {
		title: "label.game",
		key: "gameStats",
		contents: {
			count60: { label: "stats60", sorter: normalSorter, display:true},
			count100: { label: "stats100", sorter: normalSorter, display:true},
			count140: { label: "stats140", sorter: normalSorter, display:true},
			count180: { label: "stats180", sorter: normalSorter, display:true},
			plus60: { label: "stats60plus", sorter: normalSorter, display:true},
			plus100: { label: "stats100plus", sorter: normalSorter, display:true},
			plus140: { label: "stats140plus", sorter: normalSorter, display:true},
			bestOut: { label: "statsbestout", sorter: normalSorter, display:true},
			avgDart: { label: "statsavg", sorter: normalSorter, display:true},
			avg3Dart: { label: "statsavg3", sorter: normalSorter, display:true},
			avgLeg: { label: "statsavgleg", sorter: reverseSorter, display:true},
			bestLeg: { label: "statsbestleg", sorter: reverseSorter, display:true},

			zone0: { label: "statsZone0", sorter: normalSorter},
			zone1: { label: "statsZone1", sorter: normalSorter},
			zone2: { label: "statsZone2", sorter: normalSorter},
			zone3: { label: "statsZone3", sorter: normalSorter},
			zone4: { label: "statsZone4", sorter: normalSorter},
			zone5: { label: "statsZone5", sorter: normalSorter},
			zone6: { label: "statsZone6", sorter: normalSorter},
			zone7: { label: "statsZone7", sorter: normalSorter},
			zone8: { label: "statsZone8", sorter: normalSorter},
			zone9: { label: "statsZone9", sorter: normalSorter},
			zone10: { label: "statsZone10", sorter: normalSorter},
			zone11: { label: "statsZone11", sorter: normalSorter},
			zone12: { label: "statsZone12", sorter: normalSorter},
			zone13: { label: "statsZone13", sorter: normalSorter},
			zone14: { label: "statsZone14", sorter: normalSorter},
			zone15: { label: "statsZone15", sorter: normalSorter},
			zone16: { label: "statsZone16", sorter: normalSorter},
			zone17: { label: "statsZone17", sorter: normalSorter}
		}
	},
	set: {
		title: "label.set",
		key: "setStats",
		contents: {
			avgDart: { label: "statsavg", sorter: normalSorter, display:true},
			avg3Dart: { label: "statsavg3", sorter: normalSorter, display:true},
			avgLeg: { label: "statsavgleg", sorter: reverseSorter, display:true},
			bestLeg: { label: "statsbestleg", sorter: reverseSorter, display:true}
		}
	},
	leg: {
		title: "label.leg",
		key: "letStats",
		contents: {
			avgDart: { label: "statsavg", sorter: normalSorter, display:true},
			avg3Dart: { label: "statsavg3", sorter: normalSorter, display:true}
		}
	}
};


//////////////////
// Database
var x01Stats = {
	db: {
		open: function() {},
		clear: function()	{
			// Clear
			sessionStorage.clear();
		},
		addStatsEntryX01: function(statEntry, callback) {
			// Add
			var key = "x01Stats-" + statEntry.timestamp;
			sessionStorage.setItem(key, JSON.stringify(statEntry));
			callback();
		},
		deleteStatsEntryX01: function(id, callback) {
			// Delete
			var key = "x01Stats-" + id;
			sessionStorage.removeItem(key);
			callback();
		}
	}
};

// Open
x01Stats.db.open();

// Game Stats
x01Stats.db.getPlayerStats = function(game, set, leg, player, callback)	{
	var count60 = 0;
	var count100 = 0;
	var count140 = 0;
	var count180 = 0;

	var plus60 = 0;
	var plus100 = 0;
	var plus140 = 0;
	
	var avgDart = 0;
	var avg3Dart = 0;

	var countLeg = 0;
	var winLeg = 0;
	var bestLeg;
	var avgLeg = 0;

	var bestOut;
	var totalScore = 0;
	var totalDart = 0;

	var setTotalScore = 0;
	var setTotalDart = 0;
	var setCountLeg = 0;
	var setWinLeg = 0;
	var setBestLeg;

	var legTotalScore = 0;
	var legTotalDart = 0;

	var zone0 = 0;
	var zone1 = 0;
	var zone2 = 0;
	var zone3 = 0;
	var zone4 = 0;
	var zone5 = 0;
	var zone6 = 0;
	var zone7 = 0;
	var zone8 = 0;
	var zone9 = 0;
	var zone10 = 0;
	var zone11 = 0;
	var zone12 = 0;
	var zone13 = 0;
	var zone14 = 0;
	var zone15 = 0;
	var zone16 = 0;
	var zone17 = 0;

	for (var i=0; i< sessionStorage.length; i++) {
		var key = sessionStorage.key(i);
		if (key!==null && key.startsWith("x01Stats-")) {
			try {
				var entry = JSON.parse(sessionStorage.getItem(key));
				if ((game === entry.game) && (player.uuid === entry.player)) {
					var score = entry.score;
					var nbDarts = entry.nbDarts;

					totalScore +=  score;
					totalDart += nbDarts;

					if (set === entry.set) {
						setTotalScore += score;
						setTotalDart += nbDarts;
					}

					if (leg === entry.leg) {
						legTotalScore += score;
						legTotalDart += nbDarts;
					}

					// Counts
					switch(score) {
						case 60 : count60++; break;
						case 100 : count100++; break;
						case 140 : count140++; break;
						case 180 : count180++; break;
					}

					// Range
					plus60 += incrRange(score,60,100);
					plus100 += incrRange(score,100,140);
					plus140 += incrRange(score,140,181);

					zone0 += incrRange(score, 0, 10);
					zone1 += incrRange(score, 10, 20);
					zone2 += incrRange(score, 20, 30);
					zone3 += incrRange(score, 30, 40);
					zone4 += incrRange(score, 40, 50);
					zone5 += incrRange(score, 50, 60);
					zone6 += incrRange(score, 60, 70);
					zone7 += incrRange(score, 70, 80);
					zone8 += incrRange(score, 80, 90);
					zone9 += incrRange(score, 90, 100);
					zone10 += incrRange(score, 100, 110);
					zone11 += incrRange(score, 110, 120);
					zone12 += incrRange(score, 120, 130);
					zone13 += incrRange(score, 130, 140);
					zone14 += incrRange(score, 140, 150);
					zone15 += incrRange(score, 150, 160);
					zone16 += incrRange(score, 160, 170);
					zone17 += incrRange(score, 170, 181);

					// Win
					if (entry.status==="win") {
						winLeg++;
						var legNbDarts = entry.legNbDarts;
						// count
						countLeg += entry.legNbDarts;
						// best out
						if ( (typeof bestOut === "undefined") || ((typeof bestOut === "number") && (score > bestOut))) {
							bestOut = score;
						}
						// best Leg
						if ( ((typeof bestLeg === "undefined") && (typeof legNbDarts === "number")) || ((typeof bestLeg === "number") && (legNbDarts < bestLeg))) {
							bestLeg = legNbDarts;
						}

						if (set === entry.set) {
							setWinLeg++;
							setCountLeg+= entry.legNbDarts;
							if ( (( typeof setBestLeg === "undefined") && (typeof legNbDarts === "number")) || ((typeof setBestLeg === "number") && (legNbDarts < setBestLeg))) {
								setBestLeg = legNbDarts;
							}
						}
					}
				}
			} catch (e) {
				console.log(e);
			}
		}
	}

	avgDart = (totalScore/totalDart);
	avg3Dart = (avgDart * 3);
	avgLeg = (countLeg / winLeg);

	var gameStats =  {
		count60: count60,
		count100: count100,
		count140: count140,
		count180: count180,
		plus60: plus60,
		plus100: plus100,
		plus140: plus140,
		avgDart: isNaN(avgDart)?"-":avgDart.toFixed(1),
		avg3Dart: isNaN(avgDart)?"-":avg3Dart.toFixed(1),
		avgLeg: isNaN(avgLeg)?"-":avgLeg.toFixed(1),
		bestLeg: (typeof bestLeg==="number")?bestLeg:"-",
		bestOut: (typeof bestOut==="number")?bestOut:"-",

		zone0: zone0,
		zone1: zone1,
		zone2: zone2,
		zone3: zone3,
		zone4: zone4,
		zone5: zone5,
		zone6: zone6,
		zone7: zone7,
		zone8: zone8,
		zone9: zone9,
		zone10: zone10,
		zone11: zone11,
		zone12: zone12,
		zone13: zone13,
		zone14: zone14,
		zone15: zone15,
		zone16: zone16,
		zone17: zone17
	};

	var setAvgDart = (setTotalScore/setTotalDart);
	var setAvg3Dart = (setAvgDart * 3);
	var setAvgLeg = (setCountLeg/setWinLeg);

	var setStats =  {
		avgDart: isNaN(setAvgDart)?"-":setAvgDart.toFixed(1),
		avg3Dart: isNaN(setAvgDart)?"-":setAvg3Dart.toFixed(1),
		avgLeg: isNaN(setAvgLeg)?"-":setAvgLeg.toFixed(1),
		bestLeg: (typeof setBestLeg==="number")?setBestLeg:"-"
	};

	var legAvgDart = (legTotalScore/legTotalDart);
	var legAvg3Dart = (legAvgDart * 3);

	var legStats =  {
		avgDart: isNaN(legAvgDart)?"-":legAvgDart.toFixed(1),
		avg3Dart: isNaN(legAvgDart)?"-":legAvg3Dart.toFixed(1)
	};

	return callback({
		gameStats: gameStats,
		setStats: setStats,
		legStats: legStats
	});
};


var incrRange = function(score, min, max) {
	if (score>=min && score<max) {
		return 1;
	} else {
		return 0;
	}
};

////////////////////////////////////////

var getStatLabel = function(obj, key) {
	for (var skey in obj.contents) {
		if (skey === key) {
			return msg.get(obj.contents[skey].label);
		}
	}
	return " ??? ";
};

var getStatsDisplayValue = function(value) {
	if (isNaN(value)) {
		return " - ";
	} else {
		return value;
	}
};

// Display one stats
var displayStats = function(stats) {
	return tmpl("StatsDiv", {
		stats: stats
	});
};

// Handle player stats
var handleStats= function(eltId,  json) {
	// Update Game stats
	updateStats(eltId, x01.stats.game.key, json.gameStats);
	updateStats(eltId, x01.stats.set.key, json.setStats);
	updateStats(eltId, x01.stats.leg.key, json.legStats);
};

var updateStats = function(eltId, parentKey, stats) {
	if (stats) {
		for(var key in stats) {
			$("#"+eltId+" ." + parentKey+ " ." + key).html(getStatsDisplayValue(stats[key]));
		}
	}
};

