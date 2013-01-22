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

  private val angles = {
    // Sector from angle 0 with reverse clockwise
    val sectors = List(6, 13, 4, 18, 1, 20, 5, 12, 9, 14, 11, 8, 16, 7, 19, 3, 17, 2, 15, 10)
    for (i <- 0 until sectors.size) yield (Sector(sectors(i)), (i * 18))
  }
  val sectorAngleList: List[(Sector, Int)] = angles.toList
  val sectorAngleMap: Map[Sector, Int] = angles.toMap

  /**
   * Get the dart position in the dart board
   * @param dart the dart
   * @return the central position
   */
  def getDartPosition(dart: Dart): Position = {
    val position = (getDartX(dart), getDartY(dart))
    position
  }

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
        val dist = getDistance(zone)
        val deg = getAngle(sector)
        val rad = (deg * Pi) / 180
        dist * cos(rad)
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
        val dist = getDistance(zone)
        val deg = getAngle(sector)
        val rad = (deg * Pi) / 180
        dist * sin(rad)
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

    val dart = if (distance > doubleZone) NoDart
    else if (distance > bigZone) NormalDart(getSector(position), Double)
    else if (distance > tripleZone) NormalDart(getSector(position), Single)
    else if (distance > smallSimpleZone) NormalDart(getSector(position), Triple)
    else if (distance > simpleBullZone) NormalDart(getSector(position), Single)
    else if (distance > doubleBullZone) SemiBull
    else DoubleBull

    dart
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
  def getSector(position: Position): Sector = {
    val angle = getAngle(position) - 9 // offset half a sector angle (e.g. 6 in [-9, 9])
    val sec: Option[(Sector, Int)] = sectorAngleList.find(sa => (angle < sa._2))
    // Take the sector
    sec match {
      case Some((sector, _)) => sector
      case _ => Sector(6)
    }
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
    sectorAngleMap(sector)
  } ensuring (_ >= 0)

}