"use strict";
var DefinitionImpl_1 = require('../intermediate/symtabimpl/DefinitionImpl');
var SymTabKeyImpl_1 = require('../intermediate/symtabimpl/SymTabKeyImpl');
var TypeKeyImpl_1 = require('../intermediate/typeimpl/TypeKeyImpl');
var TypeFormImpl_1 = require('../intermediate/typeimpl/TypeFormImpl');
var CrossReferencer = (function () {
    function CrossReferencer() {
    }
    CrossReferencer.prototype.print = function (symTabStack) {
        console.info('\n===== CROSS-REFERENCE TABLE =====');
        var programId = symTabStack.getProgramId();
        this.printRoutine(programId);
    };
    CrossReferencer.prototype.printRoutine = function (routineId) {
        var definition = routineId.getDefinition();
        console.info('\n*** ' + definition.toString() +
            ' ' + routineId.getName() + ' ***');
        this.printColumnHeadings();
        var symTab = routineId.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_SYMTAB);
        var newRecordTypes = [];
        this.printSymTab(symTab, newRecordTypes);
        if (newRecordTypes.length > 0) {
            this.printRecords(newRecordTypes);
        }
        var routineIds = routineId.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_ROUTINES);
        if (routineIds !== undefined) {
            for (var i = 0; i < routineIds.length; ++i) {
                var rtnId = routineIds[i];
                this.printRoutine(rtnId);
            }
        }
    };
    CrossReferencer.prototype.printColumnHeadings = function () {
        console.info(CrossReferencer.NAME_FORMAT, 'Identifier', CrossReferencer.NUMBERS_LABEL + 'Type specification');
        console.info(CrossReferencer.NAME_FORMAT, '----------', CrossReferencer.NUMBERS_UNDERLINE + '------------------');
    };
    CrossReferencer.prototype.printSymTab = function (symTab, recordTypes) {
        recordTypes = recordTypes || [];
        var sorted = symTab.sortedEntries();
        for (var i = 0; i < sorted.length; i++) {
            var entry = sorted[i];
            var lineNumbers = entry.getLineNumbers();
            var line = entry.getName();
            for (var index = line.length; index < 10; index++) {
                line += ' ';
            }
            if (lineNumbers !== undefined) {
                for (var lineNumber in lineNumbers) {
                    line += lineNumber + ',';
                }
            }
            console.info(line);
            this.printEntry(entry, recordTypes);
        }
    };
    CrossReferencer.prototype.printEntry = function (entry, recordTypes) {
        var definition = entry.getDefinition();
        var nestingLevel = entry.getSymTab().getNestingLevel();
        console.info(CrossReferencer.INDENT + 'Defined as: ' + definition.getText());
        console.info(CrossReferencer.INDENT + 'Scope nesting level: ' + nestingLevel);
        var type = entry.getTypeSpec();
        this.printType(type);
        switch (definition) {
            case DefinitionImpl_1.DefinitionImpl.CONSTANT: {
                var value = entry.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.CONSTANT_VALUE);
                console.info(CrossReferencer.INDENT + 'Value = ' + value);
                if (type.getIdentifier() === undefined) {
                    this.printTypeDetail(type, recordTypes);
                }
                break;
            }
            case DefinitionImpl_1.DefinitionImpl.ENUMERATION_CONSTANT: {
                var value = entry.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.CONSTANT_VALUE);
                console.info(CrossReferencer.INDENT + 'Value = ' + value);
                break;
            }
            case DefinitionImpl_1.DefinitionImpl.TYPE: {
                if (entry === type.getIdentifier()) {
                    this.printTypeDetail(type, recordTypes);
                }
                break;
            }
            case DefinitionImpl_1.DefinitionImpl.VARIABLE: {
                if (type.getIdentifier() === undefined) {
                    this.printTypeDetail(type, recordTypes);
                }
                break;
            }
        }
    };
    CrossReferencer.prototype.printType = function (type) {
        if (type !== undefined) {
            var form = type.getForm();
            var typeId = type.getIdentifier();
            var typeName = typeId !== undefined ? typeId.getName() : '<unnamed>';
            console.info(CrossReferencer.INDENT + 'Type form = ' + form +
                ', Type id = ' + typeName);
        }
    };
    CrossReferencer.prototype.printTypeDetail = function (type, recordTypes) {
        var form = type.getForm();
        switch (form) {
            case TypeFormImpl_1.TypeFormImpl.ENUMERATION: {
                var constantIds = type.getAttribute(TypeKeyImpl_1.TypeKeyImpl.ENUMERATION_CONSTANTS);
                console.info(CrossReferencer.INDENT + '--- Enumeration constants ---');
                for (var _i = 0, constantIds_1 = constantIds; _i < constantIds_1.length; _i++) {
                    var constantId = constantIds_1[_i];
                    var name_1 = constantId.getName();
                    var value = constantId.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.CONSTANT_VALUE);
                    console.info(CrossReferencer.INDENT + CrossReferencer.ENUM_CONST_FORMAT, name_1, value);
                }
                break;
            }
            case TypeFormImpl_1.TypeFormImpl.SUBRANGE: {
                var minValue = type.getAttribute(TypeKeyImpl_1.TypeKeyImpl.SUBRANGE_MIN_VALUE);
                var maxValue = type.getAttribute(TypeKeyImpl_1.TypeKeyImpl.SUBRANGE_MAX_VALUE);
                var baseTypeSpec = type.getAttribute(TypeKeyImpl_1.TypeKeyImpl.SUBRANGE_BASE_TYPE);
                console.info(CrossReferencer.INDENT + '--- Base type ---');
                this.printType(baseTypeSpec);
                if (baseTypeSpec.getIdentifier() === undefined) {
                    this.printTypeDetail(baseTypeSpec, recordTypes);
                }
                console.info(CrossReferencer.INDENT + 'Range = ');
                console.info(this.toString(minValue) + '..' +
                    this.toString(maxValue));
                break;
            }
            case TypeFormImpl_1.TypeFormImpl.ARRAY: {
                var indexType = type.getAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_INDEX_TYPE);
                var elementType = type.getAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_ELEMENT_TYPE);
                var count = type.getAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_ELEMENT_COUNT);
                console.info(CrossReferencer.INDENT + '--- INDEX TYPE ---');
                this.printType(indexType);
                if (indexType.getIdentifier() === undefined) {
                    this.printTypeDetail(indexType, recordTypes);
                }
                console.info(CrossReferencer.INDENT + '--- ELEMENT TYPE ---');
                this.printType(elementType);
                console.info(CrossReferencer.INDENT.toString() + count + ' elements');
                if (elementType.getIdentifier() === undefined) {
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
    CrossReferencer.prototype.printRecords = function (recordTypes) {
        for (var _i = 0, recordTypes_1 = recordTypes; _i < recordTypes_1.length; _i++) {
            var recordType = recordTypes_1[_i];
            var recordId = recordType.getIdentifier();
            var name_2 = recordId !== undefined ? recordId.getName() : '<unnamed>';
            console.info('\n--- RECORD ' + name_2 + ' ---');
            this.printColumnHeadings();
            var symTab = recordType.getAttribute(TypeKeyImpl_1.TypeKeyImpl.RECORD_SYMTAB);
            var newRecordTypes = [];
            this.printSymTab(symTab, newRecordTypes);
            if (newRecordTypes.length > 0) {
                this.printRecords(newRecordTypes);
            }
        }
    };
    CrossReferencer.prototype.toString = function (value) {
        return value instanceof String ? '"' + value + '"'
            : value.toString();
    };
    CrossReferencer.NAME_WIDTH = 16;
    CrossReferencer.NAME_FORMAT = '%s';
    CrossReferencer.NUMBERS_LABEL = ' Line numbers    ';
    CrossReferencer.NUMBERS_UNDERLINE = ' ------------    ';
    CrossReferencer.NUMBER_FORMAT = ' %03d';
    CrossReferencer.LABEL_WIDTH = CrossReferencer.NUMBERS_LABEL.length;
    CrossReferencer.INDENT_WIDTH = CrossReferencer.NAME_WIDTH + CrossReferencer.LABEL_WIDTH;
    CrossReferencer.INDENT = '            ';
    CrossReferencer.ENUM_CONST_FORMAT = '%' + CrossReferencer.NAME_WIDTH + 's = %s';
    return CrossReferencer;
}());
exports.CrossReferencer = CrossReferencer;
//# sourceMappingURL=CrossReferencer.js.map