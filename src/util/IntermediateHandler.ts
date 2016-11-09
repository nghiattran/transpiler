import {SymTabStack} from '../intermediate/SymTabStack';

export interface IntermediateHandler {
	print(symTabStack : SymTabStack) : void;
}