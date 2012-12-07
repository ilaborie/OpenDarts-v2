package ai.x01

import dart._
import dart.Dart._
import scala.collection.Set
import scala.util.Random

class AiPlayerX01 {

	/**
	 * @param score
	 * @param dartLeft
	 * @param request
	 * @return
	 */
	def playTurn(score: Int, dartLeft: Int, request: PlayerRequest): (Status, List[Dart]) = playTurnAux(score, dartLeft, request, Normal, Nil)

	private def playTurnAux(score: Int, dartLeft: Int, request: PlayerRequest, currentStatus: Status, playedDarts: List[Dart]): (Status, List[Dart]) = {
		currentStatus match {
			case Win => (currentStatus, playedDarts)
			case Broken => (currentStatus, playedDarts)
			case _ => if (dartLeft == 0) (currentStatus, playedDarts) else {
				val dart = playDart(score, dartLeft, request)
				val newStatus = checkStatus(score, dart)
				val scoreLeft = newStatus match {
					case Win => 0
					case Broken => score
					case Normal => score - dart.score
				}

				playTurnAux(scoreLeft, dartLeft - 1, request, newStatus, dart :: playedDarts)
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
	def playDart(score: Int, dartLeft: Int, request: PlayerRequest): Dart = {
		require(dartLeft > 0 && dartLeft < 4)

		val bestDart = getBestDart(score, dartLeft, request.defaultDart, request.modifiers)
		ComputerDart.throwDart(request.level, bestDart)
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
