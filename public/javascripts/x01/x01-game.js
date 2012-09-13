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
		var title = this.getName() +" Finished!";
		var $msg = $("<table/>").addClass("table").addClass("table-striped").addClass("table-condensed");
		var $head = $("<thead/>").append("<tr/>");
		var $body = $("<tbody/>");
		var player;
		var clazz;
		for (var i=0; i< options.players.length; i++) {
			player = options.players[i];
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
			for (var k=0; k<options.players.length; k++) {
				player  = options.players[k];
				clazz = "textRight";
				if (k%2===1) {
					clazz = "textLeft";
					$row.append($("<td/>").addClass("textCenter").append(getStatLabel(x01.stats.game, key)));
				}
				$row.append($("<td/>").addClass(clazz).append(stats[key][player.uuid]));
			}
			$body.append($row);
		}
		$msg.append($head).append($body);

		// Notifiy
		openModalDialog(title, $msg);
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

	// Get set score
	this.getGameScore = function () {
		var msg = "";
		var toWin = option.nbSets;
		// display detail
		for (var j=0; j< finishedSets.length; j++) {
			var set = finishedSets[j];
			msg += '<li class="nav-header">';
			msg += set.getNameWinner();
			msg +="</li>";

			for(var i=0; i<option.players.length; i++) {
				var p = option.players[i];
				var win = set.getPlayerWin(p);

				msg +="<li>";
				msg += p.getName() + ": " + win;
				msg += "&nbsp;&nbsp;";
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