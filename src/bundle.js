const fs = require('fs');
const exec = require('child_process').exec;

let files = `./src/language/pascal/parsers/StatementParser.ts
./src/language/pascal/parsers/BlockParser.ts
./src/language/pascal/parsers/CompoundStatementParser.ts
./src/language/pascal/parsers/DeclarationsParser.ts
./src/language/pascal/parsers/ConstantDefinitionsParser.ts
./src/language/pascal/parsers/SimpleTypeParser.ts
./src/language/pascal/parsers/TypeSpecificationParser.ts
./src/language/pascal/parsers/TypeDefinitionsParser.ts
./src/language/pascal/parsers/ArrayTypeParser.ts
./src/language/pascal/parsers/DeclaredRoutineParser.ts
./src/language/pascal/parsers/EnumerationTypeParser.ts
./src/language/pascal/parsers/ProgramParser.ts
./src/language/pascal/parsers/RecordTypeParser.ts
./src/language/pascal/parsers/SubrangeTypeParser.ts
./src/language/pascal/parsers/VariableDeclarationsParser.ts
./src/language/pascal/parsers/ExpressionParser.ts
./src/language/pascal/parsers/AssignmentStatementParser.ts
./src/language/pascal/parsers/ForStatementParser.ts
./src/language/pascal/parsers/WhileStatementParser.ts
./src/language/pascal/parsers/IfStatementParser.ts
./src/language/pascal/parsers/CaseStatementParser.ts
./src/language/pascal/parsers/RepeatStatementParser.ts
./src/language/pascal/parsers/CallParser.ts
./src/language/pascal/parsers/CallDeclaredParser.ts
./src/language/pascal/parsers/CallStandardParser.ts
./src/language/pascal/parsers/VariableParser.ts`

files = files.split('\n')

let result = '';
for (let i = 0; i < files.length; i++) {
	result += fs.readFileSync(files[i], 'utf8') + '\n';
}

// remove all import statement
result = result.split(/^import.*\n?/m).join('');

let importStatements = `import {PascalParser} from './PascalParser';
import {PascalTokenType} from './PascalTokenType';
import {PascalErrorCode} from './PascalErrorCode';

import {Token} from '../../frontend/Token';
import {TokenType} from '../../frontend/TokenType';
import {EofToken} from '../../frontend/EofToken';

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

let bundleFile = './src/language/pascal/parsersBundle.ts';
fs.writeFileSync(bundleFile, importStatements + result);

console.info('Finish writing files.');

exec('tsc', (error, stdout, stderr) => {
	console.info('Finish compiling.');

	if (error || stdout || stderr) {
		console.info(`error: ${error} \n\n`);
		console.info(`stdout: ${stdout} \n\n`);
		console.info(`stderr: ${stderr} \n\n`);
	}

	console.info('Run program.');

	exec('node .tmp/test.js', (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		console.info(`${stdout}`);
	});
});