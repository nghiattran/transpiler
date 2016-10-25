import {List} from '../../util/List';
import {PascalTokenType} from './PascalTokenType';

import {Token} from '../Token';

export interface IPascalParserTD {
	parse(...params) : any;
	getErrorCount() : number;
	synchronize(syncSet : List<PascalTokenType>) : Token;
}