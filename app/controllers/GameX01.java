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
package controllers;

import static play.libs.Json.toJson;

import java.util.concurrent.Callable;

import models.x01.ComputerThrow;
import models.x01.ComputerThrowRequest;
import models.x01.StatsX01;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;

import play.Logger;
import play.Logger.ALogger;
import play.libs.Akka;
import play.libs.F.Function;
import play.libs.F.Promise;
import play.mvc.BodyParser;
import play.mvc.BodyParser.Json;
import play.mvc.Controller;
import play.mvc.Result;
import services.x01.ComputerPlayerThrow;

/** The Class ComputerPlayer. */
public class GameX01 extends Controller {

	/** The logger. */
	static ALogger logger = Logger.of("x01");

	/** The Constant mapper. */
	static final ObjectMapper mapper = new ObjectMapper();

	/** The Constant STATS_JSON. */
	static final Function<StatsX01, Result> STATS_JSON = new Function<StatsX01, Result>() {
		@Override
		public Result apply(StatsX01 comThrow) {
			return ok(toJson(comThrow));
		}
	};

	/** Gets the computer player throw.
	 * 
	 * @return the computer player throw */
	@BodyParser.Of(Json.class)
	public static Result getComputerPlayerThrow() {
		final JsonNode json = request().body().asJson();
		Promise<ComputerThrow> promise = Akka.future(new Callable<ComputerThrow>() {
			@Override
			public ComputerThrow call() throws Exception {
				ComputerThrowRequest throwRequest = mapper.readValue(json, ComputerThrowRequest.class);
				if (logger.isDebugEnabled()) {
					logger.debug("Request: " + throwRequest);
				}
				ComputerPlayerThrow playerThrow = new ComputerPlayerThrow(throwRequest);
				ComputerThrow comThrow = playerThrow.getComputerThrow();
				if (logger.isDebugEnabled()) {
					logger.debug("Done: " + comThrow);
				}
				return comThrow;
			}
		});
		// Result
		return async(promise.map(new Function<ComputerThrow, Result>() {
			@Override
			public Result apply(ComputerThrow comThrow) {
				return ok(toJson(comThrow));
			}
		}));
	}
}
