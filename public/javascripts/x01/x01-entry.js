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
 * EntryX01
 */
var comKey = 0;
function EntryX01(parentLeg, index) {
	this.uuid = createUuid();
	this.index = index;
	var parent = parentLeg;

	var players = parent.getPlayers();
	var lastPlayer = null;

	var started = false;
	var playerScore = {};
	var playerLeft = {};
	var playerPreviousLeft = {};
	var playerStatus = {}; // normal, win, broken
	var playerStatEntry = {};
	var stats = {};
	this.nbDart = null;
	var winner = null;
	this.procesing = false;

	for (var i=0; i<players.length; i++) {
		var p = players[i];
		playerLeft[p.uuid] = parent.getPlayerScore(p);
		playerPreviousLeft[p.uuid] = parent.getPlayerScore(p);
	}

	this.isStarted = function() {
		return started;
	};

	// EntryX01 next
	this.next = function(callback) {
		started = true;
		scollToBottom();

		if (this.isFinished()) {
			callback();
		}

		// Next player
		var previousPlayer = lastPlayer;
		if (lastPlayer===null) {
			lastPlayer = players[0]; // First player
		} else {
			$("#"+parent.getInputPlayerId(lastPlayer)).attr("disabled","disabled");
			$("#"+parent.getInputPlayerId(lastPlayer)).blur();

			// get next player
			lastPlayer = this.getNextPlayer();
		}
		
		// Call score (handle input, status)
		this.activatePlayer(previousPlayer);
		this.askNewInput(callback);
	};
	this.close = function() {
		var $acc =  $("#" + parent.getStatsPlayerId(lastPlayer)).parent();
		if ($acc.hasClass("collapse")) {
			$acc.collapse("hide");
		}
	};
	this.activatePlayer = function(previousPlayer) {
		var $acc =  $("#" + parent.getStatsPlayerId(lastPlayer)).parent();
		if ($acc.hasClass("collapse")) {
			$acc.collapse("show");
		}
		if (previousPlayer && previousPlayer.uuid) {
			$acc =  $("#" + parent.getStatsPlayerId(previousPlayer)).parent();
			if ($acc.hasClass("collapse")) {
				$acc.collapse("hide");
			}
		}

		var w = $(window).width();
		if (w<768) { // FIXME do in Resize
			$(".cellInput input.playerInput").removeClass("input-medium").addClass("input-mini");
			for(var i=0; i<players.length; i++) {
					if (players[i].uuid===lastPlayer.uuid) {
						$("#"+parent.getSubmitPlayer(players[i])).show();
					} else {
						$("#"+parent.getSubmitPlayer(players[i])).hide();
					}
				}
		} else {
			$("#"+parent.getSubmitPlayer(lastPlayer)).hide();
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

		comKey += 1;
		// Open Dialog
		var msgTitle = msg.get("dia.x01.computer.throw.title", {
			name: lastPlayer.getName(),
			score: score
		});
		$("#computerThrowDialog .done").empty();
		$("#computerThrowDialog .wished").empty();
		$("#computerThrowDialog h3").html(msgTitle);
		$("#computerThrowDialog").one("shown", function() {
			var nbTurnToFinish = entry.getParent().getNbTurnToFinish(lastPlayer);
			// Call to server
			$.postJSON("/x01/ComputerPlayer", {
				comKey: comKey,
				left: score,
				lvl: lastPlayer.comLevel,
				type: lastPlayer.comTarget,
				opponent: nbTurnToFinish,
				decisive: entry.getParent().isDecisive()
			}, function(json) {

				if (comKey===json.comKey) {
					entry.nbDart = json.darts.length;
					entry.showDart(entry, json, 0, callback);
				} else {
					console.log("Skipped entry");
				}
			}, function(xhr, textStatus, errorThrown) {
				if(textStatus==="timeout") {
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						//try again
						$("#computerThrowDialog .done").empty();
						$("#computerThrowDialog .wished").empty();
						$.ajax(this);
						return;
					} else {
						alert("Oops, server do not answer in time :((");
					}
				}
				doOnError(xhr, textStatus, errorThrown);
				$("#computerThrowDialog").modal("hide");
				entry.next();
			});
		}).modal("show");
	};

	// Show Computer darts
	this.showDart = function(entry, json, idx, callback) {
		var dart = json.darts[idx];
		if ($.isPlainObject(dart)) {
			var $badgeWished = $("<div/>").addClass("span4").append(dart.wished);
			$("#computerThrowDialog .wished").append($badgeWished);

			var $badgeDone = $("<div/>").addClass("span4").addClass(dart.color).append(dart.done);
			$("#computerThrowDialog .done").append($badgeDone);

			setTimeout(function() { entry.showDart(entry, json, idx+1, callback);},1000);
		} else {
			setTimeout(function() {entry.handleNewInput(json.status, json.score, callback);}, 100);
			$("#computerThrowDialog").modal("hide");
		}
	};

	// askHumanPlayer
	this.askHumanPlayer = function($input, callback) {
		var entry = this;
		var player = lastPlayer;
		$input.removeAttr("disabled","disabled");
		// Ask Human
		$input.unbind("input").on("input",validatePlayerThrow);

		// Enter
		this.procesing = false;
		$input.parent().unbind("submit").submit(function(event) {
			if (this.checkValidity() && !entry.procesing) {
				entry.procesing = true; // prevent multi submit
				entry.processInput(entry, callback);
			}
			return stopEvent(event);
		});
		// Shortcuts
		$input.keyup(function(e) {
			var k = e.which;
			var fun = shortcuts[k];
			if ($.isFunction(fun)) {
				fun(entry,callback);
				return stopEvent(e);
			} else if (isInteger(fun)) {
				$input.val(fun);
				e.target.setCustomValidity(status);
				setTimeout(function() {$("#"+entry.getParent().getSubmitPlayer(player)).click();}, 10);
				return stopEvent(e);
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
		var player = lastPlayer;
		var status = analyseInputX01(this, value, left, function(status, nbDart) {
			if (!status) {
				// the user cancel the input
				entry.procesing = false;
				$input.focus();
				return;
			}

			$input.unbind("blur").unbind("keyup");
			if (nbDart) {
				entry.nbDart = nbDart;
			}
			entry.handleNewInput(status, getInputPlayerValue(value), callback);
		});
	};

	// Handle new input
	this.handleNewInput = function(status, value, callback) {
		if (isNaN(value)) {
			return;
		}

		// Clear Input
		$("#"+parent.getInputPlayerId(lastPlayer))
			.attr("disabled","disabled").val("");

		// update left, status, score
		var left = playerLeft[lastPlayer.uuid];
		if (status !== "broken") {
			left -= value;
		}

		playerScore[lastPlayer.uuid] = value;
		playerStatus[lastPlayer.uuid] = status;
		playerLeft[lastPlayer.uuid] = left;

		if(status === "win") {
			winner = lastPlayer;
		}

		// Update Entry display
		var pLeft = this.getLeft(lastPlayer);
		$("#"+this.getLeftId(lastPlayer)).html(pLeft);
		if (isSpecial(pLeft)) {
			$("#"+this.getLeftId(lastPlayer)).addClass("special");
		}
		

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
						entry.onEditedValue($(this), player);
						return stopEvent(e);
					}
					return true;
				}).blur(function(e) { // Focus Out
					entry.onEditedValue($(this), player);
					return stopEvent(e);
				});
		}
		// Push stats
		var ts = new Date().getTime();
		playerStatEntry[player.uuid] = ts;
		this.pushStats(player, value, left, status, ts,  callback);
	};
	// Send entry to server for stats updating
	this.pushStats = function(player, value, left, status, ts,  callback) {
		var entry = this;
		var statEntry = {
			timestamp: ts,
			leg: parent.uuid,
			set: parent.getParent().uuid,
			game: parent.getParent().getParent().uuid,
			entryIndex: index,
			player: player.uuid,
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

		x01Stats.db.addStatsEntryX01(statEntry,function() {
			x01Stats.db.getPlayerStats(statEntry.game, statEntry.set, statEntry.leg, player, function(json) {
				entry.updateStats(player, json);
				if (callback!==null && $.isFunction(callback)) {
					// delay callback
					setTimeout(callback, 100);
				}
			});
		});
	};
	// Update stats
	this.updateStats = function(player, json) {
		if (json.timestamp) {
			playerStatEntry[player.uuid] = json.timestamp;
		}

		// Update Parent
		parent.updateStats(player, json);

		// Display stats
		handleStats(parent.getStatsPlayerId(player), json);
	};

	this.onEditedValue = function($this, player) {
		var value = "" + $this.html();
		if ($this.data("score") != value) {
			value = value.replace(/<br>/g,"");
			try {
				this.changeEntry($this, player, value);
			} catch (e) {
				console.log("Invalid input: " +value);
				$this.addClass("needEdit");
			}
		}
	};
	// Change a value
	this.changeEntry = function($cell, player, value) {
		var val = getInputPlayerValue(value);
		var left = this.getPreviousLeft(player);
		var entry = this;
		var status = validatePlayerValue(value);

		$cell.html(val);
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
		$cell.data("score",value);
		playerScore[player.uuid] = value;
		playerStatus[player.uuid] = status;

		$cell.removeClass(function(idx, clazz){
			return clazz;
		});
		$cell.addClass("cell").addClass("cellScore").addClass(status).addClass(function() {
			var z =  Math.floor(value/10);
			return "score"+ z+"x";
		});

		// Compute scores
		parent.applyChange(this, player);
		
		// Push stats
		var left = playerLeft[player.uuid];
		var entry = this;
		x01Stats.db.deleteStatsEntryX01(playerStatEntry[player.uuid], function() {
			entry.pushStats(player, value, left, status, playerStatEntry[player.uuid]);
		});
		
		// Handle winning throw
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
		// Destroy stats
		this.deletePlayerStats(player);
	};
	this.destroy = function() {
		$("#" + this.uuid).remove();

		// Destroy stats
		var player;
		for (var i=0; i<players.length; i++) {
			player = players[i];
			if (playerStatEntry[player.uuid]) {
				this.deletePlayerStats(player);
			}
		}
	};
	this.deletePlayerStats = function(player) {
		var entry = this;
		x01Stats.db.deleteStatsEntryX01(playerStatEntry[player.uuid], function() {
			x01Stats.db.getPlayerStats(parent.getParent().getParent().uuid, parent.getParent().uuid, parent.uuid, player, function(json) {
				entry.updateStats(player, json);
			});
		});
	};

	// Update the score
	this.updateScoreLeftDisplay = function(player, score) {
		this.updateScoreLeft(player,score);
		var $left = $("#"+this.getLeftId(player));
		$left.html(this.getLeft(player));
	};
	this.updateScoreLeft = function(player, score) {
		playerLeft[player.uuid] = score;
		var $left = $("#"+this.getLeftId(player));
		$left.html(this.getLeft(player));
	};
	this.updatePreviousLeft = function(player, score) {
		playerPreviousLeft[player.uuid] = score;
	};

	// EntryX01 isFinished
	this.isFinished = function() {
		return this.getNextPlayer()===null;
	};
	this.getNextPlayer = function() {
		// if evry player has a status & a valid score ()
		var status;
		var score;
		for (var i=0; i<players.length; i++) {
			p = players[i];
			score = playerScore[p.uuid];
			status = playerStatus[p.uuid];
			if (status==="win") {
				return null;
			}

			if (!(
				((typeof score ==="number") && !isNaN(score)) &&
				(status==="normal" || status==="broken"))) {
				return p;
			}
		}

		return null;
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
	this.getScore = function(player) {
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
	this.getScoreAsInt = function(player) {
		var res = playerScore[player.uuid];
		if ((res===null)||(typeof res!=="number")) {
			res = 0;
		}
		return res;
	};
	this.getLeftAsInt = function(player) {
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
	this.getLeft = function(player) {
		var res;
		if (typeof playerScore[player.uuid] !== "number") {
			res = "&nbsp;";
		} else {
			res =  playerLeft[player.uuid];
		}
		return res;
	};

	// EntryX01 status
	this.getStatus = function(player) {
		return playerStatus[player.uuid];
	};

	// EntryX01 display
	this.display = function() {
		return tmpl("EntryToRow", {
			entry: this,
			players: parent.getParent().getParent().getPlayers()
		});
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