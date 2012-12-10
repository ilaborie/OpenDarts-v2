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
import play.api.test._
import play.api.test.Helpers._
import play.api.libs.json._
import dart._
import dart.Dart._
import ai.x01._
import ai.x01.ComputerThrowRequest._
import scala.math

class PlayerRequestTest extends Specification {

	"The request" should {

		"be write to JSON" in {
			val request = ComputerThrowRequest(3, 501, 6, "T20", 65.42d, false)
			val json: JsValue = Json.toJson(request)(ComputerThrowRequestsFormat)

			(json \ "comKey").as[Int] === 3
		}

		"be read from JsValue" in {
			val json: JsValue = JsObject(Seq(
				"comKey" -> JsNumber(3),
				"left" -> JsNumber(501),
				"lvl" -> JsNumber(6),
				"type" -> JsString("T20"),
				"opponent" -> JsNumber(35.45),
				"decisive" -> JsBoolean(false)
				))
			val request = Json.fromJson(json)(ComputerThrowRequestsFormat)

			request.comKey === 3
		}

		"be read from JSON" in {
			val json = """ {
				"comKey": 19,
				"left": 501,
				"lvl": 6, 
				"type": "T19",
				"opponent": 7.35,
				"decisive": false
			} """
			val value = Json.parse(json)
			val request = Json.fromJson(value)(ComputerThrowRequestsFormat)
			request.comKey === 19
		}
	}

}