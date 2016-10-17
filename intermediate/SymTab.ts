import {SymTabEntry} from './SymTabEntry';
import {HashMap} from '../util/HashMap';

export interface SymTab extends HashMap {
    /**
     * Getter.
     * @return the scope nesting level of this entry.
     */
    getNestingLevel() : number;

    /**
     * Create and enter a new entry into the symbol table.
     * @param name the name of the entry.
     * @return the new entry.
     */
    enter(name : string) : SymTabEntry;

    /**
     * Look up an existing symbol table entry.
     * @param name the name of the entry.
     * @return the entry, or null if it does not exist.
     */
    lookup(name : string) : SymTabEntry;

    /**
     * @return a list of symbol table entries sorted by name.
     */
    sortedEntries() : SymTabEntry[];

    /**
     * @return the next local variables array slot number.
     */
    nextSlotNumber() : number;

    /**
     * @return the maximum local variables array slot number.
     */
    getMaxSlotNumber() : number;
}
