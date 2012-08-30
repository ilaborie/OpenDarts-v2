
// Initialize
$(function() {
	// TODO Check configuration

	// Navbar button
	$("#btnNewX01").click(showNewX01);

	// XXX auto start
	$("#btnNewX01").click();

	$("#btnTest").click(function() {
		createNotice({
			message: "plop",
			kind: "error"
		});
	});
});
