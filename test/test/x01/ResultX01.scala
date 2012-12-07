package test.x01

/**
 * The result of a leg played alone
 */
case class ResultX01(nbDart: Int, out: Int)

/**
 * The result of some legs played alone
 */
case class TestResultX01(min: Int, max: Int, avg: Double, bestOut: Int, nbLegs: Int) {
	override def toString: String = "avg: %.2f\tBestLeg: %s\tWorstLeg: %s\tBestOut: %s".format(avg, min, max, bestOut)
}

object TestResultX01 {
	/**
	 * Create from a sequence of result
	 * @param results sequence of result
	 * @return the result
	 */
	def apply(results: Seq[ResultX01]): TestResultX01 = {
		val size = results.size

		val nbDarts = results.map(_.nbDart)
		val avg = ((nbDarts.foldLeft(0)(_ + _)) toDouble) / size

		val outs = results.map(_.out)

		TestResultX01(nbDarts.min, nbDarts.max, avg, outs.max, size)
	}
}