// Define stats
/** Keys
	count60, count100, count140, count180,
	plus60, plus100, plus140,
	avgDart, avg3Dart,
	avgLeg, bestLeg,
	bestOut, OutOver100,
	totalScore, totalDart,
*/
x01.stats = {
	game: {
		title: "Game",
		key: "gameStats",
		contents: [
			{ label: "60", key: "count60"},
			{ label: "100", key: "count100"},
			{ label: "140", key: "count140"},
			{ label: "180", key: "count180"},
			{ label: "60+", key: "plus60"},
			{ label: "100+", key: "plus100"},
			{ label: "Avg.", key: "avgDart"},
			{ label: "Avg.3", key: "avg3Dart"},
			{ label: "Avg Leg", key: "avgLeg"},
			{ label: "Best Leg", key: "bestLeg"},
			{ label: "Best Out", key: "bestOut"}
		]
	},
	set: {
		title: "Set",
		key: "setStats",
		contents: [
			{ label: "Avg.", key: "avgDart"},
			{ label: "Avg.3", key: "avg3Dart"},
			{ label: "Avg Leg", key: "avgLeg"},
			{ label: "Best Leg", key: "bestLeg"}
		]
	},
	leg: {
		title: "Leg",
		key: "letStats",
		contents: [
			{ label: "Avg.", key: "avgDart"},
			{ label: "Avg.3", key: "avg3Dart"}
		]
	}
};


//////////////////
// Database
var x01Stats = {};
window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;

if ('webkitIndexedDB' in window) {
  window.IDBTransaction = window.webkitIDBTransaction;
  window.IDBKeyRange = window.webkitIDBKeyRange;
}
x01Stats.indexedDB = {};
x01Stats.indexedDB.db = null;
x01Stats.indexedDB.onerror = function(e) {
  console.log(e);
};

x01Stats.indexedDB.open = function() {
	var request = indexedDB.open("StatsEntryX01");

	request.onsuccess = function(e) {
		var v = "1.0";
		x01Stats.indexedDB.db = e.target.result;
		var db = x01Stats.indexedDB.db;
		if (v!= db.version) {
			var setVrequest = db.setVersion(v);
			// onsuccess is the only place we can create Object Stores
			setVrequest.onfailure = x01Stats.indexedDB.onerror;
			setVrequest.onsuccess = function(e) {
				var store = db.createObjectStore("StatsEntryX01", {
					keyPath: "timestamp"
				});
				e.target.transaction.oncomplete = function() {
					console.log("StatsEntryX01 created!");
				};
			};
		} else {
			x01Stats.indexedDB.clear();
		}
	};

	request.onfailure = x01Stats.indexedDB.onerror;
};

// Clear
x01Stats.indexedDB.clear = function()	{
	var db = x01Stats.indexedDB.db;
	var trans = db.transaction(["StatsEntryX01"], "readwrite");
	var store = trans.objectStore("StatsEntryX01");

	// Get everything in the store;
	var request = store.clear();

	request.onsuccess = function(e) {
		console.log("StatsEntryX01 cleared !");
	};

	request.onerror = x01Stats.indexedDB.onerror;
};

// Add
x01Stats.indexedDB.addStatsEntryX01 = function(statEntry, callback) {
	var db = x01Stats.indexedDB.db;
	var trans = db.transaction(["StatsEntryX01"], "readwrite");
	var store = trans.objectStore("StatsEntryX01");

	var request = store.put(statEntry);

	trans.oncomplete = function(e) {
		console.log("StatsEntryX01 added");
		callback();
	};

	request.onerror = x01Stats.indexedDB.onerror;
};

// Delete
x01Stats.indexedDB.deleteStatsEntryX01 = function(id, callback) {
	var db = x01Stats.indexedDB.db;
	var trans = db.transaction(["StatsEntryX01"], "readwrite");
	var store = trans.objectStore("StatsEntryX01");

	var request = store.delete(id);

	trans.oncomplete  = function(e) {
		callback();
	};

	request.onerror = function(e) {
		x01Stats.indexedDB.onerror(e);
	};
};
// Open
x01Stats.indexedDB.open();

// Game Stats
x01Stats.indexedDB.getPlayerStats = function(game, set, leg, player, callback)	{
	console.log("Stats for " + player.getName());
	var db = x01Stats.indexedDB.db;
	var trans = db.transaction(["StatsEntryX01"], "readonly");
	var store = trans.objectStore("StatsEntryX01");

	// Get everything in the store
	var keyRange = IDBKeyRange.lowerBound(0);
	var cursorRequest = store.openCursor(keyRange);

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

	cursorRequest.onsuccess = function(e) {
		var result = e.target.result;
		if(!!result == false) {
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
		}
		// Check if valid Game/Player
		if ((game === result.value.game) && (player.uuid === result.value.player)) {
			var score = result.value.score;
			var nbDarts = result.value.nbDarts;

			totalScore +=  score;
			totalDart += nbDarts;

			if (set === result.value.set) {
				setTotalScore += score;
				setTotalDart += nbDarts;
			}

			if (leg === result.value.leg) {
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
			} else if (score>100 && score<140) {
				plus140++;
			}

			// Win
			if (result.value.status==="win") {
				winLeg++;
				leg = result.value.legNbDarts;
				// count
				countLeg += result.value.legNbDarts;
				// best out
				if (bestOut == "undefined" || ((typeof bestOut === "number") && (score > bestOut))) {
					bestOut = score;
				}
				// best Leg
				if ( ((bestLeg == "undefined") && (typeof leg === "number")) || ((typeof bestLeg === "number") && (leg < bestLeg))) {
					bestLeg = leg;
				}

				if (set === result.value.set) {
					setWinLeg++;
					setCountLeg+= result.value.legNbDarts;
					if ( ((setBestLeg == "undefined") && (typeof leg === "number")) || ((typeof setBestLeg === "number") && (leg < setBestLeg))) {
						setBestLeg = leg;
					}
				}
			}
		}

		result.continue();
	};

	cursorRequest.onerror = x01Stats.indexedDB.onerror;
};

////////////////////////////////////////

var getStatLabel = function(obj, key) {
	for (var i=0; i< obj.contents.length; i++) {
		if (obj.contents[i].key === key) {
			return obj.contents[i].label;
		}
	}
	return " ??? ";
};

// Display one stats
var displayStats = function(stats) {
	var $title = $("<h5/>").append(stats.title);
	var $stats = $("<div/>").addClass("row-fluid").addClass("statsEntries").addClass(stats.key);
	$.each(stats.contents, function(idx, stat) {
		var $st = $("<div/>").addClass("stat").addClass("span6")
			.append($("<label/>").append(stat.label))
			.append($("<span/>").append(" - ").addClass(stat.key));
		$stats.append($st);
	});
	return $("<div/>")
		.append($title)
		.append($stats);
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
			$("#"+eltId+" ." + parentKey+ " ." + key).html(stats[key]);
		}
	}
};

