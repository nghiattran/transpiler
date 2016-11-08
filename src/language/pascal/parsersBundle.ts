import {PascalParser} from './PascalParser';
import {PascalTokenType} from './PascalTokenType';
import {PascalErrorCode} from './PascalErrorCode';

import {Token} from '../../frontend/Token';
import {TokenType} from '../../frontend/TokenType';
import {EofToken} from '../../frontend/EofToken';

import {ICodeNode} from '../../intermediate/ICodeNode';
import {Definition} from '../../intermediate/Definition';
import {TypeSpec} from '../../intermediate/TypeSpec';
import {SymTabEntry} from '../../intermediate/SymTabEntry';
import {TypeFactory} from '../../intermediate/TypeFactory';
import {ICodeNodeType} from '../../intermediate/ICodeNodeType';
import {RoutineCode} from '../../intermediate/RoutineCode';

import {DefinitionImpl} from '../../intermediate/symtabimpl/DefinitionImpl';
import {Predefined} from '../../intermediate/symtabimpl/Predefined';
import {SymTabKeyImpl} from '../../intermediate/symtabimpl/SymTabKeyImpl';
import {RoutineCodeImpl} from '../../intermediate/symtabimpl/RoutineCodeImpl';

import {ICodeFactory} from '../../intermediate/ICodeFactory';
import {SymTab} from '../../intermediate/SymTab';
import {ICode} from '../../intermediate/ICode';
import {TypeForm} from '../../intermediate/TypeForm';

import {ICodeKeyImpl} from '../../intermediate/icodeimpl/ICodeKeyImpl';
import {ICodeNodeTypeImpl} from '../../intermediate/icodeimpl/ICodeNodeTypeImpl';

import {TypeKeyImpl} from '../../intermediate/typeimpl/TypeKeyImpl';
import {TypeFormImpl} from '../../intermediate/typeimpl/TypeFormImpl';
import {TypeChecker} from '../../intermediate/typeimpl/TypeChecker';

import {HashMap} from '../../util/HashMap';
import {List} from '../../util/List';
import {Util} from '../../util/Util';






// AssignmentStatementParser
export class StatementParser extends PascalParser {
    // Synchronization set for starting a statement.
    public static STMT_START_SET : List<PascalTokenType> = new List<PascalTokenType>([
        PascalTokenType.BEGIN, 
        PascalTokenType.CASE, 
        PascalTokenType.FOR, 
        PascalTokenType.IF, 
        PascalTokenType.REPEAT, 
        PascalTokenType.WHILE,
        PascalTokenType.IDENTIFIER, 
        PascalTokenType.SEMICOLON]);

    // Synchronization set for following a statement.
    public static STMT_FOLLOW_SET : List<PascalTokenType> = new List<PascalTokenType>([
        PascalTokenType.SEMICOLON, 
        PascalTokenType.END,
        PascalTokenType.ELSE,
        PascalTokenType.UNTIL,
        PascalTokenType.DOT]);

    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    /**
     * Parse a statement.
     * To be overridden by the specialized statement parser subclasses.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token): ICodeNode {
        let statementNode : ICodeNode = undefined;
        
        switch (<PascalTokenType> token.getType()) {

            case PascalTokenType.BEGIN: {
                let compoundParser : CompoundStatementParser =
                    new CompoundStatementParser(this);
                statementNode = compoundParser.parse(token);
                break;
            }

            case PascalTokenType.IDENTIFIER: {
                let name : string = token.getText().toLowerCase();
                let id : SymTabEntry= StatementParser.symTabStack.lookup(name);
                let idDefn : Definition = id !== undefined ? id.getDefinition()
                                               : DefinitionImpl.UNDEFINED;
                              
                // Assignment statement or procedure call.
                switch (<DefinitionImpl> idDefn) {
                    case DefinitionImpl.VARIABLE:
                    case DefinitionImpl.VALUE_PARM:
                    case DefinitionImpl.VAR_PARM:
                    case DefinitionImpl.UNDEFINED: {
                        let assignmentParser : AssignmentStatementParser =
                            new AssignmentStatementParser(this);
                        statementNode = assignmentParser.parse(token);
                        break;
                    }

                    case DefinitionImpl.FUNCTION: {
                        let assignmentParser : AssignmentStatementParser =
                            new AssignmentStatementParser(this);
                        statementNode =
                            assignmentParser.parseFunctionNameAssignment(token);
                        break;
                    }

                    case DefinitionImpl.PROCEDURE: {
                        let callParser : CallParser = new CallParser(this);
                        statementNode = callParser.parse(token);
                        break;
                    }

                    default: {
                        StatementParser.errorHandler.flag(token, PascalErrorCode.UNEXPECTED_TOKEN, this);
                        token = this.nextToken();  // consume identifier
                    }
                }

                break;
            }

            case PascalTokenType.REPEAT: {
                let repeatParser : RepeatStatementParser =
                    new RepeatStatementParser(this);
                statementNode = repeatParser.parse(token);
                break;
            }

            case PascalTokenType.WHILE: {
                let whileParser : WhileStatementParser =
                    new WhileStatementParser(this);
                statementNode = whileParser.parse(token);
                break;
            }

            case PascalTokenType.FOR: {
                let forParser : ForStatementParser= new ForStatementParser(this);
                statementNode = forParser.parse(token);
                break;
            }

            case PascalTokenType.IF: {
                let ifParser : IfStatementParser = new IfStatementParser(this);
                statementNode = ifParser.parse(token);
                break;
            }

            case PascalTokenType.CASE: {
                let caseParser : CaseStatementParser = new CaseStatementParser(this);
                statementNode = caseParser.parse(token);
                break;
            }

            default: {
                statementNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.NO_OP);
                break;
            }
        }

        // Set the current line number as an attribute.
        this.setLineNumber(statementNode, token);

        return statementNode;
    }

    /**
     * Set the current line number as a statement node attribute.
     * @param node ICodeNode
     * @param token Token
     */
    protected setLineNumber(node : ICodeNode, token : Token) : void {
        if (node !== undefined) {
            node.setAttribute(ICodeKeyImpl.LINE, token.getLineNumber());
        }
    }

    /**
     * Parse a statement list.
     * @param token the curent token.
     * @param parentNode the parent node of the statement list.
     * @param terminator the token type of the node that terminates the list.
     * @param errorCode the error code if the terminator token is missing.
     * @throws Exception if an error occurred.
     */
    public parseList(token : Token, parentNode : ICodeNode,
                             terminator : PascalTokenType,
                             errorCode : PascalErrorCode) : void
    {
        // Synchronization set for the terminator.
        let terminatorSet : List<PascalTokenType> = StatementParser.STMT_START_SET.clone();
        terminatorSet.add(terminator);

        // Loop to parse each statement until the END token
        // or the end of the source file.
        while (!(token instanceof EofToken) &&
               (token.getType() !== terminator)) {

            // Parse a statement.  The parent node adopts the statement node.
            let statementNode : ICodeNode = this.parse(token);
            parentNode.addChild(statementNode);

            token = this.currentToken();
            let tokenType : TokenType = token.getType();

            // Look for the semicolon between statements.
            if (tokenType === PascalTokenType.SEMICOLON) {
                token = this.nextToken();  // consume the ;
            }

            // If at the start of the next statement, then missing a semicolon.
            else if (StatementParser.STMT_START_SET.contains(tokenType as PascalTokenType)) {
                StatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_SEMICOLON, this);
            }

            // Synchronize at the start of the next statement
            // or at the terminator.
            token = this.synchronize(terminatorSet);
        }

        // Look for the terminator token.
        if (token.getType() === terminator) {
            token = this.nextToken();  // consume the terminator token
        }
        else {
            StatementParser.errorHandler.flag(token, errorCode, this);
        }
    }
}



















export class BlockParser extends PascalParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    /**
     * Parse a block.
     * @param token the initial token.
     * @param routineId the symbol table entry of the routine name.
     * @return the root node of the parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token, routineId : SymTabEntry) : ICodeNode{
        let declarationsParser : DeclarationsParser = new DeclarationsParser(this);
        let statementParser : StatementParser = new StatementParser(this);

        // Parse any declarations.
        declarationsParser.parse(token, routineId);

        token = this.synchronize(StatementParser.STMT_START_SET);
        let tokenType : TokenType = token.getType();
        let rootNode : ICodeNode = undefined;

        // Look for the BEGIN token to parse a compound statement.
        if (tokenType === PascalTokenType.BEGIN) {
            rootNode = statementParser.parse(token);
        }

        // Missing BEGIN: Attempt to parse anyway if possible.
        else {
            BlockParser.errorHandler.flag(token, PascalErrorCode.MISSING_BEGIN, this);

            if (StatementParser.STMT_START_SET.contains(tokenType as PascalTokenType)) {
                rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.COMPOUND);
                statementParser.parseList(token, rootNode, PascalTokenType.END, PascalErrorCode.MISSING_END);
            }
        }

        return rootNode;
    }
}








export class CompoundStatementParser extends StatementParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    /**
     * Parse a compound statement.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : ICodeNode {
        token = this.nextToken();  // consume the BEGIN

        // Create the COMPOUND node.
        let compoundNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.COMPOUND);

        // Parse the statement list terminated by the END token.
        let statementParser : StatementParser = new StatementParser(this);
        statementParser.parseList(token, compoundNode, PascalTokenType.END, PascalErrorCode.MISSING_END);

        return compoundNode;
    }
}








export class DeclarationsParser extends PascalParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    static DECLARATION_START_SET : List<PascalTokenType> =
        new List([
            PascalTokenType.CONST, 
            PascalTokenType.TYPE, 
            PascalTokenType.VAR, 
            PascalTokenType.PROCEDURE, 
            PascalTokenType.FUNCTION, 
            PascalTokenType.BEGIN]);
        
    static TYPE_START_SET : List<PascalTokenType> =
        DeclarationsParser.DECLARATION_START_SET.clone();
    static VAR_START_SET : List<PascalTokenType> =
        DeclarationsParser.TYPE_START_SET.clone();
    static ROUTINE_START_SET : List<PascalTokenType> =
        DeclarationsParser.VAR_START_SET.clone();

    static initialize() : void {
        DeclarationsParser.TYPE_START_SET.remove(PascalTokenType.CONST);
        DeclarationsParser.VAR_START_SET.remove(PascalTokenType.TYPE);
        DeclarationsParser.ROUTINE_START_SET.remove(PascalTokenType.VAR);
    }

    /**
     * Parse declarations.
     * To be overridden by the specialized declarations parser subclasses.
     * @param token the initial token.
     * @param parentId the symbol table entry of the parent routine's name.
     * @return undefined
     * @throws Exception if an error occurred.
     */
    public parse(
        token : Token, 
        parentId : SymTabEntry) : SymTabEntry
    {
        token = this.synchronize(DeclarationsParser.DECLARATION_START_SET);
        
        if (token.getType() === PascalTokenType.CONST) {
            token = this.nextToken();  // consume CONST

            let constantDefinitionsParser : ConstantDefinitionsParser =
                new ConstantDefinitionsParser(this);
            constantDefinitionsParser.parse(token, undefined);
        }

        token = this.synchronize(DeclarationsParser.TYPE_START_SET);

        if (token.getType() === PascalTokenType.TYPE) {
            token = this.nextToken();  // consume TYPE

            let typeDefinitionsParser : TypeDefinitionsParser =
                new TypeDefinitionsParser(this);
            typeDefinitionsParser.parse(token, undefined);
        }

        token = this.synchronize(DeclarationsParser.VAR_START_SET);

        if (token.getType() === PascalTokenType.VAR) {
            token = this.nextToken();  // consume VAR
            
            let variableDeclarationsParser : VariableDeclarationsParser =
                new VariableDeclarationsParser(this);
            variableDeclarationsParser.setDefinition(DefinitionImpl.VARIABLE);
            variableDeclarationsParser.parse(token, undefined);
        }

        token = this.synchronize(DeclarationsParser.ROUTINE_START_SET);
        let tokenType : TokenType = token.getType();

        while ((tokenType === PascalTokenType.PROCEDURE) || (tokenType === DefinitionImpl.FUNCTION)) {
            let routineParser : DeclaredRoutineParser =
                new DeclaredRoutineParser(this);
            routineParser.parse(token, parentId);

            // Look for one or more semicolons after a definition.
            token = this.currentToken();
            if (token.getType() === PascalTokenType.SEMICOLON) {
                while (token.getType() === PascalTokenType.SEMICOLON) {
                    token = this.nextToken();  // consume the ;
                }
            }

            token = this.synchronize(DeclarationsParser.ROUTINE_START_SET);
            tokenType = token.getType();
        }

        return undefined;
    }
}

DeclarationsParser.initialize();







