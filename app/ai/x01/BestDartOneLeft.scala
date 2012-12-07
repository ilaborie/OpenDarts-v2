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

import scala.collection.Set
import dart.Dart
import dart.Dart._
import dart.DoubleBull
import dart.SemiBull

object BestDartOneLeft extends BestDart {

	val bestDarts1: Map[Int, DartChoice] = Map(

		// 12x
		125 -> PreferedDartBut(DoubleBull, T18),
		122 -> PreferedDartBut(T20, T14, T18),
		121 -> PreferedDartBut(T20, DoubleBull, T17),

		// 11x
		116 -> PreferedDartBut(T20, T19),
		115 -> AlwaysDart(T20),
		114 -> AlwaysDart(T20),
		110 -> OrDart(T20, T19),

		// 10x
		108 -> OrDart(T19, T16),
		104 -> PreferedDartBut(T18, T16, T20),
		101 -> PreferedDartBut(T20, T17),

		// 9x
		95 -> OrDart(DoubleBull, T19),
		94 -> AlwaysDart(T18),
		93 -> AlwaysDart(T19),
		92 -> AlwaysDart(T20),
		91 -> AlwaysDart(T17),
		90 -> OrDart(DoubleBull, T20, T18),

		// 8x
		81 -> AlwaysDart(T19),
		80 -> PreferedDartBut(T20, T16),

		// 7x
		72 -> PreferedDartBut(T16, T12),
		70 -> PreferedDartBut(T10, T18, T20),

		// 6x
		69 -> OrDart(T19, T11),
		68 -> PreferedDartBut(T20, T16, T18),
		67 -> PreferedDartBut(T17, T9),
		64 -> AlwaysDart(T16),
		62 -> PreferedDartBut(T10, T12),
		61 -> PreferedDartBut(SemiBull, T7),

		// 5x
		53 -> PreferedDartBut(S13, S17),
		52 -> PreferedDartBut(S12, T16, T20),
		51 -> OrDart(S19, S11),
		50 -> PreferedDartBut(S10, DoubleBull, S18),

		// 4x

		// 3x

		// 2x

		// 1x

		// 0x
		6 -> AlwaysDart(D3))

	override def getBestDart(score: Int, defaultDart: Dart): DartChoice = bestDarts1.getOrElse(score, BestDartThreeLeft.getBestDart(score, defaultDart))

}