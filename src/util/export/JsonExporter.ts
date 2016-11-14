import {SymTabStack} from '../../intermediate/SymTabStack';
import {SymTabEntry} from '../../intermediate/SymTabEntry';
import {SymTab} from '../../intermediate/SymTab';
import {Definition} from '../../intermediate/Definition';
import {TypeSpec} from '../../intermediate/TypeSpec';
import {TypeForm} from '../../intermediate/TypeForm';
import {ICode} from '../../intermediate/ICode';
import {ICodeNode} from '../../intermediate/ICodeNode';
import {ICodeKey} from '../../intermediate/ICodeKey';

import {DefinitionImpl} from '../../intermediate/symtabimpl/DefinitionImpl';
import {SymTabKeyImpl} from '../../intermediate/symtabimpl/SymTabKeyImpl';
import {TypeKeyImpl} from '../../intermediate/typeimpl/TypeKeyImpl';
import {TypeFormImpl} from '../../intermediate/typeimpl/TypeFormImpl';

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