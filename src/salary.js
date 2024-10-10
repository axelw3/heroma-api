const { HeromaPerson } = require("./core.js");

/**
 * Representation of a person in the Heroma payroll system. Used for salary-related APIs.
 */
class HeromaSalaryPerson extends HeromaPerson{
	constructor(data){
		super(data.PersonRef, data.FirstName, data.LastName, data.Personnr, data.Idnr);
		this.anstnr = data.Anstnr;
		this.defaultPATeam = data.DefaultPATeam;
		this.personInfoRef = this.PersonInfoRef;
	}

	getIdnr(){
		return this.idnr;
	}

	getPersonInfoRef(){
		return this.personInfoRef;
	}
}

/**
 * Basic salary information for a pay period.
 */
class HeromaSalarySummary{
	constructor(data){
		this.salary = {
			gross: data.GrossSalary,
			prelTax: data.PreliminaryTax,
			net: data.NetSalary,
			paydate: new Date(data.PayDate),
			otherCompensation: data.OtherCompensation
		};

		this.remain = {
			paidDays: data.RemainingPaidDays,
			paidHours: data.RemainingPaidHours,
			unpaidDays: data.RemainingUnpaidDays
		};

		this.vacation = {
			saved: data.SavedVacation,
			savedHours: data.SavedHours,
			quota: data.VacationQuota
		};

		this.calendarFactor = data.CalendarFactor;
		this.yearWorkDays = data.YearWorkDays;

		this.salaryYear = {
			gross: data.GrossSalaryYear,
			prelTax: data.PreliminaryTaxYear
		};

		this.dateCalculated = new Date(data.SalaryCalculated);
		this.dateCalculatedString = data.SalaryCalculatedString;
	}
}

/**
 * Detailed salary information (e.g. information about individual salary entries) for a pay period.
 */
class HeromaSalaryDetails{
	static HeromaSalaryDetailsEntry = class HeromaSalaryDetailsEntry{
		constructor(edata){
			this.quantity = edata.Quantity;
			this.unitPrice = edata.UnitPrice;
			this.workDays = edata.WorkDays;
			this.amount = edata.Amount;
			this.name = edata.Name;
			this.noDeduction = edata.NoDeduction;
			this.begin = edata.Fom;
			this.end = edata.Tom;
			this.lart = edata.Lart;
			this.salaryType = edata.LöneArt;
			this.period = edata.Period;
			this.reserveAmt = edata.ReserveAmount;
			this.transactionType = edata.TransactionType;
			this["lätthelg"] = edata["Lätthelg"];
		}

		getName(){
			return this.name;
		}

		getLart(){
			return this.lart;
		}

		getType(){
			return this.salaryType;
		}

		/**
		 * Get unit price of this salary entry.
		 * @return {number} unit price (hourly rate)
		 */
		getUnitPrice(){
			return this.unitPrice;
		}

		/**
		 * Get quantity (hours) of this salary entry.
		 * @return {number} quantity of this entry
		 */
		getQuantity(){
			return this.quantity;
		}

		/**
		 * Get total amount for this entry.
		 * @return {number} the amount
		 */
		getAmount(){
			return this.amount;
		}
	}

	constructor(data){
		this.entries = {};
		data.data.forEach(rawentry=>{
			let entry = new HeromaSalaryDetails.HeromaSalaryDetailsEntry(rawentry);
			this.entries[entry.getLart()] = entry;
		});
	}

	/**
	 * Get salary entry by type.
	 * @param {string} lart type of salary (e.g. hourly, overtime, holiday pay)
	 * @return {HeromaSalaryDetails.HeromaSalaryDetailsEntry} a salary entry
	 */
	getEntry(lart){
		return this.entries[lart];
	}

	/**
	 * Get all salary entries.
	 @return {Array} an array of {HeromaSalaryDetails.HeromaSalaryDetailsEntry}
	 */
	all(){
		return Object.values(this.entries);
	}
}

module.exports = { HeromaSalarySummary, HeromaSalaryPerson, HeromaSalaryDetails };