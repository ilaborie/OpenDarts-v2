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
var msg = null;
var i18n = function (callback) {
    function Messages() {
        this.keys = {};
    }

    msg = new Messages();
    // Add get
    Messages.prototype.get = function (key, args) {
        var msg = this.keys[key];
        if (!msg) {
            msg = "!!! " + key + " !!!";
        }

        // check args
        if (args !== null && $.isPlainObject(args)) {
            var a = $.extend({"$": "$"}, args);
            for (var prop in a) {
                if (a.hasOwnProperty(prop)) {
                    var pattern = "$" + prop;
                    msg = msg.replace(pattern, a[prop]);
                }
            }
        }
        return msg;
    };
    // Add apply
    Messages.prototype.apply = function ($elt) {
        var msg = this;
        $elt.find("[data-i18n]").each(function (idx, e) {
            var key = $(e).attr("data-i18n");
            $(e).html(msg.get(key));
        });
        $elt.find("[data-i18n-title]").each(function (idx, e) {
            var key = $(e).attr("data-i18n-title");
            $(e).attr("title",msg.get(key));
        });
    };

    // Set lang
    var lang = localStorage.getItem("lang");
    if (!lang) {
        lang = "en";
    }
    switchLang(lang, callback);
};

var switchLang = function (lang, callback) {
    var path = "assets/i18n/" + lang + ".json";
    localStorage.setItem("lang", lang);
    $.getJSON(path, null, function (json) {
        $("#langFlag").attr("src", "assets/images/" + lang + ".png");
        msg.keys = json;

        // Apply to all page
        msg.apply($("body"));
        if (callback && $.isFunction(callback)) {
            callback();
        }
    });
};