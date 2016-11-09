import {SymTabStack} from '../../intermediate/SymTabStack';

export interface Exporter {
	export(symTabStack : SymTabStack) : any;
}