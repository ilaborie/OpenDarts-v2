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
import collection.SortedMap

object GameX01 extends Controller {

  def computerPlayerThrow = Action(parse.json) {
    request =>
      val requestJson: JsValue = request.body
      val computerRequest = Json.fromJson(requestJson)(ComputerThrowRequestsFormat)

      val computerResult = AiPlayerX01.processComputerRequest(computerRequest.get)
      Ok(Json.toJson(computerResult))
  }

  def finish(score: Int) = Action {
    request =>
      val finishs = AiPlayerX01.getFinish(score)
      Ok(Json.toJson(finishs))
  }

  def allFinish() = Action {
    request =>
      val finish = for {
        score <- 170 to 2 by -1
      } yield (score, AiPlayerX01.getFinish(score))

      val f: Map[Int, List[Finish]] = finish.toMap

      val sortedFinish = SortedMap[Int, List[Finish]]()(Ordering.Int.reverse) ++ f
      // (Ordering.Int.reverse)

      Ok(views.html.finish(sortedFinish))
  }
}