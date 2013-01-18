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

import dart.Dart
import dart.Dart._
import dart.DoubleBull
import dart.SemiBull
import scala.collection.immutable._

object BestDartOneLeft extends BestDart {

  val bestDarts1: Map[Int, DartChoice] = Map(

    // 12x
    125 -> (DoubleBull butSometime T18),
    122 -> (T20 butSometime (T14 or T18)),
    121 -> (T20 butSometime (DoubleBull or T17)),

    // 11x
    116 -> (T20 butSometime T19),
    115 -> T20,
    114 -> T20,
    110 -> (T20 or T19),

    // 10x
    108 -> (T19 or T16),
    104 -> (T18 butSometime (T16 or T20)),
    101 -> (T20 butSometime T17),

    // 9x
    95 -> (DoubleBull or T19),
    94 -> T18,
    93 -> T19,
    92 -> T20,
    91 -> T17,
    90 -> (DoubleBull or T20 or T18),

    // 8x
    81 -> T19,
    80 -> (T20 butSometime T16),

    // 7x
    72 -> (T16 butSometime T12),
    70 -> (T10 butSometime (T18 or T20)),

    // 6x
    69 -> (T19 or T11),
    68 -> (T20 butSometime (T16 or T18)),
    67 -> (T17 butSometime T9),
    64 -> T16,
    62 -> (T10 butSometime T12),
    61 -> (SemiBull butSometime T7),

    // 5x
    53 -> (S13 butSometime S17),
    52 -> (S12 butSometime (T16 or T20)),
    51 -> (S19 or S11),
    50 -> ((S10 or S18) withoutPressureOtherwise DoubleBull),

    // 4x

    // 3x

    // 2x

    // 1x
    11 -> (S14 toBreakOtherwise S3),

    // 0x
    9 -> (S14 toBreakOtherwise S1),
    7 -> (S7 toBreakOtherwise S3),
    6 -> ((S14 toBreakOtherwise S2) withoutPressureOtherwise D3),
    5 -> (S14 toBreakOtherwise S1),
    3 -> (S14 toBreakOtherwise S1)
  )

  override def getBestDart(score: Int, defaultDart: Dart): DartChoice = bestDarts1.getOrElse(score, BestDartThreeLeft.getBestDart(score, defaultDart))

}