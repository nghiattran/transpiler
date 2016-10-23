"use strict";
var TypeFactory_1 = require('../TypeFactory');
var DefinitionImpl_1 = require('./DefinitionImpl');
var RoutineCodeImpl_1 = require('./RoutineCodeImpl');
var SymTabKeyImpl_1 = require('../symtabimpl/SymTabKeyImpl');
var TypeFormImpl_1 = require('../typeimpl/TypeFormImpl');
var Predefined = (function () {
    function Predefined() {
    }
    /**
     * Initialize a symbol table stack with predefined identifiers.
     * @param symTab the symbol table stack to initialize.
     */
    Predefined.initialize = function (symTabStack) {
        this.initializeTypes(symTabStack);
        this.initializeConstants(symTabStack);
        this.initializeStandardRoutines(symTabStack);
    };
    /**
     * Initialize the predefined types.
     * @param symTabStack the symbol table stack to initialize.
     */
    Predefined.initializeTypes = function (symTabStack) {
        // Type integer.
        this.integerId = symTabStack.enterLocal("integer");
        this.integerType = TypeFactory_1.TypeFactory.createType(TypeFormImpl_1.TypeFormImpl.SCALAR);
        this.integerType.setIdentifier(this.integerId);
        this.integerId.setDefinition(DefinitionImpl_1.DefinitionImpl.TYPE);
        this.integerId.setTypeSpec(this.integerType);
        // Type real.
        this.realId = symTabStack.enterLocal("real");
        this.realType = TypeFactory_1.TypeFactory.createType(TypeFormImpl_1.TypeFormImpl.SCALAR);
        this.realType.setIdentifier(this.realId);
        this.realId.setDefinition(DefinitionImpl_1.DefinitionImpl.TYPE);
        this.realId.setTypeSpec(this.realType);
        // Type boolean.
        this.booleanId = symTabStack.enterLocal("boolean");
        this.booleanType = TypeFactory_1.TypeFactory.createType(TypeFormImpl_1.TypeFormImpl.ENUMERATION);
        this.booleanType.setIdentifier(this.booleanId);
        this.booleanId.setDefinition(DefinitionImpl_1.DefinitionImpl.TYPE);
        this.booleanId.setTypeSpec(this.booleanType);
        // Type char.
        this.charId = symTabStack.enterLocal("char");
        this.charType = TypeFactory_1.TypeFactory.createType(TypeFormImpl_1.TypeFormImpl.SCALAR);
        this.charType.setIdentifier(this.charId);
        this.charId.setDefinition(DefinitionImpl_1.DefinitionImpl.TYPE);
        this.charId.setTypeSpec(this.charType);
        // Undefined type.
        this.undefinedType = TypeFactory_1.TypeFactory.createType(TypeFormImpl_1.TypeFormImpl.SCALAR);
    };
    /**
     * Initialize the predefined constant.
     * @param symTabStack the symbol table stack to initialize.
     */
    Predefined.initializeConstants = function (symTabStack) {
        // Boolean enumeration constant false.
        this.falseId = symTabStack.enterLocal("false");
        this.falseId.setDefinition(DefinitionImpl_1.DefinitionImpl.ENUMERATION_CONSTANT);
        this.falseId.setTypeSpec(this.booleanType);
        this.falseId.setAttribute(SymTabKeyImpl_1.SymTabKeyImpl.CONSTANT_VALUE, 0);
        // Boolean enumeration constant true.
        this.trueId = symTabStack.enterLocal("true");
        this.trueId.setDefinition(DefinitionImpl_1.DefinitionImpl.ENUMERATION_CONSTANT);
        this.trueId.setTypeSpec(this.booleanType);
        this.trueId.setAttribute(SymTabKeyImpl_1.SymTabKeyImpl.CONSTANT_VALUE, 1);
        // Add false and true to the boolean enumeration type.
        var constants = [];
        constants.push(this.falseId);
        constants.push(this.trueId);
        this.booleanType.setAttribute(DefinitionImpl_1.DefinitionImpl.ENUMERATION_CONSTANT, constants);
    };
    /**
     * Initialize the standard procedures and functions.
     * @param symTabStack the symbol table stack to initialize.
     */
    Predefined.initializeStandardRoutines = function (symTabStack) {
        this.readId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.PROCEDURE, "read", RoutineCodeImpl_1.RoutineCodeImpl.READ);
        this.readlnId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.PROCEDURE, "readln", RoutineCodeImpl_1.RoutineCodeImpl.READLN);
        this.writeId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.PROCEDURE, "write", RoutineCodeImpl_1.RoutineCodeImpl.WRITE);
        this.writelnId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.PROCEDURE, "writeln", RoutineCodeImpl_1.RoutineCodeImpl.WRITELN);
        this.absId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "abs", RoutineCodeImpl_1.RoutineCodeImpl.ABS);
        this.arctanId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "arctan", RoutineCodeImpl_1.RoutineCodeImpl.ARCTAN);
        this.chrId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "chr", RoutineCodeImpl_1.RoutineCodeImpl.CHR);
        this.cosId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "cos", RoutineCodeImpl_1.RoutineCodeImpl.COS);
        this.eofId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "eof", RoutineCodeImpl_1.RoutineCodeImpl.EOF);
        this.eolnId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "eoln", RoutineCodeImpl_1.RoutineCodeImpl.EOLN);
        this.expId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "exp", RoutineCodeImpl_1.RoutineCodeImpl.EXP);
        this.lnId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "ln", RoutineCodeImpl_1.RoutineCodeImpl.LN);
        this.oddId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "odd", RoutineCodeImpl_1.RoutineCodeImpl.ODD);
        this.ordId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "ord", RoutineCodeImpl_1.RoutineCodeImpl.ORD);
        this.predId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "pred", RoutineCodeImpl_1.RoutineCodeImpl.PRED);
        this.roundId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "round", RoutineCodeImpl_1.RoutineCodeImpl.ROUND);
        this.sinId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "sin", RoutineCodeImpl_1.RoutineCodeImpl.SIN);
        this.sqrId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "sqr", RoutineCodeImpl_1.RoutineCodeImpl.SQR);
        this.sqrtId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "sqrt", RoutineCodeImpl_1.RoutineCodeImpl.SQRT);
        this.succId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "succ", RoutineCodeImpl_1.RoutineCodeImpl.SUCC);
        this.truncId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "trunc", RoutineCodeImpl_1.RoutineCodeImpl.TRUNC);
    };
    /**
     * Enter a standard DefinitionImpl.PROCEDURE or DefinitionImpl.FUNCTION into the symbol table stack.
     * @param symTabStack the symbol table stack to initialize.
     * @param defn either DefinitionImpl.PROCEDURE or DefinitionImpl.FUNCTION.
     * @param name the DefinitionImpl.PROCEDURE or DefinitionImpl.FUNCTION name.
     */
    Predefined.enterStandard = function (symTabStack, defn, name, routineCode) {
        var procId = symTabStack.enterLocal(name);
        procId.setDefinition(defn);
        procId.setAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_CODE, routineCode);
        return procId;
    };
    return Predefined;
}());
exports.Predefined = Predefined;
