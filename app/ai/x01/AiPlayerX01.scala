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
package ai.x01

import dart._
import ai.Level
import scala.collection.immutable._
import play.api.Logger

object AiPlayerX01 {

  type WishedDone = (Dart, Dart)

  val log = Logger("ai.x01")

  /**
   * Process Computer Request
   * @param request the request
   * @return the result
   */
  def processComputerRequest(request: ComputerThrowRequest): ComputerThrowResult = {
    val score = request.score
    val level = Level(request.level)
    val dart = Dart(request.default)
    val modifiers: List[Modifier] = Modifier.fromRequest(request)

    log.debug("#%s>  %s - %s [%s] - %s".format(request.comKey, score, level, dart, modifiers))
    val req = PlayerRequest(level, dart, modifiers.toSet)

    val (status, darts) = playTurn(score, req)
    val scoreDone = status match {
      case Win => 0
      case Broken => score
      case _ => darts.foldLeft(0)((x: Int, d: WishedDone) => x + d._2.score)
    }

    ComputerThrowResult(request.comKey, darts.reverse, status, scoreDone)
  }

  /**
   * Throw three darts
   * @param score the initial score
   * @param request the request
   * @return the result
   */
  def playTurn(score: Int, request: PlayerRequest): (Status, List[WishedDone]) = playTurnAux(score, 3, request, Normal, Nil)

  private def playTurnAux(score: Int, dartLeft: Int, request: PlayerRequest, currentStatus: Status, playedDarts: List[WishedDone]): (Status, List[WishedDone]) = {
    currentStatus match {
      case Win => (currentStatus, playedDarts)
      case Broken => (currentStatus, playedDarts)
      case _ => if (dartLeft == 0) (currentStatus, playedDarts)
      else {
        val (wished, dart) = playDart(score, dartLeft, request)
        val newStatus = checkStatus(score, dart)
        val scoreLeft = newStatus match {
          case Win => score
          case Broken => score
          case Normal => score - dart.score
        }

        playTurnAux(scoreLeft, dartLeft - 1, request, newStatus, (wished, dart) :: playedDarts)
      }
    }
  }

  private def checkStatus(score: Int, dart: Dart): Status = {
    val newScore = score - dart.score
    if (newScore == 0 && dart.zone == Double) Win
    else if (newScore < 2) Broken
    else Normal
  }

  /**
   * Throw a dart
   * @param score the starting score
   * @param dartLeft the number of dart left
   * @return the played dart
   */
  def playDart(score: Int, dartLeft: Int, request: PlayerRequest): WishedDone = {
    require(dartLeft > 0 && dartLeft < 4)

    val bestDart = getBestDart(score, dartLeft, request.defaultDart, request.modifiers)
    log.trace("%s in %s darts choose %s".format(score, dartLeft, bestDart))
    val done = ComputerDart.throwDart(request.level, bestDart)
    log.trace("...done %s".format(done))

    (bestDart, done)
  }

  /**
   * Get Finish
   * @param score the score
   * @return all defined finish
   */
  def getFinish(score: Int): List[Finish] = {
    log.debug(f"Get Finish: $score")
    val defaultDart = Dart.T20
    val res = for {
      (dart1, modifiers1) <- bestDartChooser(3).getBestDart(score, defaultDart).allDarts
      (dart2, modifiers2) <- bestDartChooser(2).getBestDart(score - dart1.score, defaultDart).allDarts
      (dart3, modifiers3) <- bestDartChooser(1).getBestDart(score - dart1.score - dart2.score, defaultDart).allDarts
      if score == (dart1.score + dart2.score + dart3.score)
    } yield Finish(dart1, dart2, dart3, (modifiers1 ++ modifiers2 ++ modifiers3))

    log.debug(f"... $res")
    res.toList
  }

  /**
   * Get best dart
   * @param score the starting score
   * @param dartLeft the number of dart left
   * @param defaultDart the default dart
   * @param modifiers some modifier
   * @return the best dart
   */
  private def getBestDart(score: Int, dartLeft: Int, defaultDart: Dart, modifiers: Set[Modifier]): Dart = {
    val dartChooser = bestDartChooser(dartLeft)
    // Get all choices
    val dartChoices: DartChoice = dartChooser.getBestDart(score, defaultDart)

    // Choose
    dartChoices.chooseDart(modifiers)
  }

  private def bestDartChooser(dartLeft: Int): BestDart = dartLeft match {
    case 1 => BestDartOneLeft
    case 2 => BestDartTwoLeft
    case _ => BestDartThreeLeft
  }
}

/**
 * Get best dart
 */
trait BestDart {
  def getBestDart(score: Int, defaultDart: Dart): DartChoice
}

sealed abstract class Status

case object Normal extends Status

case object Broken extends Status

case object Win extends Status
