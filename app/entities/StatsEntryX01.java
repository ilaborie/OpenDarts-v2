package entities;

import static org.apache.commons.lang.StringEscapeUtils.escapeSql;

import java.io.Serializable;
import java.util.Calendar;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.Table;

import models.x01.Status;
import play.Logger;
import play.Logger.ALogger;
import play.db.ebean.Model;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.SqlQuery;
import com.avaje.ebean.SqlRow;
import com.google.common.collect.Lists;

/** The Class StatsEntryX01. */
@Entity
@Table(name = "stats_entry_x01")
public class StatsEntryX01 extends Model implements Serializable {

	/** The Constant serialVersionUID. */
	private static final long serialVersionUID = 7743573025107081171L;
	private static ALogger logger = Logger.of("x01");

	/** The finder. */
	public static Finder<Long, StatsEntryX01> find =
			new Finder<Long, StatsEntryX01>(Long.class, StatsEntryX01.class);

	/** Creates the entry.
	 * 
	 * @param entry the entry
	 * @return the stats entry x01 */
	public static StatsEntryX01 create(StatsEntryX01 entry) {
		entry.save();
		return entry;
	}

	/** Count in game.
	 * 
	 * @param score the score
	 * @param player the player
	 * @param game the game
	 * @return the int */
	public static Integer countInGame(int score, String player, String game) {
		String sql = String.format(
				"SELECT count(score) as count FROM stats_entry_x01 WHERE player='%s' AND game='%s' AND  score=%s",
				escapeSql(player), escapeSql(game), Integer.valueOf(score));
		SqlQuery query = Ebean.createSqlQuery(sql);
		SqlRow row = query.findUnique();
		return row.getInteger("count");
	}

	/** Range in game.
	 * 
	 * @param from the from
	 * @param to the to
	 * @param player the player
	 * @param game the game
	 * @return the int */
	public static Integer rangeInGame(int from, int to, String player, String game) {
		String sql = String
				.format("SELECT count(score) as count FROM stats_entry_x01 WHERE player='%s' AND game='%s' AND  score>%s AND score<%s",
						escapeSql(player), escapeSql(game), Integer.valueOf(from), Integer.valueOf(to));
		SqlQuery query = Ebean.createSqlQuery(sql);
		SqlRow row = query.findUnique();
		return row.getInteger("count");
	}

	/** Avg dart in game.
	 * 
	 * @param player the player
	 * @param game the game
	 * @return the float */
	public static Float avgDartInGame(String player, String game) {
		String sql = String
				.format("SELECT sum(score) as total, sum(nb_darts) as count FROM stats_entry_x01 WHERE player='%s' AND game='%s'",
						escapeSql(player), escapeSql(game));
		SqlQuery query = Ebean.createSqlQuery(sql);
		SqlRow row = query.findUnique();
		return avgFloat(row);
	}

	/** Avg dart in set.
	 * 
	 * @param player the player
	 * @param set the set
	 * @return the float */
	public static Float avgDartInSet(String player, String set) {
		String sql = String
				.format("SELECT sum(score) as total, sum(nb_darts) as count FROM stats_entry_x01 WHERE player='%s' AND set='%s'",
						escapeSql(player), escapeSql(set));
		SqlQuery query = Ebean.createSqlQuery(sql);
		SqlRow row = query.findUnique();
		return avgFloat(row);
	}

	/** Avg.
	 * 
	 * @param row the row
	 * @return the string */
	private static Float avgFloat(SqlRow row) {
		Float result = null;
		if (row != null) {
			Integer total = row.getInteger("total");
			Integer count = row.getInteger("count");
			if (total != null && count != null && count.intValue() > 0) {
				Double avg = Double.valueOf(total.doubleValue() / count.doubleValue());
				result = Float.valueOf(avg.floatValue());
			}
		}
		return result;
	}

	/** Avg leg in game.
	 * 
	 * @param player the player
	 * @param game the game
	 * @return the string */
	public static Float avgLegInGame(String player, String game) {
		String sql = String
				.format("SELECT sum(leg_nb_darts) as total, count(leg_nb_darts) as count FROM stats_entry_x01 WHERE player='%s' AND game='%s' AND leg_nb_darts IS NOT NULL",
						escapeSql(player), escapeSql(game));
		SqlQuery query = Ebean.createSqlQuery(sql);
		SqlRow row = query.findUnique();
		return avgFloat(row);
	}

