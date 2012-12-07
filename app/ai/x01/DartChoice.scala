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

/** There is a prefered choice, but modifier can change the deal */
case class NoPressureAtAllDart(noPressureDart: Dart, otherChoice: DartChoice) extends DartChoice {
	def chooseDart(modifiers: Set[Modifier]): Dart = {
		if (modifiers contains NoPressureAtAll) noPressureDart
		else otherChoice.chooseDart(modifiers)
	}
}