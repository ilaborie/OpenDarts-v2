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
// Define some default objets
// Utilities
if (typeof String.prototype.startsWith != "function") {
	// see below for better implementation!
	String.prototype.startsWith = function (str) {
		return this.indexOf(str) === 0;
	};
}

// JQuery end event
var stopEvent = function(event) {
	if (event) {
		if ($.isFunction(event.stopPropagation)) event.stopPropagation();
		if ($.isFunction(event.stopImmediatePropagation)) event.stopImmediatePropagation();
		if ($.isFunction(event.preventDefault)) event.preventDefault();
	}
	return false;
}


// JQuery post JSON
$.postJSON = function(url, data, callback, onError) {
	var fun = doOnError;
	if (onError && $.isFunction(onError)) {
		fun = onError;
	}
    return jQuery.ajax({
        type: "POST",
        url: url,
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        success: callback,
        timeout: 3000,
		tryCount : 0,
		retryLimit : 3,
        error: fun
    });
};

// JQuery delete JSON
$.deleteJSON = function(url, data, callback, onError) {
	var fun = doOnError;
	if (onError && $.isFunction(onError)) {
		fun = onError;
	}
    return jQuery.ajax({
        type: "DELETE",
        url: url,
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        success: callback,
        timeout: 3000,
		tryCount : 0,
		retryLimit : 3,
        error: fun
    });
};

var doOnError = function(xhr, textStatus, errorThrown) {
	var msg = "Error: " +textStatus +"\n"+errorThrown;
	console.log(msg);
	createNotice({
		kind: "error",
		message: msg
	});
};

/**
 * Create a dynamic notice
 */
var createNotice = function(notice) {
	$(".top-right").notify({
		type: notice.kind,
		message: { html: notice.message }
	}).show();
};

/**
 * Open Modal
 */
var openModalDialog = function(title, message, buttons) {
	$("#modalDialog .modal-header h3").html(title);
	$("#modalDialog .modal-body p").empty().append(message);

	var $buttonsBar = $("#modalDialog .modal-footer");
	$buttonsBar.empty();
	if (typeof buttons === "undefined") {
		$buttonsBar.append(createButton({
			text: msg.get("btn.close"),
			"data-dismiss" : "modal"
		}));
	} else if ($.isArray(buttons)) {
		for(var i=0; i< buttons.length; i++) {
			$buttonsBar.append(createButton(buttons[i]));
		}
	} else {
		$buttonsBar.append(createButton(buttons));
	}
	$("#modalDialog").one("shown",function(){
		$("#modalDialog .modal-footer button:last-child").focus();
	}).modal("show");
};

/**
 * Create a button
 */
var createButton = function(props) {
	var text  = props.text;
	var click = props.click;
	var cssClass = "btn";
	if (props["class"]) {
		cssClass += " " +  props["class"];
	}

	var attrs = {};
	for (var p in props) {
		if ((p!== "text") && (p!== "click") && (p!== "class")) {
			attrs[p] = props[p];
		}
	}

	$btn = $("<button/>", attrs).addClass(cssClass).html(text);
	if (typeof click === "function") {
		$btn.click(click);
	}

	return $btn;
};

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

var scollToBottom = function() {
	if ($(".score-left-container").is(":visible")) {
		var h = $(document).height();
		$("body").scrollTop(h);
	}
};


// TODO Board & Darts



