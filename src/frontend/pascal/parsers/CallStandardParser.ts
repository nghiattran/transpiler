import {StatementParser} from './StatementParser';
import {ExpressionParser} from './ExpressionParser';
import {CallParser} from './CallParser';

import {PascalParser} from '../PascalParser';
import {PascalTokenType} from '../PascalTokenType';
import {PascalErrorCode} from '../PascalErrorCode';

import {Token} from '../../Token';
import {Parser} from '../../Parser';
import {Source} from '../../Source';
import {TokenType} from '../../TokenType';

import {TypeForm} from '../../../intermediate/TypeForm';
import {ICodeNode} from '../../../intermediate/ICodeNode';
import {ICodeFactory} from '../../../intermediate/ICodeFactory';
import {TypeSpec} from '../../../intermediate/TypeSpec';
import {SymTabEntry} from '../../../intermediate/SymTabEntry';
import {TypeFactory} from '../../../intermediate/TypeFactory';
import {ICodeNodeType} from '../../../intermediate/ICodeNodeType';
import {Definition} from '../../../intermediate/Definition';
import {RoutineCode} from '../../../intermediate/RoutineCode';

import {TypeFormImpl} from '../../../intermediate/typeimpl/TypeFormImpl';
import {TypeKeyImpl} from '../../../intermediate/typeimpl/TypeKeyImpl';
import {TypeChecker} from '../../../intermediate/typeimpl/TypeChecker';

import {Predefined} from '../../../intermediate/symtabimpl/Predefined';
import {DefinitionImpl} from '../../../intermediate/symtabimpl/DefinitionImpl';
import {SymTabKeyImpl} from '../../../intermediate/symtabimpl/SymTabKeyImpl';
import {RoutineCodeImpl} from '../../../intermediate/symtabimpl/RoutineCodeImpl';

import {ICodeNodeTypeImpl} from '../../../intermediate/icodeimpl/ICodeNodeTypeImpl';
import {ICodeKeyImpl} from '../../../intermediate/icodeimpl/ICodeKeyImpl';

import {List} from '../../../util/List';
import {Util} from '../../../util/Util';
import {HashMap} from '../../../util/HashMap';

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
