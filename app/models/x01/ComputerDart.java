package models.x01;

import models.dart.Color;

import com.google.common.base.Objects;

/** The Class ComputerDart. */
public class ComputerDart {

	/** The wished. */
	private String wished;

	/** The done. */
	private String done;

	/** The color. */
	private Color color;

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return Objects.toStringHelper(this)
				.add("wished", this.wished)
				.add("done", this.done)
				.toString();
	}

	/** Gets the wished.
	 * 
	 * @return the wished */
	public String getWished() {
		return this.wished;
	}

	/** Sets the wished.
	 * 
	 * @param wished the new wished */
	public void setWished(String wished) {
		this.wished = wished;
	}

	/** Gets the done.
	 * 
	 * @return the done */
	public String getDone() {
		return this.done;
	}

	/** Sets the done.
	 * 
	 * @param done the new done */
	public void setDone(String done) {
		this.done = done;
	}

	/**
	 * Gets the color.
	 *
	 * @return the color
	 */
	public Color getColor() {
		return this.color;
	}

	/**
	 * Sets the color.
	 *
	 * @param color the new color
	 */
	public void setColor(Color color) {
		this.color = color;
	}

}
