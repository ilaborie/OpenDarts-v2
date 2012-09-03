
// Define stats
/** Keys
	count60, count100, count140, count180,
	plus60, plus100, plus140,
	avgDart, avg3Dart,
	avgLeg, bestLeg,
	bestOut, OutOver100,
	totalScore, totalDart,
*/


x01.options.stats = {
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
			{ label: "Best Leg", key: "bestLeg"}
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

// Display one stats
 var displayStats = function($elt, stats) {
	$elt.append($("<h5/>").append(stats.title));
	var $stats = $("<ul>").addClass("nav-stats").addClass("row-fluid").addClass(stats.key);
	$.each(stats.contents, function(idx, stat) {
		var $st = $("<li/>").addClass("stat").addClass("span6")
			.append($("<label/>").append(stat.label))
			.append($("<span/>").append(" - ").addClass(stat.key));
		$stats.append($st);
	});
	$elt.append($stats);
};

// Handle player stats
var handleStats= function(eltId,  json) {
	// Update Game stats
	updateStats(eltId, x01.options.stats.game.key, json.gameStats);
	updateStats(eltId, x01.options.stats.set.key, json.setStats);
	updateStats(eltId, x01.options.stats.leg.key, json.legStats);
};

var updateStats = function(eltId, parentKey, stats) {
	$.each(stats, function(idx, st) {
		$("#"+eltId+" ." + parentKey+ " ." + st.key).html(st.value);
	});
};

