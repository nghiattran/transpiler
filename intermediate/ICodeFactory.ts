import {ICodeImpl} from './ICodeImpl';
import {ICode} from './ICode';
import {ICodeNodeType} from './ICodeNodeType';
import {ICodeNode} from './ICodeNode';
import {ICodeNodeImpl} from './ICodeNodeImpl';

export class ICodeFactory {
    /**
     * Create and return an intermediate code implementation.
     * @return the intermediate code implementation.
     */
    public static createICode() : ICode {
        return new ICodeImpl();
    }

    /**
     * Create and return a node implementation.
     * @param type the node type.
     * @return the node implementation.
     */
    public static createICodeNode(type : ICodeNodeType) : ICodeNode {
        return new ICodeNodeImpl(type);
    }
}
