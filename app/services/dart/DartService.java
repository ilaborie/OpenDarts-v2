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
package services.dart;

import models.dart.Dart;
import models.dart.DartSector;
import models.dart.DartZone;
import models.dart.IDart;
import play.Logger;

/** The Class DartService. */
public class DartService {

	/** Instantiates a new dart service. */
	public DartService() {
		super();
	}

	/**
	 * Creates the dart.
	 *
	 * @param sector the sector
	 * @param zone the zone
	 * @return the i dart
	 */
	public IDart createDart(DartSector sector, DartZone zone) {
		return new Dart(sector, zone);
	}

	/**
	 * Gets the dart.
	 *
	 * @param sDart the s dart
	 * @return the dart
	 */
	public IDart getDart(String sDart) {
		DartSector sector = null;
		DartZone zone = null;

		if (sDart != null) {
			String dart = sDart.trim().toUpperCase();

			if ("25".equals(dart)) {
				sector = DartSector.BULL;
				zone = DartZone.SINGLE;
			} else if ("50".equals(dart)) {
				sector = DartSector.BULL;
				zone = DartZone.DOUBLE;
			} else if (dart.length() > 0) {
				try {
					Integer val;
					switch (dart.charAt(0)) {
						case 'T':
							zone = DartZone.TRIPLE;
							val = Integer.valueOf(dart.substring(1));
							sector = DartSector.getSingle(val.intValue());
							if (DartSector.BULL.equals(sector)) {
								sector = DartSector.NONE;
							}
							break;
						case 'D':
							zone = DartZone.DOUBLE;
							val = Integer.valueOf(dart.substring(1));
							sector = DartSector.getSingle(val.intValue());
							break;
						default:
							zone = DartZone.SINGLE;
							val = Integer.valueOf(dart);
							sector = DartSector.getSingle(val.intValue());
							break;
					}
					if (DartSector.NONE.equals(sector)) {
						zone = DartZone.NONE;
					}

				} catch (NumberFormatException e) {
					Logger.warn("Invalid dart format: " + sDart);
					sector = DartSector.NONE;
					zone = DartZone.NONE;
				}
			}
		}
		// check warn
		if ((sector == null) || (zone == null)) {
			Logger.warn("Invalid dart format: " + sDart);
			sector = DartSector.NONE;
			zone = DartZone.NONE;
		}
		return this.createDart(sector, zone);
	}
}
