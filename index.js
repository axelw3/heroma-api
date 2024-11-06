// heroma-api by axelw3
// Version 1.0.1

const { HeromaAPICore, HeromaPerson } = require("./src/core.js");
const HeromaCalendar = require("./src/calendar.js");
const HeromaWorkSchedule = require("./src/workschedule.js");
const HeromaStamplingar = require("./src/stamplingar.js");
const HeromaEmploymentHistory = require("./src/employment.js");
const { HeromaSalaryPerson, HeromaSalarySummary, HeromaSalaryDetails } = require("./src/salary.js");
const { HeromaScheduleModifications, HeromaScheduleModificationsEntry, HeromaScheduleModificationLog } = require("./src/schedulemod.js");
const Day = require("./src/day.js");

const salary_details_options = encodeURIComponent("{\"Role\":1}");

/**
 * A NodeJS implementation of the Heroma API.
 */
class Heroma{
	static Day = Day;

	/**
	 * Create a new Heroma API instance.
	 * @param {string} host server host
	 * @param {string} path path to web client (e.g. /Webclient)
	 */
	constructor(host, path){
		this.api = new HeromaAPICore(host, path);
	}

	/**
	 * Log in to Heroma webb using given credentials.
	 * @param {string} username username
	 * @param {string} pass password
	 * @return {Promise} a promise
	 */
	login(username, pass){
		return new Promise((resolve, reject) => {
			// (1) GET:
			this.api.newRequest(
				"GET",
				"/Account/Login",
				{}
			).send().then(result => {
				let requestVerificationToken = HeromaAPICore.getHiddenInputValue(result.data, "__RequestVerificationToken");
				if(requestVerificationToken){
					this.api.newRequest(
						"POST",
						"/Account/Login",
						{ "Content-Type": "application/x-www-form-urlencoded" }
					)
					.body("__RequestVerificationToken=" + requestVerificationToken + "&Username=" + encodeURIComponent(username) + "&Password=" + encodeURIComponent(pass) + "&LoginType=FormLogin")
					.send().then(() => resolve(), reject);
				}
			}, reject);
		});
	}

	/**
	 * Log out.
	 * NOTE: All authorization cookies will be reset. As such, most APIs will not accessible until a new login is performed.
	 * @return {Promise} a promise
	 */
	logout(){
		return new Promise((resolve, reject) => {
			let done = () => {
				this.api.clearCookies();
				resolve();
			};

			this.api.newRequest(
				"GET",
				"/Account/LogOff",
				{}
			).send().then(done, done);
		});
	}

	/**
	 * Get calendar data for logged-in user.
	 * @param {Day} begin start date (inclusive)
	 * @param {Day} end end date (inclusive)
	 * @return {Promise<HeromaCalendar>} a promise resolving to a HeromaCalendar
	 */
	getCalendarData(begin = Day.todayUTC(), end = Day.inUTC(7)){
		return new Promise((resolve, reject) => {
			let piGetData = {
				"EndWork": end,
				"StartWork": begin,
				"TeamData": [],
				"TeamRefsForDefaultData": []
			};
			this.api.newRequest(
				"GET",
				"/api/APCalendarApi/getCalendarData?piGetData=" + encodeURIComponent(JSON.stringify(piGetData)) + "&_=" + new Date().getTime(),
				{}
			).send().then(result => {
				try{
					let parsed = JSON.parse(result.data);
					resolve(new HeromaCalendar(parsed));
				}catch(e){
					reject(e);
				}
			}, reject);
		});
	}

