import {SymTabStack} from '../intermediate/SymTabStack';
import {SymTabEntry} from '../intermediate/SymTabEntry';
import {SymTab} from '../intermediate/SymTab';
import {Definition} from '../intermediate/Definition';
import {TypeSpec} from '../intermediate/TypeSpec';
import {TypeForm} from '../intermediate/TypeForm';

import {SymTabKeyImpl} from '../intermediate/symtabimpl/SymTabKeyImpl';

import {IntermediateHandler} from './IntermediateHandler';

export abstract class CrossReferencer {
    protected static NAME_WIDTH : number = 16;
    protected static NAME_FORMAT : string       = '%s';
    protected static NUMBERS_LABEL : string     = ' Line numbers    ';
    protected static NUMBERS_UNDERLINE : string = ' ------------    ';
    protected static NUMBER_FORMAT : string     = ' %03d';

    protected static LABEL_WIDTH : number = CrossReferencer.NUMBERS_LABEL.length;
    protected static INDENT_WIDTH : number = CrossReferencer.NAME_WIDTH + CrossReferencer.LABEL_WIDTH;

    protected static INDENT : string = '            '

    /**
     * Print the cross-reference table.
     * @param symTabStack the symbol table stack.
     */
    public print(symTabStack : SymTabStack) : void {
        console.info('\n===== CROSS-REFERENCE TABLE =====');

        let programId : SymTabEntry = symTabStack.getProgramId();
        
        this.printRoutine(programId);
    }

    /**
     * Print a cross-reference table for a routine.
     * @param routineId the routine identifier's symbol table entry.
     */
    protected printRoutine(routineId : SymTabEntry) : void {
        let definition : Definition = routineId.getDefinition();

        console.info('\n*** ' + definition.toString() +
                           ' ' + routineId.getName() + ' ***');
        this.printColumnHeadings();

        // Print the entries in the routine's symbol table.
        let symTab : SymTab = routineId.getAttribute(SymTabKeyImpl.ROUTINE_SYMTAB) as SymTab;
        let newRecordTypes : TypeSpec[] = [];
        
        this.printSymTab(symTab, newRecordTypes);

        // Print cross-reference tables for any records defined in the routine.
        if (newRecordTypes.length > 0) {
            this.printRecords(newRecordTypes);
        }

        // Print any procedures and functions defined in the routine.
        let routineIds : SymTabEntry[] =
            routineId.getAttribute(SymTabKeyImpl.ROUTINE_ROUTINES) as SymTabEntry[];
        if (routineIds !== undefined) {
            for (let i = 0; i < routineIds.length; ++i) {
                let rtnId : SymTabEntry = routineIds[i] as SymTabEntry;
                this.printRoutine(rtnId);
            }
        }
    }

    /**
     * Print column headings.
     */
    protected printColumnHeadings() : void {
        console.info(CrossReferencer.NAME_FORMAT, 'Identifier',
                    CrossReferencer.NUMBERS_LABEL +     'Type specification');
        console.info(CrossReferencer.NAME_FORMAT, '----------',
                    CrossReferencer.NUMBERS_UNDERLINE + '------------------');
    }
    
    /**
     * Print the entries in a symbol table.
     * @param symTab the symbol table.
     * @param recordTypes the list to fill with RECORD type specifications.
     */
    protected printSymTab(symTab : SymTab, recordTypes? : TypeSpec[]) : void {
        recordTypes = recordTypes || [];

        // Loop over the sorted list of symbol table entries.
        let sorted : SymTabEntry[] = symTab.sortedEntries();
        for (let i = 0; i < sorted.length; i++) {
            let entry : SymTabEntry = sorted[i];
            let lineNumbers : number[] = entry.getLineNumbers();

            // For each entry, print the identifier name
            // followed by the line numbers.
            let line = entry.getName();
            for (let index = line.length; index < 10; index++) {
                line += ' ';
            }

            if (lineNumbers !== undefined) {
                for (let lineNumber in lineNumbers) {
                    line += lineNumber + ',';
                }
            }

            // Print the symbol table entry.
            console.info(line);
            this.printEntry(entry, recordTypes);
        }
    }

    /**
     * Print a symbol table entry.
     * @param entry the symbol table entry.
     * @param recordTypes the list to fill with RECORD type specifications.
     */
    abstract printEntry(entry : SymTabEntry, recordTypes : TypeSpec[]) : void;

    /**
     * Print a type specification.
     * @param type the type specification.
     */
    protected printType(type : TypeSpec) : void {
        if (type !== undefined) {
            let form : TypeForm = type.getForm();
            let typeId : SymTabEntry = type.getIdentifier();
            let typeName : string = typeId !== undefined ? typeId.getName() : '<unnamed>';

            console.info(CrossReferencer.INDENT + 'Type form = ' + form +
                               ', Type id = ' + typeName);
        }
    }

    protected static ENUM_CONST_FORMAT : string = '%' + CrossReferencer.NAME_WIDTH + 's = %s';

    /**
     * Print the details of a type specification.
     * @param type the type specification.
     * @param recordTypes the list to fill with RECORD type specifications.
     */
    abstract printTypeDetail(type : TypeSpec, recordTypes : TypeSpec[]) : void;


    /**
     * Print cross-reference tables for records defined in the routine.
     * @param recordTypes the list to fill with RECORD type specifications.
     */
    abstract printRecords(recordTypes : TypeSpec[]) : void;

    /**
     * Convert a value to a string.
     * @param value the value.
     * @return the string.
     */
    protected toString(value : Object) : string {
        return value instanceof String ? '"' + value as string + '"'
                                       : value.toString();
    }
}
