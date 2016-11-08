import {SymTabStack} from '../SymTabStack';
import {SymTabEntry} from '../SymTabEntry';
import {SymTabFactory} from '../SymTabFactory';
import {SymTab} from '../SymTab';

import {List} from '../../util/List';

export class SymTabStackImpl extends List<SymTab> implements SymTabStack {
    private currentNestingLevel : number;  // current scope nesting level
    private programId : SymTabEntry;       // entry for the main program id

    /**
     * Constructor.
     */
    public constructor() {
        super();

        this.currentNestingLevel = 0;
        this.add(SymTabFactory.createSymTab(this.currentNestingLevel));
    }

    /**
     * Setter.
     * @param entry the symbol table entry for the main program identifier.
     */
    public setProgramId(id : SymTabEntry) : void {
        this.programId = id;
    }

    /**
     * Getter.
     * @return the symbol table entry for the main program identifier.
     */
    public getProgramId() : SymTabEntry {
        return this.programId;
    }

    /**
     * Getter.
     * @return the current nesting level.
     */
    public getCurrentNestingLevel() : number {
        return this.currentNestingLevel;
    }

    /**
     * Return the local symbol table which is at the top of the stack.
     * @return the local symbol table.
     */
    public getLocalSymTab() : SymTab {
        return this.get(this.currentNestingLevel);
    }

    /**
     * Push a new symbol table onto the symbol table stack.
     * @return the pushed symbol table.
     */
    public push(symTab? : SymTab) : SymTab {
        if (symTab) {
            ++this.currentNestingLevel;
        } else {
            symTab = SymTabFactory.createSymTab(++this.currentNestingLevel);
        }

        this.add(symTab);

        return symTab;
    }

    /**
     * Pop a symbol table off the symbol table stack.
     * @return the popped symbol table.
     */
    public pop() : SymTab {
        let symTab : SymTab = this.get(this.currentNestingLevel);
        this.removeIndex(this.currentNestingLevel--);

        return symTab;
    }

    /**
     * Create and enter a new entry into the local symbol table.
     * @param name the name of the entry.
     * @return the new entry.
     */
    public enterLocal(name : string) : SymTabEntry {
        return this.get(this.currentNestingLevel).enter(name);
    }

    /**
     * Look up an existing symbol table entry in the local symbol table.
     * @param name the name of the entry.
     * @return the entry, or undefined if it does not exist.
     */
    public lookupLocal(name : string) : SymTabEntry{
        return this.get(this.currentNestingLevel).lookup(name);
    }

    /**
     * Look up an existing symbol table entry throughout the stack.
     * @param name the name of the entry.
     * @return the entry, or undefined if it does not exist.
     */
    public lookup(name : string) : SymTabEntry{
        let foundEntry : SymTabEntry = undefined;

        // Search the current and enclosing scopes.
        for (let i = this.currentNestingLevel; (i >= 0) && (foundEntry === undefined); --i) {
            foundEntry = this.get(i).lookup(name);
        }

        return foundEntry;
    }
}
