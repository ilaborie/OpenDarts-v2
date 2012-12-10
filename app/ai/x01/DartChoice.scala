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

	// Helpers
	def or(choice: DartChoice): DartChoice = OrChoice(this, choice)
	def butSometime(choice: DartChoice): DartChoice = PreferedDartBut(this, choice)
	def withPressureOtherwise(choice: DartChoice): DartChoice = OnPressureDart(this, choice)
	def withoutPressureOtherwise(choice: DartChoice): DartChoice = NoPressureAtAllDart(this, choice)
	def toBreakOtherwise(choice: DartChoice): DartChoice = PlayBroken(this, choice)
}

case class OrChoice(dartChoices: DartChoice*) extends DartChoice {
	def chooseDart(modifiers: Set[Modifier]): Dart = {
		val choice = dartChoices(Random.nextInt(dartChoices size))
		choice chooseDart modifiers
	}
	override def or(choice: DartChoice): DartChoice = OrChoice((choice :: dartChoices.toList): _*)
}

/** No choice, use the only darts */
case class AlwaysDart(dart: Dart) extends DartChoice {
	def chooseDart(modifiers: Set[Modifier]): Dart = dart
}

/** Basic choice */
case class OrDart(darts: Dart*) extends DartChoice {
	val size = darts.size

	override def or(choice: DartChoice): DartChoice = {
		choice match {
			case OrDart(others @ _*) => OrDart((darts.toList ++ others): _*)
			case AlwaysDart(dart) => OrDart((dart :: darts.toList): _*)
			case _ => OrChoice(this, choice)
		}
	}

	def chooseDart(modifiers: Set[Modifier]): Dart = {
		val allDarts = for {
			(dart, weight) <- getDartsWeight(modifiers)
			i <- 0 to weight
		} yield dart

		allDarts(Random.nextInt(allDarts size))
	}

	def getDartsWeight(modifiers: Set[Modifier]): Seq[(Dart, Int)] = darts map (getDartWeight(_, modifiers))

	def getDartWeight(dart: Dart, modifiers: Set[Modifier]): (Dart, Int) = {
		// Handle LikeDart and Aggressive
		val base = if (modifiers contains LikeDart(dart)) size else 1
		val w = if ((modifiers contains Aggressive) && dart.zone == Double) base + size else base
		(dart, w)
	}
}

/** There is a prefered choice, but modifier can change the deal */
case class PreferedDartBut(preferedChoice: DartChoice, otherChoice: DartChoice) extends DartChoice {
	private val groovyFactor = 15

	override def chooseDart(modifiers: Set[Modifier]): Dart = {
		if (Random.nextInt(groovyFactor) == 0) otherChoice chooseDart modifiers
		else preferedChoice chooseDart modifiers
	}
}
/** If a modifier is present or another choice */
abstract class OnModifierDartsChoice(modifier: Modifier, onModifierChoice: DartChoice, elseChoice: DartChoice) extends DartChoice {
	def chooseDart(modifiers: Set[Modifier]): Dart = {
		val choice = if (modifiers contains modifier) onModifierChoice else elseChoice
		choice chooseDart modifiers
	}
}
/** There is a prefered choice, but modifier can change the deal */
case class OnPressureDart(onPressureChoice: DartChoice, otherChoice: DartChoice) extends OnModifierDartsChoice(OnPressure, onPressureChoice, otherChoice)

/** There is a prefered choice, but modifier can change the deal */
case class NoPressureAtAllDart(noPressureChoice: DartChoice, otherChoice: DartChoice) extends OnModifierDartsChoice(NoPressureAtAll, noPressureChoice, otherChoice)

/** Maybe choose to break */
case class PlayBroken(breakChoice: DartChoice, otherChoice: DartChoice) extends OnModifierDartsChoice(GoodDouble, breakChoice, otherChoice)
