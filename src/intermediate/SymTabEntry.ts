import {SymTab} from './SymTab';
import {Definition} from './Definition';
import {TypeSpec} from './TypeSpec';
import {SymTabKey} from './SymTabKey';
import {HashMap} from '../util/HashMap';

export class SymTabEntry extends HashMap<SymTabKey, Object> {
    private name : string;                     // entry name
    private symTab : SymTab;                   // parent symbol table
    private definition : Definition;           // how the identifier is defined
    private typeSpec : TypeSpec;               // type specification
    private lineNumbers : number[];  // source line numbers

    /**
     * Constructor.
     * @param name the name of the entry.
     * @param symTab the symbol table that contains this entry.
     */
    public constructor(name : string, symTab : SymTab) {
        super();
        
        this.name = name;
        this.symTab = symTab;
        this.lineNumbers = [];
    }

    /**
     * Getter.
     * @return the name of the entry.
     */
    public getName() : string {
        return this.name;
    }

    /**
     * Getter.
     * @return the symbol table that contains this entry.
     */
    public getSymTab() : SymTab {
        return this.symTab;
    }

    /**
     * Setter.
     * @param definition the definition to set.
     */
    public setDefinition(definition : Definition) : void {
        this.definition = definition;
    }

    /**
     * Getter.
     * @return the definition.
     */
    public getDefinition() : Definition {
        return this.definition;
    }

    /**
     * Setter.
     * @param typeSpec the type specification to set.
     */
    public setTypeSpec(typeSpec : TypeSpec) : void {
        this.typeSpec = typeSpec;
    }

    /**
     * Getter.
     * @return the type specification.
     */
    public getTypeSpec() : TypeSpec {
        return this.typeSpec;
    }

    /**
     * Append a source line number to the entry.
     * @param lineNumber the line number to append.
     */
    public appendLineNumber(lineNumber : number) : void {
        this.lineNumbers.push(lineNumber);
    }

    /**
     * Getter.
     * @return the list of source line numbers for the entry.
     */
    public getLineNumbers() : number[] {
        return this.lineNumbers;
    }
}
