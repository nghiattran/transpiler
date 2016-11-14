"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PascalScanner_1 = require('../language/pascal/PascalScanner');
var PascalParserTD_1 = require('../language/pascal/PascalParserTD');
var Compiler_1 = require('../Compiler');
var Pascal = (function (_super) {
    __extends(Pascal, _super);
    function Pascal() {
        _super.call(this, 'Pascal');
        this.scanner = new PascalScanner_1.PascalScanner();
        this.parser = new PascalParserTD_1.PascalParserTD(this.scanner);
    }
    return Pascal;
}(Compiler_1.Compiler));
exports.Pascal = Pascal;
//# sourceMappingURL=Pascal.js.map