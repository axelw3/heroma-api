const { HeromaAPICore } = require("./core.js");
const HeromaCalendar = require("./src/calendar.js");
const HeromaWorkSchedule = require("./src/workschedule.js");

class Heroma{
	constructor(host, path){
		this.api = new HeromaAPICore(host, path);
		this.user = {};
	}

	login(username, pass){
		return new Promise((resolve, reject)=>{
			// (1) GET:
			this.api.newRequest(
				"GET",
				"/Account/Login",
				{}
			).send().then(result=>{
				let requestVerificationToken = HeromaAPICore.extractRequestVerificationToken(result.data);
				if(requestVerificationToken){
					this.api.newRequest(
						"POST",
						"/Account/Login",
						{"Content-Type":"application/x-www-form-urlencoded"}
					)
					.body("__RequestVerificationToken=" + requestVerificationToken + "&Username=" + encodeURIComponent(username) + "&Password=" + encodeURIComponent(pass) + "&LoginType=FormLogin")
					.send().then(()=>{
						this.user = {
							name: username,
							pw: pass
						};

						resolve();
					}, reject);
				}
			}, reject);
		});
	}

	logout(){
		this.user = {};
	}

	getCalendarData(begin="2024-09-29", end="2024-11-10"){
		return new Promise((resolve, reject)=>{
			let piGetData = {
				"EndWork":end,
				"StartWork":begin,
				"TeamData":[],
				"TeamRefsForDefaultData":[]
			};
			this.api.newRequest(
				"GET",
				"/api/APCalendarApi/getCalendarData?piGetData=" + encodeURIComponent(JSON.stringify(piGetData)) + "&_=" + new Date().getTime(),
				{}
			).send().then(result=>{
				try{
					let parsed = JSON.parse(result.data);
					resolve(new HeromaCalendar(parsed));
				}catch(e){
					reject(e);
				}
			}, reject);
		});
	}

	getWorkSchedule(begin="2024-10-06", end="2024-10-14"){
		return new Promise((resolve, reject)=>{
			this.api.newRequest(
				"GET",
				"/WSV/MyWorkSchedule",
				{}
			).send().then(result=>{
				let requestVerificationToken = HeromaAPICore.extractRequestVerificationToken(result.data);
				if(requestVerificationToken){
					this.api.newRequest(
						"POST",
						"/api/MyWorkScheduleApi/GetData",
						{"Content-Type":"application/x-www-form-urlencoded"}
					).body("Tab=1&Start=" + begin + "&Stop=" + end + "&__RequestVerificationToken=" + requestVerificationToken).send().then(result=>{
						try{
							let parsed = JSON.parse(result.data);
							resolve(new HeromaWorkSchedule(parsed));
						}catch(e){
							reject(e);
						}
					}, reject);
				}
			});
			
		});
	}
}


module.exports = Heroma;