// Player
var players = {
	db: [],
	addPlayer: function(player) {
		players.db.push({
			uuid: player.uuid,
			name: player.name,
			surname: player.surname,
			com: player.com,
			comLevel: player.comLevel,
			comTarget: player.comTarget
		});
		// Store to DB
		localStorage.setItem("players", JSON.stringify(players.db));
	},
	update: function(player) {
		var p;
		for (var i=0; i<players.db.length; i++) {
			p = players.db[i];
			if (p.uuid === player.uuid) {
				p.name = player.name;
				p.surname = player.surname;
				p.com = player.com;
				p.comLevel = player.comLevel;
				p.comTarget = player.comTarget;
			}
		}
		// Store to DB
		localStorage.setItem("players", JSON.stringify(players.db));
	},
	getPlayer: function(playerId) {
		var pId = playerId;
		if (pId.lastIndexOf("_")!=-1) {
			var idx = pId.lastIndexOf("_");
			pId = pId.substring(0,idx);
		}
		var p;
		var player;
		for (var i=0; i<players.db.length; i++) {
			p = players.db[i];
			if (p.uuid === pId) {
				player = new Player(p.name, p.surname);
				player.uuid = p.uuid;
				player.com = p.com;
				player.comLevel = p.comLevel;
				player.comTarget = p.comTarget;
				return player;
			}
		}
		player = new Player("Mr. X", null);
		this.addPlayer(player);
		return player;
	},
	getByPrefix : function(prefix) {
		var res = [];
		var player;
		var p;
		for (var i=0; i<players.db.length; i++) {
			p = players.db[i];
			if (prefix===null || prefix==="" || p.name.startsWith(prefix)) {
				player = new Player(p.name, p.surname);
				player.uuid = p.uuid;
				player.com = p.com;
				player.comLevel = p.comLevel;
				player.comTarget = p.comTarget;
				res.push(player);
			}
		}
		return res;
	},
	getPlayerByNameSurname : function(name, surname) {
		var player;
		var p;
		for (var i=0; i<players.db.length; i++) {
			p = players.db[i];
			if ((p.name === name) && (p.surname===surname)) {
				player = new Player(p.name, p.surname);
				player.uuid = p.uuid;
				player.com = p.com;
				player.comLevel = p.comLevel;
				player.comTarget = p.comTarget;
				return player;
			}
		}
		player = new Player(name, surname);
		this.addPlayer(player);
		return player;
	},
	deletePlayer : function(player) {
		var tab = [];
		var p;
		for (var i=0; i<players.db.length; i++) {
			p = players.db[i];
			if (p.uuid !== player.uuid) {
				tab.push (p);
			}
		}
		players.db = tab;
		// Store to DB
		localStorage.setItem("players", JSON.stringify(players.db));
	}
};
// Migration to v1
var upgradeToV1 = function() {
	var p;
	var level;
	var target;
	for (var i=0; i< players.db.length;i++) {
		p = players.db[i];
		if (p.com) {
			level = p.comLevel;
			target = p.comTarget;
			if (typeof level === "string") {
				p.comLevel = parseInt(level,10);
			}
			if (target === "20") {
				p.comTarget = "T20";
			} else if (target === "19") {
				p.comTarget = "T19";
			}
		}
	}
	localStorage.setItem("players", JSON.stringify(players.db));
	localStorage.setItem("version", "1");
};

// Load to DB
var playersDB = localStorage.getItem("players");
if (playersDB !== null) {
	players.db = JSON.parse(playersDB);

	var version = localStorage.getItem("version");
	if (!version) {
		upgradeToV1();
	}
}

