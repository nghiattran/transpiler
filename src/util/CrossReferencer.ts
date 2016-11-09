import {SymTabStack} from '../intermediate/SymTabStack';
import {SymTabEntry} from '../intermediate/SymTabEntry';
import {SymTab} from '../intermediate/SymTab';
import {Definition} from '../intermediate/Definition';
import {TypeSpec} from '../intermediate/TypeSpec';
import {TypeForm} from '../intermediate/TypeForm';

import {DefinitionImpl} from '../intermediate/symtabimpl/DefinitionImpl';
import {SymTabKeyImpl} from '../intermediate/symtabimpl/SymTabKeyImpl';
import {TypeKeyImpl} from '../intermediate/typeimpl/TypeKeyImpl';
import {TypeFormImpl} from '../intermediate/typeimpl/TypeFormImpl';

import {IntermediateHandler} from './IntermediateHandler';

export class CrossReferencer implements IntermediateHandler {
    private static NAME_WIDTH : number = 16;
    private static NAME_FORMAT : string       = '%s';
    private static NUMBERS_LABEL : string     = ' Line numbers    ';
    private static NUMBERS_UNDERLINE : string = ' ------------    ';
    private static NUMBER_FORMAT : string     = ' %03d';

    private static LABEL_WIDTH : number = CrossReferencer.NUMBERS_LABEL.length;
    private static INDENT_WIDTH : number = CrossReferencer.NAME_WIDTH + CrossReferencer.LABEL_WIDTH;

