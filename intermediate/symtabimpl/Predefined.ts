import {TypeSpec} from '../TypeSpec';
import {SymTabEntry} from '../SymTabEntry';
import {SymTabStack} from '../SymTabStack';
import {Definition} from '../Definition';
import {RoutineCode} from '../RoutineCode';
import {TypeFactory} from '../TypeFactory';

import {DefinitionImpl, DefinitionImplEnum} from './DefinitionImpl';
import {RoutineCodeImpl, RoutineCodeImplEnum} from './RoutineCodeImpl';

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
        this.integerType = TypeFactory.createType(SCALAR);
        this.integerType.setIdentifier(this.integerId);
        this.integerId.setDefinition(DefinitionImpl.get(DefinitionImplEnum.TYPE));
        this.integerId.setTypeSpec(this.integerType);

        // Type real.
        this.realId = symTabStack.enterLocal("real");
        this.realType = TypeFactory.createType(SCALAR);
        this.realType.setIdentifier(this.realId);
        this.realId.setDefinition(DefinitionImpl.get(DefinitionImplEnum.TYPE));
        this.realId.setTypeSpec(this.realType);

        // Type boolean.
        this.booleanId = symTabStack.enterLocal("boolean");
        this.booleanType = TypeFactory.createType(ENUMERATION);
        this.booleanType.setIdentifier(this.booleanId);
        this.booleanId.setDefinition(DefinitionImpl.get(DefinitionImplEnum.TYPE));
        this.booleanId.setTypeSpec(this.booleanType);

        // Type char.
        this.charId = symTabStack.enterLocal("char");
        this.charType = TypeFactory.createType(SCALAR);
        this.charType.setIdentifier(this.charId);
        this.charId.setDefinition(DefinitionImpl.get(DefinitionImplEnum.TYPE));
        this.charId.setTypeSpec(this.charType);

        // Undefined type.
        this.undefinedType = TypeFactory.createType(SCALAR);
    }

    /**
     * Initialize the predefined constant.
     * @param symTabStack the symbol table stack to initialize.
     */
    private static initializeConstants(symTabStack : SymTabStack) : void {
        // Boolean enumeration constant false.
        this.falseId = symTabStack.enterLocal("false");
        this.falseId.setDefinition(DefinitionImpl.get(DefinitionImplEnum.ENUMERATION_CONSTANT));
        this.falseId.setTypeSpec(this.booleanType);
        this.falseId.setAttribute(CONSTANT_VALUE, 0);

        // Boolean enumeration constant true.
        this.trueId = symTabStack.enterLocal("true");
        this.trueId.setDefinition(DefinitionImpl.get(DefinitionImplEnum.ENUMERATION_CONSTANT));
        this.trueId.setTypeSpec(this.booleanType);
        this.trueId.setAttribute(CONSTANT_VALUE, 1);

        // Add false and true to the boolean enumeration type.
        var constants: SymTabEntry[] = [];
        constants.push(this.falseId);
        constants.push(this.trueId);
        this.booleanType.setAttribute(DefinitionImpl.get(DefinitionImplEnum.ENUMERATION_CONSTANT), constants);
    }

    /**
     * Initialize the standard procedures and functions.
     * @param symTabStack the symbol table stack to initialize.
     */
    private static initializeStandardRoutines(symTabStack : SymTabStack) : void {
        this.readId    = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.PROCEDURE), "read",    RoutineCodeImpl.get(RoutineCodeImplEnum.READ));
        this.readlnId  = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.PROCEDURE), "readln",  RoutineCodeImpl.get(RoutineCodeImplEnum.READLN));
        this.writeId   = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.PROCEDURE), "write",   RoutineCodeImpl.get(RoutineCodeImplEnum.WRITE));
        this.writelnId = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.PROCEDURE), "writeln", RoutineCodeImpl.get(RoutineCodeImplEnum.WRITELN));

        this.absId    = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.FUNCTION), "abs",    RoutineCodeImpl.get(RoutineCodeImplEnum.ABS));
        this.arctanId = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.FUNCTION), "arctan", RoutineCodeImpl.get(RoutineCodeImplEnum.ARCTAN));
        this.chrId    = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.FUNCTION), "chr",    RoutineCodeImpl.get(RoutineCodeImplEnum.CHR));
        this.cosId    = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.FUNCTION), "cos",    RoutineCodeImpl.get(RoutineCodeImplEnum.COS));
        this.eofId    = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.FUNCTION), "eof",    RoutineCodeImpl.get(RoutineCodeImplEnum.EOF));
        this.eolnId   = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.FUNCTION), "eoln",   RoutineCodeImpl.get(RoutineCodeImplEnum.EOLN));
        this.expId    = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.FUNCTION), "exp",    RoutineCodeImpl.get(RoutineCodeImplEnum.EXP));
        this.lnId     = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.FUNCTION), "ln",     RoutineCodeImpl.get(RoutineCodeImplEnum.LN));
        this.oddId    = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.FUNCTION), "odd",    RoutineCodeImpl.get(RoutineCodeImplEnum.ODD));
        this.ordId    = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.FUNCTION), "ord",    RoutineCodeImpl.get(RoutineCodeImplEnum.ORD));
        this.predId   = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.FUNCTION), "pred",   RoutineCodeImpl.get(RoutineCodeImplEnum.PRED));
        this.roundId  = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.FUNCTION), "round",  RoutineCodeImpl.get(RoutineCodeImplEnum.ROUND));
        this.sinId    = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.FUNCTION), "sin",    RoutineCodeImpl.get(RoutineCodeImplEnum.SIN));
        this.sqrId    = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.FUNCTION), "sqr",    RoutineCodeImpl.get(RoutineCodeImplEnum.SQR));
        this.sqrtId   = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.FUNCTION), "sqrt",   RoutineCodeImpl.get(RoutineCodeImplEnum.SQRT));
        this.succId   = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.FUNCTION), "succ",   RoutineCodeImpl.get(RoutineCodeImplEnum.SUCC));
        this.truncId  = this.enterStandard(symTabStack, DefinitionImpl.get(DefinitionImplEnum.FUNCTION), "trunc",  RoutineCodeImpl.get(RoutineCodeImplEnum.TRUNC));
    }

    /**
     * Enter a standard DefinitionImpl.get(DefinitionImplEnum.PROCEDURE) or DefinitionImpl.get(DefinitionImplEnum.FUNCTION) into the symbol table stack.
     * @param symTabStack the symbol table stack to initialize.
     * @param defn either DefinitionImpl.get(DefinitionImplEnum.PROCEDURE) or DefinitionImpl.get(DefinitionImplEnum.FUNCTION).
     * @param name the DefinitionImpl.get(DefinitionImplEnum.PROCEDURE) or DefinitionImpl.get(DefinitionImplEnum.FUNCTION) name.
     */
    private static enterStandard(symTabStack : SymTabStack,
                                defn : Definition, name : string,
                                routineCode : RoutineCode) : SymTabEntry
    {
        var procId : SymTabEntry = symTabStack.enterLocal(name);
        procId.setDefinition(defn);
        procId.setAttribute(ROUTINE_CODE, routineCode);

        return procId;
    }
}
