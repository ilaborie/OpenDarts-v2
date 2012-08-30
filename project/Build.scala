import sbt._
import Keys._
import PlayProject._

object ApplicationBuild extends Build {

  val appName = "OpenDarts"
  val appVersion = "2.0-SNAPSHOT"

  val appDependencies = Seq( // Add your project dependencies here,
      "com.google.guava" % "guava" % "13.0.1"
  )

  val main = PlayProject(appName, appVersion, appDependencies, mainLang = JAVA).settings(
    lessEntryPoints <<= baseDirectory(customLessEntryPoints))

  // Only compile the bootstrap bootstrap.less file and any other *.less file in the stylesheets directory
  def customLessEntryPoints(base: File): PathFinder = (
    (base / "app" / "assets" / "stylesheets" / "bootstrap" / "bootstrap.less") +++
    (base / "app" / "assets" / "stylesheets" / "bootstrap" / "bootstrap-responsive.less") +++
    (base / "app" / "assets" / "stylesheets" * "*.less"))
}
