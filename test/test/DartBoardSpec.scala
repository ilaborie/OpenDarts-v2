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

class DartBoardSpec extends Specification {

	"The Triple 20" should {

		"Near (0,106)" in {
			val (x, y) = DartBoard.getDartPosition(T20)

			x must beCloseTo(0, 0.1)
			y must beCloseTo(106, 0.1)
		}

		"come with (0,106)" in {
			val dart = DartBoard.getDart(0, 106)
			dart === T20
		}
	}

	"The Double 6" should {

		"Near (169,0)" in {
			val (x, y) = DartBoard.getDartPosition(D6)

			x must beCloseTo(169, 0.1)
			y must beCloseTo(0, 0.1)
		}

		"come with (169,0)" in {
			val dart = DartBoard.getDart(169, 0)
			dart === D6
		}
	}

	"The Triple 10" should {

		"Near (101,-33)" in {
			val (x, y) = DartBoard.getDartPosition(T10)

			x must beCloseTo(101, 1.0)
			y must beCloseTo(-33, 1.0)
		}

		"come with (101,-33)" in {
			val dart = DartBoard.getDart(101, -33)
			dart === T10
		}
	}

	"The Triple 6" should {
		"come from (101.0, -3.0)" in {
			val dart = DartBoard.getDart(101, -3)
			dart === T6
		}
	}
}