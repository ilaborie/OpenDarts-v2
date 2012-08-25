/**
 * EntryX01
 */
function EntryX01(parentLeg, index) {
	this.uuid = createUuid();
	this.index = index;
	var parent = parentLeg;

	var playerScore = {};
	var playerLeft = {};
	var nbDart;

	console.log("new entry: " + index);

	// EntryX01 getName
	this.getName = function() {
		return "#" + (index+1)*3;
	};

	// EntryX01 getScore
	this.getScore = function(player) {
		var res = playerScore[player];
		if (typeof res !== "number") {
			res = "&nbsp;";
		} else if (typeof nbDart !== "number") {
			res = "+" + nbDart +" (" + (index*3 + nbDart) +")";
		}
		return res;
	};

	// EntryX01 getLeft
	this.getLeft = function(player) {
		var res = playerLeft[player];
		if (typeof res !== "number") {
			res = "&nbsp;";
		} else if (res<0) {
			res = "???";
		}
		return res;
	};
}