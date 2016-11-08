import {PascalToken} from '../PascalToken';
import {PascalErrorCode} from '../PascalErrorCode';
import {PascalTokenType} from '../PascalTokenType';
import {PascalScanner} from '../PascalScanner';

import {Source} from '../../../frontend/Source';

import {Util} from '../../../util/Util';

export class PascalNumberToken extends PascalToken {
    private static MAX_EXPONENT : number = 37;

    /**
     * Constructor.
     * @param source the source from where to fetch the token's characters.
     * @throws Exception if an error occurred.
     */
    public constructor(source : Source) {
        super(source);
    }

    /**
     * Extract a Pascal number token from the source.
     * @throws Exception if an error occurred.
     */
    protected extract() : void{
        let textBuffer : string = '';  // token's characters
        this.extractNumber(textBuffer);
        this.text = textBuffer.toString();
    }

    /**
     * Extract a Pascal number token from the source.
     * @param textBuffer the buffer to append the token's characters.
     * @throws Exception if an error occurred.
     */
    protected extractNumber(textBuffer : string) : void{
        let wholeDigits : string = undefined;     // digits before the decimal point
        let fractionDigits : string = undefined;  // digits after the decimal point
        let exponentDigits : string = undefined;  // exponent digits
        let exponentSign : string = '+';       // exponent sign '+' or '-'
        let sawDotDot : boolean = false;     // true if saw .. token
        let currentChar : string;              // current character

        this.type = PascalTokenType.INTEGER;  // assume PascalTokenType.INTEGER token this.type for now

        // Extract the digits of the whole part of the number.
        wholeDigits = this.unsignedIntegerDigits(textBuffer);
        if (this.type === PascalTokenType.ERROR) {
            return;
        }

        // Is there a . ?
        // It could be a decimal point or the start of a .. token.
        currentChar = this.currentChar();
        if (currentChar === '.') {
            if (this.peekChar() === '.') {
                sawDotDot = true;  // it's a ".." token, so don't consume it
            }
            else {
                this.type = PascalTokenType.REAL;  // decimal point, so token this.type is PascalTokenType.REAL
                textBuffer += currentChar
                currentChar = this.nextChar();  // consume decimal point

                // Collect the digits of the fraction part of the number.
                fractionDigits = this.unsignedIntegerDigits(textBuffer);
                if (this.type === PascalTokenType.ERROR) {
                    return;
                }
            }
        }

        // Is there an exponent part?
        // There cannot be an exponent if we already saw a ".." token.
        currentChar = this.currentChar();
        if (!sawDotDot && ((currentChar === 'E') || (currentChar === 'e'))) {
            this.type = PascalTokenType.REAL;  // exponent, so token this.type is PascalTokenType.REAL
            textBuffer += currentChar;
            currentChar = this.nextChar();  // consume 'E' or 'e'

            // Exponent sign?
            if ((currentChar === '+') || (currentChar === '-')) {
                textBuffer += currentChar;
                exponentSign = currentChar;
                currentChar = this.nextChar();  // consume '+' or '-'
            }

            // Extract the digits of the exponent.
            exponentDigits = this.unsignedIntegerDigits(textBuffer);
        }

        // Compute the value of an integer number token.
        if (this.type === PascalTokenType.INTEGER) {
            let integerValue : number = this.computeIntegerValue(wholeDigits);

            if (this.type !== PascalTokenType.ERROR) {
                this.value = Math.floor(integerValue);
            }
        }

        // Compute the value of a real number token.
        else if (this.type === PascalTokenType.REAL) {
            let floatValue : number = this.computeFloatValue(wholeDigits, fractionDigits,
                                                 exponentDigits, exponentSign);

            if (this.type !== PascalTokenType.ERROR) {
                this.value = floatValue;
            }
        }
    }

    /**
     * Extract and return the digits of an unsigned integer.
     * @param textBuffer the buffer to append the token's characters.
     * @return the string of digits.
     * @throws Exception if an error occurred.
     */
    private unsignedIntegerDigits(textBuffer : string ) : string {
        let currentChar : string = this.currentChar();

        // Must have at least one digit.
        if (!Util.isDigit(currentChar)) {
            this.type = PascalTokenType.ERROR;
            this.value = PascalErrorCode.INVALID_NUMBER;
            return undefined;
        }

        // Extract the digits.
        let digits : string = '';
        while (Util.isDigit(currentChar)) {
            textBuffer += currentChar
            digits += currentChar;
            currentChar = this.nextChar();  // consume digit
        }

        return digits.toString();
    }

    /**
     * Compute and return the integer value of a string of digits.
     * Check for overflow.
     * @param digits the string of digits.
     * @return the integer value.
     */
    private computeIntegerValue(digits : string) : number {
        // Return 0 if no digits.
        if (digits === undefined) {
            return 0;
        }

        let integerValue : number = 0;
        let prevValue : number = -1;    // overflow occurred if prevValue > integerValue
        let index : number = 0;

        // Loop over the digits to compute the integer value
        // as long as there is no overflow.
        while ((index < digits.length) && (integerValue >= prevValue)) {
            prevValue = integerValue;
            integerValue = 10*integerValue +
                           Util.getNumericValue(digits.charAt(index++))
        }

        // No overflow:  Return the integer value.
        if (integerValue >= prevValue) {
            return integerValue;
        }

        // Overflow:  Set the integer out of range error.
        else {
            this.type = PascalTokenType.ERROR;
            this.value = PascalErrorCode.RANGE_INTEGER;
            return 0;
        }
    }

    /**
     * Compute and return the float value of a real number.
     * @param wholeDigits the string of digits before the decimal point.
     * @param fractionDigits the string of digits after the decimal point.
     * @param exponentDigits the string of exponent digits.
     * @param exponentSign the exponent sign.
     * @return the float value.
     */
    private computeFloatValue(wholeDigits : string, fractionDigits : string,
                              exponentDigits : string, exponentSign : string) : number
    {
        let floatValue : number = 0.0;
        let exponentValue : number = this.computeIntegerValue(exponentDigits);
        let digits : string = wholeDigits;  // whole and fraction digits

        // Negate the exponent if the exponent sign is '-'.
        if (exponentSign === '-') {
            exponentValue = -exponentValue;
        }

        // If there are any fraction digits, adjust the exponent value
        // and append the fraction digits.
        if (fractionDigits !== undefined) {
            exponentValue -= fractionDigits.length;
            digits += fractionDigits;
        }

        // Check for a real number out of range error.
        if (Math.abs(exponentValue + wholeDigits.length) > PascalNumberToken.MAX_EXPONENT) {
            this.type = PascalTokenType.ERROR;
            this.value = PascalErrorCode.RANGE_REAL;
            return 0;
        }

        // Loop over the digits to compute the float value.
        let index : number = 0;
        while (index < digits.length) {
            floatValue = 10*floatValue +
                         Util.getNumericValue(digits.charAt(index++));
        }

        // Adjust the float value based on the exponent value.
        if (exponentValue !== 0) {
            floatValue *= Math.pow(10, exponentValue);
        }

        return floatValue;
    }
}
