package models.ui;

/**
 * The Class TitledMessage.
 */
public class TitledMessage {

	/** The title. */
	private final String title;

	/** The message. */
	private final String message;

	/**
	 * Instantiates a new titled message.
	 *
	 * @param title the title
	 * @param message the message
	 */
	public TitledMessage(String title, String message) {
		super();
		this.title = title;
		this.message = message;
	}

	/**
	 * Gets the title.
	 *
	 * @return the title
	 */
	public String getTitle() {
		return this.title;
	}

	/**
	 * Gets the message.
	 *
	 * @return the message
	 */
	public String getMessage() {
		return this.message;
	}

}