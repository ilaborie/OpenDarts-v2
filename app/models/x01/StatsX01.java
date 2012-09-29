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
package models.x01;

import java.util.List;

/** The Class Stats. */
public class StatsX01 {

	/** The timestamp. */
	private long timestamp;
	
	/** The id. */
	private Long id;

	/** The player. */
	private String player;

	/** The game stats. */
	private List<StatElement> gameStats;

	/** The set stats. */
	private List<StatElement> setStats;

	/** The leg stats. */
	private List<StatElement> legStats;

	/** Gets the game stats.
	 * 
	 * @return the game stats */
	public List<StatElement> getGameStats() {
		return this.gameStats;
	}

	/** Sets the game stats.
	 * 
	 * @param gameStats the new game stats */
	public void setGameStats(List<StatElement> gameStats) {
		this.gameStats = gameStats;
	}

	/** Gets the sets the stats.
	 * 
	 * @return the sets the stats */
	public List<StatElement> getSetStats() {
		return this.setStats;
	}

	/** Sets the sets the stats.
	 * 
	 * @param setStats the new sets the stats */
	public void setSetStats(List<StatElement> setStats) {
		this.setStats = setStats;
	}

	/** Gets the leg stats.
	 * 
	 * @return the leg stats */
	public List<StatElement> getLegStats() {
		return this.legStats;
	}

	/** Sets the leg stats.
	 * 
	 * @param legStats the new leg stats */
	public void setLegStats(List<StatElement> legStats) {
		this.legStats = legStats;
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

	/**
	 * Gets the player.
	 *
	 * @return the player
	 */
	public String getPlayer() {
		return this.player;
	}

	/**
	 * Sets the player.
	 *
	 * @param player the new player
	 */
	public void setPlayer(String player) {
		this.player = player;
	}

	/**
	 * Gets the id.
	 *
	 * @return the id
	 */
	public Long getId() {
		return this.id;
	}

	/**
	 * Sets the id.
	 *
	 * @param id the new id
	 */
	public void setId(Long id) {
		this.id = id;
	}

}
