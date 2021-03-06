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
 * Handel x01 Games
 */

var Philou = players.getPlayerByNameSurname("Philou", "The Failure");
var HAL = players.getPlayerByNameSurname("Ishur #7", "T20");
HAL.com = true;
HAL.comLevel = 7;
players.update(HAL);

// Status
var x01 = {
    options: {
        score: 501,
        players: [Philou, HAL],
        handicap: {},
        nbSets: 1,
        nbLegs: 1
    },
    currentGame: null,
    finishedGames: [],
    hasLast: function () {
        return (localStorage.getItem("x01LastOptions") !== null);
    },
    getLast: function () {
        var opt = localStorage.getItem("x01LastOptions");
        if (opt !== null) {
            var o = JSON.parse(opt);
            var option = {
                score: o.score,
                players: [],
                nbSets: o.nbSets,
                nbLegs: o.nbLegs
            };
            for (var i = 0; i < o.players.length; i++) {
                option.players.push(players.getPlayer(o.players[i]));
            }
            return option;
        } else {
            return null;
        }
    },
    setLast: function (option) {
        var opt = {
            score: option.score,
            players: [],
            nbSets: option.nbSets,
            nbLegs: option.nbLegs
        };
        for (var i = 0; i < option.players.length; i++) {
            opt.players.push(option.players[i].uuid);
        }

        localStorage.setItem("x01LastOptions", JSON.stringify(opt));
    }
};

// Scaffolding
var tuningSize = function () {
    var w = $(window).width();
    var h = $(window).height();

    // Resize table
    var diff = $(".score-left-container").height() + 3 * ($(".score-left").height());
    $(".leg .data").height(h - diff);
};

var isWideScreen = function () {
    var w = $(window).width();
    return (w >= 980);
};

/**
 * Shortcut
 */
// Input Shortcurt definition
var shortcuts = [];
shortcuts[112] = 0;	    // F1
shortcuts[113] = 26;	// F2
shortcuts[114] = 41;	// F3
shortcuts[115] = 45;	// F4
shortcuts[116] = 60;	// F5
shortcuts[117] = 81;	// F6
shortcuts[118] = 85;	// F7
shortcuts[119] = 100;	// F8
shortcuts[120] = function (entry) { // F9
    var leg = entry.getParent();
    var player = entry.getLastPlayer();
    var left = leg.getPlayerScore(player);

    var $input = $("#" + leg.getInputPlayerId(player));
    var value = $input.val();

    if (isInteger(value)) {
        var val = parseInt(value, 10);
        var score = (left - val);
        $input.val(score);
    }
    // Click on submit button
    $("#" + entry.getParent().getSubmitPlayer(player)).click();
};
shortcuts[121] = function (entry, callback) {
    processFinish(1, entry, callback);
}; // F10
shortcuts[122] = function (entry, callback) {
    processFinish(2, entry, callback);
}; // F11
shortcuts[123] = function (entry, callback) {
    processFinish(3, entry, callback);
}; // F12

// Finish
var processFinish = function (nbDart, entry, callback) {
    var leg = entry.getParent();
    var player = entry.getLastPlayer();
    var $input = $("#" + leg.getInputPlayerId(player));
    var left = leg.getPlayerScore(player);

    if (couldFinish(left, nbDart)) {
        $input.val(left);
        entry.nbDart = nbDart;
        // Click on submit button
        $("#" + entry.getParent().getSubmitPlayer(player)).click();
    }
};

// Show new X01
var showNewX01 = function (event) {
    if (x01.currentGame) {
        x01.currentGame.close(function () {
            showNewX01(event);
        });
        return stopEvent(event);
    }

    // Cleaning the space
    $(".hero-unit").hide();
    $("#history").hide();
    $("#game").empty();

    // Show dialog with options
    var lastOption;
    if (x01.currentGame) {
        lastOption = x01.currentGame.getOption();
    } else {
        lastOption = x01.getLast();
        if (lastOption === null) {
            lastOption = x01.options;
        }
    }

    var $nbLeg = $("#nbLeg");
    var $nbSet = $("#nbSet");
    var $startScore = $("#startScore");

    $nbLeg.keypress(function (event) {
        if (event.which === 13) {
            launchX01(event);
        }
        return true;
    });
    $nbSet.keypress(function (event) {
        if (event.which === 13) {
            launchX01(event);
        }
        return true;
    });
    $startScore.keypress(function (event) {
        if (event.which === 13) {
            launchX01(event);
        }
        return true;
    });

    // Set Options
    $startScore.val(lastOption.score);
    $nbLeg.val(lastOption.nbLegs);
    $nbSet.val(lastOption.nbSets);

    if (lastOption.nbLegs > 1) {
        $(".nbSet").show();
    } else {
        $(".nbSet").hide();
        $nbSet.val(1);
    }

    $nbLeg.on("input", function () {
        var nbLeg = parseInt($("#nbLeg").val(), 10);
        if (nbLeg > 1) {
            $(".nbSet").show();
        } else {
            $(".nbSet").hide();
            $nbSet.val(1);
        }
    });

    var $dialog = $("#newX01Dialog");
    // Display Players
    $dialog.find(".players tbody").empty();
    var player;
    var len = lastOption.players.length;
    var $row;
    for (var i = 0; i < len; i++) {
        player = lastOption.players[i];
        $row = getPlayerRow(i, player);
        $dialog.find(".players tbody").append($row);
    }
    updatePlayersTableField();
    $("#btnX01AddPlayer").unbind("click").click(function (event) {
        selectPlayer(function (player) {
            var nbPlayer = $dialog.find(".players tbody tr").size();
            $row = getPlayerRow(nbPlayer - 1, player);
            $dialog.find(".players tbody").append($row);
            updatePlayersTableField();
        });
        return stopEvent(event);
    });
    $("#btnX01CreatePlayer").unbind("click").click(function (event) {
        createPlayer(function (player) {
            var nbPlayer = $dialog.find(".players tbody tr").size();
            $row = getPlayerRow(nbPlayer - 1, player);
            $dialog.find(".players tbody").append($row);
            updatePlayersTableField();
        });
        return stopEvent(event);
    });

    // Bind Click
    $dialog.find("form").unbind("submit").submit(launchX01);

    // Show Dialog
    $dialog.show();
    $startScore.focus();

    return stopEvent(event);
};

