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

$(function(){
	// i18n
	i18n(initAdmin);

	// Clear Lang
	$("#Lang").click(function(){
		localStorage.removeItem("lang");
	});

});

var initAdmin = function() {
	// Load Players
	loadPlayer();

	// Load Entries
	// TODO
};


var loadPlayer = function() {
	var $body = $("#Players table tbody");
	$body.empty();
	
	var list = players.getByPrefix(null);
	$.each(list, function(idx, player){
		$body.append($("<tr/>").attr("id", player.uuid)
			.append($("<td/>").append(player.getDisplayName()))
			.append($("<td/>").append(
				$("<button/>").addClass("btn btn-danger btn-mini")
					.append('<i class="icon-white icon-trash"></i>')
					.click(function() {
						players.deletePlayer(player);
						loadPlayer();				
					})))
			);
	});
}