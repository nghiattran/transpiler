import {TypeSpec} from './TypeSpec';
import {SymTabEntry} from './SymTabEntry';
import {TypeKey} from './TypeKey';
import {TypeForm} from './TypeForm';

export interface TypeSpec {
    /**
     * Getter
     * @return the type form.
     */
    getForm() : TypeForm;

    /**
     * Setter.
     * @param identifier the type identifier (symbol table entry).
     */
    setIdentifier(identifier : SymTabEntry) : void;

    /**
     * Getter.
     * @return the type identifier (symbol table entry).
     */
    getIdentifier() : SymTabEntry;

    /**
     * Set an attribute of the specification.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    setAttribute(key : TypeKey, value : Object) : void;

    /**
     * Get the value of an attribute of the specification.
     * @param key the attribute key.
     * @return the attribute value.
     */
    getAttribute(key : TypeKey) : Object;

    /**
     * @return true if this is a Pascal string type.
     */
    isPascalString() : boolean;

    /**
     * @return the base type of this type.
     */
    baseType() : TypeSpec;

    toJson() : Object;
}