// Set player in dialog
var getPlayerRow = function (idx, player) {
    return tmpl("PlayerTableRow", {
        player: player,
        position: (idx + 1)
    });
};

var updatePlayersTableField = function () {
    var $rows = $("#newX01Dialog").find(".players tbody tr");
    var len = $rows.size();
    var $tr;
    $rows.each(function (idx, tr) {
        $tr = $(tr);
        $tr.find("td:eq(0)").empty().append(idx + 1);
        if (idx === 0) {
            $tr.find("a.up").hide();
        } else {
            $tr.find("a.up").show();
        }
        if (idx === (len - 1)) {
            $tr.find("a.down").hide();
        } else {
            $tr.find("a.down").show();
        }
        // Bind remove
        $tr.find("a.remove").click(function () {
            var $row = $(this).parent().parent();
            $row.remove();
            updatePlayersTableField();
            return stopEvent(event);
        });
        // Bind up
        $tr.find("a.up").click(function () {
            var $row = $(this).parent().parent();
            $row.prev().before($row);
            updatePlayersTableField();
            return stopEvent(event);
        });
        // Bind down
        $tr.find("a.down").click(function () {
            var $row = $(this).parent().parent();
            $row.next().after($row);
            updatePlayersTableField();
            return stopEvent(event);
        });
    });
};

// Quick Launch
var quickLaunch = function (event) {
    $("#newX01Dialog").hide();
    $(".hero-unit").hide();
    $("#history").hide();
    var options = x01.getLast();

    // Check pvp
    var tmp = [];
    $.each(options.players, function (idx, p) {
        var id = p.uuid;
        if ($.inArray(id, tmp) !== -1) {
            p.uuid += "_" + idx;
        }
        tmp.push(p.uuid);
    });

    var game = new GameX01(options);
    if (x01.currentGame) {
        x01.currentGame.close(function () {
            game.start();
        });
    } else {
        // Start
        game.start();
    }

    return stopEvent(event);
};

var checkQuickLaunch = function () {
    if (x01.hasLast()) {
        $("#btnQuick").show()
            .unbind("click").click(quickLaunch);
    }
};
checkQuickLaunch();

// Launch x01
var launchX01 = function (event) {
    // new option
    var newX01Options = {};
    newX01Options.score = parseInt($("#startScore").val(), 10);
    newX01Options.nbSets = parseInt($("#nbSet").val(), 10);
    newX01Options.nbLegs = parseInt($("#nbLeg").val(), 10);

    // Players
    newX01Options.players = [];
    newX01Options.handicap = {};

    var $dialog = $("#newX01Dialog");

    var tmp = [];
    $dialog.find(".playersTable tbody tr").each(function (idx, tr) {
        var id = $(tr).attr("id");
        var p = players.getPlayer(id);
        if ($.inArray(id, tmp) !== -1) {
            p.uuid += "_" + idx;
        }
        tmp.push(p.uuid);
        newX01Options.players.push(p);

        // Handicap
        var hd = $(tr).find("input").val();
        if (typeof hd !== "undefined") {
            try {
                var hand = getInputPlayerValue(hd);
                if (hand > 0) {
                    newX01Options.handicap[p.uuid] = hand;
                }
            } catch (e) {
                createNotice({
                    kind: "error",
                    message: msg.get("error.invalid.handicap", {handicap: hd})
                });
                stopEvent(event);
            }
        }
    });

    if (newX01Options.players.length < 2) {
        createNotice({
            kind: "error",
            message: msg.get("error.invalid.nb.player")
        });
        return stopEvent(event);
    }

    $dialog.hide();
    newX01Options.stats = x01.options.stats;

    // QuickLaunch
    x01.setLast(newX01Options);

    // Create the new Game
    var game = new GameX01(newX01Options);
    checkQuickLaunch();

    // Start
    game.start();

    return stopEvent(event);
};

