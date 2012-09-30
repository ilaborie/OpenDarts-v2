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
package models.dartboard;

import java.util.Properties;

/** The Class GaussianStats. */
public class DartboardProperties {

	/** The un lucky bull. */
	private final int unLuckyBull;

	/** The un lucky others. */
	private final int unLuckyOthers;

	/** The double bull zone. */
	private final double doubleBullZone;

	/** The simple bull zone. */
	private final double simpleBullZone;

	/** The small simple zone. */
	private final double smallSimpleZone;

	/** The triple zone. */
	private final double tripleZone;

	/** The big zone. */
	private final double bigZone;

	/** The double zone. */
	private final double doubleZone;

	/**
	 * Instantiates a new zone gaussian stats.
	 *
	 * @param props the props
	 */
	public DartboardProperties(Properties props) {
		super();
		// Unlucky
		this.unLuckyBull = Integer.valueOf(props.getProperty("unLuckyBull")).intValue();
		this.unLuckyOthers = Integer
				.valueOf(props.getProperty("unLuckyOthers")).intValue();

		// Zone
		this.doubleBullZone = Double.valueOf(props
				.getProperty("doubleBullZone")).intValue();
		this.simpleBullZone = this.doubleBullZone
				+ Double.valueOf(props.getProperty("simpleBullZone")).intValue();
		this.smallSimpleZone = this.simpleBullZone
				+ Double.valueOf(props.getProperty("smallSimpleZone")).intValue();
		this.tripleZone = this.smallSimpleZone
				+ Double.valueOf(props.getProperty("tripleZone")).intValue();
		this.bigZone = this.tripleZone
				+ Double.valueOf(props.getProperty("bigZone")).intValue();
		this.doubleZone = this.bigZone
				+ Double.valueOf(props.getProperty("doubleZone")).intValue();
	}

	/** Gets the un lucky bull.
	 * 
	 * @return the un lucky bull */
	public int getUnLuckyBull() {
		return this.unLuckyBull;
	}

	/** Gets the un lucky others.
	 * 
	 * @return the un lucky others */
	public int getUnLuckyOthers() {
		return this.unLuckyOthers;
	}

	/** Gets the double bull zone.
	 * 
	 * @return the double bull zone */
	public double getDoubleBullZone() {
		return this.doubleBullZone;
	}

	/** Gets the simple bull zone.
	 * 
	 * @return the simple bull zone */
	public double getSimpleBullZone() {
		return this.simpleBullZone;
	}

	/** Gets the small simple zone.
	 * 
	 * @return the small simple zone */
	public double getSmallSimpleZone() {
		return this.smallSimpleZone;
	}

	/** Gets the triple zone.
	 * 
	 * @return the triple zone */
	public double getTripleZone() {
		return this.tripleZone;
	}

	/** Gets the big zone.
	 * 
	 * @return the big zone */
	public double getBigZone() {
		return this.bigZone;
	}

	/** Gets the double zone.
	 * 
	 * @return the double zone */
	public double getDoubleZone() {
		return this.doubleZone;
	}

}
