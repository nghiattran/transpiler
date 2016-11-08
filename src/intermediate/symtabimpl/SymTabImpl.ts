import {TreeMap} from '../../util/TreeMap';
import {SymTab} from '../SymTab';
import {SymTabEntry} from '../SymTabEntry';
import {SymTabFactory} from '../SymTabFactory';

export class SymTabImpl extends TreeMap<SymTabEntry> implements SymTab {
    private nestingLevel : number;       // scope nesting level of this entry
    private slotNumber : number;         // local letiables array slot number
    private maxSlotNumber : number;      // max slot number value

    /**
     * Constructor.
     * @param nestingLevel the nesting level of this entry.
     */
    public constructor(nestingLevel : number) {
        super();
        this.nestingLevel = nestingLevel;
        this.slotNumber = -1;
        this.maxSlotNumber = 0;
    }

    /**
     * Getter.
     * @return the scope nesting level of this entry.
     */
    public getNestingLevel() : number {
        return this.nestingLevel;
    }

    /**
     * Create and enter a new entry into the symbol table.
     * @param name the name of the entry.
     * @return the new entry.
     */
    public enter(name : string) : SymTabEntry {
        let entry : SymTabEntry = SymTabFactory.createSymTabEntry(name, this);
        super.put(name, entry);

        return entry;
    }

    /**
     * Look up an existing symbol table entry.
     * @param name the name of the entry.
     * @return the entry, or undefined if it does not exist.
     */
    public lookup(name : string) : SymTabEntry {
        return this.get(name) as SymTabEntry;
    }

    /**
     * @return a list of symbol table entries sorted by name.
     */
    public sortedEntries() : SymTabEntry[] {
        return this.toList() as SymTabEntry[];
    }

    /**
     * @return the next local letiables array slot number.
     */
    public nextSlotNumber() : number {
        this.maxSlotNumber = ++this.slotNumber;
        return this.slotNumber;
    }

    /**
     * @return the maximum local letiables array slot number.
     */
    public getMaxSlotNumber() : number {
        return this.maxSlotNumber;
    }
}
