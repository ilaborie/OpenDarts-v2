package ai.x01

import scala.collection.Set
import dart.Dart
import dart.Dart._
import dart.DoubleBull
import dart.SemiBull

object BestDartTwoLeft extends BestDart {

	private val bestDarts2: Map[Int, DartChoice] = Map(
		// 13x
		135 -> OrDart(DoubleBull, T20),
		132 -> OrDart(DoubleBull, T20),

		// 12x
		129 -> OrDart(T20, T19, DoubleBull),
		125 -> OrDart(T20, DoubleBull, T18),
		122 -> PreferedDartBut(T20, T18, T14),
		121 -> PreferedDartBut(T20, DoubleBull, T19, T17),

		// 11x
		115 -> PreferedDartBut(T20, T19, DoubleBull),
		114 -> PreferedDartBut(T20, T19, T18),
		110 -> AlwaysDart(T20),

		// 10x
		108 -> OrDart(T19, T20, T16),
		104 -> AlwaysDart(T18),
		101 -> AlwaysDart(T17),

		// 9x
		95 -> OrDart(DoubleBull, T19),
		94 -> AlwaysDart(T18),
		93 -> AlwaysDart(T19),
		92 -> AlwaysDart(T20),
		91 -> AlwaysDart(T17),
		90 -> OrDart(T20, T18),

		// 8x
		88 -> OrDart(T20, T16),
		85 -> AlwaysDart(T15),
		84 -> AlwaysDart(T20),
		83 -> AlwaysDart(T17),
		82 -> OrDart(T14),
		81 -> OrDart(T19),
		80 -> AlwaysDart(T20),

		// 7x
		79 -> OrDart(T19, T13),
		78 -> OrDart(T18, T14),
		76 -> AlwaysDart(T20),
		75 -> AlwaysDart(T17),
		72 -> AlwaysDart(T16),
		71 -> OrDart(T13, T19),
		70 -> PreferedDartBut(T20, T18, T10),

		// 6x
		69 -> OrDart(T19, T11),
		68 -> OrDart(T18, T16, T20),
		67 -> PreferedDartBut(T17, T9),
		66 -> PreferedDartBut(T16, T10),
		65 -> PreferedDartBut(T15, SemiBull),
		64 -> PreferedDartBut(T14, T16),
		62 -> PreferedDartBut(T12, T10),
		61 -> PreferedDartBut(T11, SemiBull),

		// 5x
		53 -> PreferedDartBut(S13, S17),
		52 -> PreferedDartBut(S12, T16, S20),
		51 -> OrDart(S19, S11),
		50 -> OrDart(DoubleBull, S10, S18),

		// 4x
		47 -> PreferedDartBut(S19, S7, S15),
		41 -> PreferedDartBut(S17, S9, S1),

		// 3x
		39 -> PreferedDartBut(S19, S7),
		37 -> PreferedDartBut(S17, D5),
		35 -> PreferedDartBut(D3, S19),
		33 -> PreferedDartBut(S17, S1),
		31 -> PreferedDartBut(S7, S15),

		// 2x
		29 -> PreferedDartBut(S17, S5),
		27 -> OrDart(S3, S19, S11),
		25 -> PreferedDartBut(S17, S9),
		23 -> PreferedDartBut(S3, S7),
		21 -> PreferedDartBut(S17, S5),

		// 1x

		// 0x
		6 -> AlwaysDart(D3))

	override def getBestDart(score: Int, defaultDart: Dart): DartChoice = bestDarts2.getOrElse(score, BestDartThreeLeft.getBestDart(score, defaultDart))

}