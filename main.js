let editor = (this.createCodeMirror('code-editor'));
let modules = {};
let Pascal;
let Transpiler;
let JsonExporter;
let ready = false;

Promise.all(['src/language/Pascal','src/util/export/JsonExporter', 'src/Transpiler']
    .map(function (url) {
      return SystemJS.import(url);
    })
  )
  .then(function (modules) {
    Pascal = modules[0].Pascal;
    JsonExporter = modules[1].JsonExporter;
    Transpiler = modules[2].Transpiler;
    ready = true;
  });

function createCodeMirror(id, options) {
  options = options || {};

  let defaultOptions = {
    lineNumbers: true,
    matchBrackets: true,
    lineWrapping: true,
    scrollbarStyle: 'native',
    lineWrapping: true,
    theme: 'icecoder',
    extraKeys: {'Enter': 'newlineAndIndentContinueMarkdownList'},
    mode: 'text/x-pascal',
  }

  for (let key in options) {
    defaultOptions[key] = options[key];
  }

  return CodeMirror.fromTextArea(document.getElementById(id), defaultOptions, { showToolbar: true })
}

function compile() {
  if (ready) {
    let exporter = new JsonExporter();
    let compiler = new Transpiler(new Pascal());
    compiler.parse(editor.getValue());
    let parseTree = compiler.export(exporter);

    start(parseTree.program);
  }
}

editor.setValue(`
PROGRAM newton (input, output);

CONST
    EPSILON = 1e-6;

VAR
    number       : integer;
    root, sqRoot : real;

BEGIN
    REPEAT
        writeln;
        write('Enter new number (0 to quit): ');
        read(number);

        IF number = 0 THEN BEGIN
            writeln(number:12, 0.0:12:6);
        END
        ELSE IF number < 0 THEN BEGIN
            writeln('*** ERROR:  number < 0');
        END
        ELSE BEGIN
            sqRoot := sqrt(number);
            writeln(number:12, sqRoot:12:6);
            writeln;

            root := 1;
            REPEAT
                root := (number/root + root)/2;
                writeln(root:24:6,
                        100*abs(root - sqRoot)/sqRoot:12:2,
                        '%')
            UNTIL abs(number/sqr(root) - 1) < EPSILON;
        END
    UNTIL number = 0
END.
`)