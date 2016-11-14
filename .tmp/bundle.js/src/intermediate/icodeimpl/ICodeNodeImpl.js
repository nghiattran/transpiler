"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ICodeFactory_1 = require('../ICodeFactory');
var SymTabEntry_1 = require('../SymTabEntry');
var List_1 = require('../../util/List');
var HashMap_1 = require('../../util/HashMap');
var BaseObject_1 = require('../../util/BaseObject');
var ICodeNodeImpl = (function (_super) {
    __extends(ICodeNodeImpl, _super);
    function ICodeNodeImpl(type) {
        _super.call(this);
        this.type = type;
        this.parent = undefined;
        this.children = new List_1.List();
    }
    ICodeNodeImpl.prototype.getType = function () {
        return this.type;
    };
    ICodeNodeImpl.prototype.getParent = function () {
        return this.parent;
    };
    ICodeNodeImpl.prototype.setTypeSpec = function (typeSpec) {
        this.typeSpec = typeSpec;
    };
    ICodeNodeImpl.prototype.getTypeSpec = function () {
        return this.typeSpec;
    };
    ICodeNodeImpl.prototype.addChild = function (node) {
        if (node !== undefined) {
            this.children.add(node);
            node.parent = this;
        }
        return node;
    };
    ICodeNodeImpl.prototype.getChildren = function () {
        return this.children;
    };
    ICodeNodeImpl.prototype.setAttribute = function (key, value) {
        this.put(key, value);
    };
    ICodeNodeImpl.prototype.getAttribute = function (key) {
        return this.get(key);
    };
    ICodeNodeImpl.prototype.copy = function () {
        var copy;
        copy = ICodeFactory_1.ICodeFactory.createICodeNode(this.type);
        copy.setTypeSpec(this.typeSpec);
        for (var key in this.getKeys()) {
            copy.putKeyString(key, this.get[key]);
        }
        return copy;
    };
    ICodeNodeImpl.prototype.toString = function () {
        return this.type.toString();
    };
    ICodeNodeImpl.prototype.toJson = function () {
        var node = {
            name: this.type.toString(),
            typeSpec: this.typeSpec ? this.typeSpec.toJson() : undefined,
            children: [],
            attributes: {}
        };
        var keys = this.getKeys();
        for (var i = 0; i < keys.length; ++i) {
            var value = this.getKeyString(keys[i]);
            var isSymTabEntry = value instanceof SymTabEntry_1.SymTabEntry;
            var valueString = isSymTabEntry ? value.getName()
                : value.toString();
            var attribute = {};
            node.attributes[BaseObject_1.BaseObject.getObject(keys[i]).toString().toLowerCase()]
                = valueString;
        }
        for (var i = 0; i < this.children.size(); i++) {
            node.children.push(this.children.get(i).toJson());
        }
        return node;
    };
    return ICodeNodeImpl;
}(HashMap_1.HashMap));
exports.ICodeNodeImpl = ICodeNodeImpl;
//# sourceMappingURL=ICodeNodeImpl.js.map