package models.x01;

import com.google.common.base.Objects;

/** The Class ComputerThrowRequest. */
public class ComputerThrowRequest {

	/** The lvl. */
	private int lvl;

	/** The left. */
	private int left;

	/** The type. */
	private int type;

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return Objects.toStringHelper(this)
				.add("level", Integer.valueOf(this.lvl))
				.add("type", Integer.valueOf(this.type))
				.add("left", Integer.valueOf(this.left))
				.toString();
	}

	/** Gets the lvl.
	 * 
	 * @return the lvl */
	public int getLvl() {
		return this.lvl;
	}

	/** Sets the lvl.
	 * 
	 * @param lvl the new lvl */
	public void setLvl(int lvl) {
		this.lvl = lvl;
	}

	/** Gets the left.
	 * 
	 * @return the left */
	public int getLeft() {
		return this.left;
	}

	/** Sets the left.
	 * 
	 * @param left the new left */
	public void setLeft(int left) {
		this.left = left;
	}

	/** Gets the type.
	 * 
	 * @return the type */
	public int getType() {
		return this.type;
	}

	/** Sets the type.
	 * 
	 * @param type the new type */
	public void setType(int type) {
		this.type = type;
	}

}
