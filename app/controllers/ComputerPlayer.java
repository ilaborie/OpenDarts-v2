/*
 * 
 */
package controllers;

import static play.libs.Json.toJson;

import java.io.IOException;

import models.x01.ComputerThrow;
import models.x01.ComputerThrowRequest;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;

import play.Logger;
import play.mvc.BodyParser;
import play.mvc.BodyParser.Json;
import play.mvc.Controller;
import play.mvc.Result;
import services.x01.ComputerPlayerThrow;

/** The Class ComputerPlayer. */
public class ComputerPlayer extends Controller {

	/** The Constant mapper. */
	private static final ObjectMapper mapper = new ObjectMapper();

	/** Gets the throw.
	 * 
	 * @return the throw */
	@BodyParser.Of(Json.class)
	public static Result getThrow() {
		JsonNode json = request().body().asJson();
		try {
			ComputerThrowRequest throwRequest = mapper.readValue(json, ComputerThrowRequest.class);
			if (Logger.isDebugEnabled()) {
				Logger.debug("Request: " + throwRequest);
			}

			// Result
			ComputerPlayerThrow playerThrow = new ComputerPlayerThrow(throwRequest);
			ComputerThrow comThrow = playerThrow.getComputerThrow();
			if (Logger.isDebugEnabled()) {
				Logger.debug("Done: " + comThrow);
			}
			return ok(toJson(comThrow));
		} catch (IOException e) {
			Logger.error("Oops!", e);
			return badRequest(json);
		}
	}
}
