/**
 * SetX01 Object
 */
function SetX01(parentGame) {
	this.uuid = createUuid();
	var id;
	var parent = parentGame;
	var players = [];

	var currentLeg = null;
	var finishedlegs = [];

	// Status
	var winner = null;
	var stats = {};

	// Configuration
	var previousSet = parentGame.getCurrentSet();

	if (!previousSet) {
		// This is the first set
		id = 0;
		for (var i=0; i< parent.getPlayers().length; i++) {
			players.push(parent.getPlayers()[i]);
		}
	} else {
		id = previousSet.getId()+1;
		// define players orders
		for (var j=1; j< previousSet.getPlayers().length; j++) {
			players.push(previousSet.getPlayers()[j]);
		}
		players.push(previousSet.getPlayers()[0]);
	}

	// SetX01 next
	this.next= function() {
		if (!currentLeg.isFinished()) {
			// Continue leg
			currentLeg.next();
		} else {
			finishedlegs.push(currentLeg);
			$("#"+currentLeg.uuid).hide();

			// check Winner
			var toWin = parent.getOption().nbLegs;
			var p =currentLeg.getWinner();
			if(toWin===this.getPlayerWin(p)) {
				currentLeg = null;
				// Winner
				winner = p;
				parent.next();
				return;
			} else if (!this.isFinished()) {
				currentLeg.displayFinished();
			}
		}
	};

	// SetX01 displayFinished
	this.displayFinished = function() {
		var title = this.getName() +" Finished!";
		
		var msg = this.getTableStats();

		// Notifiy
		var game = parent;
		openModalDialog(title, msg, {
			text: '<i class="icon-white icon-step-forward"></i> Next Set',
			"class" : "btn-primary",
			click: function() { $("#modalDialog").modal("hide"); game.startNewSet(); }
		});
	};
	// stats table
	this.getTableStats = function() {
		var $table = $("<table/>").addClass("table").addClass("table-striped").addClass("table-condensed");
		var $head = $("<thead/>").append("<tr/>");
		var $body = $("<tbody/>");
		var player;
		var clazz;
		for (var i=0; i< parent.getPlayers().length; i++) {
			player = parent.getPlayers()[i];
			clazz = "textRight";
			if (i%2===1) {
				clazz = "textLeft";
				$head.append(
					$("<td/>").addClass("textCenter").append(
						this.getPlayerWin(parent.getPlayers()[i-1]) + " - "  + this.getPlayerWin(player)
				));
			}
			if (winner.uuid === player.uuid) {
				$head.append($("<td/>").addClass(clazz).append($("<strong/>").append(player.getName())));
			} else {
				$head.append($("<td/>").addClass(clazz).append(player.getName()));
			}
		}
		var $row;

		var currentValue = null;
		var bestValue = null;
		var $currentCell = null;
		var $bestCells = [];
		var comp;
		for(var key in stats) {
			clazz = "textRight";
			$row = $("<tr/>");
			$bestCells = [];
			bestValue = null;
			for (var k=0; k<parent.getPlayers().length; k++) {
				player  = parent.getPlayers()[k];
				if (k%2===1) {
					clazz = "textLeft";
					$row.append($("<td/>").addClass("textCenter").append(getStatLabel(x01.stats.set, key)));
				}
				$currentCell = $("<td/>").addClass(clazz);
				currentValue = stats[key][player.uuid];

				// compare
				comp = x01.stats.set.contents[key].sorter(currentValue, bestValue);
				if (comp >= 0) {
					if (comp>0) {
						$bestCells = [];
						bestValue = currentValue;
					}
					$bestCells.push($currentCell);
				}

				$row.append($currentCell.append(currentValue));
			}
			// Display best
			if ($bestCells.length>0) {
				for (var j=0; j<$bestCells.length; j++) {
					$bestCells[j].addClass("best");
				}
			}

			$body.append($row);
		}
		$table.append($head).append($body);
		return $("<p/>").append($table).html();
	};
	// Update stats
	this.updateStats = function(player, json) {
		// Update values
		for (var key in json.setStats) {
			if (!stats[key]) {
				stats[key] = {};
			}
			stats[key][player.uuid] = json.setStats[key];
		}

		// Update Parent
		parent.updateStats(player, json);

		// Display best
		var bestSpan = [];
		var currentSpan;
		var bestValue = null;
		var currentValue;
		var comp;
		var p;
		for (var stk in stats) {
			bestSpan = [];
			bestValue = null;

			for (var i=0; i<players.length; i++) {
				p = players[i];
				currentValue = +stats[stk][p.uuid]; // as Number
				currentSpan = $("#"+currentLeg.getStatsPlayerId(p)+" ."+x01.stats.set.key+" ." + stk);
				
				// clear stats
				currentSpan.removeClass("best");

				// compare
				comp = x01.stats.set.contents[stk].sorter(currentValue, bestValue);
				if (comp >= 0) {
					if (comp>0) {
						bestSpan = [];
						bestValue = currentValue;
					}
					bestSpan.push(currentSpan);
				}
			}
			if (bestSpan.length>0) {
				for (var j=0; j<bestSpan.length; j++) {
					bestSpan[j].addClass("best");
				}
			}
		}
	};

	// Next Leg
	this.startNewLeg = function() {
		// Create a new Leg
		currentLeg = new LegX01(this);
		currentLeg.start();

		// Display new leg
		var $leg = currentLeg.display();
		$("#" + this.uuid).empty().append($leg);
		tuningSize();

		// Go ahead
		this.next();
	};

	this.getPlayerSetScore = function(player) {
		var msg = "";
		var started = false;
		for(var i=0; i<finishedlegs.length; i++) {
			var leg = finishedlegs[i];

			if (leg.getWinner().uuid === player.uuid){
				if (started) {
					msg += ", ";
				}
				started = true;
				msg += leg.getLegScore();
			}
		}
		if (started) {
			msg = "["  +msg + "]";
		}
		return msg;
	};

	// SetX01 start
	this.start = function() {
		// Create Leg
		currentLeg = new LegX01(this);
		currentLeg.start();
	};

	// SetX01 getOption
	this.getOption = function() {
		return parent.getOption();
	};

	// SetX01 getPlayers
	this.getPlayers = function() {
		return players;
	};

	// SetX01 getWinner
	this.getWinner = function() {
		return winner;
	};

	// SetX01 isFinished
	this.isFinished = function() {
		return (winner!==null);
	};

	// SetX01 getPlayerWin
	this.getPlayerWin = function(player) {
		var res = 0;
		for (var i=0; i<finishedlegs.length; i++) {
			if (player===finishedlegs[i].getWinner()) {
				res++;
			}
		}
		return res;
	};

	// SetX01 getCurrentLeg
	this.getCurrentLeg = function() {
		return currentLeg;
	};

	// SetX01 getLegs
	this.getLegs = function() {
		var res = [];
		for (var i=0; i<finishedlegs.length; i++) {
			res.push(finishedlegs[i]);
		}
		if (currentLeg!==null) {
			res.push(currentLeg);
		}
		return res;
	};

	// SetX01 getParent
	this.getParent = function() {
		return parent;
	};

	// SetX01 getId
	this.getId = function() {
		return id;
	};

	// SetX01 getName
	this.getName = function() {
		var res = "Set #" + (id+1) + " <small>";
		$.each(this.getPlayers(),function(index, p){
			if (index!==0) {
				res += ", ";
			}
			res += p.name;
		});
		return res + "</small>";
	};
	this.getNameWinner = function() {
		return "Set #" + (id+1) + ": " + this.getWinner().getName();
	};

	// SetX01 display
	this.display = function () {
		var $set = $('<div/>').addClass("set").attr("id",this.uuid);

		// Create Legs
		$.each(this.getLegs(), function (idx, leg){
			var $leg = leg.display();

			$set.append($leg);
		});

		return $set;
	};
}