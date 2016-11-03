export class ParseTreePrinter {
    private static INDENT_WIDTH : number = 4;
    private static LINE_WIDTH : number = 80;

    private PrintStream ps;      // output print stream
    private length : number;          // output line length
    private indent : string;       // indent spaces
    private indentation : string;  // indentation of a line
    private StringBuilder line;  // output line

    /**
     * Constructor
     * @param ps the output print stream.
     */
    public ParseTreePrinter(PrintStream ps)
    {
        this.ps = ps;
        this.length = 0;
        this.indentation = "";
        this.line = new StringBuilder();

        // The indent is INDENT_WIDTH spaces.
        this.indent = "";
        for (let i = 0; i < ParseTreePrinter.INDENT_WIDTH; ++i) {
            this.indent += " ";
        }
    }

    /**
     * Print the intermediate code as a parse tree.
     * @param symTabStack the symbol table stack.
     */
    public print(symTabStack : SymTabStack) : void{
        this.ps.println("\n===== INTERMEDIATE CODE =====");

        let programId : SymTabEntry = symTabStack.getProgramId();
        this.printRoutine(programId);
    }

    /**
     * Print the parse tree for a routine.
     * @param routineId the routine identifier's symbol table entry.
     */
    private printRoutine(routineId : SymTabEntry) : void {
        let definition : Definition = routineId.getDefinition();
        console.log("\n*** " + definition.toString() +
                           " " + routineId.getName() + " ***\n");

        // Print the intermediate code in the routine's symbol table entry.
        let iCode : ICode = (ICode) routineId.getAttribute(ROUTINE_ICODE);
        if (iCode.getRoot() != null) {
            this.printNode(<ICodeNodeImpl> iCode.getRoot());
        }

        // Print any procedures and functions defined in the routine.
        let routineIds : List<SymTabEntry> =
            <List<SymTabEntry>> routineId.getAttribute(ROUTINE_ROUTINES);
        if (routineIds != null) {
            for (let rtnId in routineIds) {
                this.printRoutine(rtnId);
            }
        }
    }

    /**
     * Print a parse tree node.
     * @param node the parse tree node.
     */
    private printNode(node : ICodeNodeImpl) : void {
        // Opening tag.
        this.append(indentation); 
        this.append("<" + node.toString());

        this.printAttributes(node);
        this.printTypeSpec(node);

        ArrayList<ICodeNode> childNodes = node.getChildren();

        // Print the node's children followed by the closing tag.
        if ((childNodes != null) && (childNodes.size() > 0)) {
            append(">");
            printLine();

            printChildNodes(childNodes);
            append(indentation); append("</" + node.toString() + ">");
        }

        // No children: Close off the tag.
        else {
            append(" "); append("/>");
        }

        printLine();
    }

    /**
     * Print a parse tree node's attributes.
     * @param node the parse tree node.
     */
    private void printAttributes(ICodeNodeImpl node)
    {
        String saveIndentation = indentation;
        indentation += indent;

        Set<Map.Entry<ICodeKey, Object>> attributes = node.entrySet();
        Iterator<Map.Entry<ICodeKey, Object>> it = attributes.iterator();

        // Iterate to print each attribute.
        while (it.hasNext()) {
            Map.Entry<ICodeKey, Object> attribute = it.next();
            printAttribute(attribute.getKey().toString(), attribute.getValue());
        }

        indentation = saveIndentation;
    }

    /**
     * Print a node attribute as key="value".
     * @param keyString the key string.
     * @param value the value.
     */
    private void printAttribute(String keyString, Object value)
    {
        // If the value is a symbol table entry, use the identifier's name.
        // Else just use the value string.
        boolean isSymTabEntry = value instanceof SymTabEntry;
        String valueString = isSymTabEntry ? ((SymTabEntry) value).getName()
                                           : value.toString();

        String text = keyString.toLowerCase() + "=\"" + valueString + "\"";
        append(" "); append(text);

        // Include an identifier's nesting level.
        if (isSymTabEntry) {
            int level = ((SymTabEntry) value).getSymTab().getNestingLevel();
            printAttribute("LEVEL", level);
        }
    }

    /**
     * Print a parse tree node's child nodes.
     * @param childNodes the array list of child nodes.
     */
    private void printChildNodes(ArrayList<ICodeNode> childNodes)
    {
        String saveIndentation = indentation;
        indentation += indent;

        for (ICodeNode child : childNodes) {
            printNode((ICodeNodeImpl) child);
        }

        indentation = saveIndentation;
    }

    /**
     * Print a parse tree node's type specification.
     * @param node the parse tree node.
     */
    private void printTypeSpec(ICodeNodeImpl node)
    {
        TypeSpec typeSpec = node.getTypeSpec();

        if (typeSpec != null) {
            String saveMargin = indentation;
            indentation += indent;

            String typeName;
            SymTabEntry typeId = typeSpec.getIdentifier();

            // Named type: Print the type identifier's name.
            if (typeId != null) {
                typeName = typeId.getName();
            }

            // Unnamed type: Print an artificial type identifier name.
            else {
                int code = typeSpec.hashCode() + typeSpec.getForm().hashCode();
                typeName = "$anon_" + Integer.toHexString(code);
            }

            printAttribute("TYPE_ID", typeName);
            indentation = saveMargin;
        }
    }


    /**
     * Append text to the output line.
     * @param text the text to append.
     */
    private void append(String text)
    {
        int textLength = text.length();
        boolean lineBreak = false;

        // Wrap lines that are too long.
        if (length + textLength > LINE_WIDTH) {
            printLine();
            line.append(indentation);
            length = indentation.length();
            lineBreak = true;
        }

        // Append the text.
        if (!(lineBreak && text.equals(" "))) {
            line.append(text);
            length += textLength;
        }
    }

    /**
     * Print an output line.
     */
    private void printLine()
    {
        if (length > 0) {
            ps.println(line);
            line.setLength(0);
            length = 0;
        }
    }
}
