import {TypeSpec} from '../TypeSpec';
import {TypeForm} from '../TypeForm';
import {TypeFormImpl, TypeFormImplEnum} from './TypeFormImpl';

import {Predefined} from '../symtabimpl/Predefined';

export class TypeChecker {
    /**
     * Check if a type specification is integer.
     * @param type the type specification to check.
     * @return true if integer, else false.
     */
    public static isInteger(type : TypeSpec) : boolean {
        return (type != null) && (type.baseType() == Predefined.integerType);
    }

    /**
     * Check if both type specifications are integer.
     * @param type1 the first type specification to check.
     * @param type2 the second type specification to check.
     * @return true if both are integer, else false.
     */
    public static areBothInteger(type1 : TypeSpec, type2: TypeSpec) : boolean {
        return this.isInteger(type1) && this.isInteger(type2);
    }

    /**
     * Check if a type specification is real.
     * @param type the type specification to check.
     * @return true if real, else false.
     */
    public static isReal(type : TypeSpec) : boolean {
        return (type != null) && (type.baseType() == Predefined.realType);
    }

    /**
     * Check if a type specification is integer or real.
     * @param type the type specification to check.
     * @return true if integer or real, else false.
     */
    public static isIntegerOrReal(type : TypeSpec) : boolean {
        return this.isInteger(type) || this.isReal(type);
    }

    /**
     * Check if at least one of two type specifications is real.
     * @param type1 the first type specification to check.
     * @param type2 the second type specification to check.
     * @return true if at least one is real, else false.
     */
    public static isAtLeastOneReal(type1 : TypeSpec, type2 : TypeSpec) : boolean{
        return (this.isReal(type1) && this.isReal(type2)) ||
               (this.isReal(type1) && this.isInteger(type2)) ||
               (this.isInteger(type1) && this.isReal(type2));
    }

    /**
     * Check if a type specification is boolean.
     * @param type the type specification to check.
     * @return true if boolean, else false.
     */
    public static isBoolean(type : TypeSpec) : boolean{
        return (type != null) && (type.baseType() == Predefined.booleanType);
    }

    /**
     * Check if both type specifications are boolean.
     * @param type1 the first type specification to check.
     * @param type2 the second type specification to check.
     * @return true if both are boolean, else false.
     */
    public static areBothBoolean(type1 : TypeSpec, type2 : TypeSpec) : boolean {
        return this.isBoolean(type1) && this.isBoolean(type2);
    }

    /**
     * Check if a type specification is char.
     * @param type the type specification to check.
     * @return true if char, else false.
     */
    public static isChar(type : TypeSpec) : boolean {
        return (type != null) && (type.baseType() == Predefined.charType);
    }

    /**
     * Check if two type specifications are assignment compatible.
     * @param targetType the target type specification.
     * @param valueType the value type specification.
     * @return true if the value can be assigned to the target, else false.
     */
    public static areAssignmentCompatible(targetType : TypeSpec,
                                          valueType : TypeSpec) : boolean
    {
        if ((targetType == null) || (valueType == null)) {
            return false;
        }

        targetType = targetType.baseType();
        valueType  = valueType.baseType();

        var compatible : boolean = false;

        // Identical types.
        if (targetType == valueType) {
            compatible = true;
        }

        // real := integer
        else if (this.isReal(targetType) && this.isInteger(valueType)) {
            compatible = true;
        }

        // string := string
        else {
            compatible =
                targetType.isPascalString() && valueType.isPascalString();
        }

        return compatible;
    }

    /**
     * Check if two type specifications are comparison compatible.
     * @param type1 the first type specification to check.
     * @param type2 the second type specification to check.
     * @return true if the types can be compared to each other, else false.
     */
    public static areComparisonCompatible(type1 : TypeSpec,
                                          type2 : TypeSpec) : boolean
    {
        if ((type1 == null) || (type2 == null)) {
            return false;
        }

        type1 = type1.baseType();
        type2 = type2.baseType();
        var form : TypeForm = type1.getForm();

        var compatible : boolean = false;

        // Two identical scalar or enumeration types.
        // TODO : form === TypeFormImplEnum.SCALAR might not be solution
        if ((type1 === type2) && ((form === TypeFormImplEnum.SCALAR) || (form == TypeFormImplEnum.ENUMERATION))) {
            compatible = true;
        }

        // One integer and one real.
        else if (this.isAtLeastOneReal(type1, type2)) {
            compatible = true;
        }

        // Two strings.
        else {
            compatible = type1.isPascalString() && type2.isPascalString();
        }

        return compatible;
    }
}
