package ai.x01

import dart._
import dart.Dart._
import scala.collection.Set
import scala.util.Random

sealed abstract class DartChoice {
	def chooseDart(modifiers: Set[Modifier]): Dart
}

/** No choice, use the only darts */
case class AlwaysDart(dart: Dart) extends DartChoice {
	def chooseDart(modifiers: Set[Modifier]): Dart = dart
}

/** Basic choice */
case class OrDart(darts: Dart*) extends DartChoice {
	def chooseDart(modifiers: Set[Modifier]): Dart = {
		// FIXME take care of Modifier

		val allDarts: List[Dart] = darts toList
		val index = Random.nextInt(allDarts size)
		allDarts(index)
	}
}

/** There is a prefered choice, but modifier can change the deal */
case class PreferedDartBut(preferedDart: Dart, otherDarts: Dart*) extends DartChoice {
	private val groovyFactor = 10

	def chooseDart(modifiers: Set[Modifier]): Dart = {
		// FIXME take care of Modifier

		if (Random.nextInt(groovyFactor) != 0) preferedDart
		else {
			val allDarts: List[Dart] = otherDarts toList
			val index = Random.nextInt(allDarts size)
			allDarts(index)
		}
	}
}

/** There is a prefered choice, but modifier can change the deal */
case class OnPressureDart(onPressureDart: Dart, otherChoice: DartChoice) extends DartChoice {
	def chooseDart(modifiers: Set[Modifier]): Dart = {
		if (modifiers contains OnPressure) onPressureDart
		else otherChoice.chooseDart(modifiers)
	}
}