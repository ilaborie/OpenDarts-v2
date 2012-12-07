package dart

import scala.util.Random._

sealed case class Level(val value: Int)

object ComputerDart {
	/**
	 * Level coefficient
	 */
	private val levelCoefficient: Map[Level, Double] = Map(
		Level(0) -> 39.00, // about 52
		Level(1) -> 32.80, // about 45 
		Level(2) -> 28.80, // about 39
		Level(3) -> 21.15, // about 36
		Level(4) -> 19.27, // about 33
		Level(5) -> 17.75, // about 30
		Level(6) -> 16.60, // about 28
		Level(7) -> 15.30, // about 26
		Level(8) -> 14.15, // about 24
		Level(9) -> 12.80, // about 22
		Level(10) -> 11.8, // about 20.5
		Level(11) -> 10.7, // about 19
		Level(12) -> 9.67, // about 17.5
		Level(13) -> 8.40, // about 16
		Level(14) -> 7.12, // about 14.5
		Level(15) -> 5.80) // about 13

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