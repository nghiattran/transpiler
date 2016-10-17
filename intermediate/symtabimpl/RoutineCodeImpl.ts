import {RoutineCode} from '../RoutineCode';

export class RoutineCodeImpl implements RoutineCode {
    private text : string;

    public static DECLARED : RoutineCodeImpl = new RoutineCodeImpl('DECLARED');
    public static FORWARD : RoutineCodeImpl = new RoutineCodeImpl('FORWARD');

    public static READ : RoutineCodeImpl = new RoutineCodeImpl('READ');
    public static READLN : RoutineCodeImpl = new RoutineCodeImpl('READLN');
    public static WRITE : RoutineCodeImpl = new RoutineCodeImpl('WRITE');
    public static WRITELN : RoutineCodeImpl = new RoutineCodeImpl('WRITELN');

    public static ABS : RoutineCodeImpl = new RoutineCodeImpl('ABS');
    public static ARCTAN : RoutineCodeImpl = new RoutineCodeImpl('ARCTAN');
    public static CHR : RoutineCodeImpl = new RoutineCodeImpl('CHR');
    public static COS : RoutineCodeImpl = new RoutineCodeImpl('COS');
    public static EOF : RoutineCodeImpl = new RoutineCodeImpl('EOF');
    public static EOLN : RoutineCodeImpl = new RoutineCodeImpl('EOLN');
    public static EXP : RoutineCodeImpl = new RoutineCodeImpl('EXP');
    public static LN : RoutineCodeImpl = new RoutineCodeImpl('LN');
    public static ODD : RoutineCodeImpl = new RoutineCodeImpl('ODD');
    public static ORD : RoutineCodeImpl = new RoutineCodeImpl('ORD');

    public static PRED : RoutineCodeImpl = new RoutineCodeImpl('PRED');
    public static ROUND : RoutineCodeImpl = new RoutineCodeImpl('ROUND');
    public static SIN : RoutineCodeImpl = new RoutineCodeImpl('SIN');
    public static SQR : RoutineCodeImpl = new RoutineCodeImpl('SQR');
    public static SQRT : RoutineCodeImpl = new RoutineCodeImpl('SQRT');
    public static SUCC : RoutineCodeImpl = new RoutineCodeImpl('SUCC');
    public static TRUNC : RoutineCodeImpl = new RoutineCodeImpl('TRUNC');


    /**
     * Constructor.
     */
    constructor(text : string) {
        text = text || this.toString().toLowerCase();
    }

    /**
     * Getter.
     * @return the text of the definition code.
     */
    public getText() : string {
        return this.text;
    }
}