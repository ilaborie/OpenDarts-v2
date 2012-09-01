/**
 * EntryX01
 */
function EntryX01(parentLeg, index) {
	this.uuid = createUuid();
	this.index = index;
	var parent = parentLeg;

	var players = parent.getPlayers();
	var lastPlayer = null;

	var playerScore = {};
	var playerLeft = {};
	var playerStatus = {}; // normal, win, broken
	this.nbDart = null;
	var winner = null;

	for (var i=0; i<players.length; i++) {
		var p = players[i];
		playerLeft[p.uuid] = parent.getPlayerScore(p);
	}

	// EntryX01 next
	this.next = function(callback) {
		// Next player
		if (lastPlayer === null) {
			// First player
			lastPlayer = players[0];
		} else {
			$("#"+parent.getInputPlayerId(lastPlayer)).attr("disabled","disabled");

			// Check
			if (playerStatus[lastPlayer.uuid]!==null) {
				// Lookup next player
				for(var i=0; i<players.length; i++) {
					if (players[i]===lastPlayer) {
						lastPlayer = players[i+1];
						break;
					}
				}
			}
		}
		
		// Call score (handle input, status)
		this.askNewInput(callback);
	};
	// Ask an Input
	this.askNewInput = function(callback) {
		var $input = $("#"+parent.getInputPlayerId(lastPlayer));
		if (lastPlayer.com) {
			// Ask Computer
			this.askComputerPlayer($input, callback);
		} else {
			// ask human
			this.askHumanPlayer($input, callback);
		}
	};

	// askComputerPlayer
	this.askComputerPlayer = function($input, callback) {
		var entry = this;
		if ($(".modal-backdrop").length>0) {
			setTimeout(function(){
				entry.askComputerPlayer($input, callback);
			},500);
			return;
		}
		var score = parent.getPlayerScore(lastPlayer);
		$input.focus();

		// Open Dialog
		var msg = lastPlayer.getName() + " require " + score;
		$("#computerThrowDialog .done").empty();
		$("#computerThrowDialog .wished").empty();
		$("#computerThrowDialog h3").html(msg);
		$("#computerThrowDialog").modal("show");

		// Call to server
		$.postJSON("/x01/ComputerPlayer", {
			left: score,
			lvl: lastPlayer.comLevel,
			type: lastPlayer.comTarget
		}, function(json) {
			entry.nbDart = json.darts.length;
			entry.showDart(entry, json, 0, callback);
		});
	};

	// Show Computer darts
	this.showDart = function(entry, json, idx, callback) {
		var dart = json.darts[idx];
		if ($.isPlainObject(dart)) {
			var $badgeWished = $("<div/>").addClass("span4").append(dart.wished);
			$("#computerThrowDialog .wished").append($badgeWished);

			var $badgeDone = $("<div/>").addClass("span4").addClass(dart.color).append(dart.done);
			$("#computerThrowDialog .done").append($badgeDone);

			setTimeout(function() {
				entry.showDart(entry, json, idx+1, callback);
			},1000);
		} else {
			setTimeout(function() {
				$("#computerThrowDialog").unbind("hidden").on("hidden",function() {
					entry.handleNewInput(json.status, json.score, callback);
				}).modal("hide");
			},1000);
		}
	};

	// askHumanPlayer
	this.askHumanPlayer = function($input, callback) {
		var entry = this;
		$input.removeAttr("disabled","disabled").focus();
		// Ask Human
		$input.blur(function(e) {
			// TODO Tab
			//entry.processInput(e, callback);
			e.preventDefault();
			return false;
		});
		// Enter
		$input.keypress(function(e) {
			var k = e.which;
			if (k===13) { // Enter
				entry.processInput(e, callback);
				e.preventDefault();
				return false;
			}
			return true;
		});
		// Shortcuts
		$input.keyup(function(e) {
			var k = e.which;
			var fun = shortcuts[k];
			if ($.isFunction(fun)) {
				fun(entry,callback);
				e.preventDefault();
				return false;
			} else if (isInteger(fun)) {
				var val = parseInt(fun,10);
				entry.processValue(val,callback);
				e.preventDefault();
				return false;
			}
			return true;
		});
	};

	// Process Input
	this.processInput = function(e, callback){
		var $input = $("#"+parent.getInputPlayerId(lastPlayer));
				
		var value = $input.val();
		this.processValue(value, callback);
	};

	// Process value
	this.processValue = function(value,  callback) {
		var left = playerLeft[lastPlayer.uuid];
		var $input = $("#"+parent.getInputPlayerId(lastPlayer));
		$input.parent().removeClass("error").removeAttr("title").tooltip("destroy");

		var status = validateInputX01(this, value, left, callback);
		if (status==="normal" || status==="win" || status==="broken") {
			// OK, let's go
			$input.unbind("keypress").unbind("blur").unbind("keyup");
			this.handleNewInput(status, parseInt(value, 10), callback);
		} else if (status !== null){
			// handle error
			$input.parent().addClass("error").attr("title",status).tooltip({
				placement : "bottom"
			}).tooltip("show");
		}
	};

	// Handle new input
	this.handleNewInput = function(status, value, callback) {
		// Clear Input
		$("#"+parent.getInputPlayerId(lastPlayer))
			.attr("disabled","disabled").val("");

		// Destroy tooltip & modal
		$(".tooltip").remove();
		//$(".modal-backdrop").remove();

		// update left, status, score
		var left = playerLeft[lastPlayer.uuid];
		if (status !== "broken") {
			left -= value;
		}

		playerScore[lastPlayer.uuid] = value;
		playerLeft[lastPlayer.uuid] = left;
		playerStatus[lastPlayer.uuid] =status;

		if(status === "win") {
			winner = lastPlayer;
		}

		// Update Entry display
		$("#"+this.getScoreId(lastPlayer)).addClass(status).html(this.getScore(lastPlayer)).addClass(function() {
			var z =  Math.floor(value/10);
			return "score"+ z+"x";
		});
		$("#"+this.getLeftId(lastPlayer)).html(this.getLeft(lastPlayer));

		// Et Hop!
		callback();
	};

	// EntryX01 isFinished
	this.isFinished = function() {
		return players[players.length-1] === lastPlayer;
	};

	// EntryX01 getLastPlayer
	this.getLastPlayer = function() {
		return lastPlayer;
	};

	// EntryX01 getName
	this.getName = function() {
		return "#" + (index+1)*3;
	};

	// getParent
	this.getParent = function() {
		return parent;
	};

	// EntryX01 getScore
	this.getScore = function(player) {
		var res;
		if (playerStatus[player.uuid] === "win") {
			res = "+" + this.nbDart +" (" +this.getNbDartsPlayed() +")";
		} else {
			res = playerScore[player.uuid];
			if (typeof res !== "number") {
				res = "&nbsp;";
			}
		}
		return res;
	};
	// getEntryScore
	this.getEntryScore = function(player) {
		if (player===winner) {
			return this.getNbDartsPlayed();
		} else {
			return "-";
		}
	};

	// Nb darts
	this.getNbDartsPlayed = function() {
		return (index*3 + this.nbDart);
	};

	// get winner
	this.getWinner = function() {
		return winner;
	};

	// EntryX01 getLeft
	this.getLeft = function(player) {
		var res;
		if (typeof playerScore[player.uuid] !== "number") {
			res = "&nbsp;";
		} else {
			res =  playerLeft[player.uuid];
		}
		return res;
	};

	// EntryX01 status
	this.getStatus = function(player) {
		return playerStatus[player.uuid];
	};

	// EntryX01 display
	this.display = function() {
		var $rowEntry = $("<div/>").addClass("tableRow");

		var ps = parent.getParent().getParent().getPlayers();
		for(var j=0; j<ps.length; j++) {
			if (j!==0) {
				$rowEntry.append($("<div/>").addClass("cell").addClass("cellDarts").append(this.getName())) ;
			}

			var p = ps[j];
			$rowEntry.append($("<div/>").addClass("cell").addClass("cellScore")
				.attr("id",this.getScoreId(p))
				.append(this.getScore(p)));
			$rowEntry.append($("<div/>").addClass("cell").addClass("cellStatus")
				.attr("id",this.getLeftId(p))
				.append(this.getLeft(p)));
		}
		return $rowEntry;
	};
	// Score Id
	this.getScoreId = function(player) {
		return this.uuid +"-score-" + player.uuid;
	};
	// Left Id
	this.getLeftId = function(player) {
		return this.uuid +"-left-" + player.uuid;
	};
}