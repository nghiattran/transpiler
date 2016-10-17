import {HashMap} from '../../util/HashMap';
import {SymTab} from '../SymTab';
import {SymTabEntry} from '../SymTabEntry';
import {SymTabFactory} from '../SymTabFactory';

export class SymTabImpl extends HashMap implements SymTab {
    private nestingLevel : number;       // scope nesting level of this entry
    private slotNumber : number;         // local variables array slot number
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
        var entry : SymTabEntry = SymTabFactory.createSymTabEntry(name, this);
        this.put(name, entry);

        return entry;
    }

    /**
     * Look up an existing symbol table entry.
     * @param name the name of the entry.
     * @return the entry, or null if it does not exist.
     */
    public lookup(name : string) : SymTabEntry {
        return this.get(name) as SymTabEntry;
    }

    /**
     * @return a list of symbol table entries sorted by name.
     */
    public sortedEntries() : SymTabEntry[] {
        // TODO: fix this
        // Collection<SymTabEntry> entries = values();
        // Iterator<SymTabEntry> iter = entries.iterator();
        // ArrayList<SymTabEntry> list = new ArrayList<SymTabEntry>(size());

        // // Iterate over the sorted entries and append them to the list.
        // while (iter.hasNext()) {
        //     list.add(iter.next());
        // }

        return [];  // sorted list of entries
    }

    /**
     * @return the next local variables array slot number.
     */
    public nextSlotNumber() : number {
        this.maxSlotNumber = ++this.slotNumber;
        return this.slotNumber;
    }

    /**
     * @return the maximum local variables array slot number.
     */
    public getMaxSlotNumber() : number {
        return this.maxSlotNumber;
    }
}
