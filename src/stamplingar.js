/**
 * Heroma stämplingar (time registrations).
 */
class HeromaStamplingar{
	/**
	 * Representation of a stämpling (time registrations, e.g. "clock-in", "clock-out") in Heroma.
	 */
	static HeromaStampling = class HeromaStampling{
		constructor(data){
			this.type = {
				id: data.Type,
				name: data.TypeName
			};
			this.origin = data.Origin;
			this.time = new Date(data.Date + " " + data.Time);
			this.originTime = new Date(data.OriginDate);
			this.adjusted = this.time.getTime() != this.originTime.getTime();
		}

		/**
		 * Check whether this registration has been modified.
		 * @return {boolean} `true` if registration time has been adjusted, otherwise `false`
		 */
		isAdjusted(){
			return this.adjusted;
		}

		/**
		 * Get origin (original, unmodified) time of this registration.
		 * @return {Date} original timestamp noted
		 */
		getOriginTime(){
			return new Date(this.originTime);
		}

		/**
		 * Get registered time.
		 * @return {Date} registration timestamp
		 */
		getTime(){
			return new Date(this.time);
		}
	}

	constructor(data){
		this.stamplingar = data.map(x => new HeromaStamplingar.HeromaStampling(x));
	}

	/**
	 * Get all available time registrations.
	 * @param {boolean} onlyAdjusted only include registrations which have been modified
	 * @return {Array<HeromaStamplingar.HeromaStampling} an array of {HeromaStamplingar.HeromaStampling}
	 */
	all(onlyAdjusted = false){
		if(!onlyAdjusted){
			return this.stamplingar;
		}

		return this.all(false).filter(x => x.adjusted);
	}

	/**
	 * Get all modified time registrations available.
	 * @return {Array<HeromaStamplingar.HeromaStampling>} an array of {HeromaStamplingar.HeromaStampling}
	 */
	allAdjusted(){
		return this.all(true);
	}

	/**
	 * Get all available time registrations from given origin.
	 * @param {string} origin registration origin
	 * @param {boolean} onlyAdjusted only include registrations which have been modified
	 * @return {Array<HeromaStamplingar.HeromaStampling>} an array of {HeromaStamplingar.HeromaStampling}
	 */
	byOrigin(origin, onlyAdjusted = false){
		return this.all(onlyAdjusted).filter(x => x.origin === origin);
	}

	/**
	 * Get all available time registrations of given type.
	 * @param {string} type registration type id
	 * @param {boolean} onlyAdjusted only include registrations which have been modified
	 * @return {Array<HeromaStamplingar.HeromaStampling>} an array of {HeromaStamplingar.HeromaStampling}
	 */
	byType(type, onlyAdjusted = false){
		return this.all(onlyAdjusted).filter(x => x.type.id === type);
	}

	/**
	 * Get all available time registrations of given type name.
	 * @param {string} typeName registration type name
	 * @param {boolean} onlyAdjusted only include registrations which have been modified
	 * @return {Array} an array of {HeromaStamplingar.HeromaStampling}
	 */
	byTypeName(typeName, onlyAdjusted = false){
		return this.all(onlyAdjusted).filter(x => x.type.name === typeName);
	}
}

module.exports = HeromaStamplingar;