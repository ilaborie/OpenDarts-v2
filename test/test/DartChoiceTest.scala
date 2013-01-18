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
package test

import scala.math._
import org.specs2.mutable._
import dart._
import dart.Dart._
import ai.x01._
import test.x01._
import ai.x01.Modifier

class DartChoiceTest extends Specification {
	/**
	 * AlwaysDart
	 */
	"AlwaysDart" should {
		"always have the same result" in {
			val dart: Dart = T20
			val choice = AlwaysDart(dart)
			val modifiers: Set[Modifier] = Set()

			val size = 100
			// Make choices
			val darts = PlayX01.playChoiceStream(choice, modifiers) take size

			val nbDart = darts.count(_ == dart)

			// Test
			nbDart === size
		}
	}
	/**
	 * OrDart
	 */
	"OrDart" should {
		"comport like AlwaysDart with One element" in {
			val dart: Dart = T20
			val choice = OrDart(dart,dart)
			val modifiers: Set[Modifier] = Set()

			val size = 100
			// Make choices
			val darts = PlayX01.playChoiceStream(choice, modifiers) take size

			val nbDart = darts.count(_ == dart)

			// Test
			nbDart === size
		}
		"have a good repartition with Two elements" in {
			val dart1: Dart = T20
			val dart2: Dart = T19
			val choice = (dart1 or dart2)
			val modifiers: Set[Modifier] = Set()

			val size = 10000
			// Make choices
			val darts = PlayX01.playChoiceStream(choice, modifiers) take size

			val nbDart1 = darts.count(_ == dart1)
			val nbDart2 = darts.count(_ == dart2)

			val ratio = abs((nbDart1 - nbDart2).toDouble * 100 / size)

			// Test ≤ 5%
			ratio must be_<=(5.0)
		}
		"have a good repartition with Three elements" in {
			val dart1: Dart = T20
			val dart2: Dart = T19
			val dart3: Dart = T18
			val choice = (dart1 or dart2 or dart3)
			val modifiers: Set[Modifier] = Set()

			val size = 10000
			// Make choices
			val darts = PlayX01.playChoiceStream(choice, modifiers) take size

			val nbDart1 = darts.count(_ == dart1)
			val nbDart2 = darts.count(_ == dart2)
			val nbDart3 = darts.count(_ == dart3)

			val ratio12 = abs((nbDart1 - nbDart2).toDouble * 100 / size)
			val ratio13 = abs((nbDart1 - nbDart3).toDouble * 100 / size)
			val ratio23 = abs((nbDart2 - nbDart3).toDouble * 100 / size)

			// Test ≤ 5%
			max(ratio12, max(ratio13, ratio23)) must be_<=(5.0)
		}

		"Can apply LikeDart modifier" in {
			val dart1: Dart = T20
			val dart2: Dart = T19
			val choice = OrDart(dart1, dart2)
			val modifiers: Set[Modifier] = Set(LikeDart(T20))

			val dartWeight = choice.getDartWeight(T20, modifiers)
			// Test 
			dartWeight._2 === 2
		}

		"Take care of LikeDart modifier" in {
			val dart1: Dart = T20
			val dart2: Dart = T19
			val choice = (dart1 or dart2)
			val modifiers: Set[Modifier] = Set(LikeDart(T20))

			val size = 10000
			// Make choices
			val darts = PlayX01.playChoiceStream(choice, modifiers) take size

			val nbDart1 = darts.count(_ == dart1)
			val nbDart2 = darts.count(_ == dart2)

			val ratio = (nbDart1 - nbDart2).toDouble * 100 / size

			// Test ≥ 15%
			ratio must be_>=(15.0)
		}

		"Take care of Aggressif modifier" in {
			val dart1: Dart = D20
			val dart2: Dart = T19
			val choice = (dart1 or dart2)
			val modifiers: Set[Modifier] = Set(Aggressive)

			val size = 10000
			// Make choices
			val darts = PlayX01.playChoiceStream(choice, modifiers) take size

			val nbDart1 = darts.count(_ == dart1)
			val nbDart2 = darts.count(_ == dart2)

			val ratio = (nbDart1 - nbDart2).toDouble * 100 / size

			// Test ≥ 20%
			ratio must be_>=(20.0)
		}
	}

