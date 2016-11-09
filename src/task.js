const fs = require('fs');
const process = require('process');
const path = require('path');

let lookDir = './' + process.argv[2];

fs.readdir(lookDir, (err, files) => {
	if (!err){
		let fileList = [];
		files.forEach(file => {
			file = lookDir + '/' + file;
			if (!fs.statSync(file).isDirectory()){
				file = path.basename(file, '.ts');
				if (file !== 'index') {
					fileList.push(file)
				}
			}
		});
		write(fileList)
	}
})

function write (fileList) {
	let file;
	let importStatements = '';
	let exportStatements = '';
	for (var i = 0; i < fileList.length; i++) {
		file = fileList[i];
		importStatements += `import {${file} as ${file}Class} from './${file}'\n`;
		exportStatements += `\t\tstatic readonly ${file} = ${file}Class\n`;
	}
	let template = `
${importStatements}
export namespace ${process.argv[3]} {
	export class Base {
${exportStatements}
	}
}
`
	console.log(template);
}