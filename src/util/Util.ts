export class Util {
	static isInteger(value) : boolean{
	   return typeof value === "number" && 
	   		isFinite(value) &&  
	   		Math.floor(value) === value;
	}

	static isFloat(value) : boolean{
	   return typeof value === "number" && 
	   		isFinite(value)
	}

	static isNumber(value) : boolean{
	   return typeof value === 'number'
	}
}