
// Initialize
$(function() {
	// TODO Check configuration

	// Navbar button
	$("#btnNewX01").click(showNewX01);

	// Admin GameX01Stats
	var statsTable =$("#StatsEntryX01").dataTable({
		sDom: "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
		bProcessing: true,
		sAjaxSource: "/admin/StatsEntryX01",
        bScrollInfinite: true,
        bScrollCollapse: false,
        sScrollY: "600px",
		sAjaxDataProp: "",
		aoColumns: [
			{ mData: "id", sTitle: "ID"},
			{ mData: "timestamp", sTitle: "Date"},
			{ mData: "game", sTitle: "Game"},
			{ mData: "set", sTitle: "Set"},
			{ mData: "leg", sTitle: "Leg"},
			{ mData: "entry", sTitle: "Entry"},
			{ mData: "entryIndex", sTitle: "Index"},
			{ mData: "player", sTitle: "Player"},
			{ mData: "score", sTitle: "Score"},
			{ mData: "left", sTitle: "Left"},
			{ mData: "status", sTitle: "Status"},
			{ mData: "nbDarts", sTitle: "NB Darts"},
			{ mData: "legNbDarts", sTitle: "Leg Darts"}
		]
	});
	$.extend( $.fn.dataTableExt.oStdClasses, {
		sWrapper: "dataTables_wrapper form-inline"
	});

	$("#btnClearStatsEntryX01").click(function(e) {
		$.getJSON("/admin/ClearStatsEntryX01");
	});
	$("#btnRefreshStatsEntryX01").click(function(e) {
		statsTable.fnClearTable();
		statsTable.fnAddData();
	});
});