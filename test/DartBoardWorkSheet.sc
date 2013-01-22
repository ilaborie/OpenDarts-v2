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

object DartBoardWorkSheet {
  println("Welcome to the Scala worksheet")
  T20

  DartBoard.getDartPosition(D6)
  DartBoard.getDartPosition(T10)

  val pos = (101.0, -3.0)

  DartBoard.getDart(pos)

  DartBoard.sectorAngleList

  DartBoard.getSector(pos)

}