/*
 * 
 */
package controllers;

import static play.libs.Json.toJson;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.Callable;

import models.x01.ComputerThrow;
import models.x01.ComputerThrowRequest;
import models.x01.StatElement;
import models.x01.StatKey;
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

import com.google.common.base.Strings;

import entities.StatsEntryX01;

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

	/** Load stats entry x01.
	 * 
	 * @return the result */
	public static Result loadStatsEntryX01() {
		Promise<List<StatsEntryX01>> promise = Akka.future(new Callable<List<StatsEntryX01>>() {
			@Override
			public List<StatsEntryX01> call() throws Exception {
				return StatsEntryX01.find.all();
			}
		});

		// Result
		return async(promise.map(new Function<List<StatsEntryX01>, Result>() {
			@Override
			public Result apply(List<StatsEntryX01> list) {
				return ok(toJson(list));
			}
		}));
	}

	/** Clear stats entry x01.
	 * 
	 * @return the result */
	public static Result clearStatsEntryX01() {
		if (logger.isInfoEnabled()) {
			logger.info("Drop all entries");
		}
		StatsEntryX01.cleanAll();
		return ok();
	}

	/** Push throw.
	 * 
	 * @return the result */
	@BodyParser.Of(Json.class)
	public static Result pushThrow() {
		JsonNode json = request().body().asJson();
		try {
			StatsEntryX01 entry = mapper.readValue(json, StatsEntryX01.class);
			entry = StatsEntryX01.createOrUpdate(entry);
			if (logger.isTraceEnabled()) {
				logger.trace("New entry: " + entry.getId());
			}
			// Clean if win
			if (models.x01.Status.win.equals(entry.getStatus())) {
				StatsEntryX01.cleanGames(entry.getTimestamp());
			}

			Promise<StatsX01> stats = loadStats(entry);

			// Result
			return async(stats.map(STATS_JSON));
		} catch (IOException e) {
			Logger.error("Oops!", e);
			return badRequest(json);
		}
	}

	/**
	 * Destroy stats.
	 *
	 * @return the result
	 */
	public static Result destroyStats() {
		JsonNode json = request().body().asJson();
		try {
			StatsEntryX01 entry = mapper.readValue(json, StatsEntryX01.class);
			StatsEntryX01.find.byId(entry.getId()).delete();
			
			Promise<StatsX01> stats = loadStats(entry);
			// Result
			return async(stats.map(STATS_JSON));
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

			// Load stats
			Promise<StatsX01> stats = loadStats(entry);

			// Result
			return async(stats.map(STATS_JSON));
		} catch (IOException e) {
			Logger.error("Oops!", e);
			return badRequest(json);
		}
	}

	/** Load stats.
	 * 
	 * @param player the player
	 * @param game the game
	 * @param set the set
	 * @param leg the leg
	 * @param entry the entry
	 * @return the promise */
	private static Promise<StatsX01> loadStats(
			final StatsEntryX01 entry) {
		return Akka.future(new Callable<StatsX01>() {
			@Override
			public StatsX01 call() throws Exception {
				String player = entry.getPlayer();
				String game = entry.getGame();
				String set = entry.getSet();
				String leg = entry.getLeg();
				
				StatsX01 stats = new StatsX01();
				stats.setPlayer(player);
				stats.setTimestamp(entry.getTimestamp());
				stats.setId(entry.getId());

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
							StatElement.create(StatKey.avg3Dart,
									gameAvg != null ? Float.valueOf(gameAvg.floatValue() * 3f)
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
							StatElement.create(StatKey.avg3Dart,
									setAvg != null ? Float.valueOf(setAvg.floatValue() * 3f)
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
							StatElement.create(StatKey.avg3Dart,
									legAvg != null ? Float.valueOf(legAvg.floatValue() * 3f)
											: null)
							));
				}
				return stats;
			}
		});
	}
}
