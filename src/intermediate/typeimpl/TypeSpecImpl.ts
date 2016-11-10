import {HashMap} from '../../util/HashMap';

import {TypeSpec} from '../TypeSpec';
import {TypeKey} from '../TypeKey';
import {SymTabEntry} from '../SymTabEntry';
import {TypeForm} from '../TypeForm';

import {Predefined} from '../symtabimpl/Predefined';

import {TypeKeyImpl} from './TypeKeyImpl';
import {TypeFormImpl} from './TypeFormImpl';


export class TypeSpecImpl extends HashMap<TypeKey, Object> implements TypeSpec {
    private form : TypeForm;           // type form
    private identifier : SymTabEntry;  // type identifier

    public constructor(value) {
        super();
        
        if (value instanceof TypeFormImpl) {
            this.formConstructor(value as TypeForm);
        } else if (typeof value === 'string' || value instanceof String) {
            this.stringConstructor(value as string);
        } else {
            throw "Type not covered";
        }
    }

    /**
     * Constructor.
     * @param form the type form.
     */
    public formConstructor(form : TypeForm) {
        this.form = form;
        this.identifier = undefined;
    }

    /**
     * Constructor.
     * @param value a string value.
     */
    public stringConstructor(value : string) {
        this.form = TypeFormImpl.ARRAY;

        let indexType : TypeSpec = new TypeSpecImpl(TypeFormImpl.SUBRANGE) as TypeSpec;
        
        indexType.setAttribute(TypeKeyImpl.SUBRANGE_BASE_TYPE, Predefined.integerType);
        indexType.setAttribute(TypeKeyImpl.SUBRANGE_MIN_VALUE, 1);
        indexType.setAttribute(TypeKeyImpl.SUBRANGE_MAX_VALUE, value.length);

        this.setAttribute(TypeKeyImpl.ARRAY_INDEX_TYPE, indexType);
        this.setAttribute(TypeKeyImpl.ARRAY_ELEMENT_TYPE, Predefined.charType);
        this.setAttribute(TypeKeyImpl.ARRAY_ELEMENT_COUNT, value.length);
    }

    /**
     * Getter
     * @return the type form.
     */
    public getForm() : TypeForm {
        return this.form;
    }

    /**
     * Setter.
     * @param identifier the type identifier (symbol table entry).
     */
    public setIdentifier(identifier : SymTabEntry) : void {
        this.identifier = identifier;
    }

    /**
     * Getter.
     * @return the type identifier (symbol table entry).
     */
    public getIdentifier() : SymTabEntry {
        return this.identifier;
    }

    /**
     * @return true if this is a Pascal string type.
     */
    public isPascalString(): boolean {
        if (this.form === TypeFormImpl.ARRAY) {
            let elmtType : TypeSpec = this.getAttribute(TypeKeyImpl.ARRAY_ELEMENT_TYPE) as TypeSpec;
            let indexType : TypeSpec = this.getAttribute(TypeKeyImpl.ARRAY_INDEX_TYPE) as TypeSpec;

            return (elmtType.baseType()  === Predefined.charType) &&
                   (indexType.baseType() === Predefined.integerType);
        }
        else {
            return false;
        }
    }

    /**
     * @return the base type of this type.
     */
    public baseType() : TypeSpec {
        return this.form === TypeFormImpl.SUBRANGE ? this.getAttribute(TypeKeyImpl.SUBRANGE_BASE_TYPE) as TypeSpec
                                : this;
    }

    toJson() : Object {
        return {
            form : this.form.toString(),
            indentifier: this.identifier ? this.identifier.getName() : undefined
        }
    }
}
