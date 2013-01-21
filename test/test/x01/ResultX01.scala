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
package test.x01

/**
 * The result of a leg played alone
 */
case class ResultX01(nbDart: Int, out: Int)

/**
 * The result of some legs played alone
 */
case class TestResultX01(min: Int, max: Int, avg: Double, bestOut: Int, nbLegs: Int) {
  override def toString: String = f"avg: $avg%.2f\tBestLeg: $min\tWorstLeg: $max\tBestOut: $bestOut"
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