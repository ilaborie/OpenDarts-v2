package ai.x01

import scala.collection.Set
import dart.Dart
import dart.Dart._
import dart.DoubleBull
import dart.SemiBull

object BestDartThreeLeft extends BestDart {

	private val bestDarts3: Map[Int, DartChoice] = Map(
		// 17x
		170 -> AlwaysDart(T20),

		// 16x
		167 -> OrDart(T20, T19),
		164 -> OrDart(T20, T19),
		161 -> AlwaysDart(T20),
		160 -> AlwaysDart(T20),

		// 15x
		158 -> AlwaysDart(T20),
		157 -> OrDart(T20, T19),
		156 -> AlwaysDart(T20),
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
		140 -> AlwaysDart(T20),

		// 13x
		139 -> OrDart(T20, T19),
		138 -> OrDart(T20, T19),
		137 -> AlwaysDart(T20),
		136 -> AlwaysDart(T20),
		135 -> PreferedDartBut(DoubleBull, T20),
		134 -> AlwaysDart(T20),
		133 -> AlwaysDart(T20),
		132 -> PreferedDartBut(DoubleBull, T20),
		131 -> AlwaysDart(T19),
		130 -> AlwaysDart(T20),

		// 12x
		129 -> PreferedDartBut(T19, DoubleBull),
		128 -> AlwaysDart(T18),
		127 -> AlwaysDart(T20),
		126 -> AlwaysDart(T19),
		125 -> PreferedDartBut(DoubleBull, T18),
		124 -> AlwaysDart(T20),
		123 -> AlwaysDart(T19),
		122 -> PreferedDartBut(T18, T14, T20),
		121 -> PreferedDartBut(T20, DoubleBull, T17),
		120 -> AlwaysDart(T20),

		// 11x
		119 -> AlwaysDart(T19),
		118 -> AlwaysDart(T20),
		117 -> AlwaysDart(T19),
		116 -> PreferedDartBut(T19, T20),
		115 -> PreferedDartBut(T20, DoubleBull),
		114 -> PreferedDartBut(T19, T18),
		113 -> AlwaysDart(T19),
		112 -> AlwaysDart(T20),
		111 -> AlwaysDart(T20),
		110 -> OrDart(T20, T19),

		// 10x
		109 -> AlwaysDart(T20),
		108 -> OrDart(T19, T16),
		107 -> AlwaysDart(T19),
		106 -> AlwaysDart(T20),
		105 -> AlwaysDart(T20),
		104 -> PreferedDartBut(T20, T16, T18),
		103 -> AlwaysDart(T19),
		102 -> AlwaysDart(T20),
		101 -> OrDart(T20, T17),
		100 -> AlwaysDart(T20),

		// 9x
		99 -> OrDart(T20, T19),
		98 -> AlwaysDart(T20),
		97 -> AlwaysDart(T19),
		96 -> AlwaysDart(T20),
		95 -> OnPressureDart(DoubleBull, OrDart(DoubleBull, T19)),
		94 -> OnPressureDart(DoubleBull, AlwaysDart(T18)),
		93 -> OnPressureDart(DoubleBull, AlwaysDart(T19)),
		92 -> OnPressureDart(DoubleBull, AlwaysDart(T20)),
		91 -> OnPressureDart(DoubleBull, AlwaysDart(T17)),
		90 -> OnPressureDart(DoubleBull, OrDart(DoubleBull, T20, T18)),

		// 8x
		89 -> AlwaysDart(T19),
		88 -> OrDart(T20, T16),
		87 -> AlwaysDart(T17),
		86 -> AlwaysDart(T18),
		85 -> OrDart(T15, DoubleBull),
		84 -> PreferedDartBut(T20, DoubleBull),
		83 -> PreferedDartBut(T17, DoubleBull),
		82 -> OrDart(T14, DoubleBull),
		81 -> OrDart(T19, DoubleBull),
		80 -> OrDart(T20, T16),

		// 7x
		79 -> OrDart(T19, T13),
		78 -> OrDart(T18, T14),
		77 -> AlwaysDart(T19),
		76 -> OrDart(T20, T16),
		75 -> PreferedDartBut(T17, SemiBull),
		74 -> AlwaysDart(T14),
		73 -> AlwaysDart(T19),
		72 -> AlwaysDart(T16),
		71 -> PreferedDartBut(T13, T19),
		70 -> OrDart(T20, T18, T10),

		// 6x
		69 -> OrDart(T19, T11),
		68 -> OrDart(T18, T16, T20),
		67 -> PreferedDartBut(T9, T17),
		66 -> PreferedDartBut(T10, T16),
		65 -> PreferedDartBut(SemiBull, T15),
		64 -> PreferedDartBut(T16, T14),
		63 -> AlwaysDart(T13),
		62 -> PreferedDartBut(T10, T12),
		61 -> PreferedDartBut(SemiBull, T11),
		60 -> AlwaysDart(T20),

		// 5x
		59 -> AlwaysDart(S19),
		58 -> AlwaysDart(S18),
		57 -> AlwaysDart(S17),
		56 -> AlwaysDart(S16),
		55 -> AlwaysDart(S15),
		54 -> AlwaysDart(S14),
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
		40 -> AlwaysDart(D20),

		// 3x
		39 -> PreferedDartBut(S7, S19),
		38 -> AlwaysDart(D19),
		37 -> PreferedDartBut(S5, S17),
		36 -> AlwaysDart(D18),
		35 -> PreferedDartBut(D3, S19),
		34 -> AlwaysDart(D17),
		33 -> PreferedDartBut(S17, S1),
		32 -> AlwaysDart(D16),
		31 -> PreferedDartBut(S15, S7),
		30 -> AlwaysDart(D15),

		// 2x
		29 -> PreferedDartBut(S5, S17),
		28 -> AlwaysDart(D14),
		27 -> OrDart(S11, S19, S3),
		26 -> AlwaysDart(D13),
		25 -> PreferedDartBut(S17, S9),
		24 -> AlwaysDart(D12),
		23 -> PreferedDartBut(S7, S3),
		22 -> AlwaysDart(D11),
		21 -> PreferedDartBut(S5, S17),
		20 -> AlwaysDart(D10),

		// 1x
		19 -> PreferedDartBut(S3, S17),
		18 -> AlwaysDart(D9),
		17 -> PreferedDartBut(S1, S13),
		16 -> AlwaysDart(D8),
		15 -> PreferedDartBut(S7, S13),
		14 -> AlwaysDart(D7),
		13 -> PreferedDartBut(S5, S11),
		12 -> AlwaysDart(D6),
		11 -> AlwaysDart(S3),
		10 -> AlwaysDart(D5),

		// 0x
		9 -> AlwaysDart(S1),
		8 -> AlwaysDart(D4),
		7 -> AlwaysDart(S3),
		6 -> PreferedDartBut(D3, S2),
		5 -> AlwaysDart(S1),
		4 -> AlwaysDart(D2),
		3 -> AlwaysDart(S1),
		2 -> AlwaysDart(D1))

	def getBestDart(score: Int, defaultDart: Dart): DartChoice = bestDarts3.getOrElse(score, AlwaysDart(defaultDart))

}