	/** Avg leg in set.
	 * 
	 * @param player the player
	 * @param set the set
	 * @return the float */
	public static Float avgLegInSet(String player, String set) {
		String sql = String
				.format("SELECT sum(leg_nb_darts) as total, count(leg_nb_darts) as count FROM stats_entry_x01 WHERE player='%s' AND set='%s' AND leg_nb_darts IS NOT NULL",
						escapeSql(player), escapeSql(set));
		SqlQuery query = Ebean.createSqlQuery(sql);
		SqlRow row = query.findUnique();
		return avgFloat(row);
	}

	/** Best leg in game.
	 * 
	 * @param player the player
	 * @param game the game
	 * @return the string */
	public static Integer bestLegInGame(String player, String game) {
		String sql = String
				.format("SELECT min(leg_nb_darts) as best FROM stats_entry_x01 WHERE player='%s' AND game='%s' AND leg_nb_darts IS NOT NULL",
						escapeSql(player), escapeSql(game));
		SqlQuery query = Ebean.createSqlQuery(sql);
		SqlRow row = query.findUnique();
		if (row != null) {
			return row.getInteger("best");
		}
		return null;
	}

	/** Best leg in game.
	 * 
	 * @param player the player
	 * @param set the set
	 * @return the string */
	public static Integer bestLegInSet(String player, String set) {
		String sql = String
				.format("SELECT min(leg_nb_darts) as best FROM stats_entry_x01 WHERE player='%s' AND set='%s' AND leg_nb_darts IS NOT NULL",
						escapeSql(player), escapeSql(set));
		SqlQuery query = Ebean.createSqlQuery(sql);
		SqlRow row = query.findUnique();
		if (row != null) {
			return row.getInteger("best");
		}
		return null;
	}

	/** Best out in game.
	 * 
	 * @param min the min
	 * @param player the player
	 * @param game the game
	 * @return the string */
	public static String bestOutInGame(int min, String player, String game) {
		String sql = String
				.format("SELECT score FROM stats_entry_x01 WHERE player='%s' AND game='%s' AND score>%s AND leg_nb_darts IS NOT NULL",
						escapeSql(player), escapeSql(game), Integer.valueOf(min));
		SqlQuery query = Ebean.createSqlQuery(sql);
		List<SqlRow> rows = query.findList();
		String result = "-";
		if (rows != null && !rows.isEmpty()) {
			StringBuffer sb = new StringBuffer();
			boolean first = true;
			Integer score;
			for (SqlRow row : rows) {
				score = row.getInteger("score");
				if (score == null) {
					continue;
				}
				if (first) {
					first = false;
				} else {
					sb.append(", ");
				}
				sb.append(score);
			}
			result = sb.toString();
		}
		return result;
	}

	/** Avg dart in leg.
	 * 
	 * @param player the player
	 * @param leg the leg
	 * @return the float */
	public static Float avgDartInLeg(String player, String leg) {
		String sql = String
				.format("SELECT sum(score) as total, sum(nb_darts) as count FROM stats_entry_x01 WHERE player='%s' AND leg='%s'",
						escapeSql(player), escapeSql(leg));
		SqlQuery query = Ebean.createSqlQuery(sql);
		SqlRow row = query.findUnique();

		return avgFloat(row);
	}

	/**
	 * Clean games.
	 *
	 * @param timestamp the timestamp
	 */
	public static void cleanGames(long timestamp) {
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(timestamp);
		cal.add(Calendar.HOUR, -1); // 1 hour
		cal.add(Calendar.MINUTE, -1); // 1 min
		long threshold = cal.getTimeInMillis();

		String sql = "SELECT game, max(timestamp) as lastest  FROM stats_entry_x01 GROUP BY game";
		SqlQuery query = Ebean.createSqlQuery(sql);

		List<String> games = Lists.newArrayList();
		Long ts;
		for (SqlRow row : query.findList()) {
			ts = row.getLong("lastest");
			if (ts != null && ts.longValue() < threshold) {
				games.add(row.getString("game"));
			}
		}
		// Delete
		if (!games.isEmpty()) {
			if (logger.isInfoEnabled()) {
				logger.info("Delete Games: " + games);
			}
			List<Object> findIds = Ebean.createQuery(StatsEntryX01.class).where().in("game", games).findIds();
			Ebean.delete(StatsEntryX01.class, findIds);
		}
	}

