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