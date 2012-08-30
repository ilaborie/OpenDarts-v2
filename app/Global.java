import static play.libs.Json.toJson;
import models.dartboard.Dartboard;
import models.ui.Notice;
import models.x01.BestDart;
import play.Application;
import play.GlobalSettings;
import play.mvc.Http.RequestHeader;
import play.mvc.Result;
import play.mvc.Results;

/** The Class Global. */
public class Global extends GlobalSettings {

	/*
	 * (non-Javadoc)
	 * 
	 * @see play.GlobalSettings#onStart(play.Application)
	 */
	@Override
	public void onStart(Application app) {
		BestDart.load(app);
		Dartboard.load(app);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see play.GlobalSettings#onError(play.mvc.Http.RequestHeader, java.lang.Throwable)
	 */
	@Override
	public Result onError(RequestHeader header, Throwable t) {
		if (header.accept().contains("application/json")) {
			Notice error = Notice.error(t.getLocalizedMessage());
			return Results.internalServerError(toJson(error));
		}

		return super.onError(header, t);
	}

}