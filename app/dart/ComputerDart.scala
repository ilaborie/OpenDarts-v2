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
package dart

import scala.util.Random._

sealed case class Level(val value: Int)

object ComputerDart {
	/**
	 * Level coefficient
	 */
	private val levelCoefficient: Map[Level, Double] = Map(
		Level(0) -> 31.55, // about 52
		Level(1) -> 27.60, // about 45 
		Level(2) -> 24.08, // about 39
		Level(3) -> 22.32, // about 36
		Level(4) -> 20.55, // about 33
		Level(5) -> 18.60, // about 30
		Level(6) -> 17.30, // about 28
		Level(7) -> 15.95, // about 26
		Level(8) -> 14.55, // about 24
		Level(9) -> 12.85, // about 22
		Level(10) -> 11.75, // about 20.5
		Level(11) -> 10.50, // about 19
		Level(12) -> 8.67, // about 17.5
		Level(13) -> 7.60, // about 16
		Level(14) -> 6.21, // about 14.5
		Level(15) -> 4.90) // about 13

	/**
	 * Unlucky stats (1 on value)
	 */
	private val unLuckyBull = 50
	private val unLuckyOthers = 100

	/**
	 * It's easier to keep the x than the y
	 */
	private val xCorrect = 0.75
	private val yCorrect = 1.25

	/**
	 * Let's throw the dart
	 */
	def throwDart(level: Level, expected: Dart): Dart = {
		// UnLucky factor 
		val unluckyFactor = expected match {
			case DoubleBull => unLuckyBull
			case SemiBull => unLuckyBull
			case _ => unLuckyOthers
		}

		// Test unLucky
		if (nextInt(unluckyFactor) == 0) UnluckyDart
		else {
			val coeff = levelCoefficient(level);
			val expectedPosition = DartBoard.getDartPosition(expected);
			
			// Throw on x and y
			val x = randomPosition(expectedPosition._1, coeff * xCorrect)
			val y = randomPosition(expectedPosition._2, coeff * yCorrect)

			DartBoard.getDart(x, y)
		}
	}

	/**
	 * Get a position (x or y)
	 * @param expected the expected position
	 * @param coeff the random coefficient
	 * @param unlucky the unlucky factor
	 * @return the random position
	 */
	private def randomPosition(expected: Double, coeff: Double): Double = expected + (nextGaussian * coeff)

}