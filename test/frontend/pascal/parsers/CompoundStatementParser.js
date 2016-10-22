"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CompoundStatementParser = (function (_super) {
    __extends(CompoundStatementParser, _super);
    function CompoundStatementParser() {
        _super.apply(this, arguments);
        /**
         * Parse a compound statement.
         * @param token the initial token.
         * @return the root node of the generated parse tree.
         * @throws Exception if an error occurred.
         */
        this.ICodeNode = parse(Token, token);
        this.throws = Exception;
    }
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    CompoundStatementParser.prototype.CompoundStatementParser = function (PascalParserTD) {
        if (PascalParserTD === void 0) { PascalParserTD = parent; }
        _super.call(this, parent);
    };
    return CompoundStatementParser;
}(StatementParser));
exports.CompoundStatementParser = CompoundStatementParser;
{
    token = nextToken(); // consume the BEGIN
    // Create the COMPOUND node.
    ICodeNode;
    compoundNode = ICodeFactory.createICodeNode(COMPOUND);
    // Parse the statement list terminated by the END token.
    StatementParser;
    statementParser = new StatementParser(this);
    statementParser.parseList(token, compoundNode, END, MISSING_END);
    return compoundNode;
}
