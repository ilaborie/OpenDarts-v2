package controllers;

import static play.libs.Json.toJson;

import java.util.Arrays;
import java.util.List;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.index;
import ui.*;

public class Application extends Controller {

	public static Result index() {
		return ok(index.render("OpenDarts v2"));
	}

	public static Result getNotices() {
		List<Notice> notices = Arrays.asList(
				Notice.info("A boring information"),
				Notice.success("A wished success"),
				Notice.warn("Another alert to ignore"), 
				Notice.error("WTF ! "));

		return ok(toJson(notices));
	}

	public static Result getDialog() {
		TitledMessage msg = new TitledMessage("My Title","Lorem ipsum dolor sit ...");
		return ok(toJson(msg));	
	}

	public static Result getAutocompletion(String query) {
		List<String> values = Arrays.asList(query+'a',query+'b',query+'c');
		return ok(toJson(values));
	}
}