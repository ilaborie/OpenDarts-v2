package models.dartboard;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.google.common.io.Closeables;

import models.dart.DartSector;
import models.dart.DartZone;
import models.dart.IDart;
import play.Application;
import play.Logger;
import services.dart.DartService;

/** The Class Dartboard. */
public class Dartboard {

	private static Dartboard db;

	/** The dart service. */
	private final DartService dartService;

	/** The board props. */
	private final Properties boardProps;

	/** The dartboard. */
	private DartboardProperties dartboard;

	/** The lvl factor. */
	private final Map<Integer, Double> lvlFactor;

	/** Instantiates a new dartboard. */
	private Dartboard() {
		super();
		this.boardProps = new Properties();
		this.dartService = new DartService();
		this.lvlFactor = new HashMap<Integer, Double>();
	}

	/** Gets the single instance of Dartboard.
	 * 
	 * @return single instance of Dartboard */
	public static Dartboard getInstance() {
		return db;
	}

	/** Load.
	 * 
	 * @param app the app */
	public static void load(Application app) {
		db = new Dartboard();
		// load player stats
		String resource = "/dartboard/DartBoard.properties";
		InputStream in = null;
		try {
			in = app.resourceAsStream(resource);
			db.boardProps.load(in);
		} catch (IOException e) {
			Logger.error("Fail to load computer level stats", e);
		} finally {
			Closeables.closeQuietly(in);
		}
		db.dartboard = new DartboardProperties(db.boardProps);

		// Level Factor
		Pattern p = Pattern.compile("level\\.(.*)");
		Matcher matcher;
		String lvl;
		String value;
		for (Object prop : db.boardProps.keySet()) {
			matcher = p.matcher((String) prop);
			if (matcher.matches()) {
				lvl = matcher.group(1);
				value = db.boardProps.getProperty((String) prop);
				try {
					db.lvlFactor.put(Integer.valueOf(lvl),
							Double.valueOf(value));
				} catch (NumberFormatException e) {
					// Omit player
				}
			}
		}
	}

	/** Shutdown. */
	public void shutdown() {
		this.dartboard = null;
	}

	/** Gets the dartboard.
	 * 
	 * @return the dartboard */
	public DartboardProperties getDartboard() {
		return this.dartboard;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.opendarts.core.ia.service.IDartboard#getDart(double, double)
	 */

	/** Gets the dart.
	 * 
	 * @param x the x
	 * @param y the y
	 * @return the dart */
	public IDart getDart(double x, double y) {
		// distance
		double dist = this.getDistance(x, y);

		// Zone
		DartZone zone;
		if (dist > this.dartboard.getDoubleZone()) {
			return this.dartService.createDart(DartSector.OUT_OF_TARGET, DartZone.NONE);
		} else if (dist > this.dartboard.getBigZone()) {
			zone = DartZone.DOUBLE;
		} else if (dist > this.dartboard.getTripleZone()) {
			zone = DartZone.SINGLE;
		} else if (dist > this.dartboard.getSmallSimpleZone()) {
			zone = DartZone.TRIPLE;
		} else if (dist > this.dartboard.getSimpleBullZone()) {
			zone = DartZone.SINGLE;
		} else if (dist > this.dartboard.getDoubleBullZone()) {
			return this.dartService.createDart(DartSector.BULL, DartZone.SINGLE);
		} else {
			return this.dartService.createDart(DartSector.BULL, DartZone.DOUBLE);
		}

		// Angle
		double deg = this.getAngle(x, y);

		// Sector
		DartSector sector = DartSector.SIX;
		double test = 0;
		// six start at -90
		deg -= 9;
		while (deg > test) {
			sector = sector.getPrevious();
			test += 18;
		}

		return this.dartService.createDart(sector, zone);
	}

	/** Gets the player factor.
	 * 
	 * @param lvl the lvl
	 * @return the player factor */
	public double getPlayerFactor(int lvl) {
		return this.lvlFactor.get(Integer.valueOf(lvl)).doubleValue();
	}

	/** Gets the distance.
	 * 
	 * @param x the x
	 * @param y the y
	 * @return the distance */
	private double getDistance(double x, double y) {
		return Math.sqrt((x * x) + (y * y));
	}

	/** Gets the angle.
	 * 
	 * @param x the x
	 * @param y the y
	 * @return the angle */
	private double getAngle(double x, double y) {
		double atan = Math.atan2(y, x);
		double deg = (atan * 180) / Math.PI;

		if (deg < 0) {
			deg += 360;
		}
		return deg;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.opendarts.core.ia.service.IDartboard#getX(org.opendarts.core.model.dart.IDart)
	 */

	/** Gets the x.
	 * 
	 * @param dart the dart
	 * @return the x */
	public double getX(IDart dart) {
		double x;
		if (dart.getScore() == 50) {
			x = 0;
		} else if (dart.getScore() == 25) {
			x = (this.dartboard.getSimpleBullZone() + this.dartboard
					.getDoubleBullZone()) / 2;
		} else {
			double dist = this.getDistance(dart);
			double deg = this.getAngle(dart);
			double rad = (deg * Math.PI) / 180;
			x = dist * Math.cos(rad);
		}
		return x;
	}

	/** Gets the angle.
	 * 
	 * @param dart the dart
	 * @return the angle */
	private double getAngle(IDart dart) {
		double deg;
		switch (dart.getSector()) {
			case BULL:
			case OUT_OF_TARGET:
			case UNLUCKY_DART:
			case NONE:
				deg = 0;
				break;
			default:
				deg = 0;
				DartSector sector = DartSector.SIX;
				while (sector != dart.getSector()) {
					deg += 18;
					sector = sector.getPrevious();
				}

				break;
		}
		return deg;
	}

	/** Gets the distance.
	 * 
	 * @param dart the dart
	 * @return the distance */
	private double getDistance(IDart dart) {
		double dist;
		switch (dart.getZone()) {
			case TRIPLE:
				dist = (this.dartboard.getSmallSimpleZone() + this.dartboard
						.getTripleZone()) / 2;
				break;
			case SINGLE:
				dist = (this.dartboard.getTripleZone() + this.dartboard
						.getBigZone()) / 2;
				break;
			case DOUBLE:
				dist = (this.dartboard.getBigZone() + this.dartboard
						.getDoubleZone()) / 2;
				break;
			case NONE:
			default:
				dist = this.dartboard.getDoubleZone() + 20;
				break;
		}
		return dist;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.opendarts.core.ia.service.IDartboard#getY(org.opendarts.core.model.dart.IDart)
	 */
	/** Gets the y.
	 * 
	 * @param dart the dart
	 * @return the y */
	public double getY(IDart dart) {
		double y;
		if (dart.getScore() == 50) {
			y = 0;
		} else if (dart.getScore() == 25) {
			y = (this.dartboard.getSimpleBullZone() + this.dartboard
					.getDoubleBullZone()) / 2;
		} else {
			double dist = this.getDistance(dart);
			double deg = this.getAngle(dart);
			double rad = (deg * Math.PI) / 180;
			y = dist * Math.sin(rad);
		}
		return y;
	}

}
