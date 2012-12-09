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
import dart._

/**
 * Dart Result
 */
case class DartResult(wished: String, done: String, color: String)
object DartResult {
	def apply(wished: Dart, done: Dart): DartResult = {
			val color = done.color match {
			case Red => "red"
			case Green => "green"
			case Black => "black"
			case _ => "white"
			}
			DartResult(wished.toString, done.toString, color)
	}
}
object DartResultWrites extends Writes[DartResult] {
	def writes(result: DartResult) = JsObject(Seq(
			"wished" -> JsString(result.wished),
			"done" -> JsString(result.done),
			"color" -> JsString(result.color)))
}

/**
 * Computer Throw Result
 */
case class ComputerThrowResult(comKey: Int, darts: List[(Dart, Dart)], status: Status, score: Int)

object ComputerThrowResultWrites extends Writes[ComputerThrowResult] {

	def writes(result: ComputerThrowResult) = {
		val status = result.status match {
			case Win => "win"
			case Broken => "broken"
			case Normal => "normal"
		}

		val darts: List[JsValue] = result.darts.map((x: (Dart, Dart)) => DartResultWrites.writes(DartResult(x._1, x._2)))

		JsObject(Seq(
			"comKey" -> JsNumber(result.comKey),
			"score" -> JsNumber(result.score),
			"status" -> JsString(status),
			"darts" -> JsArray(darts)))
	}
}