import {PascalParser} from '../PascalParser';
import {PascalTokenType} from '../PascalTokenType';
import {PascalErrorCode} from '../PascalErrorCode';

import {DeclarationsParser} from './DeclarationsParser';
import {ConstantDefinitionsParser} from './ConstantDefinitionsParser';
import {TypeSpecificationParser} from './TypeSpecificationParser';

import {Token} from '../../../frontend/Token';
import {TokenType} from '../../../frontend/TokenType';

import {Definition} from '../../../intermediate/Definition';
import {SymTabEntry} from '../../../intermediate/SymTabEntry';

import {TypeSpec} from '../../../intermediate/TypeSpec';

import {DefinitionImpl} from '../../../intermediate/symtabimpl/DefinitionImpl';

import {List} from '../../../util/List';

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
