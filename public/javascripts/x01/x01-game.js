/*
   Copyright 2012 Igor Laborie

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
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

	this.isStarted = function() {
		return currentSet.isStarted();
	};

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

	this.startNewSet = function() {
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
		this.displayHistory();
	};
	this.displayHistory = function() {
		var $list = $("<ul/>").addClass("nav").addClass("nav-tabs");
		// Add Game
		var $gameNav = $("<a/>", {
				"href": "#" + this.uuid,
				"data-toggle": "tab",
				"class": "navGame"
			}).append('<i class="icon-chevron-right"></i>')
				.append($("<span/>").addClass("badge badge-inverse").append(msg.get("label.game")))
				.append(" ")
				.append(this.getName());
		$list.append($("<li/>")
			.append($gameNav));

		// Add Sets
		var set;
		var leg;
		var $setNav;
		for (var i=0; i<this.getSets().length; i++) {
			set = this.getSets()[i];
			$setNav = $("<a/>", {
					"href": "#" + set.uuid,
					"data-toggle": "tab",
					"class": "navSet"
				}).append('<i class="icon-chevron-right"></i>')
					.append($("<span/>").addClass("badge badge-primary").append(msg.get("label.set")))
					.append(" ")
					.append(set.getName());
			$list.append($("<li/>")
				.append($setNav));
		}

		var $content = $("<div/>").addClass("tab-content");
		
		// Add Game
		var $gameContent = $("<div/>").addClass("tab-pane").attr("id", this.uuid);
		$gameContent.append($("<div/>").addClass("row-fluid")
			.append($("<div/>").addClass("span8")
				.append($("<h1/>").append(this.getName()))
				.append(this.getSetsDetail()))
			.append($("<div/>").addClass("span4").append(this.getTableStats())));
		$content.append($gameContent);

		var $setContent;

		var $legNav;
		var $legPill;

		var $legContent;
		var $legDetail;
		for (var k=0; k< this.getSets().length; k++) {
			set = this.getSets()[k];
			// Add Set
			$setDetail = $("<h2/>").append(set.getName());

			$setContent = $("<div/>").addClass("tab-pane").attr("id", set.uuid);
			$setContent.append($("<div/>").addClass("row-fluid")
				.append($("<div/>").addClass("span8")
					.append($("<h2/>").append(set.getName()))
					.append(set.getLegsDetail()))
				.append($("<div/>").addClass("span4").append(set.getTableStats())));

			$legNav = $("<ul/>").addClass("nav").addClass("nav-tabs");
			$legContent = $("<div/>").addClass("tab-content");
			// Leg detail
			for (var l = 0; l < set.getLegs().length; l++) {
				leg = set.getLegs()[l];

				// Nav
				$legPill = $("<li/>");
				if (l===0) {
					$legPill.addClass("active");
				}
				$legPill.append(
					$("<a/>", {
						"href": "#" + leg.uuid,
						"data-toggle": "tab",
						"class": "navLeg"
					}).append(leg.getNameWinner())
				);

				$legNav.append($legPill);

				// Content
				$legDetail = $("<div/>").addClass("tab-pane").attr("id", leg.uuid);
				if (l===0) {
					$legDetail.addClass("active");
				}
				$legDetail.append($("<div/>").addClass("row-fluid")
					.append($("<div/>").addClass("span8")
						.append($("<h3/>").append(leg.getName()))
						.append(leg.getTableScore(this.getPlayers(), false)))
					.append($("<div/>").addClass("span4").append(leg.getTableStats())));
				$content.append($legDetail);
				$legContent.append($legDetail);
			}

			$setContent.append(
				$("<div/>").addClass("tabbable").addClass("SetLegDetail")
					.append($legNav)
					.append($legContent)
			);

			$content.append($setContent);
		}

		var $history = $("<div>").addClass("tabtable tabs-left")
			.append($list)
			.append($content);

		$("#history").empty().append($history);

		//  Activation
		$("#history ul li:first-child").children("a").click();
		$("#history").show();
	};
	this.getSetsDetail = function() {
		var $table = $("<table/>").addClass("table").addClass("table-striped").addClass("table-condensed");
		var $head = $("<thead/>").append("<tr/>");
		var $body = $("<tbody/>");
		var player;
		var clazz;
		for (var i=0; i< options.players.length; i++) {
			player = options.players[i];
			clazz = "textRight";
			if (i!==0) {
				if (i<(options.players.length-1)) {
					clazz = "textCenter";
				} else {
					clazz = "textLeft";
				}
				$head.append(
					$("<td/>").addClass("textCenter").append(
						this.getPlayerWin(options.players[i-1]) + " - "  + this.getPlayerWin(player)
				));
			}
			if (winner.uuid === player.uuid) {
				$head.append($("<td/>").addClass(clazz).append($("<strong/>").append(player.getName())));
			} else {
				$head.append($("<td/>").addClass(clazz).append(player.getName()));
			}
		}
		var $row;
		var set;
		for (var j=0; j<this.getSets().length; j++) {
			set = this.getSets()[j];
			clazz = "textRight";
			$row = $("<tr/>");
			for (var k=0; k<options.players.length; k++) {
				player = options.players[k];
				if (k!==0) {
					if (k<(options.players.length-1)) {
						clazz = "textCenter";
					} else {
						clazz = "textLeft";
					}
					$row.append(
						$("<td/>").addClass("textCenter").append(" "));
				}
				$row.append($("<td/>").addClass(clazz).append(set.getPlayerWin(player)));
			}
			$body.append($row);
		}

		$table.append($head).append($body);
		return $table;
	};
	this.getTableStats = function() {
		var $table = $("<table/>").addClass("table").addClass("table-striped").addClass("table-condensed");
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
						this.getPlayerWin(options.players[i-1]) + " - "  + this.getPlayerWin(player)
				));
			}
			if (winner.uuid === player.uuid) {
				$head.append($("<td/>").addClass(clazz).append($("<strong/>").append(player.getName())));
			} else {
				$head.append($("<td/>").addClass(clazz).append(player.getName()));
			}
		}
		var $row;

		var currentValue = null;
		var bestValue = null;
		var $currentCell = null;
		var $bestCells = [];
		var comp;
		for(var key in stats) {
			clazz = "textRight";
			$row = $("<tr/>");
			$bestCells = [];
			bestValue = null;
			for (var k=0; k<options.players.length; k++) {
				player  = options.players[k];
				if (k%2===1) {
					clazz = "textLeft";
					$row.append($("<td/>").addClass("textCenter").append(getStatLabel(x01.stats.game, key)));
				}
				$currentCell = $("<td/>").addClass(clazz);
				currentValue = +stats[key][player.uuid];

				// compare
				comp = x01.stats.game.contents[key].sorter(currentValue, bestValue);
				if (comp >= 0) {
					if (comp>0) {
						$bestCells = [];
						bestValue = currentValue;
					}
					$bestCells.push($currentCell);
				}

				$row.append($currentCell.append(getStatsDisplayValue(currentValue)));
			}
			// Display best
			if ($bestCells.length>0) {
				for (var j=0; j<$bestCells.length; j++) {
					$bestCells[j].addClass("best");
				}
			}

			$body.append($row);
		}
		$table.append($head).append($body);
		return $("<p/>").append($table).html();
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

		var set = currentSet;
		if (set===null) {
			var len = finishedlegs.length;
			set = finishedlegs[len-1];
		}
		var leg = set.getCurrentLeg();

		// Display best
		var bestSpan = [];
		var currentSpan;
		var bestValue = null;
		var currentValue;
		var comp;
		var p;
		for (var stk in stats) {
			bestSpan = [];
			bestValue = null;

			for (var i=0; i< options.players.length; i++) {
				p = options.players[i];
				currentValue = +stats[stk][p.uuid]; // as Number
				currentSpan = $("#"+leg.getStatsPlayerId(p)+" ."+x01.stats.game.key+" ." + stk);
				
				// clear stats
				currentSpan.removeClass("best");

				// compare
				comp = x01.stats.game.contents[stk].sorter(currentValue, bestValue);
				if (comp >= 0) {
					if (comp>0) {
						bestSpan = [];
						bestValue = currentValue;
					}
					bestSpan.push(currentSpan);
				}
			}
			if (bestSpan.length>0) {
				for (var j=0; j<bestSpan.length; j++) {
					bestSpan[j].addClass("best");
				}
			}
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
		var res =  msg.get("label.game") + " #"+ (id+1) +" <small>" ;
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
		x01.currentGame = this;

		// Create set
		currentSet = new SetX01(this);
		currentSet.start();

		x01Stats.db.clear();
		this.display();

		this.next();
	};

	// GameX01 close
	this.close = function(callback) {
		var game = this;
		openModalDialog(msg.get("dia.game.close.title"), msg.get("dia.game.close.msg"), {
			text: '<i class="icon-white icon-stop"></i> ' + msg.get("btn.quit"),
			"class" : "btn-warning",
			click: function() {
				x01.currentGame = null;
				$("#modalDialog").unbind("hidden").on("hidden", callback);
				$("#modalDialog").modal("hide");
			}
		});
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