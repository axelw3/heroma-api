const Day = require("./day.js");

/**
 * Heroma calendar data (personal).
 */
class HeromaCalendar{
	/**
	 * A calendar day.
	 */
	static HeromaCalendarDay = class HeromaCalendarDay{
		/**
		 * A work shift.
		 */
		static HeromaCalendarShift = class HeromaCalendarShift{
			constructor(data){
				this.belongsDate = new Date(data.BelongsDate);
				this.begin = new Date(this.belongsDate.getTime() + data.FromHour * 3600000 + data.FromMinute * 60000);
				this.end = new Date(this.belongsDate.getTime() + data.ToHour * 3600000 + data.ToMinute * 60000);
				this.breakText = data.BreakText;
				this.description = data.Description;
				this.shortDescription = data.ShortDescription;
				this.colorCode = data.ColorCode;
				this.type = data.Type;
				this.workOnAbsence = data.IsTypeWorkOnAbsence;
				this.caseRef = data.CaseRef;
				// this.canRecall = data.CanRecall;
				// this.recallRequiresNote = data.RecallRequiresNote;
				this.partOfShift = data.IsPartOfShift;
				this.partOfShiftDetails = data.PartOfShift;
				this.compensationPromised = data.CompensationPromised;
				this.duringAbsence = data.IsDuringAbsence;
				this.nightShift = data.IsNightShift;
			}

			/**
			 * Get description of this shift.
			 * @return {string} shift description
			 */
			getDescription(){
				return this.description;
			}

			/**
			 * Check whether or not this shift is a night shift.
			 * @return {boolean} `true` if yes, otherwise `false`
			 */
			isNightShift(){
				return this.nightShift;
			}

			/**
			 * Get shift start time.
			 * @return {Date} shift starting time
			 */
			getBegin(){
				return new Date(this.begin);
			}

			/**
			 * Get shift start timestamp.
			 * @return {number} unix timestamp of shift start
			 */
			getBeginTime(){
				return this.begin.getTime();
			}

			/**
			 * Get shift end time.
			 * @return {Date} shift ending time
			 */
			getEnd(){
				return new Date(this.end);
			}

			/**
			 * Get shift start timestamp.
			 * @return {number} unix timestamp of shift end
			 */
			getEndTime(){
				return this.end.getTime();
			}

			isDuringAbsence(){
				return this.duringAbsence;
			}

			/**
			 * Whether compensation is promised for this shift.
			 * @return {boolean} `true` if yes, otherwise `false`
			 */
			isCompensationPromised(){
				return this.compensationPromised;
			}

			isPartOfShift(){
				return this.partOfShift;
			}

			getPartOfShiftDetails(){
				return this.partOfShiftDetails;
			}

			/**
			 * Get reference number of corresponding case. Useful for fetching additional information, e.g. by use of the getTaskLogs() api.
			 * @return {string} corresponding case reference number
			 */
			getCaseRef(){
				return this.caseRef;
			}

			isTypeWorkOnAbsence(){
				return this.workOnAbsence;
			}

			/**
			 * Get duration of break.
			 */
			getBreakText(){
				return this.breakText;
			}
		};

		constructor(data){
			this.date = Day.fromString(data.Date);
			this.workhours = (data.Workhours || []).map(shift => new HeromaCalendar.HeromaCalendarDay.HeromaCalendarShift(shift));
		}

		/**
		 * Get date.
		 * @return {Day} a date string in the YYYY-MM-DD format
		 */
		getDate(){
			return this.date.copy();
		}

		/**
		 * Check whether day is a workday.
		 * @return {boolean} `true` if any work hours are planned, otherwise `false`
		 */
		isWorkDay(){
			return this.workhours.length > 0;
		}

		/**
		 * Check whether day is a day off (i.e. no work hours are planned).
		 * @return {boolean} `true` for days off, `false` if work hours are planned
		 */
		isDayOff(){
			return !this.isWorkDay();
		}

		/**
		 * Get planned work hours for this day.
		 * @return {Array} array of {HeromaCalendar.HeromaCalendarDay.HeromaCalendarShift}
		 */
		getWorkHours(){
			return this.workhours;
		}
	}

	constructor(calendar_data){
		this.days = {};
		calendar_data.WorkContainer.forEach(day=>{
			this.days[day.Date] = new HeromaCalendar.HeromaCalendarDay(day);
		});
	}

	/**
	 * Get calendar day by date.
	 * @param {Day} day a day
	 * @return {HeromaCalendar.HeromaCalendarDay} a calendar day
	 */
	getDay(day){
		let data = this.days[day.toString()];
		if(!data){
			throw new Error("Unknown date.");
		}
		return data;
	}
};

module.exports = HeromaCalendar;