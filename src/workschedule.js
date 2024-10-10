class HeromaWorkSchedule{
	static HeromaWorkSchedulePeople = class HeromaWorkSchedulePeople{
		constructor(data){
			this.persons = {};
			data.forEach(personobj=>{
				let person=new HeromaWorkSchedule.HeromaWorkSchedulePerson(personobj);
				this.persons[person.id] = person;
			});
		}

		byId(id){
			return this.persons[id] || null;
		}

		byName(firstname, lastname){
			for(let person of Object.values(this.persons)){
				if(person.firstName === firstname && person.lastName === lastname){
					return person;
				}
			}
			return null;
		}

		all(){
			return Object.values(this.persons);
		}
	}

	static HeromaWorkScheduleShifts = class HeromaWorkScheduleShifts{
		constructor(daydata, activitydata){
			this.days = {};
			this.activitydata = {};
			
			activitydata.forEach(activity=>{
				this.activitydata[activity.ActivityId] = activity;
			});

			daydata.forEach(day=>{
				this.days[day.DateString] = day;
			});
		}

		getShiftActivityDetails(shift){
			return this.activitydata[shift.shiftActivityId];
		}

		byPerson(person){
			let shifts = [];
			Object.values(this.days).forEach(day=>{
				day.Activity.forEach(shift=>{
					if(shift.PersonId === person.id){
						shifts.push(new HeromaWorkSchedule.HeromaWorkScheduleShift(shift));
					}
				});
			});
			return shifts;
		}

		byDate(date){
			let day = this.days[date];
			return day || null;
		}

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
	}
	
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
		//this._d = data;
		this.persons = new HeromaWorkSchedule.HeromaWorkSchedulePeople(data.PersonData);
		this.shifts = new HeromaWorkSchedule.HeromaWorkScheduleShifts(data.DayData, data.ActivityData);
	}

	getPeople(){
		return this.persons;
	}

	getShifts(){
		return this.shifts;
	}
}

module.exports = HeromaWorkSchedule;