export class ConstantDefinitionsParser extends DeclarationsParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    // Synchronization set for a constant identifier.
    private static IDENTIFIER_SET : List<PascalTokenType> =
        DeclarationsParser.TYPE_START_SET.clone();
    // Synchronization set for the start of the next definition or declaration.
    private static NEXT_START_SET : List<PascalTokenType> =
        DeclarationsParser.TYPE_START_SET.clone();
    // Synchronization set for starting a constant.
    static CONSTANT_START_SET : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.IDENTIFIER, 
            PascalTokenType.INTEGER, 
            PascalTokenType.REAL, 
            PascalTokenType.PLUS, 
            PascalTokenType.MINUS, 
            PascalTokenType.STRING, 
            PascalTokenType.SEMICOLON]);

    // Synchronization set for the = token.
    private static EQUALS_SET : List<PascalTokenType> =
        ConstantDefinitionsParser.CONSTANT_START_SET.clone();

    static initialize() : void {
        ConstantDefinitionsParser.IDENTIFIER_SET.add(PascalTokenType.IDENTIFIER);
        ConstantDefinitionsParser. EQUALS_SET.add(PascalTokenType.EQUALS);
        ConstantDefinitionsParser.EQUALS_SET.add(PascalTokenType.SEMICOLON);
        ConstantDefinitionsParser.NEXT_START_SET.add(PascalTokenType.SEMICOLON);
        ConstantDefinitionsParser.NEXT_START_SET.add(PascalTokenType.IDENTIFIER);
    }

    /**
     * Parse constant definitions.
     * @param token the initial token.
     * @param parentId the symbol table entry of the parent routine's name.
     * @return undefined
     * @throws Exception if an error occurred.
     */
    public parse(token : Token, parentId : SymTabEntry) : SymTabEntry{
        token = this.synchronize(ConstantDefinitionsParser.IDENTIFIER_SET);

        // Loop to parse a sequence of constant definitions
        // separated by semicolons.
        while (token.getType() === PascalTokenType.IDENTIFIER) {
            let name : string = token.getText().toLowerCase();
            let constantId : SymTabEntry = ConstantDefinitionsParser.symTabStack.lookupLocal(name);

            // Enter the new identifier into the symbol table
            // but don't set how it's defined yet.
            if (constantId === undefined) {
                constantId = ConstantDefinitionsParser.symTabStack.enterLocal(name);
                constantId.appendLineNumber(token.getLineNumber());
            }
            else {
                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_REDEFINED, this);
                constantId = undefined;
            }

            token = this.nextToken();  // consume the identifier token

            // Synchronize on the = token.
            token = this.synchronize(ConstantDefinitionsParser.EQUALS_SET);
            if (token.getType() === PascalTokenType.EQUALS) {
                token = this.nextToken();  // consume the =
            }
            else {
                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode.MISSING_EQUALS, this);
            }

            // Parse the constant value.
            let constantToken : Token = token;
            let value : Object = this.parseConstant(token);

            // Set identifier to be a constant and set its value.
            if (constantId !== undefined) {
                constantId.setDefinition(DefinitionImpl.CONSTANT);
                constantId.setAttribute(SymTabKeyImpl.CONSTANT_VALUE, value);
                
                // Set the constant's type.
                let constantType : TypeSpec =
                    constantToken.getType() === PascalTokenType.IDENTIFIER
                        ? this.getConstantType(constantToken)
                        : this.getConstantType(value);
                        
                constantId.setTypeSpec(constantType);
            }

            token = this.currentToken();
            let tokenType : TokenType = token.getType();

            // Look for one or more semicolons after a definition.
            if (tokenType === PascalTokenType.SEMICOLON) {
                while (token.getType() === PascalTokenType.SEMICOLON) {
                    token = this.nextToken();  // consume the ;
                }
            }

            // If at the start of the next definition or declaration,
            // then missing a semicolon.
            else if (ConstantDefinitionsParser.NEXT_START_SET.contains(tokenType as PascalTokenType)) {
                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode.MISSING_SEMICOLON, this);
            }

            token = this.synchronize(ConstantDefinitionsParser.IDENTIFIER_SET);
        }

        return undefined;
    }

    /**
     * Parse a constant value.
     * @param token the current token.
     * @return the constant value.
     * @throws Exception if an error occurred.
     */
    public parseConstant(token : Token) : Object{
        let sign : TokenType = undefined;

        // Synchronize at the start of a constant.
        token = this.synchronize(ConstantDefinitionsParser.CONSTANT_START_SET);
        let tokenType : TokenType = token.getType();

        // Plus or minus sign?
        if ((tokenType === PascalTokenType.PLUS) || (tokenType === PascalTokenType.MINUS)) {
            sign = tokenType;
            token = this.nextToken();  // consume sign
        }

        // Parse the constant.
        switch (<PascalTokenType> token.getType()) {

            case PascalTokenType.IDENTIFIER: {
                return this.parseIdentifierConstant(token, sign);
            }

            case PascalTokenType.INTEGER: {
                let value : number = <number> token.getValue();
                this.nextToken();  // consume the number
                return sign === PascalTokenType.MINUS ? -value : value;
            }

            case PascalTokenType.REAL: {
                let value : number = <number> token.getValue();
                this.nextToken();  // consume the number
                return sign === PascalTokenType.MINUS ? -value : value;
            }

            case PascalTokenType.STRING: {
                if (sign !== undefined) {
                    ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this);
                }

                this.nextToken();  // consume the string
                return <string> token.getValue();
            }

            default: {
                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this);
                return undefined;
            }
        }
    }

    /**
     * Parse an identifier constant.
     * @param token the current token.
     * @param sign the sign, if any.
     * @return the constant value.
     * @throws Exception if an error occurred.
     */
    protected parseIdentifierConstant(token : Token, sign : TokenType) : Object
    {
        let name : string = token.getText().toLowerCase();
        let id : SymTabEntry = ConstantDefinitionsParser.symTabStack.lookup(name);

        this.nextToken();  // consume the identifier

        // The identifier must have already been defined
        // as an constant identifier.
        if (id === undefined) {
            ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_UNDEFINED, this);
            return undefined;
        }
            
        let definition : Definition = id.getDefinition();

        if (definition === DefinitionImpl.CONSTANT) {
            let value : Object = id.getAttribute(SymTabKeyImpl.CONSTANT_VALUE);
            id.appendLineNumber(token.getLineNumber());

            if (Util.isInteger(<number> value)) {
                return sign === PascalTokenType.MINUS ? -(<number> value) : value;
            }
            else if (Util.isFloat(<number> value)) {
                return sign === PascalTokenType.MINUS ? -(<number> value) : value;
            }
            else if (value instanceof String) {
                if (sign !== undefined) {
                    ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this);
                }

                return value;
            }
            else {
                return undefined;
            }
        }
        else if (definition === DefinitionImpl.ENUMERATION_CONSTANT) {
            let value : Object = id.getAttribute(SymTabKeyImpl.CONSTANT_VALUE);
            id.appendLineNumber(token.getLineNumber());

            if (sign !== undefined) {
                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this);
            }

            return value;
        }
        else if (definition === undefined) {
            ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode.NOT_CONSTANT_IDENTIFIER, this);
            return undefined;
        }
        else {
            ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this);
            return undefined;
        }
    }

    /**
     * Return the type of a constant given arbitrary object.
     * @param value the constant value
     * @return the type specification.
     */
    public getConstantType(object : any) : TypeSpec {
        if (object instanceof Token) {
            return this.getConstantTypeByToken(<Token> object)
        } else {
            return this.getConstantTypeByObject(object);
        }
    }

    /**
     * Return the type of a constant given its value.
     * @param value the constant value
     * @return the type specification.
     */
    protected getConstantTypeByObject(value : Object) : TypeSpec {
        let constantType : TypeSpec = undefined;

        if (Util.isInteger(<number> value)) {
            constantType = Predefined.integerType;
        }
        else if (Util.isFloat(<number> value)) {
            constantType = Predefined.realType;
        }
        else if (value instanceof String) {
            if ((<string> value).length === 1) {
                constantType = Predefined.charType;
            }
            else {
                constantType = TypeFactory.createStringType(<string> value);
            }
        }
        
        return constantType;
    }

    /**
     * Return the type of a constant given its identifier.
     * @param identifier the constant's identifier.
     * @return the type specification.
     */
    protected getConstantTypeByToken(identifier : Token) : TypeSpec{
        let name : string = identifier.getText().toLowerCase();
        let id : SymTabEntry = ConstantDefinitionsParser.symTabStack.lookup(name);

        if (id === undefined) {
            return undefined;
        }

        let definition : Definition = id.getDefinition();

        if ((definition === DefinitionImpl.CONSTANT) || (definition === DefinitionImpl.ENUMERATION_CONSTANT)) {
            return id.getTypeSpec();
        } else {
            return undefined;
        }
    }
}

ConstantDefinitionsParser.initialize();




















export class SimpleTypeParser extends PascalParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    constructor(parent : PascalParser) {
        super(parent);
    }

    // Synchronization set for starting a simple type specification.
    static SIMPLE_TYPE_START_SET : List<PascalTokenType> =
        ConstantDefinitionsParser.CONSTANT_START_SET.clone();

    static initialize() : void {
        SimpleTypeParser.SIMPLE_TYPE_START_SET.add(PascalTokenType.LEFT_PAREN);
        SimpleTypeParser.SIMPLE_TYPE_START_SET.add(PascalTokenType.COMMA);
        SimpleTypeParser.SIMPLE_TYPE_START_SET.add(PascalTokenType.SEMICOLON);
    }

    /**
     * Parse a simple Pascal type specification.
     * @param token the current token.
     * @return the simple type specification.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : TypeSpec{
        // Synchronize at the start of a simple type specification.
        token = this.synchronize(SimpleTypeParser.SIMPLE_TYPE_START_SET);

        switch (<PascalTokenType> token.getType()) {

            case PascalTokenType.IDENTIFIER: {
                let name : string = token.getText().toLowerCase();
                let id : SymTabEntry = SimpleTypeParser.symTabStack.lookup(name);

                if (id !== undefined) {
                    let definition : Definition = id.getDefinition();

                    // It's either a type identifier
                    // or the start of a subrange type.
                    if (definition === DefinitionImpl.TYPE) {
                        id.appendLineNumber(token.getLineNumber());
                        token = this.nextToken();  // consume the identifier

                        // Return the type of the referent type.
                        return id.getTypeSpec();
                    }
                    else if ((definition !== DefinitionImpl.CONSTANT) &&
                             (definition !== DefinitionImpl.ENUMERATION_CONSTANT)) {
                        SimpleTypeParser.errorHandler.flag(token, PascalErrorCode.NOT_TYPE_IDENTIFIER, this);
                        token = this.nextToken();  // consume the identifier
                        return undefined;
                    }
                    else {
                        let subrangeTypeParser : SubrangeTypeParser =
                            new SubrangeTypeParser(this);
                        return subrangeTypeParser.parse(token);
                    }
                }
                else {
                    SimpleTypeParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_UNDEFINED, this);
                    token = this.nextToken();  // consume the identifier
                    return undefined;
                }
            }

            case PascalTokenType.LEFT_PAREN: {
                let enumerationTypeParser : EnumerationTypeParser =
                    new EnumerationTypeParser(this);
                return enumerationTypeParser.parse(token);
            }

            case PascalTokenType.COMMA:
            case PascalTokenType.SEMICOLON: {
                SimpleTypeParser.errorHandler.flag(token, PascalErrorCode.INVALID_TYPE, this);
                return undefined;
            }

            default: {
                let subrangeTypeParser : SubrangeTypeParser =
                    new SubrangeTypeParser(this);
                return subrangeTypeParser.parse(token);
            }
        }
    }
}

SimpleTypeParser.initialize();





export class TypeSpecificationParser extends PascalParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    constructor(parent : PascalParser) {
        super(parent);
    }

    // Synchronization set for starting a type specification.
    static TYPE_START_SET : List<PascalTokenType> =
        SimpleTypeParser.SIMPLE_TYPE_START_SET.clone();

    static initialize () : void {
        TypeSpecificationParser.TYPE_START_SET.add(PascalTokenType.ARRAY);
        TypeSpecificationParser.TYPE_START_SET.add(PascalTokenType.RECORD);
        TypeSpecificationParser.TYPE_START_SET.add(PascalTokenType.SEMICOLON);
    }

    /**
     * Parse a Pascal type specification.
     * @param token the current token.
     * @return the type specification.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : TypeSpec {
        // Synchronize at the start of a type specification.
        token = this.synchronize(TypeSpecificationParser.TYPE_START_SET);

        switch (<PascalTokenType> token.getType()) {

            case PascalTokenType.ARRAY: {
                let arrayTypeParser : ArrayTypeParser = new ArrayTypeParser(this);
                return arrayTypeParser.parse(token);
            }

            case PascalTokenType.RECORD: {
                let recordTypeParser : RecordTypeParser = new RecordTypeParser(this);
                return recordTypeParser.parse(token);
            }

            default: {
                let simpleTypeParser : SimpleTypeParser = new SimpleTypeParser(this);
                return simpleTypeParser.parse(token);
            }
        }
    }
}
TypeSpecificationParser.initialize();







export class TypeDefinitionsParser extends DeclarationsParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    // Synchronization set for a type identifier.
    private static IDENTIFIER_SET : List<PascalTokenType> =
        DeclarationsParser.VAR_START_SET.clone();

    // Synchronization set for the = token.
    private static EQUALS_SET : List<PascalTokenType> =
        ConstantDefinitionsParser.CONSTANT_START_SET.clone();


    // Synchronization set for what follows a definition or declaration.
    private static FOLLOW_SET : List<PascalTokenType> =
        new List([PascalTokenType.SEMICOLON]);

    // Synchronization set for the start of the next definition or declaration.
    private static NEXT_START_SET : List<PascalTokenType> =
        DeclarationsParser.VAR_START_SET.clone();
    
    static initialize() : void {
        TypeDefinitionsParser.IDENTIFIER_SET.add(PascalTokenType.IDENTIFIER);
        TypeDefinitionsParser.EQUALS_SET.add(PascalTokenType.EQUALS);
        TypeDefinitionsParser.EQUALS_SET.add(PascalTokenType.SEMICOLON);
        TypeDefinitionsParser.NEXT_START_SET.add(PascalTokenType.SEMICOLON);
        TypeDefinitionsParser.NEXT_START_SET.add(PascalTokenType.IDENTIFIER);
    }

    /**
     * Parse type definitions.
     * @param token the initial token.
     * @param parentId the symbol table entry of the parent routine's name.
     * @return undefined
     * @throws Exception if an error occurred.
     */
    public parse(token : Token, parentId : SymTabEntry) : SymTabEntry {
        token = this.synchronize(TypeDefinitionsParser.IDENTIFIER_SET);

        // Loop to parse a sequence of type definitions
        // separated by semicolons.
        while (token.getType() === PascalTokenType.IDENTIFIER) {
            let name : string = token.getText().toLowerCase();
            let typeId : SymTabEntry = TypeDefinitionsParser.symTabStack.lookupLocal(name);

            // Enter the new identifier into the symbol table
            // but don't set how it's defined yet.
            if (typeId === undefined) {
                typeId = TypeDefinitionsParser.symTabStack.enterLocal(name);
                typeId.appendLineNumber(token.getLineNumber());
            }
            else {
                TypeDefinitionsParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_REDEFINED, this);
                typeId = undefined;
            }

            token = this.nextToken();  // consume the identifier token

            // Synchronize on the = token.
            token = this.synchronize(TypeDefinitionsParser.EQUALS_SET);
            if (token.getType() === PascalTokenType.EQUALS) {
                token = this.nextToken();  // consume the =
            }
            else {
                TypeDefinitionsParser.errorHandler.flag(token, PascalErrorCode.MISSING_EQUALS, this);
            }

            // Parse the type specification.
            let typeSpecificationParser : TypeSpecificationParser =
                new TypeSpecificationParser(this);
            let type : TypeSpec = typeSpecificationParser.parse(token);

            // Set identifier to be a type and set its type specificationt.
            if (typeId !== undefined) {
                typeId.setDefinition(PascalTokenType.TYPE);
            }
            
            // Cross-link the type identifier and the type specification.
            if ((type !== undefined) && (typeId !== undefined)) {
                if (type.getIdentifier() === undefined) {
                    type.setIdentifier(typeId);
                }
                typeId.setTypeSpec(type);
            }
            else {
                token = this.synchronize(TypeDefinitionsParser.FOLLOW_SET);
            }

            token = this.currentToken();
            let tokenType : TokenType = token.getType();

            // Look for one or more semicolons after a definition.
            if (tokenType === PascalTokenType.SEMICOLON) {
                while (token.getType() === PascalTokenType.SEMICOLON) {
                    token = this.nextToken();  // consume the ;
                }
            }

            // If at the start of the next definition or declaration,
            // then missing a semicolon.
            else if (TypeDefinitionsParser.NEXT_START_SET.contains(tokenType as PascalTokenType)) {
                TypeDefinitionsParser.errorHandler.flag(token, PascalErrorCode.MISSING_SEMICOLON, this);
            }

            token = this.synchronize(TypeDefinitionsParser.IDENTIFIER_SET);
        }

        return undefined;
    }
}























