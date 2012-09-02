/**
 * Handel x01 Games
 */

// Status
var x01 =  {
	options :  {
		score: 501,
		players: [getPlayer("Philou"), getPlayer("HAL")],
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
		entry.nbDart = nbDart;
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
	var lastOption;
	if (x01.currentGame) {
		lastOption = x01.currentGame.getOption();
	} else {
		lastOption = x01.options;
	}

	// Set Options
	$("#startScore").val(lastOption.score);
	$("#nbSet").val(lastOption.nbSets);
	$("#nbLeg").val(lastOption.nbLegs);

	showPlayerDialog("p1", lastOption.players[0]);
	showPlayerDialog("p2", lastOption.players[1]);

	// Bind Click
	$("#newX01Dialog form").unbind("submit").submit(launchX01);

	// Show Dialog
	$("#newX01Dialog").unbind("shown").on("shown",function() {
		$("#startScore").focus();
	});
	$("#newX01Dialog").modal("show");
};

// Launch x01
var launchX01 = function(event) {
	// new option
	var newX01Options = {};
	newX01Options.score = parseInt($("#startScore").val(),10);
	newX01Options.nbSets = parseInt($("#nbSet").val(),10);
	newX01Options.nbLegs = parseInt($("#nbLeg").val(),10);

	// Players
	newX01Options.players = [];
	newX01Options.players.push(getPlayer("p1"));
	newX01Options.players.push(getPlayer("p2"));

	// Create the new Game
	var game = new GameX01(newX01Options);
	$("#newX01Dialog").modal("hide");
	
	// Start
	game.start();
	x01.currentGame = game;
	game.next();

	event.preventDefault();
	return false;
};

// Set player in dialog
var showPlayerDialog = function(prefix, player) {
	$("#" + prefix + "Name").val(player.name);
	$("#" + prefix + "Surname").val(player.surname);

	// Dynamic Player
	$("#"+prefix+"IsComputer").unbind("change").change(function() {
		if ($(this).is(":checked")) {
			$("." + prefix + " .playerComputer").show();
			$("." + prefix + " .humanPlayer").hide();
		} else {
			$("." + prefix + " .playerComputer").hide();
			$("." + prefix + " .humanPlayer").show();
		}
	});

	$("#"+prefix+"Level").change(function() {
		$("#"+prefix+"LevelDisplay").html($("#"+prefix+"Level").val());
	});

	// Is computer
	if (player.com) {
		$("." + prefix + " .playerComputer").show();
		$("." + prefix + " .humanPlayer").hide();
		
		$("#"+prefix+"IsComputer").attr("checked",true);
		
		// Target
		$("#"+prefix+"Target-"+player.comTarget).attr("checked", true);

		// Level
		$("#"+prefix+"Level").val(player.comLevel);
		$("#"+prefix+"LevelDisplay").html(player.comLevel);
	} else {
		$("." + prefix + " .playerComputer").hide();
		$("." + prefix + " .humanPlayer").show();

		$("#"+prefix+"IsComputer").removeAttr("checked");
		$("#"+prefix+"Target-20").attr("checked", true);
		$("#"+prefix+"Level").val("7");
		$("#"+prefix+"LevelDisplay").html("7");
	}
};

// Load player from dialog
var getPlayer = function(prefix) {
	var name;
	var surname;

	var isComputer = $("#"+prefix+"IsComputer").is(":checked");
	if (isComputer) {
		name = "Ishur #" + $("#"+prefix+"Level").val();
		surname = "The Computer";
	} else {
		name = $("#" + prefix + "Name").val();
		surname = $("#" + prefix + "Surname").val();

		if (!name) {
			name = "Mr. X";
		}
	}
	
	// Create player
	var p = new Player(name, surname);

	// Computer field
	if (isComputer) {
		p.com = true;
		p.comLevel = $("#"+prefix+"Level").val();
		p.comTarget = $("#newX01Dialog input[name="+prefix+"Target]:checked").val();
	}
	return p;
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
var validateInputX01 = function(entry, input, score, callback) {
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
				getNbDart(score, callback);
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