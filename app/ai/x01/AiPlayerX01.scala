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
import dart.Dart._
import ai.Level
import scala.util.Random
import scala.collection.immutable.Set
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
			case _ => if (dartLeft == 0) (currentStatus, playedDarts) else {
				val (wished, dart) = playDart(score, dartLeft, request)
				val newStatus = checkStatus(score, dart)
				val scoreLeft = newStatus match {
					case Win => 0
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
	 * @param level the computer level
	 * @param dartLeft the number of dart left
	 * @param defaultDart the default dart
	 * @param modifiers some modifier
	 * @return the played dart
	 */
	def playDart(score: Int, dartLeft: Int, request: PlayerRequest): WishedDone = {
		require(dartLeft > 0 && dartLeft < 4)

		val bestDart = getBestDart(score, dartLeft, request.defaultDart, request.modifiers)
		log.trace("%s in % darts choose %s".format(score, dartLeft, bestDart))
		val done = ComputerDart.throwDart(request.level, bestDart)
		log.trace("...done %s".format(done))

		(bestDart, done)
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
		val bestDartChooser: BestDart = dartLeft match {
			case 1 => BestDartOneLeft
			case 2 => BestDartTwoLeft
			case _ => BestDartThreeLeft
		}

		// Get all choices
		val dartChoices: DartChoice = bestDartChooser.getBestDart(score, defaultDart)

		// Choose
		dartChoices.chooseDart(modifiers)
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

/**
 * Modifier
 */
sealed abstract class Modifier {
	def shouldApply(request: ComputerThrowRequest): Boolean
}
object Modifier {
	def fromRequest(request: ComputerThrowRequest): List[Modifier] = {
		val base: List[Modifier] = List(OnPressure, NoPressureAtAll, GoodDouble, Aggressive)
		LikeDart(Dart(request.default)) :: (base filter (_.shouldApply(request)))
	}
}

/** Opponent might finish */
case object OnPressure extends Modifier {
	def shouldApply(request: ComputerThrowRequest): Boolean = request.opponent <= 1.5
}
/** Have time to better placement */
case object NoPressureAtAll extends Modifier {
	def shouldApply(request: ComputerThrowRequest): Boolean = request.opponent > 4
}
/** Start with a good Double */
case object GoodDouble extends Modifier {
	val goodDouble = List(32, 40, 16, 24, 36, 20, 8)
	def shouldApply(request: ComputerThrowRequest): Boolean = goodDouble contains request.score
}
/** Play all doubles */
case object Aggressive extends Modifier {
	def shouldApply(request: ComputerThrowRequest): Boolean = request.decisive
}
/** Choose prefered dart */
case class LikeDart(dart: Dart) extends Modifier {
	def shouldApply(request: ComputerThrowRequest): Boolean = (dart == Dart(request.default))
} 

