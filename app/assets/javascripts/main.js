// Initialize
$(function() {
	// Show Notices Button
	$("#btnNotices").click(function() {
		$("#notices").empty()
		$.get("/notices", function(data) {
			$.each(data, function(index, notice) {
				createNotice(notice);
			});
		});
	});

	// Show Modal Dialog Button
	$("#btnDialog").click( function() {
		$.get("/dialog", function(data) {
			openModalDialog(data.title,data.message)
		});
	});

	// Plug autocomplete
	$("#fldAutoComplete").typeahead( {
		source: findAutocompleteValues
	});
});

// Create a dynamic notice
var createNotice = function(notice) {
  $("#notices").append(
  	$("<div>").html("<a class=\"close\" data-dismiss=\"alert\" href=\"#\">&times;</a>")
		.append(notice.message)
		.addClass("alert fade in alert-" + notice.kind)
	);
};

// Open Modal
var openModalDialog = function(title,message) {
  $("#modalDialog .modal-header h3").text(title);
  $("#modalDialog .modal-body p").text(message);
  $("#modalDialog").modal();
};

// Autocompletion
var findAutocompleteValues = function(query, process) {
	$.get("/autocomplete?query=" +query, function(data) {
		process(data)
	});
};