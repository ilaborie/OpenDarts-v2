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

import java.io.IOException;
import java.io.InputStream;
import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;

import models.dart.IDart;
import play.Application;
import services.dart.DartService;

import com.google.common.collect.Maps;
import com.google.common.io.Closeables;

/** The Class BestDart. */
public final class BestDart {

	/** The best darts. */
	private final static Map<Integer, BestDart> bestDarts = Maps.newConcurrentMap();

	/** Choose best dart.
	 * 
	 * @param target the target
	 * @param score the score
	 * @param nbDart the nb dart
	 * @return the i dart */
	public static IDart chooseBestDart(int target, int score, int nbDart) {
		BestDart bestDart = bestDarts.get(Integer.valueOf(nbDart));
		return bestDart.getBestDart(score, target);
	}

	/** Load.
	 * 
	 * @param app the app */
	public static void load(Application app) {
		for (int i = 1; i < 4; i++) {
			Properties props = new Properties();
			String res =
					MessageFormat.format("/x01/BestDart_{0}.properties",
							Integer.valueOf(i));
			InputStream in = null;
			try {
				in = app.resourceAsStream(res); 
				props.load(in);
				BestDart bestDart = new BestDart(i, props);
				bestDarts.put(Integer.valueOf(i), bestDart);
			} catch (IOException e) {
				throw new RuntimeException("Fail to load computer level stats", e);
			} finally {
				Closeables.closeQuietly(in);
			}
		}
	}

	/** The index. */
	private final int index;

	/** The darts. */
	private final Map<Integer, IDart> darts;

	/** Instantiates a new best dart.
	 * 
	 * @param index the index
	 * @param props the props */
	private BestDart(int index, Properties props) {
		super();
		this.index = index;
		DartService dartService = new DartService();

		this.darts = new HashMap<Integer, IDart>();
		String sDart;
		String key;
		Integer score;
		for (Entry<Object, Object> entry : props.entrySet()) {
			key = entry.getKey().toString();
			sDart = entry.getValue().toString();
			try {
				score = Integer.valueOf(key.substring("score.".length()));
				this.darts.put(score, dartService.getDart(sDart));
			} catch (NumberFormatException e) {
				// Skip
			}
		}
	}

	/** Gets the index.
	 * 
	 * @return the index */
	public int getIndex() {
		return this.index;
	}

	/** Gets the best dart.
	 * 
	 * @param score the score
	 * @param target the target
	 * @return the best dart */
	public IDart getBestDart(int score, int target) {
		IDart dart = this.darts.get(Integer.valueOf(score));
		if (dart == null) {
			DartService dartService = new DartService();
			dart = dartService.getDart("T" + target);
		}
		return dart;
	}
}
