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
import dart._
import dart.Dart._
import ai._
import ai.x01._
import test.x01._

object TestingAi {

	//val nbLegs = 100000
	val nbLegs = 100

	val stream = PlayX01.playScoreStream(T20, Level(6))
	val lst = stream take 10

	val map = for (lvl <- 0 to 15) yield (lvl, PlayX01.test501(nbLegs, Level(lvl)))

	print(map.mkString("===\n", "\n", "\n==="))
}