    private static INDENT : string = '            '

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
    private printRoutine(routineId : SymTabEntry) : void {
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
    private printColumnHeadings() : void {
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
    private printSymTab(symTab : SymTab, recordTypes? : TypeSpec[]) : void {
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
    private printEntry(entry : SymTabEntry, recordTypes : TypeSpec[]) : void {
        let definition : Definition = entry.getDefinition();
        let nestingLevel : number = entry.getSymTab().getNestingLevel();
        console.info(CrossReferencer.INDENT + 'Defined as: ' + definition.getText());
        console.info(CrossReferencer.INDENT + 'Scope nesting level: ' + nestingLevel);

        // Print the type specification.
        let type : TypeSpec = entry.getTypeSpec();
        this.printType(type);
        
        switch (<DefinitionImpl> definition) {
            case DefinitionImpl.CONSTANT: {
                let value : Object = entry.getAttribute(SymTabKeyImpl.CONSTANT_VALUE);
                console.info(CrossReferencer.INDENT + 'Value = ' + value);

                // Print the type details only if the type is unnamed.
                if (type.getIdentifier() === undefined) {
                    this.printTypeDetail(type, recordTypes);
                }

                break;
            }

            case DefinitionImpl.ENUMERATION_CONSTANT: {
                let value : Object = entry.getAttribute(SymTabKeyImpl.CONSTANT_VALUE);
                console.info(CrossReferencer.INDENT + 'Value = ' + value);

                break;
            }

            case DefinitionImpl.TYPE: {

                // Print the type details only when the type is first defined.
                if (entry === type.getIdentifier()) {
                    this.printTypeDetail(type, recordTypes);
                }

                break;
            }

            case DefinitionImpl.VARIABLE: {

                // Print the type details only if the type is unnamed.
                if (type.getIdentifier() === undefined) {
                    this.printTypeDetail(type, recordTypes);
                }

                break;
            }
        }
    }

    /**
     * Print a type specification.
     * @param type the type specification.
     */
    private printType(type : TypeSpec) : void {
        if (type !== undefined) {
            let form : TypeForm = type.getForm();
            let typeId : SymTabEntry = type.getIdentifier();
            let typeName : string = typeId !== undefined ? typeId.getName() : '<unnamed>';

            console.info(CrossReferencer.INDENT + 'Type form = ' + form +
                               ', Type id = ' + typeName);
        }
    }

    private static ENUM_CONST_FORMAT : string = '%' + CrossReferencer.NAME_WIDTH + 's = %s';

    /**
     * Print the details of a type specification.
     * @param type the type specification.
     * @param recordTypes the list to fill with RECORD type specifications.
     */
    private printTypeDetail(type : TypeSpec, recordTypes : TypeSpec[]) : void{
        let form : TypeForm = type.getForm();


        switch (form as TypeFormImpl) {
            case TypeFormImpl.ENUMERATION: {
                let constantIds : SymTabEntry[] =
                    type.getAttribute(TypeKeyImpl.ENUMERATION_CONSTANTS) as SymTabEntry[];

                console.info(CrossReferencer.INDENT + '--- Enumeration constants ---');

                for (let constantId of constantIds) {
                    let name : string = constantId.getName();
                    let value : Object = constantId.getAttribute(SymTabKeyImpl.CONSTANT_VALUE);

                    console.info(CrossReferencer.INDENT + CrossReferencer.ENUM_CONST_FORMAT,
                                                              name, value);
                }

                break;
            }

            case TypeFormImpl.SUBRANGE: {
                let minValue : Object = type.getAttribute(TypeKeyImpl.SUBRANGE_MIN_VALUE);
                let maxValue : Object = type.getAttribute(TypeKeyImpl.SUBRANGE_MAX_VALUE);
                let baseTypeSpec : TypeSpec =
                    type.getAttribute(TypeKeyImpl.SUBRANGE_BASE_TYPE) as TypeSpec;

                console.info(CrossReferencer.INDENT + '--- Base type ---');
                this.printType(baseTypeSpec);

                // Print the base type details only if the type is unnamed.
                if (baseTypeSpec.getIdentifier() === undefined) {
                    this.printTypeDetail(baseTypeSpec, recordTypes);
                }

                console.info(CrossReferencer.INDENT + 'Range = ');
                console.info(this.toString(minValue) + '..' +
                                   this.toString(maxValue));

                break;
            }

            case TypeFormImpl.ARRAY: {
                let indexType : TypeSpec =
                    type.getAttribute(TypeKeyImpl.ARRAY_INDEX_TYPE) as TypeSpec;
                let elementType : TypeSpec =
                    type.getAttribute(TypeKeyImpl.ARRAY_ELEMENT_TYPE) as TypeSpec;
                let count :number = type.getAttribute(TypeKeyImpl.ARRAY_ELEMENT_COUNT) as number;

                console.info(CrossReferencer.INDENT + '--- INDEX TYPE ---');
                this.printType(indexType);

                // Print the index type details only if the type is unnamed.
                if (indexType.getIdentifier() === undefined) {
                    this.printTypeDetail(indexType, recordTypes);
                }

                console.info(CrossReferencer.INDENT + '--- ELEMENT TYPE ---');
                this.printType(elementType);
                console.info(CrossReferencer.INDENT.toString() + count + ' elements');

                // Print the element type details only if the type is unnamed.
                if (elementType.getIdentifier() === undefined) {
                    this.printTypeDetail(elementType, recordTypes);
                }

                break;
            }

            case TypeFormImpl.RECORD: {
                recordTypes.push(type);
                break;
            }
        }
    }

    /**
     * Print cross-reference tables for records defined in the routine.
     * @param recordTypes the list to fill with RECORD type specifications.
     */
    private printRecords(recordTypes : TypeSpec[]) : void {
        for (let recordType of recordTypes) {
            let recordId : SymTabEntry = recordType.getIdentifier();
            let name : string = recordId !== undefined ? recordId.getName() : '<unnamed>';

            console.info('\n--- RECORD ' + name + ' ---');
            this.printColumnHeadings();

            // Print the entries in the record's symbol table.
            let symTab : SymTab = recordType.getAttribute(TypeKeyImpl.RECORD_SYMTAB) as SymTab;
            let newRecordTypes : TypeSpec[] = [];
            this.printSymTab(symTab, newRecordTypes);

            // Print cross-reference tables for any nested records.
            if (newRecordTypes.length > 0) {
                this.printRecords(newRecordTypes);
            }
        }
    }

    /**
     * Convert a value to a string.
     * @param value the value.
     * @return the string.
     */
    private toString(value : Object) : string {
        return value instanceof String ? '"' + value as string + '"'
                                       : value.toString();
    }
}
