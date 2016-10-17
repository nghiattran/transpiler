import {RoutineCode} from '../RoutineCode';

export class RoutineCodeImpl implements RoutineCode {
    private text : string;

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

    public static get(type : RoutineCodeImplEnum) : RoutineCodeImpl {
        return new RoutineCodeImpl(RoutineCodeImplEnum[type]);
    }
}

export enum RoutineCodeImplEnum {
    DECLARED, FORWARD,
    READ, READLN, WRITE, WRITELN,
    ABS, ARCTAN, CHR, COS, EOF, EOLN, EXP, LN, ODD, ORD,
    PRED, ROUND, SIN, SQR, SQRT, SUCC, TRUNC,
}
