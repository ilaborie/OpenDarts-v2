package test.x01

import dart._
import dart.Dart._
import ai._
import ai.x01._
import scala.collection.immutable.Seq

object PlayX01 {

	/**
	 * Play a 501
	 * @param lvl the level
	 * @return the result
	 */
	def play501(lvl: Level): ResultX01 = play(501, lvl)
	/**
	 * Play a x01
	 * @param score the starting score
	 * @param lvl the level
	 * @return the result
	 */
	def play(score: Int, lvl: Level): ResultX01 = playAux(score, lvl, 0)

	private def playAux(scoreLeft: Int, lvl: Level, nbPlayed: Int): ResultX01 = {
		val request = PlayerRequest(lvl, T20, Set())
		val (status, darts) = AiPlayerX01.playTurn(scoreLeft, request)

		status match {
			case Win => ResultX01(nbPlayed + darts.size, scoreLeft)
			case Broken => playAux(scoreLeft, lvl, nbPlayed + 3)
			case Normal => {
				val left = darts.foldLeft(scoreLeft)((x: Int, d: (Dart, Dart)) => x - d._2.score)
				playAux(left, lvl, nbPlayed + 3)
			}
		}
	}

	/**
	 * Play some 501
	 * @param nbPlayed the number of playing leg
	 * @param lvl the level
	 * @return the result
	 */
	def test501(nbLegs: Int, lvl: Level): TestResultX01 = {
		val res = for (i <- 0 to nbLegs) yield play501(lvl)
		TestResultX01(res)
	}

}