export class ArrayTypeParser extends TypeSpecificationParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    constructor(parent : PascalParser) {
        super(parent);
    }

    // Synchronization set for the [ token.
    private static LEFT_BRACKET_SET : List<PascalTokenType> =
        SimpleTypeParser.SIMPLE_TYPE_START_SET.clone();

    // Synchronization set for the ] token.
    private static RIGHT_BRACKET_SET : List<PascalTokenType> =
        new List([
            PascalTokenType.RIGHT_BRACKET, 
            PascalTokenType.OF, 
            PascalTokenType.SEMICOLON]);

    // Synchronization set for OF.
    private static OF_SET : List<PascalTokenType> =
        TypeSpecificationParser.TYPE_START_SET.clone();

    // Synchronization set to start an index type.
    private static INDEX_START_SET : List<PascalTokenType> =
        SimpleTypeParser.SIMPLE_TYPE_START_SET.clone();
    

    // Synchronization set to end an index type.
    private static INDEX_END_SET : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.RIGHT_BRACKET, 
            PascalTokenType.OF, 
            PascalTokenType.SEMICOLON]);

    // Synchronization set to follow an index type.
    private static INDEX_FOLLOW_SET : List<PascalTokenType> =
        ArrayTypeParser.INDEX_START_SET.clone();
    
    static initialize() : void {
        ArrayTypeParser.LEFT_BRACKET_SET.add(PascalTokenType.LEFT_BRACKET);
        ArrayTypeParser.LEFT_BRACKET_SET.add(PascalTokenType.RIGHT_BRACKET);

        ArrayTypeParser.OF_SET.add(PascalTokenType.OF);
        ArrayTypeParser.OF_SET.add(PascalTokenType.SEMICOLON);

        ArrayTypeParser.INDEX_START_SET.add(PascalTokenType.COMMA);

        ArrayTypeParser.INDEX_FOLLOW_SET.addAll(ArrayTypeParser.INDEX_END_SET);
    }

    /**
     * Parse a Pascal array type specification.
     * @param token the current token.
     * @return the array type specification.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : any {
        let arrayType : TypeSpec = TypeFactory.createType(PascalTokenType.ARRAY);
        token = this.nextToken();  // consume ARRAY

        // Synchronize at the [ token.
        token = this.synchronize(ArrayTypeParser.LEFT_BRACKET_SET);
        if (token.getType() !== PascalTokenType.LEFT_BRACKET) {
            ArrayTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_LEFT_BRACKET, this);
        }

        // Parse the list of index types.
        let elementType : TypeSpec = this.parseIndexTypeList(token, arrayType);

        // Synchronize at the ] token.
        token = this.synchronize(ArrayTypeParser.RIGHT_BRACKET_SET);
        if (token.getType() === PascalTokenType.RIGHT_BRACKET) {
            token = this.nextToken();  // consume [
        }
        else {
            ArrayTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_RIGHT_BRACKET, this);
        }

        // Synchronize at OF.
        token = this.synchronize(ArrayTypeParser.OF_SET);
        if (token.getType() === PascalTokenType.OF) {
            token = this.nextToken();  // consume OF
        }
        else {
            ArrayTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_OF, this);
        }

        // Parse the element type.
        elementType.setAttribute(TypeKeyImpl.ARRAY_ELEMENT_TYPE, this.parseElementType(token));

        return arrayType;
    }

    /**
     * Parse the list of index type specifications.
     * @param token the current token.
     * @param arrayType the current array type specification.
     * @return the element type specification.
     * @throws Exception if an error occurred.
     */
    private parseIndexTypeList(token : Token, arrayType : TypeSpec) : TypeSpec {
        let elementType : TypeSpec = arrayType;
        let anotherIndex : boolean = false;

        token = this.nextToken();  // consume the [ token

        // Parse the list of index type specifications.
        do {
            anotherIndex = false;

            // Parse the index type.
            token = this.synchronize(ArrayTypeParser.INDEX_START_SET);
            this.parseIndexType(token, elementType);

            // Synchronize at the , token.
            token = this.synchronize(ArrayTypeParser.INDEX_FOLLOW_SET);
            let tokenType : TokenType = token.getType();
            if ((tokenType !== PascalTokenType.COMMA) && (tokenType !== PascalTokenType.RIGHT_BRACKET)) {
                if (ArrayTypeParser.INDEX_START_SET.contains(tokenType as PascalTokenType)) {
                    ArrayTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_COMMA, this);
                    anotherIndex = true;
                }
            }

            // Create an ARRAY element type object
            // for each subsequent index type.
            else if (tokenType === PascalTokenType.COMMA) {
                let newElementType : TypeSpec = TypeFactory.createType(PascalTokenType.ARRAY);
                elementType.setAttribute(TypeKeyImpl.ARRAY_ELEMENT_TYPE, newElementType);
                elementType = newElementType;

                token = this.nextToken();  // consume the , token
                anotherIndex = true;
            }
        } while (anotherIndex);

        return elementType;
    }

    /**
     * Parse an index type specification.
     * @param token the current token.
     * @param arrayType the current array type specification.
     * @throws Exception if an error occurred.
     */
    private parseIndexType(token : Token, arrayType : TypeSpec) : void{
        let simpleTypeParser : SimpleTypeParser = new SimpleTypeParser(this);
        let indexType : TypeSpec = simpleTypeParser.parse(token);
        arrayType.setAttribute(TypeKeyImpl.ARRAY_INDEX_TYPE, indexType);

        if (indexType === undefined) {
            return;
        }

        let form : TypeForm = indexType.getForm();
        let count : number = 0;

        // Check the index type and set the element count.
        if (form === TypeFormImpl.SUBRANGE) {
            let minValue : number =
                <number> indexType.getAttribute(TypeKeyImpl.SUBRANGE_MIN_VALUE);

            let maxValue : number =
                <number> indexType.getAttribute(TypeKeyImpl.SUBRANGE_MAX_VALUE);

            if ((minValue !== undefined) && (maxValue !== undefined)) {
                count = maxValue - minValue + 1;
            }
        }
        else if (form === TypeFormImpl.ENUMERATION) {
            let constants : List<SymTabEntry> = <List<SymTabEntry>>
                indexType.getAttribute(TypeKeyImpl.ENUMERATION_CONSTANTS);
            count = constants.size();
        }
        else {
            ArrayTypeParser.errorHandler.flag(token, PascalErrorCode.INVALID_INDEX_TYPE, this);
        }
        arrayType.setAttribute(TypeKeyImpl.ARRAY_ELEMENT_COUNT, count);
    }

    /**
     * Parse the element type specification.
     * @param token the current token.
     * @return the element type specification.
     * @throws Exception if an error occurred.
     */
    private parseElementType(token : Token) : TypeSpec{
        let typeSpecificationParser : TypeSpecificationParser =
            new TypeSpecificationParser(this);
        return typeSpecificationParser.parse(token);
    }
}

export module ArrayTypeParser {
    ArrayTypeParser.initialize();
}





























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

    static initialize() : void {
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
    public constructor(parent : PascalParser) {
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
        let routineDefn : Definition = undefined;
        let dummyName : string = undefined;
        let routineId : SymTabEntry = undefined;
        let routineType : TokenType = token.getType();

        // Initialize.
        switch (<PascalTokenType> routineType) {

            case PascalTokenType.PROGRAM: {
                token = this.nextToken();  // consume PROGRAM
                routineDefn = DefinitionImpl.PROGRAM;
                dummyName = 'DummyProgramName'.toLowerCase();
                break;
            }

            case PascalTokenType.PROCEDURE: {
                token = this.nextToken();  // consume PROCEDURE
                routineDefn = DefinitionImpl.PROCEDURE;
                dummyName = 'DummyProcedureName_'.toLowerCase() +
                            console.info('%03d', ++DeclaredRoutineParser.dummyCounter);
                break;
            }

            case PascalTokenType.FUNCTION: {
                token = this.nextToken();  // consume FUNCTION
                routineDefn = DefinitionImpl.FUNCTION;
                dummyName = 'DummyFunctionName_'.toLowerCase() +
                            console.info('%03d', ++DeclaredRoutineParser.dummyCounter);
                break;
            }

            default: {
                routineDefn = DefinitionImpl.PROGRAM;
                dummyName = 'DummyProgramName'.toLowerCase();
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
        if (routineId.getAttribute(SymTabKeyImpl.ROUTINE_CODE) === RoutineCodeImpl.FORWARD) {
            let symTab : SymTab = <SymTab> routineId.getAttribute(SymTabKeyImpl.ROUTINE_SYMTAB);
            DeclaredRoutineParser.symTabStack.push(symTab);
        }
        else {
            routineId.setAttribute(SymTabKeyImpl.ROUTINE_SYMTAB, DeclaredRoutineParser.symTabStack.push());
        }

        // Program: Set the program identifier in the symbol table stack.
        // Set the initial local variables array slot number to 1.
        if (routineDefn === DefinitionImpl.PROGRAM) {
            DeclaredRoutineParser.symTabStack.setProgramId(routineId);
            DeclaredRoutineParser.symTabStack.getLocalSymTab().nextSlotNumber();  // bump slot number
        }

        // Non-forwarded procedure or function: Append to the parent's list
        //                                      of routines.
        else if (routineId.getAttribute(SymTabKeyImpl.ROUTINE_CODE) !== RoutineCodeImpl.FORWARD) {
            let subroutines : List<SymTabEntry> = <List<SymTabEntry>>
                                       parentId.getAttribute(SymTabKeyImpl.ROUTINE_ROUTINES);
            subroutines.add(routineId);
        }

        // If the routine was forwarded, there should not be
        // any formal parameters or a function return type.
        // But parse them anyway if they're there.
        if (routineId.getAttribute(SymTabKeyImpl.ROUTINE_CODE) === RoutineCodeImpl.FORWARD) {
            if (token.getType() !== PascalTokenType.SEMICOLON) {
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
        if (token.getType() === PascalTokenType.SEMICOLON) {
            do {
                token = this.nextToken();  // consume ;
            } while (token.getType() === PascalTokenType.SEMICOLON);
        }
        else {
            DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode.MISSING_SEMICOLON, this);
        }

        // Parse the routine's block or forward declaration.
        if ((token.getType() === PascalTokenType.IDENTIFIER) &&
            (token.getText().toLowerCase() === 'forward'))
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
        let routineId : SymTabEntry = undefined;

        // Parse the routine name identifier.
        if (token.getType() === PascalTokenType.IDENTIFIER) {
            let routineName : string = token.getText().toLowerCase();
            routineId = DeclaredRoutineParser.symTabStack.lookupLocal(routineName);
           
            // Not already defined locally: Enter into the local symbol table.
            if (routineId === undefined) {
                routineId = DeclaredRoutineParser.symTabStack.enterLocal(routineName);
            }

            // If already defined, it should be a forward definition.
            else if (routineId.getAttribute(SymTabKeyImpl.ROUTINE_CODE) !== RoutineCodeImpl.FORWARD) {
                routineId = undefined;
                DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_REDEFINED, this);
            }

            token = this.nextToken();  // consume routine name identifier
        }
        else {
            DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode.MISSING_IDENTIFIER, this);
        }

        // If necessary, create a dummy routine name symbol table entry.
        if (routineId === undefined) {
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
        if (routineId.getDefinition() === DefinitionImpl.FUNCTION) {
            let variableDeclarationsParser : VariableDeclarationsParser=
                new VariableDeclarationsParser(this);
            variableDeclarationsParser.setDefinition(DefinitionImpl.FUNCTION);
            let type : TypeSpec = variableDeclarationsParser.parseTypeSpec(token);

            token = this.currentToken();

            // The return type cannot be an array or record.
            if (type !== undefined) {
                let form : TypeForm = type.getForm();
                if ((form === TypeFormImpl.ARRAY) ||
                    (form === TypeFormImpl.RECORD))
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
        if (token.getType() === PascalTokenType.LEFT_PAREN) {
            token = this.nextToken();  // consume (

            let parms : List<SymTabEntry> = new List<SymTabEntry>();

            token = this.synchronize(DeclaredRoutineParser.PARAMETER_SET);
            let tokenType : TokenType = token.getType();

            // Loop to parse sublists of formal parameter declarations.
            while ((tokenType === PascalTokenType.IDENTIFIER) || (tokenType === PascalTokenType.VAR)) {
                parms.addAll(this.parseParmSublist(token, routineId));
                token = this.currentToken();
                tokenType = token.getType();
            }

            // Closing right parenthesis.
            if (token.getType() === PascalTokenType.RIGHT_PAREN) {
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
        let isProgram : boolean = routineId.getDefinition() === DefinitionImpl.PROGRAM;
        let parmDefn : Definition = isProgram ? DefinitionImpl.PROGRAM_PARM : undefined;
        let tokenType : TokenType = token.getType();

        // VAR or value parameter?
        if (tokenType === PascalTokenType.VAR) {
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
            if (tokenType === PascalTokenType.SEMICOLON) {
                while (token.getType() === PascalTokenType.SEMICOLON) {
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







export class EnumerationTypeParser extends TypeSpecificationParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    constructor(parent : PascalParser) {
        super(parent);
    }

    // Synchronization set to start an enumeration constant.
    private static ENUM_CONSTANT_START_SET : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.IDENTIFIER, 
            PascalTokenType.COMMA]);

    // Synchronization set to follow an enumeration definition.
    private static ENUM_DEFINITION_FOLLOW_SET : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.RIGHT_PAREN, 
            PascalTokenType.SEMICOLON]);

    static initialize(): void {
        EnumerationTypeParser.ENUM_DEFINITION_FOLLOW_SET.addAll(DeclarationsParser.VAR_START_SET);
    }

    /**
     * Parse a Pascal enumeration type specification.
     * @param token the current token.
     * @return the enumeration type specification.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : TypeSpec{
        let enumerationType : TypeSpec = TypeFactory.createType(TypeFormImpl.ENUMERATION);
        let value : number = -1;
        let constants : List<SymTabEntry> = new List<SymTabEntry>();

        token = this.nextToken();  // consume the opening (

        do {
            token = this.synchronize(EnumerationTypeParser.ENUM_CONSTANT_START_SET);
            this.parseEnumerationIdentifier(token, ++value, enumerationType,
                                       constants);

            token = this.currentToken();
            let tokenType : TokenType = token.getType();

            // Look for the comma.
            if (tokenType === PascalTokenType.COMMA) {
                token = this.nextToken();  // consume the comma

                if (EnumerationTypeParser.ENUM_DEFINITION_FOLLOW_SET.contains(token.getType() as PascalTokenType)) {
                    EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_IDENTIFIER, this);
                }
            }
            else if (EnumerationTypeParser.ENUM_CONSTANT_START_SET.contains(tokenType as PascalTokenType)) {
                EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_COMMA, this);
            }
        } while (!EnumerationTypeParser.ENUM_DEFINITION_FOLLOW_SET.contains(token.getType() as PascalTokenType));

        // Look for the closing ).
        if (token.getType() === PascalTokenType.RIGHT_PAREN) {
            token = this.nextToken();  // consume the )
        }
        else {
            EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_RIGHT_PAREN, this);
        }

        enumerationType.setAttribute(TypeKeyImpl.ENUMERATION_CONSTANTS, constants);
        return enumerationType;
    }

    /**
     * Parse an enumeration identifier.
     * @param token the current token.
     * @param value the identifier's integer value (sequence number).
     * @param enumerationType the enumeration type specification.
     * @param constants the array of symbol table entries for the
     * enumeration constants.
     * @throws Exception if an error occurred.
     */
    private parseEnumerationIdentifier(token : Token, value : number,
                                       enumerationType : TypeSpec,
                                       constants : List<SymTabEntry> )
        : void
    {
        let tokenType : TokenType = token.getType();

        if (tokenType === PascalTokenType.IDENTIFIER) {
            let name : string = token.getText().toLowerCase();
            let constantId : SymTabEntry = EnumerationTypeParser.symTabStack.lookupLocal(name);

            if (constantId !== undefined) {
                EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_REDEFINED, this);
            }
            else {
                constantId = EnumerationTypeParser.symTabStack.enterLocal(name);
                constantId.setDefinition(DefinitionImpl.ENUMERATION_CONSTANT);
                constantId.setTypeSpec(enumerationType);
                constantId.setAttribute(SymTabKeyImpl.CONSTANT_VALUE, value);
                constantId.appendLineNumber(token.getLineNumber());
                constants.add(constantId);
            }

            token = this.nextToken();  // consume the identifier
        }
        else {
            EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_IDENTIFIER, this);
        }
    }
}

export module EnumerationTypeParser {
    EnumerationTypeParser.initialize();
}











    
export class ProgramParser extends DeclarationsParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
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
     * @return undefined
     * @throws Exception if an error occurred.
     */
    public parse(token : Token, parentId : SymTabEntry) : SymTabEntry {
        token = this.synchronize(ProgramParser.PROGRAM_START_SET);

        // Parse the program.
        let routineParser : DeclaredRoutineParser = new DeclaredRoutineParser(this);
        routineParser.parse(token, parentId);
        
        // Look for the final period.
        token = this.currentToken();
        if (token.getType() !== PascalTokenType.DOT) {
            ProgramParser.errorHandler.flag(token, PascalErrorCode.MISSING_PERIOD, this);
        }

        return undefined;
    }
}


ProgramParser.initialize();







export class RecordTypeParser extends TypeSpecificationParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    constructor(parent : PascalParser) {
        super(parent);
    }

    // Synchronization set for the END.
    private static END_SET : List<PascalTokenType> =
        DeclarationsParser.VAR_START_SET.clone();

    static initialize() : void {
        RecordTypeParser.END_SET.add(PascalTokenType.END);
        RecordTypeParser.END_SET.add(PascalTokenType.SEMICOLON);
    }

    /**
     * Parse a Pascal record type specification.
     * @param token the current token.
     * @return the record type specification.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) :TypeSpec {
        let recordType : TypeSpec = TypeFactory.createType(PascalTokenType.RECORD);
        token = this.nextToken();  // consume RECORD

        // Push a symbol table for the RECORD type specification.
        recordType.setAttribute(TypeKeyImpl.RECORD_SYMTAB, RecordTypeParser.symTabStack.push());

        // Parse the field declarations.
        let variableDeclarationsParser : VariableDeclarationsParser =
            new VariableDeclarationsParser(this);
        variableDeclarationsParser.setDefinition(DefinitionImpl.FIELD);
        variableDeclarationsParser.parse(token, undefined);

        // Pop off the record's symbol table.
        RecordTypeParser.symTabStack.pop();

        // Synchronize at the END.
        token = this.synchronize(RecordTypeParser.END_SET);

        // Look for the END.
        if (token.getType() === PascalTokenType.END) {
            token = this.nextToken();  // consume END
        }
        else {
            RecordTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_END, this);
        }

        return recordType;
    }
}

export module RecordTypeParser {
    RecordTypeParser.initialize();
}







export class SubrangeTypeParser extends TypeSpecificationParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    constructor(parent : PascalParser) {
        super(parent);
    }

    /**
     * Parse a Pascal subrange type specification.
     * @param token the current token.
     * @return the subrange type specification.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) {
        let subrangeType : TypeSpec = TypeFactory.createType(TypeFormImpl.SUBRANGE);
        let minValue : Object = undefined;
        let maxValue : Object = undefined;

        // Parse the minimum constant.
        let constantToken : Token = token;
        let constantParser : ConstantDefinitionsParser =
            new ConstantDefinitionsParser(this);
        minValue = constantParser.parseConstant(token);

        // Set the minimum constant's type.
        let minType : TypeSpec = constantToken.getType() === PascalTokenType.IDENTIFIER
                               ? constantParser.getConstantType(constantToken)
                               : constantParser.getConstantType(minValue);

        minValue = this.checkValueType(constantToken, minValue, minType);

        token = this.currentToken();
        let sawDotDot : boolean = false;

        // Look for the .. token.
        if (token.getType() === PascalTokenType.DOT_DOT) {
            token = this.nextToken();  // consume the .. token
            sawDotDot = true;
        }

        let tokenType : TokenType = token.getType();

        // At the start of the maximum constant?
        if (ConstantDefinitionsParser.CONSTANT_START_SET.contains(tokenType as PascalTokenType)) {
            if (!sawDotDot) {
                SubrangeTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_DOT_DOT, this);
            }

            // Parse the maximum constant.
            token = this.synchronize(ConstantDefinitionsParser.CONSTANT_START_SET);
            constantToken = token;
            maxValue = constantParser.parseConstant(token);

            // Set the maximum constant's type.
            let maxType : TypeSpec = constantToken.getType() === PascalTokenType.IDENTIFIER
                               ? constantParser.getConstantType(constantToken)
                               : constantParser.getConstantType(maxValue);

            maxValue = this.checkValueType(constantToken, maxValue, maxType);

            // Are the min and max value types valid?
            if ((minType === undefined) || (maxType === undefined)) {
                SubrangeTypeParser.errorHandler.flag(constantToken, PascalErrorCode.INCOMPATIBLE_TYPES, this);
            }

            // Are the min and max value types the same?
            else if (minType !== maxType) {
                SubrangeTypeParser.errorHandler.flag(constantToken, PascalErrorCode.INVALID_SUBRANGE_TYPE, this);
            }

            // Min value > max value?
            else if ((minValue !== undefined) && (maxValue !== undefined) &&
                     (Math.floor(<number> minValue) >= Math.floor(<number> maxValue))) {
                SubrangeTypeParser.errorHandler.flag(constantToken, PascalErrorCode.MIN_GT_MAX, this);
            }
        }
        else {
            SubrangeTypeParser.errorHandler.flag(constantToken, PascalErrorCode.INVALID_SUBRANGE_TYPE, this);
        }

        subrangeType.setAttribute(TypeKeyImpl.SUBRANGE_BASE_TYPE, minType);
        subrangeType.setAttribute(TypeKeyImpl.SUBRANGE_MIN_VALUE, minValue);
        subrangeType.setAttribute(TypeKeyImpl.SUBRANGE_MAX_VALUE, maxValue);

        return subrangeType;
    }

    /**
     * Check a value of a type specification.
     * @param token the current token.
     * @param value the value.
     * @param type the type specifiction.
     * @return the value.
     */
    private checkValueType(token : Token, value : Object, type : TypeSpec) : Object{
        if (type === undefined) {
            return value;
        }
        if (type === Predefined.integerType) {
            return value;
        }
        else if (type === Predefined.charType) {
            let ch :string = (<string> value).charAt(0);
            return Number(ch);;
        }
        else if (type.getForm() === TypeFormImpl.ENUMERATION) {
            return value;
        }
        else {
            SubrangeTypeParser.errorHandler.flag(token, PascalErrorCode.INVALID_SUBRANGE_TYPE, this);
            return value;
        }
    }
}







export class VariableDeclarationsParser extends DeclarationsParser {
    private definition : Definition;  // how to define the identifier

    // Synchronization set for a variable identifier.
    static IDENTIFIER_SET : List<PascalTokenType> =
        DeclarationsParser.VAR_START_SET.clone();
    
    // Synchronization set to start a sublist identifier.
    static IDENTIFIER_START_SET : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.IDENTIFIER, 
            PascalTokenType.COMMA]);

    // Synchronization set to follow a sublist identifier.
    private static IDENTIFIER_FOLLOW_SET : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.COLON, 
            PascalTokenType.SEMICOLON]);
    
    // Synchronization set for the , token.
    private static COMMA_SET : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.COMMA, 
            PascalTokenType.COLON, 
            PascalTokenType.IDENTIFIER, 
            PascalTokenType.SEMICOLON]);

    // Synchronization set for the : token.
    private static COLON_SET : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.COLON, 
            PascalTokenType.SEMICOLON]);

    // Synchronization set for the start of the next definition or declaration.
    static NEXT_START_SET : List<PascalTokenType>=
        DeclarationsParser.ROUTINE_START_SET.clone();

    static initialize() : void {
        VariableDeclarationsParser.IDENTIFIER_SET.add(PascalTokenType.IDENTIFIER);
        VariableDeclarationsParser.IDENTIFIER_SET.add(PascalTokenType.END);
        VariableDeclarationsParser.IDENTIFIER_SET.add(PascalTokenType.SEMICOLON);

        VariableDeclarationsParser.IDENTIFIER_FOLLOW_SET.addAll(DeclarationsParser.VAR_START_SET);

        VariableDeclarationsParser.NEXT_START_SET.add(PascalTokenType.IDENTIFIER);
        VariableDeclarationsParser.NEXT_START_SET.add(PascalTokenType.SEMICOLON);
    }

    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    /**
     * Setter.
     * @param definition the definition to set.
     */
    public setDefinition(definition : Definition) : void{
        this.definition = definition;
    }

    /**
     * Parse variable declarations.
     * @param token the initial token.
     * @param parentId the symbol table entry of the parent routine's name.
     * @return undefined
     * @throws Exception if an error occurred.
     */
    public parse(token : Token, parentId : SymTabEntry) : SymTabEntry {
        token = this.synchronize(VariableDeclarationsParser.IDENTIFIER_SET);
        
        // Loop to parse a sequence of variable declarations
        // separated by semicolons.
        while (token.getType() === PascalTokenType.IDENTIFIER) {
            // Parse the identifier sublist and its type specification.
            this.parseIdentifierSublist(
                token, 
                VariableDeclarationsParser.IDENTIFIER_FOLLOW_SET, 
                VariableDeclarationsParser.COMMA_SET
            );

            token = this.currentToken();
            let tokenType : TokenType = token.getType();

            // Look for one or more semicolons after a definition.
            if (tokenType === PascalTokenType.SEMICOLON) {
                while (token.getType() === PascalTokenType.SEMICOLON) {
                    token = this.nextToken();  // consume the ;
                }
            }

            // If at the start of the next definition or declaration,
            // then missing a semicolon.
            else if (VariableDeclarationsParser.NEXT_START_SET.contains(tokenType as PascalTokenType)) {
                VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode.MISSING_SEMICOLON, this);
            }

            token = this.synchronize(VariableDeclarationsParser.IDENTIFIER_SET);
        }

        return undefined;
    }

    /**
     * Parse a sublist of identifiers and their type specification.
     * @param token the current token.
     * @param followSet the synchronization set to follow an identifier.
     * @return the sublist of identifiers in a declaration.
     * @throws Exception if an error occurred.
     */
    public parseIdentifierSublist(
        token : Token,
        followSet : List<PascalTokenType>,
        commaSet : List<PascalTokenType>) : List<SymTabEntry>
    {
        let sublist : List<SymTabEntry> = new List<SymTabEntry>();

        do {
            token = this.synchronize(VariableDeclarationsParser.IDENTIFIER_START_SET);
            let id : SymTabEntry = this.parseIdentifier(token);

            if (id !== undefined) {
                sublist.add(id);
            }

            token = this.synchronize(commaSet);
            let tokenType : TokenType = token.getType();

            // Look for the comma.
            if (tokenType === PascalTokenType.COMMA) {
                token = this.nextToken();  // consume the comma

                if (followSet.contains(token.getType() as PascalTokenType)) {
                   
                    VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode.MISSING_IDENTIFIER, this);
                }
            }
            else if (VariableDeclarationsParser.IDENTIFIER_START_SET.contains(tokenType as PascalTokenType)) {
                VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode.MISSING_COMMA, this);
            }
        } while (!followSet.contains(token.getType() as PascalTokenType));

        if (this.definition !== DefinitionImpl.PROGRAM_PARM) {

            // Parse the type specification.
            let type : TypeSpec = this.parseTypeSpec(token);

            // Assign the type specification to each identifier in the list.
            for (let i = 0; i < sublist.size(); i++) {
                sublist.index(i).setTypeSpec(type);
            }
        }

        return sublist;
    }

    /**
     * Parse an identifier.
     * @param token the current token.
     * @return the symbol table entry of the identifier.
     * @throws Exception if an error occurred.
     */
    private parseIdentifier(token : Token) : SymTabEntry {
        let id : SymTabEntry = undefined;

        if (token.getType() === PascalTokenType.IDENTIFIER) {
            let name : string = token.getText().toLowerCase();
            id = VariableDeclarationsParser.symTabStack.lookupLocal(name);

            // Enter a new identifier into the symbol table.
            if (id === undefined) {
                id = VariableDeclarationsParser.symTabStack.enterLocal(name);
                id.setDefinition(this.definition);
                id.appendLineNumber(token.getLineNumber());

                // Set its slot number in the local variables array.
                let slot : number = id.getSymTab().nextSlotNumber();
                id.setAttribute(SymTabKeyImpl.SLOT, slot);
            }
            else {
                VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_REDEFINED, this);
            }

            token = this.nextToken();   // consume the identifier token
        }
        else {
            VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode.MISSING_IDENTIFIER, this);
        }

        return id;
    }

    /**
     * Parse the type specification.
     * @param token the current token.
     * @return the type specification.
     * @throws Exception if an error occurs.
     */
    public parseTypeSpec(token : Token) : TypeSpec {
        // Synchronize on the : token.
        token = this.synchronize(VariableDeclarationsParser.COLON_SET);
        if (token.getType() === PascalTokenType.COLON) {
            token = this.nextToken(); // consume the :
        }
        else {
            VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode.MISSING_COLON, this);
        }

        // Parse the type specification.
        let typeSpecificationParser : TypeSpecificationParser =
            new TypeSpecificationParser(this);
        let type : TypeSpec = typeSpecificationParser.parse(token);

        // Formal parameters and functions must have named types.
        if ((this.definition !== DefinitionImpl.VARIABLE) && 
            (this.definition !== DefinitionImpl.FIELD) &&
            (type !== undefined) && (type.getIdentifier() === undefined))
        {
            VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode.INVALID_TYPE, this);
        }

        return type;
    }
}

