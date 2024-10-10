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
		for(let entry in data.ListSM){
			this.sm.push(new HeromaScheduleModificationsEntry(entry, this.personRef));
		}
	}
}

class HeromaScheduleModificationLog{
	constructor(data){
		
	}
}

module.exports = { HeromaScheduleModifications, HeromaScheduleModificationsEntry, HeromaScheduleModificationLog };