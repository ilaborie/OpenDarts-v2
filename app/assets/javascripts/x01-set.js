
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

	// SetX01 getPlayerWin
	this.getPlayerWin = function(player) {
		var res = 0;
		for (var i=0; i<finishedlegs.length; i++) {
			if (player===finishedlegs[i]) {
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
		var $set = $('<div/>').addClass("set").attr("id","set-"+this.getId());

		// Set title
		var $title = $('<li/>').append($("<h2/>").append(this.getName())).append($("<h2/>").addClass("divider").append("&gt;"));
		$(".breadcrumb").append($title);

		// Create Legs
		$.each(this.getLegs(), function (idx, leg){
			var $leg = leg.display();

			$set.append($leg);
		});

		return $set;
	};
}