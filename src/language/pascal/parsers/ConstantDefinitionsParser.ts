import {PascalParser} from '../PascalParser';
import {PascalTokenType} from '../PascalTokenType';
import {PascalErrorCode} from '../PascalErrorCode';

import {DeclarationsParser} from './DeclarationsParser';

import {Token} from '../../../frontend/Token';
import {TokenType} from '../../../frontend/TokenType';

import {Definition} from '../../../intermediate/Definition';
import {SymTabEntry} from '../../../intermediate/SymTabEntry';

import {TypeSpec} from '../../../intermediate/TypeSpec';
import {TypeFactory} from '../intermediate/TypeFactory';

import {DefinitionImpl} from '../../../intermediate/symtabimpl/DefinitionImpl';
import {Predefined} from '../../../intermediate/symtabimpl/Predefined';
import {SymTabKeyImpl} from '../../../intermediate/symtabimpl/SymTabKeyImpl';

import {List} from '../../../util/List';
import {Util} from '../../../util/Util';

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