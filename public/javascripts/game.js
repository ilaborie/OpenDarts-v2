// Define some default objets

// Utilities

$.postJSON = function(url, data, callback) {
    return jQuery.ajax({
        'type': 'POST',
        'url': url,
        'contentType': 'application/json',
        'data': JSON.stringify(data),
        'dataType': 'json',
        'success': callback
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
	$("#modalDialog .modal-body p").html(message);

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
}

var Philou = new Player("Philou", "The Failure");

var HAL = new Player("HAL",null);
HAL.com = true;
HAL.comLevel = 7;
//HAL.comTarget = 19;

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