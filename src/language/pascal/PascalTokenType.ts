import {TokenType} from '../../frontend/TokenType';

import {List} from '../../util/List';
import {TreeMap} from '../../util/TreeMap';
import {PolyfillObject} from '../../util/PolyfillObject';

export enum PascalTokenTypeEnum {
    // Reserved words.
    AND, 
    ARRAY, 
    BEGIN, 
    CASE, 
    CONST, 
    DIV, 
    DO, 
    DOWNTO, 
    ELSE, 
    END,
    FILE, 
    FOR, 
    FUNCTION, 
    GOTO, IF, IN, LABEL, MOD, NIL, NOT,
    OF, OR, PACKED, PROCEDURE, PROGRAM, RECORD, REPEAT, SET,
    THEN, TO, TYPE, UNTIL, VAR, WHILE, WITH,

    // Special symbols.
    PLUS              //("+")
    , MINUS           //("-")
    , STAR            //("*")
    , SLASH           //("/")
    , COLON_EQUALS    //(":=")
    , DOT             //(".")
    , COMMA           //(",")
    , SEMICOLON       //(";")
    , COLON           //(":")
    , QUOTE           //("'")
    , EQUALS          //("=")
    , NOT_EQUALS      //("<>")
    , LESS_THAN       //("<")
    , LESS_EQUALS     //("<=")
    , GREATER_EQUALS  //(">=")
    , GREATER_THAN    //(">")
    , LEFT_PAREN      //("(")
    , RIGHT_PAREN     //(")")
    , LEFT_BRACKET    //("[")
    , RIGHT_BRACKET   //("]")
    , LEFT_BRACE      //("{")
    , RIGHT_BRACE     //("}")
    , UP_ARROW        // ("^")
    , DOT_DOT         // ("..")
    , IDENTIFIER, INTEGER, REAL, STRING,
    ERROR, END_OF_FILE,
}

export namespace PascalTokenTypeEnum {
  function isIndex(key):boolean {
    const n = ~~Number(key);
    return String(n) === key && n >= 0;
  }

  const _names:string[] = Object
      .keys(PascalTokenTypeEnum)
      .filter(key => !isIndex(key));

  const _indices:number[] = Object
      .keys(PascalTokenTypeEnum)
      .filter(key => isIndex(key))
      .map(index => Number(index));

  export function names():string[] {
    return _names;
  }

  export function indices():number[] {
    return _indices;
  }
}

export class PascalTokenType extends PolyfillObject implements TokenType {
    static AND : PascalTokenType = new PascalTokenType('AND');
    static ARRAY : PascalTokenType = new PascalTokenType('ARRAY');
    static BEGIN : PascalTokenType = new PascalTokenType('BEGIN');
    static CASE : PascalTokenType = new PascalTokenType('CASE');
    static CONST : PascalTokenType = new PascalTokenType('CONST');
    static DIV : PascalTokenType = new PascalTokenType('DIV');
    static DO : PascalTokenType = new PascalTokenType('DO');
    static DOWNTO : PascalTokenType = new PascalTokenType('DOWNTO');
    static ELSE : PascalTokenType = new PascalTokenType('ELSE');
    static END : PascalTokenType = new PascalTokenType('END');
    static FILE : PascalTokenType = new PascalTokenType('FILE');
    static FOR : PascalTokenType = new PascalTokenType('FOR');
    static FUNCTION : PascalTokenType = new PascalTokenType('FUNCTION');
    static GOTO : PascalTokenType = new PascalTokenType('GOTO');
    static IF : PascalTokenType = new PascalTokenType('IF');
    static IN : PascalTokenType = new PascalTokenType('IN');
    static LABEL : PascalTokenType = new PascalTokenType('LABEL');
    static MOD : PascalTokenType = new PascalTokenType('MOD');
    static NIL : PascalTokenType = new PascalTokenType('NIL');
    static NOT : PascalTokenType = new PascalTokenType('NOT');
    static OF : PascalTokenType = new PascalTokenType('OF');
    static OR : PascalTokenType = new PascalTokenType('OR');
    static PACKED : PascalTokenType = new PascalTokenType('PACKED');
    static PROCEDURE : PascalTokenType = new PascalTokenType('PROCEDURE');
    static PROGRAM : PascalTokenType = new PascalTokenType('PROGRAM');
    static RECORD : PascalTokenType = new PascalTokenType('RECORD');
    static REPEAT : PascalTokenType = new PascalTokenType('REPEAT');
    static SET : PascalTokenType = new PascalTokenType('SET');
    static THEN : PascalTokenType = new PascalTokenType('THEN');
    static TO : PascalTokenType = new PascalTokenType('TO');
    static TYPE : PascalTokenType = new PascalTokenType('TYPE');
    static UNTIL : PascalTokenType = new PascalTokenType('UNTIL');
    static VAR : PascalTokenType = new PascalTokenType('VAR');
    static WHILE : PascalTokenType = new PascalTokenType('WHILE');
    static WITH : PascalTokenType = new PascalTokenType('WITH');

