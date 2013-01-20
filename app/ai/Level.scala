package ai

sealed case class Level(value: Int) {

  lazy val coefficient = Level.levelCoefficient(value)
}

object Level {

  /**
   * Level coefficient
   */
  private val levelCoefficient: Map[Int, Double] = Map(
    0 -> 31.15, // about 52
    1 -> 27.40, // about 45
    2 -> 24.09, // about 39
    3 -> 22.33, // about 36
    4 -> 20.53, // about 33
    5 -> 18.65, // about 30
    6 -> 17.34, // about 28
    7 -> 16.00, // about 26
    8 -> 14.58, // about 24
    9 -> 13.08, // about 22
    10 -> 11.85, // about 20.5
    11 -> 10.55, // about 19
    12 -> 9.15, // about 17.5
    13 -> 7.70, // about 16
    14 -> 6.31, // about 14.5
    15 -> 5.00) // about 13
}