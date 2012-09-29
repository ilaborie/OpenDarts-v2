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

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.text.NumberFormat;
import java.util.Locale;

/**
 * The Class StatElement.
 */
public class StatElement {
	
	/** The Constant floatFormatter. */
	private static final NumberFormat floatFormatter = new DecimalFormat("0.0", DecimalFormatSymbols.getInstance(Locale.US));
	
	/** The Constant NONE. */
	private static final String NONE = "-";
	
	/** The key. */
	private StatKey key;
	
	/** The value. */
	private String value;

	/**
	 * Creates the.
	 *
	 * @param key the key
	 * @param value the value
	 * @return the stat element
	 */
	public static StatElement create(StatKey key, Float value) {
		String val = NONE;
		if (value != null) {
			val = floatFormatter.format(value.floatValue());
		}
		return create(key, val);
	}

	/**
	 * Creates the.
	 *
	 * @param key the key
	 * @param value the value
	 * @return the stat element
	 */
	public static StatElement create(StatKey key, Integer value) {
		String val = NONE;
		if (value!=null) {
			val = String.valueOf(value);
		}
		return create(key, val);
	}

	/**
	 * Creates the.
	 *
	 * @param key the key
	 * @param value the value
	 * @return the stat element
	 */
	public static StatElement create(StatKey key, String value) {
		StatElement result = new StatElement();
		result.setKey(key);
		String val = NONE;
		if (value != null) {
			val = value;
		}
		result.setValue(val);
		return result;
	}

	/**
	 * Gets the key.
	 *
	 * @return the key
	 */
	public StatKey getKey() {
		return this.key;
	}

	/**
	 * Sets the key.
	 *
	 * @param key the new key
	 */
	public void setKey(StatKey key) {
		this.key = key;
	}

	/**
	 * Gets the value.
	 *
	 * @return the value
	 */
	public String getValue() {
		return this.value;
	}

	/**
	 * Sets the value.
	 *
	 * @param value the new value
	 */
	public void setValue(String value) {
		this.value = value;
	}

}
