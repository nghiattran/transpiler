import {SymTabEntry} from '../SymTabEntry';
import {SymTab} from '../SymTab';
import {Definition} from '../Definition';
import {TypeSpec} from '../TypeSpec';

export class SymTabEntryImpl extends SymTabEntry {
   
    /**
     * Constructor.
     * @param name the name of the entry.
     * @param symTab the symbol table that contains this entry.
     */
    public constructor(name : string, symTab : SymTab) {
        super(name, symTab);
    }
}
