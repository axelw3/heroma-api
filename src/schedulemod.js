const Day = require("./day.js");

/**
 * A schedule modification entry.
 */
class HeromaScheduleModificationsEntry{
	constructor(data, personRef){
		this.workChangeRef = data.WorkChangeRef;
		this.caseRef = data.CaseRef;
		this.caseType = data.CaseType; // ärendetyp
		this.statusName = data.StatusName; // status
		this.caseStatus = data.CaseStatus; // ärendestatus
		this.begin = Day.fromString(data.DateFrom); // från dag
		this.end = Day.fromString(data.DateTom); // till dag
		this.compensationText = data.CompansationText; // beskrivning av ersättning
		this.remark = data.Remark; // anmärkning
		this.reason = data.Reason; // orsak
		this.caseRelation = data.CaseRelation; // t.ex. "Byte med: xxxxx"
		this.basProcess = data.BasProcess;
		this.LASTyp = data.LASTyp;
		this.LASKvalificering = data.LASKvalificering;
		this.lastUpdated = data.LastUpdated; // senast uppdaterad
		this.approvedTime = data.ApprovedTime;
		this.approvedTimeRead = data.ApprovedTimeRead;
		this.bookingOverviewData = data.BookingOverviewData; // bokat arbete
		this.overlappingAF = data.OverlappingAF; // överlappande AF (arbetsförändring)
		this.compensationStatus = data.ReplacementStatus; // ersättning
		this.compensationModels = data.ReplaceModels; // ersättningsmodell
		// ...

		this._personRef = personRef;
	}

	/**
	 * Get reference number of this work change.
	 * Useful for retrieving logs with {@link Heroma.getScheduleModificationLog}.
	 * @returns {string} a reference number
	 */
	getWorkChangeRef(){
		return this.workChangeRef;
	}

	/**
	 * Get reference number of the user.
	 * @returns {string} employee reference number
	 */
	getPersonRef(){
		return this._personRef;
	}
};

/**
 * A collection of schedule modifications.
 */
class HeromaScheduleModifications{
	constructor(data){
		this.personRef = data.EmployeeRef;
		this.sm = data.ListSM.map(sm => new HeromaScheduleModificationsEntry(sm, this.personRef));
	}

	/**
	 * Get all available schedule modifications.
	 * @returns {Array<HeromaScheduleModificationsEntry>} an array of schedule modifications
	 */
	all(){
		return this.sm;
	}
}

class HeromaScheduleModificationLog{
	static HeromaScheduleModificationLogEntry = class HeromaScheduleModificationLogEntry{
		constructor(data){
			this.SMRef = data.SMRef;
			this.user = data.User;
			this.dateTimeString = data.LoggingDateTimeString;
			this.SMBegin = Day.fromString(data.SMFrom);
			this.SMEnd = Day.fromString(data.SMTo);
			this.text = data.LoggText;
		}

		/**
		 * Get schedule modification reference number.
		 * @returns {string} reference number of this entry
		 */
		getSMRef(){
			return this.SMRef;
		}

		/**
		 * Get name of user who made this schedule modification.
		 * @returns {string} name and username of user responsible
		 */
		getUser(){
			return this.user;
		}

		/**
		 * Date and time of this log entry.
		 * @returns {string} date and time, in the format `YYYY-MM-DD HH:MM`
		 */
		getLoggingDateTimeString(){
			return this.dateTimeString;
		}

		/**
		 * Start date of corresponding schedule modification.
		 * @returns {Day} a date
		 */
		getSMFrom(){
			return this.SMBegin.copy();
		}

		/**
		 * End date of corresponding schedule modification.
		 * @returns {Day} a date
		 */
		getSMTo(){
			return this.SMEnd.copy();
		}

		/**
		 * Get log text.
		 * @returns {string} log text
		 */
		getLogText(){
			return this.text;
		}
	}

	constructor(data){
		this.entries = data.ListLogModels.map(x=>{
			return new HeromaScheduleModificationLog.HeromaScheduleModificationLogEntry(x);
		});
	}

	/**
	 * Get all log entries for this schedule modification.
	 * @returns {Array<HeromaScheduleModificationLog.HeromaScheduleModificationLogEntry>} array of all available log entries
	 */
	allEntries(){
		return this.entries;
	}
}

module.exports = { HeromaScheduleModifications, HeromaScheduleModificationsEntry, HeromaScheduleModificationLog };