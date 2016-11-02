import {DeclarationsParser} from './DeclarationsParser';
import {DeclaredRoutineParser} from './DeclaredRoutineParser';

import {PascalParserTD} from '../PascalParserTD';
import {PascalTokenType} from '../PascalTokenType';
import {PascalErrorCode} from '../PascalErrorCode';

import {List} from '../../../util/List';
import {Token} from '../../Token';

import {SymTabEntry} from '../../../intermediate/SymTabEntry';
    
export class ProgramParser extends DeclarationsParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParserTD) {
        super(parent);
    }

    // Synchronization set to start a program.
    static PROGRAM_START_SET : List<PascalTokenType> = 
        new List([
            PascalTokenType.PROGRAM, 
            PascalTokenType.SEMICOLON]);

    static initialize() : void {
        ProgramParser.PROGRAM_START_SET.addAll(DeclarationsParser.DECLARATION_START_SET);
    }

    /**
     * Parse a program.
     * @param token the initial token.
     * @param parentId the symbol table entry of the parent routine's name.
     * @return null
     * @throws Exception if an error occurred.
     */
    public parse(token : Token, parentId : SymTabEntry) : SymTabEntry {
        token = this.synchronize(ProgramParser.PROGRAM_START_SET);

        // Parse the program.
        let routineParser : DeclaredRoutineParser = new DeclaredRoutineParser(this);
        routineParser.parse(token, parentId);

        // Look for the final period.
        token = this.currentToken();
        if (token.getType() != PascalTokenType.DOT) {
            ProgramParser.errorHandler.flag(token, PascalErrorCode.MISSING_PERIOD, this);
        }

        return null;
    }
}


export module ProgramParser {
    ProgramParser.initialize();
}