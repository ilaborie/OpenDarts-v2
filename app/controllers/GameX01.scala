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
package controllers

import play.api.mvc._
import play.api.libs.json._
import ai.x01._
import ai.x01.ComputerThrowRequest._

object GameX01 extends Controller {

	def computerPlayerThrow = Action(parse.json) { request =>
		val requestJson: JsValue = request.body
		val computerRequest = Json.fromJson(requestJson)(ComputerThrowRequestsFormat)

		val computerResult = AiPlayerX01.processComputerRequest(computerRequest)

		Ok(Json.toJson(computerResult)(ComputerThrowResultWrites))
	}
}