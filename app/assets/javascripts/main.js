// Initialize
$(function() {
	// TODO Check configuration

	// Navbar button
	$("#btnNewX01").click(showNewX01);

	// XXX auto start
	$("#btnNewX01").click();
});


/**
 * Create an UUID
 */
this.createUuid = function() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};