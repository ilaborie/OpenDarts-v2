		/**
 * LegX01 Object
 */
function LegX01(parentSet) {
	this.uuid = createUuid();
	var id;
	var parent = parentSet;
	var players = [];

	// Status
	var winner = null;
	var playersScore = {};
	var entries = [];

	var currentEntry = null;

	var previousLeg = parentSet.getCurrentLeg() ;

	if (!previousLeg) {
		// This is the first set
		id = 0;
		for (var i=0; i< parent.getPlayers().length; i++) {
			players.push(parent.getPlayers()[i]);
		}
	} else {
		id = previousLeg.getId()+1;
		// define players orders
		for (var j=1; j< previousLeg.getPlayers().length; j++) {
			players.push(previousLeg.getPlayers()[j]);
		}
		players.push(previousLeg.getPlayers()[0]);
	}

	// LegX01 next
	this.next= function() {
		if (!currentEntry.isFinished()) {
			// Continue entry
			var leg = this;
			currentEntry.next(function() {
				leg.afterEntryNext();
			});
		} else {
			// Create a new Entry
			currentEntry = new EntryX01(this,currentEntry.index+1);
			entries.push(currentEntry);

			// Display new Entry
			$("#" + this.uuid +" .tableRowInput")
				.before(currentEntry.display());

			this.next();
		}
	};

	// Handle entry.next result
	this.afterEntryNext = function () {
		var lastPlayer = currentEntry.getLastPlayer();
		var status = currentEntry.getStatus(lastPlayer);
		
		// Update player score
		var score = currentEntry.getLeft(lastPlayer);
		playersScore[lastPlayer.uuid] = score;

		// Update Left
		$("#"+this.getLeftPlayerId(lastPlayer)).html(score);
		//window.scrollTo(0,document.body.scrollHeight);

		// Winning
		if("win"===status) {
			// Winner
			winner = lastPlayer;
			parent.next();
		} else {
			this.next();
		}
	};

	this.applyChange=function(entry, player) {
		var score = parent.getOption().score;
		var e;
		var st;
		var entriesToDestroy = [];
		var winEntry = null;
		var previousEntry = null;
		for (var i=0; i< entries.length; i++) {
			e = entries[i];
			st = e.getStatus(player);
			
			if (winEntry!==null) {
				entriesToDestroy.push(e);
			}

			e.updatePreviousLeft(player, score);
			if (st === "normal") {
				score -= e.getScoreAsInt(player);
				if (score<=0 || score===1) { // Invalid score
					$("#"+e.getScoreId(player)).addClass("needEdit");
				} else {
					$("#"+e.getScoreId(player)).removeClass("needEdit");
				}

				e.updateScoreLeftDisplay(player, score);
			} else if (st === "broken") {
				e.updateScoreLeftDisplay(player, score);
			} else if (st === "win") {
				winEntry = e;
				e.updateScoreLeftDisplay(player, 0);
				if (i>0) {
					previousEntry = entries[i-1];
				}
			} else {
				// Not yet played
				e.updateScoreLeft(player, score);
			}
		}

		// Handle wining entry
		if (winEntry !== null) {
			currentEntry = winEntry;
			var p;
			var flag = false;
			for (var k=0; k< players.length; k++) {
				p = players[k];
				if (flag) {
					winEntry.destroyPlayer(p);
					if (previousEntry!==null) {
						playersScore[p.uuid] = previousEntry.getLeftAsInt(p);// FIXME display left instead of score
						$("#"+this.getLeftPlayerId(p)).html(playersScore[p.uuid]);
					} else {
						playersScore[p.uuid] = parent.getOption().score;
						$("#"+this.getLeftPlayerId(p)).html(parent.getOption().score);
					}
				} else if (p.uuid === player.uuid) {
					flag = true;
				}
			}
		}

		// Destroy obsolete entries
		for (var j=0; j<entriesToDestroy.length; j++) {
			// Update score
			entriesToDestroy[j].destroy();
		}

		// update Leg player score
		playersScore[player.uuid] = score;
		$("#"+this.getLeftPlayerId(player)).html(score);
	};

	// LegX01 displayFinished
	this.displayFinished = function() {
		var title = this.getName() +" Finished!";
		var msg = '<h4>Winner: <strong>' + this.getWinner().getName()+'</strong>';
		msg += ' with <span class="badge badge-inverse">' + this.getLegScore() +'</span> darts</h4>';

		// Notifiy
		var set = parent;
		openModalDialog(title, msg, {
			text: '<i class="icon-white icon-step-forward"></i> Next Leg',
			"class" : "btn-primary",
			click: function() { $("#modalDialog").modal("hide"); set.startNewLeg(); }
		});
	};

	// get leg score
	this.getLegScore = function() {
		return currentEntry.getNbDartsPlayed();
	};

	// LegX01 getPlayers
	this.getPlayers = function() {
		return players;
	};

	// LegX01 getId
	this.getId = function() {
		return id;
	};

	// LegX01 getName
	this.getName = function() {
		var res = "Leg #" + (id+1) + " <small>";
		$.each(this.getPlayers(),function(index, p){
			if (index!==0) {
				res += ", ";
			}
			res += p.name;
		});
		return res + "</small>";
	};
	this.getNameWinner = function() {
		return "Leg #" + (id+1);
	};
	this.getParent = function() {
		return parent;
	};
	// LegX01 getWinner
	this.getWinner = function() {
		return winner;
	};

	// LegX01 isFinished
	this.isFinished = function() {
		return (winner!==null);
	};

	// LegX01 getScore
	this.getPlayerScore = function(player){
		return playersScore[player.uuid];
	};

	// LegX01 getEntires
	this.getEntries = function() {
		return entries;
	};
	// Current entry
	this.getCurrentEntry = function() {
		return currentEntry;
	};

	// LegX01 start
	this.start = function() {
		// Score
		for (var idx=0; idx<players.length; idx++) {
			p = players[idx];
			playersScore[p.uuid] = parent.getOption().score;
		}

		// Entry
		currentEntry = new EntryX01(this,0);
		entries.push(currentEntry);
	};

	// LegX01 display
	this.display = function() {
		// Players
		var ps = parent.getParent().getPlayers();
		if (ps.length!==2) {
			throw "Expected 2 players !";
		}
		var p1 = ps[0];
		var p2 = ps[1];
		
		// Players Elements
		var playersheader= [];
		var playersStats = [];
		var playersScore = [];

		for (var idx=0; idx<players.length; idx++) {
			p = players[idx];

			playersheader[p.uuid] = this.getPlayerHead(p);
			playersStats[p.uuid] = this.getPlayerStats(p);
			playersScore[p.uuid] = this.getPlayerLeft(p);
		}

		// Col 1
		var $p1Col = $("<div/>")
			.append(playersheader[p1.uuid])
			.append(playersStats[p1.uuid]);

		// Col 2
		var $p2Col = $("<div/>")
			.append(playersheader[p2.uuid])
			.append(playersStats[p2.uuid]);

		// div Table
		var $divTable = $("<div>").addClass("data");
		$divTable.append(this.createTable(ps));

		// Score Left
		var $legLeft = $("<div/>").addClass("container").addClass("score-left-container")
			.append(playersScore[p1.uuid].addClass("span6"))
			.append(playersScore[p2.uuid].addClass("span6"));

		// Assemble Leg
		var $leg = $('<div/>').addClass("leg").addClass("row-fluid").attr("id",this.uuid)
			.append($p1Col.addClass("span3"))
			.append($divTable.addClass("span6"))
			.append($p2Col.addClass("span3"))
			.append($legLeft);

		return $leg;
	};

	// Create Table
	this.createTable = function(players) {
		var $res = $("<table/>").addClass("table").addClass("table-striped").addClass("table-condensed").addClass("table-bordered").addClass("tableScore");

		// Head
		var $head = $("<thead/>");
		var $rowHead = $("<tr/>");
		for(var i=0; i<players.length; i++) {
			if (i!==0) {
				$rowHead.append($("<th/>").addClass("cell").addClass("cellDartsHide").append("&nbsp;"));
			}

			$rowHead.append($("<th/>").append($("<small/>").append(players[i].getName())));
			$rowHead.append($("<th/>").addClass("cell").addClass("cellStatus").append(parent.getOption().score));
		}
		$head.append($rowHead);
		
		// Body
		var entry = null;
		var $body = $("<tbody/>");
		for (var j=0; j<entries.length; j++) {
			entry = entries[j];

			var $rowEntry = entry.display();
			$body.append($rowEntry);
		}
		
		// Foot
		var $rowInput = $("<tr/>").addClass("tableRowInput");
		for(var k=0; k<players.length; k++) {
			if (k!==0) {
				$rowInput.append($("<td/>").addClass("cell").addClass("cellDartsHide").append("&nbsp;"));
			}

			var q = players[k];
			var $input = $("<input/>",  {
					type: "number",
					min: 0,
					max: 180,
					id: this.getInputPlayerId(q),
					"class" : "input-medium playerInput",
					required: true
				}).attr("disabled", "disabled");

			var $form = $("<form/>").attr("action","#game").append($input);
			$form.append(
				$("<button/>").attr("type","submit").addClass("btn").addClass("btn-success").addClass("hide").attr("id",this.getSubmitPlayer(q))
				.html($("<i/>").addClass("icon-white").addClass("icon-play")));
		
			$rowInput.append($('<td colspan="2"/>').addClass("cell").addClass("cellInput")
				.addClass("control-group").append($form));
		}
	
		$body.append($rowInput);

		// Final Table
		$res.append($head).append($body);
		return $res;
	};

	// Input player id
	this.getInputPlayerId = function(player) {
		return "input"+this.uuid+"-player" + player.uuid;
	};
	// Left player id
	this.getLeftPlayerId = function(player) {
		return "left"+this.uuid+"-player" + player.uuid;
	};
	this.getHeadPlayerId = function(player) {
		return "head"+this.uuid+"-player" + player.uuid;
	};
	this.getStatsPlayerId = function(player) {
		return "stats"+this.uuid+"-player-"+player.uuid;
	};
	this.getSubmitPlayer = function(player) {
		return "submit"+this.uuid+"-player" + player.uuid;
	};

	// Players Head
	this.getPlayerHead = function(player) {
		var nbSets = parent.getOption().nbSets;
		var nbLegs = parent.getOption().nbLegs;

		var setWin = parent.getParent().getPlayerWin(player);
		var legWin = parent.getPlayerWin(player);

		// Title
		var $title = $("<h4/>");
		if (players[0].uuid===player.uuid) {
			$title.append($("<li/>").addClass("icon-asterisk"));
		}
		$title.append(p.getFullName());

		// Leg and Set advance
		if (parent.getOption().nbSets>1) {
			$title.append("&nbsp;");
			$title.append($("<span>").addClass("badge").addClass("badge-primary")
				.append(parent.getParent().getPlayerWin(p)));
		}
		if (parent.getOption().nbLegs>1) {
			$title.append("&nbsp;");
			$title.append($("<span>").addClass("badge").addClass("badge-success")
				.append(parent.getPlayerWin(p)));
		}

		// Set and Leg Progress
		$progress = $("<div/>");
		if (parent.getOption().nbSets!=1 || parent.getOption().nbLegs!=1) {
			var progressSet = ( setWin / nbSets) * 100;
			var progressLeg = (( legWin / nbLegs) * 100)/nbSets;

			$progress.addClass("progress").addClass("progress-striped")
				.append($("<div/>").addClass("bar").attr("style", "width:" + (progressSet)+"%"))
				.append($("<div/>").addClass("bar").addClass("bar-success").attr("style", "width:" + progressLeg+"%"));
		}

		// Assemble
		return $("<div/>").addClass("player-head").attr("id",this.getHeadPlayerId(p))
			.append($title)
			.append($progress);
	};

	this.getPlayerLeft = function(player) {
		return $("<div/>").addClass("score-left")
				.attr("id",this.getLeftPlayerId(p))
				.append(this.getPlayerScore(p));
	};

	// Player stats
	this.getPlayerStats = function(player) {
		var $game = displayStats(x01.stats.game);
		var $set = displayStats(x01.stats.set);
		var $leg = displayStats(x01.stats.leg);

		// Load stats
		for(var i=0; i<players.length; i++) {
			var p= players[i];
			var statQuery = {
				leg: this.uuid,
				set: parent.uuid,
				game: parent.getParent().uuid,
				player: p.uuid
			};
			this.requestStats(statQuery, p);
		}

		return $("<div/>").addClass("stats").addClass("visible-desktop").attr("id",this.getStatsPlayerId(player))
			.append($game)
			.append($set)
			.append($leg);
	};

	// Retrieve stats
	this.requestStats = function(statQuery, player) {
		var leg = this;
		$.postJSON("/x01/stats", statQuery, function(json) {
			handleStats(leg.getStatsPlayerId(player), json);
		});
	};

 }