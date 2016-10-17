"use strict";
var TypeFactory_1 = require('../TypeFactory');
var DefinitionImpl_1 = require('./DefinitionImpl');
var RoutineCodeImpl_1 = require('./RoutineCodeImpl');
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
        this.integerType = TypeFactory_1.TypeFactory.createType(SCALAR);
        this.integerType.setIdentifier(this.integerId);
        this.integerId.setDefinition(DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.TYPE));
        this.integerId.setTypeSpec(this.integerType);
        // Type real.
        this.realId = symTabStack.enterLocal("real");
        this.realType = TypeFactory_1.TypeFactory.createType(SCALAR);
        this.realType.setIdentifier(this.realId);
        this.realId.setDefinition(DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.TYPE));
        this.realId.setTypeSpec(this.realType);
        // Type boolean.
        this.booleanId = symTabStack.enterLocal("boolean");
        this.booleanType = TypeFactory_1.TypeFactory.createType(ENUMERATION);
        this.booleanType.setIdentifier(this.booleanId);
        this.booleanId.setDefinition(DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.TYPE));
        this.booleanId.setTypeSpec(this.booleanType);
        // Type char.
        this.charId = symTabStack.enterLocal("char");
        this.charType = TypeFactory_1.TypeFactory.createType(SCALAR);
        this.charType.setIdentifier(this.charId);
        this.charId.setDefinition(DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.TYPE));
        this.charId.setTypeSpec(this.charType);
        // Undefined type.
        this.undefinedType = TypeFactory_1.TypeFactory.createType(SCALAR);
    };
    /**
     * Initialize the predefined constant.
     * @param symTabStack the symbol table stack to initialize.
     */
    Predefined.initializeConstants = function (symTabStack) {
        // Boolean enumeration constant false.
        this.falseId = symTabStack.enterLocal("false");
        this.falseId.setDefinition(DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.ENUMERATION_CONSTANT));
        this.falseId.setTypeSpec(this.booleanType);
        this.falseId.setAttribute(CONSTANT_VALUE, 0);
        // Boolean enumeration constant true.
        this.trueId = symTabStack.enterLocal("true");
        this.trueId.setDefinition(DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.ENUMERATION_CONSTANT));
        this.trueId.setTypeSpec(this.booleanType);
        this.trueId.setAttribute(CONSTANT_VALUE, 1);
        // Add false and true to the boolean enumeration type.
        var constants = [];
        constants.push(this.falseId);
        constants.push(this.trueId);
        this.booleanType.setAttribute(DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.ENUMERATION_CONSTANT), constants);
    };
    /**
     * Initialize the standard procedures and functions.
     * @param symTabStack the symbol table stack to initialize.
     */
    Predefined.initializeStandardRoutines = function (symTabStack) {
        this.readId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.PROCEDURE), "read", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.READ));
        this.readlnId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.PROCEDURE), "readln", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.READLN));
        this.writeId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.PROCEDURE), "write", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.WRITE));
        this.writelnId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.PROCEDURE), "writeln", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.WRITELN));
        this.absId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.FUNCTION), "abs", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.ABS));
        this.arctanId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.FUNCTION), "arctan", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.ARCTAN));
        this.chrId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.FUNCTION), "chr", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.CHR));
        this.cosId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.FUNCTION), "cos", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.COS));
        this.eofId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.FUNCTION), "eof", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.EOF));
        this.eolnId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.FUNCTION), "eoln", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.EOLN));
        this.expId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.FUNCTION), "exp", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.EXP));
        this.lnId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.FUNCTION), "ln", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.LN));
        this.oddId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.FUNCTION), "odd", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.ODD));
        this.ordId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.FUNCTION), "ord", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.ORD));
        this.predId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.FUNCTION), "pred", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.PRED));
        this.roundId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.FUNCTION), "round", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.ROUND));
        this.sinId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.FUNCTION), "sin", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.SIN));
        this.sqrId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.FUNCTION), "sqr", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.SQR));
        this.sqrtId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.FUNCTION), "sqrt", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.SQRT));
        this.succId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.FUNCTION), "succ", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.SUCC));
        this.truncId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.get(DefinitionImpl_1.DefinitionImplEnum.FUNCTION), "trunc", RoutineCodeImpl_1.RoutineCodeImpl.get(RoutineCodeImpl_1.RoutineCodeImplEnum.TRUNC));
    };
    /**
     * Enter a standard DefinitionImpl.get(DefinitionImplEnum.PROCEDURE) or DefinitionImpl.get(DefinitionImplEnum.FUNCTION) into the symbol table stack.
     * @param symTabStack the symbol table stack to initialize.
     * @param defn either DefinitionImpl.get(DefinitionImplEnum.PROCEDURE) or DefinitionImpl.get(DefinitionImplEnum.FUNCTION).
     * @param name the DefinitionImpl.get(DefinitionImplEnum.PROCEDURE) or DefinitionImpl.get(DefinitionImplEnum.FUNCTION) name.
     */
    Predefined.enterStandard = function (symTabStack, defn, name, routineCode) {
        var procId = symTabStack.enterLocal(name);
        procId.setDefinition(defn);
        procId.setAttribute(ROUTINE_CODE, routineCode);
        return procId;
    };
    return Predefined;
}());
exports.Predefined = Predefined;
