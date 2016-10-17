import {SymTabStackImpl} from "SymTabStackImpl";
import {SymTabStack} from "SymTabStackImpl";
import {SymTab} from "SymTab";
import {SymTabImpl} from "SymTabImpl";
import {SymTabEntry} from "SymTabEntry";
import {SymTabEntryImpl} from "SymTabEntryImpl";

export class SymTabFactory {
    /**
     * Create and return a symbol table stack implementation.
     * @return the symbol table implementation.
     */
    public static createSymTabStack() : SymTabStack {
        return new SymTabStackImpl();
    }

    /**
     * Create and return a symbol table implementation.
     * @param nestingLevel the nesting level.
     * @return the symbol table implementation.
     */
    public static createSymTab(nestingLevel : number) : SymTab {
        return new SymTabImpl(nestingLevel);
    }

    /**
     * Create and return a symbol table entry implementation.
     * @param name the identifier name.
     * @param symTab the symbol table that contains this entry.
     * @return the symbol table entry implementation.
     */
    public static createSymTabEntry(name : string, symTab : SymTab) : SymTabEntry {
        return new SymTabEntryImpl(name, symTab);
    }
}
