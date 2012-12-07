package test


import org.specs2.mutable._
import play.api.test._
import play.api.test.Helpers._
import dart._
import dart.Dart._


class DartTest extends Specification {

	"The T20" should {

		"come with 'T20'" in {
			val dart = Dart("T20")
			dart === T20
		}
	}
	"The D20" should {

		"come with 'D20'" in {
			val dart = Dart("D20")
			dart === D20
		}
	}
	"The 20" should {

		"come with 'S20'" in {
			val dart = Dart("S20")
			dart === S20
		}
		"come with '20'" in {
			val dart = Dart("20")
			dart === S20
		}
	}
	"The DoubleBull" should {

		"come with 'DB'" in {
			val dart = Dart("DB")
			dart === DoubleBull
		}
		"come with '50'" in {
			val dart = Dart("50")
			dart === DoubleBull
		}
	}
	"The SemiBull" should {

		"come with 'SB'" in {
			val dart = Dart("SB")
			dart === SemiBull
		}
		"come with '25'" in {
			val dart = Dart("25")
			dart === DoubleBull
		}
	}

}