	/**
	 * Get work schedule for a given period.
	 * @param {Day} begin start date (inclusive)
	 * @param {Day} end end date (inclusive)
	 * @return {Promise<HeromaWorkSchedule>} a promise resolving to a HeromaWorkSchedule
	 */
	getWorkSchedule(begin = Day.todayUTC(), end = Day.inUTC(7)){
		return new Promise((resolve, reject) => {
			this.api.newRequest(
				"GET",
				"/WSV/MyWorkSchedule",
				{}
			).send().then(result => {
				let requestVerificationToken = HeromaAPICore.getHiddenInputValue(result.data, "__RequestVerificationToken");
				if(requestVerificationToken){
					this.api.newRequest(
						"POST",
						"/api/MyWorkScheduleApi/GetData",
						{"Content-Type":"application/x-www-form-urlencoded"}
					).body("Tab=1&Start=" + begin + "&Stop=" + end + "&__RequestVerificationToken=" + requestVerificationToken).send().then(result => {
						try{
							let parsed = JSON.parse(result.data);
							resolve(new HeromaWorkSchedule(parsed));
						}catch(e){
							reject(e);
						}
					}, reject);
				}
			}, reject);
		});
	}

	/**
	 * Get saldo(s) (balance[s]) for current user.
	 * @return {Promise<Array>} a promise resolving to an array of saldo(s)
	 */
	getSaldon(){
		return new Promise((resolve, reject) => {
			this.api.newRequest(
				"GET",
				"/Stamping/BalanceRegistrations/GetSaldon?_=" + new Date().getTime(),
				{}
			).send().then(result => {
				try{
					let saldon = JSON.parse(result.data);
					resolve(saldon);
				}catch(e){
					reject(e);
				}
			}, reject);
		});
	}

	/**
	 * Get time registrations for given range of dates.
	 * @param {string} saldoref saldo (balance) reference/id
	 * @param {Day} begin start date (inclusive)
	 * @param {Day} end end date (inclusive)
	 * @return {Promise<HeromaStamplingar>} a promise resolving to a HeromaStamplingar object with time registrations
	 */
	getStamplingar(saldoref, begin = Day.inUTC(-7), end = Day.todayUTC()){
		return new Promise((resolve, reject) => {
			this.api.newRequest(
				"GET",
				"/Stamping/BalanceRegistrations/GetStamplingar?piSaldoRef=" + saldoref + "&piFom=" + begin + "&piTom=" + end + "&_=" + new Date().getTime(),
				{}
			).send().then(result => {
				try{
					let times = JSON.parse(result.data);
					resolve(new HeromaStamplingar(times));
				}catch(e){
					reject(e);
				}
			}, reject);
		});
	}

	/**
	 * Get employment history.
	 * @return {Promise<HeromaEmploymentHistory>} a promise resolving to a HeromaEmploymentHistory object
	 */
	getEmploymentInfo(){
		return new Promise((resolve, reject) => {
			this.api.newRequest(
				"GET",
				"/api/EmploymentInfoApi/Get?_=" + new Date().getTime(),
				{}
			).send().then(result => {
				try{
					let parsed = JSON.parse(result.data);
					resolve(new HeromaEmploymentHistory(parsed));
				}catch(e){
					reject(e);
				}
			}, reject);
		});
	}

	/**
	 * Get schedule modifications within a given period.
	 * @param {HeromaPerson} person a person
	 * @param {Day} begin start date (inclusive)
	 * @param {Day} end end date (inclusive)
	 * @return {Promise<HeromaScheduleModifications>} a promise resolving to a HeromaScheduleModifications object
	 */
	getScheduleModifications(person, begin = Day.todayUTC(), end = Day.inUTC(7)){
		return new Promise((resolve, reject) => {
			this.api.newRequest(
				"GET",
				"/api/OverviewApi/getSMForPerson?piPersonRef=" + person.getPersonRef() + "&piStartDate=" + begin + "&piStopDate=" + end + "&piTypes=PF&_=" + new Date().getTime(),
				{}
			).send().then(result => {
				try{
					let parsed = JSON.parse(result.data);
					resolve(new HeromaScheduleModifications(parsed));
				}catch(e){
					reject(e);
				}
			}, reject);
		});
	}

