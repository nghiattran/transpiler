const crypto = require('crypto');

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

export class PolyfillBaseObject {
    private hashCode : string;
    private static counter : number = 0;
	constructor() {
        // let string = Date.now().toString() + PolyfillBaseObject.counter++;
        // console.log(string);
        // this.hashCode = crypto.createHash('md5')
        //                       .update(string)
        //                       .digest('hex');
        // console.log(this.hashCode);

        this.hashCode = Date.now().toString() + PolyfillBaseObject.counter++;
    }

    public getHash() : string {
        return this.hashCode;
    }
}