function Player(name, surname) {
	this.uuid = createUuid();
	this.name = name;
	this.surname = surname;

	this.com = false;
	this.comLevel = 0;
	this.comTarget = "T20";

	// Name
	this.getName = function() {
		var res;
		if (this.name) {
			res = this.name;
		} else {
			res = this.id;
		}
		return res;
	};
	this.getFullName = function() {
		var res = this.getName();
		if (this.surname) {
			res +=  " «"+this.surname+"»";
		}
		return res;
	};
	this.getDisplayName = function() {
		if (this.com) {
			return '<i class="icon-cog"></i> '+msg.get("abbrv.lvl")+' <i class="badge">'+this.comLevel+'</i> play ' + this.comTarget;
		} else {
			return '<i class="icon-user"></i> ' + this.getFullName();

		}
	};
}
// Dialog for player selection
var updatePlayerList = function(prefix) {
	// unselect all & clear list
	$("#diaPlayerSelect .btn-primary").attr("disabled","disabled");
	$("#diaSelectedPlayer").val("");
	$("#diaPlayerSelect .playerList").empty();

	// Fill list
	var p = players.getByPrefix(prefix);
	$.each(p, function(idx, player) {
		$("#diaPlayerSelect .playerList").append(
			$("<li/>").append(
				$("<a/>").attr("href", "#").append(player.getDisplayName()).click(function (event) {
					if ($(this).parent().hasClass("active")) {
						$("#diaSelectedPlayer").val("");
						$("#diaPlayerSelect .btn-primary").attr("disabled","disabled");
						$("#diaPlayerSelect .playerList li").removeClass("active");
					} else {
						$("#diaSelectedPlayer").val(player.uuid);
						$("#diaPlayerSelect .btn-primary").removeAttr("disabled");
						$("#diaPlayerSelect .playerList li").removeClass("active");
						$(this).parent().addClass("active");
					}
					return true;
				})
			)
		);
	});
};
var diaSelectPlayerLoaded = false;
var selectPlayer = function(callback) {
	if (!diaSelectPlayerLoaded) {
		diaSelectPlayerLoaded = true;

		$("#diaPlayerSelect .input").keyup(function() {
			var prefix = $(this).val();
			updatePlayerList(prefix);
		});
		$("#diaPlayerSelect").on("shown", function() {
			$("#diaPlayerSelect .input").focus();
		});
	}
	updatePlayerList($("#diaPlayerSelect .input").val());

	$("#diaPlayerSelect .btn-primary").unbind("click").click(function(e) {
		var playerId = $("#diaSelectedPlayer").val();
		if (playerId!=="") {
			var player = players.getPlayer(playerId);
			$("#diaPlayerSelect").modal("hide");
			callback(player);
		}
	});
	$("#diaPlayerSelect").modal("show");
};

// Create player Dialog

$("#diaPlayerCreation").on("shown", function(event) {
	$("#playerName").focus();
});
var diaCreatePlayerLoaded = false;
var createPlayer = function(callback) {
	if (!diaCreatePlayerLoaded) {
		diaCreatePlayerLoaded = true;
		$("#isComputer").toggleButtons({
			label: {
				enabled: msg.get("btn.on"),
				disabled: msg.get("btn.off")
			},
			onChange: function($el, status) {
				if (status) {
					$(".playerComputer").show();
					$(".humanPlayer").hide();
				} else {
					$(".playerComputer").hide();
					$(".humanPlayer").show();
				}
			}
		});
	}
	// initial state
	if ($("#isComputer input").is(":checked")) {
		$(".playerComputer").show();
		$(".humanPlayer").hide();
	} else {
		$(".playerComputer").hide();
		$(".humanPlayer").show();
	}
	
	$("#diaPlayerCreation .btn-success").one("click", function(event){
		doCreatePlayer(event, callback);
	});
	$("#diaPlayerCreation form").one("submit", function(event){
		doCreatePlayer(event, callback);
	});
	$("#diaPlayerCreation").modal("show");
};

var doCreatePlayer = function(event, callback) {
	var name;
	var surname;

	var isComputer = $("#isComputer input").is(":checked");
	if (isComputer) {
		name = "Ishur #" + $("#playerLevel").val();
		surname = $("#diaPlayerCreation .btnTarget .active").html();
	} else {
		name = $("#playerName").val();
		surname = $("#playerSurname").val();
		if (!name) {
			name = "Mr. X";
		}
	}
	
	// Create player
	var player;
	// Computer field
	if (isComputer) {
		player = players.getPlayerByNameSurname(name, surname);
		player.com = true;
		player.comLevel = parseInt($("#playerLevel").val(),10);
		player.comTarget = $("#diaPlayerCreation .btnTarget .active").html();
		players.update(player);
	} else {
		player = players.getPlayerByNameSurname(name, surname);
	}
	$("#diaPlayerCreation").modal("hide");

	// Callback
	if (callback && $.isFunction(callback)) {
		callback(player);
	}

	return stopEvent(event);
};