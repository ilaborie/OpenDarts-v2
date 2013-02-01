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
import scala.collection.immutable._

object BestDartThreeLeft extends BestDart {

  private val bestDarts3: Map[Int, DartChoice] = Map(

    // 21x
    217 -> T18,
    214 -> T18,

    // 19x
    195 -> T19,

    // 18x
    189 -> T19,
    188 -> T18,
    186 -> T19,
    185 -> DoubleBull,
    183 -> T19,
    182 -> T18,

    // 17x
    170 -> T20,

    // 16x
    169 -> (T20 or T19),
    168 -> (T16 butSometime (T20 or T19)),
    167 -> (T20 or T19),
    165 -> ((T20 or T19) butSometime DoubleBull),
    164 -> ((T20 or T19) butSometime DoubleBull),
    163 -> (T20 or T19),
    162 -> (T20 or T19),
    161 -> ((T20 or T19) butSometime DoubleBull),
    160 -> T20,

    // 15x
    159 -> (T20 butSometime T19),
    158 -> (T20 butSometime T19),
    157 -> (T20 or T19),
    156 -> (T20 butSometime T19),
    155 -> (T20 or T19),
    154 -> (T20 or T19),
    153 -> (T20 or T19),
    152 -> (T20 or T19),
    151 -> ((T20 or T19) butSometime (T18 or T17)),
    150 -> (T20 or T19),

    // 14x
    149 -> (T20 or T19),
    148 -> ((T20 or T19) butSometime (T18 or T16)),
    147 -> (T20 or T19),
    146 -> (T20 or T19),
    145 -> ((T20 or T19) butSometime (T18 or DoubleBull)),
    144 -> ((T20 or T19) butSometime (T18 or DoubleBull)),
    143 -> ((T20 or T19) butSometime T18),
    142 -> ((T20 or T19) butSometime (T18 or DoubleBull)),
    141 -> ((T20 or T19) butSometime (T18 or DoubleBull)),
    140 -> (T20 butSometime T18),

    // 13x
    139 -> (T20 or T19),
    138 -> ((T20 or T19) butSometime T18),
    137 -> ((T20 or T19) butSometime T18),
    136 -> T20,
    135 -> (DoubleBull butSometime (T20 or T19)),
    134 -> (T20 butSometime T19),
    133 -> (T20 or T19),
    132 -> (DoubleBull butSometime (T20 or T19)),
    131 -> (T19 butSometime T20),
    130 -> (T20 butSometime T19),

    // 12x
    129 -> (T19 butSometime (DoubleBull or T20)),
    128 -> (T18 butSometime T20),
    127 -> (T20 butSometime T19),
    126 -> T19,
    125 -> (DoubleBull butSometime T18),
    124 -> T20,
    123 -> (T19 butSometime DoubleBull),
    122 -> (T18 butSometime (T14 or T20)),
    121 -> (T20 butSometime (DoubleBull or T17 or T19)),
    120 -> T20,

    // 11x
    119 -> T19,
    118 -> (T20 butSometime T18),
    117 -> (T19 butSometime T20),
    116 -> (T19 butSometime T20),
    115 -> (T20 butSometime (DoubleBull or T19)),
    114 -> (T19 butSometime T18),
    113 -> (T19 butSometime T20),
    112 -> T20,
    111 -> (T20 butSometime T19),
    110 -> (T20 or T19),

    // 10x
    109 -> (T20 butSometime T19),
    108 -> (T19 or T16),
    107 -> T19,
    106 -> T20,
    105 -> (T20 or T19),
    104 -> (T20 butSometime (T16 or T18)),
    103 -> (T19 butSometime T17),
    102 -> T20,
    101 -> (T20 or T17 or T19),
    100 -> T20,

    // 9x
    99 -> (T19 butSometime T20),
    98 -> T20,
    97 -> T19,
    96 -> T20,
    95 -> (DoubleBull withPressureOtherwise T19),
    94 -> (DoubleBull withPressureOtherwise T18),
    93 -> (DoubleBull withPressureOtherwise T19),
    92 -> (DoubleBull withPressureOtherwise T20),
    91 -> (DoubleBull withPressureOtherwise T17),
    90 -> (DoubleBull withPressureOtherwise (DoubleBull or T20 or T18)),

    // 8x
    89 -> T19,
    88 -> (T20 or T16),
    87 -> (T17 or T15),
    86 -> (T18 butSometime T12),
    85 -> (T15 or DoubleBull),
    84 -> (T20 butSometime DoubleBull),
    83 -> (T17 butSometime DoubleBull),
    82 -> ((T14 or DoubleBull) butSometime T11),
    81 -> ((T19 or DoubleBull) butSometime T15),
    80 -> (T20 or T16),

    // 7x
    79 -> (T19 or T13),
    78 -> (T18 or T14),
    77 -> (T19 butSometime T15),
    76 -> (T20 or T16),
    75 -> (T17 butSometime SemiBull),
    74 -> (T14 butSometime T18),
    73 -> (T19 butSometime T11),
    72 -> (T16 butSometime T12),
    71 -> (T13 butSometime T19),
    70 -> (T20 or T18 or T10),

    // 6x
    69 -> ((T19 or T11) butSometime T15),
    68 -> ((T18 or T16 or T20) butSometime T12),
    67 -> (T9 butSometime T17),
    66 -> (T10 butSometime (T16 or DoubleBull)),
    65 -> (SemiBull butSometime (T15 or T19)),
    64 -> (T16 butSometime T14),
    63 -> T13,
    62 -> (T10 butSometime (T12 or T14)),
    61 -> (SemiBull butSometime (SemiBull or T11)),
    60 -> S20,

    // 5x
    59 -> S19,
    58 -> S18,
    57 -> S17,
    56 -> S16,
    55 -> S15,
    54 -> S14,
    53 -> (S13 butSometime S17),
    52 -> (S12 butSometime T16),
    51 -> (S19 or S11),
    50 -> (S10 butSometime (DoubleBull or S18)),

    // 4x
    49 -> (S17 butSometime S9),
    48 -> (S16 butSometime S8),
    47 -> (S15 butSometime S7),
    46 -> (S6 butSometime (S14 or S10)),
    45 -> (S5 butSometime (S13 or S19)),
    44 -> ((S4 or S12) butSometime (S8 or S16 or S18)),
    43 -> (S3 butSometime S11),
    42 -> (S10 butSometime S6),
    41 -> (S1 butSometime (S9 or S17)),
    40 -> D20,

    // 3x
    39 -> (S7 butSometime S19),
    38 -> (S6 withoutPressureOtherwise D19),
    37 -> (S5 butSometime S17),
    36 -> D18,
    35 -> (S3 butSometime S19),
    34 -> (S2 withoutPressureOtherwise D17),
    33 -> (S17 butSometime S1),
    32 -> D16,
    31 -> (S15 butSometime S7),
    30 -> ((S6 or S10) withoutPressureOtherwise D15),

    // 2x
    29 -> (S5 butSometime S13),
    28 -> D14,
    27 -> (S11 or S19 or S3),
    26 -> (S10 withoutPressureOtherwise D13),
    25 -> (S17 butSometime S9),
    24 -> D12,
    23 -> (S7 butSometime S3),
    22 -> (S6 withoutPressureOtherwise D11),
    21 -> (S5 butSometime S17),
    20 -> D10,

    // 1x
    19 -> (S3 butSometime S17),
    18 -> D9,
    17 -> (S1 butSometime S13),
    16 -> D8,
    15 -> (S7 butSometime (S11 or S13)),
    14 -> (S6 withoutPressureOtherwise D7),
    13 -> (S5 butSometime S11),
    12 -> D6,
    11 -> S3,
    10 -> (S2 withoutPressureOtherwise D5),

    // 0x
    9 -> S1,
    8 -> D4,
    7 -> S3,
    6 -> (S2 withoutPressureOtherwise (D3)),
    5 -> S1,
    4 -> D2,
    3 -> S1,
    2 -> D1,

    0 -> NoDart)

  def getBestDart(score: Int, defaultDart: Dart): DartChoice = bestDarts3.getOrElse(score, defaultDart)

}