// Validate Input
var analyseInputX01 = function (entry, value, score, callback) {
    try {
        var val = getInputPlayerValue(value, 10);
        if ((val > score) || (val === (score - 1))) {
            callback("broken");
        } else if (val === score) {
            if ((typeof entry.nbDart === "number") && (entry.nbDart > 0)) {
                callback("win", entry.nbDart);
            } else {
                setTimeout(function() {
                    getNbDart(val, callback);
                },250)
            }
        } else {
            callback("normal");
        }
    } catch (e) {
        console.log("Invalid input: " + e);
    }
};

var validatePlayerThrow = function (event) {
    var $this = $(this);
    var value = $this.val();
    var status = validatePlayerValue(value);

    event.target.setCustomValidity(status);
};

var getInputPlayerValue = function (value) {
    var val;
    if ($.isNumeric(value)) {
        val = parseInt(value, 10);
    } else {
        val = 0;
        // Try a+b+v+c+
        var elts = value.split("+");
        for (var i = 0; i < elts.length; i++) {
            var e = $.trim(elts[i]);
            if ($.isNumeric(e)) {
                val += parseInt(e, 10);
            } else {
                var firstChar = e.charAt(0);
                var rest = e.substring(1);
                if ($.isNumeric(rest) && (firstChar === 't' || firstChar === 'T')) {
                    val += 3 * parseInt(rest, 10);
                } else if ($.isNumeric(rest) && (firstChar === 'd' || firstChar === 'D')) {
                    val += 2 * parseInt(rest, 10);
                } else {
                    throw msg.get("error.invalid.input");
                }
            }
        }
    }
    return val;
};

var validatePlayerValue = function (value) {
    var status = "";
    if (value === "") {
        status = msg.get("error.no.score");
    } else {
        try {
            var val = getInputPlayerValue(value);
            if (isNaN(val)) {
                status = "?";
            } else if (val < 0) {
                status = msg.get("error.negative");
            } else if (val > 180 || val === 172 || val === 173 || val === 175 || val === 176 || val === 178 || val === 179) {
                status = msg.get("error.cheater");
            } else {
                status = "";
            }
        } catch (e) {
            status = e;
        }
    }
    return status;
};

// get NbDarts to finish
var getNbDart = function (score, func) {
    var buttons = [];

    // Broken
    var brokenFunction = function () {
        unbindButtons();
        bootbox.hideAll();
        setTimeout(function () {
            func("broken");
        }, 100);
    };
    $(document).bind("keypress.0", brokenFunction);
    buttons.push({
        label: msg.get("dia.x01.nbdart.broken"),
        "class": "btn-danger btn-broken",
        callback: brokenFunction
    });

    // do in 3 darts
    var dart3Function = function () {
        unbindButtons();
        bootbox.hideAll();
        setTimeout(function () {
            func("win", 3);
        }, 100);
    };
    $(document).bind("keypress.3", dart3Function);
    buttons.push({
        label: msg.get("dia.x01.nbdart.3"),
        "class": "btn-success btn-three",
        callback: dart3Function
    });
    // do in 2 darts
    if (couldFinish(score, 2)) {
        var dart2Function = function () {
            unbindButtons();
            bootbox.hideAll();
            setTimeout(function () {
                func("win", 2);
            }, 100);
        };
        $(document).bind("keypress.2", dart2Function);
        buttons.push({
            label: msg.get("dia.x01.nbdart.2"),
            "class": "btn-success btn-two",
            callback: dart2Function
        });
    }
    // do in 1 darts
    if (couldFinish(score, 1)) {
        var dart1Function = function () {
            unbindButtons();
            bootbox.hideAll();
            setTimeout(function () {
                func("win", 1);
            }, 100);
        };
        $(document).bind("keypress.1", dart1Function);
        buttons.push({
            label: msg.get("dia.x01.nbdart.1"),
            "class": "btn-success btn-two",
            callback: dart1Function
        });
    }
    // Cancel
    buttons.push({
        label: msg.get("btn.cancel"),
        callback: function () {
            setTimeout(function () {
                func();
            }, 100);
        }
    });

    var dia = bootbox.dialog(msg.get("dia.x01.nbdart.message", {"score": score}), buttons, {
        animate: false,
        header: msg.get("dia.x01.nbdart.title"),
        headerCloseButton: ""
    });
};
var unbindButtons = function () {
    $(document).unbind("keypress.0")
        .unbind("keypress.1")
        .unbind("keypress.2")
        .unbind("keypress.3");
};

// Could finish
var couldFinish = function (score, nbDart) {
    var result = false;

    if (nbDart === 1) {
        result = ((score % 2) === 0) && ((score == 50) || (score <= 40));
    } else {
        var base = ((nbDart - 1) * 60) + 39;
        var tab = [base + 1, base + 2, base + 5, base + 8, base + 11];
        result = (score < base) || ($.inArray(score, tab) !== -1);
    }

    return result;
};

var isSpecial = function (left) {
    return (left !== 0) && (left % 111 === 0);
};