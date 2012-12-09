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
import dart.Level
import dart.Dart

case class ComputerThrowRequest(comKey: Int, score: Int, level: Int, default: String) {

}
object ComputerThrowRequestsFormat extends Format[ComputerThrowRequest] {
	def reads(json: JsValue): ComputerThrowRequest = ComputerThrowRequest(
		(json \ "comKey").as[Int],
		(json \ "left").as[Int],
		(json \ "lvl").as[Int],
		(json \ "type").as[String])
		
	def writes(request: ComputerThrowRequest) = JsObject(Seq(
		"comKey" -> JsNumber(request.comKey),
		"left" -> JsNumber(request.score),
		"lvl" -> JsNumber(request.level),
		"type" -> JsString(request.default)))
}

case class PlayerRequest(level: Level, defaultDart: Dart, modifiers: Set[Modifier])
object PlayerRequest {
	def apply(request: ComputerThrowRequest): PlayerRequest = {
		val level = Level(request.level)
		val defaultDart: Dart = Dart(request.default)
		val modifiers: Set[Modifier] = Set();
		// FIXME build modifiers

		PlayerRequest(level, defaultDart, modifiers)
	}
}