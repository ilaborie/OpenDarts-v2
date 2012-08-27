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
		$(".breadcrumb").addClass("hide");
		var msg = "" + this.getName() +" Finished!";
		msg += "Winner: " + this.getWinner();
		// TODO
		alert(msg);
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
		console.log("start " + this.getName());
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