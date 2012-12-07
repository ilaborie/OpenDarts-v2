
import dart._
import dart.Dart._
import ai._
import ai.x01._
import test.x01._

object TestingAi {

	//val nbLegs = 100000
	val nbLegs = 1000                         //> nbLegs  : Int = 1000

	val map = for (lvl <- 0 to 15) yield (lvl, PlayX01.test501(nbLegs, Level(lvl)))
                                                  //> map  : scala.collection.immutable.IndexedSeq[(Int, test.x01.TestResultX01)] 
                                                  //| = Vector((0,avg: 68,36	BestLeg: 27	WorstLeg: 265	BestOut: 117), (
                                                  //| 1,avg: 54,31	BestLeg: 23	WorstLeg: 253	BestOut: 113), (2,avg: 4
                                                  //| 7,30	BestLeg: 17	WorstLeg: 214	BestOut: 120), (3,avg: 34,00	
                                                  //| BestLeg: 16	WorstLeg: 98	BestOut: 154), (4,avg: 30,78	BestLeg: 16	
                                                  //| WorstLeg: 74	BestOut: 125), (5,avg: 28,34	BestLeg: 16	WorstLeg
                                                  //| : 74	BestOut: 149), (6,avg: 27,07	BestLeg: 14	WorstLeg: 84	
                                                  //| BestOut: 136), (7,avg: 25,19	BestLeg: 13	WorstLeg: 74	BestOut:
                                                  //|  131), (8,avg: 23,29	BestLeg: 12	WorstLeg: 59	BestOut: 157), (
                                                  //| 9,avg: 21,65	BestLeg: 12	WorstLeg: 47	BestOut: 141), (10,avg: 
                                                  //| 20,55	BestLeg: 12	WorstLeg: 57	BestOut: 161), (11,avg: 19,40	
                                                  //| BestLeg: 11	WorstLeg: 41	BestOut: 141), (12,avg: 18,15	BestLeg: 11	
                                                  //| WorstLeg: 40	BestOut: 160), (13,avg: 16,79	BestLeg: 10	WorstLeg
                                                  //| : 30	BestOut: 160), (14,avg: 15,43	BestLeg: 9	WorstLeg: 34	
                                                  //| BestOut: 161), (15,avg: 14,01	BestLeg: 
                                                  //| Output exceeds cutoff limit.

	print(map.mkString("===\n", "\n", "\n==="))
                                                  //> ===
                                                  //| (0,avg: 68,36	BestLeg: 27	WorstLeg: 265	BestOut: 117)
                                                  //| (1,avg: 54,31	BestLeg: 23	WorstLeg: 253	BestOut: 113)
                                                  //| (2,avg: 47,30	BestLeg: 17	WorstLeg: 214	BestOut: 120)
                                                  //| (3,avg: 34,00	BestLeg: 16	WorstLeg: 98	BestOut: 154)
                                                  //| (4,avg: 30,78	BestLeg: 16	WorstLeg: 74	BestOut: 125)
                                                  //| (5,avg: 28,34	BestLeg: 16	WorstLeg: 74	BestOut: 149)
                                                  //| (6,avg: 27,07	BestLeg: 14	WorstLeg: 84	BestOut: 136)
                                                  //| (7,avg: 25,19	BestLeg: 13	WorstLeg: 74	BestOut: 131)
                                                  //| (8,avg: 23,29	BestLeg: 12	WorstLeg: 59	BestOut: 157)
                                                  //| (9,avg: 21,65	BestLeg: 12	WorstLeg: 47	BestOut: 141)
                                                  //| (10,avg: 20,55	BestLeg: 12	WorstLeg: 57	BestOut: 161)
                                                  //| (11,avg: 19,40	BestLeg: 11	WorstLeg: 41	BestOut: 141)
                                                  //| (12,avg: 18,15	BestLeg: 11	WorstLeg: 40	BestOut: 160)
                                                  //| (13,avg: 16,79	BestLeg: 10	WorstLeg: 30	BestOut: 160)
                                                  //| (14,avg: 15,43	BestLeg: 9	WorstLeg: 34	BestOut: 161)
                                                  //| (15,avg: 14,01	BestLeg: 9	WorstLeg: 23	BestOut: 161)
}