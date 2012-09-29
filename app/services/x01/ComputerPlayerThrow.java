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
package services.x01;

import models.dart.DartZone;
import models.dart.IDart;
import models.x01.BestDart;
import models.x01.ComputerDart;
import models.x01.ComputerThrow;
import models.x01.ComputerThrowRequest;
import models.x01.Status;
import services.ai.ComputerPlayerDartService;

/** The Class ComputerPlayerThrow. */
public class ComputerPlayerThrow {

	/** The computer player dart service. */
	private final ComputerPlayerDartService computerPlayerDartService;
	//

	/** The darts. */
	private IDart[] darts;

	/** The wished. */
	private IDart[] wished;

	/** The request. */
	private final ComputerThrowRequest request;

	/** The status. */
	private Status status;
	private boolean isFinised;

	/** Instantiates a new computer player throw.
	 * 
	 * @param request the request */
	public ComputerPlayerThrow(ComputerThrowRequest request) {
		super();
		this.request = request;
		this.computerPlayerDartService = new ComputerPlayerDartService();
	}

	/** Gets the darts throw.
	 * 
	 * @return the darts throw */
	public synchronized ComputerThrow getComputerThrow() {
		ComputerThrow result = new ComputerThrow();

		int score;
		IDart dart;

		this.darts = new IDart[3];
		this.wished = new IDart[3];
		score = this.request.getLeft();
		this.isFinised = false;
		dart = this.throwDart(score, 0);
		if (!this.isFinised) {
			score -= dart.getScore();
			dart = this.throwDart(score, 1);

			if (!this.isFinised) {
				score -= dart.getScore();
				this.throwDart(score, 2);
			}
		}

		ComputerDart cd;
		for (int i = 0; i < this.darts.length; i++) {
			if (this.darts[i] != null) {
				cd = new ComputerDart();
				cd.setDone(this.darts[i].toString());
				cd.setColor(this.darts[i].getColor());
				cd.setWished(this.wished[i].toString());
				result.getDarts().add(cd);
			}
		}

		int done = 0;
		for (IDart d : this.darts) {
			if (d!=null) {
				done += d.getScore();
			}
		}
		result.setScore(done);
		result.setStatus(this.status);

		return result;
	}

	/** Throw dart.
	 * 
	 * @param score the score
	 * @param index the index
	 * @return the i dart */
	private synchronized IDart throwDart(int score, int index) {
		IDart dart = this.getDart(score, index);
		this.darts[index] = dart;
		if (score == dart.getScore()) {
			if (DartZone.DOUBLE.equals(dart.getZone())) {
				// win
				this.status = Status.win;
				this.isFinised = true;
			} else {
				// broken
				this.status = Status.broken;
				this.isFinised = true;
			}
		} else if ((score - dart.getScore()) < 2) {
			// broken
			this.status = Status.broken;
			this.isFinised = true;
		} else {
			this.status = Status.normal;
			this.isFinised = false;
		}
		return dart;
	}

	/** Gets the dart.
	 * 
	 * @param score the score
	 * @param index the index
	 * @return the first dart */
	private synchronized IDart getDart(int score, int index) {
		IDart wished = BestDart.chooseBestDart(this.request.getType(), score, this.darts.length - index);
		this.wished[index] = wished;
		IDart done = this.computerPlayerDartService.getComputerDart(
				this.request.getLvl(), wished);
		return done;
	}
}
