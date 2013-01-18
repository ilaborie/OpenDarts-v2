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
import play.api.libs.json._
import scala.collection.immutable._

case class Finish(dart1: Dart, dart2: Option[Dart], dart3: Option[Dart], modifiers: Set[Modifier]) {
  override def toString: String = {
    if (label.isDefined) darts + " - " + label.get
    else darts
  }

  lazy val darts = {
    val darts = List(Some(dart1), dart2, dart3).filter(_.isDefined).map(_.get)
    darts.mkString(", ")
  }

  lazy val label: Option[String] = {
    val labels = modifiers.map(_.optionToString).filter(_.isDefined).map(_.get)

    if (labels.isEmpty) None
    else Some(labels.mkString(", "))
  }
}

object Finish {

  def apply(dart1: Dart, dart2: Dart, dart3: Dart, modifiers: Set[Modifier]): Finish = {
    val d2: Option[Dart] = if (NoDart != dart2) Some(dart2) else None
    val d3: Option[Dart] = if (NoDart != dart3) Some(dart3) else None
    Finish(dart1, d2, d3, modifiers)
  }


  implicit object FinishWrites extends Writes[Finish] {
    def writes(result: Finish) = JsObject(Seq(
      "dart1" -> JsString(result.dart1.toString),
      "dart2" -> Json.toJson(result.dart2.map(_.toString)),
      "dart3" -> Json.toJson(result.dart3.map(_.toString)),
      "modifiers" -> Json.toJson(result.modifiers)
    ))
  }

}


