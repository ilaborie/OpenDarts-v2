package test

import org.specs2.mutable._
import ai._
import ai.x01.AiPlayerX01._
import test.x01.PlayX01
import dart.Dart._
import dart.Dart

class TestingLevel extends Specification {
  val nbLegs = 100000
  val nbDarts = 1000000

  //print(buildLevelTable())

  /**
   * Test ai average on 501
   * @param level the ai level
   * @param expected the expected average
   * @param diff the dif
   * @return
   */
  def testDiff(level: Int, expected: Double, diff: Double) = {
    val lvl = Level(level)
    /* Launch */
    val result = PlayX01.test501(nbLegs, lvl)
    print(level)
    print(":  ")
    println(result)
    /* Test */
    result.avg must beCloseTo(expected, diff)
  }

  def test(level: Int, expected: Double) = testDiff(level, expected, 0.2)

  def buildLevelTable() = {
    def avgDart(level: Level, dart: Dart) = {
      val stream: Stream[WishedDone] = PlayX01.playScoreStream(dart, level)
      val darts = stream take nbDarts
      ((0.0 /: darts)(_ + _._2.score) / nbDarts)
    }
    def buildLevelRow(level: Level): String = {
      val lvl = level.value

      val avgLegT20 = PlayX01.test501(nbLegs, level).avg
      val avgDartT20 = avgDart(level, T20) * 3

      val avgLegT19 = PlayX01.test501(nbLegs, level, T19).avg
      val avgDartT19 = avgDart(level, T19) * 3

      f"<tr><td>$lvl</td> <td>$avgDartT20%.2f</td> <td>$avgDartT19%.2f</td> <td>$avgLegT20%.1f</td> <td>$avgLegT19%.1f</td> </tr>"
    }

    val s = for (lvl <- 0 to 15) yield buildLevelRow(Level(lvl))

    s.mkString("\n") + "\n"
  }

  "Level 0" should {
    "play around 52 darts" in testDiff(0, 52, 2)
  }

  "Level 1" should {
    "play around 45 darts" in testDiff(1, 45, 1)
  }

  "Level 2" should {
    "play around 39 darts" in test(2, 39)
  }

  "Level 3" should {
    "play around 36 darts" in test(3, 36)
  }

  "Level 4" should {
    "play around 33 darts" in test(4, 33)
  }

  "Level 5" should {
    "play around 30 darts" in test(5, 30)
  }

  "Level 6" should {
    "play around 28 darts" in test(6, 28)
  }

  "Level 7" should {
    "play around 26 darts" in test(7, 26)
  }

  "Level 8" should {
    "play around 24 darts" in test(8, 24)
  }

  "Level 9" should {
    "play around 22 darts" in test(9, 22)
  }

  "Level 10" should {
    "play around 20.5 darts" in test(10, 20.5)
  }

  "Level 11" should {
    "play around 19 darts" in test(11, 19)
  }

  "Level 12" should {
    "play around 17.5 darts" in test(12, 17.5)
  }

  "Level 13" should {
    "play around 16 darts" in test(13, 16)
  }

  "Level 14" should {
    "play around 14.5 darts" in test(14, 14.5)
  }

  "Level 15" should {
    "play around 13 darts" in test(15, 13)
  }

}