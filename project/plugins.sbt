// Comment to get more information during initialization
logLevel := Level.Warn

// The Typesafe repository
resolvers += "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/"

// The Play2war repository
resolvers += "Play2war plugins release" at "http://repository-play-war.forge.cloudbees.com/release/"

// The Sonatype OSS repository
resolvers += "Sonatype OSS Snasphots" at "https://oss.sonatype.org/content/repositories/snapshots"

// Configuration
scalacOptions ++= Seq("-unchecked", "-deprecation")

// Use the Play sbt plugin for Play projects

// addSbtPlugin("play" % "sbt-plugin" % "2.0.4")
addSbtPlugin("play" % "sbt-plugin" % "2.1-RC2")

// Use the Cloudbees plugin
addSbtPlugin("com.cloudbees.deploy.play" % "sbt-cloudbees-play-plugin" % "0.5-SNAPSHOT")

// Use Play War Plugin for WAR building
// see https://github.com/dlecan/play2-war-plugin
addSbtPlugin("com.github.play2war" % "play2-war-plugin" % "0.9-RC2")
