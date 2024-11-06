const Day = require("./day.js");

class HeromaEmploymentHistory{
	static HeromaEmploymentHistoryEntry = class HeromaEmploymentHistoryEntry{
		constructor(data){
			this.employmentId = data.EmploymenytId; // sic
			this.begin = Day.fromString(data.From);
			this.end = Day.fromString(data.To);
			this.category = data.EmploymentCategory;
			this.type = data.EmploymentType;
			this.degree = data.EmploymentDegree;
			this.salary = data.EmploymentSalary;
			this.salarySupplement = data.SalarySupplement;
			this.title = data.EmploymentTitle;
			this.newSalaryFrom = new Date(data.NewSalaryFrom);
			this.employment = data.Employment;
			this.employmentList = data.EmploymentList;
		}

		hasEnded(){
			return this.end.after(Day.todayUTC());
		}

		getId(){
			return this.employmentId;
		}

		getBegin(){
			return this.begin.copy();
		}

		/**
		 * @deprecated use {@link getBegin}
		 */
		getBeginTime(){
			return new Date(this.begin.toString()).getTime();
		}

		getEnd(){
			return this.end.copy();
		}

		/**
		 * @deprecated use {@link getEnd}
		 */
		getEndTime(){
			return new Date(this.end.toString()).getTime();
		}

		getCategory(){
			return this.category;
		}

		getDegree(){
			return this.degree;
		}

		/**
		 * Get monthly salary. For part-time or by-the-hour employments,
		 * the returned value is the full-time equivalent.
		 * @returns {number} monthly salary
		 */
		getSalary(){
			return this.salary;
		}

		getTitle(){
			return this.title;
		}
	}

	constructor(data){
		this.items = data.data.map(x => new HeromaEmploymentHistory.HeromaEmploymentHistoryEntry(x));
	}

	/**
	 * Get active employment history entries.
	 * @returns {Array<HeromaEmploymentHistory.HeromaEmploymentHistoryEntry>}
	 */
	getCurrent(){
		return this.items.filter(item => !item.hasEnded());
	}

	/**
	 * Get all employment history entries.
	 * @returns {Array<HeromaEmploymentHistory.HeromaEmploymentHistoryEntry>} all employments
	 */
	all(){
		return this.items;
	}
}

module.exports = HeromaEmploymentHistory;