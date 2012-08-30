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
			for(var i=0; i<players.length; i++) {
				var p = players[i];
				if(toWin===this.getPlayerWin(p)) {
					// Winner
					winner = p;
					parent.next();
					return;
				}
			}

			currentLeg.displayFinished();

			// Create a new Leg
			currentLeg = new LegX01(this);
			currentLeg.start();

			// Display new leg
			var $leg = currentLeg.display();
			$("#" + this.uuid).append($leg);
		}
	};

	// SetX01 displayFinished
	this.displayFinished = function() {
		var title = this.getName() +" Finished!";
		var msg = "<h4>Winner: " + this.getWinner().getName() + "</h4>";
		msg += '<ul class="nav nav-list">' + this.getSetScore() + '</ul>';

		// Notifiy
		openModalDialog(title, msg);
	};

	// Get set score
	this.getSetScore = function () {
		var msg = '';
		var toWin = parent.getOption().nbLegs;
		for(var i=0; i<players.length; i++) {
			msg += '<li class="nav-header">';
			var p = players[i];
			var win = this.getPlayerWin(p);
			if(toWin===win) {
				msg += "<strong>" + p.getName() + ": " + win + "</strong>";
			} else {
				msg += p.getName() + ": " + win;
			}
			// display detail
			for (var j=0; j< finishedlegs.length; j++) {
				var leg = finishedlegs[j];
				msg += leg.getPlayerLegScore(p);
			}
			msg +="</li>";
		}
		return msg;
	};
	this.getPlayerSetScore = function(player) {
		var msg = "";
		for(var i=0; i<finishedlegs.length; i++) {
			var leg = finishedlegs[i];
			if (i>0) {
				msg += ", ";
			}

			msg += "[ ";
			if (leg.getWinner().uuid === player.uuid){
				msg += leg.getPlayerLegScore(player);
			} else {
				msg += "<em>" + leg.getPlayerLegScore(player) + "</em>";
			}
			msg += " ]";
		}
		return msg;
	};

	// SetX01 start
	this.start = function() {
		console.log("start " + this.getName());
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
		var res = "Set #" + (id+1) + " - ";
		$.each(this.getPlayers(),function(index, p){
			if (index!==0) {
				res += ", ";
			}
			res += p.name;
		});
		return res;
	};

	// SetX01 display
	this.display = function () {
		var $set = $('<div/>').addClass("set").attr("id",this.uuid);

		// Set title
		$(".breadcrumb li h2:first-child").empty().append(this.getName());

		// Create Legs
		$.each(this.getLegs(), function (idx, leg){
			var $leg = leg.display();

			$set.append($leg);
		});

		return $set;
	};
}