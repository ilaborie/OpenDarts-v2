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
package models.x01;

import java.util.List;

import com.google.common.base.Objects;
import com.google.common.collect.Lists;

/** The Class ComputerThrow. */
public class ComputerThrow {

	/** Darts. */
	private List<ComputerDart> darts = Lists.newArrayList();

	/** The score. */
	private int score;

	/** The status. */
	private Status status;

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return Objects.toStringHelper(this)
				.add("darts", this.darts)
				.add("status", this.status)
				.toString();
	}
	
	public List<ComputerDart> getDarts() {
		return this.darts;
	}

	/** Gets the score.
	 * 
	 * @return the score */
	public int getScore() {
		return this.score;
	}

	/** Sets the score.
	 * 
	 * @param score the new score */
	public void setScore(int score) {
		this.score = score;
	}

	/** Gets the status.
	 * 
	 * @return the status */
	public Status getStatus() {
		return this.status;
	}

	/** Sets the status.
	 * 
	 * @param status the new status */
	public void setStatus(Status status) {
		this.status = status;
	}
}
