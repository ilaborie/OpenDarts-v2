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
	var stats = {};

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
			var p = currentSet.getWinner();
			if(toWin===this.getPlayerWin(p)) {
				// Winner
				winner = p;
				currentSet = null;
				x01.finishedGames.push(this);
				x01.currentGame = null;
				this.displayFinished();

				return;
			}
			
			currentSet.displayFinished();
		}
	};

	this.startNewSet = function() {
		// Create a new Set
		currentSet = new SetX01(this);
		currentSet.start();

		// Display new set
		var $set = currentSet.display();
		$("#game").empty().append($set);
		tuningSize();

		// go ahead
		this.next();
	};

	// GameX01 displayFinished
	this.displayFinished = function() {
		$("#game").empty();
		var title = this.getName() +" Finished!";
		
		var msg = this.getTableStats();
		// Notifiy
		var game = this;
		openModalDialog(title, msg, {
			text: '<i class="icon-stop"></i> End',
			click: function() {
				$("#modalDialog").modal("hide");
				game.displayHistory();
			}
		});
	};
	this.displayHistory = function() {
		$("#history").empty().append(tmpl("GameHistory",{
			game: this
		}));
		//  Activation
		$("#history ul li:first-child").children("a").click();
	};
	this.getTableStats = function() {
		return tmpl("GameStats", {
			game: this,
			stats: stats,
			players: options.players,
			winner: winner
		});
	};
	// Update stats
	this.updateStats = function(player, json) {
		// Update values
		for (var key in json.gameStats) {
			if (!stats[key]) {
				stats[key] = {};
			}
			stats[key][player.uuid] = json.gameStats[key];
		}
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
		if (currentSet!==null) {
			res.push(currentSet);
		}
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
		var res =  "Game #"+ (id+1) +" <small>" ;
		$.each(this.getPlayers(),function(index, p){
			if (index!==0) {
				res += ", ";
			}
			res += p.name;
		});

		return res + "</small>";
	};

	// GameX01 start
	this.start = function() {
		if (x01.currentGame) {
			if (!x01.currentGame.close()) {
				return;
			}
		}
		$(".hero-unit").hide();

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

		// Create Sets
		$.each(this.getSets(), function(index, set){
			// Create Set
			var $set = set.display();

			// Append to Game
			$game.append($set);

		});
		tuningSize();
	};
}