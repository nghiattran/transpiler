import {ICodeNode} from './ICodeNode';

export interface ICode {
    /**
     * Set and return the root node.
     * @param node the node to set as root.
     * @return the root node.
     */
    setRoot(node : ICodeNode) : ICodeNode;

    /**
     * Get the root node.
     * @return the root node.
     */
    getRoot() : ICodeNode;
}
