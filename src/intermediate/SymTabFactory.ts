import {SymTabStackImpl} from "./symtabimpl/SymTabStackImpl";
import {SymTabEntryImpl} from "./symtabimpl/SymTabEntryImpl";
import {SymTabImpl} from "./symtabimpl/SymTabImpl";

import {SymTabStack} from "./SymTabStack";
import {SymTab} from "./SymTab";
import {SymTabEntry} from "./SymTabEntry";

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
        return <SymTab> new SymTabImpl(nestingLevel);
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
