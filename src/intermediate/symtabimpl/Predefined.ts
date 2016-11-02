import {TypeSpec} from '../TypeSpec';
import {SymTabEntry} from '../SymTabEntry';
import {SymTabStack} from '../SymTabStack';
import {Definition} from '../Definition';
import {RoutineCode} from '../RoutineCode';
import {TypeFactory} from '../TypeFactory';

import {DefinitionImpl} from './DefinitionImpl';
import {RoutineCodeImpl} from './RoutineCodeImpl';
import {SymTabKeyImpl} from './SymTabKeyImpl'

import {TypeFormImpl} from '../typeimpl/TypeFormImpl'

export  class Predefined {
    // Predefined types.
    public static integerType      : TypeSpec;
    public static realType         : TypeSpec;
    public static booleanType      : TypeSpec;
    public static charType         : TypeSpec;
    public static undefinedType    : TypeSpec;

    // Predefined identifiers.
    public static integerId        : SymTabEntry;
    public static realId           : SymTabEntry;
    public static booleanId        : SymTabEntry;
    public static charId           : SymTabEntry;
    public static falseId          : SymTabEntry;
    public static trueId           : SymTabEntry;
    public static readId           : SymTabEntry;
    public static readlnId         : SymTabEntry;
    public static writeId          : SymTabEntry;
    public static writelnId        : SymTabEntry;
    public static absId            : SymTabEntry;
    public static arctanId         : SymTabEntry;
    public static chrId            : SymTabEntry;
    public static cosId            : SymTabEntry;
    public static eofId            : SymTabEntry;
    public static eolnId           : SymTabEntry;
    public static expId            : SymTabEntry;
    public static lnId             : SymTabEntry;
    public static oddId            : SymTabEntry;
    public static ordId            : SymTabEntry;
    public static predId           : SymTabEntry;
    public static roundId          : SymTabEntry;
    public static sinId            : SymTabEntry;
    public static sqrId            : SymTabEntry;
    public static sqrtId           : SymTabEntry;
    public static succId           : SymTabEntry;
    public static truncId          : SymTabEntry;

    /**
     * Initialize a symbol table stack with predefined identifiers.
     * @param symTab the symbol table stack to initialize.
     */
    public static initialize(symTabStack : SymTabStack) : void{
        this.initializeTypes(symTabStack);
        this.initializeConstants(symTabStack);
        this.initializeStandardRoutines(symTabStack);
    }

    /**
     * Initialize the predefined types.
     * @param symTabStack the symbol table stack to initialize.
     */
    private static initializeTypes(symTabStack : SymTabStack) : void{
        // Type integer.
        this.integerId = symTabStack.enterLocal("integer");
        this.integerType = TypeFactory.createType(TypeFormImpl.SCALAR);
        this.integerType.setIdentifier(this.integerId);
        this.integerId.setDefinition(DefinitionImpl.TYPE);
        this.integerId.setTypeSpec(this.integerType);

        // Type real.
        this.realId = symTabStack.enterLocal("real");
        this.realType = TypeFactory.createType(TypeFormImpl.SCALAR);
        this.realType.setIdentifier(this.realId);
        this.realId.setDefinition(DefinitionImpl.TYPE);
        this.realId.setTypeSpec(this.realType);

        // Type boolean.
        this.booleanId = symTabStack.enterLocal("boolean");
        this.booleanType = TypeFactory.createType(TypeFormImpl.ENUMERATION);
        this.booleanType.setIdentifier(this.booleanId);
        this.booleanId.setDefinition(DefinitionImpl.TYPE);
        this.booleanId.setTypeSpec(this.booleanType);

        // Type char.
        this.charId = symTabStack.enterLocal("char");
        this.charType = TypeFactory.createType(TypeFormImpl.SCALAR);
        this.charType.setIdentifier(this.charId);
        this.charId.setDefinition(DefinitionImpl.TYPE);
        this.charId.setTypeSpec(this.charType);

        // Undefined type.
        this.undefinedType = TypeFactory.createType(TypeFormImpl.SCALAR);
    }

