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

import org.specs2.mutable.Specification

import dart.Dart
import dart.Dart.D20
import dart.Dart.S20
import dart.Dart.T20
import dart.DoubleBull
import dart.SemiBull

class DartTest extends Specification {

  "The T20" should {

    "come with 'T20'" in {
      val dart = Dart("T20")
      dart === T20
    }
  }
  "The D20" should {

    "come with 'D20'" in {
      val dart = Dart("D20")
      dart === D20
    }
  }
  "The 20" should {

    "come with 'S20'" in {
      val dart = Dart("S20")
      dart === S20
    }
    "come with '20'" in {
      val dart = Dart("20")
      dart === S20
    }
  }
  "The DoubleBull" should {

    "come with 'DB'" in {
      val dart = Dart("DB")
      dart === DoubleBull
    }
    "come with '50'" in {
      val dart = Dart("50")
      dart === DoubleBull
    }
  }
  "The SemiBull" should {

    "come with 'SB'" in {
      val dart = Dart("SB")
      dart === SemiBull
    }
    "come with '25'" in {
      val dart = Dart("25")
      dart === DoubleBull
    }
  }

}