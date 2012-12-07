
import dart._
import dart.Dart._

object DartBoardWorkSheet {
	println("Welcome to the Scala worksheet") //> Welcome to the Scala worksheet
	T20                                       //> res0: dart.NormalDart = NormalDart(Sector(20),Triple)

	DartBoard.getDartPosition(D6)             //> res1: (Double, Double) = (169.0,0.0)
	DartBoard.getDartPosition(T10)            //> res2: (Double, Double) = (100.81199072728627,-32.75580140374445)

	val pos = (101.0, -3.0)                   //> pos  : (Double, Double) = (101.0,-3.0)

	DartBoard.getDart(pos)                    //> res3: dart.Dart = NormalDart(Sector(6),Triple)

	DartBoard.sectorAngleList                 //> res4: List[(dart.Sector, Int)] = List((Sector(6),0), (Sector(13),18), (Secto
                                                  //| r(4),36), (Sector(18),54), (Sector(1),72), (Sector(20),90), (Sector(5),108),
                                                  //|  (Sector(12),126), (Sector(9),144), (Sector(14),162), (Sector(11),180), (Sec
                                                  //| tor(8),198), (Sector(16),216), (Sector(7),234), (Sector(19),252), (Sector(3)
                                                  //| ,270), (Sector(17),288), (Sector(2),306), (Sector(15),324), (Sector(10),342)
                                                  //| )

	DartBoard.getSector(pos)                  //> res5: dart.Sector = Sector(6)

}