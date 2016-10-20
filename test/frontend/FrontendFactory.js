"use strict";
var PascalParserTD_1 = require('./pascal/PascalParserTD');
var PascalScanner_1 = require('./pascal/PascalScanner');
var FrontendFactory = (function () {
    function FrontendFactory() {
    }
    /**
     * Create a parser.
     * @param language the name of the source language (e.g., "Pascal").
     * @param type the type of parser (e.g., "top-down").
     * @param source the source object.
     * @return the parser.
     * @throws Exception if an error occurred.
     */
    FrontendFactory.createParser = function (language, type, source) {
        if (language.toUpperCase() === "Pascal".toUpperCase() &&
            type.toUpperCase() === "top-down".toUpperCase()) {
            var scanner = new PascalScanner_1.PascalScanner(source);
            return new PascalParserTD_1.PascalParserTD(scanner);
        }
        else if (language.toUpperCase() !== "Pascal".toUpperCase()) {
            throw new Error("Parser factory: Invalid language '" +
                language + "'");
        }
        else {
            throw new Error("Parser factory: Invalid type '" +
                type + "'");
        }
    };
    return FrontendFactory;
}());
exports.FrontendFactory = FrontendFactory;
