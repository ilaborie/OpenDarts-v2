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

import dart._
import dart.Dart._
import scala.collection.Set
import scala.util.Random

sealed abstract class DartChoice {

	/**
	 * Choose the darts
	 * @param modifiers some modifiers
	 * @return the chosen dart
	 */
	def chooseDart(modifiers: Set[Modifier]): Dart

	/**
	 * Choose a dart into a weighted list
	 * @param wDarts the  weighted list
	 * @return the chosen dart
	 */
	protected def choose(wDarts: Seq[(Dart, Int)]): Dart = {
		val allDarts = for {
			(dart, weight) <- wDarts
			i <- 0 to weight
		} yield dart

		val index = Random.nextInt(allDarts size)
		allDarts(index)
	}

	/**
	 * Create a weighted dart
	 * @param dart the dart
	 * @param modifiers the modifiers
	 * @param weight the weight if the modifier is OK
	 * @return the weighted dart
	 */
	protected def createWeight(dart: Dart, modifiers: Set[Modifier], weight: Int): (Dart, Int) = {
		if (modifiers contains LikeDart(dart)) (dart, weight)
		else (dart, 1) // Default weight
	}
}
object DartChoice {
	implicit def Dart2DartChoice(dart: Dart) = AlwaysDart(dart)
}

/** No choice, use the only darts */
case class AlwaysDart(dart: Dart) extends DartChoice {
	def chooseDart(modifiers: Set[Modifier]): Dart = dart
}

/** Basic choice */
case class OrDart(darts: Dart*) extends DartChoice {
	def chooseDart(modifiers: Set[Modifier]): Dart = {
		val size = darts.size
		val wDarts = darts map ((dart: Dart) => createWeight(dart, modifiers, size))
		choose(wDarts)
	}
}

/** There is a prefered choice, but modifier can change the deal */
case class PreferedDartBut(preferedDart: Dart, otherDarts: Dart*) extends DartChoice {
	private val groovyFactor = 15

	def chooseDart(modifiers: Set[Modifier]): Dart = {
		if (otherDarts isEmpty) preferedDart
		else {
			val size = otherDarts.size
			val wOtherDarts = otherDarts map ((dart: Dart) => createWeight(dart, modifiers, size))
			choose((preferedDart, size * groovyFactor) :: wOtherDarts.toList)
		}
	}
}

/** There is a prefered choice, but modifier can change the deal */
case class OnPressureDart(onPressureChoice: DartChoice, otherChoice: DartChoice) extends DartChoice {
	def chooseDart(modifiers: Set[Modifier]): Dart = {
		val choice = if (modifiers contains OnPressure) onPressureChoice else otherChoice
		choice chooseDart modifiers
	}
}

/** There is a prefered choice, but modifier can change the deal */
case class NoPressureAtAllDart(noPressureChoice: DartChoice, otherChoice: DartChoice) extends DartChoice {
	def chooseDart(modifiers: Set[Modifier]): Dart = {
		val choice = if (modifiers contains NoPressureAtAll) noPressureChoice else otherChoice
		choice chooseDart modifiers
	}
}
case class PlayBroken(breakChoice: DartChoice, otherChoice: DartChoice) extends DartChoice {
	def chooseDart(modifiers: Set[Modifier]): Dart = {
		val choice = if (modifiers contains GoodDouble) breakChoice else otherChoice
		choice chooseDart modifiers
	}
}
