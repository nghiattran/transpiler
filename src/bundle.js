const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

let files   = [];

files = `./src/frontend/pascal/parsers/StatementParser.ts
./src/frontend/pascal/parsers/BlockParser.ts
./src/frontend/pascal/parsers/CompoundStatementParser.ts
./src/frontend/pascal/parsers/DeclarationsParser.ts
./src/frontend/pascal/parsers/ConstantDefinitionsParser.ts
./src/frontend/pascal/parsers/SimpleTypeParser.ts
./src/frontend/pascal/parsers/TypeSpecificationParser.ts
./src/frontend/pascal/parsers/TypeDefinitionsParser.ts
./src/frontend/pascal/parsers/ArrayTypeParser.ts
./src/frontend/pascal/parsers/DeclaredRoutineParser.ts
./src/frontend/pascal/parsers/EnumerationTypeParser.ts
./src/frontend/pascal/parsers/ProgramParser.ts
./src/frontend/pascal/parsers/RecordTypeParser.ts
./src/frontend/pascal/parsers/SubrangeTypeParser.ts
./src/frontend/pascal/parsers/VariableDeclarationsParser.ts
./src/frontend/pascal/parsers/ExpressionParser.ts
./src/frontend/pascal/parsers/AssignmentStatementParser.ts
./src/frontend/pascal/parsers/ForStatementParser.ts
./src/frontend/pascal/parsers/CallParser.ts
./src/frontend/pascal/parsers/CallDeclaredParser.ts
./src/frontend/pascal/parsers/CallStandardParser.ts
./src/frontend/pascal/parsers/VariableParser.ts`

files = files.split('\n')

let result = '';
for (var i = 0; i < files.length; i++) {
	result += fs.readFileSync(files[i], 'utf8') + '\n';
}

// remove all import statement
result = result.split(/^import.*\n?/m).join('');

let importStatements = `import {PascalParser} from './PascalParser';
import {PascalTokenType} from './PascalTokenType';
import {PascalErrorCode} from './PascalErrorCode';

import {Token} from '../Token';
import {TokenType} from '../TokenType';
import {EofToken} from '../EofToken';

import {ICodeNode} from '../../intermediate/ICodeNode';
import {Definition} from '../../intermediate/Definition';
import {TypeSpec} from '../../intermediate/TypeSpec';
import {SymTabEntry} from '../../intermediate/SymTabEntry';
import {TypeFactory} from '../../intermediate/TypeFactory';
import {ICodeNodeType} from '../../intermediate/ICodeNodeType';
import {RoutineCode} from '../../intermediate/RoutineCode';

import {DefinitionImpl} from '../../intermediate/symtabimpl/DefinitionImpl';
import {Predefined} from '../../intermediate/symtabimpl/Predefined';
import {SymTabKeyImpl} from '../../intermediate/symtabimpl/SymTabKeyImpl';
import {RoutineCodeImpl} from '../../intermediate/symtabimpl/RoutineCodeImpl';

import {ICodeFactory} from '../../intermediate/ICodeFactory';
import {SymTab} from '../../intermediate/SymTab';
import {ICode} from '../../intermediate/ICode';
import {TypeForm} from '../../intermediate/TypeForm';

import {ICodeKeyImpl} from '../../intermediate/icodeimpl/ICodeKeyImpl';
import {ICodeNodeTypeImpl} from '../../intermediate/icodeimpl/ICodeNodeTypeImpl';

import {TypeKeyImpl} from '../../intermediate/typeimpl/TypeKeyImpl';
import {TypeFormImpl} from '../../intermediate/typeimpl/TypeFormImpl';
import {TypeChecker} from '../../intermediate/typeimpl/TypeChecker';

import {HashMap} from '../../util/HashMap';
import {List} from '../../util/List';
import {Util} from '../../util/Util';`

fs.writeFileSync('./src/frontend/pascal/parsersBundle.ts', importStatements + result);

console.info('Finish writing files.');

exec('tsc', (error, stdout, stderr) => {
	console.info('Finish compiling.');

	if (error || stdout || stderr) {
		console.info(`error: ${error} \n\n`);
		console.info(`stdout: ${stdout} \n\n`);
		console.info(`stderr: ${stderr} \n\n`);
	}

	console.info('Run program.');

	exec('node .tmp/Pascal.js', (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		console.info(`${stdout}`);
	});
});