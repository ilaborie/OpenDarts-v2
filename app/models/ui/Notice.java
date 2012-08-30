package models.ui;

/**
 * The Class Notice.
 */
public class Notice {

	/**
	 * Info.
	 *
	 * @param message the message
	 * @return the notice
	 */
	public static Notice info(String message) {
		return new Notice(Kind.info, message);
	}

	/**
	 * Success.
	 *
	 * @param message the message
	 * @return the notice
	 */
	public static Notice success(String message) {
		return new Notice(Kind.success, message);
	}

	/**
	 * Warn.
	 *
	 * @param message the message
	 * @return the notice
	 */
	public static Notice warn(String message) {
		return new Notice(Kind.warn, message);
	}

	/**
	 * Danger.
	 *
	 * @param message the message
	 * @return the notice
	 */
	public static Notice danger(String message) {
		return new Notice(Kind.danger, message);
	}

	/**
	 * Error.
	 *
	 * @param message the message
	 * @return the notice
	 */
	public static Notice error(String message) {
		return new Notice(Kind.error, message);
	}

	/**
	 * The Enum Kind.
	 */
	private static enum Kind {
		
		/** The info. */
		info, 
 /** The success. */
 success, 
 /** The warn. */
 warn, 
 /** The error. */
 error, 
 /** The danger. */
 danger;
	}

	/** The kind. */
	private final Kind kind;
	
	/** The message. */
	private final String message;

	/**
	 * Instantiates a new notice.
	 *
	 * @param kind the kind
	 * @param message the message
	 */
	private Notice(Kind kind, String message) {
		super();
		this.kind = kind;
		this.message = message;
	}

	/**
	 * Gets the kind.
	 *
	 * @return the kind
	 */
	public Kind getKind() {
		return this.kind;
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
