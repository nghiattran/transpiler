import {ICodeNode} from '../ICodeNode';
import {ICodeNodeType} from '../ICodeNodeType';
import {TypeSpec} from '../TypeSpec';
import {ICodeKey} from '../ICodeKey';
import {ICodeFactory} from '../ICodeFactory';

import {List} from '../../util/List';
import {HashMap} from '../../util/HashMap';

export class ICodeNodeImpl extends HashMap<ICodeKey, Object> implements ICodeNode {
    private type : ICodeNodeType;             // node type
    private parent : ICodeNode;               // parent node
    private children : List<ICodeNode>;           // children array list
    private typeSpec : TypeSpec;              // data type specification

    /**
     * Constructor.
     * @param type the node type whose name will be the name of this node.
     */
    public constructor(type : ICodeNodeType) {
        super();
        this.type = type;
        this.parent = undefined;
        this.children = new List<ICodeNode>();
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
     * @param node the child node. Not added if undefined.
     * @return the child node.
     */
    public addChild(node : ICodeNode) : ICodeNode {
        if (node !== undefined) {
            this.children.add(node);
            (node as ICodeNodeImpl).parent = this;
        }

        return node;
    }

    /**
     * Return an array list of this node's children.
     * @return the array list of children.
     */
    public getChildren() : List<ICodeNode> {
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
        return this.get(key);
    }

    /**
     * Make a copy of this node.
     * @return the copy.
     */
    public copy() : ICodeNode {
        // Create a copy with the same type and type specification.
        var copy : ICodeNodeImpl;
        copy = ICodeFactory.createICodeNode(this.type) as ICodeNodeImpl;
        copy.setTypeSpec(this.typeSpec);


        // Copy attributes
        for (var key in this.getKeys()) {
            copy.putKeyString(key, this.get[key])
        }

        return copy;
    }

    public toString() : string {
        return this.type.toString();
    }
}
