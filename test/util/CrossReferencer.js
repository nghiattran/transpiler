"use strict";
var DefinitionImpl_1 = require('../intermediate/symtabimpl/DefinitionImpl');
var SymTabKeyImpl_1 = require('../intermediate/symtabimpl/SymTabKeyImpl');
var TypeKeyImpl_1 = require('../intermediate/typeimpl/TypeKeyImpl');
var TypeFormImpl_1 = require('../intermediate/typeimpl/TypeFormImpl');
var CrossReferencer = (function () {
    function CrossReferencer() {
    }
    // TODO
    // static {
    //     for (int i = 0; i < INDENT_WIDTH; ++i) INDENT.append(" ");
    // }
    /**
     * Print the cross-reference table.
     * @param symTabStack the symbol table stack.
     */
    CrossReferencer.prototype.print = function (symTabStack) {
        console.log("\n===== CROSS-REFERENCE TABLE =====");
        var programId = symTabStack.getProgramId();
        this.printRoutine(programId);
    };
    /**
     * Print a cross-reference table for a routine.
     * @param routineId the routine identifier's symbol table entry.
     */
    CrossReferencer.prototype.printRoutine = function (routineId) {
        var definition = routineId.getDefinition();
        console.log("\n*** " + definition.toString() +
            " " + routineId.getName() + " ***");
        this.printColumnHeadings();
        // Print the entries in the routine's symbol table.
        var symTab = routineId.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_SYMTAB);
        var newRecordTypes = [];
        this.printSymTab(symTab, newRecordTypes);
        // Print cross-reference tables for any records defined in the routine.
        if (newRecordTypes.length > 0) {
            this.printRecords(newRecordTypes);
        }
        // Print any procedures and functions defined in the routine.
        var routineIds = routineId.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_ROUTINES);
        if (routineIds != null) {
            for (var i = 0; i < routineIds.length; ++i) {
                var rtnId = routineIds[i];
                this.printRoutine(rtnId);
            }
        }
    };
    /**
     * Print column headings.
     */
    CrossReferencer.prototype.printColumnHeadings = function () {
        console.log();
        // TODO check it
        // console.log(String.format(NAME_FORMAT, "Identifier")
        //                    + NUMBERS_LABEL +     "Type specification");
        // console.log(String.format(NAME_FORMAT, "----------")
        //                    + NUMBERS_UNDERLINE + "------------------");
    };
    /**
     * Print the entries in a symbol table.
     * @param symTab the symbol table.
     * @param recordTypes the list to fill with RECORD type specifications.
     */
    CrossReferencer.prototype.printSymTab = function (symTab, recordTypes) {
        // Loop over the sorted list of symbol table entries.
        var sorted = symTab.sortedEntries();
        for (var i = 0; i < length; ++i) {
            var entry = sorted[i];
            var lineNumbers = entry.getLineNumbers();
            // For each entry, print the identifier name
            // followed by the line numbers.
            // TODO format
            // console.log(String.format(NAME_FORMAT, entry.getName()));
            if (lineNumbers != null) {
                for (var lineNumber in lineNumbers) {
                }
            }
            // Print the symbol table entry.
            console.log();
            this.printEntry(entry, recordTypes);
        }
    };
    /**
     * Print a symbol table entry.
     * @param entry the symbol table entry.
     * @param recordTypes the list to fill with RECORD type specifications.
     */
    CrossReferencer.prototype.printEntry = function (entry, recordTypes) {
        var definition = entry.getDefinition();
        var nestingLevel = entry.getSymTab().getNestingLevel();
        console.log(CrossReferencer.INDENT + "Defined as: " + definition.getText());
        console.log(CrossReferencer.INDENT + "Scope nesting level: " + nestingLevel);
        // Print the type specification.
        var type = entry.getTypeSpec();
        this.printType(type);
        switch (definition) {
            case DefinitionImpl_1.DefinitionImpl.CONSTANT: {
                var value = entry.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.CONSTANT_VALUE);
                console.log(CrossReferencer.INDENT + "Value = " + value);
                // Print the type details only if the type is unnamed.
                if (type.getIdentifier() == null) {
                    this.printTypeDetail(type, recordTypes);
                }
                break;
            }
            case DefinitionImpl_1.DefinitionImpl.ENUMERATION_CONSTANT: {
                var value = entry.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.CONSTANT_VALUE);
                console.log(CrossReferencer.INDENT + "Value = " + value);
                break;
            }
            case DefinitionImpl_1.DefinitionImpl.TYPE: {
                // Print the type details only when the type is first defined.
                if (entry == type.getIdentifier()) {
                    this.printTypeDetail(type, recordTypes);
                }
                break;
            }
            case DefinitionImpl_1.DefinitionImpl.VARIABLE: {
                // Print the type details only if the type is unnamed.
                if (type.getIdentifier() == null) {
                    this.printTypeDetail(type, recordTypes);
                }
                break;
            }
        }
    };
    /**
     * Print a type specification.
     * @param type the type specification.
     */
    CrossReferencer.prototype.printType = function (type) {
        if (type != null) {
            var form = type.getForm();
            var typeId = type.getIdentifier();
            var typeName = typeId != null ? typeId.getName() : "<unnamed>";
            console.log(CrossReferencer.INDENT + "Type form = " + form +
                ", Type id = " + typeName);
        }
    };
    /**
     * Print the details of a type specification.
     * @param type the type specification.
     * @param recordTypes the list to fill with RECORD type specifications.
     */
    CrossReferencer.prototype.printTypeDetail = function (type, recordTypes) {
        var form = type.getForm();
        switch (form) {
            case TypeFormImpl_1.TypeFormImpl.ENUMERATION: {
                var constantIds = type.getAttribute(TypeKeyImpl_1.TypeKeyImpl.ENUMERATION_CONSTANTS);
                console.log(CrossReferencer.INDENT + "--- Enumeration constants ---");
                for (var _i = 0, constantIds_1 = constantIds; _i < constantIds_1.length; _i++) {
                    var constantId = constantIds_1[_i];
                    var name_1 = constantId.getName();
                    var value = constantId.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.CONSTANT_VALUE);
                }
                break;
            }
            case TypeFormImpl_1.TypeFormImpl.SUBRANGE: {
                var minValue = type.getAttribute(TypeKeyImpl_1.TypeKeyImpl.SUBRANGE_MIN_VALUE);
                var maxValue = type.getAttribute(TypeKeyImpl_1.TypeKeyImpl.SUBRANGE_MAX_VALUE);
                var baseTypeSpec = type.getAttribute(TypeKeyImpl_1.TypeKeyImpl.SUBRANGE_BASE_TYPE);
                console.log(CrossReferencer.INDENT + "--- Base type ---");
                this.printType(baseTypeSpec);
                // Print the base type details only if the type is unnamed.
                if (baseTypeSpec.getIdentifier() == null) {
                    this.printTypeDetail(baseTypeSpec, recordTypes);
                }
                console.log(CrossReferencer.INDENT + "Range = ");
                console.log(this.toString(minValue) + ".." +
                    this.toString(maxValue));
                break;
            }
            case TypeFormImpl_1.TypeFormImpl.ARRAY: {
                var indexType = type.getAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_INDEX_TYPE);
                var elementType = type.getAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_ELEMENT_TYPE);
                var count = type.getAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_ELEMENT_COUNT);
                console.log(CrossReferencer.INDENT + "--- INDEX TYPE ---");
                this.printType(indexType);
                // Print the index type details only if the type is unnamed.
                if (indexType.getIdentifier() == null) {
                    this.printTypeDetail(indexType, recordTypes);
                }
                console.log(CrossReferencer.INDENT + "--- ELEMENT TYPE ---");
                this.printType(elementType);
                console.log(CrossReferencer.INDENT.toString() + count + " elements");
                // Print the element type details only if the type is unnamed.
                if (elementType.getIdentifier() == null) {
                    this.printTypeDetail(elementType, recordTypes);
                }
                break;
            }
            case TypeFormImpl_1.TypeFormImpl.RECORD: {
                recordTypes.push(type);
                break;
            }
        }
    };
    /**
     * Print cross-reference tables for records defined in the routine.
     * @param recordTypes the list to fill with RECORD type specifications.
     */
    CrossReferencer.prototype.printRecords = function (recordTypes) {
        for (var _i = 0, recordTypes_1 = recordTypes; _i < recordTypes_1.length; _i++) {
            var recordType = recordTypes_1[_i];
            var recordId = recordType.getIdentifier();
            var name_2 = recordId != null ? recordId.getName() : "<unnamed>";
            console.log("\n--- RECORD " + name_2 + " ---");
            this.printColumnHeadings();
            // Print the entries in the record's symbol table.
            var symTab = recordType.getAttribute(TypeKeyImpl_1.TypeKeyImpl.RECORD_SYMTAB);
            var newRecordTypes = [];
            this.printSymTab(symTab, newRecordTypes);
            // Print cross-reference tables for any nested records.
            if (newRecordTypes.length > 0) {
                this.printRecords(newRecordTypes);
            }
        }
    };
    /**
     * Convert a value to a string.
     * @param value the value.
     * @return the string.
     */
    CrossReferencer.prototype.toString = function (value) {
        return value instanceof String ? "'" + value + "'"
            : value.toString();
    };
    CrossReferencer.NAME_WIDTH = 16;
    CrossReferencer.NAME_FORMAT = "%-" + CrossReferencer.NAME_WIDTH + "s";
    CrossReferencer.NUMBERS_LABEL = " Line numbers    ";
    CrossReferencer.NUMBERS_UNDERLINE = " ------------    ";
    CrossReferencer.NUMBER_FORMAT = " %03d";
    CrossReferencer.LABEL_WIDTH = CrossReferencer.NUMBERS_LABEL.length;
    CrossReferencer.INDENT_WIDTH = CrossReferencer.NAME_WIDTH + CrossReferencer.LABEL_WIDTH;
    // TODO check it
    CrossReferencer.INDENT = '            ';
    CrossReferencer.ENUM_CONST_FORMAT = "%" + CrossReferencer.NAME_WIDTH + "s = %s";
    return CrossReferencer;
}());
exports.CrossReferencer = CrossReferencer;
