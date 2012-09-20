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
	currentGame: null,
	finishedGames: []
};

// Scaffolding
var tuningSize = function() {
	var w = $(window).width();
	var h = $(window).height();

	// Resize table
	var diff = $(".score-left-container").height() + 3 * ($(".score-left").height());
	$(".leg .data").height(h - diff);
};

var isWideScreen = function () {
	var w = $(window).width();
	return (w>=980);
};

/**
 * Shortcut
 */
// Input Shortcurt definition
var shortcuts = [];
shortcuts[112] =  0;	// F1
shortcuts[113] =  26;	// F2
shortcuts[114] =  41;	// F3
shortcuts[115] =  45;	// F4
shortcuts[116] =  60;	// F5
shortcuts[117] =  81;	// F6
shortcuts[118] =  85;	// F7
shortcuts[119] =  100;	// F8
shortcuts[120] =  function(entry, callback) { // F9
	var leg = entry.getParent();
	var player = entry.getLastPlayer();
	var left = leg.getPlayerScore(player);

	var $input = $("#"+leg.getInputPlayerId(player));
	var value = $input.val();
	
	if (isInteger(value)) {
		var val = parseInt(value, 10);
		var score = (left - val);
		$input.val(score);
	}
	// Click on submit button
	$("#"+entry.getParent().getSubmitPlayer(player)).click();
};
shortcuts[121] =  function(entry, callback) { processFinish(1,entry, callback); }; // F10
shortcuts[122] =  function(entry, callback) { processFinish(2,entry, callback); }; // F11
shortcuts[123] =  function(entry, callback) { processFinish(3,entry, callback); }; // F12

// Finish
var processFinish = function(nbDart, entry, callback) {
	var leg = entry.getParent();
	var player = entry.getLastPlayer();
	var $input = $("#"+leg.getInputPlayerId(player));
	var left = leg.getPlayerScore(player);

	if (couldFinish(left, nbDart)) {
		$input.val(left);
		entry.nbDart = nbDart;
		// Click on submit button
		$("#"+entry.getParent().getSubmitPlayer(player)).click();
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
	$("#nbLeg").val(lastOption.nbLegs);
	$("#nbSet").val(lastOption.nbSets);

	if (lastOption.nbLegs>1) {
		$(".nbSet").show();
	} else {
		$(".nbSet").hide();
		$("#nbSet").val(1);
	}

	$("#nbLeg").on("input",function(e){
		var nbLeg  = parseInt($("#nbLeg").val(),10);
		if(nbLeg>1) {
			$(".nbSet").show();
		} else {
			$(".nbSet").hide();
			$("#nbSet").val(1);
		}
	});

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
	newX01Options.stats = x01.options.stats;

	// Create the new Game
	var game = new GameX01(newX01Options);
	
	// Start
	game.start();
	x01.currentGame = game;
	
	$("#newX01Dialog").unbind("hidden").on("hidden", function() {
		x01.currentGame.next();
	});
	$("#newX01Dialog").modal("hide");

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
		surname = "Computer";
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

// Validate Input
var analyseInputX01 = function(entry, value, score, callback) {
	if (!$.isNumeric(value)) {
		// Skip this input
		return;
	}
	var val = parseInt(value, 10);
	if (isNaN(val)) {
		// Skip this input
		return;
	} else if ((val > score) || (val === (score-1))) {
		callback("broken");
	} else if (val === score) {
		if ((typeof entry.nbDart === "number") && (entry.nbDart>0)) {
			callback("win", entry.nbDart);
		} else {
			getNbDart(val, callback);
		}
	} else {
		callback("normal");
	}
};

var validatePlayerThrow = function(event) {
	var $this = $(this);
	var value = $this.val();
	var status = validatePlayerValue(value);

	event.target.setCustomValidity(status);
};

var validatePlayerValue = function(value) {
	var status = "";
	if (value === "") {
		status = "No score ?";
	} else if (isNaN(value) || !$.isNumeric(value)) {
		status = "?";
	} else if (isInteger(value)) {
		var val = parseInt(value, 10);
		if (isNaN(val)) {
			status = "?";
		} else if (val<0) {
			status = "Try harder ! You can make a positive score.";
		} else if (val > 180 || val === 172 || val === 173 || val === 175 || val === 176 || val === 178 || val === 179) {
			status = "Sly !";
		} else {
			status = "";
		}
	} else {
		status = "Integer expected !";
	}
	return status;
};

// get NbDarts to finish
var getNbDart = function(score, func) {
	//console.log("getNbDart for " + score);
	var $defaultButton = null;

	var callback = function(event) {
		$("#nbDartDialog").modal("hide");
		func(event.data.status, event.data.nbDart);
	};

	var btns = ["#btnThreeDarts", "#btnTwoDarts", "#btnOneDart"];
	var $btn;
	for (var i=0; i<btns.length; i++) {
		$btn = $(btns[i]);
		$btn.off("click").on("click", {
			status: "win",
			nbDart: (3-i)
		}, callback);

		if (couldFinish(score,3-i)) {
			$btn.removeAttr("disabled");
			$defaultButton = $btn;
		} else {
			$btn.attr("disabled", "disabled");
		}
	}
	// Broken
	$("#btnBroken").off("click").on("click",{
		status: "broken"
	}, callback);

	// Open Dialog
	$("#nbDartDialog").off("shown").on("shown", function() {
		$defaultButton.focus();

		// Handle shortcuts
		$("#nbDartDialog .btn").off("keypress").on("keypress",function(e) {
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