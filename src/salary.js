const { HeromaPerson } = require("./core.js");

/**
 * Representation of a person in the Heroma payroll system. Used for salary-related APIs.
 */
class HeromaSalaryPerson extends HeromaPerson{
	constructor(data){
		super(data.PersonRef, data.FirstName, data.LastName, data.Personnr, data.Idnr);
		this.anstnr = data.Anstnr; // = username
		this.defaultPATeam = data.DefaultPATeam;
		this.personInfoRef = this.PersonInfoRef;
	}

	/**
	 * Get PersonInfoRef number for this person.
	 * @returns {string} a PersonInfoRef string
	 */
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
			/**
			 * Gross salary.
			 * @type {number}
			 */
			gross: data.GrossSalary,

			/**
			 * Preliminary tax amount.
			 * @type {number}
			 */
			prelTax: data.PreliminaryTax,

			/**
			 * Net salary.
			 * @type {number}
			 */
			net: data.NetSalary,

			/**
			 * Date of salary payment.
			 * @type {Date}
			 */
			paydate: new Date(data.PayDate),

			/**
			 * Other compensation amount.
			 * @type {number}
			 */
			otherCompensation: data.OtherCompensation
		};

		this.remain = {
			/**
			 * Days of paid vacation remaining.
			 * @type {number}
			 */
			paidDays: data.RemainingPaidDays,

			/**
			 * Hours of paid vacation remaining.
			 * @type {number}
			 */
			paidHours: data.RemainingPaidHours,

			/**
			 * Unpaid days remaining.
			 * @type {number}
			 */
			unpaidDays: data.RemainingUnpaidDays
		};

		this.vacation = {
			/**
			 * Saved days of vacation.
			 * @type {number}
			 */
			saved: data.SavedVacation,

			/**
			 * Saved hours of vacation.
			 * @type {number}
			 */
			savedHours: data.SavedHours,

			/**
			 * Vacation quota.
			 * @type {number}
			 */
			quota: data.VacationQuota
		};

		this.calendarFactor = data.CalendarFactor;
		this.yearWorkDays = data.YearWorkDays;

		this.salaryYear = {
			/**
			 * Total gross salary in selected year.
			 */
			gross: data.GrossSalaryYear,

			/**
			 * Total preliminary tax amount in selected year.
			 */
			prelTax: data.PreliminaryTaxYear
		};

		/**
		 * Timestamp of last salary calcuation.
		 */
		this.dateCalculated = new Date(data.SalaryCalculated);

		/**
		 * Formatted timestamp of last salary calculation.
		 */
		this.dateCalculatedString = data.SalaryCalculatedString;
	}

	/**
	 * Get basic salary information for this salary period.
	 * @returns {object} a salary information object
	 */
	getSalary(){
		return this.salary;
	}
}

/**
 * Detailed salary information (e.g. information about individual salary entries) for a pay period.
 */
class HeromaSalaryDetails{
	/**
	 * A salary entry (löneart).
	 */
	static HeromaSalaryDetailsEntry = class HeromaSalaryDetailsEntry{
		constructor(edata){
			this.quantity = edata.Quantity;
			this.unitPrice = edata.UnitPrice;
			this.workDays = edata.WorkDays;
			this.amount = edata.Amount;
			this.name = edata.Name;
			this.noDeduction = edata.NoDeduction;
			this.begin = edata.Fom || "\xd6ppet";
			this.end = edata.Tom || "\xd6ppet";
			this.lart = edata.Lart;
			this.loneArt = edata["LöneArt"];
			this.extent = edata.Extent;
			this.period = new Date(edata.Period); // löneperiod
			this.rowNumber = edata.RowNumber;
			this.serialNo1 = edata.SerialNumber1;
			this.reserveAmt = edata.ReserveAmount;
			this.transactionType = edata.TransactionType;
			this.latthelg = edata["L\xe4tthelg"];
			this.orgRef = edata.OrgRef;
		}

		/**
		 * Get name of this salary entry.
		 * @returns name of this entry
		 */
		getName(){
			return this.name;
		}

		/**
		 * Get type id of this salary entry (löneart).
		 * @returns {string} type id
		 */
		getLart(){
			return this.lart;
		}

		/**
		 * Get type (löneart) details for this salary entry.
		 * @returns {object} an object
		 */
		getLartDetails(){
			return this.loneArt;
		}

		/**
		 * @deprecated use {@link getType}
		 */
		getType(){
			return this.getLartDetails();
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

		data.data.forEach(rawentry => {
			let entry = new HeromaSalaryDetails.HeromaSalaryDetailsEntry(rawentry);
			this.entries[entry.getLart()] = entry;
		});
	}

	/**
	 * Get salary entry by type (löneart), e.g. hourly, overtime, holiday pay.
	 * @param {string} lart salary type id, usually a four-digit number
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