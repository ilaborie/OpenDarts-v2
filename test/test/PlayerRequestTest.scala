package test

import org.specs2.mutable._
import play.api.test._
import play.api.test.Helpers._
import play.api.libs.json._
import dart._
import dart.Dart._
import ai.x01._
import ai.x01.ComputerThrowRequest._

class PlayerRequestTest extends Specification {

	"The request" should {

		"be write to JSON" in {
			val request = ComputerThrowRequest(3, 501, 6, "T20")
			val json: JsValue = Json.toJson(request)(ComputerThrowRequestsFormat)

			(json \ "comKey").as[Int] === 3
		}

		"be read from JsValue" in {
			val json: JsValue = JsObject(Seq(
				"comKey" -> JsNumber(3),
				"left" -> JsNumber(501),
				"lvl" -> JsNumber(6),
				"type" -> JsString("T20")))
			val request = Json.fromJson(json)(ComputerThrowRequestsFormat)

			request.comKey === 3
		}

		"be read from JSON" in {
			val json = """ {
					"comKey": 69,
					"left": 301,
					"lvl": 7,
					"type": "T20"
				} """
			val value = Json.parse(json)
			val request = Json.fromJson(value)(ComputerThrowRequestsFormat)
			request.comKey === 69
		}
	}

}