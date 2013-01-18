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
import play.api.libs.json._
import scala.Some
import scala.collection.immutable._

/**
 * Modifier
 */
sealed abstract class Modifier {
  def shouldApply(request: ComputerThrowRequest): Boolean

  def optionToString: Option[String] = None

  override def toString: String = if (optionToString.isDefined) optionToString.get else super.toString
}

object Modifier {
  def fromRequest(request: ComputerThrowRequest): List[Modifier] = {
    val base: List[Modifier] = List(OnPressure, NoPressureAtAll, GoodDouble, Aggressive)
    LikeDart(Dart(request.default)) :: (base filter (_.shouldApply(request)))
  }

  implicit object ModifierWrites extends Writes[Modifier] {
    def writes(result: Modifier) = result match {
      case Optional => JsString("avoid")
      case OnPressure => JsString("pressure")
      case NoPressureAtAll => JsString("noPressure")
      case Aggressive => JsString("aggressive")
      case _ => JsNull
    }
  }

}

/** Standard Modifier */
case object DefaultCase extends Modifier {
  def shouldApply(request: ComputerThrowRequest): Boolean = true

  override lazy val toString = "DefaultCase"
}

/** Optional Modifier */
case object Optional extends Modifier {
  def shouldApply(request: ComputerThrowRequest): Boolean = true

  override val optionToString = Some("Avoid")
}

/** Opponent might finish */
case object OnPressure extends Modifier {
  def shouldApply(request: ComputerThrowRequest): Boolean = request.opponent <= 1.5

  override val optionToString = Some("PRESSURE")
}

/** Have time to better placement */
case object NoPressureAtAll extends Modifier {
  def shouldApply(request: ComputerThrowRequest): Boolean = request.opponent > 4

  override val optionToString = Some("No pression")
}

/** Start with a good Double */
case object GoodDouble extends Modifier {
  val goodDouble = List(32, 40, 16, 24, 36, 20, 8)

  def shouldApply(request: ComputerThrowRequest): Boolean = goodDouble contains request.score

  override lazy val toString = "GoodDouble"
}

/** Play all doubles */
case object Aggressive extends Modifier {
  def shouldApply(request: ComputerThrowRequest): Boolean = request.decisive

  override val optionToString = Some("Aggressive")
}

/** Choose prefered dart */
case class LikeDart(dart: Dart) extends Modifier {
  def shouldApply(request: ComputerThrowRequest): Boolean = (dart == Dart(request.default))

  override lazy val toString = "Like " + dart
}