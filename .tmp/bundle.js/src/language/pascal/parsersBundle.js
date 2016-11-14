"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PascalParser_1 = require('./PascalParser');
var PascalTokenType_1 = require('./PascalTokenType');
var PascalErrorCode_1 = require('./PascalErrorCode');
var Token_1 = require('../../frontend/Token');
var EofToken_1 = require('../../frontend/EofToken');
var TypeFactory_1 = require('../../intermediate/TypeFactory');
var DefinitionImpl_1 = require('../../intermediate/symtabimpl/DefinitionImpl');
var Predefined_1 = require('../../intermediate/symtabimpl/Predefined');
var SymTabKeyImpl_1 = require('../../intermediate/symtabimpl/SymTabKeyImpl');
var RoutineCodeImpl_1 = require('../../intermediate/symtabimpl/RoutineCodeImpl');
var ICodeFactory_1 = require('../../intermediate/ICodeFactory');
var ICodeKeyImpl_1 = require('../../intermediate/icodeimpl/ICodeKeyImpl');
var ICodeNodeTypeImpl_1 = require('../../intermediate/icodeimpl/ICodeNodeTypeImpl');
var TypeKeyImpl_1 = require('../../intermediate/typeimpl/TypeKeyImpl');
var TypeFormImpl_1 = require('../../intermediate/typeimpl/TypeFormImpl');
var TypeChecker_1 = require('../../intermediate/typeimpl/TypeChecker');
var HashMap_1 = require('../../util/HashMap');
var List_1 = require('../../util/List');
var Util_1 = require('../../util/Util');
var StatementParser = (function (_super) {
    __extends(StatementParser, _super);
    function StatementParser(parent) {
        _super.call(this, parent);
    }
    StatementParser.prototype.parse = function (token) {
        var statementNode = undefined;
        switch (token.getType()) {
            case PascalTokenType_1.PascalTokenType.BEGIN: {
                var compoundParser = new CompoundStatementParser(this);
                statementNode = compoundParser.parse(token);
                break;
            }
            case PascalTokenType_1.PascalTokenType.IDENTIFIER: {
                var name_1 = token.getText().toLowerCase();
                var id = StatementParser.symTabStack.lookup(name_1);
                var idDefn = id !== undefined ? id.getDefinition()
                    : DefinitionImpl_1.DefinitionImpl.UNDEFINED;
                switch (idDefn) {
                    case DefinitionImpl_1.DefinitionImpl.VARIABLE:
                    case DefinitionImpl_1.DefinitionImpl.VALUE_PARM:
                    case DefinitionImpl_1.DefinitionImpl.VAR_PARM:
                    case DefinitionImpl_1.DefinitionImpl.UNDEFINED: {
                        var assignmentParser = new AssignmentStatementParser(this);
                        statementNode = assignmentParser.parse(token);
                        break;
                    }
                    case DefinitionImpl_1.DefinitionImpl.FUNCTION: {
                        var assignmentParser = new AssignmentStatementParser(this);
                        statementNode =
                            assignmentParser.parseFunctionNameAssignment(token);
                        break;
                    }
                    case DefinitionImpl_1.DefinitionImpl.PROCEDURE: {
                        var callParser = new CallParser(this);
                        statementNode = callParser.parse(token);
                        break;
                    }
                    default: {
                        StatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.UNEXPECTED_TOKEN, this);
                        token = this.nextToken();
                    }
                }
                break;
            }
            case PascalTokenType_1.PascalTokenType.REPEAT: {
                var repeatParser = new RepeatStatementParser(this);
                statementNode = repeatParser.parse(token);
                break;
            }
            case PascalTokenType_1.PascalTokenType.WHILE: {
                var whileParser = new WhileStatementParser(this);
                statementNode = whileParser.parse(token);
                break;
            }
            case PascalTokenType_1.PascalTokenType.FOR: {
                var forParser = new ForStatementParser(this);
                statementNode = forParser.parse(token);
                break;
            }
            case PascalTokenType_1.PascalTokenType.IF: {
                var ifParser = new IfStatementParser(this);
                statementNode = ifParser.parse(token);
                break;
            }
            case PascalTokenType_1.PascalTokenType.CASE: {
                var caseParser = new CaseStatementParser(this);
                statementNode = caseParser.parse(token);
                break;
            }
            default: {
                statementNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.NO_OP);
                break;
            }
        }
        this.setLineNumber(statementNode, token);
        return statementNode;
    };
    StatementParser.prototype.setLineNumber = function (node, token) {
        if (node !== undefined) {
            node.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.LINE, token.getLineNumber());
        }
    };
    StatementParser.prototype.parseList = function (token, parentNode, terminator, errorCode) {
        var terminatorSet = StatementParser.STMT_START_SET.clone();
        terminatorSet.add(terminator);
        while (!(token instanceof EofToken_1.EofToken) &&
            (token.getType() !== terminator)) {
            var statementNode = this.parse(token);
            parentNode.addChild(statementNode);
            token = this.currentToken();
            var tokenType = token.getType();
            if (tokenType === PascalTokenType_1.PascalTokenType.SEMICOLON) {
                token = this.nextToken();
            }
            else if (StatementParser.STMT_START_SET.contains(tokenType)) {
                StatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_SEMICOLON, this);
            }
            token = this.synchronize(terminatorSet);
        }
        if (token.getType() === terminator) {
            token = this.nextToken();
        }
        else {
            StatementParser.errorHandler.flag(token, errorCode, this);
        }
    };
    StatementParser.STMT_START_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.BEGIN,
        PascalTokenType_1.PascalTokenType.CASE,
        PascalTokenType_1.PascalTokenType.FOR,
        PascalTokenType_1.PascalTokenType.IF,
        PascalTokenType_1.PascalTokenType.REPEAT,
        PascalTokenType_1.PascalTokenType.WHILE,
        PascalTokenType_1.PascalTokenType.IDENTIFIER,
        PascalTokenType_1.PascalTokenType.SEMICOLON]);
    StatementParser.STMT_FOLLOW_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.SEMICOLON,
        PascalTokenType_1.PascalTokenType.END,
        PascalTokenType_1.PascalTokenType.ELSE,
        PascalTokenType_1.PascalTokenType.UNTIL,
        PascalTokenType_1.PascalTokenType.DOT]);
    return StatementParser;
}(PascalParser_1.PascalParser));
exports.StatementParser = StatementParser;
var BlockParser = (function (_super) {
    __extends(BlockParser, _super);
    function BlockParser(parent) {
        _super.call(this, parent);
    }
    BlockParser.prototype.parse = function (token, routineId) {
        var declarationsParser = new DeclarationsParser(this);
        var statementParser = new StatementParser(this);
        declarationsParser.parse(token, routineId);
        token = this.synchronize(StatementParser.STMT_START_SET);
        var tokenType = token.getType();
        var rootNode = undefined;
        if (tokenType === PascalTokenType_1.PascalTokenType.BEGIN) {
            rootNode = statementParser.parse(token);
        }
        else {
            BlockParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_BEGIN, this);
            if (StatementParser.STMT_START_SET.contains(tokenType)) {
                rootNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.COMPOUND);
                statementParser.parseList(token, rootNode, PascalTokenType_1.PascalTokenType.END, PascalErrorCode_1.PascalErrorCode.MISSING_END);
            }
        }
        return rootNode;
    };
    return BlockParser;
}(PascalParser_1.PascalParser));
exports.BlockParser = BlockParser;
var CompoundStatementParser = (function (_super) {
    __extends(CompoundStatementParser, _super);
    function CompoundStatementParser(parent) {
        _super.call(this, parent);
    }
    CompoundStatementParser.prototype.parse = function (token) {
        token = this.nextToken();
        var compoundNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.COMPOUND);
        var statementParser = new StatementParser(this);
        statementParser.parseList(token, compoundNode, PascalTokenType_1.PascalTokenType.END, PascalErrorCode_1.PascalErrorCode.MISSING_END);
        return compoundNode;
    };
    return CompoundStatementParser;
}(StatementParser));
exports.CompoundStatementParser = CompoundStatementParser;
var DeclarationsParser = (function (_super) {
    __extends(DeclarationsParser, _super);
    function DeclarationsParser(parent) {
        _super.call(this, parent);
    }
    DeclarationsParser.initialize = function () {
        DeclarationsParser.TYPE_START_SET.remove(PascalTokenType_1.PascalTokenType.CONST);
        DeclarationsParser.VAR_START_SET.remove(PascalTokenType_1.PascalTokenType.TYPE);
        DeclarationsParser.ROUTINE_START_SET.remove(PascalTokenType_1.PascalTokenType.VAR);
    };
    DeclarationsParser.prototype.parse = function (token, parentId) {
        token = this.synchronize(DeclarationsParser.DECLARATION_START_SET);
        if (token.getType() === PascalTokenType_1.PascalTokenType.CONST) {
            token = this.nextToken();
            var constantDefinitionsParser = new ConstantDefinitionsParser(this);
            constantDefinitionsParser.parse(token, undefined);
        }
        token = this.synchronize(DeclarationsParser.TYPE_START_SET);
        if (token.getType() === PascalTokenType_1.PascalTokenType.TYPE) {
            token = this.nextToken();
            var typeDefinitionsParser = new TypeDefinitionsParser(this);
            typeDefinitionsParser.parse(token, undefined);
        }
        token = this.synchronize(DeclarationsParser.VAR_START_SET);
        if (token.getType() === PascalTokenType_1.PascalTokenType.VAR) {
            token = this.nextToken();
            var variableDeclarationsParser = new VariableDeclarationsParser(this);
            variableDeclarationsParser.setDefinition(DefinitionImpl_1.DefinitionImpl.VARIABLE);
            variableDeclarationsParser.parse(token, undefined);
        }
        token = this.synchronize(DeclarationsParser.ROUTINE_START_SET);
        var tokenType = token.getType();
        while ((tokenType === PascalTokenType_1.PascalTokenType.PROCEDURE) || (tokenType === DefinitionImpl_1.DefinitionImpl.FUNCTION)) {
            var routineParser = new DeclaredRoutineParser(this);
            routineParser.parse(token, parentId);
            token = this.currentToken();
            if (token.getType() === PascalTokenType_1.PascalTokenType.SEMICOLON) {
                while (token.getType() === PascalTokenType_1.PascalTokenType.SEMICOLON) {
                    token = this.nextToken();
                }
            }
            token = this.synchronize(DeclarationsParser.ROUTINE_START_SET);
            tokenType = token.getType();
        }
        return undefined;
    };
    DeclarationsParser.DECLARATION_START_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.CONST,
        PascalTokenType_1.PascalTokenType.TYPE,
        PascalTokenType_1.PascalTokenType.VAR,
        PascalTokenType_1.PascalTokenType.PROCEDURE,
        PascalTokenType_1.PascalTokenType.FUNCTION,
        PascalTokenType_1.PascalTokenType.BEGIN]);
    DeclarationsParser.TYPE_START_SET = DeclarationsParser.DECLARATION_START_SET.clone();
    DeclarationsParser.VAR_START_SET = DeclarationsParser.TYPE_START_SET.clone();
    DeclarationsParser.ROUTINE_START_SET = DeclarationsParser.VAR_START_SET.clone();
    return DeclarationsParser;
}(PascalParser_1.PascalParser));
exports.DeclarationsParser = DeclarationsParser;
DeclarationsParser.initialize();
var ConstantDefinitionsParser = (function (_super) {
    __extends(ConstantDefinitionsParser, _super);
    function ConstantDefinitionsParser(parent) {
        _super.call(this, parent);
    }
    ConstantDefinitionsParser.initialize = function () {
        ConstantDefinitionsParser.IDENTIFIER_SET.add(PascalTokenType_1.PascalTokenType.IDENTIFIER);
        ConstantDefinitionsParser.EQUALS_SET.add(PascalTokenType_1.PascalTokenType.EQUALS);
        ConstantDefinitionsParser.EQUALS_SET.add(PascalTokenType_1.PascalTokenType.SEMICOLON);
        ConstantDefinitionsParser.NEXT_START_SET.add(PascalTokenType_1.PascalTokenType.SEMICOLON);
        ConstantDefinitionsParser.NEXT_START_SET.add(PascalTokenType_1.PascalTokenType.IDENTIFIER);
    };
    ConstantDefinitionsParser.prototype.parse = function (token, parentId) {
        token = this.synchronize(ConstantDefinitionsParser.IDENTIFIER_SET);
        while (token.getType() === PascalTokenType_1.PascalTokenType.IDENTIFIER) {
            var name_2 = token.getText().toLowerCase();
            var constantId = ConstantDefinitionsParser.symTabStack.lookupLocal(name_2);
            if (constantId === undefined) {
                constantId = ConstantDefinitionsParser.symTabStack.enterLocal(name_2);
                constantId.appendLineNumber(token.getLineNumber());
            }
            else {
                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.IDENTIFIER_REDEFINED, this);
                constantId = undefined;
            }
            token = this.nextToken();
            token = this.synchronize(ConstantDefinitionsParser.EQUALS_SET);
            if (token.getType() === PascalTokenType_1.PascalTokenType.EQUALS) {
                token = this.nextToken();
            }
            else {
                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_EQUALS, this);
            }
            var constantToken = token;
            var value = this.parseConstant(token);
            if (constantId !== undefined) {
                constantId.setDefinition(DefinitionImpl_1.DefinitionImpl.CONSTANT);
                constantId.setAttribute(SymTabKeyImpl_1.SymTabKeyImpl.CONSTANT_VALUE, value);
                var constantType = constantToken.getType() === PascalTokenType_1.PascalTokenType.IDENTIFIER
                    ? this.getConstantType(constantToken)
                    : this.getConstantType(value);
                constantId.setTypeSpec(constantType);
            }
            token = this.currentToken();
            var tokenType = token.getType();
            if (tokenType === PascalTokenType_1.PascalTokenType.SEMICOLON) {
                while (token.getType() === PascalTokenType_1.PascalTokenType.SEMICOLON) {
                    token = this.nextToken();
                }
            }
            else if (ConstantDefinitionsParser.NEXT_START_SET.contains(tokenType)) {
                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_SEMICOLON, this);
            }
            token = this.synchronize(ConstantDefinitionsParser.IDENTIFIER_SET);
        }
        return undefined;
    };
    ConstantDefinitionsParser.prototype.parseConstant = function (token) {
        var sign = undefined;
        token = this.synchronize(ConstantDefinitionsParser.CONSTANT_START_SET);
        var tokenType = token.getType();
        if ((tokenType === PascalTokenType_1.PascalTokenType.PLUS) || (tokenType === PascalTokenType_1.PascalTokenType.MINUS)) {
            sign = tokenType;
            token = this.nextToken();
        }
        switch (token.getType()) {
            case PascalTokenType_1.PascalTokenType.IDENTIFIER: {
                return this.parseIdentifierConstant(token, sign);
            }
            case PascalTokenType_1.PascalTokenType.INTEGER: {
                var value = token.getValue();
                this.nextToken();
                return sign === PascalTokenType_1.PascalTokenType.MINUS ? -value : value;
            }
            case PascalTokenType_1.PascalTokenType.REAL: {
                var value = token.getValue();
                this.nextToken();
                return sign === PascalTokenType_1.PascalTokenType.MINUS ? -value : value;
            }
            case PascalTokenType_1.PascalTokenType.STRING: {
                if (sign !== undefined) {
                    ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_CONSTANT, this);
                }
                this.nextToken();
                return token.getValue();
            }
            default: {
                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_CONSTANT, this);
                return undefined;
            }
        }
    };
    ConstantDefinitionsParser.prototype.parseIdentifierConstant = function (token, sign) {
        var name = token.getText().toLowerCase();
        var id = ConstantDefinitionsParser.symTabStack.lookup(name);
        this.nextToken();
        if (id === undefined) {
            ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.IDENTIFIER_UNDEFINED, this);
            return undefined;
        }
        var definition = id.getDefinition();
        if (definition === DefinitionImpl_1.DefinitionImpl.CONSTANT) {
            var value = id.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.CONSTANT_VALUE);
            id.appendLineNumber(token.getLineNumber());
            if (Util_1.Util.isInteger(value)) {
                return sign === PascalTokenType_1.PascalTokenType.MINUS ? -value : value;
            }
            else if (Util_1.Util.isFloat(value)) {
                return sign === PascalTokenType_1.PascalTokenType.MINUS ? -value : value;
            }
            else if (value instanceof String) {
                if (sign !== undefined) {
                    ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_CONSTANT, this);
                }
                return value;
            }
            else {
                return undefined;
            }
        }
        else if (definition === DefinitionImpl_1.DefinitionImpl.ENUMERATION_CONSTANT) {
            var value = id.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.CONSTANT_VALUE);
            id.appendLineNumber(token.getLineNumber());
            if (sign !== undefined) {
                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_CONSTANT, this);
            }
            return value;
        }
        else if (definition === undefined) {
            ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.NOT_CONSTANT_IDENTIFIER, this);
            return undefined;
        }
        else {
            ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_CONSTANT, this);
            return undefined;
        }
    };
    ConstantDefinitionsParser.prototype.getConstantType = function (object) {
        if (object instanceof Token_1.Token) {
            return this.getConstantTypeByToken(object);
        }
        else {
            return this.getConstantTypeByObject(object);
        }
    };
    ConstantDefinitionsParser.prototype.getConstantTypeByObject = function (value) {
        var constantType = undefined;
        if (Util_1.Util.isInteger(value)) {
            constantType = Predefined_1.Predefined.integerType;
        }
        else if (Util_1.Util.isFloat(value)) {
            constantType = Predefined_1.Predefined.realType;
        }
        else if (value instanceof String) {
            if (value.length === 1) {
                constantType = Predefined_1.Predefined.charType;
            }
            else {
                constantType = TypeFactory_1.TypeFactory.createStringType(value);
            }
        }
        return constantType;
    };
    ConstantDefinitionsParser.prototype.getConstantTypeByToken = function (identifier) {
        var name = identifier.getText().toLowerCase();
        var id = ConstantDefinitionsParser.symTabStack.lookup(name);
        if (id === undefined) {
            return undefined;
        }
        var definition = id.getDefinition();
        if ((definition === DefinitionImpl_1.DefinitionImpl.CONSTANT) || (definition === DefinitionImpl_1.DefinitionImpl.ENUMERATION_CONSTANT)) {
            return id.getTypeSpec();
        }
        else {
            return undefined;
        }
    };
    ConstantDefinitionsParser.IDENTIFIER_SET = DeclarationsParser.TYPE_START_SET.clone();
    ConstantDefinitionsParser.NEXT_START_SET = DeclarationsParser.TYPE_START_SET.clone();
    ConstantDefinitionsParser.CONSTANT_START_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.IDENTIFIER,
        PascalTokenType_1.PascalTokenType.INTEGER,
        PascalTokenType_1.PascalTokenType.REAL,
        PascalTokenType_1.PascalTokenType.PLUS,
        PascalTokenType_1.PascalTokenType.MINUS,
        PascalTokenType_1.PascalTokenType.STRING,
        PascalTokenType_1.PascalTokenType.SEMICOLON]);
    ConstantDefinitionsParser.EQUALS_SET = ConstantDefinitionsParser.CONSTANT_START_SET.clone();
    return ConstantDefinitionsParser;
}(DeclarationsParser));
exports.ConstantDefinitionsParser = ConstantDefinitionsParser;
ConstantDefinitionsParser.initialize();
var SimpleTypeParser = (function (_super) {
    __extends(SimpleTypeParser, _super);
    function SimpleTypeParser(parent) {
        _super.call(this, parent);
    }
    SimpleTypeParser.initialize = function () {
        SimpleTypeParser.SIMPLE_TYPE_START_SET.add(PascalTokenType_1.PascalTokenType.LEFT_PAREN);
        SimpleTypeParser.SIMPLE_TYPE_START_SET.add(PascalTokenType_1.PascalTokenType.COMMA);
        SimpleTypeParser.SIMPLE_TYPE_START_SET.add(PascalTokenType_1.PascalTokenType.SEMICOLON);
    };
    SimpleTypeParser.prototype.parse = function (token) {
        token = this.synchronize(SimpleTypeParser.SIMPLE_TYPE_START_SET);
        switch (token.getType()) {
            case PascalTokenType_1.PascalTokenType.IDENTIFIER: {
                var name_3 = token.getText().toLowerCase();
                var id = SimpleTypeParser.symTabStack.lookup(name_3);
                if (id !== undefined) {
                    var definition = id.getDefinition();
                    if (definition === DefinitionImpl_1.DefinitionImpl.TYPE) {
                        id.appendLineNumber(token.getLineNumber());
                        token = this.nextToken();
                        return id.getTypeSpec();
                    }
                    else if ((definition !== DefinitionImpl_1.DefinitionImpl.CONSTANT) &&
                        (definition !== DefinitionImpl_1.DefinitionImpl.ENUMERATION_CONSTANT)) {
                        SimpleTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.NOT_TYPE_IDENTIFIER, this);
                        token = this.nextToken();
                        return undefined;
                    }
                    else {
                        var subrangeTypeParser = new SubrangeTypeParser(this);
                        return subrangeTypeParser.parse(token);
                    }
                }
                else {
                    SimpleTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.IDENTIFIER_UNDEFINED, this);
                    token = this.nextToken();
                    return undefined;
                }
            }
            case PascalTokenType_1.PascalTokenType.LEFT_PAREN: {
                var enumerationTypeParser = new EnumerationTypeParser(this);
                return enumerationTypeParser.parse(token);
            }
            case PascalTokenType_1.PascalTokenType.COMMA:
            case PascalTokenType_1.PascalTokenType.SEMICOLON: {
                SimpleTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_TYPE, this);
                return undefined;
            }
            default: {
                var subrangeTypeParser = new SubrangeTypeParser(this);
                return subrangeTypeParser.parse(token);
            }
        }
    };
    SimpleTypeParser.SIMPLE_TYPE_START_SET = ConstantDefinitionsParser.CONSTANT_START_SET.clone();
    return SimpleTypeParser;
}(PascalParser_1.PascalParser));
exports.SimpleTypeParser = SimpleTypeParser;
SimpleTypeParser.initialize();
var TypeSpecificationParser = (function (_super) {
    __extends(TypeSpecificationParser, _super);
    function TypeSpecificationParser(parent) {
        _super.call(this, parent);
    }
    TypeSpecificationParser.initialize = function () {
        TypeSpecificationParser.TYPE_START_SET.add(PascalTokenType_1.PascalTokenType.ARRAY);
        TypeSpecificationParser.TYPE_START_SET.add(PascalTokenType_1.PascalTokenType.RECORD);
        TypeSpecificationParser.TYPE_START_SET.add(PascalTokenType_1.PascalTokenType.SEMICOLON);
    };
    TypeSpecificationParser.prototype.parse = function (token) {
        token = this.synchronize(TypeSpecificationParser.TYPE_START_SET);
        switch (token.getType()) {
            case PascalTokenType_1.PascalTokenType.ARRAY: {
                var arrayTypeParser = new ArrayTypeParser(this);
                return arrayTypeParser.parse(token);
            }
            case PascalTokenType_1.PascalTokenType.RECORD: {
                var recordTypeParser = new RecordTypeParser(this);
                return recordTypeParser.parse(token);
            }
            default: {
                var simpleTypeParser = new SimpleTypeParser(this);
                return simpleTypeParser.parse(token);
            }
        }
    };
    TypeSpecificationParser.TYPE_START_SET = SimpleTypeParser.SIMPLE_TYPE_START_SET.clone();
    return TypeSpecificationParser;
}(PascalParser_1.PascalParser));
exports.TypeSpecificationParser = TypeSpecificationParser;
TypeSpecificationParser.initialize();
var TypeDefinitionsParser = (function (_super) {
    __extends(TypeDefinitionsParser, _super);
    function TypeDefinitionsParser(parent) {
        _super.call(this, parent);
    }
    TypeDefinitionsParser.initialize = function () {
        TypeDefinitionsParser.IDENTIFIER_SET.add(PascalTokenType_1.PascalTokenType.IDENTIFIER);
        TypeDefinitionsParser.EQUALS_SET.add(PascalTokenType_1.PascalTokenType.EQUALS);
        TypeDefinitionsParser.EQUALS_SET.add(PascalTokenType_1.PascalTokenType.SEMICOLON);
        TypeDefinitionsParser.NEXT_START_SET.add(PascalTokenType_1.PascalTokenType.SEMICOLON);
        TypeDefinitionsParser.NEXT_START_SET.add(PascalTokenType_1.PascalTokenType.IDENTIFIER);
    };
    TypeDefinitionsParser.prototype.parse = function (token, parentId) {
        token = this.synchronize(TypeDefinitionsParser.IDENTIFIER_SET);
        while (token.getType() === PascalTokenType_1.PascalTokenType.IDENTIFIER) {
            var name_4 = token.getText().toLowerCase();
            var typeId = TypeDefinitionsParser.symTabStack.lookupLocal(name_4);
            if (typeId === undefined) {
                typeId = TypeDefinitionsParser.symTabStack.enterLocal(name_4);
                typeId.appendLineNumber(token.getLineNumber());
            }
            else {
                TypeDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.IDENTIFIER_REDEFINED, this);
                typeId = undefined;
            }
            token = this.nextToken();
            token = this.synchronize(TypeDefinitionsParser.EQUALS_SET);
            if (token.getType() === PascalTokenType_1.PascalTokenType.EQUALS) {
                token = this.nextToken();
            }
            else {
                TypeDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_EQUALS, this);
            }
            var typeSpecificationParser = new TypeSpecificationParser(this);
            var type = typeSpecificationParser.parse(token);
            if (typeId !== undefined) {
                typeId.setDefinition(PascalTokenType_1.PascalTokenType.TYPE);
            }
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
            var tokenType = token.getType();
            if (tokenType === PascalTokenType_1.PascalTokenType.SEMICOLON) {
                while (token.getType() === PascalTokenType_1.PascalTokenType.SEMICOLON) {
                    token = this.nextToken();
                }
            }
            else if (TypeDefinitionsParser.NEXT_START_SET.contains(tokenType)) {
                TypeDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_SEMICOLON, this);
            }
            token = this.synchronize(TypeDefinitionsParser.IDENTIFIER_SET);
        }
        return undefined;
    };
    TypeDefinitionsParser.IDENTIFIER_SET = DeclarationsParser.VAR_START_SET.clone();
    TypeDefinitionsParser.EQUALS_SET = ConstantDefinitionsParser.CONSTANT_START_SET.clone();
    TypeDefinitionsParser.FOLLOW_SET = new List_1.List([PascalTokenType_1.PascalTokenType.SEMICOLON]);
    TypeDefinitionsParser.NEXT_START_SET = DeclarationsParser.VAR_START_SET.clone();
    return TypeDefinitionsParser;
}(DeclarationsParser));
exports.TypeDefinitionsParser = TypeDefinitionsParser;
var ArrayTypeParser = (function (_super) {
    __extends(ArrayTypeParser, _super);
    function ArrayTypeParser(parent) {
        _super.call(this, parent);
    }
    ArrayTypeParser.initialize = function () {
        ArrayTypeParser.LEFT_BRACKET_SET.add(PascalTokenType_1.PascalTokenType.LEFT_BRACKET);
        ArrayTypeParser.LEFT_BRACKET_SET.add(PascalTokenType_1.PascalTokenType.RIGHT_BRACKET);
        ArrayTypeParser.OF_SET.add(PascalTokenType_1.PascalTokenType.OF);
        ArrayTypeParser.OF_SET.add(PascalTokenType_1.PascalTokenType.SEMICOLON);
        ArrayTypeParser.INDEX_START_SET.add(PascalTokenType_1.PascalTokenType.COMMA);
        ArrayTypeParser.INDEX_FOLLOW_SET.addAll(ArrayTypeParser.INDEX_END_SET);
    };
    ArrayTypeParser.prototype.parse = function (token) {
        var arrayType = TypeFactory_1.TypeFactory.createType(PascalTokenType_1.PascalTokenType.ARRAY);
        token = this.nextToken();
        token = this.synchronize(ArrayTypeParser.LEFT_BRACKET_SET);
        if (token.getType() !== PascalTokenType_1.PascalTokenType.LEFT_BRACKET) {
            ArrayTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_LEFT_BRACKET, this);
        }
        var elementType = this.parseIndexTypeList(token, arrayType);
        token = this.synchronize(ArrayTypeParser.RIGHT_BRACKET_SET);
        if (token.getType() === PascalTokenType_1.PascalTokenType.RIGHT_BRACKET) {
            token = this.nextToken();
        }
        else {
            ArrayTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_RIGHT_BRACKET, this);
        }
        token = this.synchronize(ArrayTypeParser.OF_SET);
        if (token.getType() === PascalTokenType_1.PascalTokenType.OF) {
            token = this.nextToken();
        }
        else {
            ArrayTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_OF, this);
        }
        elementType.setAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_ELEMENT_TYPE, this.parseElementType(token));
        return arrayType;
    };
    ArrayTypeParser.prototype.parseIndexTypeList = function (token, arrayType) {
        var elementType = arrayType;
        var anotherIndex = false;
        token = this.nextToken();
        do {
            anotherIndex = false;
            token = this.synchronize(ArrayTypeParser.INDEX_START_SET);
            this.parseIndexType(token, elementType);
            token = this.synchronize(ArrayTypeParser.INDEX_FOLLOW_SET);
            var tokenType = token.getType();
            if ((tokenType !== PascalTokenType_1.PascalTokenType.COMMA) && (tokenType !== PascalTokenType_1.PascalTokenType.RIGHT_BRACKET)) {
                if (ArrayTypeParser.INDEX_START_SET.contains(tokenType)) {
                    ArrayTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_COMMA, this);
                    anotherIndex = true;
                }
            }
            else if (tokenType === PascalTokenType_1.PascalTokenType.COMMA) {
                var newElementType = TypeFactory_1.TypeFactory.createType(PascalTokenType_1.PascalTokenType.ARRAY);
                elementType.setAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_ELEMENT_TYPE, newElementType);
                elementType = newElementType;
                token = this.nextToken();
                anotherIndex = true;
            }
        } while (anotherIndex);
        return elementType;
    };
    ArrayTypeParser.prototype.parseIndexType = function (token, arrayType) {
        var simpleTypeParser = new SimpleTypeParser(this);
        var indexType = simpleTypeParser.parse(token);
        arrayType.setAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_INDEX_TYPE, indexType);
        if (indexType === undefined) {
            return;
        }
        var form = indexType.getForm();
        var count = 0;
        if (form === TypeFormImpl_1.TypeFormImpl.SUBRANGE) {
            var minValue = indexType.getAttribute(TypeKeyImpl_1.TypeKeyImpl.SUBRANGE_MIN_VALUE);
            var maxValue = indexType.getAttribute(TypeKeyImpl_1.TypeKeyImpl.SUBRANGE_MAX_VALUE);
            if ((minValue !== undefined) && (maxValue !== undefined)) {
                count = maxValue - minValue + 1;
            }
        }
        else if (form === TypeFormImpl_1.TypeFormImpl.ENUMERATION) {
            var constants = indexType.getAttribute(TypeKeyImpl_1.TypeKeyImpl.ENUMERATION_CONSTANTS);
            count = constants.size();
        }
        else {
            ArrayTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_INDEX_TYPE, this);
        }
        arrayType.setAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_ELEMENT_COUNT, count);
    };
    ArrayTypeParser.prototype.parseElementType = function (token) {
        var typeSpecificationParser = new TypeSpecificationParser(this);
        return typeSpecificationParser.parse(token);
    };
    ArrayTypeParser.LEFT_BRACKET_SET = SimpleTypeParser.SIMPLE_TYPE_START_SET.clone();
    ArrayTypeParser.RIGHT_BRACKET_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.RIGHT_BRACKET,
        PascalTokenType_1.PascalTokenType.OF,
        PascalTokenType_1.PascalTokenType.SEMICOLON]);
    ArrayTypeParser.OF_SET = TypeSpecificationParser.TYPE_START_SET.clone();
    ArrayTypeParser.INDEX_START_SET = SimpleTypeParser.SIMPLE_TYPE_START_SET.clone();
    ArrayTypeParser.INDEX_END_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.RIGHT_BRACKET,
        PascalTokenType_1.PascalTokenType.OF,
        PascalTokenType_1.PascalTokenType.SEMICOLON]);
    ArrayTypeParser.INDEX_FOLLOW_SET = ArrayTypeParser.INDEX_START_SET.clone();
    return ArrayTypeParser;
}(TypeSpecificationParser));
exports.ArrayTypeParser = ArrayTypeParser;
var ArrayTypeParser;
(function (ArrayTypeParser) {
    ArrayTypeParser.initialize();
})(ArrayTypeParser = exports.ArrayTypeParser || (exports.ArrayTypeParser = {}));
var DeclaredRoutineParser = (function (_super) {
    __extends(DeclaredRoutineParser, _super);
    function DeclaredRoutineParser(parent) {
        _super.call(this, parent);
    }
    DeclaredRoutineParser.initialize = function () {
        DeclaredRoutineParser.PARAMETER_SET.add(PascalTokenType_1.PascalTokenType.VAR);
        DeclaredRoutineParser.PARAMETER_SET.add(PascalTokenType_1.PascalTokenType.IDENTIFIER);
        DeclaredRoutineParser.PARAMETER_SET.add(PascalTokenType_1.PascalTokenType.RIGHT_PAREN);
        DeclaredRoutineParser.LEFT_PAREN_SET.add(PascalTokenType_1.PascalTokenType.LEFT_PAREN);
        DeclaredRoutineParser.LEFT_PAREN_SET.add(PascalTokenType_1.PascalTokenType.SEMICOLON);
        DeclaredRoutineParser.LEFT_PAREN_SET.add(PascalTokenType_1.PascalTokenType.COLON);
        DeclaredRoutineParser.RIGHT_PAREN_SET.remove(PascalTokenType_1.PascalTokenType.LEFT_PAREN);
        DeclaredRoutineParser.RIGHT_PAREN_SET.add(PascalTokenType_1.PascalTokenType.RIGHT_PAREN);
        DeclaredRoutineParser.PARAMETER_FOLLOW_SET.addAll(DeclarationsParser.DECLARATION_START_SET);
        DeclaredRoutineParser.COMMA_SET.addAll(DeclarationsParser.DECLARATION_START_SET);
    };
    DeclaredRoutineParser.prototype.parse = function (token, parentId) {
        var routineDefn = undefined;
        var dummyName = undefined;
        var routineId = undefined;
        var routineType = token.getType();
        switch (routineType) {
            case PascalTokenType_1.PascalTokenType.PROGRAM: {
                token = this.nextToken();
                routineDefn = DefinitionImpl_1.DefinitionImpl.PROGRAM;
                dummyName = 'DummyProgramName'.toLowerCase();
                break;
            }
            case PascalTokenType_1.PascalTokenType.PROCEDURE: {
                token = this.nextToken();
                routineDefn = DefinitionImpl_1.DefinitionImpl.PROCEDURE;
                dummyName = 'DummyProcedureName_'.toLowerCase() +
                    console.info('%03d', ++DeclaredRoutineParser.dummyCounter);
                break;
            }
            case PascalTokenType_1.PascalTokenType.FUNCTION: {
                token = this.nextToken();
                routineDefn = DefinitionImpl_1.DefinitionImpl.FUNCTION;
                dummyName = 'DummyFunctionName_'.toLowerCase() +
                    console.info('%03d', ++DeclaredRoutineParser.dummyCounter);
                break;
            }
            default: {
                routineDefn = DefinitionImpl_1.DefinitionImpl.PROGRAM;
                dummyName = 'DummyProgramName'.toLowerCase();
                break;
            }
        }
        routineId = this.parseRoutineName(token, dummyName);
        routineId.setDefinition(routineDefn);
        token = this.currentToken();
        var iCode = ICodeFactory_1.ICodeFactory.createICode();
        routineId.setAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_ICODE, iCode);
        routineId.setAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_ROUTINES, new List_1.List());
        if (routineId.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_CODE) === RoutineCodeImpl_1.RoutineCodeImpl.FORWARD) {
            var symTab = routineId.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_SYMTAB);
            DeclaredRoutineParser.symTabStack.push(symTab);
        }
        else {
            routineId.setAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_SYMTAB, DeclaredRoutineParser.symTabStack.push());
        }
        if (routineDefn === DefinitionImpl_1.DefinitionImpl.PROGRAM) {
            DeclaredRoutineParser.symTabStack.setProgramId(routineId);
            DeclaredRoutineParser.symTabStack.getLocalSymTab().nextSlotNumber();
        }
        else if (routineId.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_CODE) !== RoutineCodeImpl_1.RoutineCodeImpl.FORWARD) {
            var subroutines = parentId.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_ROUTINES);
            subroutines.add(routineId);
        }
        if (routineId.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_CODE) === RoutineCodeImpl_1.RoutineCodeImpl.FORWARD) {
            if (token.getType() !== PascalTokenType_1.PascalTokenType.SEMICOLON) {
                DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.ALREADY_FORWARDED, this);
                this.parseHeader(token, routineId);
            }
        }
        else {
            this.parseHeader(token, routineId);
        }
        token = this.currentToken();
        if (token.getType() === PascalTokenType_1.PascalTokenType.SEMICOLON) {
            do {
                token = this.nextToken();
            } while (token.getType() === PascalTokenType_1.PascalTokenType.SEMICOLON);
        }
        else {
            DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_SEMICOLON, this);
        }
        if ((token.getType() === PascalTokenType_1.PascalTokenType.IDENTIFIER) &&
            (token.getText().toLowerCase() === 'forward')) {
            token = this.nextToken();
            routineId.setAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_CODE, RoutineCodeImpl_1.RoutineCodeImpl.FORWARD);
        }
        else {
            routineId.setAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_CODE, RoutineCodeImpl_1.RoutineCodeImpl.DECLARED);
            var blockParser = new BlockParser(this);
            var rootNode = blockParser.parse(token, routineId);
            iCode.setRoot(rootNode);
        }
        DeclaredRoutineParser.symTabStack.pop();
        return routineId;
    };
    DeclaredRoutineParser.prototype.parseRoutineName = function (token, dummyName) {
        var routineId = undefined;
        if (token.getType() === PascalTokenType_1.PascalTokenType.IDENTIFIER) {
            var routineName = token.getText().toLowerCase();
            routineId = DeclaredRoutineParser.symTabStack.lookupLocal(routineName);
            if (routineId === undefined) {
                routineId = DeclaredRoutineParser.symTabStack.enterLocal(routineName);
            }
            else if (routineId.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_CODE) !== RoutineCodeImpl_1.RoutineCodeImpl.FORWARD) {
                routineId = undefined;
                DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.IDENTIFIER_REDEFINED, this);
            }
            token = this.nextToken();
        }
        else {
            DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_IDENTIFIER, this);
        }
        if (routineId === undefined) {
            routineId = DeclaredRoutineParser.symTabStack.enterLocal(dummyName);
        }
        return routineId;
    };
    DeclaredRoutineParser.prototype.parseHeader = function (token, routineId) {
        this.parseFormalParameters(token, routineId);
        token = this.currentToken();
        if (routineId.getDefinition() === DefinitionImpl_1.DefinitionImpl.FUNCTION) {
            var variableDeclarationsParser = new VariableDeclarationsParser(this);
            variableDeclarationsParser.setDefinition(DefinitionImpl_1.DefinitionImpl.FUNCTION);
            var type = variableDeclarationsParser.parseTypeSpec(token);
            token = this.currentToken();
            if (type !== undefined) {
                var form = type.getForm();
                if ((form === TypeFormImpl_1.TypeFormImpl.ARRAY) ||
                    (form === TypeFormImpl_1.TypeFormImpl.RECORD)) {
                    DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_TYPE, this);
                }
            }
            else {
                type = Predefined_1.Predefined.undefinedType;
            }
            routineId.setTypeSpec(type);
            token = this.currentToken();
        }
    };
    DeclaredRoutineParser.prototype.parseFormalParameters = function (token, routineId) {
        token = this.synchronize(DeclaredRoutineParser.LEFT_PAREN_SET);
        if (token.getType() === PascalTokenType_1.PascalTokenType.LEFT_PAREN) {
            token = this.nextToken();
            var parms = new List_1.List();
            token = this.synchronize(DeclaredRoutineParser.PARAMETER_SET);
            var tokenType = token.getType();
            while ((tokenType === PascalTokenType_1.PascalTokenType.IDENTIFIER) || (tokenType === PascalTokenType_1.PascalTokenType.VAR)) {
                parms.addAll(this.parseParmSublist(token, routineId));
                token = this.currentToken();
                tokenType = token.getType();
            }
            if (token.getType() === PascalTokenType_1.PascalTokenType.RIGHT_PAREN) {
                token = this.nextToken();
            }
            else {
                DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_RIGHT_PAREN, this);
            }
            routineId.setAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_PARMS, parms);
        }
    };
    DeclaredRoutineParser.prototype.parseParmSublist = function (token, routineId) {
        var isProgram = routineId.getDefinition() === DefinitionImpl_1.DefinitionImpl.PROGRAM;
        var parmDefn = isProgram ? DefinitionImpl_1.DefinitionImpl.PROGRAM_PARM : undefined;
        var tokenType = token.getType();
        if (tokenType === PascalTokenType_1.PascalTokenType.VAR) {
            if (!isProgram) {
                parmDefn = DefinitionImpl_1.DefinitionImpl.VAR_PARM;
            }
            else {
                DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_VAR_PARM, this);
            }
            token = this.nextToken();
        }
        else if (!isProgram) {
            parmDefn = DefinitionImpl_1.DefinitionImpl.VALUE_PARM;
        }
        var variableDeclarationsParser = new VariableDeclarationsParser(this);
        variableDeclarationsParser.setDefinition(parmDefn);
        var sublist = variableDeclarationsParser.parseIdentifierSublist(token, DeclaredRoutineParser.PARAMETER_FOLLOW_SET, DeclaredRoutineParser.COMMA_SET);
        token = this.currentToken();
        tokenType = token.getType();
        if (!isProgram) {
            if (tokenType === PascalTokenType_1.PascalTokenType.SEMICOLON) {
                while (token.getType() === PascalTokenType_1.PascalTokenType.SEMICOLON) {
                    token = this.nextToken();
                }
            }
            else if (VariableDeclarationsParser.
                NEXT_START_SET.contains(tokenType)) {
                DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_SEMICOLON, this);
            }
            token = this.synchronize(DeclaredRoutineParser.PARAMETER_SET);
        }
        return sublist;
    };
    DeclaredRoutineParser.PARAMETER_SET = DeclarationsParser.DECLARATION_START_SET.clone();
    DeclaredRoutineParser.LEFT_PAREN_SET = DeclarationsParser.DECLARATION_START_SET.clone();
    DeclaredRoutineParser.RIGHT_PAREN_SET = DeclaredRoutineParser.LEFT_PAREN_SET.clone();
    DeclaredRoutineParser.PARAMETER_FOLLOW_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.COLON,
        PascalTokenType_1.PascalTokenType.RIGHT_PAREN,
        PascalTokenType_1.PascalTokenType.SEMICOLON]);
    DeclaredRoutineParser.COMMA_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.COMMA,
        PascalTokenType_1.PascalTokenType.COLON,
        PascalTokenType_1.PascalTokenType.IDENTIFIER,
        PascalTokenType_1.PascalTokenType.RIGHT_PAREN,
        PascalTokenType_1.PascalTokenType.SEMICOLON]);
    DeclaredRoutineParser.dummyCounter = 0;
    return DeclaredRoutineParser;
}(DeclarationsParser));
exports.DeclaredRoutineParser = DeclaredRoutineParser;
DeclaredRoutineParser.initialize();
var EnumerationTypeParser = (function (_super) {
    __extends(EnumerationTypeParser, _super);
    function EnumerationTypeParser(parent) {
        _super.call(this, parent);
    }
    EnumerationTypeParser.initialize = function () {
        EnumerationTypeParser.ENUM_DEFINITION_FOLLOW_SET.addAll(DeclarationsParser.VAR_START_SET);
    };
    EnumerationTypeParser.prototype.parse = function (token) {
        var enumerationType = TypeFactory_1.TypeFactory.createType(TypeFormImpl_1.TypeFormImpl.ENUMERATION);
        var value = -1;
        var constants = new List_1.List();
        token = this.nextToken();
        do {
            token = this.synchronize(EnumerationTypeParser.ENUM_CONSTANT_START_SET);
            this.parseEnumerationIdentifier(token, ++value, enumerationType, constants);
            token = this.currentToken();
            var tokenType = token.getType();
            if (tokenType === PascalTokenType_1.PascalTokenType.COMMA) {
                token = this.nextToken();
                if (EnumerationTypeParser.ENUM_DEFINITION_FOLLOW_SET.contains(token.getType())) {
                    EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_IDENTIFIER, this);
                }
            }
            else if (EnumerationTypeParser.ENUM_CONSTANT_START_SET.contains(tokenType)) {
                EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_COMMA, this);
            }
        } while (!EnumerationTypeParser.ENUM_DEFINITION_FOLLOW_SET.contains(token.getType()));
        if (token.getType() === PascalTokenType_1.PascalTokenType.RIGHT_PAREN) {
            token = this.nextToken();
        }
        else {
            EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_RIGHT_PAREN, this);
        }
        enumerationType.setAttribute(TypeKeyImpl_1.TypeKeyImpl.ENUMERATION_CONSTANTS, constants);
        return enumerationType;
    };
    EnumerationTypeParser.prototype.parseEnumerationIdentifier = function (token, value, enumerationType, constants) {
        var tokenType = token.getType();
        if (tokenType === PascalTokenType_1.PascalTokenType.IDENTIFIER) {
            var name_5 = token.getText().toLowerCase();
            var constantId = EnumerationTypeParser.symTabStack.lookupLocal(name_5);
            if (constantId !== undefined) {
                EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.IDENTIFIER_REDEFINED, this);
            }
            else {
                constantId = EnumerationTypeParser.symTabStack.enterLocal(name_5);
                constantId.setDefinition(DefinitionImpl_1.DefinitionImpl.ENUMERATION_CONSTANT);
                constantId.setTypeSpec(enumerationType);
                constantId.setAttribute(SymTabKeyImpl_1.SymTabKeyImpl.CONSTANT_VALUE, value);
                constantId.appendLineNumber(token.getLineNumber());
                constants.add(constantId);
            }
            token = this.nextToken();
        }
        else {
            EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_IDENTIFIER, this);
        }
    };
    EnumerationTypeParser.ENUM_CONSTANT_START_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.IDENTIFIER,
        PascalTokenType_1.PascalTokenType.COMMA]);
    EnumerationTypeParser.ENUM_DEFINITION_FOLLOW_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.RIGHT_PAREN,
        PascalTokenType_1.PascalTokenType.SEMICOLON]);
    return EnumerationTypeParser;
}(TypeSpecificationParser));
exports.EnumerationTypeParser = EnumerationTypeParser;
var EnumerationTypeParser;
(function (EnumerationTypeParser) {
    EnumerationTypeParser.initialize();
})(EnumerationTypeParser = exports.EnumerationTypeParser || (exports.EnumerationTypeParser = {}));
var ProgramParser = (function (_super) {
    __extends(ProgramParser, _super);
    function ProgramParser(parent) {
        _super.call(this, parent);
    }
    ProgramParser.initialize = function () {
        ProgramParser.PROGRAM_START_SET.addAll(DeclarationsParser.DECLARATION_START_SET);
    };
    ProgramParser.prototype.parse = function (token, parentId) {
        token = this.synchronize(ProgramParser.PROGRAM_START_SET);
        var routineParser = new DeclaredRoutineParser(this);
        routineParser.parse(token, parentId);
        token = this.currentToken();
        if (token.getType() !== PascalTokenType_1.PascalTokenType.DOT) {
            ProgramParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_PERIOD, this);
        }
        return undefined;
    };
    ProgramParser.PROGRAM_START_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.PROGRAM,
        PascalTokenType_1.PascalTokenType.SEMICOLON]);
    return ProgramParser;
}(DeclarationsParser));
exports.ProgramParser = ProgramParser;
ProgramParser.initialize();
var RecordTypeParser = (function (_super) {
    __extends(RecordTypeParser, _super);
    function RecordTypeParser(parent) {
        _super.call(this, parent);
    }
    RecordTypeParser.initialize = function () {
        RecordTypeParser.END_SET.add(PascalTokenType_1.PascalTokenType.END);
        RecordTypeParser.END_SET.add(PascalTokenType_1.PascalTokenType.SEMICOLON);
    };
    RecordTypeParser.prototype.parse = function (token) {
        var recordType = TypeFactory_1.TypeFactory.createType(PascalTokenType_1.PascalTokenType.RECORD);
        token = this.nextToken();
        recordType.setAttribute(TypeKeyImpl_1.TypeKeyImpl.RECORD_SYMTAB, RecordTypeParser.symTabStack.push());
        var variableDeclarationsParser = new VariableDeclarationsParser(this);
        variableDeclarationsParser.setDefinition(DefinitionImpl_1.DefinitionImpl.FIELD);
        variableDeclarationsParser.parse(token, undefined);
        RecordTypeParser.symTabStack.pop();
        token = this.synchronize(RecordTypeParser.END_SET);
        if (token.getType() === PascalTokenType_1.PascalTokenType.END) {
            token = this.nextToken();
        }
        else {
            RecordTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_END, this);
        }
        return recordType;
    };
    RecordTypeParser.END_SET = DeclarationsParser.VAR_START_SET.clone();
    return RecordTypeParser;
}(TypeSpecificationParser));
exports.RecordTypeParser = RecordTypeParser;
var RecordTypeParser;
(function (RecordTypeParser) {
    RecordTypeParser.initialize();
})(RecordTypeParser = exports.RecordTypeParser || (exports.RecordTypeParser = {}));
var SubrangeTypeParser = (function (_super) {
    __extends(SubrangeTypeParser, _super);
    function SubrangeTypeParser(parent) {
        _super.call(this, parent);
    }
    SubrangeTypeParser.prototype.parse = function (token) {
        var subrangeType = TypeFactory_1.TypeFactory.createType(TypeFormImpl_1.TypeFormImpl.SUBRANGE);
        var minValue = undefined;
        var maxValue = undefined;
        var constantToken = token;
        var constantParser = new ConstantDefinitionsParser(this);
        minValue = constantParser.parseConstant(token);
        var minType = constantToken.getType() === PascalTokenType_1.PascalTokenType.IDENTIFIER
            ? constantParser.getConstantType(constantToken)
            : constantParser.getConstantType(minValue);
        minValue = this.checkValueType(constantToken, minValue, minType);
        token = this.currentToken();
        var sawDotDot = false;
        if (token.getType() === PascalTokenType_1.PascalTokenType.DOT_DOT) {
            token = this.nextToken();
            sawDotDot = true;
        }
        var tokenType = token.getType();
        if (ConstantDefinitionsParser.CONSTANT_START_SET.contains(tokenType)) {
            if (!sawDotDot) {
                SubrangeTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_DOT_DOT, this);
            }
            token = this.synchronize(ConstantDefinitionsParser.CONSTANT_START_SET);
            constantToken = token;
            maxValue = constantParser.parseConstant(token);
            var maxType = constantToken.getType() === PascalTokenType_1.PascalTokenType.IDENTIFIER
                ? constantParser.getConstantType(constantToken)
                : constantParser.getConstantType(maxValue);
            maxValue = this.checkValueType(constantToken, maxValue, maxType);
            if ((minType === undefined) || (maxType === undefined)) {
                SubrangeTypeParser.errorHandler.flag(constantToken, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
            }
            else if (minType !== maxType) {
                SubrangeTypeParser.errorHandler.flag(constantToken, PascalErrorCode_1.PascalErrorCode.INVALID_SUBRANGE_TYPE, this);
            }
            else if ((minValue !== undefined) && (maxValue !== undefined) &&
                (Math.floor(minValue) >= Math.floor(maxValue))) {
                SubrangeTypeParser.errorHandler.flag(constantToken, PascalErrorCode_1.PascalErrorCode.MIN_GT_MAX, this);
            }
        }
        else {
            SubrangeTypeParser.errorHandler.flag(constantToken, PascalErrorCode_1.PascalErrorCode.INVALID_SUBRANGE_TYPE, this);
        }
        subrangeType.setAttribute(TypeKeyImpl_1.TypeKeyImpl.SUBRANGE_BASE_TYPE, minType);
        subrangeType.setAttribute(TypeKeyImpl_1.TypeKeyImpl.SUBRANGE_MIN_VALUE, minValue);
        subrangeType.setAttribute(TypeKeyImpl_1.TypeKeyImpl.SUBRANGE_MAX_VALUE, maxValue);
        return subrangeType;
    };
    SubrangeTypeParser.prototype.checkValueType = function (token, value, type) {
        if (type === undefined) {
            return value;
        }
        if (type === Predefined_1.Predefined.integerType) {
            return value;
        }
        else if (type === Predefined_1.Predefined.charType) {
            var ch = value.charAt(0);
            return Number(ch);
            ;
        }
        else if (type.getForm() === TypeFormImpl_1.TypeFormImpl.ENUMERATION) {
            return value;
        }
        else {
            SubrangeTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_SUBRANGE_TYPE, this);
            return value;
        }
    };
    return SubrangeTypeParser;
}(TypeSpecificationParser));
exports.SubrangeTypeParser = SubrangeTypeParser;
var VariableDeclarationsParser = (function (_super) {
    __extends(VariableDeclarationsParser, _super);
    function VariableDeclarationsParser(parent) {
        _super.call(this, parent);
    }
    VariableDeclarationsParser.initialize = function () {
        VariableDeclarationsParser.IDENTIFIER_SET.add(PascalTokenType_1.PascalTokenType.IDENTIFIER);
        VariableDeclarationsParser.IDENTIFIER_SET.add(PascalTokenType_1.PascalTokenType.END);
        VariableDeclarationsParser.IDENTIFIER_SET.add(PascalTokenType_1.PascalTokenType.SEMICOLON);
        VariableDeclarationsParser.IDENTIFIER_FOLLOW_SET.addAll(DeclarationsParser.VAR_START_SET);
        VariableDeclarationsParser.NEXT_START_SET.add(PascalTokenType_1.PascalTokenType.IDENTIFIER);
        VariableDeclarationsParser.NEXT_START_SET.add(PascalTokenType_1.PascalTokenType.SEMICOLON);
    };
    VariableDeclarationsParser.prototype.setDefinition = function (definition) {
        this.definition = definition;
    };
    VariableDeclarationsParser.prototype.parse = function (token, parentId) {
        token = this.synchronize(VariableDeclarationsParser.IDENTIFIER_SET);
        while (token.getType() === PascalTokenType_1.PascalTokenType.IDENTIFIER) {
            this.parseIdentifierSublist(token, VariableDeclarationsParser.IDENTIFIER_FOLLOW_SET, VariableDeclarationsParser.COMMA_SET);
            token = this.currentToken();
            var tokenType = token.getType();
            if (tokenType === PascalTokenType_1.PascalTokenType.SEMICOLON) {
                while (token.getType() === PascalTokenType_1.PascalTokenType.SEMICOLON) {
                    token = this.nextToken();
                }
            }
            else if (VariableDeclarationsParser.NEXT_START_SET.contains(tokenType)) {
                VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_SEMICOLON, this);
            }
            token = this.synchronize(VariableDeclarationsParser.IDENTIFIER_SET);
        }
        return undefined;
    };
    VariableDeclarationsParser.prototype.parseIdentifierSublist = function (token, followSet, commaSet) {
        var sublist = new List_1.List();
        do {
            token = this.synchronize(VariableDeclarationsParser.IDENTIFIER_START_SET);
            var id = this.parseIdentifier(token);
            if (id !== undefined) {
                sublist.add(id);
            }
            token = this.synchronize(commaSet);
            var tokenType = token.getType();
            if (tokenType === PascalTokenType_1.PascalTokenType.COMMA) {
                token = this.nextToken();
                if (followSet.contains(token.getType())) {
                    VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_IDENTIFIER, this);
                }
            }
            else if (VariableDeclarationsParser.IDENTIFIER_START_SET.contains(tokenType)) {
                VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_COMMA, this);
            }
        } while (!followSet.contains(token.getType()));
        if (this.definition !== DefinitionImpl_1.DefinitionImpl.PROGRAM_PARM) {
            var type = this.parseTypeSpec(token);
            for (var i = 0; i < sublist.size(); i++) {
                sublist.index(i).setTypeSpec(type);
            }
        }
        return sublist;
    };
    VariableDeclarationsParser.prototype.parseIdentifier = function (token) {
        var id = undefined;
        if (token.getType() === PascalTokenType_1.PascalTokenType.IDENTIFIER) {
            var name_6 = token.getText().toLowerCase();
            id = VariableDeclarationsParser.symTabStack.lookupLocal(name_6);
            if (id === undefined) {
                id = VariableDeclarationsParser.symTabStack.enterLocal(name_6);
                id.setDefinition(this.definition);
                id.appendLineNumber(token.getLineNumber());
                var slot = id.getSymTab().nextSlotNumber();
                id.setAttribute(SymTabKeyImpl_1.SymTabKeyImpl.SLOT, slot);
            }
            else {
                VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.IDENTIFIER_REDEFINED, this);
            }
            token = this.nextToken();
        }
        else {
            VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_IDENTIFIER, this);
        }
        return id;
    };
    VariableDeclarationsParser.prototype.parseTypeSpec = function (token) {
        token = this.synchronize(VariableDeclarationsParser.COLON_SET);
        if (token.getType() === PascalTokenType_1.PascalTokenType.COLON) {
            token = this.nextToken();
        }
        else {
            VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_COLON, this);
        }
        var typeSpecificationParser = new TypeSpecificationParser(this);
        var type = typeSpecificationParser.parse(token);
        if ((this.definition !== DefinitionImpl_1.DefinitionImpl.VARIABLE) &&
            (this.definition !== DefinitionImpl_1.DefinitionImpl.FIELD) &&
            (type !== undefined) && (type.getIdentifier() === undefined)) {
            VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_TYPE, this);
        }
        return type;
    };
    VariableDeclarationsParser.IDENTIFIER_SET = DeclarationsParser.VAR_START_SET.clone();
    VariableDeclarationsParser.IDENTIFIER_START_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.IDENTIFIER,
        PascalTokenType_1.PascalTokenType.COMMA]);
    VariableDeclarationsParser.IDENTIFIER_FOLLOW_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.COLON,
        PascalTokenType_1.PascalTokenType.SEMICOLON]);
    VariableDeclarationsParser.COMMA_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.COMMA,
        PascalTokenType_1.PascalTokenType.COLON,
        PascalTokenType_1.PascalTokenType.IDENTIFIER,
        PascalTokenType_1.PascalTokenType.SEMICOLON]);
    VariableDeclarationsParser.COLON_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.COLON,
        PascalTokenType_1.PascalTokenType.SEMICOLON]);
    VariableDeclarationsParser.NEXT_START_SET = DeclarationsParser.ROUTINE_START_SET.clone();
    return VariableDeclarationsParser;
}(DeclarationsParser));
exports.VariableDeclarationsParser = VariableDeclarationsParser;
VariableDeclarationsParser.initialize();
var ExpressionParser = (function (_super) {
    __extends(ExpressionParser, _super);
    function ExpressionParser(parent) {
        _super.call(this, parent);
    }
    ExpressionParser.initialize = function () {
        ExpressionParser.REL_OPS_MAP.put(PascalTokenType_1.PascalTokenType.EQUALS, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.EQ);
        ExpressionParser.REL_OPS_MAP.put(PascalTokenType_1.PascalTokenType.NOT_EQUALS, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.NE);
        ExpressionParser.REL_OPS_MAP.put(PascalTokenType_1.PascalTokenType.LESS_THAN, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.LT);
        ExpressionParser.REL_OPS_MAP.put(PascalTokenType_1.PascalTokenType.LESS_EQUALS, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.LE);
        ExpressionParser.REL_OPS_MAP.put(PascalTokenType_1.PascalTokenType.GREATER_THAN, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.GT);
        ExpressionParser.REL_OPS_MAP.put(PascalTokenType_1.PascalTokenType.GREATER_EQUALS, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.GE);
        ExpressionParser.ADD_OPS_OPS_MAP.put(PascalTokenType_1.PascalTokenType.PLUS, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.ADD);
        ExpressionParser.ADD_OPS_OPS_MAP.put(PascalTokenType_1.PascalTokenType.MINUS, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.SUBTRACT);
        ExpressionParser.ADD_OPS_OPS_MAP.put(PascalTokenType_1.PascalTokenType.OR, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.OR);
        ExpressionParser.MULT_OPS_OPS_MAP.put(PascalTokenType_1.PascalTokenType.STAR, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.MULTIPLY);
        ExpressionParser.MULT_OPS_OPS_MAP.put(PascalTokenType_1.PascalTokenType.SLASH, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.FLOAT_DIVIDE);
        ExpressionParser.MULT_OPS_OPS_MAP.put(PascalTokenType_1.PascalTokenType.DIV, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.INTEGER_DIVIDE);
        ExpressionParser.MULT_OPS_OPS_MAP.put(PascalTokenType_1.PascalTokenType.MOD, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.MOD);
        ExpressionParser.MULT_OPS_OPS_MAP.put(PascalTokenType_1.PascalTokenType.AND, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.AND);
    };
    ;
    ExpressionParser.prototype.parse = function (token) {
        return this.parseExpression(token);
    };
    ExpressionParser.prototype.parseExpression = function (token) {
        var rootNode = this.parseSimpleExpression(token);
        var resultType = rootNode !== undefined ? rootNode.getTypeSpec()
            : Predefined_1.Predefined.undefinedType;
        token = this.currentToken();
        var tokenType = token.getType();
        if (ExpressionParser.REL_OPS.contains(tokenType)) {
            var nodeType = ExpressionParser.REL_OPS_MAP.get(tokenType);
            var opNode = ICodeFactory_1.ICodeFactory.createICodeNode(nodeType);
            opNode.addChild(rootNode);
            token = this.nextToken();
            var simExprNode = this.parseSimpleExpression(token);
            opNode.addChild(simExprNode);
            rootNode = opNode;
            var simExprType = simExprNode !== undefined
                ? simExprNode.getTypeSpec()
                : Predefined_1.Predefined.undefinedType;
            if (TypeChecker_1.TypeChecker.areComparisonCompatible(resultType, simExprType)) {
                resultType = Predefined_1.Predefined.booleanType;
            }
            else {
                ExpressionParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                resultType = Predefined_1.Predefined.undefinedType;
            }
        }
        if (rootNode !== undefined) {
            rootNode.setTypeSpec(resultType);
        }
        return rootNode;
    };
    ExpressionParser.prototype.parseSimpleExpression = function (token) {
        var signToken = undefined;
        var signType = undefined;
        var tokenType = token.getType();
        if ((tokenType === PascalTokenType_1.PascalTokenType.PLUS) || (tokenType === PascalTokenType_1.PascalTokenType.MINUS)) {
            signType = tokenType;
            signToken = token;
            token = this.nextToken();
        }
        var rootNode = this.parseTerm(token);
        var resultType = rootNode !== undefined ? rootNode.getTypeSpec()
            : Predefined_1.Predefined.undefinedType;
        if ((signType !== undefined) && (!TypeChecker_1.TypeChecker.isIntegerOrReal(resultType))) {
            ExpressionParser.errorHandler.flag(signToken, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }
        if (signType === PascalTokenType_1.PascalTokenType.MINUS) {
            var negateNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.NEGATE);
            negateNode.addChild(rootNode);
            negateNode.setTypeSpec(rootNode.getTypeSpec());
            rootNode = negateNode;
        }
        token = this.currentToken();
        tokenType = token.getType();
        while (ExpressionParser.ADD_OPS.contains(tokenType)) {
            var operator = tokenType;
            var nodeType = ExpressionParser.ADD_OPS_OPS_MAP.get(operator);
            var opNode = ICodeFactory_1.ICodeFactory.createICodeNode(nodeType);
            opNode.addChild(rootNode);
            token = this.nextToken();
            var termNode = this.parseTerm(token);
            opNode.addChild(termNode);
            var termType = termNode !== undefined ? termNode.getTypeSpec()
                : Predefined_1.Predefined.undefinedType;
            rootNode = opNode;
            switch (operator) {
                case PascalTokenType_1.PascalTokenType.PLUS:
                case PascalTokenType_1.PascalTokenType.MINUS: {
                    if (TypeChecker_1.TypeChecker.areBothInteger(resultType, termType)) {
                        resultType = Predefined_1.Predefined.integerType;
                    }
                    else if (TypeChecker_1.TypeChecker.isAtLeastOneReal(resultType, termType)) {
                        resultType = Predefined_1.Predefined.realType;
                    }
                    else {
                        ExpressionParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }
                    break;
                }
                case PascalTokenType_1.PascalTokenType.OR: {
                    if (TypeChecker_1.TypeChecker.areBothBoolean(resultType, termType)) {
                        resultType = Predefined_1.Predefined.booleanType;
                    }
                    else {
                        ExpressionParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }
                    break;
                }
            }
            rootNode.setTypeSpec(resultType);
            token = this.currentToken();
            tokenType = token.getType();
        }
        return rootNode;
    };
    ExpressionParser.prototype.parseTerm = function (token) {
        var rootNode = this.parseFactor(token);
        var resultType = rootNode !== undefined ? rootNode.getTypeSpec()
            : Predefined_1.Predefined.undefinedType;
        token = this.currentToken();
        var tokenType = token.getType();
        while (ExpressionParser.MULT_OPS.contains(tokenType)) {
            var operator = tokenType;
            var nodeType = ExpressionParser.MULT_OPS_OPS_MAP.get(operator);
            var opNode = ICodeFactory_1.ICodeFactory.createICodeNode(nodeType);
            opNode.addChild(rootNode);
            token = this.nextToken();
            var factorNode = this.parseFactor(token);
            opNode.addChild(factorNode);
            var factorType = factorNode !== undefined ? factorNode.getTypeSpec()
                : Predefined_1.Predefined.undefinedType;
            rootNode = opNode;
            switch (operator) {
                case PascalTokenType_1.PascalTokenType.STAR: {
                    if (TypeChecker_1.TypeChecker.areBothInteger(resultType, factorType)) {
                        resultType = Predefined_1.Predefined.integerType;
                    }
                    else if (TypeChecker_1.TypeChecker.isAtLeastOneReal(resultType, factorType)) {
                        resultType = Predefined_1.Predefined.realType;
                    }
                    else {
                        ExpressionParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }
                    break;
                }
                case PascalTokenType_1.PascalTokenType.SLASH: {
                    if (TypeChecker_1.TypeChecker.areBothInteger(resultType, factorType) ||
                        TypeChecker_1.TypeChecker.isAtLeastOneReal(resultType, factorType)) {
                        resultType = Predefined_1.Predefined.realType;
                    }
                    else {
                        ExpressionParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }
                    break;
                }
                case PascalTokenType_1.PascalTokenType.DIV:
                case PascalTokenType_1.PascalTokenType.MOD: {
                    if (TypeChecker_1.TypeChecker.areBothInteger(resultType, factorType)) {
                        resultType = Predefined_1.Predefined.integerType;
                    }
                    else {
                        ExpressionParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }
                    break;
                }
                case PascalTokenType_1.PascalTokenType.AND: {
                    if (TypeChecker_1.TypeChecker.areBothBoolean(resultType, factorType)) {
                        resultType = Predefined_1.Predefined.booleanType;
                    }
                    else {
                        ExpressionParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }
                    break;
                }
            }
            rootNode.setTypeSpec(resultType);
            token = this.currentToken();
            tokenType = token.getType();
        }
        return rootNode;
    };
    ExpressionParser.prototype.parseFactor = function (token) {
        var tokenType = token.getType();
        var rootNode = undefined;
        switch (tokenType) {
            case PascalTokenType_1.PascalTokenType.IDENTIFIER: {
                return this.parseIdentifier(token);
            }
            case PascalTokenType_1.PascalTokenType.INTEGER: {
                rootNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.INTEGER_CONSTANT);
                rootNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, token.getValue());
                token = this.nextToken();
                rootNode.setTypeSpec(Predefined_1.Predefined.integerType);
                break;
            }
            case PascalTokenType_1.PascalTokenType.REAL: {
                rootNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.REAL_CONSTANT);
                rootNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, token.getValue());
                token = this.nextToken();
                rootNode.setTypeSpec(Predefined_1.Predefined.realType);
                break;
            }
            case PascalTokenType_1.PascalTokenType.STRING: {
                var value = token.getValue();
                rootNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.STRING_CONSTANT);
                rootNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, value);
                var resultType = value.length === 1
                    ? Predefined_1.Predefined.charType
                    : TypeFactory_1.TypeFactory.createStringType(value);
                token = this.nextToken();
                rootNode.setTypeSpec(resultType);
                break;
            }
            case PascalTokenType_1.PascalTokenType.NOT: {
                token = this.nextToken();
                rootNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.NOT);
                var factorNode = this.parseFactor(token);
                rootNode.addChild(factorNode);
                var factorType = factorNode !== undefined
                    ? factorNode.getTypeSpec()
                    : Predefined_1.Predefined.undefinedType;
                if (!TypeChecker_1.TypeChecker.isBoolean(factorType)) {
                    ExpressionParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                }
                rootNode.setTypeSpec(Predefined_1.Predefined.booleanType);
                break;
            }
            case PascalTokenType_1.PascalTokenType.LEFT_PAREN: {
                token = this.nextToken();
                rootNode = this.parseExpression(token);
                var resultType = rootNode !== undefined
                    ? rootNode.getTypeSpec()
                    : Predefined_1.Predefined.undefinedType;
                token = this.currentToken();
                if (token.getType() === PascalTokenType_1.PascalTokenType.RIGHT_PAREN) {
                    token = this.nextToken();
                }
                else {
                    ExpressionParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_RIGHT_PAREN, this);
                }
                rootNode.setTypeSpec(resultType);
                break;
            }
            default: {
                ExpressionParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.UNEXPECTED_TOKEN, this);
            }
        }
        return rootNode;
    };
    ExpressionParser.prototype.parseIdentifier = function (token) {
        var rootNode = undefined;
        var name = token.getText().toLowerCase();
        var id = ExpressionParser.symTabStack.lookup(name);
        if (id === undefined) {
            ExpressionParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.IDENTIFIER_UNDEFINED, this);
            id = ExpressionParser.symTabStack.enterLocal(name);
            id.setDefinition(DefinitionImpl_1.DefinitionImpl.UNDEFINED);
            id.setTypeSpec(Predefined_1.Predefined.undefinedType);
        }
        var defnCode = id.getDefinition();
        switch (defnCode) {
            case DefinitionImpl_1.DefinitionImpl.CONSTANT: {
                var value = id.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.CONSTANT_VALUE);
                var type = id.getTypeSpec();
                if (Util_1.Util.isInteger(value)) {
                    rootNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.INTEGER_CONSTANT);
                    rootNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, value);
                }
                else if (Util_1.Util.isFloat(value)) {
                    rootNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.REAL_CONSTANT);
                    rootNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, value);
                }
                else if (value instanceof String) {
                    rootNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.STRING_CONSTANT);
                    rootNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, value);
                }
                id.appendLineNumber(token.getLineNumber());
                token = this.nextToken();
                if (rootNode !== undefined) {
                    rootNode.setTypeSpec(type);
                }
                break;
            }
            case DefinitionImpl_1.DefinitionImpl.ENUMERATION_CONSTANT: {
                var value = id.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.CONSTANT_VALUE);
                var type = id.getTypeSpec();
                rootNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.INTEGER_CONSTANT);
                rootNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, value);
                id.appendLineNumber(token.getLineNumber());
                token = this.nextToken();
                rootNode.setTypeSpec(type);
                break;
            }
            case DefinitionImpl_1.DefinitionImpl.FUNCTION: {
                var callParser = new CallParser(this);
                rootNode = callParser.parse(token);
                break;
            }
            default: {
                var variableParser = new VariableParser(this);
                rootNode = variableParser.parse(token, id);
                break;
            }
        }
        return rootNode;
    };
    ExpressionParser.EXPR_START_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.PLUS,
        PascalTokenType_1.PascalTokenType.MINUS,
        PascalTokenType_1.PascalTokenType.IDENTIFIER,
        PascalTokenType_1.PascalTokenType.INTEGER,
        PascalTokenType_1.PascalTokenType.REAL,
        PascalTokenType_1.PascalTokenType.STRING,
        PascalTokenType_1.PascalTokenType.NOT,
        PascalTokenType_1.PascalTokenType.LEFT_PAREN]);
    ExpressionParser.REL_OPS = new List_1.List([
        PascalTokenType_1.PascalTokenType.EQUALS,
        PascalTokenType_1.PascalTokenType.NOT_EQUALS,
        PascalTokenType_1.PascalTokenType.LESS_THAN,
        PascalTokenType_1.PascalTokenType.LESS_EQUALS,
        PascalTokenType_1.PascalTokenType.GREATER_THAN,
        PascalTokenType_1.PascalTokenType.GREATER_EQUALS]);
    ExpressionParser.REL_OPS_MAP = new HashMap_1.HashMap();
    ExpressionParser.ADD_OPS = new List_1.List([
        PascalTokenType_1.PascalTokenType.PLUS,
        PascalTokenType_1.PascalTokenType.MINUS,
        PascalTokenType_1.PascalTokenType.OR]);
    ExpressionParser.ADD_OPS_OPS_MAP = new HashMap_1.HashMap();
    ExpressionParser.MULT_OPS = new List_1.List([
        PascalTokenType_1.PascalTokenType.STAR,
        PascalTokenType_1.PascalTokenType.SLASH,
        PascalTokenType_1.PascalTokenType.DIV,
        PascalTokenType_1.PascalTokenType.MOD,
        PascalTokenType_1.PascalTokenType.AND]);
    ExpressionParser.MULT_OPS_OPS_MAP = new HashMap_1.HashMap();
    return ExpressionParser;
}(StatementParser));
exports.ExpressionParser = ExpressionParser;
ExpressionParser.initialize();
var AssignmentStatementParser = (function (_super) {
    __extends(AssignmentStatementParser, _super);
    function AssignmentStatementParser(parent) {
        _super.call(this, parent);
        this.isFunctionTarget = false;
    }
    AssignmentStatementParser.initialize = function () {
        AssignmentStatementParser.COLON_EQUALS_SET.add(PascalTokenType_1.PascalTokenType.COLON_EQUALS);
        AssignmentStatementParser.COLON_EQUALS_SET.addAll(StatementParser.STMT_FOLLOW_SET);
    };
    AssignmentStatementParser.prototype.parse = function (token) {
        var assignNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.ASSIGN);
        var variableParser = new VariableParser(this);
        var targetNode = this.isFunctionTarget
            ? variableParser.parseFunctionNameTarget(token)
            : variableParser.parse(token);
        var targetType = targetNode !== undefined ? targetNode.getTypeSpec()
            : Predefined_1.Predefined.undefinedType;
        assignNode.addChild(targetNode);
        token = this.synchronize(AssignmentStatementParser.COLON_EQUALS_SET);
        if (token.getType() === PascalTokenType_1.PascalTokenType.COLON_EQUALS) {
            token = this.nextToken();
        }
        else {
            AssignmentStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_COLON_EQUALS, this);
        }
        var expressionParser = new ExpressionParser(this);
        var exprNode = expressionParser.parse(token);
        assignNode.addChild(exprNode);
        var exprType = exprNode !== undefined ? exprNode.getTypeSpec()
            : Predefined_1.Predefined.undefinedType;
        if (!TypeChecker_1.TypeChecker.areAssignmentCompatible(targetType, exprType)) {
            AssignmentStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }
        assignNode.setTypeSpec(targetType);
        return assignNode;
    };
    AssignmentStatementParser.prototype.parseFunctionNameAssignment = function (token) {
        this.isFunctionTarget = true;
        return this.parse(token);
    };
    AssignmentStatementParser.COLON_EQUALS_SET = ExpressionParser.EXPR_START_SET.clone();
    return AssignmentStatementParser;
}(StatementParser));
exports.AssignmentStatementParser = AssignmentStatementParser;
AssignmentStatementParser.initialize();
var ForStatementParser = (function (_super) {
    __extends(ForStatementParser, _super);
    function ForStatementParser(parent) {
        _super.call(this, parent);
    }
    ForStatementParser.initialize = function () {
        ForStatementParser.TO_DOWNTO_SET.add(PascalTokenType_1.PascalTokenType.TO);
        ForStatementParser.TO_DOWNTO_SET.add(PascalTokenType_1.PascalTokenType.DOWNTO);
        ForStatementParser.TO_DOWNTO_SET.addAll(StatementParser.STMT_FOLLOW_SET);
        ForStatementParser.DO_SET.add(PascalTokenType_1.PascalTokenType.DO);
        ForStatementParser.DO_SET.addAll(StatementParser.STMT_FOLLOW_SET);
    };
    ForStatementParser.prototype.parse = function (token) {
        token = this.nextToken();
        var targetToken = token;
        var compoundNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.COMPOUND);
        var loopNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.LOOP);
        var testNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.TEST);
        var assignmentParser = new AssignmentStatementParser(this);
        var initAssignNode = assignmentParser.parse(token);
        var controlType = initAssignNode !== undefined
            ? initAssignNode.getTypeSpec()
            : Predefined_1.Predefined.undefinedType;
        this.setLineNumber(initAssignNode, targetToken);
        if (!TypeChecker_1.TypeChecker.isInteger(controlType) &&
            (controlType.getForm() !== TypeFormImpl_1.TypeFormImpl.ENUMERATION)) {
            ForStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }
        compoundNode.addChild(initAssignNode);
        compoundNode.addChild(loopNode);
        token = this.synchronize(ForStatementParser.TO_DOWNTO_SET);
        var direction = token.getType();
        if ((direction === PascalTokenType_1.PascalTokenType.TO) || (direction === PascalTokenType_1.PascalTokenType.DOWNTO)) {
            token = this.nextToken();
        }
        else {
            direction = PascalTokenType_1.PascalTokenType.TO;
            ForStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_TO_DOWNTO, this);
        }
        var relOpNode = ICodeFactory_1.ICodeFactory.createICodeNode(direction === PascalTokenType_1.PascalTokenType.TO
            ? ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.GT : ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.LT);
        relOpNode.setTypeSpec(Predefined_1.Predefined.booleanType);
        var controlVarNode = initAssignNode.getChildren().get(0);
        relOpNode.addChild(controlVarNode.copy());
        var expressionParser = new ExpressionParser(this);
        var exprNode = expressionParser.parse(token);
        relOpNode.addChild(exprNode);
        var exprType = exprNode !== undefined ? exprNode.getTypeSpec()
            : Predefined_1.Predefined.undefinedType;
        if (!TypeChecker_1.TypeChecker.areAssignmentCompatible(controlType, exprType)) {
            ForStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }
        testNode.addChild(relOpNode);
        loopNode.addChild(testNode);
        token = this.synchronize(ForStatementParser.DO_SET);
        if (token.getType() === PascalTokenType_1.PascalTokenType.DO) {
            token = this.nextToken();
        }
        else {
            ForStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_DO, this);
        }
        var statementParser = new StatementParser(this);
        loopNode.addChild(statementParser.parse(token));
        var nextAssignNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.ASSIGN);
        nextAssignNode.setTypeSpec(controlType);
        nextAssignNode.addChild(controlVarNode.copy());
        var arithOpNode = ICodeFactory_1.ICodeFactory.createICodeNode(direction === PascalTokenType_1.PascalTokenType.TO
            ? ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.ADD : ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.SUBTRACT);
        arithOpNode.setTypeSpec(Predefined_1.Predefined.integerType);
        arithOpNode.addChild(controlVarNode.copy());
        var oneNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.INTEGER_CONSTANT);
        oneNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, 1);
        oneNode.setTypeSpec(Predefined_1.Predefined.integerType);
        arithOpNode.addChild(oneNode);
        nextAssignNode.addChild(arithOpNode);
        loopNode.addChild(nextAssignNode);
        this.setLineNumber(nextAssignNode, targetToken);
        return compoundNode;
    };
    ForStatementParser.TO_DOWNTO_SET = ExpressionParser.EXPR_START_SET.clone();
    ForStatementParser.DO_SET = StatementParser.STMT_START_SET.clone();
    return ForStatementParser;
}(StatementParser));
exports.ForStatementParser = ForStatementParser;
var WhileStatementParser = (function (_super) {
    __extends(WhileStatementParser, _super);
    function WhileStatementParser(parent) {
        _super.call(this, parent);
    }
    WhileStatementParser.initialize = function () {
        WhileStatementParser.DO_SET.add(PascalTokenType_1.PascalTokenType.DO);
        WhileStatementParser.DO_SET.addAll(StatementParser.STMT_FOLLOW_SET);
    };
    WhileStatementParser.prototype.parse = function (token) {
        token = this.nextToken();
        var loopNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.LOOP);
        var breakNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.TEST);
        var notNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.NOT);
        loopNode.addChild(breakNode);
        breakNode.addChild(notNode);
        var expressionParser = new ExpressionParser(this);
        var exprNode = expressionParser.parse(token);
        notNode.addChild(exprNode);
        var exprType = exprNode !== undefined ? exprNode.getTypeSpec()
            : Predefined_1.Predefined.undefinedType;
        if (!TypeChecker_1.TypeChecker.isBoolean(exprType)) {
            WhileStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }
        token = this.synchronize(WhileStatementParser.DO_SET);
        if (token.getType() === PascalTokenType_1.PascalTokenType.DO) {
            token = this.nextToken();
        }
        else {
            WhileStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_DO, this);
        }
        var statementParser = new StatementParser(this);
        loopNode.addChild(statementParser.parse(token));
        return loopNode;
    };
    WhileStatementParser.DO_SET = StatementParser.STMT_START_SET.clone();
    return WhileStatementParser;
}(StatementParser));
exports.WhileStatementParser = WhileStatementParser;
WhileStatementParser.initialize();
var IfStatementParser = (function (_super) {
    __extends(IfStatementParser, _super);
    function IfStatementParser(parent) {
        _super.call(this, parent);
    }
    IfStatementParser.initialize = function () {
        IfStatementParser.THEN_SET.add(PascalTokenType_1.PascalTokenType.THEN);
        IfStatementParser.THEN_SET.addAll(StatementParser.STMT_FOLLOW_SET);
    };
    IfStatementParser.prototype.parse = function (token) {
        token = this.nextToken();
        var ifNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.IF);
        var expressionParser = new ExpressionParser(this);
        var exprNode = expressionParser.parse(token);
        ifNode.addChild(exprNode);
        var exprType = exprNode !== undefined ? exprNode.getTypeSpec()
            : Predefined_1.Predefined.undefinedType;
        if (!TypeChecker_1.TypeChecker.isBoolean(exprType)) {
            IfStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }
        token = this.synchronize(IfStatementParser.THEN_SET);
        if (token.getType() === PascalTokenType_1.PascalTokenType.THEN) {
            token = this.nextToken();
        }
        else {
            IfStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_THEN, this);
        }
        var statementParser = new StatementParser(this);
        ifNode.addChild(statementParser.parse(token));
        token = this.currentToken();
        if (token.getType() === PascalTokenType_1.PascalTokenType.ELSE) {
            token = this.nextToken();
            ifNode.addChild(statementParser.parse(token));
        }
        return ifNode;
    };
    IfStatementParser.THEN_SET = StatementParser.STMT_START_SET.clone();
    return IfStatementParser;
}(StatementParser));
exports.IfStatementParser = IfStatementParser;
IfStatementParser.initialize();
var CaseStatementParser = (function (_super) {
    __extends(CaseStatementParser, _super);
    function CaseStatementParser(parent) {
        _super.call(this, parent);
    }
    CaseStatementParser.initialize = function () {
        CaseStatementParser.OF_SET.add(PascalTokenType_1.PascalTokenType.OF);
        CaseStatementParser.OF_SET.addAll(StatementParser.STMT_FOLLOW_SET);
        CaseStatementParser.COMMA_SET.add(PascalTokenType_1.PascalTokenType.COMMA);
        CaseStatementParser.COMMA_SET.add(PascalTokenType_1.PascalTokenType.COLON);
        CaseStatementParser.COMMA_SET.addAll(StatementParser.STMT_START_SET);
        CaseStatementParser.COMMA_SET.addAll(StatementParser.STMT_FOLLOW_SET);
    };
    CaseStatementParser.prototype.parse = function (token) {
        token = this.nextToken();
        var selectNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.SELECT);
        var expressionParser = new ExpressionParser(this);
        var exprNode = expressionParser.parse(token);
        selectNode.addChild(exprNode);
        var exprType = exprNode !== undefined ? exprNode.getTypeSpec()
            : Predefined_1.Predefined.undefinedType;
        if (!TypeChecker_1.TypeChecker.isInteger(exprType) &&
            !TypeChecker_1.TypeChecker.isChar(exprType) &&
            (exprType.getForm() !== TypeFormImpl_1.TypeFormImpl.ENUMERATION)) {
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }
        token = this.synchronize(CaseStatementParser.OF_SET);
        if (token.getType() === PascalTokenType_1.PascalTokenType.OF) {
            token = this.nextToken();
        }
        else {
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_OF, this);
        }
        var constantSet = new List_1.List();
        while (!(token instanceof EofToken_1.EofToken) && (token.getType() !== PascalTokenType_1.PascalTokenType.END)) {
            selectNode.addChild(this.parseBranch(token, exprType, constantSet));
            token = this.currentToken();
            var tokenType = token.getType();
            if (tokenType === PascalTokenType_1.PascalTokenType.SEMICOLON) {
                token = this.nextToken();
            }
            else if (CaseStatementParser.CONSTANT_START_SET.contains(tokenType)) {
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_SEMICOLON, this);
            }
        }
        if (token.getType() === PascalTokenType_1.PascalTokenType.END) {
            token = this.nextToken();
        }
        else {
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_END, this);
        }
        return selectNode;
    };
    CaseStatementParser.prototype.parseBranch = function (token, expressionType, constantSet) {
        var branchNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.SELECT_BRANCH);
        var constantsNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.SELECT_CONSTANTS);
        branchNode.addChild(constantsNode);
        this.parseConstantList(token, expressionType, constantsNode, constantSet);
        token = this.currentToken();
        if (token.getType() === PascalTokenType_1.PascalTokenType.COLON) {
            token = this.nextToken();
        }
        else {
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_COLON, this);
        }
        var statementParser = new StatementParser(this);
        branchNode.addChild(statementParser.parse(token));
        return branchNode;
    };
    CaseStatementParser.prototype.parseConstantList = function (token, expressionType, constantsNode, constantSet) {
        while (CaseStatementParser.CONSTANT_START_SET.contains(token.getType())) {
            constantsNode.addChild(this.parseConstant(token, expressionType, constantSet));
            token = this.synchronize(CaseStatementParser.COMMA_SET);
            if (token.getType() === PascalTokenType_1.PascalTokenType.COMMA) {
                token = this.nextToken();
            }
            else if (CaseStatementParser.CONSTANT_START_SET.contains(token.getType())) {
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_COMMA, this);
            }
        }
    };
    CaseStatementParser.prototype.parseConstant = function (token, expressionType, constantSet) {
        var sign = undefined;
        var constantNode = undefined;
        var constantType = undefined;
        token = this.synchronize(CaseStatementParser.CONSTANT_START_SET);
        var tokenType = token.getType();
        if ((tokenType === PascalTokenType_1.PascalTokenType.PLUS) || (tokenType === PascalTokenType_1.PascalTokenType.MINUS)) {
            sign = tokenType;
            token = this.nextToken();
        }
        switch (token.getType()) {
            case PascalTokenType_1.PascalTokenType.IDENTIFIER: {
                constantNode = this.parseIdentifierConstant(token, sign);
                if (constantNode !== undefined) {
                    constantType = constantNode.getTypeSpec();
                }
                break;
            }
            case PascalTokenType_1.PascalTokenType.INTEGER: {
                constantNode = this.parseIntegerConstant(token.getText(), sign);
                constantType = Predefined_1.Predefined.integerType;
                break;
            }
            case PascalTokenType_1.PascalTokenType.STRING: {
                constantNode =
                    this.parseCharacterConstant(token, token.getValue(), sign);
                constantType = Predefined_1.Predefined.charType;
                break;
            }
            default: {
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_CONSTANT, this);
                break;
            }
        }
        if (constantNode !== undefined) {
            var value = constantNode.getAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE);
            if (constantSet.contains(value)) {
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.CASE_CONSTANT_REUSED, this);
            }
            else {
                constantSet.add(value);
            }
        }
        if (!TypeChecker_1.TypeChecker.areComparisonCompatible(expressionType, constantType)) {
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }
        token = this.nextToken();
        constantNode.setTypeSpec(constantType);
        return constantNode;
    };
    CaseStatementParser.prototype.parseIdentifierConstant = function (token, sign) {
        var constantNode = undefined;
        var constantType = undefined;
        var name = token.getText().toLowerCase();
        var id = CaseStatementParser.symTabStack.lookup(name);
        if (id === undefined) {
            id = CaseStatementParser.symTabStack.enterLocal(name);
            id.setDefinition(DefinitionImpl_1.DefinitionImpl.UNDEFINED);
            id.setTypeSpec(Predefined_1.Predefined.undefinedType);
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.IDENTIFIER_UNDEFINED, this);
            return undefined;
        }
        var defnCode = id.getDefinition();
        if ((defnCode === DefinitionImpl_1.DefinitionImpl.CONSTANT) || (defnCode === DefinitionImpl_1.DefinitionImpl.ENUMERATION_CONSTANT)) {
            var constantValue = id.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.CONSTANT_VALUE);
            constantType = id.getTypeSpec();
            if ((sign !== undefined) && !TypeChecker_1.TypeChecker.isInteger(constantType)) {
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_CONSTANT, this);
            }
            constantNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.INTEGER_CONSTANT);
            constantNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, constantValue);
        }
        id.appendLineNumber(token.getLineNumber());
        if (constantNode !== undefined) {
            constantNode.setTypeSpec(constantType);
        }
        return constantNode;
    };
    CaseStatementParser.prototype.parseIntegerConstant = function (value, sign) {
        var constantNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.INTEGER_CONSTANT);
        var intValue = parseInt(value);
        if (sign === PascalTokenType_1.PascalTokenType.MINUS) {
            intValue = -intValue;
        }
        constantNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, intValue);
        return constantNode;
    };
    CaseStatementParser.prototype.parseCharacterConstant = function (token, value, sign) {
        var constantNode = undefined;
        if (sign !== undefined) {
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_CONSTANT, this);
        }
        else {
            if (value.length === 1) {
                constantNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.STRING_CONSTANT);
                constantNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, value);
            }
            else {
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_CONSTANT, this);
            }
        }
        return constantNode;
    };
    CaseStatementParser.CONSTANT_START_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.IDENTIFIER,
        PascalTokenType_1.PascalTokenType.INTEGER,
        PascalTokenType_1.PascalTokenType.PLUS,
        PascalTokenType_1.PascalTokenType.MINUS,
        PascalTokenType_1.PascalTokenType.STRING]);
    CaseStatementParser.OF_SET = CaseStatementParser.CONSTANT_START_SET.clone();
    CaseStatementParser.COMMA_SET = CaseStatementParser.CONSTANT_START_SET.clone();
    return CaseStatementParser;
}(StatementParser));
exports.CaseStatementParser = CaseStatementParser;
var RepeatStatementParser = (function (_super) {
    __extends(RepeatStatementParser, _super);
    function RepeatStatementParser(parent) {
        _super.call(this, parent);
    }
    RepeatStatementParser.prototype.parse = function (token) {
        token = this.nextToken();
        var loopNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.LOOP);
        var testNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.TEST);
        var statementParser = new StatementParser(this);
        statementParser.parseList(token, loopNode, PascalTokenType_1.PascalTokenType.UNTIL, PascalErrorCode_1.PascalErrorCode.MISSING_UNTIL);
        token = this.currentToken();
        var expressionParser = new ExpressionParser(this);
        var exprNode = expressionParser.parse(token);
        testNode.addChild(exprNode);
        loopNode.addChild(testNode);
        var exprType = exprNode !== undefined ? exprNode.getTypeSpec()
            : Predefined_1.Predefined.undefinedType;
        if (!TypeChecker_1.TypeChecker.isBoolean(exprType)) {
            RepeatStatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }
        return loopNode;
    };
    return RepeatStatementParser;
}(StatementParser));
exports.RepeatStatementParser = RepeatStatementParser;
var CallParser = (function (_super) {
    __extends(CallParser, _super);
    function CallParser(parent) {
        _super.call(this, parent);
    }
    CallParser.initialize = function () {
        CallParser.COMMA_SET.add(PascalTokenType_1.PascalTokenType.COMMA);
        CallParser.COMMA_SET.add(PascalTokenType_1.PascalTokenType.RIGHT_PAREN);
    };
    ;
    CallParser.prototype.parse = function (token) {
        var pfId = CallParser.symTabStack.lookup(token.getText().toLowerCase());
        var routineCode = pfId.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_CODE);
        var callParser = (routineCode === RoutineCodeImpl_1.RoutineCodeImpl.DECLARED) ||
            (routineCode === RoutineCodeImpl_1.RoutineCodeImpl.FORWARD)
            ? new CallDeclaredParser(this)
            : new CallStandardParser(this);
        return callParser.parse(token);
    };
    CallParser.prototype.parseActualParameters = function (token, pfId, isDeclared, isReadReadln, isWriteWriteln) {
        var expressionParser = new ExpressionParser(this);
        var parmsNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.PARAMETERS);
        var formalParms = undefined;
        var parmCount = 0;
        var parmIndex = -1;
        if (isDeclared) {
            formalParms =
                pfId.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_PARMS);
            parmCount = formalParms !== undefined ? formalParms.size() : 0;
        }
        if (token.getType() !== PascalTokenType_1.PascalTokenType.LEFT_PAREN) {
            if (parmCount !== 0) {
                CallParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.WRONG_NUMBER_OF_PARMS, this);
            }
            return undefined;
        }
        token = this.nextToken();
        while (token.getType() !== PascalTokenType_1.PascalTokenType.RIGHT_PAREN) {
            var actualNode = expressionParser.parse(token);
            if (isDeclared) {
                if (++parmIndex < parmCount) {
                    var formalId = formalParms.get(parmIndex);
                    this.checkActualParameter(token, formalId, actualNode);
                }
                else if (parmIndex === parmCount) {
                    CallParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.WRONG_NUMBER_OF_PARMS, this);
                }
            }
            else if (isReadReadln) {
                var type = actualNode.getTypeSpec();
                var form = type.getForm();
                if (!((actualNode.getType() === ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.VARIABLE)
                    && ((form === TypeFormImpl_1.TypeFormImpl.SCALAR) ||
                        (type === Predefined_1.Predefined.booleanType) ||
                        ((form === TypeFormImpl_1.TypeFormImpl.SUBRANGE) &&
                            (type.baseType() === Predefined_1.Predefined.integerType))))) {
                    CallParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_VAR_PARM, this);
                }
            }
            else if (isWriteWriteln) {
                var exprNode = actualNode;
                actualNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.WRITE_PARM);
                actualNode.addChild(exprNode);
                var type = exprNode.getTypeSpec().baseType();
                var form = type.getForm();
                if (!((form === TypeFormImpl_1.TypeFormImpl.SCALAR) || (type === Predefined_1.Predefined.booleanType) ||
                    (type.isPascalString()))) {
                    CallParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                }
                token = this.currentToken();
                actualNode.addChild(this.parseWriteSpec(token));
                token = this.currentToken();
                actualNode.addChild(this.parseWriteSpec(token));
            }
            parmsNode.addChild(actualNode);
            token = this.synchronize(CallParser.COMMA_SET);
            var tokenType = token.getType();
            if (tokenType === PascalTokenType_1.PascalTokenType.COMMA) {
                token = this.nextToken();
            }
            else if (ExpressionParser.EXPR_START_SET.contains(tokenType)) {
                CallParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_COMMA, this);
            }
            else if (tokenType !== PascalTokenType_1.PascalTokenType.RIGHT_PAREN) {
                token = this.synchronize(ExpressionParser.EXPR_START_SET);
            }
        }
        token = this.nextToken();
        if ((parmsNode.getChildren().size() === 0) ||
            (isDeclared && (parmIndex !== parmCount - 1))) {
            CallParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.WRONG_NUMBER_OF_PARMS, this);
        }
        return parmsNode;
    };
    CallParser.prototype.checkActualParameter = function (token, formalId, actualNode) {
        var formalDefn = formalId.getDefinition();
        var formalType = formalId.getTypeSpec();
        var actualType = actualNode.getTypeSpec();
        if (formalDefn === DefinitionImpl_1.DefinitionImpl.VAR_PARM) {
            if ((actualNode.getType() !== ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.VARIABLE) ||
                (actualType !== formalType)) {
                CallParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_VAR_PARM, this);
            }
        }
        else if (!TypeChecker_1.TypeChecker.areAssignmentCompatible(formalType, actualType)) {
            CallParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }
    };
    CallParser.prototype.parseWriteSpec = function (token) {
        if (token.getType() === PascalTokenType_1.PascalTokenType.COLON) {
            token = this.nextToken();
            var expressionParser = new ExpressionParser(this);
            var specNode = expressionParser.parse(token);
            if (specNode.getType() === ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.INTEGER_CONSTANT) {
                return specNode;
            }
            else {
                CallParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_NUMBER, this);
                return undefined;
            }
        }
        else {
            return undefined;
        }
    };
    CallParser.COMMA_SET = ExpressionParser.EXPR_START_SET.clone();
    return CallParser;
}(StatementParser));
exports.CallParser = CallParser;
CallParser.initialize();
var CallDeclaredParser = (function (_super) {
    __extends(CallDeclaredParser, _super);
    function CallDeclaredParser(parent) {
        _super.call(this, parent);
    }
    CallDeclaredParser.prototype.parse = function (token) {
        var callNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.CALL);
        var pfId = CallDeclaredParser.symTabStack.lookup(token.getText().toLowerCase());
        callNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.ID, pfId);
        callNode.setTypeSpec(pfId.getTypeSpec());
        token = this.nextToken();
        var parmsNode = this.parseActualParameters(token, pfId, true, false, false);
        callNode.addChild(parmsNode);
        return callNode;
    };
    return CallDeclaredParser;
}(CallParser));
exports.CallDeclaredParser = CallDeclaredParser;
var CallStandardParser = (function (_super) {
    __extends(CallStandardParser, _super);
    function CallStandardParser(parent) {
        _super.call(this, parent);
    }
    CallStandardParser.prototype.parse = function (token) {
        var callNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.CALL);
        var pfId = CallStandardParser.symTabStack.lookup(token.getText().toLowerCase());
        var routineCode = pfId.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_CODE);
        callNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.ID, pfId);
        token = this.nextToken();
        switch (routineCode) {
            case RoutineCodeImpl_1.RoutineCodeImpl.READ:
            case RoutineCodeImpl_1.RoutineCodeImpl.READLN: return this.parseReadReadln(token, callNode, pfId);
            case RoutineCodeImpl_1.RoutineCodeImpl.WRITE:
            case RoutineCodeImpl_1.RoutineCodeImpl.WRITELN: return this.parseWriteWriteln(token, callNode, pfId);
            case RoutineCodeImpl_1.RoutineCodeImpl.EOF:
            case RoutineCodeImpl_1.RoutineCodeImpl.EOLN: return this.parseEofEoln(token, callNode, pfId);
            case RoutineCodeImpl_1.RoutineCodeImpl.ABS:
            case RoutineCodeImpl_1.RoutineCodeImpl.SQR: return this.parseAbsSqr(token, callNode, pfId);
            case RoutineCodeImpl_1.RoutineCodeImpl.ARCTAN:
            case RoutineCodeImpl_1.RoutineCodeImpl.COS:
            case RoutineCodeImpl_1.RoutineCodeImpl.EXP:
            case RoutineCodeImpl_1.RoutineCodeImpl.LN:
            case RoutineCodeImpl_1.RoutineCodeImpl.SIN:
            case RoutineCodeImpl_1.RoutineCodeImpl.SQRT: return this.parseArctanCosExpLnSinSqrt(token, callNode, pfId);
            case RoutineCodeImpl_1.RoutineCodeImpl.PRED:
            case RoutineCodeImpl_1.RoutineCodeImpl.SUCC: return this.parsePredSucc(token, callNode, pfId);
            case RoutineCodeImpl_1.RoutineCodeImpl.CHR: return this.parseChr(token, callNode, pfId);
            case RoutineCodeImpl_1.RoutineCodeImpl.ODD: return this.parseOdd(token, callNode, pfId);
            case RoutineCodeImpl_1.RoutineCodeImpl.ORD: return this.parseOrd(token, callNode, pfId);
            case RoutineCodeImpl_1.RoutineCodeImpl.ROUND:
            case RoutineCodeImpl_1.RoutineCodeImpl.TRUNC: return this.parseRoundTrunc(token, callNode, pfId);
            default: return undefined;
        }
    };
    CallStandardParser.prototype.parseReadReadln = function (token, callNode, pfId) {
        var parmsNode = this.parseActualParameters(token, pfId, false, true, false);
        callNode.addChild(parmsNode);
        if ((pfId === Predefined_1.Predefined.readId) &&
            (callNode.getChildren().size() === 0)) {
            CallStandardParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.WRONG_NUMBER_OF_PARMS, this);
        }
        return callNode;
    };
    CallStandardParser.prototype.parseWriteWriteln = function (token, callNode, pfId) {
        var parmsNode = this.parseActualParameters(token, pfId, false, false, true);
        callNode.addChild(parmsNode);
        if ((pfId === Predefined_1.Predefined.writeId) &&
            (callNode.getChildren().size() === 0)) {
            CallStandardParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.WRONG_NUMBER_OF_PARMS, this);
        }
        return callNode;
    };
    CallStandardParser.prototype.parseEofEoln = function (token, callNode, pfId) {
        var parmsNode = this.parseActualParameters(token, pfId, false, false, false);
        callNode.addChild(parmsNode);
        if (this.checkParmCount(token, parmsNode, 0)) {
            callNode.setTypeSpec(Predefined_1.Predefined.booleanType);
        }
        return callNode;
    };
    CallStandardParser.prototype.parseAbsSqr = function (token, callNode, pfId) {
        var parmsNode = this.parseActualParameters(token, pfId, false, false, false);
        callNode.addChild(parmsNode);
        if (this.checkParmCount(token, parmsNode, 1)) {
            var argType = parmsNode.getChildren().get(0).getTypeSpec().baseType();
            if ((argType === Predefined_1.Predefined.integerType) ||
                (argType === Predefined_1.Predefined.realType)) {
                callNode.setTypeSpec(argType);
            }
            else {
                CallStandardParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_TYPE, this);
            }
        }
        return callNode;
    };
    CallStandardParser.prototype.parseArctanCosExpLnSinSqrt = function (token, callNode, pfId) {
        var parmsNode = this.parseActualParameters(token, pfId, false, false, false);
        callNode.addChild(parmsNode);
        if (this.checkParmCount(token, parmsNode, 1)) {
            var argType = parmsNode.getChildren().get(0).getTypeSpec().baseType();
            if ((argType === Predefined_1.Predefined.integerType) ||
                (argType === Predefined_1.Predefined.realType)) {
                callNode.setTypeSpec(Predefined_1.Predefined.realType);
            }
            else {
                CallStandardParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_TYPE, this);
            }
        }
        return callNode;
    };
    CallStandardParser.prototype.parsePredSucc = function (token, callNode, pfId) {
        var parmsNode = this.parseActualParameters(token, pfId, false, false, false);
        callNode.addChild(parmsNode);
        if (this.checkParmCount(token, parmsNode, 1)) {
            var argType = parmsNode.getChildren().get(0).getTypeSpec().baseType();
            if ((argType === Predefined_1.Predefined.integerType) ||
                (argType.getForm() === TypeFormImpl_1.TypeFormImpl.ENUMERATION)) {
                callNode.setTypeSpec(argType);
            }
            else {
                CallStandardParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_TYPE, this);
            }
        }
        return callNode;
    };
    CallStandardParser.prototype.parseChr = function (token, callNode, pfId) {
        var parmsNode = this.parseActualParameters(token, pfId, false, false, false);
        callNode.addChild(parmsNode);
        if (this.checkParmCount(token, parmsNode, 1)) {
            var argType = parmsNode.getChildren().get(0).getTypeSpec().baseType();
            if (argType === Predefined_1.Predefined.integerType) {
                callNode.setTypeSpec(Predefined_1.Predefined.charType);
            }
            else {
                CallStandardParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_TYPE, this);
            }
        }
        return callNode;
    };
    CallStandardParser.prototype.parseOdd = function (token, callNode, pfId) {
        var parmsNode = this.parseActualParameters(token, pfId, false, false, false);
        callNode.addChild(parmsNode);
        if (this.checkParmCount(token, parmsNode, 1)) {
            var argType = parmsNode.getChildren().get(0).getTypeSpec().baseType();
            if (argType === Predefined_1.Predefined.integerType) {
                callNode.setTypeSpec(Predefined_1.Predefined.booleanType);
            }
            else {
                CallStandardParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_TYPE, this);
            }
        }
        return callNode;
    };
    CallStandardParser.prototype.parseOrd = function (token, callNode, pfId) {
        var parmsNode = this.parseActualParameters(token, pfId, false, false, false);
        callNode.addChild(parmsNode);
        if (this.checkParmCount(token, parmsNode, 1)) {
            var argType = parmsNode.getChildren().get(0).getTypeSpec().baseType();
            if ((argType === Predefined_1.Predefined.charType) ||
                (argType.getForm() === TypeFormImpl_1.TypeFormImpl.ENUMERATION)) {
                callNode.setTypeSpec(Predefined_1.Predefined.integerType);
            }
            else {
                CallStandardParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_TYPE, this);
            }
        }
        return callNode;
    };
    CallStandardParser.prototype.parseRoundTrunc = function (token, callNode, pfId) {
        var parmsNode = this.parseActualParameters(token, pfId, false, false, false);
        callNode.addChild(parmsNode);
        if (this.checkParmCount(token, parmsNode, 1)) {
            var argType = parmsNode.getChildren().get(0).getTypeSpec().baseType();
            if (argType === Predefined_1.Predefined.realType) {
                callNode.setTypeSpec(Predefined_1.Predefined.integerType);
            }
            else {
                CallStandardParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_TYPE, this);
            }
        }
        return callNode;
    };
    CallStandardParser.prototype.checkParmCount = function (token, parmsNode, count) {
        if (((parmsNode === undefined) && (count === 0)) ||
            (parmsNode.getChildren().size() === count)) {
            return true;
        }
        else {
            CallStandardParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.WRONG_NUMBER_OF_PARMS, this);
            return false;
        }
    };
    return CallStandardParser;
}(CallParser));
exports.CallStandardParser = CallStandardParser;
var VariableParser = (function (_super) {
    __extends(VariableParser, _super);
    function VariableParser(parent) {
        _super.call(this, parent);
        this.isFunctionTarget = false;
    }
    VariableParser.prototype.parseFunctionNameTarget = function (token) {
        this.isFunctionTarget = true;
        return this.parse(token);
    };
    VariableParser.prototype.parse = function (token, variableId) {
        if (variableId) {
            return this.parseTokenSymTab(token, variableId);
        }
        else {
            return this.parseTokenOnly(token);
        }
    };
    VariableParser.prototype.parseTokenSymTab = function (token, variableId) {
        var defnCode = variableId.getDefinition();
        if (!((defnCode === DefinitionImpl_1.DefinitionImpl.VARIABLE) || (defnCode === DefinitionImpl_1.DefinitionImpl.VALUE_PARM) ||
            (defnCode === DefinitionImpl_1.DefinitionImpl.VAR_PARM) ||
            (this.isFunctionTarget && (defnCode === DefinitionImpl_1.DefinitionImpl.FUNCTION)))) {
            VariableParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_IDENTIFIER_USAGE, this);
        }
        variableId.appendLineNumber(token.getLineNumber());
        var variableNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.VARIABLE);
        variableNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.ID, variableId);
        token = this.nextToken();
        var variableType = variableId.getTypeSpec();
        if (!this.isFunctionTarget) {
            while (VariableParser.SUBSCRIPT_FIELD_START_SET.contains(token.getType())) {
                var subFldNode = token.getType() === PascalTokenType_1.PascalTokenType.LEFT_BRACKET
                    ? this.parseSubscripts(variableType)
                    : this.parseField(variableType);
                token = this.currentToken();
                variableType = subFldNode.getTypeSpec();
                variableNode.addChild(subFldNode);
            }
        }
        variableNode.setTypeSpec(variableType);
        return variableNode;
    };
    VariableParser.prototype.parseTokenOnly = function (token) {
        var name = token.getText().toLowerCase();
        var variableId = VariableParser.symTabStack.lookup(name);
        if (variableId === undefined) {
            VariableParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.IDENTIFIER_UNDEFINED, this);
            variableId = VariableParser.symTabStack.enterLocal(name);
            variableId.setDefinition(DefinitionImpl_1.DefinitionImpl.UNDEFINED);
            variableId.setTypeSpec(Predefined_1.Predefined.undefinedType);
        }
        return this.parse(token, variableId);
    };
    VariableParser.prototype.parseSubscripts = function (variableType) {
        var token;
        var expressionParser = new ExpressionParser(this);
        var subscriptsNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.SUBSCRIPTS);
        do {
            token = this.nextToken();
            if (variableType.getForm() === TypeFormImpl_1.TypeFormImpl.ARRAY) {
                var exprNode = expressionParser.parse(token);
                var exprType = exprNode !== undefined ? exprNode.getTypeSpec()
                    : Predefined_1.Predefined.undefinedType;
                var indexType = variableType.getAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_INDEX_TYPE);
                if (!TypeChecker_1.TypeChecker.areAssignmentCompatible(indexType, exprType)) {
                    VariableParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                }
                subscriptsNode.addChild(exprNode);
                variableType =
                    variableType.getAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_ELEMENT_TYPE);
            }
            else {
                VariableParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.TOO_MANY_SUBSCRIPTS, this);
                expressionParser.parse(token);
            }
            token = this.currentToken();
        } while (token.getType() === PascalTokenType_1.PascalTokenType.COMMA);
        token = this.synchronize(VariableParser.RIGHT_BRACKET_SET);
        if (token.getType() === PascalTokenType_1.PascalTokenType.RIGHT_BRACKET) {
            token = this.nextToken();
        }
        else {
            VariableParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_RIGHT_BRACKET, this);
        }
        subscriptsNode.setTypeSpec(variableType);
        return subscriptsNode;
    };
    VariableParser.prototype.parseField = function (variableType) {
        var fieldNode = ICodeFactory_1.ICodeFactory.createICodeNode(DefinitionImpl_1.DefinitionImpl.FIELD);
        var token = this.nextToken();
        var tokenType = token.getType();
        var variableForm = variableType.getForm();
        if ((tokenType === PascalTokenType_1.PascalTokenType.IDENTIFIER) && (variableForm === TypeFormImpl_1.TypeFormImpl.RECORD)) {
            var symTab = variableType.getAttribute(TypeKeyImpl_1.TypeKeyImpl.RECORD_SYMTAB);
            var fieldName = token.getText().toLowerCase();
            var fieldId = symTab.lookup(fieldName);
            if (fieldId !== undefined) {
                variableType = fieldId.getTypeSpec();
                fieldId.appendLineNumber(token.getLineNumber());
                fieldNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.ID, fieldId);
            }
            else {
                VariableParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_FIELD, this);
            }
        }
        else {
            VariableParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_FIELD, this);
        }
        token = this.nextToken();
        fieldNode.setTypeSpec(variableType);
        return fieldNode;
    };
    VariableParser.SUBSCRIPT_FIELD_START_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.LEFT_BRACKET,
        PascalTokenType_1.PascalTokenType.DOT]);
    VariableParser.RIGHT_BRACKET_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.RIGHT_BRACKET,
        PascalTokenType_1.PascalTokenType.EQUALS,
        PascalTokenType_1.PascalTokenType.SEMICOLON]);
    return VariableParser;
}(StatementParser));
exports.VariableParser = VariableParser;
//# sourceMappingURL=parsersBundle.js.map