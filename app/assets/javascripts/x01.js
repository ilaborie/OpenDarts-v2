/**
 * Handel x01 Games
 */

// Status
var x01 =  {
	options :  {
		score: 501,
		players: [],
		nbSets: 1,
		nbLegs: 1
	},
	currentGame: null
};

// Show new X01
var showNewX01 = function() {
	// Show dialog with options

	// XXX options
	var newX01Options = $.extend({}, x01.options);
	// XXX Players
	newX01Options.players = [];
	newX01Options.players.push(getPlayer("Philou"));
	newX01Options.players.push(getPlayer("HAL"));

	// Create the new Game
	var game = new GameX01(newX01Options);

	// Start
	game.start();
};

// Display one stats
 var displayStats = function($elt, name, tab) {
	$elt.append($("<h5/>").append(name));
	var $stats = $("<ul>").addClass("nav-stats").addClass("row-fluid");
	$.each(tab, function(idx, stat) {
		var $st = $("<li/>").addClass("stat").addClass("span6")
			.append($("<label/>").append(stat))
			.append($("<span/>").append(120));
		$stats.append($st);
	});
	$elt.append($stats);
};