    /**
     * Initialize the predefined constant.
     * @param symTabStack the symbol table stack to initialize.
     */
    private static initializeConstants(symTabStack : SymTabStack) : void {
        // Boolean enumeration constant false.
        this.falseId = symTabStack.enterLocal("false");
        this.falseId.setDefinition(DefinitionImpl.ENUMERATION_CONSTANT);
        this.falseId.setTypeSpec(this.booleanType);
        this.falseId.setAttribute(SymTabKeyImpl.CONSTANT_VALUE, 0);

        // Boolean enumeration constant true.
        this.trueId = symTabStack.enterLocal("true");
        this.trueId.setDefinition(DefinitionImpl.ENUMERATION_CONSTANT);
        this.trueId.setTypeSpec(this.booleanType);
        this.trueId.setAttribute(SymTabKeyImpl.CONSTANT_VALUE, 1);

        // Add false and true to the boolean enumeration type.
        var constants: SymTabEntry[] = [];
        constants.push(this.falseId);
        constants.push(this.trueId);
        this.booleanType.setAttribute(DefinitionImpl.ENUMERATION_CONSTANT, constants);
    }

    /**
     * Initialize the standard procedures and functions.
     * @param symTabStack the symbol table stack to initialize.
     */
    private static initializeStandardRoutines(symTabStack : SymTabStack) : void {
        this.readId    = this.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "read",    RoutineCodeImpl.READ);
        this.readlnId  = this.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "readln",  RoutineCodeImpl.READLN);
        this.writeId   = this.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "write",   RoutineCodeImpl.WRITE);
        this.writelnId = this.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "writeln", RoutineCodeImpl.WRITELN);

        this.absId    = this.enterStandard(symTabStack, DefinitionImpl.FUNCTION, "abs",    RoutineCodeImpl.ABS);
        this.arctanId = this.enterStandard(symTabStack, DefinitionImpl.FUNCTION, "arctan", RoutineCodeImpl.ARCTAN);
        this.chrId    = this.enterStandard(symTabStack, DefinitionImpl.FUNCTION, "chr",    RoutineCodeImpl.CHR);
        this.cosId    = this.enterStandard(symTabStack, DefinitionImpl.FUNCTION, "cos",    RoutineCodeImpl.COS);
        this.eofId    = this.enterStandard(symTabStack, DefinitionImpl.FUNCTION, "eof",    RoutineCodeImpl.EOF);
        this.eolnId   = this.enterStandard(symTabStack, DefinitionImpl.FUNCTION, "eoln",   RoutineCodeImpl.EOLN);
        this.expId    = this.enterStandard(symTabStack, DefinitionImpl.FUNCTION, "exp",    RoutineCodeImpl.EXP);
        this.lnId     = this.enterStandard(symTabStack, DefinitionImpl.FUNCTION, "ln",     RoutineCodeImpl.LN);
        this.oddId    = this.enterStandard(symTabStack, DefinitionImpl.FUNCTION, "odd",    RoutineCodeImpl.ODD);
        this.ordId    = this.enterStandard(symTabStack, DefinitionImpl.FUNCTION, "ord",    RoutineCodeImpl.ORD);
        this.predId   = this.enterStandard(symTabStack, DefinitionImpl.FUNCTION, "pred",   RoutineCodeImpl.PRED);
        this.roundId  = this.enterStandard(symTabStack, DefinitionImpl.FUNCTION, "round",  RoutineCodeImpl.ROUND);
        this.sinId    = this.enterStandard(symTabStack, DefinitionImpl.FUNCTION, "sin",    RoutineCodeImpl.SIN);
        this.sqrId    = this.enterStandard(symTabStack, DefinitionImpl.FUNCTION, "sqr",    RoutineCodeImpl.SQR);
        this.sqrtId   = this.enterStandard(symTabStack, DefinitionImpl.FUNCTION, "sqrt",   RoutineCodeImpl.SQRT);
        this.succId   = this.enterStandard(symTabStack, DefinitionImpl.FUNCTION, "succ",   RoutineCodeImpl.SUCC);
        this.truncId  = this.enterStandard(symTabStack, DefinitionImpl.FUNCTION, "trunc",  RoutineCodeImpl.TRUNC);
    }

    /**
     * Enter a standard DefinitionImpl.PROCEDURE or DefinitionImpl.FUNCTION into the symbol table stack.
     * @param symTabStack the symbol table stack to initialize.
     * @param defn either DefinitionImpl.PROCEDURE or DefinitionImpl.FUNCTION.
     * @param name the DefinitionImpl.PROCEDURE or DefinitionImpl.FUNCTION name.
     */
    private static enterStandard(symTabStack : SymTabStack,
                                defn : Definition, name : string,
                                routineCode : RoutineCode) : SymTabEntry
    {
        var procId : SymTabEntry = symTabStack.enterLocal(name);
        procId.setDefinition(defn);
        procId.setAttribute(SymTabKeyImpl.ROUTINE_CODE, routineCode);

        return procId;
    }
}
