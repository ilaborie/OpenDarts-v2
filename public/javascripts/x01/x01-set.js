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
		var $msg = $("<table/>").addClass("table").addClass("table-striped").addClass("table-condensed");
		var $head = $("<thead/>").append("<tr/>");
		var $body = $("<tbody/>");
		var player;
		var clazz;
		for (var i=0; i< players.length; i++) {
			player = players[i];
			clazz = "textRight";
			if (i%2===1) {
				clazz = "textLeft";
				$head.append(
					$("<td/>").addClass("textCenter").append(
						this.getPlayerWin(players[i-1]) + " - "  + this.getPlayerWin(player)
				));
			}
			if (winner.uuid === player.uuid) {
				$head.append($("<td/>").addClass(clazz).append($("<strong/>").append(player.getName())));
			} else {
				$head.append($("<td/>").addClass(clazz).append(player.getName()));
			}
		}
		var $row;
		for(var key in stats) {
			$row = $("<tr/>");
			for (var k=0; k<players.length; k++) {
				player  = players[k];
				clazz = "textRight";
				if (k%2===1) {
					clazz = "textLeft";
					$row.append($("<td/>").addClass("textCenter").append(getStatLabel(x01.stats.set, key)));
				}
				$row.append($("<td/>").addClass(clazz).append(stats[key][player.uuid]));
			}
			$body.append($row);
		}
		$msg.append($head).append($body);

		// Notifiy
		var game = parent;
		openModalDialog(title, $msg, {
			text: '<i class="icon-white icon-step-forward"></i> Next Set',
			"class" : "btn-primary",
			click: function() { $("#modalDialog").modal("hide"); game.startNewSet(); }
		});
	};
	// Update stats
	this.updateStats = function(player, json) {
		// Update values
		var st;
		for (var i=0; i<json.setStats.length;i++) {
			st = json.setStats[i];
			if (!stats[st.key]) {
				stats[st.key] = {};
			}
			stats[st.key][player.uuid] = st.value;
		}

		// Update Parent
		parent.updateStats(player, json);
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

	// Get set score
	this.getSetScore = function () {
		var msg = '';
		for (var j=0; j< finishedlegs.length; j++) {
			var leg = finishedlegs[j];
			msg += '<li class="nav-header">';
			msg += leg.getNameWinner();
			msg += "</li>";
			msg += "<li>";
			msg += leg.getWinner().getName() + " with "+ leg.getLegScore() +" darts";
			msg += "</li>";
		}
		return msg;
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
		res.push(currentLeg);
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