import {SymTab} from './SymTab';
import {Definition} from './Definition';
import {TypeSpec} from './TypeSpec';
import {SymTabKey} from './SymTabKey';
import {HashMap} from '../util/HashMap';

export interface SymTabEntry extends HashMap {
    /**
     * Getter.
     * @return the name of the entry.
     */
    getName() : string;

    /**
     * Getter.
     * @return the symbol table that contains this entry.
     */
    getSymTab() : SymTab;

    /**
     * Setter.
     * @param definition the definition to set.
     */
    setDefinition(definition : Definition) : void;

    /**
     * Getter.
     * @return the definition.
     */
    getDefinition() : Definition;

    /**
     * Setter.
     * @param typeSpec the type specification to set.
     */
    setTypeSpec(typeSpec : TypeSpec) : void;

    /**
     * Getter.
     * @return the type specification.
     */
    getTypeSpec() : TypeSpec;

    /**
     * Append a source line number to the entry.
     * @param lineNumber the line number to append.
     */
    appendLineNumber(lineNumber : number) : void;

    /**
     * Getter.
     * @return the list of source line numbers.
     */
    getLineNumbers() : number[];
}