    static PLUS : PascalTokenType = new PascalTokenType('+');
    static MINUS : PascalTokenType = new PascalTokenType('-');
    static STAR : PascalTokenType = new PascalTokenType('*');
    static SLASH : PascalTokenType = new PascalTokenType('/');
    static COLON_EQUALS : PascalTokenType = new PascalTokenType(':=');
    static DOT : PascalTokenType = new PascalTokenType('.');
    static COMMA : PascalTokenType = new PascalTokenType(',');
    static SEMICOLON : PascalTokenType = new PascalTokenType(';');
    static COLON : PascalTokenType = new PascalTokenType(':');
    static QUOTE : PascalTokenType = new PascalTokenType('"');
    static EQUALS : PascalTokenType = new PascalTokenType('=');
    static NOT_EQUALS : PascalTokenType = new PascalTokenType('<>');
    static LESS_THAN : PascalTokenType = new PascalTokenType('<');
    static LESS_EQUALS : PascalTokenType = new PascalTokenType('<=');
    static GREATER_EQUALS : PascalTokenType = new PascalTokenType('>=');
    static GREATER_THAN : PascalTokenType = new PascalTokenType('>');
    static LEFT_PAREN : PascalTokenType = new PascalTokenType('(');
    static RIGHT_PAREN : PascalTokenType = new PascalTokenType(')');
    static LEFT_BRACKET : PascalTokenType = new PascalTokenType('[');
    static RIGHT_BRACKET : PascalTokenType = new PascalTokenType(']');
    static LEFT_BRACE : PascalTokenType = new PascalTokenType('{');
    static RIGHT_BRACE : PascalTokenType = new PascalTokenType('}');
    static UP_ARROW : PascalTokenType = new PascalTokenType('^');
    static DOT_DOT : PascalTokenType = new PascalTokenType('..');

    static IDENTIFIER : PascalTokenType = new PascalTokenType('IDENTIFIER');
    static INTEGER : PascalTokenType = new PascalTokenType('INTEGER');
    static REAL : PascalTokenType = new PascalTokenType('REAL');
    static STRING : PascalTokenType = new PascalTokenType('STRING');
    static ERROR : PascalTokenType = new PascalTokenType('ERROR');
    static END_OF_FILE : PascalTokenType = new PascalTokenType('END_OF_FILE');

    private static FIRST_RESERVED_INDEX : number =  PascalTokenTypeEnum.AND;
    private static LAST_RESERVED_INDEX : number = PascalTokenTypeEnum.WITH;

    private static FIRST_SPECIAL_INDEX : number = PascalTokenTypeEnum.PLUS;
    private static LAST_SPECIAL_INDEX : number = PascalTokenTypeEnum.DOT_DOT;

    private text : string;  // token text

    // Set of lower-cased Pascal reserved word text strings.
    public static RESERVED_WORDS : List<PascalTokenTypeEnum> = new List<PascalTokenTypeEnum>();

    // Hash table of Pascal special symbols.  Each special symbol's text
    // is the key to its Pascal token type.
    public static SPECIAL_SYMBOLS : TreeMap<PascalTokenType> = new TreeMap<PascalTokenType>();

    /**
     * Constructor.
     * @param text the token text.
     */
    constructor(text : string) {
        super();
        text = text || this.toString().toLowerCase()
        this.text = text;
    }

    static initialize() {
        let values : string[] = PascalTokenTypeEnum.names();
        for (let i = PascalTokenType.FIRST_RESERVED_INDEX; i < PascalTokenType.LAST_RESERVED_INDEX; ++i) {
            PascalTokenType.RESERVED_WORDS.add(PascalTokenType[values[i]]);
        }

        let specialValues : string[] = PascalTokenTypeEnum.names();
        for (let i = PascalTokenType.FIRST_SPECIAL_INDEX; i < PascalTokenType.LAST_SPECIAL_INDEX; ++i) {
            
            PascalTokenType.SPECIAL_SYMBOLS.put(PascalTokenType[values[i]].getText(), PascalTokenType[values[i]]);
        }
    }

    /**
     * Getter.
     * @return the token text.
     */
    public getText() : string{
        return this.text;
    }
}

PascalTokenType.initialize();