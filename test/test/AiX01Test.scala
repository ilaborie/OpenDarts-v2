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

import org.specs2.mutable._
import dart._
import dart.Dart._
import ai._
import ai.x01.AiPlayerX01._
import test.x01._

class AiX01Test extends Specification {

  "Level 10" should {
    "hit 80% in T20" in {
      val level = Level(10)
      // Play darts
      val stream = PlayX01.playScoreStream(T20, level)
      val darts = stream take 100

      // Take 20s
      val nb20 = darts.count((wd: WishedDone) => (wd._2.sector.value == 20))

      // Test
      nb20 must be_>=(80)
    }
    "hit 60% in Bull" in {
      val level = Level(10)
      // Play darts
      val stream = PlayX01.playScoreStream(DoubleBull, level)
      val darts = stream take 100

      // Take 20s
      val nbBull = darts.count((wd: WishedDone) => (wd._2.sector == Bull))

      // Test
      nbBull must be_>=(60)
    }
  }
}