export class Util {
	static isInteger(value) : boolean{
	   return Util.isFloat(value) &&
	   		Math.floor(value) === value;
	}

	static isFloat(value) : boolean{
	   return Util.isNumber(value) && 
	   		isFinite(value);
	}

	static isNumber(value) : boolean{
	   return typeof value === 'number';
	}

	public static isDigit(n) : boolean {
	  return !isNaN(parseFloat(n)) && isFinite(n) && n.length === 1;
	}

	public static isLetter(char) : boolean {
	    return /^[a-zA-Z]/.test(char) && char.length === 1;
	}

	public static isLetterOrDigit(char) {
	    return Util.isDigit(char) || Util.isLetter(char);
	}

	public static getNumericValue(aString) : number {
	    return Number(aString)
	}
}