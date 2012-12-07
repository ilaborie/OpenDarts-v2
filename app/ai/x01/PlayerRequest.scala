package ai.x01

import dart.Level
import dart.Dart
import scala.collection.immutable.Set

case class PlayerRequest(level: Level, defaultDart: Dart, modifiers: Set[Modifier]) {

}