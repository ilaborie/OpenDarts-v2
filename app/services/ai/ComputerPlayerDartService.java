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
package services.ai;

import java.text.MessageFormat;
import java.util.Random;

import models.dart.DartSector;
import models.dart.DartZone;
import models.dart.IDart;
import models.dartboard.Dartboard;
import models.dartboard.DartboardProperties;
import play.Logger;
import play.Logger.ALogger;
import services.dart.DartService;

/** The Class ComputerPlayerDartService. */
public class ComputerPlayerDartService {
	
	private ALogger logger = Logger.of("x01.computer");

	/** The dart service. */
	private final DartService dartService;

	/** The rand. */
	private final Random rand;

	/** Instantiates a new computer player throw service. */
	public ComputerPlayerDartService() {
		super();
		this.dartService = new DartService();
		this.rand = new Random();
	}

	/** Gets the computer dart.
	 * 
	 * @param lvl the lvl
	 * @param wished the wished
	 * @return the computer dart */
	public IDart getComputerDart(int lvl, IDart wished) {
		IDart dart;
		Dartboard db = Dartboard.getInstance();
		DartboardProperties prop = db.getDartboard();

		// unlucky factor
		int unlucky;
		if (DartSector.BULL.equals(wished.getSector())) {
			unlucky = prop.getUnLuckyBull();
		} else {
			unlucky = prop.getUnLuckyOthers();
		}

		// If unlucky
		if (this.rand.nextInt(unlucky) == 0) {
			dart = this.dartService.createDart(DartSector.UNLUCKY_DART,
					DartZone.NONE);
		} else {
			// Normal throw
			double wishedX = db.getX(wished);
			double wishedY = db.getY(wished);

			// Player factor;
			double factor = db.getPlayerFactor(lvl);

			// Gaussian
			double x = this.nextGaussian(factor, wishedX);
			double y = this.nextGaussian(factor, wishedY);

			dart = db.getDart(x, y);
		}
		if (this.logger.isTraceEnabled()) {
			this.logger.trace(MessageFormat.format("Wished: {0}\tDone: {1}", wished, dart));
		}
		return dart;
	}

	/**
	 * Next gaussian.
	 *
	 * @param factor the factor
	 * @param offset the offset
	 * @return the double
	 */
	private double nextGaussian(double factor, double offset) {
		double result = factor * this.rand.nextGaussian();
		result += offset;
		return result;
	}

}
