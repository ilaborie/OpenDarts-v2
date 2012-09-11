package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.index;
import views.html.admin;

/**
 * The Class Application.
 */
public class Application extends Controller {

	/**
	 * Index.
	 *
	 * @return the result
	 */
	public static Result index() {
		return ok(index.render("OpenDarts v2"));
	}

	/**
	 * Index.
	 *
	 * @return the result
	 */
	public static Result admin() {
		return ok(admin.render("OpenDarts v2"));
	}

}