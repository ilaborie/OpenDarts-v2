package ai

sealed case class Level(value: Int) {

  lazy val coefficient = Level.levelCoefficient(value)
}

object Level {

  /**
   * Level coefficient
   */
  private val levelCoefficient: Map[Int, Double] = Map(
    0 -> 31.18, // about 52
    1 -> 27.46, // about 45
    2 -> 24.12, // about 39
    3 -> 22.37, // about 36
    4 -> 20.56, // about 33
    5 -> 18.68, // about 30
    6 -> 17.38, // about 28
    7 -> 16.04, // about 26
    8 -> 14.63, // about 24
    9 -> 13.10, // about 22
    10 -> 11.89, // about 20.5
    11 -> 10.55, // about 19
    12 -> 9.17, // about 17.5
    13 -> 7.72, // about 16
    14 -> 6.30, // about 14.5
    15 -> 5.00) // about 13
}