import {HashMap} from '../../util/HashMap';

import {TypeSpec} from '../TypeSpec';
import {SymTabEntry} from '../SymTabEntry';
import {TypeForm} from '../TypeForm';

import {Predefined} from '../symtabimpl/Predefined';

import {TypeKeyImpl, TypeKeyImplEnum} from './TypeKeyImpl';
import {TypeFormImpl, TypeFormImplEnum} from './TypeFormImpl';


export class TypeSpecImpl extends HashMap implements TypeSpec {
    private form : TypeForm;           // type form
    private identifier : SymTabEntry;  // type identifier

    public constructor(value) {
        super();
        if (typeof value === 'TypeForm') {
            this.formConstructor(value as TypeForm);
        } else if (typeof value === 'string') {
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
        this.identifier = null;
    }

    /**
     * Constructor.
     * @param value a string value.
     */
    public stringConstructor(value : string) {
        this.form = TypeFormImpl.get(TypeFormImplEnum.ARRAY);

        var indexType : TypeSpec = new TypeSpecImpl(TypeFormImpl.get(TypeFormImplEnum.SUBRANGE)) as TypeSpec;
        
        indexType.setAttribute(TypeKeyImpl.get(TypeKeyImplEnum.SUBRANGE_BASE_TYPE), Predefined.integerType);
        indexType.setAttribute(TypeKeyImpl.get(TypeKeyImplEnum.SUBRANGE_MIN_VALUE), 1);
        indexType.setAttribute(TypeKeyImpl.get(TypeKeyImplEnum.SUBRANGE_MAX_VALUE), value.length);

        this.setAttribute(TypeKeyImpl.get(TypeKeyImplEnum.ARRAY_INDEX_TYPE), indexType);
        this.setAttribute(TypeKeyImpl.get(TypeKeyImplEnum.ARRAY_ELEMENT_TYPE), Predefined.charType);
        this.setAttribute(TypeKeyImpl.get(TypeKeyImplEnum.ARRAY_ELEMENT_COUNT), value.length);
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
        if (this.form === TypeFormImpl.get(TypeFormImplEnum.ARRAY)) {
            var elmtType : TypeSpec = this.getAttribute(TypeKeyImpl.get(TypeKeyImplEnum.ARRAY_ELEMENT_TYPE)) as TypeSpec;
            var indexType : TypeSpec = this.getAttribute(TypeKeyImpl.get(TypeKeyImplEnum.ARRAY_INDEX_TYPE)) as TypeSpec;

            return (elmtType.baseType()  == Predefined.charType) &&
                   (indexType.baseType() == Predefined.integerType);
        }
        else {
            return false;
        }
    }

    /**
     * @return the base type of this type.
     */
    public baseType() : TypeSpec {
        return this.form == TypeFormImpl.get(TypeFormImplEnum.SUBRANGE) ? this.getAttribute(TypeKeyImpl.get(TypeKeyImplEnum.SUBRANGE_BASE_TYPE)) as TypeSpec
                                : this;
    }
}
