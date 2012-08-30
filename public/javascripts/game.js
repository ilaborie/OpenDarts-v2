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
var openModalDialog = function(title,message, func) {
	$("#modalDialog .modal-header h3").html(title);
	$("#modalDialog .modal-body p").html(message);

	if ((typeof func !== "undefined")  && $.isFunction(fun)) {
		$("#modalDialogOk").show().unbind("click").click(function(e) {
			fun(e);
		});
	} else {
		$("#modalDialogOk").hide();
	}

	$("#modalDialog").on("shown", function() {
			$("#modalDialog .modal-footer a.btn").focus();
		}).modal("show");
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