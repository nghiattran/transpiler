import {PascalParser} from '../PascalParser';
import {PascalTokenType} from '../PascalTokenType';
import {PascalErrorCode} from '../PascalErrorCode';

import {Token} from '../../Token';
import {TokenType} from '../../TokenType';

import {Definition} from '../../../intermediate/Definition';
import {TypeSpec} from '../../../intermediate/TypeSpec';
import {SymTabEntry} from '../../../intermediate/SymTabEntry';
import {TypeFactory} from '../../../intermediate/TypeFactory';

import {DefinitionImpl} from '../../../intermediate/symtabimpl/DefinitionImpl';
import {Predefined} from '../../../intermediate/symtabimpl/Predefined';

import {TypeKeyImpl} from '../../../intermediate/typeimpl/TypeKeyImpl';
import {TypeFormImpl} from '../../../intermediate/typeimpl/TypeFormImpl';

import {List} from '../../../util/List';
import {Util} from '../../../util/Util';

import {DeclarationsParser} from './DeclarationsParser';
import {ConstantDefinitionsParser} from './ConstantDefinitionsParser';
import {TypeSpecificationParser} from './TypeSpecificationParser';

export class SubrangeTypeParser extends TypeSpecificationParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    constructor(parent : PascalParser) {
        super(parent);
    }

    /**
     * Parse a Pascal subrange type specification.
     * @param token the current token.
     * @return the subrange type specification.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) {
        let subrangeType : TypeSpec = TypeFactory.createType(TypeFormImpl.SUBRANGE);
        let minValue : Object = undefined;
        let maxValue : Object = undefined;

        // Parse the minimum constant.
        let constantToken : Token = token;
        let constantParser : ConstantDefinitionsParser =
            new ConstantDefinitionsParser(this);
        minValue = constantParser.parseConstant(token);

        // Set the minimum constant's type.
        let minType : TypeSpec = constantToken.getType() === PascalTokenType.IDENTIFIER
                               ? constantParser.getConstantType(constantToken)
                               : constantParser.getConstantType(minValue);

        minValue = this.checkValueType(constantToken, minValue, minType);

        token = this.currentToken();
        let sawDotDot : boolean = false;

        // Look for the .. token.
        if (token.getType() === PascalTokenType.DOT_DOT) {
            token = this.nextToken();  // consume the .. token
            sawDotDot = true;
        }

        let tokenType : TokenType = token.getType();

        // At the start of the maximum constant?
        if (ConstantDefinitionsParser.CONSTANT_START_SET.contains(tokenType as PascalTokenType)) {
            if (!sawDotDot) {
                SubrangeTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_DOT_DOT, this);
            }

            // Parse the maximum constant.
            token = this.synchronize(ConstantDefinitionsParser.CONSTANT_START_SET);
            constantToken = token;
            maxValue = constantParser.parseConstant(token);

            // Set the maximum constant's type.
            let maxType : TypeSpec = constantToken.getType() === PascalTokenType.IDENTIFIER
                               ? constantParser.getConstantType(constantToken)
                               : constantParser.getConstantType(maxValue);

            maxValue = this.checkValueType(constantToken, maxValue, maxType);

            // Are the min and max value types valid?
            if ((minType === undefined) || (maxType === undefined)) {
                SubrangeTypeParser.errorHandler.flag(constantToken, PascalErrorCode.INCOMPATIBLE_TYPES, this);
            }

            // Are the min and max value types the same?
            else if (minType !== maxType) {
                SubrangeTypeParser.errorHandler.flag(constantToken, PascalErrorCode.INVALID_SUBRANGE_TYPE, this);
            }

            // Min value > max value?
            else if ((minValue !== undefined) && (maxValue !== undefined) &&
                     (Math.floor(<number> minValue) >= Math.floor(<number> maxValue))) {
                SubrangeTypeParser.errorHandler.flag(constantToken, PascalErrorCode.MIN_GT_MAX, this);
            }
        }
        else {
            SubrangeTypeParser.errorHandler.flag(constantToken, PascalErrorCode.INVALID_SUBRANGE_TYPE, this);
        }

        subrangeType.setAttribute(TypeKeyImpl.SUBRANGE_BASE_TYPE, minType);
        subrangeType.setAttribute(TypeKeyImpl.SUBRANGE_MIN_VALUE, minValue);
        subrangeType.setAttribute(TypeKeyImpl.SUBRANGE_MAX_VALUE, maxValue);

        return subrangeType;
    }

    /**
     * Check a value of a type specification.
     * @param token the current token.
     * @param value the value.
     * @param type the type specifiction.
     * @return the value.
     */
    private checkValueType(token : Token, value : Object, type : TypeSpec) : Object{
        if (type === undefined) {
            return value;
        }
        if (type === Predefined.integerType) {
            return value;
        }
        else if (type === Predefined.charType) {
            let ch :string = (<string> value).charAt(0);
            return Number(ch);;
        }
        else if (type.getForm() === TypeFormImpl.ENUMERATION) {
            return value;
        }
        else {
            SubrangeTypeParser.errorHandler.flag(token, PascalErrorCode.INVALID_SUBRANGE_TYPE, this);
            return value;
        }
    }
}
