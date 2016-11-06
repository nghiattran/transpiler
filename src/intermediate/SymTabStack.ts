import {SymTabEntry} from './SymTabEntry';
import {SymTab} from './SymTab';


export interface SymTabStack {
    /**
     * Setter.
     * @param entry the symbol table entry for the main program identifier.
     */
    setProgramId(entry : SymTabEntry) : void;

    /**
     * Getter.
     * @return the symbol table entry for the main program identifier.
     */
    getProgramId() : SymTabEntry;

    /**
     * Getter.
     * @return the current nesting level.
     */
    getCurrentNestingLevel() : number;

    /**
     * Return the local symbol table which is at the top of the stack.
     * @return the local symbol table.
     */
    getLocalSymTab() : SymTab;

    /**
     * Push a symbol table onto the stack.
     * @param symTab the symbol table to push.
     * @return the pushed symbol table.
     */
    push(symTab? : SymTab) : SymTab;

    /**
     * Pop a symbol table off the stack.
     * @return the popped symbol table.
     */
    pop() : SymTab;

    /**
     * Create and enter a new entry into the local symbol table.
     * @param name the name of the entry.
     * @return the new entry.
     */
    enterLocal(name : string) : SymTabEntry;

    /**
     * Look up an existing symbol table entry in the local symbol table.
     * @param name the name of the entry.
     * @return the entry, or undefined if it does not exist.
     */
    lookupLocal(name : string) : SymTabEntry;

    /**
     * Look up an existing symbol table entry throughout the stack.
     * @param name the name of the entry.
     * @return the entry, or undefined if it does not exist.
     */
    lookup(name : string) : SymTabEntry;
}
