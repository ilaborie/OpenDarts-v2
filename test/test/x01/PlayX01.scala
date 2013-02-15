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
package test.x01

import dart._
import dart.Dart._
import ai._
import ai.x01._
import ai.x01.AiPlayerX01._
import scala.List

object PlayX01 {

  /**
   * Play a 501
   * @param lvl the level
   * @return the result
   */
  def play501(lvl: Level): ResultX01 = play501(lvl, T20)

  /**
   * Play a 501
   * @param lvl the level
   * @param defaultDart the default dart
   * @return the result
   */
  def play501(lvl: Level, defaultDart: Dart): ResultX01 = play(501, lvl, defaultDart)

  /**
   * Play a x01
   * @param score the starting score
   * @param lvl the level
   * @param defaultDart the default dart
   * @return the result
   */
  def play(score: Int, lvl: Level, defaultDart: Dart): ResultX01 = playAux(score, lvl, defaultDart, 0)

  private def playAux(scoreLeft: Int, lvl: Level, defaultDart: Dart, nbPlayed: Int): ResultX01 = {
    val request = PlayerRequest(lvl, defaultDart, Set())
    val (status, darts) = AiPlayerX01.playTurn(scoreLeft, request)

    status match {
      case Win => ResultX01(nbPlayed + darts.size, scoreLeft)
      case Broken => playAux(scoreLeft, lvl, defaultDart, nbPlayed + 3)
      case Normal => {
        val left = darts.foldLeft(scoreLeft)((x: Int, d: (Dart, Dart)) => x - d._2.score)
        playAux(left, lvl, defaultDart, nbPlayed + 3)
      }
    }
  }

  def battle(nbLegs: Int, lvl: Level, darts: List[Dart], score: Int) {
    println(s"Battle for the $score finish with $lvl (with $nbLegs legs):")
    val res = for (dart <- darts) yield finishBattle(nbLegs, lvl, dart, score)
    res map println
  }

  /**
   * Battle for finish
   * @param lvl the player level
   * @param defaultDart the default first dart
   * @param score the starting score
   * @return the result
   */
  def finishBattle(nbLegs: Int, lvl: Level, defaultDart: Dart, score: Int): FinishResultX01 = {
    val res = for (i <- 0 to nbLegs) yield finishBattleAux(lvl, defaultDart, score)
    FinishResultX01(defaultDart, res)
  }

  private def finishBattleAux(lvl: Level, defaultDart: Dart, score: Int): ResultX01 = {
    val request = PlayerRequest(lvl, defaultDart, Set())
    // Throw first dart
    val dart: Dart = ComputerDart.throwDart(lvl, defaultDart)

    val newStatus = AiPlayerX01.checkStatus(score, dart)
    val scoreLeft = newStatus match {
      case Win => 0
      case Broken => score
      case Normal => score - dart.score
    }

    // Second & Third Darts
    val (status, darts) = AiPlayerX01.playTurnAux(scoreLeft, 2, request, newStatus, List((defaultDart, dart)))

    // process
    status match {
      case Win => ResultX01(darts.size, scoreLeft)
      case Broken => playAux(score, lvl, defaultDart, 3)
      case Normal => {
        val left = darts.foldLeft(score)((x: Int, d: (Dart, Dart)) => x - d._2.score)
        playAux(left, lvl, defaultDart, 3)
      }
    }
  }

  /**
   * Play some 501
   * @param lvl the level
   * @return the result
   */
  def test501(nbLegs: Int, lvl: Level): TestResultX01 = {
    val res = for (i <- 0 to nbLegs) yield play501(lvl)
    TestResultX01(res)
  }

  def test501(nbLegs: Int, lvl: Level, defaultDart: Dart): TestResultX01 = {
    val res = for (i <- 0 to nbLegs) yield play501(lvl, defaultDart)
    TestResultX01(res)
  }

  /**
   * Return a stream of played dart for the score
   * @param lvl the level
   * @return Dart Stream
   */
  def playScoreStream(dart: Dart, lvl: Level): Stream[WishedDone] = {
    (dart, ComputerDart.throwDart(lvl, dart)) #:: playScoreStream(dart, lvl)
  }

  def playChoiceStream(choice: DartChoice, modifiers: Set[Modifier]): Stream[Dart] = {
    choice.chooseDart(modifiers) #:: playChoiceStream(choice, modifiers)
  }

}