VariableDeclarationsParser.initialize();








export class ExpressionParser extends StatementParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    // Synchronization set for starting an expression.
    static EXPR_START_SET : List<PascalTokenType> =
        new List<PascalTokenType> ([
            PascalTokenType.PLUS, 
            PascalTokenType.MINUS, 
            PascalTokenType.IDENTIFIER, 
            PascalTokenType.INTEGER, 
            PascalTokenType.REAL, 
            PascalTokenType.STRING,
            PascalTokenType.NOT, 
            PascalTokenType.LEFT_PAREN]);

    // Set of relational operators.
    private static REL_OPS : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.EQUALS, 
            PascalTokenType.NOT_EQUALS, 
            PascalTokenType.LESS_THAN, 
            PascalTokenType.LESS_EQUALS,
            PascalTokenType.GREATER_THAN, 
            PascalTokenType.GREATER_EQUALS]);

    // Map relational operator tokens to node types.
    private static REL_OPS_MAP : HashMap<PascalTokenType, ICodeNodeType> = 
        new HashMap<PascalTokenType, ICodeNodeType>();

    // Set of additive operators.
    private static ADD_OPS : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.PLUS, 
            PascalTokenType.MINUS, 
            PascalTokenType.OR]);

    // Map additive operator tokens to node types.
    private static ADD_OPS_OPS_MAP : HashMap<PascalTokenType, ICodeNodeTypeImpl> =
        new HashMap<PascalTokenType, ICodeNodeTypeImpl>();
    
    // Set of multiplicative operators.
    private static MULT_OPS : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.STAR, 
            PascalTokenType.SLASH, 
            PascalTokenType.DIV, 
            PascalTokenType.MOD, 
            PascalTokenType.AND]);

    // Map multiplicative operator tokens to node types.
    private static MULT_OPS_OPS_MAP : HashMap<PascalTokenType, ICodeNodeType> = 
        new HashMap<PascalTokenType, ICodeNodeType>();

    static initialize() : void {
        ExpressionParser.REL_OPS_MAP.put(
            PascalTokenType.EQUALS, ICodeNodeTypeImpl.EQ);
        ExpressionParser.REL_OPS_MAP.put(
            PascalTokenType.NOT_EQUALS, ICodeNodeTypeImpl.NE);
        ExpressionParser.REL_OPS_MAP.put(
            PascalTokenType.LESS_THAN, ICodeNodeTypeImpl.LT);
        ExpressionParser.REL_OPS_MAP.put(
            PascalTokenType.LESS_EQUALS, ICodeNodeTypeImpl.LE);
        ExpressionParser.REL_OPS_MAP.put(
            PascalTokenType.GREATER_THAN, ICodeNodeTypeImpl.GT);
        ExpressionParser.REL_OPS_MAP.put(
            PascalTokenType.GREATER_EQUALS, ICodeNodeTypeImpl.GE);

        ExpressionParser.ADD_OPS_OPS_MAP.put(
            PascalTokenType.PLUS, ICodeNodeTypeImpl.ADD);
        ExpressionParser.ADD_OPS_OPS_MAP.put(
            PascalTokenType.MINUS, ICodeNodeTypeImpl.SUBTRACT);
        ExpressionParser.ADD_OPS_OPS_MAP.put(
            PascalTokenType.OR, ICodeNodeTypeImpl.OR);

        ExpressionParser.MULT_OPS_OPS_MAP.put(
            PascalTokenType.STAR, ICodeNodeTypeImpl.MULTIPLY);
        ExpressionParser.MULT_OPS_OPS_MAP.put(
            PascalTokenType.SLASH, ICodeNodeTypeImpl.FLOAT_DIVIDE);
        ExpressionParser.MULT_OPS_OPS_MAP.put(
            PascalTokenType.DIV, ICodeNodeTypeImpl.INTEGER_DIVIDE);
        ExpressionParser.MULT_OPS_OPS_MAP.put(
            PascalTokenType.MOD, ICodeNodeTypeImpl.MOD);
        ExpressionParser.MULT_OPS_OPS_MAP.put(
            PascalTokenType.AND, ICodeNodeTypeImpl.AND);
    };

    /**
     * Parse an expression.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : ICodeNode {
        return this.parseExpression(token);
    }

    /**
     * Parse an expression.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    private parseExpression(token : Token) : ICodeNode {
        // Parse a simple expression and make the root of its tree
        // the root node.
        let rootNode : ICodeNode = this.parseSimpleExpression(token);
        let resultType : TypeSpec = rootNode !== undefined ? rootNode.getTypeSpec()
                                               : Predefined.undefinedType;

        token = this.currentToken();
        let tokenType : TokenType = token.getType();

        // Look for a relational operator.
        if (ExpressionParser.REL_OPS.contains(<PascalTokenType>tokenType)) {

            // Create a new operator node and adopt the current tree
            // as its first child.
            let nodeType : ICodeNodeType = ExpressionParser.REL_OPS_MAP.get(<PascalTokenType>tokenType);
            let opNode : ICodeNode = ICodeFactory.createICodeNode(nodeType);
            opNode.addChild(rootNode);

            token = this.nextToken();  // consume the operator

            // Parse the second simple expression.  The operator node adopts
            // the simple expression's tree as its second child.
            let simExprNode : ICodeNode = this.parseSimpleExpression(token);
            opNode.addChild(simExprNode);

            // The operator node becomes the new root node.
            rootNode = opNode;

            // Type check: The operands must be comparison compatible.
            let simExprType : TypeSpec = simExprNode !== undefined
                                       ? simExprNode.getTypeSpec()
                                       : Predefined.undefinedType;
            if (TypeChecker.areComparisonCompatible(resultType, simExprType)) {
                resultType = Predefined.booleanType;
            }
            else {
                ExpressionParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
                resultType = Predefined.undefinedType;
            }
        }

        if (rootNode !== undefined) {
            rootNode.setTypeSpec(resultType);
        }

        return rootNode;
    }

    /**
     * Parse a simple expression.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    private parseSimpleExpression(token : Token) : ICodeNode{
        let signToken : Token = undefined;
        let signType : TokenType = undefined;  // type of leading sign (if any)

        // Look for a leading + or - sign.
        let tokenType : TokenType = token.getType();
        if ((tokenType === PascalTokenType.PLUS) || (tokenType === PascalTokenType.MINUS)) {
            signType = tokenType;
            signToken = token;
            token = this.nextToken();  // consume the + or -
        }

        // Parse a term and make the root of its tree the root node.
        let rootNode : ICodeNode = this.parseTerm(token);
        let resultType : TypeSpec = rootNode !== undefined ? rootNode.getTypeSpec()
                                               : Predefined.undefinedType;

        // Type check: Leading sign.
        if ((signType !== undefined) && (!TypeChecker.isIntegerOrReal(resultType))) {
            ExpressionParser.errorHandler.flag(signToken, PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }

        // Was there a leading - sign?
        if (signType === PascalTokenType.MINUS) {

            // Create a NEGATE node and adopt the current tree
            // as its child. The NEGATE node becomes the new root node.
            let negateNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.NEGATE);
            negateNode.addChild(rootNode);
            negateNode.setTypeSpec(rootNode.getTypeSpec());
            rootNode = negateNode;
        }

        token = this.currentToken();
        tokenType = token.getType();

        // Loop over additive operators.
        while (ExpressionParser.ADD_OPS.contains(<PascalTokenType>tokenType)) {
            let operator : PascalTokenType = <PascalTokenType>tokenType;

            // Create a new operator node and adopt the current tree
            // as its first child.
            let nodeType : ICodeNodeType = ExpressionParser.ADD_OPS_OPS_MAP.get(<PascalTokenType>operator);
            let opNode : ICodeNode = ICodeFactory.createICodeNode(nodeType);
            opNode.addChild(rootNode);

            token = this.nextToken();  // consume the operator

            // Parse another term.  The operator node adopts
            // the term's tree as its second child.
            let termNode : ICodeNode = this.parseTerm(token);
            opNode.addChild(termNode);
            let termType : TypeSpec = termNode !== undefined ? termNode.getTypeSpec()
                                                 : Predefined.undefinedType;

            // The operator node becomes the new root node.
            rootNode = opNode;

            // Determine the result type.
            switch (<PascalTokenType> operator) {

                case PascalTokenType.PLUS:
                case PascalTokenType.MINUS: {
                    // Both operands integer ==> integer result.
                    if (TypeChecker.areBothInteger(resultType, termType)) {
                        resultType = Predefined.integerType;
                    }

                    // Both real operands or one real and one integer operand
                    // ==> real result.
                    else if (TypeChecker.isAtLeastOneReal(resultType,
                                                          termType)) {
                        resultType = Predefined.realType;
                    }

                    else {
                        ExpressionParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }

                    break;
                }

                case PascalTokenType.OR: {
                    // Both operands boolean ==> boolean result.
                    if (TypeChecker.areBothBoolean(resultType, termType)) {
                        resultType = Predefined.booleanType;
                    }
                    else {
                        ExpressionParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }

                    break;
                }
            }

            rootNode.setTypeSpec(resultType);

            token = this.currentToken();
            tokenType = token.getType();
        }

        return rootNode;
    }

    /**
     * Parse a term.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    private parseTerm(token : Token) : ICodeNode {

        // Parse a factor and make its node the root node.
        let rootNode : ICodeNode = this.parseFactor(token);

        let resultType : TypeSpec = rootNode !== undefined ? rootNode.getTypeSpec()
                                               : Predefined.undefinedType;
        token = this.currentToken();

        let tokenType : TokenType = token.getType();
        

        // Loop over multiplicative operators.
        while (ExpressionParser.MULT_OPS.contains(<PascalTokenType>tokenType)) {
            let operator : TokenType = tokenType;

            // Create a new operator node and adopt the current tree
            // as its first child.
            let nodeType : ICodeNodeType = ExpressionParser.MULT_OPS_OPS_MAP.get(<PascalTokenType>operator);
            let opNode : ICodeNode = ICodeFactory.createICodeNode(nodeType);
            opNode.addChild(rootNode);

            token = this.nextToken();  // consume the operator

            // Parse another factor.  The operator node adopts
            // the term's tree as its second child.
            let factorNode : ICodeNode = this.parseFactor(token);
            opNode.addChild(factorNode);
            let factorType : TypeSpec = factorNode !== undefined ? factorNode.getTypeSpec()
                                                     : Predefined.undefinedType;

            // The operator node becomes the new root node.
            rootNode = opNode;

            // Determine the result type.
            switch (<PascalTokenType> operator) {

                case PascalTokenType.STAR: {
                    // Both operands integer ==> integer result.
                    if (TypeChecker.areBothInteger(resultType, factorType)) {
                        resultType = Predefined.integerType;
                    }

                    // Both real operands or one real and one integer operand
                    // ==> real result.
                    else if (TypeChecker.isAtLeastOneReal(resultType,
                                                          factorType)) {
                        resultType = Predefined.realType;
                    }

                    else {
                        ExpressionParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }

                    break;
                }

                case PascalTokenType.SLASH: {
                    // All integer and real operand combinations
                    // ==> real result.
                    if (TypeChecker.areBothInteger(resultType, factorType) ||
                        TypeChecker.isAtLeastOneReal(resultType, factorType))
                    {
                        resultType = Predefined.realType;
                    }
                    else {
                        ExpressionParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }

                    break;
                }

                case PascalTokenType.DIV:
                case PascalTokenType.MOD: {
                    // Both operands integer ==> integer result.
                    if (TypeChecker.areBothInteger(resultType, factorType)) {
                        resultType = Predefined.integerType;
                    }
                    else {
                        ExpressionParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }

                    break;
                }

                case PascalTokenType.AND: {
                    // Both operands boolean ==> boolean result.
                    if (TypeChecker.areBothBoolean(resultType, factorType)) {
                        resultType = Predefined.booleanType;
                    }
                    else {
                        ExpressionParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }

                    break;
                }
            }

            rootNode.setTypeSpec(resultType);

            token = this.currentToken();
            tokenType = token.getType();
        }

        return rootNode;
    }

    /**
     * Parse a factor.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    private parseFactor(token : Token) : ICodeNode {
        let tokenType : TokenType = token.getType();
        let rootNode : ICodeNode = undefined;

        switch (<PascalTokenType> tokenType) {
            case PascalTokenType.IDENTIFIER: {
                return this.parseIdentifier(token);
            }

            case PascalTokenType.INTEGER: {
                // Create an INTEGER_CONSTANT node as the root node.
                rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.INTEGER_CONSTANT);
                rootNode.setAttribute(ICodeKeyImpl.VALUE, token.getValue());

                token = this.nextToken();  // consume the number

                rootNode.setTypeSpec(Predefined.integerType);
                break;
            }

            case PascalTokenType.REAL: {
                // Create an REAL_CONSTANT node as the root node.
                rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.REAL_CONSTANT);
                rootNode.setAttribute(ICodeKeyImpl.VALUE, token.getValue());

                token = this.nextToken();  // consume the number

                rootNode.setTypeSpec(Predefined.realType);
                break;
            }

            case PascalTokenType.STRING: {
                let value : string = <string> token.getValue();

                // Create a.STRING_CONSTANT node as the root node.
                rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.STRING_CONSTANT);
                rootNode.setAttribute(ICodeKeyImpl.VALUE, value);

                let resultType : TypeSpec = value.length === 1
                                          ? Predefined.charType
                                          : TypeFactory.createStringType(value);

                token = this.nextToken();  // consume the string

                rootNode.setTypeSpec(resultType);
                break;
            }

            case PascalTokenType.NOT: {
                token = this.nextToken();  // consume the NOT

                // Create a NOT node as the root node.
                rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.NOT);

                // Parse the factor.  The NOT node adopts the
                // factor node as its child.
                let factorNode : ICodeNode = this.parseFactor(token);
                rootNode.addChild(factorNode);

                // Type check: The factor must be boolean.
                let factorType : TypeSpec = factorNode !== undefined
                                          ? factorNode.getTypeSpec()
                                          : Predefined.undefinedType;
                if (!TypeChecker.isBoolean(factorType)) {
                    ExpressionParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
                }

                rootNode.setTypeSpec(Predefined.booleanType);
                break;
            }

            case PascalTokenType.LEFT_PAREN: {
                token = this.nextToken();      // consume the (

                // Parse an expression and make its node the root node.
                rootNode = this.parseExpression(token);
                let resultType : TypeSpec = rootNode !== undefined
                                          ? rootNode.getTypeSpec()
                                          : Predefined.undefinedType;

                // Look for the matching ) token.
                token = this.currentToken();
                if (token.getType() === PascalTokenType.RIGHT_PAREN) {
                    token = this.nextToken();  // consume the )
                }
                else {
                    ExpressionParser.errorHandler.flag(token, PascalErrorCode.MISSING_RIGHT_PAREN, this);
                }

                rootNode.setTypeSpec(resultType);
                break;
            }

            default: {
                ExpressionParser.errorHandler.flag(token, PascalErrorCode.UNEXPECTED_TOKEN, this);
            }
        }

        return rootNode;
    }

    /**
     * Parse an identifier.
     * @param token the current token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    private parseIdentifier(token : Token) : ICodeNode {
        let rootNode : ICodeNode = undefined;

        // Look up the identifier in the symbol table stack.
        let name : string = token.getText().toLowerCase();
        let id : SymTabEntry = ExpressionParser.symTabStack.lookup(name);

        // Undefined.
        if (id === undefined) {
            ExpressionParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_UNDEFINED, this);
            id = ExpressionParser.symTabStack.enterLocal(name);
            id.setDefinition(DefinitionImpl.UNDEFINED);
            id.setTypeSpec(Predefined.undefinedType);
        }

        let defnCode : Definition = id.getDefinition();

        switch (<DefinitionImpl> defnCode) {

            case DefinitionImpl.CONSTANT: {
                let value : Object = id.getAttribute(SymTabKeyImpl.CONSTANT_VALUE);
                let type : TypeSpec = id.getTypeSpec();

                if (Util.isInteger(value)) {
                    rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.INTEGER_CONSTANT);
                    rootNode.setAttribute(ICodeKeyImpl.VALUE, value);
                }
                else if (Util.isFloat(value)) {
                    rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.REAL_CONSTANT);
                    rootNode.setAttribute(ICodeKeyImpl.VALUE, value);
                }
                else if (value instanceof String) {
                    rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.STRING_CONSTANT);
                    rootNode.setAttribute(ICodeKeyImpl.VALUE, value);
                }

                id.appendLineNumber(token.getLineNumber());
                token = this.nextToken();  // consume the constant identifier

                if (rootNode !== undefined) {
                    rootNode.setTypeSpec(type);
                }

                break;
            }

            case DefinitionImpl.ENUMERATION_CONSTANT: {
                let value : Object = id.getAttribute(SymTabKeyImpl.CONSTANT_VALUE);
                let type : TypeSpec = id.getTypeSpec();

                rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.INTEGER_CONSTANT);
                rootNode.setAttribute(ICodeKeyImpl.VALUE, value);

                id.appendLineNumber(token.getLineNumber());
                token = this.nextToken();  // consume the enum constant identifier

                rootNode.setTypeSpec(type);
                break;
            }

            case DefinitionImpl.FUNCTION: {
                let callParser : CallParser = new CallParser(this);
                rootNode = callParser.parse(token);
                break;
            }

            default: {
                let variableParser : VariableParser = new VariableParser(this);
                rootNode = variableParser.parse(token, id);
                break;
            }
        }
        return rootNode;
    }
}

ExpressionParser.initialize();








export class AssignmentStatementParser extends StatementParser {
    // Set to true to parse a function name
    // as the target of an assignment.
    private isFunctionTarget : boolean = false;

    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    // Synchronization set for the := token.
    private static COLON_EQUALS_SET : List<PascalTokenType> =
        ExpressionParser.EXPR_START_SET.clone();

    public static initialize() : void {
        AssignmentStatementParser.COLON_EQUALS_SET.add(PascalTokenType.COLON_EQUALS);
        AssignmentStatementParser.COLON_EQUALS_SET.addAll(StatementParser.STMT_FOLLOW_SET);
    }

    /**
     * Parse an assignment statement.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : ICodeNode{
        // Create the ASSIGN node.
        let assignNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.ASSIGN);

        // Parse the target variable.
        let variableParser : VariableParser = new VariableParser(this);
        let targetNode : ICodeNode = this.isFunctionTarget
                               ? variableParser.parseFunctionNameTarget(token)
                               : variableParser.parse(token);
        let targetType : TypeSpec = targetNode !== undefined ? targetNode.getTypeSpec()
                                                 : Predefined.undefinedType;

        // The ASSIGN node adopts the variable node as its first child.
        assignNode.addChild(targetNode);

        // Synchronize on the := token.
        token = this.synchronize(AssignmentStatementParser.COLON_EQUALS_SET);
        if (token.getType() === PascalTokenType.COLON_EQUALS) {
            token = this.nextToken();  // consume the :=
        }
        else {
            AssignmentStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_COLON_EQUALS, this);
        }

        // Parse the expression.  The ASSIGN node adopts the expression's
        // node as its second child.
        let expressionParser : ExpressionParser = new ExpressionParser(this);
        
        let exprNode : ICodeNode = expressionParser.parse(token);
        assignNode.addChild(exprNode);

        // Type check: Assignment compatible?
        let exprType : TypeSpec = exprNode !== undefined ? exprNode.getTypeSpec()
                                             : Predefined.undefinedType;
        if (!TypeChecker.areAssignmentCompatible(targetType, exprType)) {
            AssignmentStatementParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }

        assignNode.setTypeSpec(targetType);
        return assignNode;
    }

    /**
     * Parse an assignment to a function name.
     * @param token Token
     * @return ICodeNode
     * @throws Exception
     */
    public parseFunctionNameAssignment(token : Token) : ICodeNode{
        this.isFunctionTarget = true;
        return this.parse(token);
    }
}

