import {PascalParser} from '../PascalParser';
import {PascalTokenType} from '../PascalTokenType';
import {PascalErrorCode} from '../PascalErrorCode';

import {Token} from '../../Token';
import {TokenType} from '../../TokenType';

import {Definition} from '../../../intermediate/Definition';
import {TypeSpec} from '../../../intermediate/TypeSpec';
import {SymTabEntry} from '../../../intermediate/SymTabEntry';

import {DefinitionImpl} from '../../../intermediate/symtabimpl/DefinitionImpl';
import {SymTabKeyImpl} from '../../../intermediate/symtabimpl/SymTabKeyImpl';

import {List} from '../../../util/List';

import {DeclarationsParser} from './DeclarationsParser';
import {TypeSpecificationParser} from './TypeSpecificationParser';

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
            for (var i = 0; i < sublist.size(); i++) {
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