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
package models.dart;

/** The Enum DartZone. */
public enum DartZone {

	/** The SINGLE. */
	SINGLE,
	/** The DOUBLE. */
	DOUBLE,
	/** The TRIPLE. */
	TRIPLE,
	/** The NONE. */
	NONE;

	/** Gets the multiplier.
	 * 
	 * @return the multiplier */
	public int getMultiplier() {
		int result;
		switch (this) {
			case SINGLE:
				result = 1;
				break;
			case DOUBLE:
				result = 2;
				break;
			case TRIPLE:
				result = 3;
				break;
			case NONE:
			default:
				result = 0;
				break;
		}
		return result;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Enum#toString()
	 */
	@Override
	public String toString() {
		String result;
		switch (this) {
			case DOUBLE:
				result = "D";
				break;
			case TRIPLE:
				result = "T";
				break;
			case SINGLE:
			case NONE:
			default:
				result = "";
				break;
		}
		return result;
	}
}
