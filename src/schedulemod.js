class HeromaScheduleModificationsEntry{
	constructor(data, personRef){
		this.workChangeRef = data.WorkChangeRef;
		this.caseRef = data.CaseRef;
		this.caseType = data.CaseType; // ärendetyp
		this.statusName = data.StatusName; // status
		this.caseStatus = data.CaseStatus; // ärendestatus
		this.begin = data.DateFrom; // från dag
		this.end = data.DateTom; // till dag
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

	getWorkChangeRef(){
		return this.workChangeRef;
	}

	getPersonRef(){
		return this._personRef;
	}
};

class HeromaScheduleModifications{
	constructor(data){
		this.sm = [];
		this.personRef = data.EmployeeRef;
		for(let i = 0; i < data.ListSM.length; i++){
			this.sm.push(new HeromaScheduleModificationsEntry(data.ListSM[i], this.personRef));
		}
	}
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
			this.SMBegin = data.SMFrom;
			this.SMEnd = data.SMTo;
			this.text = data.LoggText;
		}
		getSMRef(){
			return this.SMRef;
		}
		getUser(){
			return this.user;
		}
		getLoggingDateTimeString(){
			return this.dateTimeString;
		}
		getSMFrom(){
			return this.SMBegin;
		}
		getSMTo(){
			return this.SMEnd;
		}
		getLogText(){
			return this.text;
		}
	}
	constructor(data){
		this.entries = data.ListLogModels.map(x=>{
			return new HeromaScheduleModificationLog.HeromaScheduleModificationLogEntry(x);
		});
	}
	allEntries(){
		return this.entries;
	}
}

module.exports = { HeromaScheduleModifications, HeromaScheduleModificationsEntry, HeromaScheduleModificationLog };