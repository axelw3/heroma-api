class HeromaEmploymentHistory{
	static HeromaEmploymentHistoryEntry = class HeromaEmploymentHistoryEntry{
		constructor(data){
			this.employmentId = data.EmploymenytId; // sic
			this.begin = new Date(data.From);
			this.end = new Date(data.To);
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
			return new Date().getTime() > this.getEndTime();
		}

		getId(){
			return this.employmentId;
		}

		getBegin(){
			return new Date(this.begin);
		}

		getBeginTime(){
			return this.begin.getTime();
		}

		getEnd(){
			return new Date(this.end);
		}

		getEndTime(){
			return this.end.getTime();
		}

		getCategory(){
			return this.category;
		}

		getDegree(){
			return this.degree;
		}

		getSalary(){
			return this.salary;
		}

		getTitle(){
			return this.title;
		}
	}

	constructor(data){
		this.items = data.data.map(x=>new HeromaEmploymentHistory.HeromaEmploymentHistoryEntry(x));
	}

	getCurrent(){
		let time = new Date().getTime();
		return this.items.filter(item=>{
			return item.getBeginTime() <= time && item.getEndTime() > time;
		});
	}

	all(){
		return this.items;
	}
}

module.exports = HeromaEmploymentHistory;