import {PascalParserTD} from '../PascalParserTD';
import {PascalTokenType} from '../PascalTokenType';
import {PascalErrorCode} from '../PascalErrorCode';

import {DeclarationsParser} from './DeclarationsParser';
import {VariableDeclarationsParser} from './VariableDeclarationsParser';
import {BlockParser} from './BlockParser';

import {Token} from '../../Token';
import {TokenType} from '../../TokenType';

import {Definition} from '../../../intermediate/Definition';
import {SymTabEntry} from '../../../intermediate/SymTabEntry';
import {SymTab} from '../../../intermediate/SymTab';
import {ICode} from '../../../intermediate/ICode';
import {ICodeNode} from '../../../intermediate/ICodeNode';
import {TypeForm} from '../../../intermediate/TypeForm';
import {TypeSpec} from '../../../intermediate/TypeSpec';
import {ICodeFactory} from '../../../intermediate/ICodeFactory';

import {DefinitionImpl} from '../../../intermediate/symtabimpl/DefinitionImpl';
import {Predefined} from '../../../intermediate/symtabimpl/Predefined';
import {SymTabKeyImpl} from '../../../intermediate/symtabimpl/SymTabKeyImpl';
import {RoutineCodeImpl} from '../../../intermediate/symtabimpl/RoutineCodeImpl';

import {TypeFormImpl} from '../../../intermediate/typeimpl/TypeFormImpl';

import {List} from '../../../util/List';

var util = require('util');

export class DeclaredRoutineParser extends DeclarationsParser {
    // Synchronization set for a formal parameter sublist.
    private static PARAMETER_SET : List<PascalTokenType> =
        DeclarationsParser.DECLARATION_START_SET.clone();
    

    // Synchronization set for the opening left parenthesis.
    private static LEFT_PAREN_SET : List<PascalTokenType> =
        DeclarationsParser.DECLARATION_START_SET.clone();

    // Synchronization set for the closing right parenthesis.
    private static RIGHT_PAREN_SET : List<PascalTokenType> =
        DeclaredRoutineParser.LEFT_PAREN_SET.clone();

    // Synchronization set to follow a formal parameter identifier.
    private static PARAMETER_FOLLOW_SET : List<PascalTokenType> =
        new List([
            PascalTokenType.COLON, 
            PascalTokenType.RIGHT_PAREN, 
            PascalTokenType.SEMICOLON]);

    // Synchronization set for the , token.
    private static COMMA_SET : List<PascalTokenType> =
        new List([
            PascalTokenType.COMMA, 
            PascalTokenType.COLON, 
            PascalTokenType.IDENTIFIER, 
            PascalTokenType.RIGHT_PAREN, 
            PascalTokenType.SEMICOLON]);

