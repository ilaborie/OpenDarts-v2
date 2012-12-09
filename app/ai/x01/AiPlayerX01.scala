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
import scala.util.Random
import scala.collection.immutable.Set

object AiPlayerX01 {

	/**
	 * Process Computer Request
	 * @param request the request
	 * @return the result
	 */
	def processComputerRequest(request: ComputerThrowRequest): ComputerThrowResult = {
		val score = request.score
		val level = Level(request.level)
		val modifiers: Set[Modifier] = Set() // FIXME use
		val dart = Dart(request.default)

		val req = PlayerRequest(level, dart, modifiers)

		val (status, darts) = playTurn(score, req)

		val scoreLeft = status match {
			case Win => 0
			case Broken => score
			case _ => darts.foldLeft(score)((x: Int, d: (Dart, Dart)) => x - d._2.score)
		}

		ComputerThrowResult(request.comKey, darts, status, scoreLeft)
	}

	/**
	 * Throw three darts
	 * @param score the initial score
	 * @param request the request
	 * @return the result
	 */
	def playTurn(score: Int, request: PlayerRequest): (Status, List[(Dart, Dart)]) = playTurnAux(score, 3, request, Normal, Nil)

	private def playTurnAux(score: Int, dartLeft: Int, request: PlayerRequest, currentStatus: Status, playedDarts: List[(Dart, Dart)]): (Status, List[(Dart, Dart)]) = {
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
	def playDart(score: Int, dartLeft: Int, request: PlayerRequest): (Dart, Dart) = {
		require(dartLeft > 0 && dartLeft < 4)

		val bestDart = getBestDart(score, dartLeft, request.defaultDart, request.modifiers)
		(bestDart, ComputerDart.throwDart(request.level, bestDart))
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
sealed abstract class Modifier
case object OnPressure extends Modifier // opponent might finish
case object NoPressureAtAll extends Modifier // try the best double
case object Agressive extends Modifier // play double
case object GoodDouble extends Modifier // good double (40,32,16,24,20,8)
case object LikeBull extends Modifier // player like bull
case object LikeT20 extends Modifier // player like T20
case object LikeT19 extends Modifier // player like T19
case object LikeT18 extends Modifier // player like T18
case object LikeT17 extends Modifier // player like T17
case object LikeT16 extends Modifier // player like T16
