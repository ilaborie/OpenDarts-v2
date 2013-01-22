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
import ai.Level


object ComputerDart {

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
      val coeff = level.coefficient
      val expectedPosition = DartBoard.getDartPosition(expected)

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
   * @return the random position
   */
  private def randomPosition(expected: Double, coeff: Double): Double = expected + (nextGaussian * coeff)

}