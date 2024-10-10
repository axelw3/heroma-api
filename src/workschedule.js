/**
 * A work schedule.
 */
class HeromaWorkSchedule{
	/**
	 * A collection of Heroma work schedule users.
	 */
	static HeromaWorkSchedulePeople = class HeromaWorkSchedulePeople{
		constructor(data){
			this.persons = {};
			data.forEach(personobj=>{
				let person=new HeromaWorkSchedule.HeromaWorkSchedulePerson(personobj);
				this.persons[person.id] = person;
			});
		}

		/**
		 * Find a person by their id.
		 * @param {string} id user id
		 * @return {HeromaWorkSchedule.HeromaWorkSchedulePerson} a person
		 */
		byId(id){
			return this.persons[id] || null;
		}

		/**
		 * Find a person by name.
		 * @param {string} firstname first name
		 * @param {string} lastname last name (surname)
		 * @return {HeromaWorkSchedule.HeromaWorkSchedulePerson} a person
		 */
		byName(firstname, lastname){
			for(let person of Object.values(this.persons)){
				if(person.firstName === firstname && person.lastName === lastname){
					return person;
				}
			}
			return null;
		}

		/**
		 * Get all persons.
		 * @return {Array} an array of {HeromaWorkSchedule.HeromaWorkSchedulePerson}
		 */
		all(){
			return Object.values(this.persons);
		}
	}

	static HeromaWorkScheduleShifts = class HeromaWorkScheduleShifts{
		constructor(daydata, activity_data){
			this.days = {};
			this.activitydata = {};
			
			activity_data.forEach(activity=>{
				this.activitydata[activity.ActivityId] = activity;
			});

			daydata.forEach(day=>{
				this.days[day.DateString] = day;
			});
		}

		/**
		 * Get shift activity details.
		 * @param {HeromaWorkSchedule.HeromaWorkScheduleShift} shift a shift
		 * @return {Object} shift activity details
		 */
		getShiftActivityDetails(shift){
			return this.activitydata[shift.shiftActivityId];
		}

		/**
		 * Get shifts by person.
		 * @param {HeromaWorkSchedule.HeromaWorkSchedulePerson} person a person
		 * @return {Array} an array of {HeromaWorkSchedule.HeromaWorkScheduleShift}
		 */
		byPerson(person){
			let shifts = [];
			Object.values(this.days).forEach(day=>{
				day.Activity.forEach(shift=>{
					if(shift.PersonId === person.getId()){
						shifts.push(new HeromaWorkSchedule.HeromaWorkScheduleShift(shift));
					}
				});
			});
			return shifts;
		}

		/**
		 * Get shifts by date.
		 * @param {string} date a date string in the format YYYY-MM-DD
		 * @return {Array} an array of {HeromaWorkSchedule.HeromaWorkScheduleShift}
		 */
		byDate(date){
			let day = this.days[date];
			return day || null;
		}

		/**
		 * Find shifts by activity id.
		 * @param {string} an activity id
		 * @return {Array} an array of {HeromaWorkSchedule.HeromaWorkScheduleShift}
		 */
		byShiftActivity(shiftActivityId){
			let shifts = [];
			Object.values(this.days).forEach(day=>{
				day.Activity.forEach(shift=>{
					if(shift.ObjectId === shiftActivityId){
						shifts.push(new HeromaWorkSchedule.HeromaWorkScheduleShift(shift));
					}
				});
			});
			return shifts;
		}
	}

	/**
	 * A Heroma work schedule user.
	 */
	static HeromaWorkSchedulePerson = class HeromaWorkSchedulePerson{
		constructor(data){
			this.group = data.Group;
			this.id = data.PersonId;
			this.isHeromaPerson = data.IsHeromaPerson;
			this.personAPIds = data.PersonAPIds;
			this.teams = data.Teams;
			this.firstName = data.FirstName;
			this.lastName = data.LastName;
			this.shortName = data.Short; // ?
			this.hasWritePermission = data.HasWritePermission;
			this.cell = data.CellPhone;
			this.phone = data.Phone;
			this.email = data.Email;
			this.tags = data.Tags;
		}
		getId(){
			return this.id;
		}
	}

	/**
	 * A work shift.
	 */
	static HeromaWorkScheduleShift = class HeromaWorkScheduleShift{
		constructor(data){
			this.personId = data.PersonId;
			this.date = data.BelongsToDate;
			this.beginTime = new Date(new Date(this.date + " 00:00").getTime() + data.Start * 60000);
			this.endTime = new Date(new Date(this.date + " 00:00").getTime() + data.Stop * 60000);
			this.breakMinutes = data.Break;
			this.shiftActivityId = data.ObjectId;
		}
	}

	constructor(data){
		this.persons = new HeromaWorkSchedule.HeromaWorkSchedulePeople(data.PersonData);
		this.shifts = new HeromaWorkSchedule.HeromaWorkScheduleShifts(data.DayData, data.ActivityData);
	}

	/**
	 * Find all people on this schedule.
	 * @return {HeromaWorkSchedule.HeromaWorkSchedulePeople} users on this schedule
	 */
	getPeople(){
		return this.persons;
	}

	/**
	 * Get a searchable collection of shifts on this schedule.
	 * @return {HeromaWorkSchedule.HeromaWorkScheduleShifts} a collection of shifts on this schedule
	 */
	getShifts(){
		return this.shifts;
	}
}

module.exports = HeromaWorkSchedule;