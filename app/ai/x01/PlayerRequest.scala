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

import scala.collection.immutable.Set
import play.api.libs.json._
import ai.Level
import dart.Dart

case class ComputerThrowRequest(comKey: Int, score: Int, level: Int, default: String, opponent: Double, decisive: Boolean)

object ComputerThrowRequestsFormat extends Format[ComputerThrowRequest] {
  def reads(json: JsValue): JsResult[ComputerThrowRequest] = JsSuccess(ComputerThrowRequest(
    (json \ "comKey").as[Int],
    (json \ "left").as[Int],
    (json \ "lvl").as[Int],
    (json \ "type").as[String],
    (json \ "opponent").as[Double],
    (json \ "decisive").as[Boolean]))


  def writes(request: ComputerThrowRequest) = JsObject(Seq(
    "comKey" -> JsNumber(request.comKey),
    "left" -> JsNumber(request.score),
    "lvl" -> JsNumber(request.level),
    "type" -> JsString(request.default),
    "opponent" -> JsNumber(request.opponent),
    "decisive" -> JsBoolean(request.decisive)))
}

case class PlayerRequest(level: Level, defaultDart: Dart, modifiers: Set[Modifier])
