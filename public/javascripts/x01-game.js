/**
 * GameX01 Object
 */
function GameX01(options) {
	this.uuid = createUuid();
	var id = 0;
	var option = options;
	
	var currentSet = null;
	var finishedSets = [];

	// Status
	var winner = null;

	if (x01.currentGame) {
		id = x01.currentGame.getId() +1;
	} // else 0

	// GameX01 next
	this.next= function() {
		if (!currentSet.isFinished()) {
			// Continue set
			currentSet.next();
		} else {
			finishedSets.push(currentSet);
			$("#"+currentSet.uuid).hide();

			// check Winner
			var toWin = option.nbSets;
			for(var i=0; i<option.players.length; i++) {
				var p = option.players[i];
				if(toWin===this.getPlayerWin(p)) {
					// Winner
					winner = p;
					this.displayFinished();
					return;
				}
			}

			currentSet.displayFinished();

			// Create a new Set
			currentSet = new SetX01(this);
			currentSet.start();

			// Display new set
			var $set = currentSet.display();
			$("#game").append($set);
		}
	};

	// GameX01 displayFinished
	this.displayFinished = function() {
		var title = this.getName() +" Finished!";
		var msg = "<h4>Winner: " + this.getWinner().getName() + "</h4>";
		msg += '<ul class="nav nav-list game-detail">' + this.getGameScore() + '</ul>';

		// Notifiy
		openModalDialog(title, msg);
	};

	// Get set score
	this.getGameScore = function () {
		var msg = "";
		var toWin = option.nbSets;
		// display detail
		for (var j=0; j< finishedSets.length; j++) {
			var set = finishedSets[j];
			msg += '<li class="nav-header">';
			msg += set.getName();
			msg += " - " + set.getWinner().getName();
			msg +="</li>";
				
			for(var i=0; i<option.players.length; i++) {
				var p = option.players[i];
				var win = this.getPlayerWin(p);
				msg +="<li>";
				if(toWin===win) {
					msg += "<strong>" + p.getName() + ": " + win + "</strong>";
				} else {
					msg += p.getName() + ": " + win;
				}
				msg += "<br>&nbsp;&nbsp;";
				msg += set.getPlayerSetScore(p);
				msg +="</li>";
			}
		}
		return msg;
	};

	// GameX01 getPlayers
	this.getPlayers = function() {
		return option.players;
	};

	// GameX01 getWinner
	this.getWinner = function() {
		return winner;
	};

	// GameX01 isFinished
	this.isFinished = function() {
		return (winner!==null);
	};

	// GameX01 getPlayerWin
	this.getPlayerWin = function(player) {
		var res = 0;
		for (var i=0; i<finishedSets.length; i++) {
			if (player===finishedSets[i].getWinner()) {
				res++;
			}
		}
		return res;
	};

	// GameX01 getCurrentLeg
	this.getCurrentSet = function() {
		return currentSet;
	};

	// GameX01 getLegs
	this.getSets = function() {
		var res = [];
		for (var i=0; i<finishedSets.length; i++) {
			res.push(finishedSets[i]);
		}
		res.push(currentSet);
		return res;
	};

	// GameX01 getOption
	this.getOption = function() {
		return option;
	};

	// GameX01 getId
	this.getId = function() {
		return id;
	};

	// GameX01 getName
	this.getName = function() {
		var res =  "Game #"+ (id+1) +" - " ;
		$.each(this.getPlayers(),function(index, p){
			if (index!==0) {
				res += ", ";
			}
			res += p.name;
		});

		return res;
	};

	// GameX01 start
	this.start = function() {
		if (x01.currentGame) {
			if (!x01.currentGame.close()) {
				return;
			}
		}
		// Create set
		currentSet = new SetX01(this);
		currentSet.start();

		this.display();
	};

	// GameX01 close
	this.close = function() {
		console.log("close " + this.getName());
		return true;
	};

	// GameX01 display
	this.display = function() {
		var $game = $("#game");
		// Clean old game
		$game.empty();

		// Title
		$(".breadcrumb li h1:first-child").empty().append(this.getName());
		$(".breadcrumb").removeClass("hide");

		// Create Sets
		$.each(this.getSets(), function(index, set){
			// Create Set
			var $set = set.display();

			// Append to Game
			$game.append($set);

		});
	};
}