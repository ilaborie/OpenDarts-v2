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
 * LegX01 Object
 */
function LegX01(parentSet) {
    this.uuid = createUuid();
    var id;
    var parent = parentSet;
    var players = [];

    // Status
    var winner = null;
    var playersScore = {};
    var entries = [];
    var stats = {};

    var currentEntry = null;

    var previousLeg = parentSet.getCurrentLeg();

    if (!previousLeg) {
        // This is the first set
        id = 0;
        for (var i = 0; i < parent.getPlayers().length; i++) {
            players.push(parent.getPlayers()[i]);
        }
    } else {
        id = previousLeg.getId() + 1;
        // define players orders
        for (var j = 1; j < previousLeg.getPlayers().length; j++) {
            players.push(previousLeg.getPlayers()[j]);
        }
        players.push(previousLeg.getPlayers()[0]);
    }

    this.isStarted = function () {
        return currentEntry.isStarted();
    };

    // LegX01 next
    this.next = function () {
        if (currentEntry && !currentEntry.isFinished()) {
            // Continue entry
            var leg = this;
            currentEntry.next(function () {
                leg.afterEntryNext();
            });
        } else if (currentEntry) {
            // Create a new Entry
            currentEntry.close();
            currentEntry = new EntryX01(this, currentEntry.index + 1);
            entries.push(currentEntry);

            // Display new Entry
            $("#" + this.uuid + " .tableRowInput")
                .before(currentEntry.display());

            this.next();
        }
    };

    // Handle entry.next result
    this.afterEntryNext = function () {
        var lastPlayer = currentEntry.getLastPlayer();
        var status = currentEntry.getStatus(lastPlayer);

        // Update player score
        var score = currentEntry.getLeftAsInt(lastPlayer);
        playersScore[lastPlayer.uuid] = score;

        // Update Left
        $("#" + this.getLeftPlayerId(lastPlayer)).html(score);
        //window.scrollTo(0,document.body.scrollHeight);

        // Winning
        if ("win" === status) {
            // Winner
            winner = lastPlayer;
            parent.next();
        } else {
            this.next();
        }
    };
    // if the leg is decisive
    this.isDecisive = function () {
        var nbPlayer = players.length;
        var nbLegToWin = this.getParent().getNbLegToWin();
        var nbFinishedLeg = this.getParent().getNbFinishedLegs();
        return (nbPlayer * (nbLegToWin - 1)) == nbFinishedLeg;
    };

    this.getNbTurnToFinish = function (player) {
        var min = 500;
        var p;
        var avg;
        var score;
        var current;
        for (var i = 0; i < players.length; i++) {
            p = players[i];
            if (p.uuid != player.uuid) {
                avg = parseFloat($("#" + this.getStatsPlayerId(p) + " .setStats .avg3Dart").html());
                if (!isNaN(avg) && avg > 0) {
                    score = playersScore[p.uuid];
                    current = score / avg;
                    if (current < min) {
                        min = current;
                    }
                }
            }
        }
        return min;
    };

    this.applyChange = function (entry, player) {
        var score = parent.getOption().score;
        if (parent.getOption().handicap && parent.getOption().handicap[player.uuid]) {
            score += parent.getOption().handicap[player.uuid];
        }

        var e;
        var st;
        var entriesToDestroy = [];
        var winEntry = null;
        var previousEntry = null;
        for (var i = 0; i < entries.length; i++) {
            e = entries[i];
            st = e.getStatus(player);

            if (winEntry !== null) {
                entriesToDestroy.push(e);
            }

            e.updatePreviousLeft(player, score);
            if (st === "normal") {
                score -= e.getScoreAsInt(player);
                if (score <= 0 || score === 1) { // Invalid score
                    $("#" + e.getScoreId(player)).addClass("needEdit");
                } else {
                    $("#" + e.getScoreId(player)).removeClass("needEdit");
                }

                e.updateScoreLeftDisplay(player, score);
            } else if (st === "broken") {
                e.updateScoreLeftDisplay(player, score);
            } else if (st === "win") {
                winEntry = e;
                e.updateScoreLeftDisplay(player, 0);
                if (i > 0) {
                    previousEntry = entries[i - 1];
                }
            } else {
                // Not yet played
                e.updateScoreLeft(player, score);
            }
        }

        // Handle wining entry
        if (winEntry !== null) {
            currentEntry = winEntry;
            var p;
            var flag = false;
            for (var k = 0; k < players.length; k++) {
                p = players[k];
                if (flag) {
                    winEntry.destroyPlayer(p);
                    if (previousEntry !== null) {
                        playersScore[p.uuid] = previousEntry.getLeftAsInt(p);// FIXME display left instead of score
                        $("#" + this.getLeftPlayerId(p)).html(playersScore[p.uuid]);
                    } else {
                        var sc = parent.getOption().score;
                        if (parent.getOption().handicap[p.uuid]) {
                            sc += parent.getOption().handicap[p.uuid];
                        }
                        playersScore[p.uuid] = sc;
                        $("#" + this.getLeftPlayerId(p)).html(sc);
                    }
                } else if (p.uuid === player.uuid) {
                    flag = true;
                }
            }
        }

        // Destroy obsolete entries
        for (var j = 0; j < entriesToDestroy.length; j++) {
            // Update score
            entriesToDestroy[j].destroy();
        }

        // update Leg player score
        playersScore[player.uuid] = score;
        $("#" + this.getLeftPlayerId(player)).html(score);
    };

    // LegX01 displayFinished
    this.displayFinished = function () {
        var title = msg.get("dia.x01.leg.finish.title", {name: this.getName()});

        var finishMessage = this.getTableStats();

        // Notifiy
        var set = parent;
        openModalDialog(title, finishMessage, {
            text: '<i class="icon-white icon-step-forward"></i> ' + msg.get("dia.x01.leg.finish.next"),
            "class": "btn-primary",
            click: function () {
                $("#modalDialog").modal("hide");
                set.startNewLeg();
            }
        });
    };
    // Table stats
    this.getTableStats = function () {
        var $table = $("<table/>").addClass("table").addClass("table-striped").addClass("table-condensed");
        var $head = $("<thead/>").append("<tr/>");
        var $body = $("<tbody/>");
        var player;
        var clazz;
        for (var i = 0; i < parent.getParent().getPlayers().length; i++) {
            player = parent.getParent().getPlayers()[i];
            clazz = "textRight";
            if (i !== 0) {
                if (i < (parent.getParent().getPlayers().length - 1)) {
                    clazz = "textCenter";
                } else {
                    clazz = "textLeft";
                }
                $head.append(
                    $("<td/>").addClass("textCenter").append(
                        this.getPlayerWin(parent.getParent().getPlayers()[i - 1]) + " - " + this.getPlayerWin(player)
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
        for (var key in stats) {
            clazz = "textRight";
            $row = $("<tr/>");
            $bestCells = [];
            bestValue = null;
            for (var k = 0; k < parent.getParent().getPlayers().length; k++) {
                player = parent.getParent().getPlayers()[k];
                if (k !== 0) {
                    if (k < (parent.getParent().getPlayers().length - 1)) {
                        clazz = "textCenter";
                    } else {
                        clazz = "textLeft";
                    }
                    $row.append($("<td/>").addClass("textCenter").append(getStatLabel(x01.stats.leg, key)));
                }
                $currentCell = $("<td/>").addClass(clazz);
                currentValue = +stats[key][player.uuid];

                // compare
                comp = x01.stats.leg.contents[key].sorter(currentValue, bestValue);
                if (comp >= 0) {
                    if (comp > 0) {
                        $bestCells = [];
                        bestValue = currentValue;
                    }
                    $bestCells.push($currentCell);
                }

                $row.append($currentCell.append(getStatsDisplayValue(currentValue)));
            }
            // Display best
            if ($bestCells.length > 0) {
                for (var j = 0; j < $bestCells.length; j++) {
                    $bestCells[j].addClass("best");
                }
            }

            $body.append($row);
        }
        $table.append($head).append($body);
        return $("<p/>").append($table).html();
    };
    // Update stats
    this.updateStats = function (player, json) {
        // Update values
        for (var key in json.legStats) {
            if (!stats[key]) {
                stats[key] = {};
            }
            stats[key][player.uuid] = json.legStats[key];
        }

        // Update Parent
        parent.updateStats(player, json);

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

            for (var i = 0; i < players.length; i++) {
                p = players[i];
                currentValue = +stats[stk][p.uuid]; // as Number
                currentSpan = $("#" + this.getStatsPlayerId(p) + " ." + x01.stats.leg.key + " ." + stk);

                // clear stats
                currentSpan.removeClass("best");

                // compare
                comp = x01.stats.leg.contents[stk].sorter(currentValue, bestValue);
                if (comp >= 0) {
                    if (comp > 0) {
                        bestSpan = [];
                        bestValue = currentValue;
                    }
                    bestSpan.push(currentSpan);
                }
            }
            if (bestSpan.length > 0) {
                for (var j = 0; j < bestSpan.length; j++) {
                    bestSpan[j].addClass("best");
                }
            }
        }
    };

    // get leg score
    this.getLegScore = function () {
        return currentEntry.getNbDartsPlayed();
    };
    this.getPlayerWin = function (player) {
        if (winner.uuid === player.uuid) {
            return '<span class="badge">' + this.getLegScore() + '</span>';
        } else {
            return this.getPlayerScore(player);
        }
    };

    // LegX01 getPlayers
    this.getPlayers = function () {
        return players;
    };

    // LegX01 getId
    this.getId = function () {
        return id;
    };

    // LegX01 getName
    this.getName = function () {
        var res = msg.get("label.leg") + " #" + (id + 1) + " <small>";
        $.each(this.getPlayers(), function (index, p) {
            if (index !== 0) {
                res += ", ";
            }
            res += p.name;
        });
        return res + "</small>";
    };
    this.getNameWinner = function () {
        return msg.get("label.leg") + " #" + (id + 1);
    };
    this.getParent = function () {
        return parent;
    };
    // LegX01 getWinner
    this.getWinner = function () {
        return winner;
    };

    // LegX01 isFinished
    this.isFinished = function () {
        return (winner !== null);
    };

    // LegX01 getScore
    this.getPlayerScore = function (player) {
        return playersScore[player.uuid];
    };

    // LegX01 getEntires
    this.getEntries = function () {
        return entries;
    };
    // Current entry
    this.getCurrentEntry = function () {
        return currentEntry;
    };

    // LegX01 start
    this.start = function () {
        // Score
        for (var idx = 0; idx < players.length; idx++) {
            p = players[idx];
            var sc = parent.getOption().score;
            if (parent.getOption().handicap && parent.getOption().handicap[p.uuid]) {
                sc += parent.getOption().handicap[p.uuid];
            }
            playersScore[p.uuid] = sc;
        }

        // Entry
        currentEntry = new EntryX01(this, 0);
        entries.push(currentEntry);
    };

    // LegX01 display
    this.display = function () {
        // Players
        var ps = parent.getParent().getPlayers();
        //if (ps.length!==2) {
        //	throw "Expected 2 players !";
        //}

        // Players Elements
        var playersHeader = [];
        var playersFinishHelper = [];
        var playersStats = [];
        var playersScore = [];

        for (var idx = 0; idx < players.length; idx++) {
            p = players[idx];

            playersHeader[p.uuid] = this.getPlayerHead(p);
            playersFinishHelper[p.uuid] = this.getPlayerFinishHelper(p);
            playersStats[p.uuid] = this.getPlayerStats(p);
            playersScore[p.uuid] = this.getPlayerLeft(p);
        }

        // div Table
        var $divTable = $("<div>").addClass("data");
        $divTable.append(this.getTableScore(ps, true));

        var $leg;
        if (ps.length === 2) {
            // 2 Players layout
            var p1 = ps[0];
            var p2 = ps[1];
            // Col 1
            var $p1Col = $("<div/>")
                .append(playersHeader[p1.uuid])
                .append(playersFinishHelper[p1.uuid])
                .append(playersStats[p1.uuid]);

            // Col 2
            var $p2Col = $("<div/>")
                .append(playersHeader[p2.uuid])
                .append(playersFinishHelper[p2.uuid])
                .append(playersStats[p2.uuid]);

            // Score Left
            var $legLeft = $("<div/>").addClass("container").addClass("score-left-container")
                .append(playersScore[p1.uuid].addClass("span6"))
                .append(playersScore[p2.uuid].addClass("span6"));

            // Assemble Leg
            $leg = $('<div/>').addClass("leg").addClass("row-fluid").attr("id", this.uuid)
                .append($p1Col.addClass("span3"))
                .append($divTable.addClass("span6"))
                .append($p2Col.addClass("span3"))
                .append($legLeft);
        } else {
            // Accordion columns
            var $playersCol = $("<div/>").addClass("accordion");
            var $elt;
            for (var idx2 = 0; idx2 < players.length; idx2++) {
                p = players[idx2];
                $elt = $("<div/>").addClass("accordion-group")
                    .append($("<div/>").addClass("accordion-heading").append(playersHeader[p.uuid]))
                    .append($("<div/>").addClass("accordion-body").addClass("collapse")
                        .append(playersFinishHelper[p.uuid])
                        .append(playersStats[p.uuid]));

                $playersCol.append($elt);
            }
            // Add Score Left
            var $tableLeft = $("<tfoot/>");
            var $tr = $("<tr/>");
            for (var idx3 = 0; idx3 < ps.length; idx3++) {
                p = ps[idx3];
                if (idx3 !== 0) {
                    $tr.append($("<th/>").addClass("cell cellDartsHide").append(" "));
                }

                $tr.append($("<th/>")
                    .attr("colspan", 2)
                    .addClass("score-left")
                    .attr("id", this.getLeftPlayerId(p))
                    .append(this.getPlayerScore(p)));
            }
            $divTable.children("table").append($tableLeft.append($tr));

            // Assemble leg
            $leg = $('<div/>').addClass("leg").addClass("row-fluid").attr("id", this.uuid)
                .append($playersCol.addClass("span3"))
                .append($divTable.addClass("span9"));
        }

        return $leg;
    };

    // Create Table
    this.getTableScore = function (allPlayers, input) {
        return tmpl("LegTable", {
            leg: this,
            players: parent.getParent().getPlayers(),
            firstPlayer: players[0],
            score: parent.getOption().score,
            showInput: input,
            handicap: parent.getOption().handicap
        });
    };

    // Input player id
    this.getInputPlayerId = function (player) {
        return "input" + this.uuid + "-player" + player.uuid;
    };
    // Left player id
    this.getLeftPlayerId = function (player) {
        return "left" + this.uuid + "-player" + player.uuid;
    };
    this.getHeadPlayerId = function (player) {
        return "head" + this.uuid + "-player" + player.uuid;
    };
    this.getStatsPlayerId = function (player) {
        return "stats" + this.uuid + "-player-" + player.uuid;
    };
    this.getSubmitPlayer = function (player) {
        return "submit" + this.uuid + "-player" + player.uuid;
    };
    this.getFinishHelperId = function (player) {
        return "finish" + this.uuid + "-player" + player.uuid;
    };

    // Players Head
    this.getPlayerHead = function (player) {
        return tmpl("LegHeadPlayer", {
            leg: this,
            player: player,
            firstPlayer: players[0],
            nbSets: parent.getOption().nbSets,
            nbLegs: parent.getOption().nbLegs,
            setWin: parent.getParent().getPlayerWin(player),
            legWin: parent.getPlayerWin(player)
        });
    };

    // Player Finish Helper
    this.getPlayerFinishHelper = function (player) {
        if (player.com) {
            return "";
        }
        return tmpl("LegFinishHelperPlayer", {
            leg: this,
            player: player
        });
    };

    this.getPlayerLeft = function (player) {
        return $("<div/>").addClass("score-left")
            .attr("id", this.getLeftPlayerId(p))
            .append(this.getPlayerScore(p));
    };

    // Player stats
    this.getPlayerStats = function (player) {
        var $game = displayStats(x01.stats.game);
        var $set = displayStats(x01.stats.set);
        var $leg = displayStats(x01.stats.leg);

        return $("<div/>").addClass("stats").addClass("visible-desktop").attr("id", this.getStatsPlayerId(player))
            .append('<button class="close pull-right">&times;</button>')
            .append($game)
            .append($set)
            .append($leg);
    };

    // Retrieve stats
    this.requestStats = function (statQuery, player) {
        var leg = this;
        x01Stats.db.getPlayerStats(statQuery.game, statQuery.set, statQuery.leg, player, function (json) {
            leg.getParent().updateStats(player, json);
            handleStats(leg.getStatsPlayerId(player), json);
        });
    };
}