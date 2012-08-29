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

// Input Shortcurt definition
var shortcuts = [];
shortcuts[112] =  0;
shortcuts[113] =  26;
shortcuts[114] =  41;
shortcuts[115] =  45;
shortcuts[116] =  60;
shortcuts[117] =  81;
shortcuts[118] =  85;
shortcuts[119] =  100;
shortcuts[120] =  function(entry, callback) {
	var leg = entry.getParent();
	var player = entry.getLastPlayer();
	var left = leg.getPlayerScore(player);

	var $input = $("#"+leg.getInputPlayerId(player));
	var value = $input.val();
	
	if (isInteger(value)) {
		var val = parseInt(value, 10);
		var score = (left - val);
		entry.processValue(score,callback);
	} else {
		entry.processValue(value, callback);
	}
};
shortcuts[121] =  function(entry, callback) { processFinish(1,entry, callback); };
shortcuts[122] =  function(entry, callback) { processFinish(2,entry, callback); };
shortcuts[123] =  function(entry, callback) { processFinish(3,entry, callback); };

// Finish
var processFinish = function(nbDart, entry, callback) {
	var leg = entry.getParent();
	var player = entry.getLastPlayer();
	var $input = $("#"+leg.getInputPlayerId(player));
	var left = leg.getPlayerScore(player);

	if (couldFinish(left, nbDart)) {
		$input.parent().removeClass("error").removeAttr("title").tooltip("destroy");
		entry.handleNewInput("win", left, callback);
	} else {
		// handle error
		$input.val(left);
		$input.parent().addClass("error").attr("title","Cheater !").tooltip({
			placement : "bottom"
		}).tooltip("show");
	}
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
var validateInputX01 = function(entry,input, score, callback) {
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
				getNbDart(score, function(nbDart) {
					entry.nbDart = nbDart;
					switch(entry.nbDart) {
						case 0:
							status = "broken";
							break;
						case 1:
						case 2:
						case 3:
							status = "win";
							break;
						default:
							status = null;
							break;
					}
					// Go ahead
					entry.handleNewInput(status, val, callback);
				});
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
var getNbDart = function(score, func) {
	var $defaultButton = null;

	var $btn;
	var btns = ["#btnThreeDarts", "#btnTwoDarts", "#btnOneDart"];

	$btn = $(btns[0]);
	$btn.unbind("click").click(function() { $("#nbDartDialog").modal("hide"); func(3); });
	if (couldFinish(score,3)) {
		$btn.removeAttr("disabled");
		$defaultButton = $btn;
	} else {
		$btn.attr("disabled", "disabled");
	}

	$btn = $(btns[1]);
	$btn.unbind("click").click(function() { $("#nbDartDialog").modal("hide"); func(2); });
	if (couldFinish(score,2)) {
		$btn.removeAttr("disabled");
		$defaultButton = $btn;
	} else {
		$btn.attr("disabled", "disabled");
	}

	$btn = $(btns[2]);
	$btn.unbind("click").click(function() { $("#nbDartDialog").modal("hide"); func(1); });
	if (couldFinish(score,1)) {
		$btn.removeAttr("disabled");
		$defaultButton = $btn;
	} else {
		$btn.attr("disabled", "disabled");
	}

	// Broken
	$("#btnBroken").unbind("click").click(function() { $("#nbDartDialog").modal("hide"); func(0); });

	// Handle shortcuts
	$("#nbDartDialog .btn").keydown(function(e) {
		var key = e.which;
		switch(key) {
			case 48:
			case 96:
				$("#btnBroken").click();
				break;
			case 49:
			case 97:
				if (couldFinish(score,1)) $("#btnOneDart").click();
				break;
			case 50:
			case 98:
				if (couldFinish(score,2)) $("#btnTwoDarts").click();
				break;
			case 51:
			case 99:
				if (couldFinish(score,3)) $("#btnThreeDarts").click();
				break;
			default:
				return true;
		}
		e.preventDefault();
		return false;
	});
	// Open Dialog
	$("#nbDartDialog").on("shown", function() {
		$defaultButton.focus();
	}).modal("show");
};

// Could finish
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