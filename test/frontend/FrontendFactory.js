"use strict";
var PascalParserTDlocation_1 = require("PascalParserTDlocation");
var PascalScannerlocation_1 = require("PascalScannerlocation");
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
            var scanner = new PascalScannerlocation_1["default"](source);
            return new PascalParserTDlocation_1["default"](scanner);
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
