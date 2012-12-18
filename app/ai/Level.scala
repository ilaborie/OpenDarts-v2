package ai

sealed case class Level(val value: Int) {

	lazy val coefficient = Level.levelCoefficient(value)
}

object Level {

	/**
	 * Level coefficient
	 */
	private val levelCoefficient: Map[Int, Double] = Map(
		0 -> 31.55, // about 52
		1 -> 27.60, // about 45 
		2 -> 24.08, // about 39
		3 -> 22.32, // about 36
		4 -> 20.55, // about 33
		5 -> 18.60, // about 30
		6 -> 17.30, // about 28
		7 -> 15.95, // about 26
		8 -> 14.55, // about 24
		9 -> 12.85, // about 22
		10 -> 11.75, // about 20.5
		11 -> 10.50, // about 19
		12 -> 8.67, // about 17.5
		13 -> 7.60, // about 16
		14 -> 6.21, // about 14.5
		15 -> 4.90) // about 13
}