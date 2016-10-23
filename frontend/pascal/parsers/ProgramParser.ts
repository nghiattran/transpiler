import {DeclarationsParser} from './DeclarationsParser';

import {PascalParserTD} from '../PascalParserTD';

import {List} from '../../../util/List';

export class ProgramParser extends DeclarationsParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParserTD) {
        super(parent);
    }

    // Synchronization set to start a program.
    static PROGRAM_START_SET : List = new List([PROGRAM, SEMICOLON]);
    // static {
    //     PROGRAM_START_SET.addAll(DeclarationsParser.DECLARATION_START_SET);
    // }

    static initialize() : void {

    }

    /**
     * Parse a program.
     * @param token the initial token.
     * @param parentId the symbol table entry of the parent routine's name.
     * @return null
     * @throws Exception if an error occurred.
     */
    public parse(token : Token, parentId : SymTabEntry) : SymTabEntry {
        token = this.synchronize(PROGRAM_START_SET);

        // Parse the program.
        let routineParser : DeclaredRoutineParser = new DeclaredRoutineParser(this);
        routineParser.parse(token, parentId);

        // Look for the final period.
        token = this.currentToken();
        if (token.getType() != DOT) {
            ProgramParser.errorHandler.flag(token, MISSING_PERIOD, this);
        }

        return null;
    }
}


export module ProgramParser {
    ProgramParser.initialize();
}