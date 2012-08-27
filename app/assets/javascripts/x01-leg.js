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
			$("#" + this.uuid +" .tableBody .tableRowInput")
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
		$("#"+this.getLeftPlayerId(lastPlayer) +" span").html(score);

		// Winning
		if("win"===status) {
			// Winner
			winner = p;
			this.displayFinished();
			parent.next();
		} else {
			this.next();
		}
	};

	// LegX01 displayFinished
	this.displayFinished = function() {
		// TODO better message
		var msg = "" + this.getName() +" Finished!";
		msg += "Winner: " + this.getWinner();
		alert(msg);
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
		var res = "Leg #" + (id+1) + " - ";
		$.each(this.getPlayers(),function(index, p){
			if (index!==0) {
				res += ", ";
			}
			res += p.name;
		});
		return res;
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

	// LegX01 start
	this.start = function() {
		console.log("start " + this.getName());
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
		// Create Leg
		var $leg = $('<div/>').addClass("leg").attr("id",this.uuid);

		// Set title
		$(".breadcrumb li h3:first-child").empty().append(this.getName());

		// Players
		var ps = parent.getParent().getPlayers();
		if (ps.length!==2) {
			throw "Expected 2 players !";
		}
		var player1 = ps[0];
		var player2 = ps[1];
		
		// Players divs
		var playersheader= [];
		var playersStats = [];
		var playersScore = [];
		var myself = this;

		for (var idx=0; idx<players.length; idx++) {
			p = players[idx];
			// head
			var name = p.getName();
			var $h = $("<h4/>");
			if (idx===0) {
				$h.append($("<span/>").addClass("badge").append(""));
			}
			$h.append(name);
			// Multi Progress
			var $progress = this.getPlayerProgress(p);
			$h.append($progress);

			playersheader[p.uuid] = $("<div/>").addClass("player-head").addClass("span6")
				.attr("id","head-player-"+p.uuid).append($h);

			// stat
			var $stat = myself.createStats(p);
			playersStats[p.uuid] = $stat;

			// Score
			var $score = $("<div/>").addClass("score-left").addClass("span6")
				.attr("id",this.getLeftPlayerId(p)).append(
					$("<span/>").addClass("badge").append(this.getPlayerScore(p)));
			playersScore[p.uuid] = $score;
		}

		// Players header
		var $head = $("<div/>").addClass("row-fluid");
		$head.append(playersheader[player1.uuid]);
		$head.append(playersheader[player2.uuid].addClass("pull-right"));
		$leg.append($head);

		// Players div
		var $players = $("<div/>").addClass("players").addClass("row-fluid");
		$players.append(playersStats[player1.uuid]);

		// div Table
		var $divTable = $("<div>").addClass("data").addClass("span6");
		var $table = this.createTable(players);
		$divTable.append($table);
		$players.append($divTable);

		$players.append(playersStats[player2.uuid]);
		$leg.append($players);

		// Players scores
		var $scores = $("<div/>").addClass("row-fluid");
		$scores.append(playersScore[player1.uuid]);
		$scores.append(playersScore[player2.uuid]);

		$leg.append($scores);

		return $leg;
	};

	// Player stats
	this.createStats = function(player) {
		var $stat = $("<div/>").addClass("stats").addClass("span3").attr("id","stats-player-"+p.uuid).addClass("wip");
				
		// Game
		var gameStats = ["Sets","Legs", "Tons", "180", "60+", "100+","Avg.", "Avg. 3", "Avg. Leg", "Best Leg", "Best out"];
		displayStats($stat, "Game", gameStats);

		// Set
		var setStats = ["Avg.", "Avg. 3", "Avg. Leg", "Best Leg"];
		displayStats($stat, "Set", setStats);

		// Leg
		var legStats = ["Avg.", "Avg. 3"];
		displayStats($stat, "Leg", legStats);

		return $stat;
	};

	// Create Table
	this.createTable = function(players) {
		var $res = $("<div/>").addClass("tableScore");

		// Head
		var $head = $("<div/>").addClass("tableHead");
		var $rowHead = $("<div/>").addClass("tableRow");

		for(var i=0; i<players.length; i++) {
			if (i!==0) {
				$rowHead.append($("<div/>").addClass("cell").addClass("cellDartsHide").append("&nbsp;"));
			}

			$rowHead.append($("<div/>").addClass("cell").addClass("cellScore").append("Score"));
			$rowHead.append($("<div/>").addClass("cell").addClass("cellStatus").append(parent.getOption().score));
		}
	
		$head.append($rowHead);
		
		// Body
		var entry = null;
		var $body = $("<div/>").addClass("tableBody");
		for (var j=0; j<entries.length; j++) {
			entry = entries[j];

			var $rowEntry = entry.display();
			$body.append($rowEntry);
		}
		
		// Foot
		var $rowInput = $("<div/>").addClass("tableRow").addClass("tableRowInput");
		for(var k=0; k<players.length; k++) {
			if (k!==0) {
				$rowInput.append($("<div/>").addClass("cell").addClass("cellDartsHide").append("&nbsp;"));
			}

			var q = players[k];
			var $input = $("<input/>",  {
					type: "text",
					id: this.getInputPlayerId(q),
					"class" : "playerInput"
				}).attr("disabled", "disabled");
		
			$rowInput.append($("<div/>").addClass("cell").addClass("cellInput")
				.addClass("control-group").append($input));
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

	// Players progress
	this.getPlayerProgress = function(player) {
		var progressSet = (parent.getParent().getPlayerWin() / parent.getOption().nbSets) * 100;
		var progressLeg = (parent.getPlayerWin() / parent.getOption().nbSets) * 100;

		var $progress = $("<div/>").addClass("progress").addClass("progress-striped")
			.append($("<div/>").addClass("bar").addClass("bar-success").attr("style", "width:" + (progressSet)+"%"))
			.append($("<div/>").addClass("bar").attr("style", "width:" + progressLeg+"%"));

		return $progress;
	};

 }