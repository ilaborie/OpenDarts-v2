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
