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

/** The Enum DartSector. */
public enum DartSector {

	/** The ONE. */
	ONE,

	/** The TWO. */
	TWO,

	/** The THREE. */
	THREE,

	/** The FOUR. */
	FOUR,

	/** The FIVE. */
	FIVE,

	/** The SIX. */
	SIX,

	/** The SEVEN. */
	SEVEN,

	/** The EIGHT. */
	EIGHT,

	/** The NINE. */
	NINE,

	/** The TEN. */
	TEN,

	/** The ELEVEN. */
	ELEVEN,

	/** The TWELVE. */
	TWELVE,

	/** The THIRTEEN. */
	THIRTEEN,

	/** The FOURTEEN. */
	FOURTEEN,

	/** The FIVETEEN. */
	FIVETEEN,

	/** The SIXTEEN. */
	SIXTEEN,

	/** The SEVENTEEN. */
	SEVENTEEN,

	/** The EIGHTEEN. */
	EIGHTEEN,

	/** The NINETEEN. */
	NINETEEN,

	/** The TWENTY. */
	TWENTY,

	/** The BULL. */
	BULL,

	/** The OU t_ o f_ target. */
	OUT_OF_TARGET,

	/** The UNLUCK y_ dart. */
	UNLUCKY_DART,
	/** The NONE. */
	NONE;

	/** Gets the base score.
	 * 
	 * @return the base score */
	public int getBaseScore() {
		int baseScore;
		switch (this) {
			case BULL:
				baseScore = 25;
				break;
			case EIGHT:
				baseScore = 8;
				break;
			case EIGHTEEN:
				baseScore = 18;
				break;
			case ELEVEN:
				baseScore = 11;
				break;
			case FIVE:
				baseScore = 5;
				break;
			case FIVETEEN:
				baseScore = 15;
				break;
			case FOUR:
				baseScore = 4;
				break;
			case FOURTEEN:
				baseScore = 14;
				break;
			case NINE:
				baseScore = 9;
				break;
			case NINETEEN:
				baseScore = 19;
				break;
			case ONE:
				baseScore = 1;
				break;
			case SEVEN:
				baseScore = 7;
				break;
			case SEVENTEEN:
				baseScore = 17;
				break;
			case SIX:
				baseScore = 6;
				break;
			case SIXTEEN:
				baseScore = 16;
				break;
			case TEN:
				baseScore = 10;
				break;
			case THIRTEEN:
				baseScore = 13;
				break;
			case THREE:
				baseScore = 3;
				break;
			case TWELVE:
				baseScore = 12;
				break;
			case TWENTY:
				baseScore = 20;
				break;
			case TWO:
				baseScore = 2;
				break;
			case OUT_OF_TARGET:
			case UNLUCKY_DART:
			case NONE:
			default:
				baseScore = 0;
		}
		return baseScore;
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
			case OUT_OF_TARGET:
				result = "Out";
				break;
			case UNLUCKY_DART:
				result = ":'(";
				break;
			case NONE:
				result = "";
				break;
			default:
				result = String.valueOf(this.getBaseScore());
		}
		return result;
	}

	/** Gets the left.
	 * 
	 * @return the left */
	public DartSector getNext() {
		DartSector result;
		switch (this) {
			case EIGHT:
				result = ELEVEN;
				break;
			case EIGHTEEN:
				result = FOUR;
				break;
			case ELEVEN:
				result = FOURTEEN;
				break;
			case FIVE:
				result = TWENTY;
				break;
			case FIVETEEN:
				result = TWO;
				break;
			case FOUR:
				result = THIRTEEN;
				break;
			case FOURTEEN:
				result = NINE;
				break;
			case NINE:
				result = TWELVE;
				break;
			case NINETEEN:
				result = SEVEN;
				break;
			case ONE:
				result = EIGHTEEN;
				break;
			case SEVEN:
				result = SIXTEEN;
				break;
			case SEVENTEEN:
				result = THREE;
				break;
			case SIX:
				result = TEN;
				break;
			case SIXTEEN:
				result = EIGHT;
				break;
			case TEN:
				result = FIVETEEN;
				break;
			case THIRTEEN:
				result = SIX;
				break;
			case THREE:
				result = NINETEEN;
				break;
			case TWELVE:
				result = FIVE;
				break;
			case TWENTY:
				result = ONE;
				break;
			case TWO:
				result = SEVENTEEN;
				break;
			case BULL:
			case OUT_OF_TARGET:
			case UNLUCKY_DART:
			case NONE:
			default:
				result = DartSector.NONE;
		}
		return result;
	}

	/**
	 * Gets the previous.
	 *
	 * @return the previous
	 */
	public DartSector getPrevious() {
		DartSector result;
		switch (this) {
			case EIGHT:
				result = SIXTEEN;
				break;
			case EIGHTEEN:
				result = ONE;
				break;
			case ELEVEN:
				result = EIGHT;
				break;
			case FIVE:
				result = TWELVE;
				break;
			case FIVETEEN:
				result = TEN;
				break;
			case FOUR:
				result = EIGHTEEN;
				break;
			case FOURTEEN:
				result = ELEVEN;
				break;
			case NINE:
				result = FOURTEEN;
				break;
			case NINETEEN:
				result = THREE;
				break;
			case ONE:
				result = TWENTY;
				break;
			case SEVEN:
				result = NINETEEN;
				break;
			case SEVENTEEN:
				result = TWO;
				break;
			case SIX:
				result = THIRTEEN;
				break;
			case SIXTEEN:
				result = SEVEN;
				break;
			case TEN:
				result = SIX;
				break;
			case THIRTEEN:
				result = FOUR;
				break;
			case THREE:
				result = SEVENTEEN;
				break;
			case TWELVE:
				result = NINE;
				break;
			case TWENTY:
				result = FIVE;
				break;
			case TWO:
				result = FIVETEEN;
				break;
			case BULL:
			case OUT_OF_TARGET:
			case UNLUCKY_DART:
			case NONE:
			default:
				result = DartSector.NONE;
		}
		return result;
	}

	/** Gets the single.
	 * 
	 * @param value the value
	 * @return the single */
	public static DartSector getSingle(int value) {
		switch (value) {
			case 0:
				return OUT_OF_TARGET;
			case 1:
				return ONE;
			case 2:
				return TWO;
			case 3:
				return THREE;
			case 4:
				return FOUR;
			case 5:
				return FIVE;
			case 6:
				return SIX;
			case 7:
				return SEVEN;
			case 8:
				return EIGHT;
			case 9:
				return NINE;
			case 10:
				return TEN;
			case 11:
				return ELEVEN;
			case 12:
				return TWELVE;
			case 13:
				return THIRTEEN;
			case 14:
				return FOURTEEN;
			case 15:
				return FIVETEEN;
			case 16:
				return SIXTEEN;
			case 17:
				return SEVENTEEN;
			case 18:
				return EIGHTEEN;
			case 19:
				return NINETEEN;
			case 20:
				return TWENTY;
			case 25:
				return BULL;
			default:
				return NONE;
		}
	}

}