AssignmentStatementParser.initialize();








export class ForStatementParser extends StatementParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    // Synchronization set for PascalTokenType.TO or PascalTokenType.DOWNTO.
    private static TO_DOWNTO_SET : List<PascalTokenType> =
        ExpressionParser.EXPR_START_SET.clone();

    // Synchronization set for DO.
    private static DO_SET : List<PascalTokenType> =
        StatementParser.STMT_START_SET.clone();
    
    static initialize() : void {
        ForStatementParser.TO_DOWNTO_SET.add(PascalTokenType.TO);
        ForStatementParser.TO_DOWNTO_SET.add(PascalTokenType.DOWNTO);
        ForStatementParser.TO_DOWNTO_SET.addAll(StatementParser.STMT_FOLLOW_SET);

        ForStatementParser.DO_SET.add(PascalTokenType.DO);
        ForStatementParser.DO_SET.addAll(StatementParser.STMT_FOLLOW_SET);
    }

    /**
     * Parse the FOR statement.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : ICodeNode{
        token = this.nextToken();  // consume the FOR
        let targetToken : Token = token;

        // Create the loop COMPOUND, LOOP, and TEST nodes.
        let compoundNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.COMPOUND);
        let loopNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.LOOP);
        let testNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.TEST);

        // Parse the embedded initial assignment.
        let assignmentParser : AssignmentStatementParser =
            new AssignmentStatementParser(this);
        let initAssignNode : ICodeNode = assignmentParser.parse(token);
        let controlType : TypeSpec = initAssignNode !== undefined
                                   ? initAssignNode.getTypeSpec()
                                   : Predefined.undefinedType;

        // Set the current line number attribute.
        this.setLineNumber(initAssignNode, targetToken);

        // Type check: The control variable's type must be integer
        //             or enumeration.
        if (!TypeChecker.isInteger(controlType) &&
            (controlType.getForm() !== TypeFormImpl.ENUMERATION))
        {
            ForStatementParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }

        // The COMPOUND node adopts the initial ASSIGN and the LOOP nodes
        // as its first and second children.
        compoundNode.addChild(initAssignNode);
        compoundNode.addChild(loopNode);

        // Synchronize at the PascalTokenType.TO or PascalTokenType.DOWNTO.
        token = this.synchronize(ForStatementParser.TO_DOWNTO_SET);
        let direction : TokenType = token.getType();

        // Look for the PascalTokenType.TO or PascalTokenType.DOWNTO.
        if ((direction === PascalTokenType.TO) || (direction === PascalTokenType.DOWNTO)) {
            token = this.nextToken();  // consume the PascalTokenType.TO or PascalTokenType.DOWNTO
        }
        else {
            direction = PascalTokenType.TO;
            ForStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_TO_DOWNTO, this);
        }

        // Create a relational operator node: GT for PascalTokenType.TO, or LT for PascalTokenType.DOWNTO.
        let relOpNode : ICodeNode = ICodeFactory.createICodeNode(direction === PascalTokenType.TO
                                                           ? ICodeNodeTypeImpl.GT : ICodeNodeTypeImpl.LT);
        relOpNode.setTypeSpec(Predefined.booleanType);

        // Copy the control VARIABLE node. The relational operator
        // node adopts the copied VARIABLE node as its first child.
        let controlVarNode : ICodeNode = initAssignNode.getChildren().get(0);
        relOpNode.addChild(controlVarNode.copy());

        // Parse the termination expression. The relational operator node
        // adopts the expression as its second child.
        let expressionParser : ExpressionParser = new ExpressionParser(this);
        let exprNode : ICodeNode = expressionParser.parse(token);
        relOpNode.addChild(exprNode);

        // Type check: The termination expression type must be assignment
        //             compatible with the control variable's type.
        let exprType : TypeSpec = exprNode !== undefined ? exprNode.getTypeSpec()
                                             : Predefined.undefinedType;
        if (!TypeChecker.areAssignmentCompatible(controlType, exprType)) {
            ForStatementParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }

        // The TEST node adopts the relational operator node as its only child.
        // The LOOP node adopts the TEST node as its first child.
        testNode.addChild(relOpNode);
        loopNode.addChild(testNode);

        // Synchronize at the DO.
        token = this.synchronize(ForStatementParser.DO_SET);
        if (token.getType() === PascalTokenType.DO) {
            token = this.nextToken();  // consume the DO
        }
        else {
            ForStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_DO, this);
        }

        // Parse the nested statement. The LOOP node adopts the statement
        // node as its second child.
        let statementParser : StatementParser = new StatementParser(this);
        loopNode.addChild(statementParser.parse(token));

        // Create an assignment with a copy of the control variable
        // to advance the value of the variable.
        let nextAssignNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.ASSIGN);
        nextAssignNode.setTypeSpec(controlType);
        nextAssignNode.addChild(controlVarNode.copy());

        // Create the arithmetic operator node:
        // ADD for PascalTokenType.TO, or SUBTRACT for PascalTokenType.DOWNTO.
        let arithOpNode : ICodeNode = ICodeFactory.createICodeNode(direction === PascalTokenType.TO
                                                             ? ICodeNodeTypeImpl.ADD : ICodeNodeTypeImpl.SUBTRACT);
        arithOpNode.setTypeSpec(Predefined.integerType);

        // The next operator node adopts a copy of the loop variable as its
        // first child and the value 1 as its second child.
        arithOpNode.addChild(controlVarNode.copy());
        let oneNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.INTEGER_CONSTANT);
        oneNode.setAttribute(ICodeKeyImpl.VALUE, 1);
        oneNode.setTypeSpec(Predefined.integerType);
        arithOpNode.addChild(oneNode);

        // The next ASSIGN node adopts the arithmetic operator node as its
        // second child. The loop node adopts the next ASSIGN node as its
        // third child.
        nextAssignNode.addChild(arithOpNode);
        loopNode.addChild(nextAssignNode);

        // Set the current line number attribute.
        this.setLineNumber(nextAssignNode, targetToken);

        return compoundNode;
    }
}









export class WhileStatementParser extends StatementParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    // Synchronization set for DO.
    private static DO_SET : List<PascalTokenType> =
        StatementParser.STMT_START_SET.clone();
    static initialize() : void {
        WhileStatementParser.DO_SET.add(PascalTokenType.DO);
        WhileStatementParser.DO_SET.addAll(StatementParser.STMT_FOLLOW_SET);
    }

    /**
     * Parse a WHILE statement.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : ICodeNode{
        token = this.nextToken();  // consume the WHILE

        // Create LOOP, TEST, and NOT nodes.
        let loopNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.LOOP);
        let breakNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.TEST);
        let notNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.NOT);

        // The LOOP node adopts the TEST node as its first child.
        // The TEST node adopts the NOT node as its only child.
        loopNode.addChild(breakNode);
        breakNode.addChild(notNode);

        // Parse the expression.
        // The NOT node adopts the expression subtree as its only child.
        let expressionParser : ExpressionParser = new ExpressionParser(this);
        let exprNode : ICodeNode = expressionParser.parse(token);
        notNode.addChild(exprNode);

        // Type check: The test expression must be boolean.
        let exprType : TypeSpec = exprNode !== undefined ? exprNode.getTypeSpec()
                                             : Predefined.undefinedType;
        if (!TypeChecker.isBoolean(exprType)) {
            WhileStatementParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }

        // this.synchronize at the DO.
        token = this.synchronize(WhileStatementParser.DO_SET);
        if (token.getType() === PascalTokenType.DO) {
            token = this.nextToken();  // consume the DO
        }
        else {
            WhileStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_DO, this);
        }

        // Parse the statement.
        // The LOOP node adopts the statement subtree as its second child.
        let statementParser : StatementParser = new StatementParser(this);
        loopNode.addChild(statementParser.parse(token));

        return loopNode;
    }
}

WhileStatementParser.initialize();








export class IfStatementParser extends StatementParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    // Synchronization set for THEN.
    private static THEN_SET : List<PascalTokenType> =
        StatementParser.STMT_START_SET.clone();

    static initialize() : void {
        IfStatementParser.THEN_SET.add(PascalTokenType.THEN);
        IfStatementParser.THEN_SET.addAll(StatementParser.STMT_FOLLOW_SET);
    }

    /**
     * Parse an IF statement.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : ICodeNode {
        token = this.nextToken();  // consume the IF
        
        // Create an IF node.
        let ifNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.IF);

        // Parse the expression.
        // The IF node adopts the expression subtree as its first child.
        let expressionParser : ExpressionParser = new ExpressionParser(this);
        let exprNode : ICodeNode = expressionParser.parse(token);
        ifNode.addChild(exprNode);

        // Type check: The expression type must be boolean.
        let exprType : TypeSpec = exprNode !== undefined ? exprNode.getTypeSpec()
                                             : Predefined.undefinedType;
        if (!TypeChecker.isBoolean(exprType)) {
            IfStatementParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }

        // this.synchronize at the THEN.
        token = this.synchronize(IfStatementParser.THEN_SET);
        if (token.getType() === PascalTokenType.THEN) {
            token = this.nextToken();  // consume the THEN
        }
        else {
            IfStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_THEN, this);
        }

        // Parse the THEN statement.
        // The IF node adopts the statement subtree as its second child.
        let statementParser : StatementParser = new StatementParser(this);
        ifNode.addChild(statementParser.parse(token));
        token = this.currentToken();

        // Look for an ELSE.
        if (token.getType() === PascalTokenType.ELSE) {
            token = this.nextToken();  // consume the THEN

            // Parse the ELSE statement.
            // The IF node adopts the statement subtree as its third child.
            ifNode.addChild(statementParser.parse(token));
        }

        return ifNode;
    }
}

IfStatementParser.initialize();








export class CaseStatementParser extends StatementParser
{
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    // Synchronization set for starting a CASE option constant.
    private static CONSTANT_START_SET : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.IDENTIFIER, 
            PascalTokenType.INTEGER, 
            PascalTokenType.PLUS, 
            PascalTokenType.MINUS, 
            PascalTokenType.STRING]);

    // Synchronization set for OF.
    private static OF_SET : List<PascalTokenType> =
        CaseStatementParser.CONSTANT_START_SET.clone();
    
    // Synchronization set for COMMA.
    private static COMMA_SET : List<PascalTokenType> =
        CaseStatementParser.CONSTANT_START_SET.clone();

    static initialize() : void {
        CaseStatementParser.OF_SET.add(PascalTokenType.OF);
        CaseStatementParser.OF_SET.addAll(StatementParser.STMT_FOLLOW_SET);
        
        CaseStatementParser.COMMA_SET.add(PascalTokenType.COMMA);
        CaseStatementParser.COMMA_SET.add(PascalTokenType.COLON);
        CaseStatementParser.COMMA_SET.addAll(StatementParser.STMT_START_SET);
        CaseStatementParser.COMMA_SET.addAll(StatementParser.STMT_FOLLOW_SET);
    }

    /**
     * Parse a CASE statement.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : ICodeNode {
        token = this.nextToken();  // consume the CASE

        // Create a SELECT node.
        let selectNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.SELECT);

        // Parse the CASE expression.
        // The SELECT node adopts the expression subtree as its first child.
        let expressionParser : ExpressionParser = new ExpressionParser(this);
        let exprNode : ICodeNode = expressionParser.parse(token);
        selectNode.addChild(exprNode);

        // Type check: The CASE expression's type must be integer, character,
        //             or enumeration.
        let exprType : TypeSpec = exprNode !== undefined ? exprNode.getTypeSpec()
                                             : Predefined.undefinedType;
        if (!TypeChecker.isInteger(exprType) &&
            !TypeChecker.isChar(exprType) &&
            (exprType.getForm() !== TypeFormImpl.ENUMERATION))
        {
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }

        // this.synchronize at the OF.
        token = this.synchronize(CaseStatementParser.OF_SET);
        if (token.getType() === PascalTokenType.OF) {
            token = this.nextToken();  // consume the OF
        }
        else {
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_OF, this);
        }

        // Set of CASE branch constants.
        let constantSet : List<Object> = new List<Object>();

        // Loop to parse each CASE branch until the END token
        // or the end of the source file.
        while (!(token instanceof EofToken) && (token.getType() !== PascalTokenType.END)) {

            // The SELECT node adopts the CASE branch subtree.
            selectNode.addChild(this.parseBranch(token, exprType, constantSet));

            token = this.currentToken();
            let tokenType : TokenType = token.getType();

            // Look for the semicolon between CASE branches.
            if (tokenType === PascalTokenType.SEMICOLON) {
                token = this.nextToken();  // consume the ;
            }

            // If at the start of the next constant, then missing a semicolon.
            else if (CaseStatementParser.CONSTANT_START_SET.contains(<PascalTokenType>tokenType)) {
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_SEMICOLON, this);
            }
        }

        // Look for the END token.
        if (token.getType() === PascalTokenType.END) {
            token = this.nextToken();  // consume END
        }
        else {
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_END, this);
        }

        return selectNode;
    }

    /**
     * Parse a CASE branch.
     * @param token the current token.
     * @param expressionType the CASE expression type.
     * @param constantSet the set of CASE branch constants.
     * @return the root SELECT_BRANCH node of the subtree.
     * @throws Exception if an error occurred.
     */
    private parseBranch(
        token : Token, 
        expressionType : TypeSpec,
        constantSet : List<Object>) : ICodeNode
    {
        // Create an SELECT_BRANCH node and a SELECT_CONSTANTS node.
        // The SELECT_BRANCH node adopts the SELECT_CONSTANTS node as its
        // first child.
        let branchNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.SELECT_BRANCH);
        let constantsNode : ICodeNode =
                               ICodeFactory.createICodeNode(ICodeNodeTypeImpl.SELECT_CONSTANTS);
        branchNode.addChild(constantsNode);

        // Parse the list of CASE branch constants.
        // The SELECT_CONSTANTS node adopts each constant.
        this.parseConstantList(token, expressionType, constantsNode, constantSet);

        // Look for the : token.
        token = this.currentToken();
        if (token.getType() === PascalTokenType.COLON) {
            token = this.nextToken();  // consume the :
        }
        else {
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_COLON, this);
        }

        // Parse the CASE branch statement. The SELECT_BRANCH node adopts
        // the statement subtree as its second child.
        let statementParser : StatementParser = new StatementParser(this);
        branchNode.addChild(statementParser.parse(token));

        return branchNode;
    }

    /**
     * Parse a list of CASE branch constants.
     * @param token the current token.
     * @param expressionType the CASE expression type.
     * @param constantsNode the parent SELECT_CONSTANTS node.
     * @param constantSet the set of CASE branch constants.
     * @throws Exception if an error occurred.
     */
    private parseConstantList(
        token : Token,
        expressionType : TypeSpec,
        constantsNode : ICodeNode,
        constantSet : List<Object>) : void
    {
        // Loop to parse each constant.
        while (CaseStatementParser.CONSTANT_START_SET.contains(<PascalTokenType> token.getType())) {

            // The constants list node adopts the constant node.
            constantsNode.addChild(this.parseConstant(token, expressionType,
                                                 constantSet));

            // this.synchronize at the comma between constants.
            token = this.synchronize(CaseStatementParser.COMMA_SET);

            // Look for the comma.
            if (token.getType() === PascalTokenType.COMMA) {
                token = this.nextToken();  // consume the ,
            }

            // If at the start of the next constant, then missing a comma.
            else if (CaseStatementParser.CONSTANT_START_SET.contains(<PascalTokenType> token.getType())) {
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_COMMA, this);
            }
        }
    }

    /**
     * Parse CASE branch constant.
     * @param token the current token.
     * @param expressionType the CASE expression type.
     * @param constantSet the set of CASE branch constants.
     * @return the constant node.
     * @throws Exception if an error occurred.
     */
    private parseConstant(
        token : Token, 
        expressionType : TypeSpec,
        constantSet : List<Object>) : ICodeNode
    {
        let sign : TokenType = undefined;
        let constantNode : ICodeNode = undefined;
        let constantType : TypeSpec = undefined;

        // this.synchronize at the start of a constant.
        token = this.synchronize(CaseStatementParser.CONSTANT_START_SET);
        let tokenType : TokenType = token.getType();

        // Plus or minus sign?
        if ((tokenType === PascalTokenType.PLUS) || (tokenType === PascalTokenType.MINUS)) {
            sign = tokenType;
            token = this.nextToken();  // consume sign
        }

        // Parse the constant.
        switch (<PascalTokenType> token.getType()) {

            case PascalTokenType.IDENTIFIER: {
                constantNode = this.parseIdentifierConstant(token, sign);
                if (constantNode !== undefined) {
                    constantType = constantNode.getTypeSpec();
                }

                break;
            }

            case PascalTokenType.INTEGER: {
                constantNode = this.parseIntegerConstant(token.getText(), sign);
                constantType = Predefined.integerType;
                break;
            }

            case PascalTokenType.STRING: {
                constantNode =
                    this.parseCharacterConstant(token, <string> token.getValue(),
                                           sign);
                constantType = Predefined.charType;
                break;
            }

            default: {
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this);
                break;
            }
        }

        // Check for reused constants.
        if (constantNode !== undefined) {
            let value : Object = constantNode.getAttribute(ICodeKeyImpl.VALUE);

            if (constantSet.contains(<PascalTokenType>value)) {
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode.CASE_CONSTANT_REUSED, this);
            }
            else {
                constantSet.add(value);
            }
        }

        // Type check: The constant type must be comparison compatible
        //             with the CASE expression type.
        if (!TypeChecker.areComparisonCompatible(expressionType,
                                                 constantType)) {
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }

        token = this.nextToken();  // consume the constant

        constantNode.setTypeSpec(constantType);
        return constantNode;
    }

    /**
     * Parse an identifier CASE constant.
     * @param value the current token value string.
     * @param sign the sign, if any.
     * @return the constant node.
     */
    private parseIdentifierConstant(
        token : Token, 
        sign : TokenType) : ICodeNode
    {
        let constantNode : ICodeNode = undefined;
        let constantType : TypeSpec = undefined;

        // Look up the identifier in the symbol table stack.
        let name : string = token.getText().toLowerCase();
        let id : SymTabEntry = CaseStatementParser.symTabStack.lookup(name);

        // Undefined.
        if (id === undefined) {
            id = CaseStatementParser.symTabStack.enterLocal(name);
            id.setDefinition(DefinitionImpl.UNDEFINED);
            id.setTypeSpec(Predefined.undefinedType);
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_UNDEFINED, this);
            return undefined;
        }

        let defnCode : Definition = id.getDefinition();

        // Constant identifier.
        if ((defnCode === DefinitionImpl.CONSTANT) || (defnCode === DefinitionImpl.ENUMERATION_CONSTANT)) {
            let constantValue : Object = id.getAttribute(SymTabKeyImpl.CONSTANT_VALUE);
            constantType = id.getTypeSpec();

            // Type check: Leading sign permitted only for integer constants.
            if ((sign !== undefined) && !TypeChecker.isInteger(constantType)) {
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this);
            }

            constantNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.INTEGER_CONSTANT);
            constantNode.setAttribute(ICodeKeyImpl.VALUE, constantValue);
        }

        id.appendLineNumber(token.getLineNumber());

        if (constantNode !== undefined) {
            constantNode.setTypeSpec(constantType);
        }

        return constantNode;
    }

    /**
     * Parse an integer CASE constant.
     * @param value the current token value string.
     * @param sign the sign, if any.
     * @return the constant node.
     */
    private parseIntegerConstant(
        value : string, 
        sign : TokenType) :ICodeNode
    {
        let constantNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.INTEGER_CONSTANT);
        let intValue : number = parseInt(value);

        if (sign === PascalTokenType.MINUS) {
            intValue = -intValue;
        }

        constantNode.setAttribute(ICodeKeyImpl.VALUE, intValue);
        return constantNode;
    }

    /**
     * Parse a character CASE constant.
     * @param token the current token.
     * @param value the token value string.
     * @param sign the sign, if any.
     * @return the constant node.
     */
    private parseCharacterConstant(
        token : Token, 
        value : string,
        sign : TokenType) : ICodeNode
    {
        let constantNode : ICodeNode = undefined;

        if (sign !== undefined) {
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this);
        }
        else {
            if (value.length === 1) {
                constantNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.STRING_CONSTANT);
                constantNode.setAttribute(ICodeKeyImpl.VALUE, value);
            }
            else {
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this);
            }
        }

        return constantNode;
    }
}









