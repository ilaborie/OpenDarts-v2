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
	var playerPreviousLeft = {};
	var playerStatus = {}; // normal, win, broken
	this.nbDart = null;
	var winner = null;

	for (var i=0; i<players.length; i++) {
		var p = players[i];
		playerLeft[p.uuid] = parent.getPlayerScore(p);
		playerPreviousLeft[p.uuid] = parent.getPlayerScore(p);
	}

	// EntryX01 next
	this.next = function(callback) {
		if (this.isFinished()) {
			callback();
		}

		// Next player
		if (!lastPlayer) {
			// First player
			lastPlayer = players[0];
		} else {
			$("#"+parent.getInputPlayerId(lastPlayer)).attr("disabled","disabled");
			$("#"+parent.getInputPlayerId(lastPlayer)).blur();

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
		this.activatePlayer();
		this.askNewInput(callback);
	};
	this.activatePlayer = function() {
		var w = $(window).width();
		if (w<768) {
			var p;
			var $head;
			var $left;
			for (var i=0; i<players.length; i++) {
				p = players[i];
				$head = $("#"+parent.getHeadPlayerId(p));
				$left = $("#"+parent.getLeftPlayerId(p));
				if (p.uuid===lastPlayer.uuid) {
					$head.show();
					$left.show();
				} else {
					$head.hide();
					$left.hide();
				}
			}
		} else {
			$(".player-head").show();
			$(".score-left").show();
		}
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
			},800);
		} else {
			$("#computerThrowDialog").unbind("hidden").on("hidden",function() {
				entry.handleNewInput(json.status, json.score, callback);
			}).modal("hide");
		}
	};

	// askHumanPlayer
	this.askHumanPlayer = function($input, callback) {
		var entry = this;
		var player = lastPlayer;
		$input.removeAttr("disabled","disabled");
		// Ask Human
		$input.unbind("input").on("input",validatePlayerThrow);

		// FIXME blur kill the editing entry
		//$input.unbind("blur").blur(function(e) {
		//	$("#"+ parent.getSubmitPlayer(player)).click();
		//});
		// Enter
		$input.parent().unbind("submit").submit(function(e) {
			if (this.checkValidity()) {
				entry.processInput(entry, callback);
			}
			e.preventDefault();
			return false;
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
				$input.val(fun);
				$input.parent().submit();
			}
			return true;
		});

		$input.focus();
	};

	// Process Input
	this.processInput = function(entry, callback){
		var $input = $("#"+parent.getInputPlayerId(lastPlayer));
		var value = $input.val();
		this.processValue(value, callback);
	};

	// Process value
	this.processValue = function(value,  callback) {
		var left = playerLeft[lastPlayer.uuid];
		var $input = $("#"+parent.getInputPlayerId(lastPlayer));
		
		var entry = this;
		var status = analyseInputX01(this, value, left, function(status, nbDart) {
			if (nbDart) {
				entry.nbDart = nbDart;
			}
			$input.unbind("blur").unbind("keyup");
			entry.handleNewInput(status, parseInt(value,10), callback);
		});
	};

	// Handle new input
	this.handleNewInput = function(status, value, callback) {
		// Clear Input
		$("#"+parent.getInputPlayerId(lastPlayer))
			.attr("disabled","disabled").val("");

		// update left, status, score
		var left = playerLeft[lastPlayer.uuid];
		if (status !== "broken") {
			left -= value;
		}

		playerScore[lastPlayer.uuid] = value;
		playerStatus[lastPlayer.uuid] =status;
		playerLeft[lastPlayer.uuid] = left;

		if(status === "win") {
			winner = lastPlayer;
		}

		// Update Entry display
		$("#"+this.getLeftId(lastPlayer)).html(this.getLeft(lastPlayer));
		$("#"+this.getScoreId(lastPlayer)).addClass(status).html(this.getScore(lastPlayer)).addClass(function() {
			var z =  Math.floor(value/10);
			return "score"+ z+"x";
		});
		var entry = this;
		var player = lastPlayer;
		if (!lastPlayer.com) {
			// Enable Editing
			$("#"+this.getScoreId(player)).data("score",value).attr("contentEditable", true)
				.keyup(function(e) {
					if (e.which==13) { // Enter pressed
						var $this = $(this);
						var value = ""+$(this).html();
						value = value.replace(/<br>/g,"");
						if ($this.data("score") != value) {
							entry.changeEntry($this, player, value);
						}
						e.preventDefault();
						return false;
					}
					return true;
				}).blur(function() { // Focus Out
					var $this = $(this);
					var value = ""+$(this).html();
					value = value.replace(/<br>/g,"");
					if ($this.data("score") != value) {
						entry.changeEntry($this, player, value);
					}
				});
		}
		// Push stats
		var statEntry = {
			timestamp: new Date().getTime(),
			entry: this.uuid,
			leg: parent.uuid,
			set: parent.getParent().uuid,
			game: parent.getParent().getParent().uuid,
			entryIndex: index,
			player: lastPlayer.uuid,
			score: value,
			left: left,
			status: status
		};
		if (status === "win") {
			statEntry.legNbDarts = this.getNbDartsPlayed();
		}
		if (status === "broken") {
			statEntry.score = 0;
		}
		if(typeof this.nbDart === "number") {
			statEntry.nbDarts = this.nbDart;
		} else {
			statEntry.nbDarts = 3;
		}
		$.postJSON("/x01/throw", statEntry, function(json) {
			handleStats(entry.getParent().getStatsPlayerId(player), json);
		});

		// Et Hop!
		callback();
	};
	// Change a value
	this.changeEntry = function($cell, player, value) {
		var val = parseInt(value,10);
		var left = this.getPreviousLeft(player);
		var entry = this;
		var status = validatePlayerValue(value);

		if (status!=="") {
			$cell.addClass("needEdit");
		} else {
			if (val===left) {
				getNbDart(left, function(status, nbDart) {
					if (nbDart) {
						entry.nbDart = nbDart;
					}
					entry.applyChange($cell, val, player, status);
				});
			} else {
				// Process
				analyseInputX01(this, value, left, function(status, nbDart) {
					entry.nbDart = nbDart;
					entry.applyChange($cell, val, player, status);
				});
			}
		}

	};
	this.applyChange = function($cell, value, player, status) {
		$cell.removeClass("needEdit").data("score",value);
		playerScore[player.uuid] = value;
		playerStatus[player.uuid] = status;
		$cell.addClass(status).addClass(function() {
			var z =  Math.floor(value/10);
			return "score"+ z+"x";
		});

		// Compute scores
		parent.applyChange(this, player);
		if (status==="win") {
			$cell.html(this.getScore(player));
			lastPlayer = player;
			parent.afterEntryNext();
		}
	};

	this.destroyPlayer = function(player) {
		playerScore[player.uuid] = null;
		playerStatus[player.uuid] = null;
		playerLeft[player.uuid] = this.getPreviousLeft(player);

		// update display
		$("#"+this.getLeftId(player)).html(this.getLeft(player));
		$("#"+this.getScoreId(player)).html(this.getScore(player));
		if (!player.com) {
			$("#"+this.getScoreId(player)).data("score",null);
		}
	};
	this.destroy = function() {
		$("#" + this.uuid).remove();
	};

	// Update the score
	this.updateScoreLeft = function(player, score) {
		playerLeft[player.uuid] = score;
		$("#"+this.getLeftId(player)).html(this.getLeft(player));
	};
	this.updatePreviousLeft = function(player, score) {
		playerPreviousLeft[player.uuid] = score;
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
	this.getScoreAsInt = function(player) {
		var res = playerScore[player.uuid];
		if ((res===null)||(typeof res!=="number")) {
			res = 0;
		}
		return res;
	};
	this.getLeftAsInt = function(player) {
		var res = playerLeft[player.uuid];
		if ((res===null)||(typeof res!=="number")) {
			res = 0;
		}
		return res;
	};
	this.getPreviousLeft = function(player) {
		return playerPreviousLeft[player.uuid];
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
		var $rowEntry = $("<tr/>").attr("id", this.uuid);

		var ps = parent.getParent().getParent().getPlayers();
		for(var j=0; j<ps.length; j++) {
			if (j!==0) {
				$rowEntry.append($("<td/>").addClass("cell").addClass("cellDarts").append(this.getName())) ;
			}

			var p = ps[j];
			$rowEntry.append($("<td/>").addClass("cell").addClass("cellScore")
				.attr("id",this.getScoreId(p))
				.append(this.getScore(p)));
			$rowEntry.append($("<td/>").addClass("cell").addClass("cellStatus")
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