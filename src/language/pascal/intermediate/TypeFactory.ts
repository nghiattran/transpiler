import {TypeForm} from '../../../intermediate/TypeForm';
import {TypeSpecImpl} from './typeimpl/TypeSpecImpl';
import {TypeSpec} from '../../../intermediate/TypeSpec';


export class TypeFactory {
    /**
     * Create a type specification of a given form.
     * @param form the form.
     * @return the type specification.
     */
    public static createType(form : TypeForm) : TypeSpec{
        return new TypeSpecImpl(form);
    }

    /**
     * Create a string type specification.
     * @param value the string value.
     * @return the type specification.
     */
    public static createStringType(value : string) : TypeSpec{
        return new TypeSpecImpl(value);
    }
}