export class RepeatStatementParser extends StatementParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    /**
     * Parse a REPEAT statement.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : ICodeNode {
        token = this.nextToken();  // consume the REPEAT

        // Create the LOOP and TEST nodes.
        let loopNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.LOOP);
        let testNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.TEST);

        // Parse the statement list terminated by the UNTIL token.
        // The LOOP node is the parent of the statement subtrees.
        let statementParser : StatementParser = new StatementParser(this);
        statementParser.parseList(token, loopNode, PascalTokenType.UNTIL, PascalErrorCode.MISSING_UNTIL);
        token = this.currentToken();

        // Parse the expression.
        // The TEST node adopts the expression subtree as its only child.
        let expressionParser : ExpressionParser = new ExpressionParser(this);
        let exprNode : ICodeNode = expressionParser.parse(token);
        testNode.addChild(exprNode);
        loopNode.addChild(testNode);

        // Type check: The test expression must be boolean.
        let exprType : TypeSpec = exprNode !== undefined ? exprNode.getTypeSpec()
                                             : Predefined.undefinedType;
        if (!TypeChecker.isBoolean(exprType)) {
            RepeatStatementParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }

        return loopNode;
    }
}









export class CallParser extends StatementParser {
    // Synchronization set for the , token.
    private static COMMA_SET : List<PascalTokenType> =
        ExpressionParser.EXPR_START_SET.clone();
    static initialize() : void {
        CallParser.COMMA_SET.add(PascalTokenType.COMMA);
        CallParser.COMMA_SET.add(PascalTokenType.RIGHT_PAREN);
    };

    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    /**
     * Parse a call to a declared procedure or function.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : ICodeNode {
        let pfId : SymTabEntry = CallParser.symTabStack.lookup(token.getText().toLowerCase());
        let routineCode : RoutineCode = <RoutineCode> pfId.getAttribute(SymTabKeyImpl.ROUTINE_CODE);
        let callParser : StatementParser = (routineCode === RoutineCodeImpl.DECLARED) ||
                                     (routineCode === RoutineCodeImpl.FORWARD)
                                         ? new CallDeclaredParser(this)
                                         : new CallStandardParser(this);

        return callParser.parse(token);
    }

    /**
     * Parse the actual parameters of a procedure or function call.
     * @param token the current token.
     * @param pfId the symbol table entry of the procedure or function name.
     * @param isDeclared true if parsing actual parms of a declared routine.
     * @param isReadReadln true if parsing actual parms of read or readln.
     * @param isWriteWriteln true if parsing actual parms of write or writeln.
     * @return the PARAMETERS node, or undefined if there are no actual parameters.
     * @throws Exception if an error occurred.
     */
    protected parseActualParameters (
        token : Token, pfId : SymTabEntry,
        isDeclared : boolean,
        isReadReadln : boolean,
        isWriteWriteln : boolean) : ICodeNode
    {
        let expressionParser : ExpressionParser = new ExpressionParser(this);
        let parmsNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.PARAMETERS);
        let formalParms : List<SymTabEntry> = undefined;
        let parmCount : number = 0;
        let parmIndex : number = -1;

        if (isDeclared) {
            formalParms =
                <List<SymTabEntry>> pfId.getAttribute(SymTabKeyImpl.ROUTINE_PARMS);
            parmCount = formalParms !== undefined ? formalParms.size() : 0;
        }

        if (token.getType() !== PascalTokenType.LEFT_PAREN) {
            if (parmCount !== 0) {
                CallParser.errorHandler.flag(token, PascalErrorCode.WRONG_NUMBER_OF_PARMS, this);
            }

            return undefined;
        }

        token = this.nextToken();  // consume opening (
        
        // Loop to parse each actual parameter.
        while (token.getType() !== PascalTokenType.RIGHT_PAREN) {
            let actualNode : ICodeNode = expressionParser.parse(token);
            
            // Declared procedure or function: Check the number of actual
            // parameters, and check each actual parameter against the
            // corresponding formal parameter.
            if (isDeclared) {
                if (++parmIndex < parmCount) {
                    let formalId : SymTabEntry = formalParms.get(parmIndex);
                    this.checkActualParameter(token, formalId, actualNode);
                }
                else if (parmIndex === parmCount) {
                    CallParser.errorHandler.flag(token, PascalErrorCode.WRONG_NUMBER_OF_PARMS, this);
                }
            }

            // read or readln: Each actual parameter must be a variable that is
            //                 a scalar, boolean, or subrange of integer.
            else if (isReadReadln) {
                let type : TypeSpec = actualNode.getTypeSpec();
                let form : TypeForm = type.getForm();

                if (! (   (actualNode.getType() === ICodeNodeTypeImpl.VARIABLE)
                       && ( (form === TypeFormImpl.SCALAR) ||
                            (type === Predefined.booleanType) ||
                            ( (form === TypeFormImpl.SUBRANGE) &&
                              (type.baseType() === Predefined.integerType) ) )
                      )
                   )
                {
                    CallParser.errorHandler.flag(token, PascalErrorCode.INVALID_VAR_PARM, this);
                }
            }

            // write or writeln: The type of each actual parameter must be a
            // scalar, boolean, or a Pascal string. Parse any field width and
            // precision.
            else if (isWriteWriteln) {
                // Create a WRITE_PARM node which adopts the expression node.
                let exprNode : ICodeNode = actualNode;
                actualNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.WRITE_PARM);
                actualNode.addChild(exprNode);

                let type : TypeSpec = exprNode.getTypeSpec().baseType();
                let form : TypeForm = type.getForm();

                if (! ( (form === TypeFormImpl.SCALAR) || (type === Predefined.booleanType) ||
                        (type.isPascalString())
                      )
                   )
                {
                    CallParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
                }

                // Optional field width.
                token = this.currentToken();
                actualNode.addChild(this.parseWriteSpec(token));

                // Optional precision.
                token = this.currentToken();
                actualNode.addChild(this.parseWriteSpec(token));
            }

            parmsNode.addChild(actualNode);
            token = this.synchronize(CallParser.COMMA_SET);
            let tokenType : TokenType = token.getType();
            
            // Look for the comma.
            if (tokenType === PascalTokenType.COMMA) {
                token = this.nextToken();  // consume ,
            }
            else if (ExpressionParser.EXPR_START_SET.contains(<PascalTokenType>tokenType)) {
                CallParser.errorHandler.flag(token, PascalErrorCode.MISSING_COMMA, this);
            }
            else if (tokenType !== PascalTokenType.RIGHT_PAREN) {
                token = this.synchronize(ExpressionParser.EXPR_START_SET);
            }
        }

        token = this.nextToken();  // consume closing )

        if ((parmsNode.getChildren().size() === 0) ||
            (isDeclared && (parmIndex !== parmCount-1)))
        {
            CallParser.errorHandler.flag(token, PascalErrorCode.WRONG_NUMBER_OF_PARMS, this);
        }

        return parmsNode;
    }

    /**
     * Check an actual parameter against the corresponding formal parameter.
     * @param token the current token.
     * @param formalId the symbol table entry of the formal parameter.
     * @param actualNode the parse tree node of the actual parameter.
     */
    private checkActualParameter(
        token : Token, 
        formalId : SymTabEntry,
        actualNode : ICodeNode) : void
    {
        let formalDefn : Definition = formalId.getDefinition();
        let formalType : TypeSpec = formalId.getTypeSpec();
        let actualType : TypeSpec = actualNode.getTypeSpec();

        // VAR parameter: The actual parameter must be a variable of the same
        //                type as the formal parameter.
        if (formalDefn === DefinitionImpl.VAR_PARM) {
            if ((actualNode.getType() !== ICodeNodeTypeImpl.VARIABLE) ||
                (actualType !== formalType))
            {
                CallParser.errorHandler.flag(token, PascalErrorCode.INVALID_VAR_PARM, this);
            }
        }

        // Value parameter: The actual parameter must be assignment-compatible
        //                  with the formal parameter.
        else if (!TypeChecker.areAssignmentCompatible(formalType, actualType)) {
            CallParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }
    }

    /**
     * Parse the field width or the precision for an actual parameter
     * of a call to write or writeln.
     * @param token the current token.
     * @return the ICodeNodeTypeImpl.INTEGER_CONSTANT node or undefined
     * @throws Exception if an error occurred.
     */
    private parseWriteSpec(token : Token) : ICodeNode{
        if (token.getType() === PascalTokenType.COLON) {
            token = this.nextToken();  // consume :

            let expressionParser : ExpressionParser = new ExpressionParser(this);
            let specNode : ICodeNode = expressionParser.parse(token);

            if (specNode.getType() === ICodeNodeTypeImpl.INTEGER_CONSTANT) {
                return specNode;
            }
            else {
                CallParser.errorHandler.flag(token, PascalErrorCode.INVALID_NUMBER, this);
                return undefined;
            }
        }
        else {
            return undefined;
        }
    }
}

