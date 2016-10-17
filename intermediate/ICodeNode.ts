import {ICodeNodeType} from './ICodeNodeType';
import {TypeSpec} from './TypeSpec';
import {ICodeKey} from './ICodeKey';

export interface ICodeNode {
    /**
     * Getter.
     * @return the node type.
     */
    getType() : ICodeNodeType;

    /**
     * Return the parent of this node.
     * @return the parent node.
     */
    getParent() : ICodeNode;

    /**
     * Set the type specification of this node.
     * @param typeSpec the type sprcification to set.
     */
    setTypeSpec(typeSpec : TypeSpec) : void;

    /**
     * Return the type specification of this node.
     * @return the type specification.
     */
    getTypeSpec() : TypeSpec;

    /**
     * Add a child node.
     * @param node the child node.
     * @return the child node.
     */
    addChild(node : ICodeNode) : ICodeNode;

    /**
     * Return an array list of this node's children.
     * @return the array list of children.
     */
    getChildren() : ICodeNode[];

    /**
     * Set a node attribute.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    setAttribute(key : ICodeKey, value : Object) : void;

    /**
     * Get the value of a node attribute.
     * @param key the attribute key.
     * @return the attribute value.
     */
    getAttribute(key : ICodeKey) : Object;

    /**
     * Make a copy of this node.
     * @return the copy.
     */
    copy() : ICodeNode;
}