    static initialize() : void{
        DeclaredRoutineParser.PARAMETER_SET.add(PascalTokenType.VAR);
        DeclaredRoutineParser.PARAMETER_SET.add(PascalTokenType.IDENTIFIER);
        DeclaredRoutineParser.PARAMETER_SET.add(PascalTokenType.RIGHT_PAREN);
        
        DeclaredRoutineParser.LEFT_PAREN_SET.add(PascalTokenType.LEFT_PAREN);
        DeclaredRoutineParser.LEFT_PAREN_SET.add(PascalTokenType.SEMICOLON);
        DeclaredRoutineParser.LEFT_PAREN_SET.add(PascalTokenType.COLON);
        
        DeclaredRoutineParser.RIGHT_PAREN_SET.remove(PascalTokenType.LEFT_PAREN);
        DeclaredRoutineParser.RIGHT_PAREN_SET.add(PascalTokenType.RIGHT_PAREN);
        
        DeclaredRoutineParser.PARAMETER_FOLLOW_SET.addAll(DeclarationsParser.DECLARATION_START_SET);
    
        DeclaredRoutineParser.COMMA_SET.addAll(DeclarationsParser.DECLARATION_START_SET);
    }

    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParserTD) {
        super(parent);
    }

    private static dummyCounter : number = 0;  // counter for dummy routine names

    /**
     * Parse a standard subroutine declaration.
     * @param token the initial token.
     * @param parentId the symbol table entry of the parent routine's name.
     * @return the symbol table entry of the declared routine's name.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token, parentId : SymTabEntry) : SymTabEntry {
        let routineDefn : Definition = null;
        let dummyName : string = null;
        let routineId : SymTabEntry = null;
        let routineType : TokenType = token.getType();

        // Initialize.
        switch (<PascalTokenType> routineType) {

            case PascalTokenType.PROGRAM: {
                token = this.nextToken();  // consume PROGRAM
                routineDefn = DefinitionImpl.PROGRAM;
                dummyName = "DummyProgramName".toLowerCase();
                break;
            }

            case PascalTokenType.PROCEDURE: {
                token = this.nextToken();  // consume PROCEDURE
                routineDefn = DefinitionImpl.PROCEDURE;
                dummyName = "DummyProcedureName_".toLowerCase() +
                            util.format("%03d", ++DeclaredRoutineParser.dummyCounter);
                break;
            }

            case PascalTokenType.FUNCTION: {
                token = this.nextToken();  // consume FUNCTION
                routineDefn = DefinitionImpl.FUNCTION;
                dummyName = "DummyFunctionName_".toLowerCase() +
                            util.format("%03d", ++DeclaredRoutineParser.dummyCounter);
                break;
            }

            default: {
                routineDefn = DefinitionImpl.PROGRAM;
                dummyName = "DummyProgramName".toLowerCase();
                break;
            }
        }

        // Parse the routine name.
        routineId = this.parseRoutineName(token, dummyName);
        routineId.setDefinition(routineDefn);

        token = this.currentToken();

        // Create new intermediate code for the routine.
        let iCode : ICode = ICodeFactory.createICode();
        routineId.setAttribute(SymTabKeyImpl.ROUTINE_ICODE, iCode);
        routineId.setAttribute(SymTabKeyImpl.ROUTINE_ROUTINES, new List());

        // Push the routine's new symbol table onto the stack.
        // If it was forwarded, push its existing symbol table.
        if (routineId.getAttribute(SymTabKeyImpl.ROUTINE_CODE) == RoutineCodeImpl.FORWARD) {
            let symTab : SymTab = <SymTab> routineId.getAttribute(SymTabKeyImpl.ROUTINE_SYMTAB);
            DeclaredRoutineParser.symTabStack.push(symTab);
        }
        else {
            routineId.setAttribute(SymTabKeyImpl.ROUTINE_SYMTAB, DeclaredRoutineParser.symTabStack.push());
        }

        // Program: Set the program identifier in the symbol table stack.
        // Set the initial local variables array slot number to 1.
        if (routineDefn == DefinitionImpl.PROGRAM) {
            DeclaredRoutineParser.symTabStack.setProgramId(routineId);
            DeclaredRoutineParser.symTabStack.getLocalSymTab().nextSlotNumber();  // bump slot number
        }

        // Non-forwarded procedure or function: Append to the parent's list
        //                                      of routines.
        else if (routineId.getAttribute(SymTabKeyImpl.ROUTINE_CODE) != RoutineCodeImpl.FORWARD) {
            let subroutines : List<SymTabEntry> = <List<SymTabEntry>>
                                       parentId.getAttribute(SymTabKeyImpl.ROUTINE_ROUTINES);
            subroutines.add(routineId);
        }

        // If the routine was forwarded, there should not be
        // any formal parameters or a function return type.
        // But parse them anyway if they're there.
        if (routineId.getAttribute(SymTabKeyImpl.ROUTINE_CODE) == RoutineCodeImpl.FORWARD) {
            if (token.getType() != PascalTokenType.SEMICOLON) {
                DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode.ALREADY_FORWARDED, this);
                this.parseHeader(token, routineId);
            }
        }

        // Parse the routine's formal parameters and function return type.
        else {
            this.parseHeader(token, routineId);
        }

        // Look for the semicolon.
        token = this.currentToken();
        if (token.getType() == PascalTokenType.SEMICOLON) {
            do {
                token = this.nextToken();  // consume ;
            } while (token.getType() == PascalTokenType.SEMICOLON);
        }
        else {
            DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode.MISSING_SEMICOLON, this);
        }

        // Parse the routine's block or forward declaration.
        if ((token.getType() == PascalTokenType.IDENTIFIER) &&
            (token.getText().toLowerCase() == 'forward'))
        {
            token = this.nextToken();  // consume forward
            routineId.setAttribute(SymTabKeyImpl.ROUTINE_CODE, RoutineCodeImpl.FORWARD);
        }
        else {
            routineId.setAttribute(SymTabKeyImpl.ROUTINE_CODE, RoutineCodeImpl.DECLARED);

            let blockParser : BlockParser = new BlockParser(this);
            let rootNode : ICodeNode = blockParser.parse(token, routineId);
            iCode.setRoot(rootNode);
        }

        // Pop the routine's symbol table off the stack.
        DeclaredRoutineParser.symTabStack.pop();

        return routineId;
    }

    /**
     * Parse a routine's name.
     * @param token the current token.
     * @param routineDefn how the routine is defined.
     * @param dummyName a dummy name in case of parsing problem.
     * @return the symbol table entry of the declared routine's name.
     * @throws Exception if an error occurred.
     */
    private parseRoutineName(token : Token, dummyName : string) : SymTabEntry{
        let routineId : SymTabEntry = null;

        // Parse the routine name identifier.
        if (token.getType() == PascalTokenType.IDENTIFIER) {
            let routineName : string = token.getText().toLowerCase();
            routineId = DeclaredRoutineParser.symTabStack.lookupLocal(routineName);

            // Not already defined locally: Enter into the local symbol table.
            if (routineId == null) {
                routineId = DeclaredRoutineParser.symTabStack.enterLocal(routineName);
            }

            // If already defined, it should be a forward definition.
            else if (routineId.getAttribute(SymTabKeyImpl.ROUTINE_CODE) != RoutineCodeImpl.FORWARD) {
                routineId = null;
                DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_REDEFINED, this);
            }

            token = this.nextToken();  // consume routine name identifier
        }
        else {
            DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode.MISSING_IDENTIFIER, this);
        }

        // If necessary, create a dummy routine name symbol table entry.
        if (routineId == null) {
            routineId = DeclaredRoutineParser.symTabStack.enterLocal(dummyName);
        }

        return routineId;
    }

    /**
     * Parse a routine's formal parameter list and the function return type.
     * @param token the current token.
     * @param routineId the symbol table entry of the declared routine's name.
     * @throws Exception if an error occurred.
     */
    private parseHeader(token : Token, routineId : SymTabEntry) : void {
        // Parse the routine's formal parameters.
        this.parseFormalParameters(token, routineId);
        token = this.currentToken();

        // If this is a function, parse and set its return type.
        if (routineId.getDefinition() == DefinitionImpl.FUNCTION) {
            let variableDeclarationsParser : VariableDeclarationsParser=
                new VariableDeclarationsParser(this);
            variableDeclarationsParser.setDefinition(DefinitionImpl.FUNCTION);
            let type : TypeSpec = variableDeclarationsParser.parseTypeSpec(token);

            token = this.currentToken();

            // The return type cannot be an array or record.
            if (type != null) {
                let form : TypeForm = type.getForm();
                if ((form == TypeFormImpl.ARRAY) ||
                    (form == TypeFormImpl.RECORD))
                {
                    DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode.INVALID_TYPE, this);
                }
            }

            // Missing return type.
            else {
                type = Predefined.undefinedType;
            }

            routineId.setTypeSpec(type);
            token = this.currentToken();
        }
    }

    /**
     * Parse a routine's formal parameter list.
     * @param token the current token.
     * @param routineId the symbol table entry of the declared routine's name.
     * @throws Exception if an error occurred.
     */
    protected parseFormalParameters(token : Token, routineId : SymTabEntry) : void {
        // Parse the formal parameters if there is an opening left parenthesis.
        token = this.synchronize(DeclaredRoutineParser.LEFT_PAREN_SET);
        if (token.getType() == PascalTokenType.LEFT_PAREN) {
            token = this.nextToken();  // consume (

            let parms : List<SymTabEntry> = new List<SymTabEntry>();

            token = this.synchronize(DeclaredRoutineParser.PARAMETER_SET);
            let tokenType : TokenType = token.getType();

            // Loop to parse sublists of formal parameter declarations.
            while ((tokenType == PascalTokenType.IDENTIFIER) || (tokenType == PascalTokenType.VAR)) {
                parms.addAll(this.parseParmSublist(token, routineId));
                token = this.currentToken();
                tokenType = token.getType();
            }

            // Closing right parenthesis.
            if (token.getType() == PascalTokenType.RIGHT_PAREN) {
                token = this.nextToken();  // consume )
            }
            else {
                DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode.MISSING_RIGHT_PAREN, this);
            }

            routineId.setAttribute(SymTabKeyImpl.ROUTINE_PARMS, parms);
        }
    }

    /**
     * Parse a sublist of formal parameter declarations.
     * @param token the current token.
     * @param routineId the symbol table entry of the declared routine's name.
     * @return the sublist of symbol table entries for the parm identifiers.
     * @throws Exception if an error occurred.
     */
    private parseParmSublist(token : Token,
                            routineId : SymTabEntry) : List<SymTabEntry> {
        let isProgram : boolean = routineId.getDefinition() == DefinitionImpl.PROGRAM;
        let parmDefn : Definition = isProgram ? DefinitionImpl.PROGRAM_PARM : null;
        let tokenType : TokenType = token.getType();

        // VAR or value parameter?
        if (tokenType == PascalTokenType.VAR) {
            if (!isProgram) {
                parmDefn = DefinitionImpl.VAR_PARM;
            }
            else {
                DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode.INVALID_VAR_PARM, this);
            }

            token = this.nextToken();  // consume VAR
        }
        else if (!isProgram) {
            parmDefn = DefinitionImpl.VALUE_PARM;
        }

        // Parse the parameter sublist and its type specification.
        let variableDeclarationsParser : VariableDeclarationsParser =
            new VariableDeclarationsParser(this);
        variableDeclarationsParser.setDefinition(parmDefn);
        let sublist : List<SymTabEntry> =
            variableDeclarationsParser.parseIdentifierSublist(
                                           token, DeclaredRoutineParser.PARAMETER_FOLLOW_SET,
                                           DeclaredRoutineParser.COMMA_SET);
        token = this.currentToken();
        tokenType = token.getType();

        if (!isProgram) {

            // Look for one or more semicolons after a sublist.
            if (tokenType == PascalTokenType.SEMICOLON) {
                while (token.getType() == PascalTokenType.SEMICOLON) {
                    token = this.nextToken();  // consume the ;
                }
            }

            // If at the start of the next sublist, then missing a semicolon.
            else if (VariableDeclarationsParser.
                         NEXT_START_SET.contains(tokenType as PascalTokenType)) {
                DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode.MISSING_SEMICOLON, this);
            }

            token = this.synchronize(DeclaredRoutineParser.PARAMETER_SET);
        }

        return sublist;
    }
}

DeclaredRoutineParser.initialize();