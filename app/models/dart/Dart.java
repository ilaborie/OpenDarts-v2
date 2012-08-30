package models.dart;

/** The Class Dart. */
public class Dart implements IDart {

	/** The sector. */
	private final DartSector sector;

	/** The zone. */
	private final DartZone zone;

	/** The score. */
	private final int score;

	/** Instantiates a new dart.
	 * 
	 * @param sector the sector
	 * @param zone the zone */
	public Dart(DartSector sector, DartZone zone) {
		super();
		this.sector = sector;
		this.zone = zone;
		if ((zone != null) && (sector != null)) {
			this.score = this.computeScore();
		} else {
			this.score = 0;
		}
	}

	/** Compute score.
	 * 
	 * @return the score */
	private int computeScore() {
		int baseScore = this.sector.getBaseScore();
		int multi = this.zone.getMultiplier();
		return baseScore * multi;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		String result;
		switch (this.sector) {
			case TWENTY:
				if (DartZone.DOUBLE.equals(this.zone)) {
					result = "Top";
					break;
				}
			default:
				result = this.zone.toString() + this.sector.toString();
				break;
		}
		return result;
	}
	
	@Override
	public Color getColor() {
		Color col = null;
		// base
		switch (this.sector) {
			case BULL:
				if (DartZone.DOUBLE.equals(this.zone)) {
					return Color.red;
				} else {
					return Color.green;
				}
			case EIGHT:
				col= Color.black;
				break;
			case EIGHTEEN:
				col= Color.black;
				break;
			case ELEVEN:
				col= Color.white;
				break;
			case FIVE:
				col= Color.white;
				break;
			case FIVETEEN:
				col= Color.white;
				break;
			case FOUR:
				col= Color.white;
				break;
			case FOURTEEN:
				col= Color.black;
				break;
			case NINE:
				col= Color.white;
				break;
			case NINETEEN:
				col= Color.white;
				break;
			case NONE:
				return Color.none;
			case ONE:
				col= Color.white;
				break;
			case OUT_OF_TARGET:
				return Color.none;
			case SEVEN:
				col= Color.black;
				break;
			case SEVENTEEN:
				col= Color.white;
				break;
			case SIX:
				col= Color.white;
				break;
			case SIXTEEN:
				col= Color.white;
				break;
			case TEN:
				col= Color.black;
				break;
			case THIRTEEN:
				col= Color.black;
				break;
			case THREE:
				col= Color.black;
				break;
			case TWELVE:
				col= Color.black;
				break;
			case TWENTY:
				col= Color.black;
				break;
			case TWO:
				col= Color.black;
				break;
			case UNLUCKY_DART:
				return Color.none;
			default:
				break;
		}
		
		// Handle zone
		switch (this.zone) {
			case SINGLE:
				return col;
			case DOUBLE:
			case TRIPLE:
				if (Color.black.equals(col)) {
					return Color.red;
				} else {
					return Color.green;
				}
			case NONE:
			default:
				return Color.none;
		}
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.opendarts.prototype.model.dart.IDart#getSector()
	 */
	@Override
	public DartSector getSector() {
		return this.sector;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.opendarts.prototype.model.dart.IDart#getZone()
	 */
	@Override
	public DartZone getZone() {
		return this.zone;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.opendarts.prototype.model.dart.IDart#getScore()
	 */
	@Override
	public int getScore() {
		return this.score;
	}

}
