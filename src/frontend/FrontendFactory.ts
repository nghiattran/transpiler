import {PascalParserTD} from './pascal/PascalParserTD';
import {PascalScanner} from './pascal/PascalScanner';

import {Source} from './Source';
import {Scanner} from './Scanner';

export class FrontendFactory {
    /**
     * Create a parser.
     * @param language the name of the source language (e.g., "Pascal").
     * @param type the type of parser (e.g., "top-down").
     * @param source the source object.
     * @return the parser.
     * @throws Exception if an error occurred.
     */
    static createParser(language : string, type: string, source: Source)
    {
        if (language.toUpperCase() === "Pascal".toUpperCase() &&
            type.toUpperCase() === "top-down".toUpperCase())
        {
            var scanner = new PascalScanner(source);
            return new PascalParserTD(scanner);
        } else if (language.toUpperCase() !== "Pascal".toUpperCase()) {
            throw new Error("Parser factory: Invalid language '" +
                                language + "'");
        } else {
            throw new Error("Parser factory: Invalid type '" +
                                type + "'");
        }
    }
}
