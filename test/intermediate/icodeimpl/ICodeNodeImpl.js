"use strict";
var ICodeFactory_1 = require('../ICodeFactory');
var ICodeNodeImpl = (function () {
    /**
     * Constructor.
     * @param type the node type whose name will be the name of this node.
     */
    function ICodeNodeImpl(type) {
        this.type = type;
        this.parent = null;
        this.children = [];
    }
    /**
     * Getter.
     * @return the node type.
     */
    ICodeNodeImpl.prototype.getType = function () {
        return this.type;
    };
    /**
     * Return the parent of this node.
     * @return the parent node.
     */
    ICodeNodeImpl.prototype.getParent = function () {
        return this.parent;
    };
    /**
     * Set the type specification of this node.
     * @param typeSpec the type sprcification to set.
     */
    ICodeNodeImpl.prototype.setTypeSpec = function (typeSpec) {
        this.typeSpec = typeSpec;
    };
    /**
     * Return the type specification of this node.
     * @return the type specification.
     */
    ICodeNodeImpl.prototype.getTypeSpec = function () {
        return this.typeSpec;
    };
    /**
     * Add a child node.
     * @param node the child node. Not added if null.
     * @return the child node.
     */
    ICodeNodeImpl.prototype.addChild = function (node) {
        if (node != null) {
            this.children.push(node);
            node.parent = this;
        }
        return node;
    };
    /**
     * Return an array list of this node's children.
     * @return the array list of children.
     */
    ICodeNodeImpl.prototype.getChildren = function () {
        return this.children;
    };
    /**
     * Set a node attribute.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    ICodeNodeImpl.prototype.setAttribute = function (key, value) {
        this.put(key, value);
    };
    /**
     * Get the value of a node attribute.
     * @param key the attribute key.
     * @return the attribute value.
     */
    ICodeNodeImpl.prototype.getAttribute = function (key) {
        return this.colection[key.toString()];
    };
    ICodeNodeImpl.prototype.put = function (key, value) {
        this.colection[key.toString()] = value;
    };
    /**
     * Make a copy of this node.
     * @return the copy.
     */
    ICodeNodeImpl.prototype.copy = function () {
        // TODO: check if it clone correctly
        // Create a copy with the same type and type specification.
        var copy;
        copy = ICodeFactory_1.ICodeFactory.createICodeNode(this.type);
        copy.setTypeSpec(this.typeSpec);
        // Copy attributes
        for (var key in this.colection) {
            copy.put(key, this.colection[key]);
        }
        return copy;
    };
    ICodeNodeImpl.prototype.toString = function () {
        return this.type.toString();
    };
    return ICodeNodeImpl;
}());
exports.ICodeNodeImpl = ICodeNodeImpl;
