class HeromaCalendar{
	static HeromaCalendarDay = class HeromaCalendarDay{
		static HeromaCalendarShift = class HeromaCalendarShift{
			constructor(data, date){
				this._d = data;
				this._date = date;
			}

			getDescription(){
				return this._d.Description;
			}

			isNightShift(){
				return this._d.IsNightShift;
			}

			getBeginTime(){
				return new Date(this._date + " " + [this._d.FromHour,this._d.FromMinute].map(x=>("0" + x.toString()).slice(-2)).join(":"));
			}

			getEndTime(){
				return new Date(this._date + " " + [this._d.ToHour,this._d.ToMinute].map(x=>("0" + x.toString()).slice(-2)).join(":"));
			}
		};

		constructor(data){
			this._d = data;
		}

		getDate(){
			return this._d.Date;
		}

		isWorkDay(){
			return this._d.Workhours && this._d.workhours.length > 0;
		}

		isDayOff(){
			return !this.isWorkDay();
		}

		getWorkHours(){
			return this._d.Workhours.map(shift => new HeromaCalendar.HeromaCalendarDay.HeromaCalendarShift(shift, this.getDate()));
		}
	}

	constructor(calendar_data){
		this.days = {};
		calendar_data.WorkContainer.forEach(day=>{
			this.days[day.Date] = new HeromaCalendar.HeromaCalendarDay(day);
		});
	}

	getDay(year, month, day){
		let data = this.days[year + "-" + month + "-" + day];
		if(!data){
			throw new Error("Unknown date.");
		}
		return data;
	}
};

module.exports = HeromaCalendar;