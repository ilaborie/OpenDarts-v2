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

import ai.x01._

/**
 * Dart model
 */
sealed abstract class Dart {
	def color: DartColor
	def sector: DartSector
	def zone: DartZone
	def score: Int = sector.value * zone.coef

	override def toString = this match {
		case UnluckyDart => ":("
		case NoDart => "Out"
		case SemiBull => "25"
		case DoubleBull => "50"
		case NormalDart(sector, zone) => zone match {
			case Triple => "T"+sector.value
			case Double => "D"+sector.value
			case _ => String.valueOf(sector.value)
		}
	}
	// Choosing helper
	def or(that: Dart): DartChoice = OrDart(this, that)
	def or(choice: DartChoice): DartChoice = AlwaysDart(this) or choice
	def butSometime(choice: DartChoice): DartChoice = PreferedDartBut(AlwaysDart(this), choice)
	def withPressureOtherwise(choice: DartChoice): DartChoice = OnPressureDart(AlwaysDart(this), choice)
	def withoutPressureOtherwise(choice: DartChoice): DartChoice = NoPressureAtAllDart(AlwaysDart(this), choice)
	def toBreakOtherwise(choice: DartChoice): DartChoice = PlayBroken(AlwaysDart(this), choice)
}
case object UnluckyDart extends Dart {
	val color = NoColor
	val sector = Unlucky
	val zone = NoZone
}
case object NoDart extends Dart {
	val color = NoColor
	val sector = OutOfBoard
	val zone = NoZone
}
case object SemiBull extends Dart {
	val color = Green
	val sector = Bull
	val zone = Single
}
case object DoubleBull extends Dart {
	val color = Red
	val sector = Bull
	val zone = Double
}
case class NormalDart(val sector: Sector, val zone: DartZone) extends Dart {
	require(zone.coef > 0)
	val color: DartColor = {
		val whiteList = Set(1, 4, 6, 15, 17, 19, 16, 11, 9, 5)
		val baseColor = if (whiteList.contains(sector.value)) White else Black

		zone match {
			case Single => if (sector == 25) Green else if (sector == 50) Red else baseColor
			case _ => if (baseColor == White) Green else Red
		}
	}

}

object Dart {
	/** Build from String */
	def apply(s: String): Dart = {
		if (s.isEmpty()) throw new IllegalArgumentException("Invalid Dart format: "+s)
		try {
			s.toUpperCase match {
				case "DB" => DoubleBull
				case "50" => DoubleBull
				case "SB" => SemiBull
				case "25" => DoubleBull
				case _ =>
					val fistChar = s.charAt(0)
					fistChar.toUpper match {
						case 'S' => NormalDart(Sector((s substring 1).toInt), Single)
						case 'D' => NormalDart(Sector((s substring 1).toInt), Double)
						case 'T' => NormalDart(Sector((s substring 1).toInt), Triple)
						case _ => NormalDart(Sector(s.toInt), Single)
					}
			}
		} catch {
			case _ => throw new IllegalArgumentException("Invalid Dart format: "+s)
		}
	}

	/** Implicit conversion Dart -> DartChoice */
	implicit def Dart2DartChoice(dart: Dart) = AlwaysDart(dart)

	// Triple
	val T20 = NormalDart(Sector(20), Triple)
	val T19 = NormalDart(Sector(19), Triple)
	val T18 = NormalDart(Sector(18), Triple)
	val T17 = NormalDart(Sector(17), Triple)
	val T16 = NormalDart(Sector(16), Triple)
	val T15 = NormalDart(Sector(15), Triple)
	val T14 = NormalDart(Sector(14), Triple)
	val T13 = NormalDart(Sector(13), Triple)
	val T12 = NormalDart(Sector(12), Triple)
	val T11 = NormalDart(Sector(11), Triple)
	val T10 = NormalDart(Sector(10), Triple)
	val T9 = NormalDart(Sector(9), Triple)
	val T8 = NormalDart(Sector(8), Triple)
	val T7 = NormalDart(Sector(7), Triple)
	val T6 = NormalDart(Sector(6), Triple)
	val T5 = NormalDart(Sector(5), Triple)
	val T4 = NormalDart(Sector(4), Triple)
	val T3 = NormalDart(Sector(3), Triple)
	val T2 = NormalDart(Sector(2), Triple)
	val T1 = NormalDart(Sector(1), Triple)

	// Double
	val D20 = NormalDart(Sector(20), Double)
	val D19 = NormalDart(Sector(19), Double)
	val D18 = NormalDart(Sector(18), Double)
	val D17 = NormalDart(Sector(17), Double)
	val D16 = NormalDart(Sector(16), Double)
	val D15 = NormalDart(Sector(15), Double)
	val D14 = NormalDart(Sector(14), Double)
	val D13 = NormalDart(Sector(13), Double)
	val D12 = NormalDart(Sector(12), Double)
	val D11 = NormalDart(Sector(11), Double)
	val D10 = NormalDart(Sector(10), Double)
	val D9 = NormalDart(Sector(9), Double)
	val D8 = NormalDart(Sector(8), Double)
	val D7 = NormalDart(Sector(7), Double)
	val D6 = NormalDart(Sector(6), Double)
	val D5 = NormalDart(Sector(5), Double)
	val D4 = NormalDart(Sector(4), Double)
	val D3 = NormalDart(Sector(3), Double)
	val D2 = NormalDart(Sector(2), Double)
	val D1 = NormalDart(Sector(1), Double)

	// Single
	val S20 = NormalDart(Sector(20), Single)
	val S19 = NormalDart(Sector(19), Single)
	val S18 = NormalDart(Sector(18), Single)
	val S17 = NormalDart(Sector(17), Single)
	val S16 = NormalDart(Sector(16), Single)
	val S15 = NormalDart(Sector(15), Single)
	val S14 = NormalDart(Sector(14), Single)
	val S13 = NormalDart(Sector(13), Single)
	val S12 = NormalDart(Sector(12), Single)
	val S11 = NormalDart(Sector(11), Single)
	val S10 = NormalDart(Sector(10), Single)
	val S9 = NormalDart(Sector(9), Single)
	val S8 = NormalDart(Sector(8), Single)
	val S7 = NormalDart(Sector(7), Single)
	val S6 = NormalDart(Sector(6), Single)
	val S5 = NormalDart(Sector(5), Single)
	val S4 = NormalDart(Sector(4), Single)
	val S3 = NormalDart(Sector(3), Single)
	val S2 = NormalDart(Sector(2), Single)
	val S1 = NormalDart(Sector(1), Single)
}

/**
 * DartColor
 */
sealed abstract class DartColor
case object Black extends DartColor
case object White extends DartColor
case object Green extends DartColor
case object Red extends DartColor
case object NoColor extends DartColor

/**
 * DartSector
 */
sealed abstract class DartSector {
	def value: Int
}
case object Unlucky extends DartSector {
	def value: Int = 0
}
case object OutOfBoard extends DartSector {
	def value: Int = 0
}
case object Bull extends DartSector {
	def value: Int = 25
}
case class Sector(val value: Int) extends DartSector {
	require(value > 0)
	require(value < 21)
}

/**
 * DartZone
 */
sealed abstract class DartZone {
	def coef: Int
}
case object NoZone extends DartZone {
	def coef: Int = 0
}
case object Triple extends DartZone {
	def coef: Int = 3
}
case object Double extends DartZone {
	def coef: Int = 2
}
case object Single extends DartZone {
	def coef: Int = 1
}