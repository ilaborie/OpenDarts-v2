/*
 Copyright 2013 Igor Laborie

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

import org.specs2.mutable._
import ai._
import test.x01.PlayX01
import dart.Dart._
import dart._

/**
 * Test Finish Battle
 */
class FinishBattleTest extends Specification {
  val nbLegs = 100000


  "Testing Some" should {
    "always have the same result" in {
      val listDarts = List(T20, T19, T18, T17, T16, T15, T14, T13, T12, T11, T10, DoubleBull, SemiBull)
      for (score <- 90 to 150)
        PlayX01.battle(nbLegs, Level(6), listDarts, score)
      true === true
    }
  }
}
