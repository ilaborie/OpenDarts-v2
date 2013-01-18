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

import dart.Dart
import dart.Dart._
import dart.DoubleBull
import dart.SemiBull

object BestDartTwoLeft extends BestDart {

	private val bestDarts2: Map[Int, DartChoice] = Map(
		// 13x
		135 -> (DoubleBull or T20),
		132 -> (DoubleBull or T20),

		// 12x
		129 -> (T20 or T19 or DoubleBull),
		125 -> (T20 or DoubleBull or T18),
		122 -> (T20 butSometime (T18 or T14)),
		121 -> (T20 butSometime (DoubleBull or T19 or T17)),

		// 11x
		115 -> (T20 butSometime (T19 or DoubleBull)),
		114 -> (T20 butSometime (T19 or T18)),
		110 -> T20,

		// 10x
		108 -> (T19 or T20 or T16),
		104 -> T18,
		101 -> T17,

		// 9x
		95 -> (DoubleBull or T19),
		94 -> T18,
		93 -> T19,
		92 -> T20,
		91 -> T17,
		90 -> (T20 or T18),

		// 8x
		88 -> (T20 or T16),
		85 -> T15,
		84 -> T20,
		83 -> T17,
		82 -> T14,
		81 -> T19,
		80 -> T20,

		// 7x
		79 -> (T19 or T13),
		78 -> (T18 or T14),
		76 -> T20,
		75 -> T17,
		72 -> T16,
		71 -> (T13 or T19),
		70 -> (T20 butSometime (T18 or T10)),

		// 6x
		69 -> (T19 or T11),
		68 -> (T18 or T16 or T20),
		67 -> (T17 butSometime T9),
		66 -> (T16 butSometime T10),
		65 -> (T15 butSometime SemiBull),
		64 -> (T14 butSometime T16),
		62 -> (T12 butSometime T10),
		61 -> (T11 butSometime SemiBull),

		// 5x
		53 -> (S13 butSometime S17),
		52 -> (S12 butSometime (T16 or S20)),
		51 -> (S19 or S11),
		50 -> (DoubleBull or S10 or S18),

		// 4x
		47 -> (S19 butSometime (S7 or S15)),
		41 -> (S17 butSometime (S9 or S1)),

		// 3x
		39 -> (S19 butSometime S7),
		37 -> (S17 butSometime D5),
		35 -> (D3 butSometime S19),
		33 -> (S17 butSometime S1),
		31 -> (S7 butSometime S15),

		// 2x
		29 -> (S17 butSometime S5),
		27 -> (S3 or S19 or S11),
		25 -> (S17 butSometime S9),
		23 -> (S7 withoutPressureOtherwise (S3 butSometime S7)),
		21 -> (S17 butSometime S5),

		// 1x

		// 0x
		6 -> (S2 withoutPressureOtherwise D3)
		)

	override def getBestDart(score: Int, defaultDart: Dart): DartChoice = bestDarts2.getOrElse(score, BestDartThreeLeft.getBestDart(score, defaultDart))

}