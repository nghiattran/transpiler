import {StatementParser} from './StatementParser';
import {ExpressionParser} from './ExpressionParser';
import {CallStandardParser} from './CallStandardParser';
import {CallDeclaredParser} from './CallDeclaredParser';

import {PascalParser} from '../PascalParser';
import {PascalTokenType} from '../PascalTokenType';
import {PascalErrorCode} from '../PascalErrorCode';

import {Token} from '../../../frontend/Token';
import {Parser} from '../../../frontend/Parser';
import {Source} from '../../../frontend/Source';
import {TokenType} from '../../../frontend/TokenType';

import {TypeForm} from '../../../intermediate/TypeForm';
import {ICodeNode} from '../../../intermediate/ICodeNode';
import {ICodeFactory} from '../../../intermediate/ICodeFactory';
import {TypeSpec} from '../../../intermediate/TypeSpec';
import {SymTabEntry} from '../../../intermediate/SymTabEntry';
import {TypeFactory} from '../intermediate/TypeFactory';
import {ICodeNodeType} from '../../../intermediate/ICodeNodeType';
import {Definition} from '../../../intermediate/Definition';
import {RoutineCode} from '../../../intermediate/RoutineCode';

import {TypeFormImpl} from '../intermediate/typeimpl/TypeFormImpl';
import {TypeKeyImpl} from '../intermediate/typeimpl/TypeKeyImpl';
import {TypeChecker} from '../intermediate/typeimpl/TypeChecker';

import {Predefined} from '../../../intermediate/symtabimpl/Predefined';
import {DefinitionImpl} from '../../../intermediate/symtabimpl/DefinitionImpl';
import {SymTabKeyImpl} from '../../../intermediate/symtabimpl/SymTabKeyImpl';
import {RoutineCodeImpl} from '../intermediate/RoutineCodeImpl';

import {ICodeNodeTypeImpl} from '../intermediate/ICodeNodeTypeImpl';
import {ICodeKeyImpl} from '../../../intermediate/icodeimpl/ICodeKeyImpl';

import {List} from '../../../util/List';
import {Util} from '../../../util/Util';
import {HashMap} from '../../../util/HashMap';

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