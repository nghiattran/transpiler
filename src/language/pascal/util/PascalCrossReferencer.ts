import {CrossReferencer} from '../../../util/CrossReferencer'

import {SymTabStack} from '../../../intermediate/SymTabStack';
import {SymTabEntry} from '../../../intermediate/SymTabEntry';
import {SymTab} from '../../../intermediate/SymTab';
import {Definition} from '../../../intermediate/Definition';
import {TypeSpec} from '../../../intermediate/TypeSpec';
import {TypeForm} from '../../../intermediate/TypeForm';

import {DefinitionImpl} from '../intermediate/DefinitionImpl';
import {SymTabKeyImpl} from '../../../intermediate/symtabimpl/SymTabKeyImpl';
import {TypeKeyImpl} from '../intermediate/typeimpl/TypeKeyImpl';
import {TypeFormImpl} from '../intermediate/typeimpl/TypeFormImpl';

export abstract class PascalCrossReferencer implements CrossReferencer {
    /**
     * Print a symbol table entry.
     * @param entry the symbol table entry.
     * @param recordTypes the list to fill with RECORD type specifications.
     */
    private printEntry(entry : SymTabEntry, recordTypes : TypeSpec[]) : void {
        let definition : Definition = entry.getDefinition();
        let nestingLevel : number = entry.getSymTab().getNestingLevel();
        console.info(PascalCrossReferencer.INDENT + 'Defined as: ' + definition.getText());
        console.info(PascalCrossReferencer.INDENT + 'Scope nesting level: ' + nestingLevel);

        // Print the type specification.
        let type : TypeSpec = entry.getTypeSpec();
        this.printType(type);
        
        switch (<DefinitionImpl> definition) {
            case DefinitionImpl.CONSTANT: {
                let value : Object = entry.getAttribute(SymTabKeyImpl.CONSTANT_VALUE);
                console.info(PascalCrossReferencer.INDENT + 'Value = ' + value);

                // Print the type details only if the type is unnamed.
                if (type.getIdentifier() === undefined) {
                    this.printTypeDetail(type, recordTypes);
                }

                break;
            }

            case DefinitionImpl.ENUMERATION_CONSTANT: {
                let value : Object = entry.getAttribute(SymTabKeyImpl.CONSTANT_VALUE);
                console.info(PascalCrossReferencer.INDENT + 'Value = ' + value);

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
     * Print the details of a type specification.
     * @param type the type specification.
     * @param recordTypes the list to fill with RECORD type specifications.
     */
    private printTypeDetail(type : TypeSpec, recordTypes : TypeSpec[]) : void {
        let form : TypeForm = type.getForm();


        switch (form as TypeFormImpl) {
            case TypeFormImpl.ENUMERATION: {
                let constantIds : SymTabEntry[] =
                    type.getAttribute(TypeKeyImpl.ENUMERATION_CONSTANTS) as SymTabEntry[];

                console.info(PascalCrossReferencer.INDENT + '--- Enumeration constants ---');

                for (let constantId of constantIds) {
                    let name : string = constantId.getName();
                    let value : Object = constantId.getAttribute(SymTabKeyImpl.CONSTANT_VALUE);

                    console.info(PascalCrossReferencer.INDENT + PascalCrossReferencer.ENUM_CONST_FORMAT,
                                                              name, value);
                }

                break;
            }

            case TypeFormImpl.SUBRANGE: {
                let minValue : Object = type.getAttribute(TypeKeyImpl.SUBRANGE_MIN_VALUE);
                let maxValue : Object = type.getAttribute(TypeKeyImpl.SUBRANGE_MAX_VALUE);
                let baseTypeSpec : TypeSpec =
                    type.getAttribute(TypeKeyImpl.SUBRANGE_BASE_TYPE) as TypeSpec;

                console.info(PascalCrossReferencer.INDENT + '--- Base type ---');
                this.printType(baseTypeSpec);

                // Print the base type details only if the type is unnamed.
                if (baseTypeSpec.getIdentifier() === undefined) {
                    this.printTypeDetail(baseTypeSpec, recordTypes);
                }

                console.info(PascalCrossReferencer.INDENT + 'Range = ');
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

                console.info(PascalCrossReferencer.INDENT + '--- INDEX TYPE ---');
                this.printType(indexType);

                // Print the index type details only if the type is unnamed.
                if (indexType.getIdentifier() === undefined) {
                    this.printTypeDetail(indexType, recordTypes);
                }

                console.info(PascalCrossReferencer.INDENT + '--- ELEMENT TYPE ---');
                this.printType(elementType);
                console.info(PascalCrossReferencer.INDENT.toString() + count + ' elements');

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
}