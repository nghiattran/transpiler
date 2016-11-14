"use strict";
var SymTabEntry_1 = require('../../intermediate/SymTabEntry');
var SymTabKeyImpl_1 = require('../../intermediate/symtabimpl/SymTabKeyImpl');
var BaseObject_1 = require('../BaseObject');
var XMLExporter = (function () {
    function XMLExporter() {
    }
    XMLExporter.prototype.init = function () {
        this.length = 0;
        this.indentation = '';
        this.line = '';
        this.reportContent = '';
        this.indent = '';
        for (var i = 0; i < XMLExporter.INDENT_WIDTH; ++i) {
            this.indent += ' ';
        }
    };
    XMLExporter.prototype.export = function (symTabStack) {
        this.init();
        var programId = symTabStack.getProgramId();
        this.printRoutine(programId);
        return this.reportContent;
    };
    XMLExporter.prototype.appendReport = function (content) {
        return this.reportContent += content + '\n';
    };
    XMLExporter.prototype.printRoutine = function (routineId) {
        var definition = routineId.getDefinition();
        var iCode = routineId.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_ICODE);
        if (iCode.getRoot() !== undefined) {
            this.printNode(iCode.getRoot());
        }
        var routineIds = routineId.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_ROUTINES);
        if (routineIds !== undefined) {
            for (var i = 0; i < routineIds.size(); i++) {
                this.printRoutine(routineIds[i]);
            }
        }
    };
    XMLExporter.prototype.printNode = function (node) {
        this.append(this.indentation);
        this.append('<' + node.toString());
        this.printAttributes(node);
        this.printTypeSpec(node);
        var childNodes = node.getChildren();
        if ((childNodes !== undefined) && (childNodes.size() > 0)) {
            this.append('>');
            this.printLine();
            this.printChildNodes(childNodes);
            this.append(this.indentation);
            this.append('</' + node.toString() + '>');
        }
        else {
            this.append(' ');
            this.append('/>');
        }
        this.printLine();
    };
    XMLExporter.prototype.printAttributes = function (node) {
        var saveIndentation = this.indentation;
        this.indentation += this.indent;
        var keys = node.getKeys();
        for (var i = 0; i < keys.length; ++i) {
            this.printAttribute(BaseObject_1.BaseObject.getObject(keys[i]).toString(), node.getKeyString(keys[i]));
        }
        this.indentation = saveIndentation;
    };
    XMLExporter.prototype.printAttribute = function (keyString, value) {
        var isSymTabEntry = value instanceof SymTabEntry_1.SymTabEntry;
        var valueString = isSymTabEntry ? value.getName()
            : value.toString();
        var text = keyString.toLowerCase() + '=\'' + valueString + '\'';
        this.append(' ');
        this.append(text);
        if (isSymTabEntry) {
            var level = value.getSymTab().getNestingLevel();
            this.printAttribute('LEVEL', level);
        }
    };
    XMLExporter.prototype.printChildNodes = function (childNodes) {
        var saveIndentation = this.indentation;
        this.indentation += this.indent;
        for (var i = 0; i < childNodes.size(); i++) {
            this.printNode(childNodes.get(i));
        }
        this.indentation = saveIndentation;
    };
    XMLExporter.prototype.printTypeSpec = function (node) {
        var typeSpec = node.getTypeSpec();
        if (typeSpec !== undefined) {
            var saveMargin = this.indentation;
            this.indentation += this.indent;
            var typeName = void 0;
            var typeId = typeSpec.getIdentifier();
            if (typeId !== undefined) {
                typeName = typeId.getName();
            }
            else {
                typeName = '$anon_' + typeSpec.getForm().getHash();
            }
            this.printAttribute('TYPE_ID', typeName);
            this.indentation = saveMargin;
        }
    };
    XMLExporter.prototype.append = function (text) {
        var textLength = text.length;
        var lineBreak = false;
        if (this.length + textLength > XMLExporter.LINE_WIDTH) {
            this.printLine();
            this.line += this.indentation;
            this.length = this.indentation.length;
            lineBreak = true;
        }
        if (!(lineBreak && text === ' ')) {
            this.line += text;
            this.length += textLength;
        }
    };
    XMLExporter.prototype.printLine = function () {
        if (this.length > 0) {
            this.appendReport(this.line);
            this.line = '';
            this.length = 0;
        }
    };
    XMLExporter.INDENT_WIDTH = 4;
    XMLExporter.LINE_WIDTH = 80;
    return XMLExporter;
}());
exports.XMLExporter = XMLExporter;
//# sourceMappingURL=XMLExporter.js.map