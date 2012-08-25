// Define some default objets

// TODO Board & Darts



// Player
var players = {};


function Player(id, name, surname) {
	this.id = id;
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

var Philou = new Player("1", "Philou", "The Failure");

var HAL = new Player("c7", "HAL",null);
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