CallParser.initialize();








export class CallDeclaredParser extends CallParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    /**
     * Parse a call to a declared procedure or function.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : ICodeNode{
        // Create the CALL node.
        let callNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.CALL);
        let pfId : SymTabEntry = CallDeclaredParser.symTabStack.lookup(token.getText().toLowerCase());
        callNode.setAttribute(ICodeKeyImpl.ID, pfId);
        callNode.setTypeSpec(pfId.getTypeSpec());

        token = this.nextToken();  // consume procedure or function identifier

        let parmsNode : ICodeNode = this.parseActualParameters(token, pfId,
                                                    true, false, false);

        callNode.addChild(parmsNode);
        return callNode;
    }
}









export class CallStandardParser extends CallParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    /**
     * Parse a call to a declared procedure or function.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : ICodeNode{
        let callNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.CALL);
        let pfId : SymTabEntry = CallStandardParser.symTabStack.lookup(token.getText().toLowerCase());
        let routineCode : RoutineCode = <RoutineCode> pfId.getAttribute(SymTabKeyImpl.ROUTINE_CODE);
        callNode.setAttribute(ICodeKeyImpl.ID, pfId);

        token = this.nextToken(); // consume procedure or function identifier

        switch (<RoutineCodeImpl> routineCode) {
            case RoutineCodeImpl.READ:
            case RoutineCodeImpl.READLN:  return this.parseReadReadln(token, callNode, pfId);

            case RoutineCodeImpl.WRITE:
            case RoutineCodeImpl.WRITELN: return this.parseWriteWriteln(token, callNode, pfId);

            case RoutineCodeImpl.EOF:
            case RoutineCodeImpl.EOLN:    return this.parseEofEoln(token, callNode, pfId);

            case RoutineCodeImpl.ABS:
            case RoutineCodeImpl.SQR:     return this.parseAbsSqr(token, callNode, pfId);

            case RoutineCodeImpl.ARCTAN:
            case RoutineCodeImpl.COS:
            case RoutineCodeImpl.EXP:
            case RoutineCodeImpl.LN:
            case RoutineCodeImpl.SIN:
            case RoutineCodeImpl.SQRT:    return this.parseArctanCosExpLnSinSqrt(token, callNode,
                                                            pfId);

            case RoutineCodeImpl.PRED:
            case RoutineCodeImpl.SUCC:    return this.parsePredSucc(token, callNode, pfId);

            case RoutineCodeImpl.CHR:     return this.parseChr(token, callNode, pfId);
            case RoutineCodeImpl.ODD:     return this.parseOdd(token, callNode, pfId);
            case RoutineCodeImpl.ORD:     return this.parseOrd(token, callNode, pfId);

            case RoutineCodeImpl.ROUND:
            case RoutineCodeImpl.TRUNC:   return this.parseRoundTrunc(token, callNode, pfId);

            default:      return undefined;  // should never get here
        }
    }

    /**
     * Parse a call to read or readln.
     * @param token the current token.
     * @param callNode the CALL node.
     * @param pfId the symbol table entry of the standard routine name.
     * @return ICodeNode the CALL node.
     * @throws Exception if an error occurred.
     */
    private parseReadReadln(
        token : Token, 
        callNode : ICodeNode,
        pfId : SymTabEntry) : ICodeNode 
    {
        // Parse any actual parameters.
        let parmsNode : ICodeNode = this.parseActualParameters(token, pfId,
                                                    false, true, false);
        callNode.addChild(parmsNode);

        // Read must have parameters.
        if ((pfId === Predefined.readId) &&
            (callNode.getChildren().size() === 0))
        {
            CallStandardParser.errorHandler.flag(token, PascalErrorCode.WRONG_NUMBER_OF_PARMS, this);
        }

        return callNode;
    }

    /**
     * Parse a call to write or writeln.
     * @param token the current token.
     * @param callNode the CALL node.
     * @param pfId the symbol table entry of the standard routine name.
     * @return ICodeNode the CALL node.
     * @throws Exception if an error occurred.
     */
    private parseWriteWriteln(
        token : Token, 
        callNode : ICodeNode,
        pfId : SymTabEntry) : ICodeNode
    {
        // Parse any actual parameters.
        let parmsNode : ICodeNode = this.parseActualParameters(token, pfId,
                                                    false, false, true);
        callNode.addChild(parmsNode);

        // Write must have parameters.
        if ((pfId === Predefined.writeId) &&
            (callNode.getChildren().size() === 0))
        {
            CallStandardParser.errorHandler.flag(token, PascalErrorCode.WRONG_NUMBER_OF_PARMS, this);
        }

        return callNode;
    }

    /**
     * Parse a call to eof or eoln.
     * @param token the current token.
     * @param callNode the CALL node.
     * @param pfId the symbol table entry of the standard routine name.
     * @return ICodeNode the CALL node.
     * @throws Exception if an error occurred.
     */
    private parseEofEoln(
        token : Token, 
        callNode : ICodeNode,
        pfId : SymTabEntry): ICodeNode
    {
        // Parse any actual parameters.
        let parmsNode : ICodeNode = this.parseActualParameters(token, pfId,
                                                    false, false, false);
        callNode.addChild(parmsNode);

        // There should be no actual parameters.
        if (this.checkParmCount(token, parmsNode, 0)) {
            callNode.setTypeSpec(Predefined.booleanType);
        }

        return callNode;
    }

    /**
     * Parse a call to abs or sqr.
     * @param token the current token.
     * @param callNode the CALL node.
     * @param pfId the symbol table entry of the standard routine name.
     * @return ICodeNode the CALL node.
     * @throws Exception if an error occurred.
     */
    private parseAbsSqr(
        token : Token, 
        callNode : ICodeNode,
        pfId : SymTabEntry) : ICodeNode
    {
        // Parse any actual parameters.
        let parmsNode : ICodeNode = this.parseActualParameters(token, pfId,
                                                    false, false, false);
        callNode.addChild(parmsNode);

        // There should be one integer or real parameter.
        // The function return type is the parameter type.
        if (this.checkParmCount(token, parmsNode, 1)) {
            let argType : TypeSpec =
                parmsNode.getChildren().get(0).getTypeSpec().baseType();

            if ((argType === Predefined.integerType) ||
                (argType === Predefined.realType)) {
                callNode.setTypeSpec(argType);
            }
            else {
                CallStandardParser.errorHandler.flag(token, PascalErrorCode.INVALID_TYPE, this);
            }
        }

        return callNode;
    }

    /**
     * Parse a call to arctan, cos, exp, ln, sin, or sqrt.
     * @param token the current token.
     * @param callNode the CALL node.
     * @param pfId the symbol table entry of the standard routine name.
     * @return ICodeNode the CALL node.
     * @throws Exception if an error occurred.
     */
    private parseArctanCosExpLnSinSqrt(
        token : Token,
        callNode : ICodeNode,
        pfId : SymTabEntry) : ICodeNode
    {
        // Parse any actual parameters.
        let parmsNode : ICodeNode = this.parseActualParameters(token, pfId,
                                                    false, false, false);
        callNode.addChild(parmsNode);

        // There should be one integer or real parameter.
        // The function return type is real.
        if (this.checkParmCount(token, parmsNode, 1)) {
            let argType : TypeSpec =
                parmsNode.getChildren().get(0).getTypeSpec().baseType();

            if ((argType === Predefined.integerType) ||
                (argType === Predefined.realType)) {
                callNode.setTypeSpec(Predefined.realType);
            }
            else {
                CallStandardParser.errorHandler.flag(token, PascalErrorCode.INVALID_TYPE, this);
            }
        }

        return callNode;
    }

    /**
     * Parse a call to pred or succ.
     * @param token the current token.
     * @param callNode the CALL node.
     * @param pfId the symbol table entry of the standard routine name.
     * @return ICodeNode the CALL node.
     * @throws Exception if an error occurred.
     */
    private parsePredSucc(
        token : Token, 
        callNode : ICodeNode,
        pfId : SymTabEntry) : ICodeNode
    {
        // Parse any actual parameters.
        let parmsNode : ICodeNode = this.parseActualParameters(token, pfId,
                                                    false, false, false);
        callNode.addChild(parmsNode);

        // There should be one integer or enumeration parameter.
        // The function return type is the parameter type.
        if (this.checkParmCount(token, parmsNode, 1)) {
            let argType : TypeSpec =
                parmsNode.getChildren().get(0).getTypeSpec().baseType();

            if ((argType === Predefined.integerType) ||
                (argType.getForm() === TypeFormImpl.ENUMERATION))
            {
                callNode.setTypeSpec(argType);
            }
            else {
                CallStandardParser.errorHandler.flag(token, PascalErrorCode.INVALID_TYPE, this);
            }
        }

        return callNode;
    }

    /**
     * Parse a call to chr.
     * @param token the current token.
     * @param callNode the CALL node.
     * @param pfId the symbol table entry of the standard routine name.
     * @return ICodeNode the CALL node.
     * @throws Exception if an error occurred.
     */
    private parseChr(
        token : Token, 
        callNode : ICodeNode,
        pfId : SymTabEntry) : ICodeNode
    {
        // Parse any actual parameters.
        let parmsNode : ICodeNode = this.parseActualParameters(token, pfId,
                                                    false, false, false);
        callNode.addChild(parmsNode);

        // There should be one integer parameter.
        // The function return type is character.
        if (this.checkParmCount(token, parmsNode, 1)) {
            let argType : TypeSpec =
                parmsNode.getChildren().get(0).getTypeSpec().baseType();

            if (argType === Predefined.integerType) {
                callNode.setTypeSpec(Predefined.charType);
            }
            else {
                CallStandardParser.errorHandler.flag(token, PascalErrorCode.INVALID_TYPE, this);
            }
        }

        return callNode;
    }

    /**
     * Parse a call to odd.
     * @param token the current token.
     * @param callNode the CALL node.
     * @param pfId the symbol table entry of the standard routine name.
     * @return ICodeNode the CALL node.
     * @throws Exception if an error occurred.
     */
    private parseOdd(
        token : Token, 
        callNode : ICodeNode,
        pfId : SymTabEntry) : ICodeNode
    {
        // Parse any actual parameters.
        let parmsNode : ICodeNode = this.parseActualParameters(token, pfId,
                                                    false, false, false);
        callNode.addChild(parmsNode);

        // There should be one integer parameter.
        // The function return type is boolean.
        if (this.checkParmCount(token, parmsNode, 1)) {
            let argType : TypeSpec =
                parmsNode.getChildren().get(0).getTypeSpec().baseType();

            if (argType === Predefined.integerType) {
                callNode.setTypeSpec(Predefined.booleanType);
            }
            else {
                CallStandardParser.errorHandler.flag(token, PascalErrorCode.INVALID_TYPE, this);
            }
        }

        return callNode;
    }

    /**
     * Parse a call to ord.
     * @param token the current token.
     * @param callNode the CALL node.
     * @param pfId the symbol table entry of the standard routine name.
     * @return ICodeNode the CALL node.
     * @throws Exception if an error occurred.
     */
    private parseOrd(
        token : Token, 
        callNode : ICodeNode,
        pfId : SymTabEntry) : ICodeNode
    {
        // Parse any actual parameters.
        let parmsNode : ICodeNode = this.parseActualParameters(token, pfId,
                                                    false, false, false);
        callNode.addChild(parmsNode);

        // There should be one character or enumeration parameter.
        // The function return type is integer.
        if (this.checkParmCount(token, parmsNode, 1)) {
            let argType : TypeSpec =
                parmsNode.getChildren().get(0).getTypeSpec().baseType();

            if ((argType === Predefined.charType) ||
                (argType.getForm() === TypeFormImpl.ENUMERATION)) {
                callNode.setTypeSpec(Predefined.integerType);
            }
            else {
                CallStandardParser.errorHandler.flag(token, PascalErrorCode.INVALID_TYPE, this);
            }
        }

        return callNode;
    }

    /**
     * Parse a call to round or trunc.
     * @param token the current token.
     * @param callNode the CALL node.
     * @param pfId the symbol table entry of the standard routine name.
     * @return ICodeNode the CALL node.
     * @throws Exception if an error occurred.
     */
    private parseRoundTrunc(
        token : Token, 
        callNode : ICodeNode,
        pfId : SymTabEntry) : ICodeNode
    {
        // Parse any actual parameters.
        let parmsNode : ICodeNode = this.parseActualParameters(token, pfId,
                                                    false, false, false);
        callNode.addChild(parmsNode);

        // There should be one real parameter.
        // The function return type is integer.
        if (this.checkParmCount(token, parmsNode, 1)) {
            let argType : TypeSpec =
                parmsNode.getChildren().get(0).getTypeSpec().baseType();

            if (argType === Predefined.realType) {
                callNode.setTypeSpec(Predefined.integerType);
            }
            else {
                CallStandardParser.errorHandler.flag(token, PascalErrorCode.INVALID_TYPE, this);
            }
        }

        return callNode;
    }

    /**
     * Check the number of actual parameters.
     * @param token the current token.
     * @param parmsNode the PARAMETERS node.
     * @param count the correct number of parameters.
     * @return true if the count is correct.
     */
    private checkParmCount(
        token : Token, 
        parmsNode : ICodeNode, 
        count : number) : boolean
    {
        if ( ((parmsNode === undefined) && (count === 0)) ||
             (parmsNode.getChildren().size() === count) ) {
            return true;
        }
        else {
            CallStandardParser.errorHandler.flag(token, PascalErrorCode.WRONG_NUMBER_OF_PARMS, this);
            return false;
        }
    }
}









