// Define some default objets

// Utilities


/**
 * Create an UUID
 */
this.createUuid = function() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

/**
 * isInteger
 */
var isInteger = function(s) {
  return ((""+s).search(/^-?[0-9]+$/) === 0);
};


// TODO Board & Darts



// Player
var players = {};


function Player(name, surname) {
	this.uuid = createUuid();
	this.name = name;
	this.surname = surname;

	this.com = false;
	this.comLevel = 0;
	this.comTarget = 20;

	// Name
	this.getName = function() {
		var res;
		if (this.name && this.surname) {
			res = this.name + " «"+this.surname+"»";
		} else if (this.name) {
			res = this.name;
		} else {
			res = this.id;
		}
		return res;
	};
}

var Philou = new Player("Philou", "The Failure");

var HAL = new Player("HAL",null);
HAL.com = true;
HAL.comLevel = 7;

players.Philou = Philou;
players.HAL = HAL;

// Get a Player
var getPlayer = function(playerId) {
	var res = players[playerId];
	if (!res) {
		// Create a default player
		res = {
			id: playerId,
			name: "Mr. X"
		};
	}
	return res;
};