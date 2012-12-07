package dart

import scala.math._

/**
 * Dart Board model
 * @author igor
 */
object DartBoard {

	/**
	 * Position is (x:Double, y:Double)
	 */
	type Position = (Double, Double)

	/**
	 * Dartboard zone
	 * Bull50: [0, 7]
	 * Bull25: [7, 21]
	 * Single: [21, 101]
	 * Triple: [101, 111]
	 * Single: [111, 164]
	 * Double: [164, 174]
	 * out ...
	 */

	private val doubleBullZone = 7
	private val simpleBullZone = doubleBullZone + 14
	private val smallSimpleZone = simpleBullZone + 80
	private val tripleZone = smallSimpleZone + 10
	private val bigZone = tripleZone + 53
	private val doubleZone = bigZone + 10

	private val sectorAngle: Map[Sector, Int] = {
		{
			// Sector from angle 0 with reverse clockwise
			val sectors = List(6, 13, 4, 18, 1, 20, 5, 12, 9, 14, 11, 8, 16, 7, 19, 3, 17, 2, 15, 10)
			for (i <- 0 until sectors.size) yield Sector(sectors(i)) -> (i * 18)
		} toMap
	}

	/**
	 * Get the dart position in the dart board
	 * @param dart the dart
	 * @return the central position
	 */
	def getDartPosition(dart: Dart): Position = (getDartX(dart), getDartY(dart))

	/**
	 * Return the x position of a dart
	 * @param dart the dart
	 * @return the x position
	 */
	private def getDartX(dart: Dart): Double = {
		dart match {
			case DoubleBull => 0
			case SemiBull => (doubleBullZone + simpleBullZone) / 2
			case NormalDart(sector, zone) => {
				val dist = getDistance(zone);
				val deg = getAngle(sector);
				val rad = (deg * Pi) / 180;
				dist * cos(rad);
			}
			case _ => getDistance(NoZone)
		}
	}

	/**
	 * Return the y position of a dart
	 * @param dart the dart
	 * @return the y position
	 */
	private def getDartY(dart: Dart): Double = {
		dart match {
			case DoubleBull => 0
			case SemiBull => (doubleBullZone + simpleBullZone) / 2
			case NormalDart(sector, zone) => {
				val dist = getDistance(zone);
				val deg = getAngle(sector);
				val rad = (deg * Pi) / 180;
				dist * sin(rad);
			}
			case _ => getDistance(NoZone)
		}
	}

	/**
	 * Get the dart from position
	 * @param position the position
	 * @return the dart
	 */
	def getDart(position: Position): Dart = {
		val distance = getDistance(position)

		if (distance > doubleZone) NoDart
		else if (distance > bigZone) NormalDart(getSector(position), Double)
		else if (distance > tripleZone) NormalDart(getSector(position), Single)
		else if (distance > smallSimpleZone) NormalDart(getSector(position), Triple)
		else if (distance > simpleBullZone) NormalDart(getSector(position), Single)
		else if (distance > doubleBullZone) SemiBull
		else DoubleBull
	}
	/**
	 * Get the dart from position
	 * @param x the x position
	 * @param y the y position
	 * @return the dart
	 */
	def getDart(x: Double, y: Double): Dart = getDart((x, y))

	/**
	 * Return the sector of the position
	 * @param position the position
	 * @return the sector
	 */
	private def getSector(position: Position): Sector = {
		val angle = getAngle(position) - 9 // offset half a sector angle (e.g. 6 in [-9, 9])
		val sec: Option[(Sector, Int)] = sectorAngle.find(sa => (angle > sa._2))
		// Take the sector of fail
		sec.getOrElse(throw new Error("WTF: the angle "+angle+"seems invalid"))._1
	}

	/**
	 * Distance with origin
	 * @param position the position
	 * @return the distance
	 */
	private def getDistance(position: Position): Double = {
		sqrt(position._1 * position._1 + position._2 * position._2)
	} ensuring (_ >= 0)

	/**
	 * Distance with origin
	 * @param zone the zone
	 * @return the distance (center of the zone)
	 */
	private def getDistance(zone: DartZone): Double = {
		zone match {
			case Triple => (smallSimpleZone + tripleZone) / 2
			case Single => (tripleZone + bigZone) / 2
			case Double => (bigZone + doubleZone) / 2
			case NoZone => doubleZone + 30
		}
	} ensuring (_ >= 0)

	/**
	 * Return the angle of the position
	 * @param position the position
	 * @return the angle (always >= 0)
	 */
	private def getAngle(position: Position): Double = {
		val atan = atan2(position._2, position._1)
		val deg = (atan * 180) / Pi

		if (deg < 0) deg + 360 else deg
	} ensuring (_ >= 0)

	/**
	 * Return the angle of the sector
	 * @param sector the sector
	 * @return the angle (always >= 0)
	 */
	private def getAngle(sector: Sector): Double = {
		sectorAngle(sector)
	} ensuring (_ >= 0)

}