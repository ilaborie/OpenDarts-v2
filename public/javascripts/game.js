// Define some default objets
// Utilities
if (typeof String.prototype.startsWith != "function") {
	// see below for better implementation!
	String.prototype.startsWith = function (str) {
		return this.indexOf(str) === 0;
	};
}

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
        onError: fun
    });
};

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
        onError: fun
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
	var $div = $("<div>").html("<a class=\"close\" data-dismiss=\"alert\" href=\"#\">&times;</a>")
		.append(notice.message).addClass("alert fade in alert-" + notice.kind);
	$("#notices").append($div);
	$div.fadeIn(100).delay(5000).fadeOut(400, function() {
		$div.remove();
		if ($("#notices div").length===0) {
			$("#notices").empty();
		}
	});
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
			text: "Close",
			"data-dismiss" : "modal"
		}));
	} else if ($.isArray(buttons)) {
		for(var i=0; i< buttons.length; i++) {
			$buttonsBar.append(createButton(buttons[i]));
		}
	} else {
		$buttonsBar.append(createButton(buttons));
	}
	$("#modalDialog").unbind("shown").on("shown",function(){
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
		var p;
		var player;
		for (var i=0; i<players.db.length; i++) {
			p = players.db[i];
			if (p.uuid === playerId) {
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
	}
};
// Load to DB
var playersDB = localStorage.getItem("players");
if (playersDB !== null) {
	players.db = JSON.parse(playersDB);
}

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
	this.getComputer = function() {
		if (this.com) {
			return '<i class="badge">'+this.comLevel+'</i> play ' + this.comTarget;
		} else {
			return '<i class="icon-ban-circle"></i>';
		}
	};
}
// Dialog for player selection
$("#diaPlayerSelect .input").keyup(function() {
	var prefix = $(this).val();
	updatePlayerList(prefix);
});
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
				$("<a/>").attr("href", "#").append(player.getName()).click(function () {
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
				})
			)
		);
	});
};

$("#diaPlayerSelect").on("shown", function() {
	$("#diaPlayerSelect .input").focus();
});
var selectPlayer = function(callback) {
	updatePlayerList(null);

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