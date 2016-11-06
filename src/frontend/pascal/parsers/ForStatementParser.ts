import {StatementParser} from './StatementParser';
import {ExpressionParser} from './ExpressionParser';
import {AssignmentStatementParser} from './AssignmentStatementParser';
import {CallDeclaredParser} from './CallDeclaredParser';

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
