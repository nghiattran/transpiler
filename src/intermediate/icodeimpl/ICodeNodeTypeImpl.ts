export class ICodeNodeTypeImpl {
    private text : string;

    // Program structure
    public static PROGRAM : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('PROGRAM');
    public static PROCEDURE : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('PROCEDURE');
    public static FUNCTION : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('FUNCTION');
    
    // Statements
    public static COMPOUND : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('COMPOUND');
    public static ASSIGN : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('ASSIGN');
    public static LOOP : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('LOOP');
    public static TEST : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('TEST');
    public static CALL : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('CALL');
    public static PARAMETERS : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('PARAMETERS');
    public static IF : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('IF');
    public static SELECT : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('SELECT');
    public static SELECT_BRANCH : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('SELECT_BRANCH');
    public static SELECT_CONSTANTS : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('SELECT_CONSTANTS');
    public static NO_OP : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('NO_OP');
    
    // Relational operators
    public static EQ : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('EQ');
    public static NE : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('NE');
    public static LT : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('LT');
    public static LE : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('LE');
    public static GT : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('GT');
    public static GE : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('GE');
    public static NOT : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('NOT');
    
    // Additive operators
    public static ADD : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('ADD');
    public static SUBTRACT : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('SUBTRACT');
    public static OR : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('OR');
    public static NEGATE : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('NEGATE');
    
    // Multiplicative operators
    public static MULTIPLY : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('MULTIPLY');
    public static INTEGER_DIVIDE : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('INTEGER_DIVIDE');
    public static FLOAT_DIVIDE : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('FLOAT_DIVIDE');
    public static MOD : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('MOD');
    public static AND : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('AND');
    
    // Operands
    public static VARIABLE : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('VARIABLE');
    public static SUBSCRIPTS : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('SUBSCRIPTS');
    public static FIELD : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('FIELD');
    public static INTEGER_CONSTANT : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('INTEGER_CONSTANT');
    public static REAL_CONSTANT : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('REAL_CONSTANT');
    public static STRING_CONSTANT : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('STRING_CONSTANT');
    public static BOOLEAN_CONSTANT : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('BOOLEAN_CONSTANT');
    
    // WRITE parameter
    public static WRITE_PARM : ICodeNodeTypeImpl = new ICodeNodeTypeImpl('WRITE_PARM');

    public constructor(text : string) {
        this.text = text;
    }

    public toString() : string {
        return this.text;
    }
}
