import {ICodeNode} from '../ICodeNode';
import {ICodeNodeType} from '../ICodeNodeType';
import {TypeSpec} from '../TypeSpec';
import {ICodeKey} from '../ICodeKey';
import {ICodeFactory} from '../ICodeFactory';

export class ICodeNodeImpl implements ICodeNode {
    public colection : Object;
    private type : ICodeNodeType;             // node type
    private parent : ICodeNode;               // parent node
    private children : ICodeNode[];           // children array list
    private typeSpec : TypeSpec;              // data type specification

    /**
     * Constructor.
     * @param type the node type whose name will be the name of this node.
     */
    public constructor(type : ICodeNodeType) {
        this.type = type;
        this.parent = null;
        this.children = [];
    }

    /**
     * Getter.
     * @return the node type.
     */
    public getType() : ICodeNodeType {
        return this.type;
    }

    /**
     * Return the parent of this node.
     * @return the parent node.
     */
    public getParent() : ICodeNode {
        return this.parent;
    }

    /**
     * Set the type specification of this node.
     * @param typeSpec the type sprcification to set.
     */
    public setTypeSpec(typeSpec : TypeSpec) : void {
        this.typeSpec = typeSpec;
    }

    /**
     * Return the type specification of this node.
     * @return the type specification.
     */
    public getTypeSpec() : TypeSpec{
        return this.typeSpec;
    }

    /**
     * Add a child node.
     * @param node the child node. Not added if null.
     * @return the child node.
     */
    public addChild(node : ICodeNode) : ICodeNode {
        if (node != null) {
            this.children.push(node);
            (node as ICodeNodeImpl).parent = this;
        }

        return node;
    }

    /**
     * Return an array list of this node's children.
     * @return the array list of children.
     */
    public getChildren() : ICodeNode[] {
        return this.children;
    }

    /**
     * Set a node attribute.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    public setAttribute(key : ICodeKey, value : Object) : void {
        this.put(key, value);
    }

    /**
     * Get the value of a node attribute.
     * @param key the attribute key.
     * @return the attribute value.
     */
    public getAttribute(key : ICodeKey) : Object{
        return this.colection[key.toString()];
    }

    public put(key : ICodeKey, value : Object) : void {
        this.colection[key.toString()] = value;
    }

    /**
     * Make a copy of this node.
     * @return the copy.
     */
    public copy() : ICodeNode{
        // TODO: check if it clone correctly

        // Create a copy with the same type and type specification.
        var copy : ICodeNodeImpl;
        copy = ICodeFactory.createICodeNode(this.type) as ICodeNodeImpl;
        copy.setTypeSpec(this.typeSpec);

        // Copy attributes
        for (var key in this.colection) {
            copy.put(key, this.colection[key])
        }

        return copy;
    }

    public toString() : string {
        return this.type.toString();
    }
}