export class VariableParser extends StatementParser {
    private static SUBSCRIPT_FIELD_START_SET : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.LEFT_BRACKET, 
            PascalTokenType.DOT]);
    

    // Synchronization set for the ] token.
    private static RIGHT_BRACKET_SET : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.RIGHT_BRACKET, 
            PascalTokenType.EQUALS, 
            PascalTokenType.SEMICOLON]);

    // Set to true to parse a function name
    // as the target of an assignment.
    private isFunctionTarget : boolean = false;

    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    /**
     * Parse a function name as the target of an assignment statement.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parseFunctionNameTarget(token : Token) : ICodeNode{
        this.isFunctionTarget = true;
        return this.parse(token);
    }

    /**
     * Parse a variable.
     * @param token the initial token.
     * @param variableId the symbol table entry of the variable identifier.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token, variableId? : SymTabEntry) : ICodeNode{
        if(variableId) {
            return this.parseTokenSymTab(token, variableId);
        } else {
            return this.parseTokenOnly(token);
        }
    }

    /**
     * Parse a variable.
     * @param token the initial token.
     * @param variableId the symbol table entry of the variable identifier.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parseTokenSymTab(token : Token, variableId : SymTabEntry) : ICodeNode{
        // Check how the variable is defined.
        let defnCode : Definition = variableId.getDefinition();
        if (! ( (defnCode === DefinitionImpl.VARIABLE) || (defnCode === DefinitionImpl.VALUE_PARM) ||
                (defnCode === DefinitionImpl.VAR_PARM) ||
                (this.isFunctionTarget && (defnCode === DefinitionImpl.FUNCTION) )
              )
           )
        {
            VariableParser.errorHandler.flag(token, PascalErrorCode.INVALID_IDENTIFIER_USAGE, this);
        }

        variableId.appendLineNumber(token.getLineNumber());

        let variableNode : ICodeNode =
            ICodeFactory.createICodeNode(ICodeNodeTypeImpl.VARIABLE);
        variableNode.setAttribute(ICodeKeyImpl.ID, variableId);

        token = this.nextToken();  // consume the identifier
        let variableType : TypeSpec = variableId.getTypeSpec();

        if (!this.isFunctionTarget) {
            // Parse array subscripts or record fields.
            while (VariableParser.SUBSCRIPT_FIELD_START_SET.contains(<PascalTokenType>token.getType())) {
                let subFldNode : ICodeNode = token.getType() === PascalTokenType.LEFT_BRACKET
                                       ? this.parseSubscripts(variableType)
                                       : this.parseField(variableType);
                token = this.currentToken();

                // Update the variable's type.
                // The variable node adopts the SUBSCRIPTS or FIELD node.
                variableType = subFldNode.getTypeSpec();
                variableNode.addChild(subFldNode);
            }
        }

        variableNode.setTypeSpec(variableType);
        
        return variableNode;
    }

    /**
     * Parse a variable.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parseTokenOnly(token : Token) : ICodeNode {
        // Look up the identifier in the symbol table stack.
        let name : string = token.getText().toLowerCase();
        let variableId : SymTabEntry = VariableParser.symTabStack.lookup(name);

        // If not found, flag the error and enter the identifier
        // as an undefined identifier with an undefined type.
        if (variableId === undefined) {
            VariableParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_UNDEFINED, this);
            variableId = VariableParser.symTabStack.enterLocal(name);
            variableId.setDefinition(DefinitionImpl.UNDEFINED);
            variableId.setTypeSpec(Predefined.undefinedType);
        }

        return this.parse(token, variableId);
    }

    /**
     * Parse a set of comma-separated subscript expressions.
     * @param variableType the type of the array variable.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    private parseSubscripts(variableType : TypeSpec) : ICodeNode{
        let token : Token;
        let expressionParser : ExpressionParser = new ExpressionParser(this);

        // Create a SUBSCRIPTS node.
        let subscriptsNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.SUBSCRIPTS);

        do {
            token = this.nextToken();  // consume the [ or , token

            // The current variable is an array.
            if (variableType.getForm() === TypeFormImpl.ARRAY) {

                // Parse the subscript expression.
                let exprNode : ICodeNode = expressionParser.parse(token);
                let exprType : TypeSpec = exprNode !== undefined ? exprNode.getTypeSpec()
                                                     : Predefined.undefinedType;

                // The subscript expression type must be assignment
                // compatible with the array index type.
                let indexType : TypeSpec =
                    <TypeSpec> variableType.getAttribute(TypeKeyImpl.ARRAY_INDEX_TYPE);
                if (!TypeChecker.areAssignmentCompatible(indexType, exprType)) {
                    VariableParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
                }

                // The SUBSCRIPTS node adopts the subscript expression tree.
                subscriptsNode.addChild(exprNode);

                // Update the variable's type.
                variableType =
                    <TypeSpec> variableType.getAttribute(TypeKeyImpl.ARRAY_ELEMENT_TYPE);
            }

            // Not an array type, so too many subscripts.
            else {
                VariableParser.errorHandler.flag(token, PascalErrorCode.TOO_MANY_SUBSCRIPTS, this);
                expressionParser.parse(token);
            }

            token = this.currentToken();
        } while (token.getType() === PascalTokenType.COMMA);

        // Synchronize at the ] token.
        token = this.synchronize(VariableParser.RIGHT_BRACKET_SET);
        if (token.getType() === PascalTokenType.RIGHT_BRACKET) {
            token = this.nextToken();  // consume the ] token
        }
        else {
            VariableParser.errorHandler.flag(token, PascalErrorCode.MISSING_RIGHT_BRACKET, this);
        }

        subscriptsNode.setTypeSpec(variableType);
        return subscriptsNode;
    }

    /**
     * Parse a record field.
     * @param variableType the type of the record variable.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    private parseField(variableType : TypeSpec) : ICodeNode {
        // Create a FIELD node.
        let fieldNode : ICodeNode = ICodeFactory.createICodeNode(DefinitionImpl.FIELD);

        let token : Token = this.nextToken();  // consume the . token
        let tokenType : TokenType = token.getType();
        let variableForm : TypeForm = variableType.getForm();

        if ((tokenType === PascalTokenType.IDENTIFIER) && (variableForm === TypeFormImpl.RECORD)) {
            let symTab : SymTab = <SymTab> variableType.getAttribute(TypeKeyImpl.RECORD_SYMTAB);
            let fieldName : string = token.getText().toLowerCase();
            let fieldId : SymTabEntry = symTab.lookup(fieldName);

            if (fieldId !== undefined) {
                variableType = fieldId.getTypeSpec();
                fieldId.appendLineNumber(token.getLineNumber());

                // Set the field identifier's name.
                fieldNode.setAttribute(ICodeKeyImpl.ID, fieldId);
            }
            else {
                VariableParser.errorHandler.flag(token, PascalErrorCode.INVALID_FIELD, this);
            }
        }
        else {
            VariableParser.errorHandler.flag(token, PascalErrorCode.INVALID_FIELD, this);
        }

        token = this.nextToken();  // consume the field identifier

        fieldNode.setTypeSpec(variableType);
        return fieldNode;
    }
}