	/**
	 * PreferedDartBut
	 */
	"PreferedDartBut" should {

		"can be groovy with Two element" in {
			val dart1: Dart = T20
			val dart2: Dart = T19
			val choice = dart1 butSometime dart2
			val modifiers: Set[Modifier] = Set()

			val size = 1000
			// Make choices
			val darts = PlayX01.playChoiceStream(choice, modifiers) take size

			val nbDart1 = darts.count(_ == dart1)
			val nbDart2 = darts.count(_ == dart2)

			val ratio = (nbDart1 - nbDart2).toDouble * 100 / size

			// Test
			ratio must be_<=(90.0)
		}

		"prefer the dart with Two element" in {
			val dart1: Dart = T20
			val dart2: Dart = T19
			val choice = dart1 butSometime dart2
			val modifiers: Set[Modifier] = Set()

			val size = 1000
			// Make choices
			val darts = PlayX01.playChoiceStream(choice, modifiers) take size

			val nbDart1 = darts.count(_ == dart1)
			val nbDart2 = darts.count(_ == dart2)

			val ratio = (nbDart1 - nbDart2).toDouble * 100 / size

			// Test
			ratio must be_>=(75.0)
		}

		"can be groovy with Three element" in {
			val dart1: Dart = T20
			val dart2: Dart = T19
			val dart3: Dart = T18
			val choice = dart1 butSometime (dart2 or dart3)
			val modifiers: Set[Modifier] = Set()

			val size = 1000
			// Make choices
			val darts = PlayX01.playChoiceStream(choice, modifiers) take size

			val nbDart2 = darts.count(_ == dart2)
			val nbDart3 = darts.count(_ == dart3)

      val ratio23 = (nbDart2 - nbDart3).toDouble * 100 / size

			// Test
			ratio23 must be_<=(5.0)
		}
		"prefer the dart with Three element" in {
			val dart1: Dart = T20
			val dart2: Dart = T19
			val dart3: Dart = T18
			val choice = dart1 butSometime (dart2 or dart3)
			val modifiers: Set[Modifier] = Set()

			val size = 1000
			// Make choices
			val darts = PlayX01.playChoiceStream(choice, modifiers) take size

			val nbDart1 = darts.count(_ == dart1)
			val nbDart2 = darts.count(_ == dart2)
			val nbDart3 = darts.count(_ == dart3)

			val ratio = (nbDart1 - (nbDart2 + nbDart3)).toDouble * 100 / size

			// Test
			ratio must be_>=(70.0)
		}
	}
	/**
	 * OnPressureDart
	 */
	"OnPressureDart" should {
		"Act normaly without pressure" in {
			val dart1: Dart = T20
			val choice = OnPressureDart(T20, AlwaysDart(T19))
			val modifiers: Set[Modifier] = Set()

			val size = 100
			// Make choices
			val darts = PlayX01.playChoiceStream(choice, modifiers) take size

			val nbDart1 = darts.count(_ == dart1)

			// test
			nbDart1 === 0
		}
		"Use special dart with pressure" in {
			val dart1: Dart = T20
      val choice = OnPressureDart(T20, AlwaysDart(T19))
			val modifiers: Set[Modifier] = Set(OnPressure)

			val size = 100
			// Make choices
			val darts = PlayX01.playChoiceStream(choice, modifiers) take size

			val nbDart1 = darts.count(_ == dart1)

			// test
			nbDart1 === size
		}
	}
	/**
	 * NoPressureAtAllDart
	 */
	"NoPressureAtAllDart" should {
		"Act normaly" in {
			val dart1: Dart = T20
      val choice = NoPressureAtAllDart(AlwaysDart(T20), AlwaysDart(T19))
			val modifiers: Set[Modifier] = Set()

			val size = 100
			// Make choices
			val darts = PlayX01.playChoiceStream(choice, modifiers) take size

			val nbDart1 = darts.count(_ == dart1)

			// test
			nbDart1 === 0
		}
		"Use special choice without no pressure" in {
			val dart1: Dart = T20
      val choice = NoPressureAtAllDart(AlwaysDart(T20), AlwaysDart(T19))
			val modifiers: Set[Modifier] = Set(NoPressureAtAll)

			val size = 100
			// Make choices
			val darts = PlayX01.playChoiceStream(choice, modifiers) take size

			val nbDart1 = darts.count(_ == dart1)

			// test
			nbDart1 === size
		}
	}
	/**
	 * Play Broken
	 */
	"PlayBroken" should {
		"Act normaly" in {
			val dart1: Dart = T20
      val choice = PlayBroken(AlwaysDart(T20), AlwaysDart(T19))
			val modifiers: Set[Modifier] = Set()

			val size = 100
			// Make choices
			val darts = PlayX01.playChoiceStream(choice, modifiers) take size

			val nbDart1 = darts.count(_ == dart1)

			// test
			nbDart1 === 0
		}
		"Use special choice without no pressure" in {
			val dart1: Dart = T20
      val choice = PlayBroken(AlwaysDart(T20), AlwaysDart(T19))
			val modifiers: Set[Modifier] = Set(GoodDouble)

			val size = 100
			// Make choices
			val darts = PlayX01.playChoiceStream(choice, modifiers) take size

			val nbDart1 = darts.count(_ == dart1)

			// test
			nbDart1 === size
		}
	}
}