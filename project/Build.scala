import sbt._
import Keys._
import play.Project._
import cloudbees.Plugin._
import com.github.play2war.plugin._

object ApplicationBuild extends Build {

  val appName = "OpenDarts"
  val appVersion = "2.0-SNAPSHOT"

  val appDependencies = Seq( // Add your project dependencies here,
      // "postgresql"    %   "postgresql"        % "9.1-901.jdbc4"
      // Not yet compatible: "com.google.guava" % "guava" % "13.0.1"
  )

  val main = play.Project(appName, appVersion, appDependencies)
    .settings(lessEntryPoints <<= baseDirectory(customLessEntryPoints))
    .settings(cloudBeesSettings :_*)
    .settings(CloudBees.applicationId := Some("ilaborie/opendarts2-2"))
    .settings(Play2WarKeys.servletVersion := "3.0")
    .settings(Play2WarPlugin.play2WarSettings: _*)

  // Only compile the bootstrap bootstrap.less file and any other *.less file in the stylesheets directory
  def customLessEntryPoints(base: File): PathFinder = (
    (base / "app" / "assets" / "stylesheets" / "bootstrap" / "bootstrap.less") +++
    (base / "app" / "assets" / "stylesheets" / "bootstrap" / "bootstrap-responsive.less") +++
    (base / "app" / "assets" / "stylesheets" * "*.less"))

}