	/**
	 * Get events logged for a schedule modification.
	 * @param {HeromaScheduleModificationsEntry} sm_entry a schedule modification entry
	 * @return {Promise<HeromaScheduleModificationLog>} a promise resolving to a HeromaScheduleModificationLog containing logged events
	 */
	getScheduleModificationLog(sm_entry){
		return new Promise((resolve, reject) => {
			this.api.newRequest(
				"GET",
				"/api/OverviewApi/getSMLoggEntries?piSMRef=" + sm_entry.getWorkChangeRef() +"&piPersonRef=" + sm_entry.getPersonRef() + "&_=" + new Date().getTime(),
				{}
			).send().then(result => {
				try{
					let parsed = JSON.parse(result.data);
					resolve(new HeromaScheduleModificationLog(parsed));
				}catch(e){
					reject(e);
				}
			}, reject);
		});
	}

	/**
	 * Get basic information about current user.
	 * @return {Promise<HeromaPerson>} a promise resolving to basic user information in a HeromaPerson object
	 */
	getUserSelf(){
		return new Promise((resolve, reject) => {
			this.api.newRequest(
				"GET",
				"/api/OverviewApi/getUserPerson?_=" + new Date().getTime(),
				{}
			).send().then(result => {
				try{
					let parsed = JSON.parse(result.data);
					resolve(new HeromaPerson(parsed.PersonRef, parsed.FirstName, parsed.LastName, parsed.Ssn, parsed.Idnr));
				}catch(e){
					reject(e);
				}
			}, reject);
		});
	}

	/**
	 * Get Heroma salary user.
	 * @param {HeromaPerson} person a person
	 * @return {Promise<HeromaSalaryPerson>} a promise resolving to a HeromaSalaryPerson containing complete salary user information
	 */
	getSalaryPerson(person){
		return new Promise((resolve, reject) => {
			this.api.newRequest(
				"GET",
				"/api/SalaryCalculationResultApi/GetPerson?piPersonRef=" + person.getPersonRef() + "&_=" + new Date().getTime(),
				{}
			).send().then(result => {
				try{
					let parsed = JSON.parse(result.data);
					resolve(new HeromaSalaryPerson(parsed));
				}catch(e){
					reject(e);
				}
			}, reject);
		});
	}

	/**
	 * Get salary summary.
	 * @param {HeromaSalaryPerson} person your Heroma person
	 * @param {string} month the month for which to fetch salary information, e.g. "2024-09"
	 * @return {Promise<HeromaSalarySummary>} a promise resolving to a HeromaSalarySummary containg basic salary information
	 */
	getSalarySummary(person, month){
		return new Promise((resolve, reject) => {
			let periodstr = month + "-01T00%3A00%3A00.000Z";

			this.api.newRequest(
				"GET",
				"/api/SalaryCalculationResultApi/GetGrundGeneral?piPersonRef=" + person.getPersonRef() + "&piIdnr=" + person.getIdnr() + "&piPeriod=" + periodstr + "&piAggregatedResult=false&_=" + new Date().getTime(),
				{}
			).send().then(result => {
				try{
					let parsed = JSON.parse(result.data);
					resolve(new HeromaSalarySummary(parsed));
				}catch(e){
					reject(e);
				}
			}, reject);
		});
	}

	/**
	 * Get salary details.
	 * @param {HeromaSalaryPerson} person your Heroma person
	 * @param {Date} month the month and year for which to fetch salary information, e.g. "2024-09" (September 2024)
	 * @return {Promise<HeromaSalaryDetails>} a promise resolving to a HeromaSalaryDetails containing detailed salary information
	 */
	getSalaryDetails(person, month){
		return new Promise((resolve, reject) => {
			let periodstr = month + "-01T00%3A00%3A00.000Z";

			this.api.newRequest(
				"GET",
				"/api/SalaryCalculationResultApi/GetGrunddetalj?piPersonRef=" + person.getPersonRef() + "&piIdnr=" + person.getIdnr() + "&piPeriod=" + periodstr + "&piAggregatedResult=false&piOptions=" + salary_details_options + "&_=" + new Date().getTime(),
				{}
			).send().then(result => {
				try{
					let parsed = JSON.parse(result.data);
					resolve(new HeromaSalaryDetails(parsed));
				}catch(e){
					reject(e);
				}
			}, reject);
		});
	}
}

module.exports = Heroma;