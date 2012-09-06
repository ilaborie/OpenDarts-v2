/*
 * 
 */
package controllers;

import static play.libs.Json.toJson;

import java.io.IOException;
import java.util.Arrays;

import models.x01.ComputerThrow;
import models.x01.ComputerThrowRequest;
import models.x01.StatElement;
import models.x01.StatKey;
import models.x01.Stats;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;

import com.google.common.base.Strings;

import play.Logger;
import play.Logger.ALogger;
import play.mvc.BodyParser;
import play.mvc.BodyParser.Json;
import play.mvc.Controller;
import play.mvc.Result;
import services.x01.ComputerPlayerThrow;
import entities.StatsEntryX01;

/** The Class ComputerPlayer. */
public class GameX01 extends Controller {

	private static ALogger logger = Logger.of("x01");

	/** The Constant mapper. */
	private static final ObjectMapper mapper = new ObjectMapper();

	/** Gets the computer player throw.
	 * 
	 * @return the computer player throw */
	@BodyParser.Of(Json.class)
	public static Result getComputerPlayerThrow() {
		JsonNode json = request().body().asJson();
		try {
			ComputerThrowRequest throwRequest = mapper.readValue(json, ComputerThrowRequest.class);
			if (logger.isDebugEnabled()) {
				logger.debug("Request: " + throwRequest);
			}

			// Result
			ComputerPlayerThrow playerThrow = new ComputerPlayerThrow(throwRequest);
			ComputerThrow comThrow = playerThrow.getComputerThrow();
			if (logger.isDebugEnabled()) {
				logger.debug("Done: " + comThrow);
			}

			return ok(toJson(comThrow));
		} catch (IOException e) {
			logger.error("Oops!", e);
			return badRequest(json);
		}
	}

	@BodyParser.Of(Json.class)
	public static Result pushThrow() {
		JsonNode json = request().body().asJson();
		try {
			StatsEntryX01 entry = mapper.readValue(json, StatsEntryX01.class);
			entry = StatsEntryX01.create(entry);
			if (logger.isTraceEnabled()) {
				logger.trace("New entry: " + entry.getId());
			}
			// Clean if win
			if (models.x01.Status.win.equals(entry.getStatus())) {
				StatsEntryX01.cleanGames(entry.getTimestamp());
			}

			String player = entry.getPlayer();
			String game = entry.getGame();
			String set = entry.getSet();
			String leg = entry.getLeg();
			Stats stats = loadStats(player, game, set, leg);
			stats.setTimestamp(entry.getTimestamp());

			return ok(toJson(stats));
		} catch (IOException e) {
			Logger.error("Oops!", e);
			return badRequest(json);
		}
	}

	/** Gets the stats.
	 * 
	 * @return the stats */
	@BodyParser.Of(Json.class)
	public static Result getStats() {
		JsonNode json = request().body().asJson();
		try {
			StatsEntryX01 entry = mapper.readValue(json, StatsEntryX01.class);

			String player = entry.getPlayer();
			String game = entry.getGame();
			String set = entry.getSet();
			String leg = entry.getLeg();

			// Load stats
			Stats stats = loadStats(player, game, set, leg);

			return ok(toJson(stats));
		} catch (IOException e) {
			Logger.error("Oops!", e);
			return badRequest(json);
		}
	}

	private static Stats loadStats(String player, String game, String set, String leg) {
		Stats stats = new Stats();

		stats.setPlayer(player);

		// Game stats
		if (!Strings.isNullOrEmpty(game)) {
			Float gameAvg = StatsEntryX01.avgDartInGame(player, game);
			stats.setGameStats(Arrays.asList(
					StatElement.create(StatKey.count60, StatsEntryX01.countInGame(60, player, game)),
					StatElement.create(StatKey.count100, StatsEntryX01.countInGame(100, player, game)),
					StatElement.create(StatKey.count140, StatsEntryX01.countInGame(140, player, game)),
					StatElement.create(StatKey.count180, StatsEntryX01.countInGame(180, player, game)),
					StatElement.create(StatKey.plus60, StatsEntryX01.rangeInGame(60, 100, player, game)),
					StatElement.create(StatKey.plus100, StatsEntryX01.rangeInGame(100, 181, player, game)),
					StatElement.create(StatKey.avgDart, gameAvg != null ? gameAvg : null),
					StatElement.create(StatKey.avg3Dart, gameAvg != null ? Float.valueOf(gameAvg.floatValue() * 3f)
							: null),
					StatElement.create(StatKey.avgLeg, StatsEntryX01.avgLegInGame(player, game)),
					StatElement.create(StatKey.bestLeg, StatsEntryX01.bestLegInGame(player, game)),
					StatElement.create(StatKey.bestOut, StatsEntryX01.bestOutInGame(100, player, game))
					));
		}

		// Set stats
		if (!Strings.isNullOrEmpty(set)) {
			Float setAvg = StatsEntryX01.avgDartInSet(player, set);
			stats.setSetStats(Arrays.asList(
					StatElement.create(StatKey.avgDart, setAvg != null ? setAvg : null),
					StatElement.create(StatKey.avg3Dart, setAvg != null ? Float.valueOf(setAvg.floatValue() * 3f)
							: null),
					StatElement.create(StatKey.avgLeg, StatsEntryX01.avgLegInSet(player, set)),
					StatElement.create(StatKey.bestLeg, StatsEntryX01.bestLegInSet(player, set)))
					);
		}

		// Leg stats
		if (!Strings.isNullOrEmpty(leg)) {
			Float legAvg = StatsEntryX01.avgDartInLeg(player, leg);
			stats.setLegStats(Arrays.asList(
					StatElement.create(StatKey.avgDart, legAvg != null ? legAvg : null),
					StatElement.create(StatKey.avg3Dart, legAvg != null ? Float.valueOf(legAvg.floatValue() * 3f)
							: null)
					));
		}
		return stats;
	}
}
