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
/**
 * Handel x01 Games
 */

var Philou = players.getPlayerByNameSurname("Philou", "The Failure");
var HAL = players.getPlayerByNameSurname("Ishur #7","20");
HAL.com = true;
HAL.comLevel = 7;
players.update(HAL);

// Status
var x01 =  {
	options :  {
		score: 501,
		players: [Philou, HAL],
		nbSets: 1,
		nbLegs: 1
	},
	currentGame: null,
	finishedGames: [],
	hasLast: function() {
		return (localStorage.getItem("x01LastOptions")!==null);
	},
	getLast: function() {
		var opt = localStorage.getItem("x01LastOptions");
		if (opt!==null) {
			var o = JSON.parse(opt);
			var option = {
				score: o.score,
				players: [],
				nbSets: o.nbSets,
				nbLegs: o.nbLegs
			};
			for (var i=0; i <o.players.length; i++) {
				option.players.push(players.getPlayer(o.players[i]));
			}
			return option;
		} else {
			return null;
		}
	},
	setLast: function(option) {
		var opt = {
			score: option.score,
			players: [],
			nbSets: option.nbSets,
			nbLegs: option.nbLegs
		};
		for (var i=0; i< option.players.length; i++) {
			opt.players.push(option.players[i].uuid);
		}

		localStorage.setItem("x01LastOptions", JSON.stringify(opt));
	}
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
var showNewX01 = function(event) {
	if (x01.currentGame) {
		x01.currentGame.close(function() {
			showNewX01(event);
		});
		event.preventDefault();
		return false;
	}

	// Cleaning the space
	$(".hero-unit").hide();
	$("#history").hide();
	$("#game").empty();

	// Show dialog with options
	var lastOption;
	if (x01.currentGame) {
		lastOption = x01.currentGame.getOption();
	} else {
		lastOption = x01.getLast();
		if (lastOption === null) {
			lastOption = x01.options;
		}
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

	// Display Players
	$("#newX01Dialog .players tbody").empty();
	var player;
	var len = lastOption.players.length;
	var $row;
	for (var i=0; i< len; i++) {
		player = lastOption.players[i];
		$row = getPlayerRow(i, player);
		$("#newX01Dialog .players tbody").append($row);
	}
	updatePlayersTableField();
	$("#btnX01AddPlayer").unbind("click").click(function() {
		selectPlayer(function(player) {
			var nbPlayer = $("#newX01Dialog .players tbody tr").size();
			$row = getPlayerRow(nbPlayer-1, player);
			$("#newX01Dialog .players tbody").append($row);
			updatePlayersTableField();
		});
	});
	$("#btnX01CreatePlayer").unbind("click").click(function() {
		createPlayer(function(player) {
			var nbPlayer = $("#newX01Dialog .players tbody tr").size();
			$row = getPlayerRow(nbPlayer-1, player);
			$("#newX01Dialog .players tbody").append($row);
			updatePlayersTableField();
		});
	});

	// Bind Click
	$("#newX01Dialog form").unbind("submit").submit(launchX01);

	// Show Dialog
	$("#newX01Dialog").show();
	$("#startScore").focus();

	event.preventDefault();
	return false;
};

// Set player in dialog
var getPlayerRow = function(idx, player) {
	var row = tmpl("PlayerTableRow", {
		player: player,
		position: (idx+1)
	});
	return row;
};

var updatePlayersTableField = function() {
	var $rows = $("#newX01Dialog .players tbody tr");
	var len = $rows.size();
	var $tr;
	$rows.each(function(idx, tr){
		$tr = $(tr);
		$tr.find("td:eq(0)").empty().append(idx+1);
		if (idx===0) {
			$tr.find("a.up").hide();
		} else {
			$tr.find("a.up").show();
		}
		if (idx===(len-1)) {
			$tr.find("a.down").hide();
		} else {
			$tr.find("a.down").show();
		}
		// Bind remove
		$tr.find("a.remove").click(function(e) {
			var $row = $(this).parent().parent();
			$row.remove();
			updatePlayersTableField();
			e.preventDefault();
			return false;
		});
		// Bind up
		$tr.find("a.up").click(function(e) {
			var $row = $(this).parent().parent();
			$row.prev().before($row);
			updatePlayersTableField();
			e.preventDefault();
			return false;
		});
		// Bind down
		$tr.find("a.down").click(function(e) {
			var $row = $(this).parent().parent();
			$row.next().after($row);
			updatePlayersTableField();
			e.preventDefault();
			return false;
		});
	});
};

// Quick Launch
var quickLaunch = function(event) {
	$("#newX01Dialog").hide();
	$(".hero-unit").hide();
	$("#history").hide();
	var options = x01.getLast();

	var game = new GameX01(options);
	if (x01.currentGame) {
		x01.currentGame.close(function() {
			game.start();
		});
	} else {
		// Start
		game.start();
	}
	
	event.preventDefault();
	return false;
};

var checkQuickLaunch= function() {
	if (x01.hasLast()) {
		$("#btnQuick").show();
		$("#btnQuick").unbind("click").click(quickLaunch);
	}
};
checkQuickLaunch();

// Launch x01
var launchX01 = function(event) {
	// new option
	var newX01Options = {};
	newX01Options.score = parseInt($("#startScore").val(),10);
	newX01Options.nbSets = parseInt($("#nbSet").val(),10);
	newX01Options.nbLegs = parseInt($("#nbLeg").val(),10);

	// Players
	newX01Options.players = [];

	var tmp = [];
	$("#newX01Dialog .playersTable tbody tr").each(function(idx, tr){
		var id = $(tr).attr("id");
		var p = players.getPlayer(id);
		if ($.inArray(id, tmp)!==-1) {
			p.uuid = p.uuid+ "_" + idx;
		}
		tmp.push(p.uuid);
		newX01Options.players.push(p);
	});

	if (newX01Options.players.length<2) {
		createNotice({
			kind: "error",
			message: "<strong>Hey!</strong> You need at least 2 players !"
		});
		return;
	}
	$("#newX01Dialog").hide();
	newX01Options.stats = x01.options.stats;

	// QuickLaunch
	x01.setLast(newX01Options);
	
	// Create the new Game
	var game = new GameX01(newX01Options);
	checkQuickLaunch();

	// Start
	game.start();
	
	event.preventDefault();
	return false;
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

var isSpecial = function(left) {
	return (left%111===0);
}