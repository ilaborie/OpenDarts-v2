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
			count60: { label: "stats60", sorter: normalSorter},
			count100: { label: "stats100", sorter: normalSorter},
			count140: { label: "stats140", sorter: normalSorter},
			count180: { label: "stats180", sorter: normalSorter},
			plus60: { label: "stats60plus", sorter: normalSorter},
			plus100: { label: "stats100plus", sorter: normalSorter},
			plus140: { label: "stats140plus", sorter: normalSorter},
			bestOut: { label: "statsbestout", sorter: normalSorter},
			avgDart: { label: "statsavg", sorter: normalSorter},
			avg3Dart: { label: "statsavg3", sorter: normalSorter},
			avgLeg: { label: "statsavgleg", sorter: reverseSorter},
			bestLeg: { label: "statsbestleg", sorter: reverseSorter}
		}
	},
	set: {
		title: "label.set",
		key: "setStats",
		contents: {
			avgDart: { label: "statsavg", sorter: normalSorter},
			avg3Dart: { label: "statsavg3", sorter: normalSorter},
			avgLeg: { label: "statsavgleg", sorter: reverseSorter},
			bestLeg: { label: "statsbestleg", sorter: reverseSorter}
		}
	},
	leg: {
		title: "label.leg",
		key: "letStats",
		contents: {
			avgDart: { label: "statsavg", sorter: normalSorter},
			avg3Dart: { label: "statsavg3", sorter: normalSorter}
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
					if (score>60 && score<100) {
						plus60++;
					} else if (score>100 && score<140) {
						plus100++;
					} else if (score>140) {
						plus140++;
					}

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
		bestOut: (typeof bestOut==="number")?bestOut:"-"
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

