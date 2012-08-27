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
	x01.currentGame = game;

	// Play
	$("#btnRun").unbind('click');
	$("#btnRun").removeClass("disabled").click(function() {
		x01.currentGame.next();
	});
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




// Validate Input
var validateInputX01 = function(entry,input, score) {
	var status = null;
	if (isInteger(input)) {
		var val = parseInt(input, 10);
		if (val<0) {
			status = "Try harder ! You can make a positive score.";
		} else if (val > 180 || val === 172 || val === 173 || val === 175 || val === 176 || val === 178 || val === 179) {
			status = "Cheater !";
		} else {
			if ((val > score) || (val === (score-1))) {
				status = "broken";
			} else if (val === score) {
				entry.nbDart = getNbDart(score);
				switch(entry.nbDart) {
					case 0:
						status = "broken";
						break;
					case 1:
					case 2:
					case 3:
						status = "win";
						break;
				}
			} else {
				status = "normal";
			}
		}
	} else {
		status = "Integer expected !";
	}
	return status;
};

// get NbDarts to finish
var getNbDart = function(score) {
	var nbDart = null;
		do {
			nbDart = prompt("Nb Dart to finish ? (0 for broken)");
			if (!isInteger(nbDart)) {
				nbDart = null;
			} else {
				nbDart = parseInt(nbDart, 10);
				if (nbDart<0 || nbDart>3 || (nbDart!==0 && !couldFinish(score, nbDart))) {
					nbDart = null;
				}
			}
		} while (nbDart===null);
	return nbDart;
};


var couldFinish = function (score, nbDart) {
	var result = false;

	if (nbDart === 1 ) {
		result = ((score % 2) === 0) && ((score == 50) || (score <= 40));
	} else {
		var base = ((nbDart - 1) * 60) + 39;
		var tab =  [base + 1, base + 2, base + 5, base + 8, base + 11];
		result = (score < base) || ($.inArray(score, tab)!==-1);
	}

	return result;
};