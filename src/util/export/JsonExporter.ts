import {SymTabStack} from '../../intermediate/SymTabStack';
import {SymTabEntry} from '../../intermediate/SymTabEntry';
import {Definition} from '../../intermediate/Definition';
import {ICode} from '../../intermediate/ICode';
import {ICodeNode} from '../../intermediate/ICodeNode';

import {SymTabKeyImpl} from '../../intermediate/symtabimpl/SymTabKeyImpl';

import {ICodeNodeImpl} from '../../intermediate/icodeimpl/ICodeNodeImpl';

import {List} from '../List';
import {BaseObject} from '../BaseObject';
import {IntermediateHandler} from '../IntermediateHandler';

import {Exporter} from './Exporter';

export class JsonExporter implements Exporter {
    /**
     * Export the intermediate code as a parse tree.
     * @param symTabStack the symbol table stack.
     */
    export(symTabStack : SymTabStack) : Object {
        let programId : SymTabEntry = symTabStack.getProgramId();
        let definition : Definition = programId.getDefinition();

        let iCode : ICode = <ICode> programId.getAttribute(SymTabKeyImpl.ROUTINE_ICODE);
        return {
            definition : definition.toString(),
            name: programId.getName(),
            program : (<ICodeNodeImpl> iCode.getRoot()).toJson()
        };
    }
}