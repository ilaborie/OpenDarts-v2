// Comment to get more information during initialization
logLevel := Level.Warn

// The Typesafe repository
resolvers += "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/"

// The Sonatype OSS repository
resolvers += "Sonatype OSS Snasphots" at "https://oss.sonatype.org/content/repositories/snapshots"

// Use the Play sbt plugin for Play projects

// addSbtPlugin("play" % "sbt-plugin" % "2.0.3")
addSbtPlugin("play" % "sbt-plugin" % "2.0.4")

// Use the Cloudbees plugin
addSbtPlugin("com.cloudbees.deploy.play" % "sbt-cloudbees-play-plugin" % "0.3")