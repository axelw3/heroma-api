const https = require("https");

class HeromaAPICall{
	constructor(api_core, method, endpoint, headers={}){
		this._core = api_core;
		this.http_options = {
			host: api_core.host,
			port: 443,
			path: api_core.path + endpoint,
			headers: Object.assign(
				{
					"X-Requested-With": "XMLHttpRequest",
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0"
				},
				{"Cookie": api_core._getCookiesString()},
				headers
			),
			method: method
		};
		this.data = null;
	}

	body(data){
		if(this.http_options.method === "POST"){
			this.data = data;
		}
		return this;
	}

	send(){
		return new Promise((resolve, reject)=>{
			let request = https.request(this.http_options, res=>{
				let txt="";
				res.on("data", chunk=>{
					txt += chunk;
				});
				
				res.on("close", ()=>{
					let setCookies = res.headers["set-cookie"];
					if(setCookies && setCookies.forEach){
						setCookies.forEach(raw=>{
							let one = raw.split(/;\s*/g);
							let cookie = {
								data:one[0],
								path:"/",
								expires:-1
							};
							one.slice(1).forEach(field=>{
								let parts = field.split(/=/);
								if(parts[0] === "expires"){
									cookie.expires = new Date(parts[1]).getTime();
									return;
								}
								if(parts[0] === "path"){
									cookie.path = parts[1];
									return;
								}
							});
							this._core._setCookie(cookie);
						});
					}
					resolve({data:txt, headers:res.headers});
				});
				
			});
			
			request.on("error", ()=>{
				reject();
			});
			
			if(this.data){
				request.write(this.data);
			}
			
			request.end();
		});
	}
};

class HeromaAPICore{
	static getHiddenInputValue(html, input_id){
		let regex = new RegExp("<input\\s[^>]*name\\s*=\\s*[\"']" + input_id + "[\"'][^>]*>","i");
		let rvti = regex.exec(html);
		if(rvti && rvti[0]){
			let inputValue = rvti[0].match(/value\s*=\s*["']([^"']+)["']/i)[1];
			return inputValue;
		}
		return null;
	}

	constructor(host, basepath){
		this.host = host;
		this.path = basepath;
		this.cookies = {};
	}
	
	clearCookies(){
		this.cookies = {};
	}

	_setCookie(cookie){
		if(cookie && cookie.data){
			cookie.name = cookie.data.split(/=/)[0];
			this.cookies[cookie.name] = cookie;
		}
	}

	_getCookiesString(){
		return Object.values(this.cookies).filter(cookie=>{
			if(cookie.expires < 0 || cookie.expires > new Date().getTime()){
				return true;
			}

			delete this.cookies[cookie.name];

			return false;
		}).map(cookie=>cookie.data).join("; ");
	}

	newRequest(method, endpoint, headers){
		return new HeromaAPICall(this, method, endpoint, headers);
	}
}

class HeromaPerson{
	constructor(id, firstName, lastName, personnr, idnr){
		this.id = id; // personRef
		this.firstName = firstName;
		this.lastName = lastName;
		this.personNr = personnr;
		this.idnr = idnr;
	}
	getFirstName(){
		return this.firstName;
	}
	getLastName(){
		return this.lastName;
	}
	getId(){
		return this.id;
	}
	getPersonRef(){
		return this.id;
	}
	getPersonNr(){
		return this.personNr;
	}
	getSsn(){
		return this.personNr;
	}
	getIdnr(){
		return this.idnr;
	}
}

module.exports = { HeromaAPICore, HeromaPerson };