	/** The id. */
	@Id
	private Long id;

	/** The timestamp. */
	private long timestamp;

	/** The game. */
	private String game;

	/** The set. */
	private String set;

	/** The leg. */
	private String leg;

	/** The entry. */
	private String entry;

	/** The entry index. */
	private int entryIndex;

	/** The player. */
	private String player;

	/** The score. */
	private int score;

	/** The left. */
	private int left;

	/** The status. */
	@Enumerated(EnumType.STRING)
	private Status status;

	/** The nb darts. */
	private int nbDarts;

	/** The leg nb darts. */
	private Integer legNbDarts;

	/** Gets the id.
	 * 
	 * @return the id */
	public Long getId() {
		return this.id;
	}

	/** Sets the id.
	 * 
	 * @param id the new id */
	public void setId(Long id) {
		this.id = id;
	}

	/** Gets the timestamp.
	 * 
	 * @return the timestamp */
	public long getTimestamp() {
		return this.timestamp;
	}

	/** Sets the timestamp.
	 * 
	 * @param timestamp the new timestamp */
	public void setTimestamp(long timestamp) {
		this.timestamp = timestamp;
	}

	/** Gets the game.
	 * 
	 * @return the game */
	public String getGame() {
		return this.game;
	}

	/** Sets the game.
	 * 
	 * @param game the new game */
	public void setGame(String game) {
		this.game = game;
	}

	/** Gets the sets the.
	 * 
	 * @return the sets the */
	public String getSet() {
		return this.set;
	}

	/** Sets the sets the.
	 * 
	 * @param set the new sets the */
	public void setSet(String set) {
		this.set = set;
	}

	/** Gets the leg.
	 * 
	 * @return the leg */
	public String getLeg() {
		return this.leg;
	}

	/** Sets the leg.
	 * 
	 * @param leg the new leg */
	public void setLeg(String leg) {
		this.leg = leg;
	}

	/** Gets the entry.
	 * 
	 * @return the entry */
	public String getEntry() {
		return this.entry;
	}

	/** Sets the entry.
	 * 
	 * @param entry the new entry */
	public void setEntry(String entry) {
		this.entry = entry;
	}

	/** Gets the entry index.
	 * 
	 * @return the entry index */
	public int getEntryIndex() {
		return this.entryIndex;
	}

	/** Sets the entry index.
	 * 
	 * @param entryIndex the new entry index */
	public void setEntryIndex(int entryIndex) {
		this.entryIndex = entryIndex;
	}

	/** Gets the player.
	 * 
	 * @return the player */
	public String getPlayer() {
		return this.player;
	}

	/** Sets the player.
	 * 
	 * @param player the new player */
	public void setPlayer(String player) {
		this.player = player;
	}

	/** Gets the score.
	 * 
	 * @return the score */
	public int getScore() {
		return this.score;
	}

	/** Sets the score.
	 * 
	 * @param score the new score */
	public void setScore(int score) {
		this.score = score;
	}

	/** Gets the left.
	 * 
	 * @return the left */
	public int getLeft() {
		return this.left;
	}

	/** Sets the left.
	 * 
	 * @param left the new left */
	public void setLeft(int left) {
		this.left = left;
	}

	/** Gets the status.
	 * 
	 * @return the status */
	public Status getStatus() {
		return this.status;
	}

	/** Sets the status.
	 * 
	 * @param status the new status */
	public void setStatus(Status status) {
		this.status = status;
	}

	/** Gets the leg nb darts.
	 * 
	 * @return the leg nb darts */
	public Integer getLegNbDarts() {
		return this.legNbDarts;
	}

	/** Sets the leg nb darts.
	 * 
	 * @param legNbDarts the new leg nb darts */
	public void setLegNbDarts(Integer legNbDarts) {
		this.legNbDarts = legNbDarts;
	}

	/** Gets the nb darts.
	 * 
	 * @return the nb darts */
	public int getNbDarts() {
		return this.nbDarts;
	}

	/** Sets the nb darts.
	 * 
	 * @param nbDarts the new nb darts */
	public void setNbDarts(int nbDarts) {
		this.nbDarts = nbDarts;
	}
}
