class HeromaStamplingar{
	static HeromaStampling = class HeromaStampling{
		constructor(data){
			this.type = {
				id: data.Type,
				name: data.TypeName,
				origin: data.Origin
			};
			this.time = new Date(data.Date + " " + data.Time);
			this.originTime = new Date(data.OriginDate);
			this.adjusted = this.time.getTime() != this.originTime.getTime();
		}
	}

	constructor(data){
		this.stamplingar = data.map(x=>new HeromaStamplingar.HeromaStampling(x));
	}

	all(onlyAdjusted=false){
		if(!onlyAdjusted){
			return this.stamplingar;
		}

		return this.all(false).filter(x=>x.adjusted);
	}

	allAdjusted(){
		return this.all(true);
	}

	byOrigin(origin, onlyAdjusted=false){
		return this.all(onlyAdjusted).filter(x=>x.type.origin === origin);
	}

	byType(type, onlyAdjusted){
		return this.all(onlyAdjusted).filter(x=>x.type.id === type);
	}

	byTypeName(typeName, onlyAdjusted){
		return this.all(onlyAdjusted).filter(x=>x.type.name === typeName);
	}
}

module.exports = HeromaStamplingar;