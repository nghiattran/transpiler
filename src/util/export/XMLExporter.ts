import {SymTabStack} from '../../intermediate/SymTabStack';
import {SymTabEntry} from '../../intermediate/SymTabEntry';
import {SymTab} from '../../intermediate/SymTab';
import {Definition} from '../../intermediate/Definition';
import {TypeSpec} from '../../intermediate/TypeSpec';
import {TypeForm} from '../../intermediate/TypeForm';
import {ICode} from '../../intermediate/ICode';
import {ICodeNode} from '../../intermediate/ICodeNode';
import {ICodeKey} from '../../intermediate/ICodeKey';

import {DefinitionImpl} from '../../intermediate/symtabimpl/DefinitionImpl';
import {SymTabKeyImpl} from '../../intermediate/symtabimpl/SymTabKeyImpl';
import {TypeKeyImpl} from '../../intermediate/typeimpl/TypeKeyImpl';
import {TypeFormImpl} from '../../intermediate/typeimpl/TypeFormImpl';

import {ICodeNodeImpl} from '../../intermediate/icodeimpl/ICodeNodeImpl';

import {List} from '../List';
import {PolyfillObject} from '../PolyfillObject';
import {IntermediateHandler} from '../IntermediateHandler';

import {Exporter} from './Exporter';

export class XMLExporter implements Exporter {
    private static INDENT_WIDTH : number = 4;
    private static LINE_WIDTH : number = 80;

    private length : number;                     // output line length
    private indent : string;                     // indent spaces
    private indentation : string;                // indentation of a line
    private line : string;                       // output line
    private reportContent : string;              // report in string format
    private callback : (result : string) => any; // callback from requester.


    /**
     * init
     */
    public init() {
        this.length = 0;
        this.indentation = '';
        this.line = '';
        this.reportContent = '';

        // The indent is INDENT_WIDTH spaces.
        this.indent = '';
        for (let i = 0; i < XMLExporter.INDENT_WIDTH; ++i) {
            this.indent += ' ';
        }
    }

    /**
     * Export the intermediate code as a parse tree.
     * @param symTabStack the symbol table stack.
     */
    export(symTabStack : SymTabStack) {
        this.init();

        let programId : SymTabEntry = symTabStack.getProgramId();
        this.printRoutine(programId);

        return this.reportContent;
    }

    appendReport(content : string) : string {
        return this.reportContent += content + '\n';
    }

    /**
     * Print the parse tree for a routine.
     * @param routineId the routine identifier's symbol table entry.
     */
    private printRoutine(routineId : SymTabEntry) : void {
        let definition : Definition = routineId.getDefinition();
        // TODO: solve  it
        // this.appendReport('\n*** ' + definition.toString() +
        //                    ' ' + routineId.getName() + ' ***\n');

        // Print the intermediate code in the routine's symbol table entry.
        let iCode : ICode = <ICode> routineId.getAttribute(SymTabKeyImpl.ROUTINE_ICODE);
        
        if (iCode.getRoot() !== undefined) {
            this.printNode(<ICodeNodeImpl> iCode.getRoot());
        }

        // Print any procedures and functions defined in the routine.
        let routineIds : List<SymTabEntry> =
            <List<SymTabEntry>> routineId.getAttribute(SymTabKeyImpl.ROUTINE_ROUTINES);

        if (routineIds !== undefined) {
            for (let i = 0; i < routineIds.size(); i++) {
                this.printRoutine(routineIds[i]);
            }
        }
    }

    /**
     * Print a parse tree node.
     * @param node the parse tree node.
     */
    private printNode(node : ICodeNodeImpl) : void {
        // Opening tag.
        this.append(this.indentation);
        this.append('<' + node.toString());

        this.printAttributes(node);
        this.printTypeSpec(node);

        let childNodes : List<ICodeNode> = node.getChildren();

        // Print the node's children followed by the closing tag.
        if ((childNodes !== undefined) && (childNodes.size() > 0)) {
            this.append('>');
            this.printLine();

            this.printChildNodes(childNodes);
            this.append(this.indentation); 

            this.append('</' + node.toString() + '>');
        }

        // No children: Close off the tag.
        else {
            this.append(' '); 
            this.append('/>');
        }

        this.printLine();
    }

    /**
     * Print a parse tree node's attributes.
     * @param node the parse tree node.
     */
    private printAttributes(node : ICodeNodeImpl) : void {
        let saveIndentation : string = this.indentation;
        this.indentation += this.indent;

        let keys = node.getKeys();
        for (let i = 0; i < keys.length; ++i) {
            this.printAttribute(
                PolyfillObject.getObject(keys[i]).toString(),
                node.getKeyString(keys[i])
            );
        }

        this.indentation = saveIndentation;
    }

    /**
     * Print a node attribute as key='value'.
     * @param keyString the key string.
     * @param value the value.
     */
    private printAttribute(keyString : string, value : Object)
    {
        // If the value is a symbol table entry, use the identifier's name.
        // Else just use the value string.
        let isSymTabEntry : boolean = value instanceof SymTabEntry;
        let valueString : string = isSymTabEntry ? (<SymTabEntry> value).getName()
                                           : value.toString();

        let text : string = keyString.toLowerCase() + '=\'' + valueString + '\'';
        this.append(' '); 
        this.append(text);

        // Include an identifier's nesting level.
        if (isSymTabEntry) {
            let level : number = (<SymTabEntry> value).getSymTab().getNestingLevel();
            this.printAttribute('LEVEL', level);
        }
    }

    /**
     * Print a parse tree node's child nodes.
     * @param childNodes the array list of child nodes.
     */
    private printChildNodes(childNodes : List<ICodeNode>) : void {
        let saveIndentation : string = this.indentation;
        this.indentation += this.indent;

        for (let i = 0; i < childNodes.size(); i++) {
            this.printNode(<ICodeNodeImpl>childNodes.get(i));
        }

        this.indentation = saveIndentation;
    }

    /**
     * Print a parse tree node's type specification.
     * @param node the parse tree node.
     */
    private printTypeSpec(node : ICodeNodeImpl) : void{
        let typeSpec : TypeSpec = node.getTypeSpec();

        if (typeSpec !== undefined) {
            let saveMargin :string = this.indentation;
            this.indentation += this.indent;

            let typeName : string;
            let typeId : SymTabEntry = typeSpec.getIdentifier();

            // Named type: Print the type identifier's name.
            if (typeId !== undefined) {
                typeName = typeId.getName();
            }

            // Unnamed type: Print an artificial type identifier name.
            else {
                typeName = '$anon_' + typeSpec.getForm().getHash();
            }

            this.printAttribute('TYPE_ID', typeName);
            this.indentation = saveMargin;
        }
    }


    /**
     * Append text to the output line.
     * @param text the text to append.
     */
    private append(text : string) : void {
        let textLength : number = text.length;
        let lineBreak : boolean = false;

        // Wrap lines that are too long.
        if (this.length + textLength > XMLExporter.LINE_WIDTH) {
            this.printLine();
            this.line += this.indentation;
            this.length = this.indentation.length;
            lineBreak = true;
        }

        // Append the text.
        if (!(lineBreak && text === ' ')) {
            this.line += text;
            this.length += textLength;
        }
    }

    /**
     * Print an output line.
     */
    private printLine() : void {
        if (this.length > 0) {
            this.appendReport(this.line);
            this.line = '';
            this.length = 0;
        }
    }
}
