/*
 * Copyright (c) 2013 Igor Laborie
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package dart


/**
 * DartSector
 */
sealed abstract class DartSector {
  def value: Int
}

case object Unlucky extends DartSector {
  def value: Int = 0
}

case object OutOfBoard extends DartSector {
  def value: Int = 0
}

case object Bull extends DartSector {
  def value: Int = 25
}

case class Sector(value: Int) extends DartSector {
  require(value > 0)
  require(value < 21)
}