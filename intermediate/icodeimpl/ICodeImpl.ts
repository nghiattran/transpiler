import {ICodeNode} from './ICodeNode';
import {ICode} from '../ICode';

export class ICodeImpl implements ICode {
    private root : ICodeNode;  // root node

    /**
     * Set and return the root node.
     * @param node the node to set as root.
     * @return the root node.
     */
    public setRoot(node : ICodeNode) : ICodeNode{
        this.root = node;
        return this.root;
    }

    /**
     * Get the root node.
     * @return the root node.
     */
    public getRoot() : ICodeNode{
        return this.root;
    }
}
