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
 * Show Finish
 * @param $elt the element
 * @param score the score
 * @param placement the placement:  top | bottom | left | right (Optional)
 */
var appendFinish = function ($elt, score, placement) {
        $.getJSON("x01/finish/" + score, null, function (json) {
                var $list = $("<ul />").addClass("finish").addClass("unstyled");

                // Create content
                if (json.length == 0) {
                    var $msg = $("<p/>").addClass("darts").addClass("text-warning").append(msg.get("x01.finish.noFinish"));
                    $list.append($("<li/>").append($msg));
                } else {
                    var $row;
                    var message;
                    var finish;
                    var $icon = null;
                    for (var i = 0; i < json.length; i++) {
                        $row = $("<p/>").addClass("darts");
                        // Create message
                        message = "";
                        finish = json[i];
                        message += finish.dart1;
                        if (finish.dart2 !== null) {
                            message += ", ";
                            message += finish.dart2;
                        }
                        if (finish.dart3 !== null) {
                            message += ", ";
                            message += finish.dart3;
                        }
                        // avoid => not
                        if ($.inArray("avoid", finish.modifiers) > 0) {
                            $row.addClass("muted");
                        } else {
                            $row.addClass("text-info");
                        }
                        $row.append(message);

                        // Add icons
                        if ($.inArray("pressure", finish.modifiers) > 0) {
                            $icon = $("<i/>").addClass("icon-fire");
                            $icon.attr("title", msg.get("x01.finish.pressure"));
                            $row.append("&nbsp;").append($icon);
                        }
                        if ($.inArray("noPressure", finish.modifiers) > 0) {
                            $icon = $("<i/>").addClass("icon-leaf");
                            $icon.attr("title", msg.get("x01.finish.noPressure"));
                            $row.append("&nbsp;").append($icon);
                        }
                        if ($.inArray("aggressive", finish.modifiers) > 0) {
                            $icon = $("<i/>").addClass("icon-exclamation-sign");
                            $icon.attr("title", msg.get("x01.finish.aggressive"));
                            $row.append("&nbsp;").append($icon);
                        }
                        $list.append($("<li/>").append($row));
                    }
                }

                // Update block
                var title = msg.get("x01.finish.title", {"score": score});
                $elt.find(".finishTitle").empty().html(title);
                $elt.find(".finishBody").empty().append($list);
            }
        )
        ;
    }
    ;
