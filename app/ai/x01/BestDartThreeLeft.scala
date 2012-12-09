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

object BestDartThreeLeft extends BestDart {

	private val bestDarts3: Map[Int, DartChoice] = Map(

		// 21x
		217 -> T18,
		214 -> T18,

		// 19x
		195 -> T19,

		// 18x
		189 -> T19,
		188 -> T18,
		186 -> T19,
		185 -> DoubleBull,
		183 -> T19,
		182 -> T18,

		// 17x
		170 -> T20,

		// 16x
		167 -> OrDart(T20, T19),
		168 -> PreferedDartBut(T16, T20, T19),
		164 -> OrDart(T20, T19),
		161 -> T20,
		160 -> T20,

		// 15x
		158 -> T20,
		157 -> OrDart(T20, T19),
		156 -> T20,
		155 -> OrDart(T20, T19),
		154 -> OrDart(T20, T19),
		153 -> OrDart(T20, T19),
		152 -> OrDart(T20, T19),
		151 -> OrDart(T20, T19),
		150 -> OrDart(T20, T19),

		// 14x
		149 -> OrDart(T20, T19),
		148 -> OrDart(T20, T19),
		147 -> OrDart(T20, T19),
		146 -> OrDart(T20, T19),
		145 -> OrDart(T20, T19),
		144 -> OrDart(T20, T19),
		143 -> OrDart(T20, T19),
		142 -> OrDart(T20, T19),
		141 -> OrDart(T20, T19),
		140 -> T20,

		// 13x
		139 -> OrDart(T20, T19),
		138 -> OrDart(T20, T19),
		137 -> T20,
		136 -> T20,
		135 -> PreferedDartBut(DoubleBull, T20),
		134 -> T20,
		133 -> T20,
		132 -> PreferedDartBut(DoubleBull, T20),
		131 -> T19,
		130 -> T20,

		// 12x
		129 -> PreferedDartBut(T19, DoubleBull),
		128 -> T18,
		127 -> T20,
		126 -> T19,
		125 -> PreferedDartBut(DoubleBull, T18),
		124 -> T20,
		123 -> T19,
		122 -> PreferedDartBut(T18, T14, T20),
		121 -> PreferedDartBut(T20, DoubleBull, T17),
		120 -> T20,

		// 11x
		119 -> T19,
		118 -> T20,
		117 -> T19,
		116 -> PreferedDartBut(T19, T20),
		115 -> PreferedDartBut(T20, DoubleBull),
		114 -> PreferedDartBut(T19, T18),
		113 -> T19,
		112 -> T20,
		111 -> T20,
		110 -> OrDart(T20, T19),

		// 10x
		109 -> T20,
		108 -> OrDart(T19, T16),
		107 -> T19,
		106 -> T20,
		105 -> T20,
		104 -> PreferedDartBut(T20, T16, T18),
		103 -> T19,
		102 -> T20,
		101 -> OrDart(T20, T17),
		100 -> T20,

		// 9x
		99 -> OrDart(T20, T19),
		98 -> T20,
		97 -> T19,
		96 -> T20,
		95 -> OnPressureDart(DoubleBull, OrDart(DoubleBull, T19)),
		94 -> OnPressureDart(DoubleBull, T18),
		93 -> OnPressureDart(DoubleBull, T19),
		92 -> OnPressureDart(DoubleBull, T20),
		91 -> OnPressureDart(DoubleBull, T17),
		90 -> OnPressureDart(DoubleBull, OrDart(DoubleBull, T20, T18)),

		// 8x
		89 -> T19,
		88 -> OrDart(T20, T16),
		87 -> T17,
		86 -> T18,
		85 -> OrDart(T15, DoubleBull),
		84 -> PreferedDartBut(T20, DoubleBull),
		83 -> PreferedDartBut(T17, DoubleBull),
		82 -> OrDart(T14, DoubleBull),
		81 -> OrDart(T19, DoubleBull),
		80 -> OrDart(T20, T16),

		// 7x
		79 -> OrDart(T19, T13),
		78 -> OrDart(T18, T14),
		77 -> T19,
		76 -> OrDart(T20, T16),
		75 -> PreferedDartBut(T17, SemiBull),
		74 -> T14,
		73 -> T19,
		72 -> T16,
		71 -> PreferedDartBut(T13, T19),
		70 -> OrDart(T20, T18, T10),

		// 6x
		69 -> OrDart(T19, T11),
		68 -> OrDart(T18, T16, T20),
		67 -> PreferedDartBut(T9, T17),
		66 -> PreferedDartBut(T10, T16),
		65 -> PreferedDartBut(SemiBull, T15),
		64 -> PreferedDartBut(T16, T14),
		63 -> T13,
		62 -> PreferedDartBut(T10, T12),
		61 -> PreferedDartBut(SemiBull, T11),
		60 -> T20,

		// 5x
		59 -> S19,
		58 -> S18,
		57 -> S17,
		56 -> S16,
		55 -> S15,
		54 -> S14,
		53 -> PreferedDartBut(S13, S17),
		52 -> PreferedDartBut(S12, T16),
		51 -> OrDart(S19, S11),
		50 -> PreferedDartBut(S10, DoubleBull, S18),

		// 4x
		49 -> PreferedDartBut(S17, S9),
		48 -> PreferedDartBut(S16, S8),
		47 -> PreferedDartBut(S15, S7, S19),
		46 -> PreferedDartBut(S6, S14, S10),
		45 -> PreferedDartBut(S5, S13, S7, S19),
		44 -> PreferedDartBut(S4, S8, S16, S18, S12),
		43 -> PreferedDartBut(S3, S11),
		42 -> PreferedDartBut(S10, S6),
		41 -> PreferedDartBut(S1, S9, S17),
		40 -> D20,

		// 3x
		39 -> PreferedDartBut(S7, S19),
		38 -> D19,
		37 -> PreferedDartBut(S5, S17),
		36 -> D18,
		35 -> PreferedDartBut(D3, S19),
		34 -> D17,
		33 -> PreferedDartBut(S17, S1),
		32 -> D16,
		31 -> PreferedDartBut(S15, S7),
		30 -> D15,

		// 2x
		29 -> PreferedDartBut(S5, S17),
		28 -> D14,
		27 -> OrDart(S11, S19, S3),
		26 -> D13,
		25 -> PreferedDartBut(S17, S9),
		24 -> D12,
		23 -> PreferedDartBut(S7, S3),
		22 -> D11,
		21 -> PreferedDartBut(S5, S17),
		20 -> D10,

		// 1x
		19 -> PreferedDartBut(S3, S17),
		18 -> D9,
		17 -> PreferedDartBut(S1, S13),
		16 -> D8,
		15 -> PreferedDartBut(S7, S13),
		14 -> D7,
		13 -> PreferedDartBut(S5, S11),
		12 -> D6,
		11 -> S3,
		10 -> D5,

		// 0x
		9 -> S1,
		8 -> D4,
		7 -> S3,
		6 -> PreferedDartBut(D3, S2),
		5 -> S1,
		4 -> D2,
		3 -> S1,
		2 -> D1)

	def getBestDart(score: Int, defaultDart: Dart): DartChoice = bestDarts3.getOrElse(score, defaultDart)

}