var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
System.register("src/message/MessageType", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var MessageType;
    return {
        setters:[],
        execute: function() {
            MessageType = (function () {
                function MessageType() {
                }
                MessageType.SOURCE_LINE = 1;
                MessageType.SYNTAX_ERROR = 2;
                MessageType.PARSER_SUMMARY = 3;
                MessageType.INTERPRETER_SUMMARY = 4;
                MessageType.COMPILER_SUMMARY = 5;
                MessageType.MISCELLANEOUS = 6;
                MessageType.TOKEN = 7;
                MessageType.ASSIGN = 8;
                MessageType.FETCH = 9;
                MessageType.BREAKPOINT = 10;
                MessageType.RUNTIME_ERROR = 11;
                MessageType.CALL = 12;
                MessageType.RETURN = 13;
                return MessageType;
            }());
            exports_1("MessageType", MessageType);
        }
    }
});
System.register("src/message/Message", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Message;
    return {
        setters:[],
        execute: function() {
            Message = (function () {
                function Message(type, body) {
                    this.type = type;
                    this.body = body;
                }
                Message.prototype.getType = function () {
                    return this.type;
                };
                Message.prototype.getBody = function () {
                    return this.body;
                };
                return Message;
            }());
            exports_2("Message", Message);
        }
    }
});
System.register("src/message/MessageListener", [], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("src/message/MessageProducer", [], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("src/message/MessageHandler", [], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var MessageHandler;
    return {
        setters:[],
        execute: function() {
            MessageHandler = (function () {
                function MessageHandler() {
                    this.listeners = [];
                }
                MessageHandler.prototype.addListener = function (listener) {
                    this.listeners.push(listener);
                };
                MessageHandler.prototype.removeListener = function (listener) {
                    var index = this.listeners.indexOf(listener, 0);
                    if (index > -1) {
                        this.listeners.splice(index, 1);
                    }
                };
                MessageHandler.prototype.sendMessage = function (message) {
                    this.message = message;
                    this.notifyListeners();
                };
                MessageHandler.prototype.notifyListeners = function () {
                    for (var i = 0; i < this.listeners.length; i++) {
                        this.listeners[i].messageReceived(this.message);
                    }
                };
                return MessageHandler;
            }());
            exports_5("MessageHandler", MessageHandler);
        }
    }
});
System.register("src/util/TreeMap", [], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var TreeMap;
    return {
        setters:[],
        execute: function() {
            TreeMap = (function () {
                function TreeMap() {
                    this.collection = {};
                }
                TreeMap.prototype.containsKey = function (key) {
                    return this.collection[key] !== undefined;
                };
                TreeMap.prototype.setAttribute = function (key, value) {
                    this.put(key, value);
                };
                TreeMap.prototype.getAttribute = function (key) {
                    return this.get(key);
                };
                TreeMap.prototype.put = function (key, value) {
                    this.collection[key] = value;
                };
                TreeMap.prototype.get = function (key) {
                    return this.collection[key];
                };
                TreeMap.prototype.toList = function () {
                    var list = [];
                    for (var entry in this.collection) {
                        list.push(this.collection[entry]);
                    }
                    return list;
                };
                return TreeMap;
            }());
            exports_6("TreeMap", TreeMap);
        }
    }
});
System.register("src/intermediate/SymTab", [], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("src/intermediate/Definition", [], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("src/util/PolyfillObject", ["src/util/TreeMap"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var TreeMap_1;
    var PolyfillObject;
    return {
        setters:[
            function (TreeMap_1_1) {
                TreeMap_1 = TreeMap_1_1;
            }],
        execute: function() {
            if (!Date.now) {
                Date.now = function () { return new Date().getTime(); };
            }
            PolyfillObject = (function () {
                function PolyfillObject() {
                    this.hashCode = Date.now().toString() + PolyfillObject.counter++;
                    PolyfillObject.objectPool.setAttribute(this.hashCode, this);
                }
                PolyfillObject.prototype.getHash = function () {
                    return this.hashCode;
                };
                PolyfillObject.getObject = function (key) {
                    return PolyfillObject.objectPool.getAttribute(key);
                };
                PolyfillObject.objectPool = new TreeMap_1.TreeMap();
                PolyfillObject.counter = 0;
                return PolyfillObject;
            }());
            exports_9("PolyfillObject", PolyfillObject);
        }
    }
});
System.register("src/intermediate/TypeKey", [], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("src/intermediate/TypeForm", [], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("src/intermediate/TypeSpec", [], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("src/intermediate/SymTabKey", [], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("src/util/HashMap", ["src/util/PolyfillObject"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var PolyfillObject_1;
    var HashMap, HashSet;
    return {
        setters:[
            function (PolyfillObject_1_1) {
                PolyfillObject_1 = PolyfillObject_1_1;
            }],
        execute: function() {
            HashMap = (function () {
                function HashMap() {
                    this.collection = {};
                }
                HashMap.prototype.getKey = function (key) {
                    if (key instanceof PolyfillObject_1.PolyfillObject) {
                        return key.getHash();
                    }
                    throw 'Key must be a instance of PolyfillObject or a String.';
                };
                HashMap.prototype.setAttribute = function (key, value) {
                    this.put(key, value);
                };
                HashMap.prototype.getAttribute = function (key) {
                    return this.get(key);
                };
                HashMap.prototype.put = function (key, value) {
                    this.collection[this.getKey(key)] = value;
                };
                HashMap.prototype.get = function (key) {
                    return this.collection[this.getKey(key)];
                };
                HashMap.prototype.putKeyString = function (key, value) {
                    this.collection[key] = value;
                };
                HashMap.prototype.getKeyString = function (key) {
                    return this.collection[key];
                };
                HashMap.prototype.copy = function (copy) {
                    for (var key in this.getKeys()) {
                        copy.putKeyString(key, this.get[key]);
                    }
                };
                HashMap.prototype.toList = function () {
                    var list = [];
                    for (var entry in this.collection) {
                        list.push(this.collection[entry]);
                    }
                    return list;
                };
                HashMap.prototype.getKeys = function () {
                    return Object.keys(this.collection);
                };
                HashMap.prototype.containsKey = function (key) {
                    return this.collection[this.getKey(key)];
                };
                return HashMap;
            }());
            exports_14("HashMap", HashMap);
            HashSet = (function (_super) {
                __extends(HashSet, _super);
                function HashSet() {
                    _super.apply(this, arguments);
                }
                return HashSet;
            }(HashMap));
            exports_14("HashSet", HashSet);
        }
    }
});
System.register("src/intermediate/SymTabEntry", ["src/util/HashMap"], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var HashMap_1;
    var SymTabEntry;
    return {
        setters:[
            function (HashMap_1_1) {
                HashMap_1 = HashMap_1_1;
            }],
        execute: function() {
            SymTabEntry = (function (_super) {
                __extends(SymTabEntry, _super);
                function SymTabEntry(name, symTab) {
                    _super.call(this);
                    this.name = name;
                    this.symTab = symTab;
                    this.lineNumbers = [];
                }
                SymTabEntry.prototype.getName = function () {
                    return this.name;
                };
                SymTabEntry.prototype.getSymTab = function () {
                    return this.symTab;
                };
                SymTabEntry.prototype.setDefinition = function (definition) {
                    this.definition = definition;
                };
                SymTabEntry.prototype.getDefinition = function () {
                    return this.definition;
                };
                SymTabEntry.prototype.setTypeSpec = function (typeSpec) {
                    this.typeSpec = typeSpec;
                };
                SymTabEntry.prototype.getTypeSpec = function () {
                    return this.typeSpec;
                };
                SymTabEntry.prototype.appendLineNumber = function (lineNumber) {
                    this.lineNumbers.push(lineNumber);
                };
                SymTabEntry.prototype.getLineNumbers = function () {
                    return this.lineNumbers;
                };
                return SymTabEntry;
            }(HashMap_1.HashMap));
            exports_15("SymTabEntry", SymTabEntry);
        }
    }
});
System.register("src/intermediate/SymTabStack", [], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("src/util/List", [], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var List;
    return {
        setters:[],
        execute: function() {
            List = (function () {
                function List(list) {
                    this.collection = [];
                    this.collection = list || [];
                }
                List.prototype.add = function (value) {
                    if (!this.contains(value)) {
                        this.collection.push(value);
                    }
                };
                List.prototype.removeIndex = function (index) {
                    this.remove(this.get(index));
                };
                List.prototype.remove = function (value) {
                    if (value) {
                        var index = this.indexOf(value);
                        if (index !== -1)
                            this.collection.splice(index, 1);
                    }
                    else {
                        this.collection.pop();
                    }
                };
                List.prototype.get = function (value) {
                    return this.index(value);
                };
                List.prototype.indexOf = function (value) {
                    return this.collection.indexOf(value);
                };
                List.prototype.index = function (value) {
                    return this.collection[value];
                };
                List.prototype.contains = function (value) {
                    return this.indexOf(value) !== -1;
                };
                List.prototype.addAll = function (value) {
                    for (var i = 0; i < value.size(); i++) {
                        if (!this.contains(value[i])) {
                            this.add(value.index(i));
                        }
                    }
                };
                List.prototype.clone = function () {
                    return new List(this.collection.slice(0));
                };
                List.prototype.size = function () {
                    return this.collection.length;
                };
                return List;
            }());
            exports_17("List", List);
        }
    }
});
System.register("src/intermediate/symtabimpl/SymTabStackImpl", ["src/intermediate/SymTabFactory", "src/util/List"], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var SymTabFactory_1, List_1;
    var SymTabStackImpl;
    return {
        setters:[
            function (SymTabFactory_1_1) {
                SymTabFactory_1 = SymTabFactory_1_1;
            },
            function (List_1_1) {
                List_1 = List_1_1;
            }],
        execute: function() {
            SymTabStackImpl = (function (_super) {
                __extends(SymTabStackImpl, _super);
                function SymTabStackImpl() {
                    _super.call(this);
                    this.currentNestingLevel = 0;
                    this.add(SymTabFactory_1.SymTabFactory.createSymTab(this.currentNestingLevel));
                }
                SymTabStackImpl.prototype.setProgramId = function (id) {
                    this.programId = id;
                };
                SymTabStackImpl.prototype.getProgramId = function () {
                    return this.programId;
                };
                SymTabStackImpl.prototype.getCurrentNestingLevel = function () {
                    return this.currentNestingLevel;
                };
                SymTabStackImpl.prototype.getLocalSymTab = function () {
                    return this.get(this.currentNestingLevel);
                };
                SymTabStackImpl.prototype.push = function (symTab) {
                    if (symTab) {
                        ++this.currentNestingLevel;
                    }
                    else {
                        symTab = SymTabFactory_1.SymTabFactory.createSymTab(++this.currentNestingLevel);
                    }
                    this.add(symTab);
                    return symTab;
                };
                SymTabStackImpl.prototype.pop = function () {
                    var symTab = this.get(this.currentNestingLevel);
                    this.removeIndex(this.currentNestingLevel--);
                    return symTab;
                };
                SymTabStackImpl.prototype.enterLocal = function (name) {
                    return this.get(this.currentNestingLevel).enter(name);
                };
                SymTabStackImpl.prototype.lookupLocal = function (name) {
                    return this.get(this.currentNestingLevel).lookup(name);
                };
                SymTabStackImpl.prototype.lookup = function (name) {
                    var foundEntry = undefined;
                    for (var i = this.currentNestingLevel; (i >= 0) && (foundEntry === undefined); --i) {
                        foundEntry = this.get(i).lookup(name);
                    }
                    return foundEntry;
                };
                return SymTabStackImpl;
            }(List_1.List));
            exports_18("SymTabStackImpl", SymTabStackImpl);
        }
    }
});
System.register("src/intermediate/symtabimpl/SymTabEntryImpl", ["src/intermediate/SymTabEntry"], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var SymTabEntry_1;
    var SymTabEntryImpl;
    return {
        setters:[
            function (SymTabEntry_1_1) {
                SymTabEntry_1 = SymTabEntry_1_1;
            }],
        execute: function() {
            SymTabEntryImpl = (function (_super) {
                __extends(SymTabEntryImpl, _super);
                function SymTabEntryImpl(name, symTab) {
                    _super.call(this, name, symTab);
                }
                return SymTabEntryImpl;
            }(SymTabEntry_1.SymTabEntry));
            exports_19("SymTabEntryImpl", SymTabEntryImpl);
        }
    }
});
System.register("src/intermediate/symtabimpl/SymTabImpl", ["src/util/TreeMap", "src/intermediate/SymTabFactory"], function(exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    var TreeMap_2, SymTabFactory_2;
    var SymTabImpl;
    return {
        setters:[
            function (TreeMap_2_1) {
                TreeMap_2 = TreeMap_2_1;
            },
            function (SymTabFactory_2_1) {
                SymTabFactory_2 = SymTabFactory_2_1;
            }],
        execute: function() {
            SymTabImpl = (function (_super) {
                __extends(SymTabImpl, _super);
                function SymTabImpl(nestingLevel) {
                    _super.call(this);
                    this.nestingLevel = nestingLevel;
                    this.slotNumber = -1;
                    this.maxSlotNumber = 0;
                }
                SymTabImpl.prototype.getNestingLevel = function () {
                    return this.nestingLevel;
                };
                SymTabImpl.prototype.enter = function (name) {
                    var entry = SymTabFactory_2.SymTabFactory.createSymTabEntry(name, this);
                    _super.prototype.put.call(this, name, entry);
                    return entry;
                };
                SymTabImpl.prototype.lookup = function (name) {
                    return this.get(name);
                };
                SymTabImpl.prototype.sortedEntries = function () {
                    return this.toList();
                };
                SymTabImpl.prototype.nextSlotNumber = function () {
                    this.maxSlotNumber = ++this.slotNumber;
                    return this.slotNumber;
                };
                SymTabImpl.prototype.getMaxSlotNumber = function () {
                    return this.maxSlotNumber;
                };
                return SymTabImpl;
            }(TreeMap_2.TreeMap));
            exports_20("SymTabImpl", SymTabImpl);
        }
    }
});
System.register("src/intermediate/SymTabFactory", ["src/intermediate/symtabimpl/SymTabStackImpl", "src/intermediate/symtabimpl/SymTabEntryImpl", "src/intermediate/symtabimpl/SymTabImpl"], function(exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    var SymTabStackImpl_1, SymTabEntryImpl_1, SymTabImpl_1;
    var SymTabFactory;
    return {
        setters:[
            function (SymTabStackImpl_1_1) {
                SymTabStackImpl_1 = SymTabStackImpl_1_1;
            },
            function (SymTabEntryImpl_1_1) {
                SymTabEntryImpl_1 = SymTabEntryImpl_1_1;
            },
            function (SymTabImpl_1_1) {
                SymTabImpl_1 = SymTabImpl_1_1;
            }],
        execute: function() {
            SymTabFactory = (function () {
                function SymTabFactory() {
                }
                SymTabFactory.createSymTabStack = function () {
                    return new SymTabStackImpl_1.SymTabStackImpl();
                };
                SymTabFactory.createSymTab = function (nestingLevel) {
                    return new SymTabImpl_1.SymTabImpl(nestingLevel);
                };
                SymTabFactory.createSymTabEntry = function (name, symTab) {
                    return new SymTabEntryImpl_1.SymTabEntryImpl(name, symTab);
                };
                return SymTabFactory;
            }());
            exports_21("SymTabFactory", SymTabFactory);
        }
    }
});
System.register("src/frontend/TokenType", [], function(exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("src/frontend/Parser", ["src/message/MessageHandler", "src/intermediate/SymTabFactory"], function(exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    var MessageHandler_1, SymTabFactory_3;
    var Parser;
    return {
        setters:[
            function (MessageHandler_1_1) {
                MessageHandler_1 = MessageHandler_1_1;
            },
            function (SymTabFactory_3_1) {
                SymTabFactory_3 = SymTabFactory_3_1;
            }],
        execute: function() {
            Parser = (function () {
                function Parser(scanner) {
                    this.scanner = scanner;
                }
                Parser.prototype.getScanner = function () {
                    return this.scanner;
                };
                Parser.prototype.getSymTabStack = function () {
                    return Parser.symTabStack;
                };
                Parser.prototype.getMessageHandler = function () {
                    return Parser.messageHandler;
                };
                Parser.prototype.currentToken = function () {
                    return this.scanner.getCurrentToken();
                };
                Parser.prototype.nextToken = function () {
                    return this.scanner.nextToken();
                };
                Parser.prototype.addMessageListener = function (listener) {
                    Parser.messageHandler.addListener(listener);
                };
                Parser.prototype.removeMessageListener = function (listener) {
                    Parser.messageHandler.removeListener(listener);
                };
                Parser.prototype.sendMessage = function (message) {
                    Parser.messageHandler.sendMessage(message);
                };
                Parser.symTabStack = SymTabFactory_3.SymTabFactory.createSymTabStack();
                Parser.messageHandler = new MessageHandler_1.MessageHandler();
                return Parser;
            }());
            exports_23("Parser", Parser);
        }
    }
});
System.register("src/frontend/Source", ["src/message/Message", "src/message/MessageHandler", "src/message/MessageType"], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    var Message_1, MessageHandler_2, MessageType_1;
    var Source;
    return {
        setters:[
            function (Message_1_1) {
                Message_1 = Message_1_1;
            },
            function (MessageHandler_2_1) {
                MessageHandler_2 = MessageHandler_2_1;
            },
            function (MessageType_1_1) {
                MessageType_1 = MessageType_1_1;
            }],
        execute: function() {
            Source = (function () {
                function Source(text) {
                    this.text = text;
                    this.lineNum = 0;
                    this.currentPos = -2;
                    this.messageHandler = new MessageHandler_2.MessageHandler();
                    this.globalPos = 0;
                }
                Source.prototype.getLineNum = function () {
                    return this.lineNum;
                };
                Source.prototype.getPosition = function () {
                    return this.currentPos;
                };
                Source.prototype.currentChar = function () {
                    if (this.currentPos === -2) {
                        this.readLine();
                        return this.nextChar();
                    }
                    else if (this.line === undefined) {
                        return Source.EOF;
                    }
                    else if ((this.currentPos === -1) || (this.currentPos === this.line.length)) {
                        return Source.EOL;
                    }
                    else if (this.currentPos > this.line.length) {
                        this.readLine();
                        return this.nextChar();
                    }
                    else {
                        return this.line.charAt(this.currentPos);
                    }
                };
                Source.prototype.nextChar = function () {
                    ++this.currentPos;
                    return this.currentChar();
                };
                Source.prototype.peekChar = function () {
                    this.currentChar();
                    if (this.line === undefined) {
                        return Source.EOF;
                    }
                    var nextPos = this.currentPos + 1;
                    return nextPos < this.line.length ? this.line.charAt(nextPos) : Source.EOL;
                };
                Source.prototype.atEol = function () {
                    return (this.line !== undefined) && (this.currentPos === this.line.length);
                };
                Source.prototype.atEof = function () {
                    if (this.currentPos === -2) {
                        this.readLine();
                    }
                    return this.line === undefined;
                };
                Source.prototype.skipToNextLine = function () {
                    if (this.line !== undefined) {
                        this.currentPos = this.line.length + 1;
                    }
                };
                Source.prototype.readALine = function () {
                    var line = '';
                    if (this.globalPos >= this.text.length) {
                        return undefined;
                    }
                    while (this.text.charAt(this.globalPos) !== Source.EOL
                        && this.globalPos < this.text.length) {
                        line += this.text.charAt(this.globalPos);
                        this.globalPos++;
                    }
                    this.globalPos++;
                    return line;
                };
                Source.prototype.readLine = function () {
                    this.line = this.readALine();
                    this.currentPos = -1;
                    if (this.line !== undefined) {
                        ++this.lineNum;
                    }
                    if (this.line !== undefined) {
                        this.sendMessage(new Message_1.Message(MessageType_1.MessageType.SOURCE_LINE, [this.lineNum, this.line]));
                    }
                };
                Source.prototype.close = function () {
                };
                Source.prototype.addMessageListener = function (listener) {
                    this.messageHandler.addListener(listener);
                };
                Source.prototype.removeMessageListener = function (listener) {
                    this.messageHandler.removeListener(listener);
                };
                Source.prototype.sendMessage = function (message) {
                    this.messageHandler.sendMessage(message);
                };
                Source.EOL = '\n';
                Source.EOF = 'EOF';
                return Source;
            }());
            exports_24("Source", Source);
        }
    }
});
System.register("src/frontend/Token", [], function(exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    var Token;
    return {
        setters:[],
        execute: function() {
            Token = (function () {
                function Token(source) {
                    this.source = source;
                    this.lineNum = source.getLineNum();
                    this.position = source.getPosition();
                    this.extract();
                }
                Token.prototype.getType = function () {
                    return this.type;
                };
                Token.prototype.getText = function () {
                    return this.text;
                };
                Token.prototype.getValue = function () {
                    return this.value;
                };
                Token.prototype.getLineNumber = function () {
                    return this.lineNum;
                };
                Token.prototype.getPosition = function () {
                    return this.position;
                };
                Token.prototype.extract = function () {
                    this.text = this.currentChar();
                    this.value = undefined;
                    this.nextChar();
                };
                Token.prototype.currentChar = function () {
                    return this.source.currentChar();
                };
                Token.prototype.nextChar = function () {
                    return this.source.nextChar();
                };
                Token.prototype.peekChar = function () {
                    return this.source.peekChar();
                };
                return Token;
            }());
            exports_25("Token", Token);
        }
    }
});
System.register("src/frontend/Scanner", [], function(exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    var Scanner;
    return {
        setters:[],
        execute: function() {
            Scanner = (function () {
                function Scanner(source) {
                    this.setSource(source);
                }
                Scanner.prototype.setSource = function (source) {
                    this.source = source;
                };
                Scanner.prototype.getCurrentToken = function () {
                    return this.currentToken;
                };
                Scanner.prototype.nextToken = function () {
                    this.currentToken = this.extractToken();
                    return this.currentToken;
                };
                Scanner.prototype.currentChar = function () {
                    return this.source.currentChar();
                };
                Scanner.prototype.nextChar = function () {
                    return this.source.nextChar();
                };
                Scanner.prototype.atEol = function () {
                    return this.source.atEol();
                };
                Scanner.prototype.atEof = function () {
                    return this.source.atEof();
                };
                Scanner.prototype.skipToNextLine = function () {
                    this.source.skipToNextLine();
                };
                return Scanner;
            }());
            exports_26("Scanner", Scanner);
        }
    }
});
System.register("src/frontend/EofToken", ["src/frontend/Token"], function(exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    var Token_1;
    var EofToken;
    return {
        setters:[
            function (Token_1_1) {
                Token_1 = Token_1_1;
            }],
        execute: function() {
            EofToken = (function (_super) {
                __extends(EofToken, _super);
                function EofToken(source) {
                    _super.call(this, source);
                }
                EofToken.prototype.extract = function () {
                };
                return EofToken;
            }(Token_1.Token));
            exports_27("EofToken", EofToken);
        }
    }
});
System.register("src/language/pascal/PascalTokenType", ["src/util/List", "src/util/TreeMap", "src/util/PolyfillObject"], function(exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    var List_2, TreeMap_3, PolyfillObject_2;
    var PascalTokenTypeEnum, PascalTokenType;
    return {
        setters:[
            function (List_2_1) {
                List_2 = List_2_1;
            },
            function (TreeMap_3_1) {
                TreeMap_3 = TreeMap_3_1;
            },
            function (PolyfillObject_2_1) {
                PolyfillObject_2 = PolyfillObject_2_1;
            }],
        execute: function() {
            (function (PascalTokenTypeEnum) {
                PascalTokenTypeEnum[PascalTokenTypeEnum["AND"] = 0] = "AND";
                PascalTokenTypeEnum[PascalTokenTypeEnum["ARRAY"] = 1] = "ARRAY";
                PascalTokenTypeEnum[PascalTokenTypeEnum["BEGIN"] = 2] = "BEGIN";
                PascalTokenTypeEnum[PascalTokenTypeEnum["CASE"] = 3] = "CASE";
                PascalTokenTypeEnum[PascalTokenTypeEnum["CONST"] = 4] = "CONST";
                PascalTokenTypeEnum[PascalTokenTypeEnum["DIV"] = 5] = "DIV";
                PascalTokenTypeEnum[PascalTokenTypeEnum["DO"] = 6] = "DO";
                PascalTokenTypeEnum[PascalTokenTypeEnum["DOWNTO"] = 7] = "DOWNTO";
                PascalTokenTypeEnum[PascalTokenTypeEnum["ELSE"] = 8] = "ELSE";
                PascalTokenTypeEnum[PascalTokenTypeEnum["END"] = 9] = "END";
                PascalTokenTypeEnum[PascalTokenTypeEnum["FILE"] = 10] = "FILE";
                PascalTokenTypeEnum[PascalTokenTypeEnum["FOR"] = 11] = "FOR";
                PascalTokenTypeEnum[PascalTokenTypeEnum["FUNCTION"] = 12] = "FUNCTION";
                PascalTokenTypeEnum[PascalTokenTypeEnum["GOTO"] = 13] = "GOTO";
                PascalTokenTypeEnum[PascalTokenTypeEnum["IF"] = 14] = "IF";
                PascalTokenTypeEnum[PascalTokenTypeEnum["IN"] = 15] = "IN";
                PascalTokenTypeEnum[PascalTokenTypeEnum["LABEL"] = 16] = "LABEL";
                PascalTokenTypeEnum[PascalTokenTypeEnum["MOD"] = 17] = "MOD";
                PascalTokenTypeEnum[PascalTokenTypeEnum["NIL"] = 18] = "NIL";
                PascalTokenTypeEnum[PascalTokenTypeEnum["NOT"] = 19] = "NOT";
                PascalTokenTypeEnum[PascalTokenTypeEnum["OF"] = 20] = "OF";
                PascalTokenTypeEnum[PascalTokenTypeEnum["OR"] = 21] = "OR";
                PascalTokenTypeEnum[PascalTokenTypeEnum["PACKED"] = 22] = "PACKED";
                PascalTokenTypeEnum[PascalTokenTypeEnum["PROCEDURE"] = 23] = "PROCEDURE";
                PascalTokenTypeEnum[PascalTokenTypeEnum["PROGRAM"] = 24] = "PROGRAM";
                PascalTokenTypeEnum[PascalTokenTypeEnum["RECORD"] = 25] = "RECORD";
                PascalTokenTypeEnum[PascalTokenTypeEnum["REPEAT"] = 26] = "REPEAT";
                PascalTokenTypeEnum[PascalTokenTypeEnum["SET"] = 27] = "SET";
                PascalTokenTypeEnum[PascalTokenTypeEnum["THEN"] = 28] = "THEN";
                PascalTokenTypeEnum[PascalTokenTypeEnum["TO"] = 29] = "TO";
                PascalTokenTypeEnum[PascalTokenTypeEnum["TYPE"] = 30] = "TYPE";
                PascalTokenTypeEnum[PascalTokenTypeEnum["UNTIL"] = 31] = "UNTIL";
                PascalTokenTypeEnum[PascalTokenTypeEnum["VAR"] = 32] = "VAR";
                PascalTokenTypeEnum[PascalTokenTypeEnum["WHILE"] = 33] = "WHILE";
                PascalTokenTypeEnum[PascalTokenTypeEnum["WITH"] = 34] = "WITH";
                PascalTokenTypeEnum[PascalTokenTypeEnum["PLUS"] = 35] = "PLUS";
                PascalTokenTypeEnum[PascalTokenTypeEnum["MINUS"] = 36] = "MINUS";
                PascalTokenTypeEnum[PascalTokenTypeEnum["STAR"] = 37] = "STAR";
                PascalTokenTypeEnum[PascalTokenTypeEnum["SLASH"] = 38] = "SLASH";
                PascalTokenTypeEnum[PascalTokenTypeEnum["COLON_EQUALS"] = 39] = "COLON_EQUALS";
                PascalTokenTypeEnum[PascalTokenTypeEnum["DOT"] = 40] = "DOT";
                PascalTokenTypeEnum[PascalTokenTypeEnum["COMMA"] = 41] = "COMMA";
                PascalTokenTypeEnum[PascalTokenTypeEnum["SEMICOLON"] = 42] = "SEMICOLON";
                PascalTokenTypeEnum[PascalTokenTypeEnum["COLON"] = 43] = "COLON";
                PascalTokenTypeEnum[PascalTokenTypeEnum["QUOTE"] = 44] = "QUOTE";
                PascalTokenTypeEnum[PascalTokenTypeEnum["EQUALS"] = 45] = "EQUALS";
                PascalTokenTypeEnum[PascalTokenTypeEnum["NOT_EQUALS"] = 46] = "NOT_EQUALS";
                PascalTokenTypeEnum[PascalTokenTypeEnum["LESS_THAN"] = 47] = "LESS_THAN";
                PascalTokenTypeEnum[PascalTokenTypeEnum["LESS_EQUALS"] = 48] = "LESS_EQUALS";
                PascalTokenTypeEnum[PascalTokenTypeEnum["GREATER_EQUALS"] = 49] = "GREATER_EQUALS";
                PascalTokenTypeEnum[PascalTokenTypeEnum["GREATER_THAN"] = 50] = "GREATER_THAN";
                PascalTokenTypeEnum[PascalTokenTypeEnum["LEFT_PAREN"] = 51] = "LEFT_PAREN";
                PascalTokenTypeEnum[PascalTokenTypeEnum["RIGHT_PAREN"] = 52] = "RIGHT_PAREN";
                PascalTokenTypeEnum[PascalTokenTypeEnum["LEFT_BRACKET"] = 53] = "LEFT_BRACKET";
                PascalTokenTypeEnum[PascalTokenTypeEnum["RIGHT_BRACKET"] = 54] = "RIGHT_BRACKET";
                PascalTokenTypeEnum[PascalTokenTypeEnum["LEFT_BRACE"] = 55] = "LEFT_BRACE";
                PascalTokenTypeEnum[PascalTokenTypeEnum["RIGHT_BRACE"] = 56] = "RIGHT_BRACE";
                PascalTokenTypeEnum[PascalTokenTypeEnum["UP_ARROW"] = 57] = "UP_ARROW";
                PascalTokenTypeEnum[PascalTokenTypeEnum["DOT_DOT"] = 58] = "DOT_DOT";
                PascalTokenTypeEnum[PascalTokenTypeEnum["IDENTIFIER"] = 59] = "IDENTIFIER";
                PascalTokenTypeEnum[PascalTokenTypeEnum["INTEGER"] = 60] = "INTEGER";
                PascalTokenTypeEnum[PascalTokenTypeEnum["REAL"] = 61] = "REAL";
                PascalTokenTypeEnum[PascalTokenTypeEnum["STRING"] = 62] = "STRING";
                PascalTokenTypeEnum[PascalTokenTypeEnum["ERROR"] = 63] = "ERROR";
                PascalTokenTypeEnum[PascalTokenTypeEnum["END_OF_FILE"] = 64] = "END_OF_FILE";
            })(PascalTokenTypeEnum || (PascalTokenTypeEnum = {}));
            exports_28("PascalTokenTypeEnum", PascalTokenTypeEnum);
            (function (PascalTokenTypeEnum) {
                function isIndex(key) {
                    var n = ~~Number(key);
                    return String(n) === key && n >= 0;
                }
                var _names = Object
                    .keys(PascalTokenTypeEnum)
                    .filter(function (key) { return !isIndex(key); });
                var _indices = Object
                    .keys(PascalTokenTypeEnum)
                    .filter(function (key) { return isIndex(key); })
                    .map(function (index) { return Number(index); });
                function names() {
                    return _names;
                }
                PascalTokenTypeEnum.names = names;
                function indices() {
                    return _indices;
                }
                PascalTokenTypeEnum.indices = indices;
            })(PascalTokenTypeEnum = PascalTokenTypeEnum || (PascalTokenTypeEnum = {}));
            exports_28("PascalTokenTypeEnum", PascalTokenTypeEnum);
            PascalTokenType = (function (_super) {
                __extends(PascalTokenType, _super);
                function PascalTokenType(text) {
                    _super.call(this);
                    text = text || this.toString().toLowerCase();
                    this.text = text;
                }
                PascalTokenType.initialize = function () {
                    var values = PascalTokenTypeEnum.names();
                    for (var i = PascalTokenType.FIRST_RESERVED_INDEX; i < PascalTokenType.LAST_RESERVED_INDEX; ++i) {
                        PascalTokenType.RESERVED_WORDS.add(PascalTokenType[values[i]]);
                    }
                    var specialValues = PascalTokenTypeEnum.names();
                    for (var i = PascalTokenType.FIRST_SPECIAL_INDEX; i < PascalTokenType.LAST_SPECIAL_INDEX; ++i) {
                        PascalTokenType.SPECIAL_SYMBOLS.put(PascalTokenType[values[i]].getText(), PascalTokenType[values[i]]);
                    }
                };
                PascalTokenType.prototype.getText = function () {
                    return this.text;
                };
                PascalTokenType.AND = new PascalTokenType('AND');
                PascalTokenType.ARRAY = new PascalTokenType('ARRAY');
                PascalTokenType.BEGIN = new PascalTokenType('BEGIN');
                PascalTokenType.CASE = new PascalTokenType('CASE');
                PascalTokenType.CONST = new PascalTokenType('CONST');
                PascalTokenType.DIV = new PascalTokenType('DIV');
                PascalTokenType.DO = new PascalTokenType('DO');
                PascalTokenType.DOWNTO = new PascalTokenType('DOWNTO');
                PascalTokenType.ELSE = new PascalTokenType('ELSE');
                PascalTokenType.END = new PascalTokenType('END');
                PascalTokenType.FILE = new PascalTokenType('FILE');
                PascalTokenType.FOR = new PascalTokenType('FOR');
                PascalTokenType.FUNCTION = new PascalTokenType('FUNCTION');
                PascalTokenType.GOTO = new PascalTokenType('GOTO');
                PascalTokenType.IF = new PascalTokenType('IF');
                PascalTokenType.IN = new PascalTokenType('IN');
                PascalTokenType.LABEL = new PascalTokenType('LABEL');
                PascalTokenType.MOD = new PascalTokenType('MOD');
                PascalTokenType.NIL = new PascalTokenType('NIL');
                PascalTokenType.NOT = new PascalTokenType('NOT');
                PascalTokenType.OF = new PascalTokenType('OF');
                PascalTokenType.OR = new PascalTokenType('OR');
                PascalTokenType.PACKED = new PascalTokenType('PACKED');
                PascalTokenType.PROCEDURE = new PascalTokenType('PROCEDURE');
                PascalTokenType.PROGRAM = new PascalTokenType('PROGRAM');
                PascalTokenType.RECORD = new PascalTokenType('RECORD');
                PascalTokenType.REPEAT = new PascalTokenType('REPEAT');
                PascalTokenType.SET = new PascalTokenType('SET');
                PascalTokenType.THEN = new PascalTokenType('THEN');
                PascalTokenType.TO = new PascalTokenType('TO');
                PascalTokenType.TYPE = new PascalTokenType('TYPE');
                PascalTokenType.UNTIL = new PascalTokenType('UNTIL');
                PascalTokenType.VAR = new PascalTokenType('VAR');
                PascalTokenType.WHILE = new PascalTokenType('WHILE');
                PascalTokenType.WITH = new PascalTokenType('WITH');
                PascalTokenType.PLUS = new PascalTokenType('+');
                PascalTokenType.MINUS = new PascalTokenType('-');
                PascalTokenType.STAR = new PascalTokenType('*');
                PascalTokenType.SLASH = new PascalTokenType('/');
                PascalTokenType.COLON_EQUALS = new PascalTokenType(':=');
                PascalTokenType.DOT = new PascalTokenType('.');
                PascalTokenType.COMMA = new PascalTokenType(',');
                PascalTokenType.SEMICOLON = new PascalTokenType(';');
                PascalTokenType.COLON = new PascalTokenType(':');
                PascalTokenType.QUOTE = new PascalTokenType('"');
                PascalTokenType.EQUALS = new PascalTokenType('=');
                PascalTokenType.NOT_EQUALS = new PascalTokenType('<>');
                PascalTokenType.LESS_THAN = new PascalTokenType('<');
                PascalTokenType.LESS_EQUALS = new PascalTokenType('<=');
                PascalTokenType.GREATER_EQUALS = new PascalTokenType('>=');
                PascalTokenType.GREATER_THAN = new PascalTokenType('>');
                PascalTokenType.LEFT_PAREN = new PascalTokenType('(');
                PascalTokenType.RIGHT_PAREN = new PascalTokenType(')');
                PascalTokenType.LEFT_BRACKET = new PascalTokenType('[');
                PascalTokenType.RIGHT_BRACKET = new PascalTokenType(']');
                PascalTokenType.LEFT_BRACE = new PascalTokenType('{');
                PascalTokenType.RIGHT_BRACE = new PascalTokenType('}');
                PascalTokenType.UP_ARROW = new PascalTokenType('^');
                PascalTokenType.DOT_DOT = new PascalTokenType('..');
                PascalTokenType.IDENTIFIER = new PascalTokenType('IDENTIFIER');
                PascalTokenType.INTEGER = new PascalTokenType('INTEGER');
                PascalTokenType.REAL = new PascalTokenType('REAL');
                PascalTokenType.STRING = new PascalTokenType('STRING');
                PascalTokenType.ERROR = new PascalTokenType('ERROR');
                PascalTokenType.END_OF_FILE = new PascalTokenType('END_OF_FILE');
                PascalTokenType.FIRST_RESERVED_INDEX = PascalTokenTypeEnum.AND;
                PascalTokenType.LAST_RESERVED_INDEX = PascalTokenTypeEnum.WITH;
                PascalTokenType.FIRST_SPECIAL_INDEX = PascalTokenTypeEnum.PLUS;
                PascalTokenType.LAST_SPECIAL_INDEX = PascalTokenTypeEnum.DOT_DOT;
                PascalTokenType.RESERVED_WORDS = new List_2.List();
                PascalTokenType.SPECIAL_SYMBOLS = new TreeMap_3.TreeMap();
                return PascalTokenType;
            }(PolyfillObject_2.PolyfillObject));
            exports_28("PascalTokenType", PascalTokenType);
            PascalTokenType.initialize();
        }
    }
});
System.register("src/language/pascal/PascalErrorCode", [], function(exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
    var PascalErrorCode;
    return {
        setters:[],
        execute: function() {
            PascalErrorCode = (function () {
                function PascalErrorCode(message, status) {
                    if (status === void 0) { status = 0; }
                    this.status = status;
                    this.message = message;
                }
                PascalErrorCode.prototype.getStatus = function () {
                    return this.status;
                };
                PascalErrorCode.prototype.toString = function () {
                    return this.message;
                };
                PascalErrorCode.ALREADY_FORWARDED = new PascalErrorCode('Already specified in FORWARD');
                PascalErrorCode.CASE_CONSTANT_REUSED = new PascalErrorCode('CASE constant reused');
                PascalErrorCode.IDENTIFIER_REDEFINED = new PascalErrorCode('Redefined identifier');
                PascalErrorCode.IDENTIFIER_UNDEFINED = new PascalErrorCode('Undefined identifier');
                PascalErrorCode.INCOMPATIBLE_ASSIGNMENT = new PascalErrorCode('Incompatible assignment');
                PascalErrorCode.INCOMPATIBLE_TYPES = new PascalErrorCode('Incompatible types');
                PascalErrorCode.INVALID_ASSIGNMENT = new PascalErrorCode('Invalid assignment statement');
                PascalErrorCode.INVALID_CHARACTER = new PascalErrorCode('Invalid character');
                PascalErrorCode.INVALID_CONSTANT = new PascalErrorCode('Invalid constant');
                PascalErrorCode.INVALID_EXPONENT = new PascalErrorCode('Invalid exponent');
                PascalErrorCode.INVALID_EXPRESSION = new PascalErrorCode('Invalid expression');
                PascalErrorCode.INVALID_FIELD = new PascalErrorCode('Invalid field');
                PascalErrorCode.INVALID_FRACTION = new PascalErrorCode('Invalid fraction');
                PascalErrorCode.INVALID_IDENTIFIER_USAGE = new PascalErrorCode('Invalid identifier usage');
                PascalErrorCode.INVALID_INDEX_TYPE = new PascalErrorCode('Invalid index type');
                PascalErrorCode.INVALID_NUMBER = new PascalErrorCode('Invalid number');
                PascalErrorCode.INVALID_STATEMENT = new PascalErrorCode('Invalid statement');
                PascalErrorCode.INVALID_SUBRANGE_TYPE = new PascalErrorCode('Invalid subrange type');
                PascalErrorCode.INVALID_TARGET = new PascalErrorCode('Invalid assignment target');
                PascalErrorCode.INVALID_TYPE = new PascalErrorCode('Invalid type');
                PascalErrorCode.INVALID_VAR_PARM = new PascalErrorCode('Invalid VAR parameter');
                PascalErrorCode.MIN_GT_MAX = new PascalErrorCode('Min limit greater than max limit');
                PascalErrorCode.MISSING_BEGIN = new PascalErrorCode('Missing BEGIN');
                PascalErrorCode.MISSING_COLON = new PascalErrorCode('Missing :');
                PascalErrorCode.MISSING_COLON_EQUALS = new PascalErrorCode('Missing :=');
                PascalErrorCode.MISSING_COMMA = new PascalErrorCode('Missing ,');
                PascalErrorCode.MISSING_CONSTANT = new PascalErrorCode('Missing constant');
                PascalErrorCode.MISSING_DO = new PascalErrorCode('Missing DO');
                PascalErrorCode.MISSING_DOT_DOT = new PascalErrorCode('Missing ..');
                PascalErrorCode.MISSING_END = new PascalErrorCode('Missing END');
                PascalErrorCode.MISSING_EQUALS = new PascalErrorCode('Missing =');
                PascalErrorCode.MISSING_FOR_CONTROL = new PascalErrorCode('Invalid FOR control variable');
                PascalErrorCode.MISSING_IDENTIFIER = new PascalErrorCode('Missing identifier');
                PascalErrorCode.MISSING_LEFT_BRACKET = new PascalErrorCode('Missing [');
                PascalErrorCode.MISSING_OF = new PascalErrorCode('Missing OF');
                PascalErrorCode.MISSING_PERIOD = new PascalErrorCode('Missing .');
                PascalErrorCode.MISSING_PROGRAM = new PascalErrorCode('Missing PROGRAM');
                PascalErrorCode.MISSING_RIGHT_BRACKET = new PascalErrorCode('Missing ]');
                PascalErrorCode.MISSING_RIGHT_PAREN = new PascalErrorCode('Missing )');
                PascalErrorCode.MISSING_SEMICOLON = new PascalErrorCode('Missing ;');
                PascalErrorCode.MISSING_THEN = new PascalErrorCode('Missing THEN');
                PascalErrorCode.MISSING_TO_DOWNTO = new PascalErrorCode('Missing TO or DOWNTO');
                PascalErrorCode.MISSING_UNTIL = new PascalErrorCode('Missing UNTIL');
                PascalErrorCode.MISSING_VARIABLE = new PascalErrorCode('Missing variable');
                PascalErrorCode.NOT_CONSTANT_IDENTIFIER = new PascalErrorCode('Not a constant identifier');
                PascalErrorCode.NOT_RECORD_VARIABLE = new PascalErrorCode('Not a record variable');
                PascalErrorCode.NOT_TYPE_IDENTIFIER = new PascalErrorCode('Not a type identifier');
                PascalErrorCode.RANGE_INTEGER = new PascalErrorCode('Integer literal out of range');
                PascalErrorCode.RANGE_REAL = new PascalErrorCode('Real literal out of range');
                PascalErrorCode.STACK_OVERFLOW = new PascalErrorCode('Stack overflow');
                PascalErrorCode.TOO_MANY_LEVELS = new PascalErrorCode('Nesting level too deep');
                PascalErrorCode.TOO_MANY_SUBSCRIPTS = new PascalErrorCode('Too many subscripts');
                PascalErrorCode.UNEXPECTED_EOF = new PascalErrorCode('Unexpected end of file');
                PascalErrorCode.UNEXPECTED_TOKEN = new PascalErrorCode('Unexpected token');
                PascalErrorCode.UNIMPLEMENTED = new PascalErrorCode('Unimplemented feature');
                PascalErrorCode.UNRECOGNIZABLE = new PascalErrorCode('Unrecognizable input');
                PascalErrorCode.WRONG_NUMBER_OF_PARMS = new PascalErrorCode('Wrong number of actual parameters');
                PascalErrorCode.IO_ERROR = new PascalErrorCode('Object I/O error', -101);
                PascalErrorCode.TOO_MANY_ERRORS = new PascalErrorCode('Too many syntax errors', -102);
                return PascalErrorCode;
            }());
            exports_29("PascalErrorCode", PascalErrorCode);
        }
    }
});
System.register("src/language/pascal/PascalToken", ["src/frontend/Token"], function(exports_30, context_30) {
    "use strict";
    var __moduleName = context_30 && context_30.id;
    var Token_2;
    var PascalToken;
    return {
        setters:[
            function (Token_2_1) {
                Token_2 = Token_2_1;
            }],
        execute: function() {
            PascalToken = (function (_super) {
                __extends(PascalToken, _super);
                function PascalToken(source) {
                    _super.call(this, source);
                }
                return PascalToken;
            }(Token_2.Token));
            exports_30("PascalToken", PascalToken);
        }
    }
});
System.register("src/util/Util", [], function(exports_31, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
    var Util;
    return {
        setters:[],
        execute: function() {
            Util = (function () {
                function Util() {
                }
                Util.isInteger = function (value) {
                    return Util.isFloat(value) &&
                        Math.floor(value) === value;
                };
                Util.isFloat = function (value) {
                    return Util.isNumber(value) &&
                        isFinite(value);
                };
                Util.isNumber = function (value) {
                    return typeof value === 'number';
                };
                Util.isDigit = function (n) {
                    return !isNaN(parseFloat(n)) && isFinite(n) && n.length === 1;
                };
                Util.isLetter = function (char) {
                    return /^[a-zA-Z]/.test(char) && char.length === 1;
                };
                Util.isLetterOrDigit = function (char) {
                    return Util.isDigit(char) || Util.isLetter(char);
                };
                Util.getNumericValue = function (aString) {
                    return Number(aString);
                };
                return Util;
            }());
            exports_31("Util", Util);
        }
    }
});
System.register("src/language/pascal/tokens/PascalWordToken", ["src/language/pascal/PascalToken", "src/language/pascal/PascalTokenType", "src/util/Util"], function(exports_32, context_32) {
    "use strict";
    var __moduleName = context_32 && context_32.id;
    var PascalToken_1, PascalTokenType_1, Util_1;
    var PascalWordToken;
    return {
        setters:[
            function (PascalToken_1_1) {
                PascalToken_1 = PascalToken_1_1;
            },
            function (PascalTokenType_1_1) {
                PascalTokenType_1 = PascalTokenType_1_1;
            },
            function (Util_1_1) {
                Util_1 = Util_1_1;
            }],
        execute: function() {
            PascalWordToken = (function (_super) {
                __extends(PascalWordToken, _super);
                function PascalWordToken(source) {
                    _super.call(this, source);
                }
                PascalWordToken.prototype.extract = function () {
                    var textBuffer = '';
                    var currentChar = this.currentChar();
                    while (Util_1.Util.isLetterOrDigit(currentChar)) {
                        textBuffer += currentChar;
                        currentChar = this.nextChar();
                    }
                    this.text = textBuffer.toString();
                    if (PascalTokenType_1.PascalTokenType.RESERVED_WORDS.indexOf(PascalTokenType_1.PascalTokenType[this.text.toUpperCase()]) !== -1) {
                        this.type = PascalTokenType_1.PascalTokenType[this.text.toUpperCase()];
                    }
                    else {
                        this.type = PascalTokenType_1.PascalTokenType.IDENTIFIER;
                    }
                };
                return PascalWordToken;
            }(PascalToken_1.PascalToken));
            exports_32("PascalWordToken", PascalWordToken);
        }
    }
});
System.register("src/language/pascal/tokens/PascalNumberToken", ["src/language/pascal/PascalToken", "src/language/pascal/PascalErrorCode", "src/language/pascal/PascalTokenType", "src/util/Util"], function(exports_33, context_33) {
    "use strict";
    var __moduleName = context_33 && context_33.id;
    var PascalToken_2, PascalErrorCode_1, PascalTokenType_2, Util_2;
    var PascalNumberToken;
    return {
        setters:[
            function (PascalToken_2_1) {
                PascalToken_2 = PascalToken_2_1;
            },
            function (PascalErrorCode_1_1) {
                PascalErrorCode_1 = PascalErrorCode_1_1;
            },
            function (PascalTokenType_2_1) {
                PascalTokenType_2 = PascalTokenType_2_1;
            },
            function (Util_2_1) {
                Util_2 = Util_2_1;
            }],
        execute: function() {
            PascalNumberToken = (function (_super) {
                __extends(PascalNumberToken, _super);
                function PascalNumberToken(source) {
                    _super.call(this, source);
                }
                PascalNumberToken.prototype.extract = function () {
                    var textBuffer = '';
                    this.extractNumber(textBuffer);
                    this.text = textBuffer.toString();
                };
                PascalNumberToken.prototype.extractNumber = function (textBuffer) {
                    var wholeDigits = undefined;
                    var fractionDigits = undefined;
                    var exponentDigits = undefined;
                    var exponentSign = '+';
                    var sawDotDot = false;
                    var currentChar;
                    this.type = PascalTokenType_2.PascalTokenType.INTEGER;
                    wholeDigits = this.unsignedIntegerDigits(textBuffer);
                    if (this.type === PascalTokenType_2.PascalTokenType.ERROR) {
                        return;
                    }
                    currentChar = this.currentChar();
                    if (currentChar === '.') {
                        if (this.peekChar() === '.') {
                            sawDotDot = true;
                        }
                        else {
                            this.type = PascalTokenType_2.PascalTokenType.REAL;
                            textBuffer += currentChar;
                            currentChar = this.nextChar();
                            fractionDigits = this.unsignedIntegerDigits(textBuffer);
                            if (this.type === PascalTokenType_2.PascalTokenType.ERROR) {
                                return;
                            }
                        }
                    }
                    currentChar = this.currentChar();
                    if (!sawDotDot && ((currentChar === 'E') || (currentChar === 'e'))) {
                        this.type = PascalTokenType_2.PascalTokenType.REAL;
                        textBuffer += currentChar;
                        currentChar = this.nextChar();
                        if ((currentChar === '+') || (currentChar === '-')) {
                            textBuffer += currentChar;
                            exponentSign = currentChar;
                            currentChar = this.nextChar();
                        }
                        exponentDigits = this.unsignedIntegerDigits(textBuffer);
                    }
                    if (this.type === PascalTokenType_2.PascalTokenType.INTEGER) {
                        var integerValue = this.computeIntegerValue(wholeDigits);
                        if (this.type !== PascalTokenType_2.PascalTokenType.ERROR) {
                            this.value = Math.floor(integerValue);
                        }
                    }
                    else if (this.type === PascalTokenType_2.PascalTokenType.REAL) {
                        var floatValue = this.computeFloatValue(wholeDigits, fractionDigits, exponentDigits, exponentSign);
                        if (this.type !== PascalTokenType_2.PascalTokenType.ERROR) {
                            this.value = floatValue;
                        }
                    }
                };
                PascalNumberToken.prototype.unsignedIntegerDigits = function (textBuffer) {
                    var currentChar = this.currentChar();
                    if (!Util_2.Util.isDigit(currentChar)) {
                        this.type = PascalTokenType_2.PascalTokenType.ERROR;
                        this.value = PascalErrorCode_1.PascalErrorCode.INVALID_NUMBER;
                        return undefined;
                    }
                    var digits = '';
                    while (Util_2.Util.isDigit(currentChar)) {
                        textBuffer += currentChar;
                        digits += currentChar;
                        currentChar = this.nextChar();
                    }
                    return digits.toString();
                };
                PascalNumberToken.prototype.computeIntegerValue = function (digits) {
                    if (digits === undefined) {
                        return 0;
                    }
                    var integerValue = 0;
                    var prevValue = -1;
                    var index = 0;
                    while ((index < digits.length) && (integerValue >= prevValue)) {
                        prevValue = integerValue;
                        integerValue = 10 * integerValue +
                            Util_2.Util.getNumericValue(digits.charAt(index++));
                    }
                    if (integerValue >= prevValue) {
                        return integerValue;
                    }
                    else {
                        this.type = PascalTokenType_2.PascalTokenType.ERROR;
                        this.value = PascalErrorCode_1.PascalErrorCode.RANGE_INTEGER;
                        return 0;
                    }
                };
                PascalNumberToken.prototype.computeFloatValue = function (wholeDigits, fractionDigits, exponentDigits, exponentSign) {
                    var floatValue = 0.0;
                    var exponentValue = this.computeIntegerValue(exponentDigits);
                    var digits = wholeDigits;
                    if (exponentSign === '-') {
                        exponentValue = -exponentValue;
                    }
                    if (fractionDigits !== undefined) {
                        exponentValue -= fractionDigits.length;
                        digits += fractionDigits;
                    }
                    if (Math.abs(exponentValue + wholeDigits.length) > PascalNumberToken.MAX_EXPONENT) {
                        this.type = PascalTokenType_2.PascalTokenType.ERROR;
                        this.value = PascalErrorCode_1.PascalErrorCode.RANGE_REAL;
                        return 0;
                    }
                    var index = 0;
                    while (index < digits.length) {
                        floatValue = 10 * floatValue +
                            Util_2.Util.getNumericValue(digits.charAt(index++));
                    }
                    if (exponentValue !== 0) {
                        floatValue *= Math.pow(10, exponentValue);
                    }
                    return floatValue;
                };
                PascalNumberToken.MAX_EXPONENT = 37;
                return PascalNumberToken;
            }(PascalToken_2.PascalToken));
            exports_33("PascalNumberToken", PascalNumberToken);
        }
    }
});
System.register("src/language/pascal/tokens/PascalStringToken", ["src/language/pascal/PascalToken", "src/language/pascal/PascalErrorCode", "src/language/pascal/PascalTokenType", "src/frontend/Source"], function(exports_34, context_34) {
    "use strict";
    var __moduleName = context_34 && context_34.id;
    var PascalToken_3, PascalErrorCode_2, PascalTokenType_3, Source_1;
    var PascalStringToken;
    return {
        setters:[
            function (PascalToken_3_1) {
                PascalToken_3 = PascalToken_3_1;
            },
            function (PascalErrorCode_2_1) {
                PascalErrorCode_2 = PascalErrorCode_2_1;
            },
            function (PascalTokenType_3_1) {
                PascalTokenType_3 = PascalTokenType_3_1;
            },
            function (Source_1_1) {
                Source_1 = Source_1_1;
            }],
        execute: function() {
            PascalStringToken = (function (_super) {
                __extends(PascalStringToken, _super);
                function PascalStringToken(source) {
                    _super.call(this, source);
                }
                PascalStringToken.prototype.extract = function () {
                    var textBuffer = '';
                    var valueBuffer = '';
                    var currentChar = this.nextChar();
                    textBuffer += '\'';
                    do {
                        if (currentChar === ' ') {
                            currentChar = ' ';
                        }
                        if ((currentChar !== '\'') && (currentChar !== Source_1.Source.EOF)) {
                            textBuffer += currentChar;
                            valueBuffer += currentChar;
                            currentChar = this.nextChar();
                        }
                        if (currentChar === '\'') {
                            while ((currentChar === '\'') && (this.peekChar() === '\'')) {
                                textBuffer += "''";
                                valueBuffer += currentChar;
                                currentChar = this.nextChar();
                                currentChar = this.nextChar();
                            }
                        }
                    } while ((currentChar !== '\'') && (currentChar !== Source_1.Source.EOF));
                    if (currentChar === '\'') {
                        this.nextChar();
                        textBuffer += '\'';
                        this.type = PascalTokenType_3.PascalTokenType.STRING;
                        this.value = valueBuffer;
                    }
                    else {
                        this.type = PascalTokenType_3.PascalTokenType.ERROR;
                        this.value = PascalErrorCode_2.PascalErrorCode.UNEXPECTED_EOF;
                    }
                    this.text = textBuffer.toString();
                };
                return PascalStringToken;
            }(PascalToken_3.PascalToken));
            exports_34("PascalStringToken", PascalStringToken);
        }
    }
});
System.register("src/language/pascal/tokens/PascalErrorToken", ["src/language/pascal/PascalToken", "src/language/pascal/PascalTokenType"], function(exports_35, context_35) {
    "use strict";
    var __moduleName = context_35 && context_35.id;
    var PascalToken_4, PascalTokenType_4;
    var PascalErrorToken;
    return {
        setters:[
            function (PascalToken_4_1) {
                PascalToken_4 = PascalToken_4_1;
            },
            function (PascalTokenType_4_1) {
                PascalTokenType_4 = PascalTokenType_4_1;
            }],
        execute: function() {
            PascalErrorToken = (function (_super) {
                __extends(PascalErrorToken, _super);
                function PascalErrorToken(source, errorCode, tokenText) {
                    _super.call(this, source);
                    this.text = tokenText;
                    this.type = PascalTokenType_4.PascalTokenType.ERROR;
                    this.value = errorCode;
                }
                PascalErrorToken.prototype.extract = function () {
                };
                return PascalErrorToken;
            }(PascalToken_4.PascalToken));
            exports_35("PascalErrorToken", PascalErrorToken);
        }
    }
});
System.register("src/language/pascal/tokens/PascalSpecialSymbolToken", ["src/language/pascal/PascalToken", "src/language/pascal/PascalErrorCode", "src/language/pascal/PascalTokenType"], function(exports_36, context_36) {
    "use strict";
    var __moduleName = context_36 && context_36.id;
    var PascalToken_5, PascalErrorCode_3, PascalTokenType_5;
    var PascalSpecialSymbolToken;
    return {
        setters:[
            function (PascalToken_5_1) {
                PascalToken_5 = PascalToken_5_1;
            },
            function (PascalErrorCode_3_1) {
                PascalErrorCode_3 = PascalErrorCode_3_1;
            },
            function (PascalTokenType_5_1) {
                PascalTokenType_5 = PascalTokenType_5_1;
            }],
        execute: function() {
            PascalSpecialSymbolToken = (function (_super) {
                __extends(PascalSpecialSymbolToken, _super);
                function PascalSpecialSymbolToken(source) {
                    _super.call(this, source);
                }
                PascalSpecialSymbolToken.prototype.extract = function () {
                    var currentChar = this.currentChar();
                    this.text = currentChar;
                    this.type = undefined;
                    switch (currentChar) {
                        case '+':
                        case '-':
                        case '*':
                        case '/':
                        case ',':
                        case ';':
                        case '\'':
                        case '=':
                        case '(':
                        case ')':
                        case '[':
                        case ']':
                        case '{':
                        case '}':
                        case '^': {
                            this.nextChar();
                            break;
                        }
                        case ':': {
                            currentChar = this.nextChar();
                            if (currentChar === '=') {
                                this.text += currentChar;
                                this.nextChar();
                            }
                            break;
                        }
                        case '<': {
                            currentChar = this.nextChar();
                            if (currentChar === '=') {
                                this.text += currentChar;
                                this.nextChar();
                            }
                            else if (currentChar === '>') {
                                this.text += currentChar;
                                this.nextChar();
                            }
                            break;
                        }
                        case '>': {
                            currentChar = this.nextChar();
                            if (currentChar === '=') {
                                this.text += currentChar;
                                this.nextChar();
                            }
                            break;
                        }
                        case '.': {
                            currentChar = this.nextChar();
                            if (currentChar === '.') {
                                this.text += currentChar;
                                this.nextChar();
                            }
                            break;
                        }
                        default: {
                            this.nextChar();
                            this.type = PascalTokenType_5.PascalTokenType.ERROR;
                            this.value = PascalErrorCode_3.PascalErrorCode.INVALID_CHARACTER;
                        }
                    }
                    if (this.type === undefined) {
                        this.type = PascalTokenType_5.PascalTokenType.SPECIAL_SYMBOLS.get(this.text);
                    }
                };
                return PascalSpecialSymbolToken;
            }(PascalToken_5.PascalToken));
            exports_36("PascalSpecialSymbolToken", PascalSpecialSymbolToken);
        }
    }
});
System.register("src/language/pascal/PascalScanner", ["src/frontend/Scanner", "src/frontend/Source", "src/frontend/EofToken", "src/language/pascal/PascalTokenType", "src/language/pascal/PascalErrorCode", "src/language/pascal/tokens/PascalWordToken", "src/language/pascal/tokens/PascalNumberToken", "src/language/pascal/tokens/PascalStringToken", "src/language/pascal/tokens/PascalErrorToken", "src/language/pascal/tokens/PascalSpecialSymbolToken", "src/util/Util"], function(exports_37, context_37) {
    "use strict";
    var __moduleName = context_37 && context_37.id;
    var Scanner_1, Source_2, EofToken_1, PascalTokenType_6, PascalErrorCode_4, PascalWordToken_1, PascalNumberToken_1, PascalStringToken_1, PascalErrorToken_1, PascalSpecialSymbolToken_1, Util_3;
    var PascalScanner;
    return {
        setters:[
            function (Scanner_1_1) {
                Scanner_1 = Scanner_1_1;
            },
            function (Source_2_1) {
                Source_2 = Source_2_1;
            },
            function (EofToken_1_1) {
                EofToken_1 = EofToken_1_1;
            },
            function (PascalTokenType_6_1) {
                PascalTokenType_6 = PascalTokenType_6_1;
            },
            function (PascalErrorCode_4_1) {
                PascalErrorCode_4 = PascalErrorCode_4_1;
            },
            function (PascalWordToken_1_1) {
                PascalWordToken_1 = PascalWordToken_1_1;
            },
            function (PascalNumberToken_1_1) {
                PascalNumberToken_1 = PascalNumberToken_1_1;
            },
            function (PascalStringToken_1_1) {
                PascalStringToken_1 = PascalStringToken_1_1;
            },
            function (PascalErrorToken_1_1) {
                PascalErrorToken_1 = PascalErrorToken_1_1;
            },
            function (PascalSpecialSymbolToken_1_1) {
                PascalSpecialSymbolToken_1 = PascalSpecialSymbolToken_1_1;
            },
            function (Util_3_1) {
                Util_3 = Util_3_1;
            }],
        execute: function() {
            PascalScanner = (function (_super) {
                __extends(PascalScanner, _super);
                function PascalScanner(source) {
                    _super.call(this, source);
                }
                PascalScanner.prototype.extractToken = function () {
                    this.skipWhiteSpace();
                    var token;
                    var currentChar = this.currentChar();
                    if (currentChar === Source_2.Source.EOF) {
                        token = new EofToken_1.EofToken(this.source);
                    }
                    else if (Util_3.Util.isLetter(currentChar)) {
                        token = new PascalWordToken_1.PascalWordToken(this.source);
                    }
                    else if (Util_3.Util.isDigit(currentChar)) {
                        token = new PascalNumberToken_1.PascalNumberToken(this.source);
                    }
                    else if (currentChar === '\'') {
                        token = new PascalStringToken_1.PascalStringToken(this.source);
                    }
                    else if (PascalTokenType_6.PascalTokenType.SPECIAL_SYMBOLS
                        .containsKey(currentChar)) {
                        token = new PascalSpecialSymbolToken_1.PascalSpecialSymbolToken(this.source);
                    }
                    else {
                        token = new PascalErrorToken_1.PascalErrorToken(this.source, PascalErrorCode_4.PascalErrorCode.INVALID_CHARACTER, currentChar);
                        this.nextChar();
                    }
                    return token;
                };
                PascalScanner.prototype.skipWhiteSpace = function () {
                    var currentChar = this.currentChar();
                    while (currentChar === '\n' || currentChar === ' ' || currentChar === '\t' || (currentChar === '{')) {
                        if (currentChar === '{') {
                            do {
                                currentChar = this.nextChar();
                            } while ((currentChar !== '}') && (currentChar !== Source_2.Source.EOF));
                            if (currentChar === '}') {
                                currentChar = this.nextChar();
                            }
                        }
                        else {
                            currentChar = this.nextChar();
                        }
                    }
                };
                return PascalScanner;
            }(Scanner_1.Scanner));
            exports_37("PascalScanner", PascalScanner);
        }
    }
});
System.register("src/language/pascal/PascalErrorHandler", ["src/language/pascal/PascalErrorCode", "src/message/MessageType", "src/message/Message"], function(exports_38, context_38) {
    "use strict";
    var __moduleName = context_38 && context_38.id;
    var PascalErrorCode_5, MessageType_2, Message_2;
    var PascalErrorHandler;
    return {
        setters:[
            function (PascalErrorCode_5_1) {
                PascalErrorCode_5 = PascalErrorCode_5_1;
            },
            function (MessageType_2_1) {
                MessageType_2 = MessageType_2_1;
            },
            function (Message_2_1) {
                Message_2 = Message_2_1;
            }],
        execute: function() {
            PascalErrorHandler = (function () {
                function PascalErrorHandler() {
                }
                PascalErrorHandler.prototype.getErrorCount = function () {
                    return PascalErrorHandler.errorCount;
                };
                PascalErrorHandler.prototype.flag = function (token, errorCode, parser) {
                    parser.sendMessage(new Message_2.Message(MessageType_2.MessageType.SYNTAX_ERROR, [token.getLineNumber(),
                        token.getPosition(),
                        token.getText(),
                        errorCode.toString()]));
                    if (++PascalErrorHandler.errorCount > PascalErrorHandler.MAX_ERRORS) {
                        this.abortTranslation(PascalErrorCode_5.PascalErrorCode.TOO_MANY_ERRORS, parser);
                    }
                };
                PascalErrorHandler.prototype.abortTranslation = function (errorCode, parser) {
                    var fatalText = "FATAL ERROR: " + errorCode.toString();
                    parser.sendMessage(new Message_2.Message(MessageType_2.MessageType.SYNTAX_ERROR, [0,
                        0,
                        "",
                        fatalText]));
                };
                PascalErrorHandler.MAX_ERRORS = 25;
                PascalErrorHandler.errorCount = 0;
                return PascalErrorHandler;
            }());
            exports_38("PascalErrorHandler", PascalErrorHandler);
        }
    }
});
System.register("src/language/pascal/PascalParser", ["src/language/pascal/PascalErrorHandler", "src/language/pascal/PascalErrorCode", "src/frontend/Parser", "src/frontend/EofToken"], function(exports_39, context_39) {
    "use strict";
    var __moduleName = context_39 && context_39.id;
    var PascalErrorHandler_1, PascalErrorCode_6, Parser_1, EofToken_2;
    var PascalParser;
    return {
        setters:[
            function (PascalErrorHandler_1_1) {
                PascalErrorHandler_1 = PascalErrorHandler_1_1;
            },
            function (PascalErrorCode_6_1) {
                PascalErrorCode_6 = PascalErrorCode_6_1;
            },
            function (Parser_1_1) {
                Parser_1 = Parser_1_1;
            },
            function (EofToken_2_1) {
                EofToken_2 = EofToken_2_1;
            }],
        execute: function() {
            PascalParser = (function (_super) {
                __extends(PascalParser, _super);
                function PascalParser(param) {
                    if (param instanceof PascalParser) {
                        _super.call(this, param.getScanner());
                    }
                    else {
                        _super.call(this, param);
                    }
                }
                PascalParser.prototype.parse = function () {
                    var params = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        params[_i - 0] = arguments[_i];
                    }
                };
                PascalParser.prototype.getErrorCount = function () {
                    return PascalParser.errorHandler.getErrorCount();
                };
                PascalParser.prototype.synchronize = function (syncSet) {
                    var token = this.currentToken();
                    if (!syncSet.contains(token.getType())) {
                        PascalParser.errorHandler.flag(token, PascalErrorCode_6.PascalErrorCode.UNEXPECTED_TOKEN, this);
                        do {
                            token = this.nextToken();
                        } while (!(token instanceof EofToken_2.EofToken) &&
                            !syncSet.contains(token.getType()));
                    }
                    return token;
                };
                PascalParser.errorHandler = new PascalErrorHandler_1.PascalErrorHandler();
                return PascalParser;
            }(Parser_1.Parser));
            exports_39("PascalParser", PascalParser);
        }
    }
});
System.register("src/intermediate/ICodeNodeType", [], function(exports_40, context_40) {
    "use strict";
    var __moduleName = context_40 && context_40.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("src/intermediate/ICodeKey", [], function(exports_41, context_41) {
    "use strict";
    var __moduleName = context_41 && context_41.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("src/intermediate/ICodeNode", [], function(exports_42, context_42) {
    "use strict";
    var __moduleName = context_42 && context_42.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("src/intermediate/RoutineCode", [], function(exports_43, context_43) {
    "use strict";
    var __moduleName = context_43 && context_43.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("src/intermediate/symtabimpl/DefinitionImpl", [], function(exports_44, context_44) {
    "use strict";
    var __moduleName = context_44 && context_44.id;
    var DefinitionImpl;
    return {
        setters:[],
        execute: function() {
            DefinitionImpl = (function () {
                function DefinitionImpl(text) {
                    this.text = text;
                }
                DefinitionImpl.prototype.getText = function () {
                    return this.text.toLowerCase();
                };
                DefinitionImpl.prototype.toString = function () {
                    return this.getText();
                };
                DefinitionImpl.CONSTANT = new DefinitionImpl('CONSTANT');
                DefinitionImpl.ENUMERATION_CONSTANT = new DefinitionImpl('ENUMERATION_CONSTANT');
                DefinitionImpl.TYPE = new DefinitionImpl('TYPE');
                DefinitionImpl.VARIABLE = new DefinitionImpl('VARIABLE');
                DefinitionImpl.FIELD = new DefinitionImpl('FIELD');
                DefinitionImpl.VALUE_PARM = new DefinitionImpl('VALUE_PARM');
                DefinitionImpl.VAR_PARM = new DefinitionImpl('VAR_PARM');
                DefinitionImpl.PROGRAM_PARM = new DefinitionImpl('PROGRAM_PARM');
                DefinitionImpl.PROGRAM = new DefinitionImpl('PROGRAM');
                DefinitionImpl.PROCEDURE = new DefinitionImpl('PROCEDURE');
                DefinitionImpl.FUNCTION = new DefinitionImpl('FUNCTION');
                DefinitionImpl.UNDEFINED = new DefinitionImpl('UNDEFINED');
                return DefinitionImpl;
            }());
            exports_44("DefinitionImpl", DefinitionImpl);
        }
    }
});
System.register("src/intermediate/symtabimpl/RoutineCodeImpl", [], function(exports_45, context_45) {
    "use strict";
    var __moduleName = context_45 && context_45.id;
    var RoutineCodeImpl;
    return {
        setters:[],
        execute: function() {
            RoutineCodeImpl = (function () {
                function RoutineCodeImpl(text) {
                    text = text || this.toString().toLowerCase();
                }
                RoutineCodeImpl.prototype.getText = function () {
                    return this.text;
                };
                RoutineCodeImpl.DECLARED = new RoutineCodeImpl('DECLARED');
                RoutineCodeImpl.FORWARD = new RoutineCodeImpl('FORWARD');
                RoutineCodeImpl.READ = new RoutineCodeImpl('READ');
                RoutineCodeImpl.READLN = new RoutineCodeImpl('READLN');
                RoutineCodeImpl.WRITE = new RoutineCodeImpl('WRITE');
                RoutineCodeImpl.WRITELN = new RoutineCodeImpl('WRITELN');
                RoutineCodeImpl.ABS = new RoutineCodeImpl('ABS');
                RoutineCodeImpl.ARCTAN = new RoutineCodeImpl('ARCTAN');
                RoutineCodeImpl.CHR = new RoutineCodeImpl('CHR');
                RoutineCodeImpl.COS = new RoutineCodeImpl('COS');
                RoutineCodeImpl.EOF = new RoutineCodeImpl('EOF');
                RoutineCodeImpl.EOLN = new RoutineCodeImpl('EOLN');
                RoutineCodeImpl.EXP = new RoutineCodeImpl('EXP');
                RoutineCodeImpl.LN = new RoutineCodeImpl('LN');
                RoutineCodeImpl.ODD = new RoutineCodeImpl('ODD');
                RoutineCodeImpl.ORD = new RoutineCodeImpl('ORD');
                RoutineCodeImpl.PRED = new RoutineCodeImpl('PRED');
                RoutineCodeImpl.ROUND = new RoutineCodeImpl('ROUND');
                RoutineCodeImpl.SIN = new RoutineCodeImpl('SIN');
                RoutineCodeImpl.SQR = new RoutineCodeImpl('SQR');
                RoutineCodeImpl.SQRT = new RoutineCodeImpl('SQRT');
                RoutineCodeImpl.SUCC = new RoutineCodeImpl('SUCC');
                RoutineCodeImpl.TRUNC = new RoutineCodeImpl('TRUNC');
                return RoutineCodeImpl;
            }());
            exports_45("RoutineCodeImpl", RoutineCodeImpl);
        }
    }
});
System.register("src/intermediate/symtabimpl/SymTabKeyImpl", ["src/util/PolyfillObject"], function(exports_46, context_46) {
    "use strict";
    var __moduleName = context_46 && context_46.id;
    var PolyfillObject_3;
    var SymTabKeyImpl;
    return {
        setters:[
            function (PolyfillObject_3_1) {
                PolyfillObject_3 = PolyfillObject_3_1;
            }],
        execute: function() {
            SymTabKeyImpl = (function (_super) {
                __extends(SymTabKeyImpl, _super);
                function SymTabKeyImpl(text) {
                    _super.call(this);
                    text = text || this.toString().toLowerCase();
                }
                SymTabKeyImpl.prototype.getText = function () {
                    return this.text;
                };
                SymTabKeyImpl.CONSTANT_VALUE = new SymTabKeyImpl('CONSTANT_VALUE');
                SymTabKeyImpl.ROUTINE_CODE = new SymTabKeyImpl('ROUTINE_CODE');
                SymTabKeyImpl.ROUTINE_SYMTAB = new SymTabKeyImpl('ROUTINE_SYMTAB');
                SymTabKeyImpl.ROUTINE_ICODE = new SymTabKeyImpl('ROUTINE_ICODE');
                SymTabKeyImpl.ROUTINE_PARMS = new SymTabKeyImpl('ROUTINE_PARMS');
                SymTabKeyImpl.ROUTINE_ROUTINES = new SymTabKeyImpl('ROUTINE_ROUTINES');
                SymTabKeyImpl.DATA_VALUE = new SymTabKeyImpl('DATA_VALUE');
                SymTabKeyImpl.SLOT = new SymTabKeyImpl('SLOT');
                SymTabKeyImpl.WRAP_SLOT = new SymTabKeyImpl('WRAP_SLOT');
                return SymTabKeyImpl;
            }(PolyfillObject_3.PolyfillObject));
            exports_46("SymTabKeyImpl", SymTabKeyImpl);
        }
    }
});
System.register("src/intermediate/typeimpl/TypeFormImpl", ["src/util/PolyfillObject"], function(exports_47, context_47) {
    "use strict";
    var __moduleName = context_47 && context_47.id;
    var PolyfillObject_4;
    var TypeFormImpl;
    return {
        setters:[
            function (PolyfillObject_4_1) {
                PolyfillObject_4 = PolyfillObject_4_1;
            }],
        execute: function() {
            TypeFormImpl = (function (_super) {
                __extends(TypeFormImpl, _super);
                function TypeFormImpl(text) {
                    _super.call(this);
                    this.text = text || this.toString().toLowerCase();
                }
                TypeFormImpl.prototype.getText = function () {
                    return this.text;
                };
                TypeFormImpl.prototype.toString = function () {
                    return this.getText().toLowerCase();
                };
                TypeFormImpl.SCALAR = new TypeFormImpl('SCALAR');
                TypeFormImpl.ENUMERATION = new TypeFormImpl('ENUMERATION');
                TypeFormImpl.SUBRANGE = new TypeFormImpl('SUBRANGE');
                TypeFormImpl.ARRAY = new TypeFormImpl('ARRAY');
                TypeFormImpl.RECORD = new TypeFormImpl('RECORD');
                return TypeFormImpl;
            }(PolyfillObject_4.PolyfillObject));
            exports_47("TypeFormImpl", TypeFormImpl);
        }
    }
});
System.register("src/intermediate/typeimpl/TypeKeyImpl", ["src/util/PolyfillObject"], function(exports_48, context_48) {
    "use strict";
    var __moduleName = context_48 && context_48.id;
    var PolyfillObject_5;
    var TypeKeyImpl;
    return {
        setters:[
            function (PolyfillObject_5_1) {
                PolyfillObject_5 = PolyfillObject_5_1;
            }],
        execute: function() {
            TypeKeyImpl = (function (_super) {
                __extends(TypeKeyImpl, _super);
                function TypeKeyImpl(text) {
                    _super.call(this);
                    text = text || this.toString().toLowerCase();
                }
                TypeKeyImpl.prototype.getText = function () {
                    return this.text;
                };
                TypeKeyImpl.prototype.toString = function () {
                    return this.toString().toLowerCase();
                };
                TypeKeyImpl.ENUMERATION_CONSTANTS = new TypeKeyImpl('ENUMERATION_CONSTANTS');
                TypeKeyImpl.SUBRANGE_BASE_TYPE = new TypeKeyImpl('SUBRANGE_BASE_TYPE');
                TypeKeyImpl.SUBRANGE_MIN_VALUE = new TypeKeyImpl('SUBRANGE_MIN_VALUE');
                TypeKeyImpl.SUBRANGE_MAX_VALUE = new TypeKeyImpl('SUBRANGE_MAX_VALUE');
                TypeKeyImpl.ARRAY_INDEX_TYPE = new TypeKeyImpl('ARRAY_INDEX_TYPE');
                TypeKeyImpl.ARRAY_ELEMENT_TYPE = new TypeKeyImpl('ARRAY_ELEMENT_TYPE');
                TypeKeyImpl.ARRAY_ELEMENT_COUNT = new TypeKeyImpl('ARRAY_ELEMENT_COUNT');
                TypeKeyImpl.RECORD_SYMTAB = new TypeKeyImpl('RECORD_SYMTAB');
                return TypeKeyImpl;
            }(PolyfillObject_5.PolyfillObject));
            exports_48("TypeKeyImpl", TypeKeyImpl);
        }
    }
});
System.register("src/intermediate/symtabimpl/Predefined", ["src/intermediate/TypeFactory", "src/intermediate/symtabimpl/DefinitionImpl", "src/intermediate/symtabimpl/RoutineCodeImpl", "src/intermediate/symtabimpl/SymTabKeyImpl", "src/intermediate/typeimpl/TypeFormImpl", "src/intermediate/typeimpl/TypeKeyImpl"], function(exports_49, context_49) {
    "use strict";
    var __moduleName = context_49 && context_49.id;
    var TypeFactory_1, DefinitionImpl_1, RoutineCodeImpl_1, SymTabKeyImpl_1, TypeFormImpl_1, TypeKeyImpl_1;
    var Predefined;
    return {
        setters:[
            function (TypeFactory_1_1) {
                TypeFactory_1 = TypeFactory_1_1;
            },
            function (DefinitionImpl_1_1) {
                DefinitionImpl_1 = DefinitionImpl_1_1;
            },
            function (RoutineCodeImpl_1_1) {
                RoutineCodeImpl_1 = RoutineCodeImpl_1_1;
            },
            function (SymTabKeyImpl_1_1) {
                SymTabKeyImpl_1 = SymTabKeyImpl_1_1;
            },
            function (TypeFormImpl_1_1) {
                TypeFormImpl_1 = TypeFormImpl_1_1;
            },
            function (TypeKeyImpl_1_1) {
                TypeKeyImpl_1 = TypeKeyImpl_1_1;
            }],
        execute: function() {
            Predefined = (function () {
                function Predefined() {
                }
                Predefined.initialize = function (symTabStack) {
                    this.initializeTypes(symTabStack);
                    this.initializeConstants(symTabStack);
                    this.initializeStandardRoutines(symTabStack);
                };
                Predefined.initializeTypes = function (symTabStack) {
                    this.integerId = symTabStack.enterLocal("integer");
                    this.integerType = TypeFactory_1.TypeFactory.createType(TypeFormImpl_1.TypeFormImpl.SCALAR);
                    this.integerType.setIdentifier(this.integerId);
                    this.integerId.setDefinition(DefinitionImpl_1.DefinitionImpl.TYPE);
                    this.integerId.setTypeSpec(this.integerType);
                    this.realId = symTabStack.enterLocal("real");
                    this.realType = TypeFactory_1.TypeFactory.createType(TypeFormImpl_1.TypeFormImpl.SCALAR);
                    this.realType.setIdentifier(this.realId);
                    this.realId.setDefinition(DefinitionImpl_1.DefinitionImpl.TYPE);
                    this.realId.setTypeSpec(this.realType);
                    this.booleanId = symTabStack.enterLocal("boolean");
                    this.booleanType = TypeFactory_1.TypeFactory.createType(TypeFormImpl_1.TypeFormImpl.ENUMERATION);
                    this.booleanType.setIdentifier(this.booleanId);
                    this.booleanId.setDefinition(DefinitionImpl_1.DefinitionImpl.TYPE);
                    this.booleanId.setTypeSpec(this.booleanType);
                    this.charId = symTabStack.enterLocal("char");
                    this.charType = TypeFactory_1.TypeFactory.createType(TypeFormImpl_1.TypeFormImpl.SCALAR);
                    this.charType.setIdentifier(this.charId);
                    this.charId.setDefinition(DefinitionImpl_1.DefinitionImpl.TYPE);
                    this.charId.setTypeSpec(this.charType);
                    this.undefinedType = TypeFactory_1.TypeFactory.createType(TypeFormImpl_1.TypeFormImpl.SCALAR);
                };
                Predefined.initializeConstants = function (symTabStack) {
                    this.falseId = symTabStack.enterLocal("false");
                    this.falseId.setDefinition(DefinitionImpl_1.DefinitionImpl.ENUMERATION_CONSTANT);
                    this.falseId.setTypeSpec(this.booleanType);
                    this.falseId.setAttribute(SymTabKeyImpl_1.SymTabKeyImpl.CONSTANT_VALUE, 0);
                    this.trueId = symTabStack.enterLocal("true");
                    this.trueId.setDefinition(DefinitionImpl_1.DefinitionImpl.ENUMERATION_CONSTANT);
                    this.trueId.setTypeSpec(this.booleanType);
                    this.trueId.setAttribute(SymTabKeyImpl_1.SymTabKeyImpl.CONSTANT_VALUE, 1);
                    var constants = [];
                    constants.push(this.falseId);
                    constants.push(this.trueId);
                    this.booleanType.setAttribute(TypeKeyImpl_1.TypeKeyImpl.ENUMERATION_CONSTANTS, constants);
                };
                Predefined.initializeStandardRoutines = function (symTabStack) {
                    this.readId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.PROCEDURE, "read", RoutineCodeImpl_1.RoutineCodeImpl.READ);
                    this.readlnId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.PROCEDURE, "readln", RoutineCodeImpl_1.RoutineCodeImpl.READLN);
                    this.writeId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.PROCEDURE, "write", RoutineCodeImpl_1.RoutineCodeImpl.WRITE);
                    this.writelnId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.PROCEDURE, "writeln", RoutineCodeImpl_1.RoutineCodeImpl.WRITELN);
                    this.absId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "abs", RoutineCodeImpl_1.RoutineCodeImpl.ABS);
                    this.arctanId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "arctan", RoutineCodeImpl_1.RoutineCodeImpl.ARCTAN);
                    this.chrId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "chr", RoutineCodeImpl_1.RoutineCodeImpl.CHR);
                    this.cosId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "cos", RoutineCodeImpl_1.RoutineCodeImpl.COS);
                    this.eofId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "eof", RoutineCodeImpl_1.RoutineCodeImpl.EOF);
                    this.eolnId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "eoln", RoutineCodeImpl_1.RoutineCodeImpl.EOLN);
                    this.expId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "exp", RoutineCodeImpl_1.RoutineCodeImpl.EXP);
                    this.lnId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "ln", RoutineCodeImpl_1.RoutineCodeImpl.LN);
                    this.oddId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "odd", RoutineCodeImpl_1.RoutineCodeImpl.ODD);
                    this.ordId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "ord", RoutineCodeImpl_1.RoutineCodeImpl.ORD);
                    this.predId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "pred", RoutineCodeImpl_1.RoutineCodeImpl.PRED);
                    this.roundId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "round", RoutineCodeImpl_1.RoutineCodeImpl.ROUND);
                    this.sinId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "sin", RoutineCodeImpl_1.RoutineCodeImpl.SIN);
                    this.sqrId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "sqr", RoutineCodeImpl_1.RoutineCodeImpl.SQR);
                    this.sqrtId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "sqrt", RoutineCodeImpl_1.RoutineCodeImpl.SQRT);
                    this.succId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "succ", RoutineCodeImpl_1.RoutineCodeImpl.SUCC);
                    this.truncId = this.enterStandard(symTabStack, DefinitionImpl_1.DefinitionImpl.FUNCTION, "trunc", RoutineCodeImpl_1.RoutineCodeImpl.TRUNC);
                };
                Predefined.enterStandard = function (symTabStack, defn, name, routineCode) {
                    var procId = symTabStack.enterLocal(name);
                    procId.setDefinition(defn);
                    procId.setAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_CODE, routineCode);
                    return procId;
                };
                return Predefined;
            }());
            exports_49("Predefined", Predefined);
        }
    }
});
System.register("src/intermediate/typeimpl/TypeSpecImpl", ["src/util/HashMap", "src/intermediate/symtabimpl/Predefined", "src/intermediate/typeimpl/TypeKeyImpl", "src/intermediate/typeimpl/TypeFormImpl"], function(exports_50, context_50) {
    "use strict";
    var __moduleName = context_50 && context_50.id;
    var HashMap_2, Predefined_1, TypeKeyImpl_2, TypeFormImpl_2;
    var TypeSpecImpl;
    return {
        setters:[
            function (HashMap_2_1) {
                HashMap_2 = HashMap_2_1;
            },
            function (Predefined_1_1) {
                Predefined_1 = Predefined_1_1;
            },
            function (TypeKeyImpl_2_1) {
                TypeKeyImpl_2 = TypeKeyImpl_2_1;
            },
            function (TypeFormImpl_2_1) {
                TypeFormImpl_2 = TypeFormImpl_2_1;
            }],
        execute: function() {
            TypeSpecImpl = (function (_super) {
                __extends(TypeSpecImpl, _super);
                function TypeSpecImpl(value) {
                    _super.call(this);
                    if (value instanceof TypeFormImpl_2.TypeFormImpl) {
                        this.formConstructor(value);
                    }
                    else if (typeof value === 'string' || value instanceof String) {
                        this.stringConstructor(value);
                    }
                    else {
                        throw "Type not covered";
                    }
                }
                TypeSpecImpl.prototype.formConstructor = function (form) {
                    this.form = form;
                    this.identifier = undefined;
                };
                TypeSpecImpl.prototype.stringConstructor = function (value) {
                    this.form = TypeFormImpl_2.TypeFormImpl.ARRAY;
                    var indexType = new TypeSpecImpl(TypeFormImpl_2.TypeFormImpl.SUBRANGE);
                    indexType.setAttribute(TypeKeyImpl_2.TypeKeyImpl.SUBRANGE_BASE_TYPE, Predefined_1.Predefined.integerType);
                    indexType.setAttribute(TypeKeyImpl_2.TypeKeyImpl.SUBRANGE_MIN_VALUE, 1);
                    indexType.setAttribute(TypeKeyImpl_2.TypeKeyImpl.SUBRANGE_MAX_VALUE, value.length);
                    this.setAttribute(TypeKeyImpl_2.TypeKeyImpl.ARRAY_INDEX_TYPE, indexType);
                    this.setAttribute(TypeKeyImpl_2.TypeKeyImpl.ARRAY_ELEMENT_TYPE, Predefined_1.Predefined.charType);
                    this.setAttribute(TypeKeyImpl_2.TypeKeyImpl.ARRAY_ELEMENT_COUNT, value.length);
                };
                TypeSpecImpl.prototype.getForm = function () {
                    return this.form;
                };
                TypeSpecImpl.prototype.setIdentifier = function (identifier) {
                    this.identifier = identifier;
                };
                TypeSpecImpl.prototype.getIdentifier = function () {
                    return this.identifier;
                };
                TypeSpecImpl.prototype.isPascalString = function () {
                    if (this.form === TypeFormImpl_2.TypeFormImpl.ARRAY) {
                        var elmtType = this.getAttribute(TypeKeyImpl_2.TypeKeyImpl.ARRAY_ELEMENT_TYPE);
                        var indexType = this.getAttribute(TypeKeyImpl_2.TypeKeyImpl.ARRAY_INDEX_TYPE);
                        return (elmtType.baseType() === Predefined_1.Predefined.charType) &&
                            (indexType.baseType() === Predefined_1.Predefined.integerType);
                    }
                    else {
                        return false;
                    }
                };
                TypeSpecImpl.prototype.baseType = function () {
                    return this.form === TypeFormImpl_2.TypeFormImpl.SUBRANGE ? this.getAttribute(TypeKeyImpl_2.TypeKeyImpl.SUBRANGE_BASE_TYPE)
                        : this;
                };
                TypeSpecImpl.prototype.toJson = function () {
                    return {
                        form: this.form.toString(),
                        indentifier: this.identifier ? this.identifier.getName() : undefined
                    };
                };
                return TypeSpecImpl;
            }(HashMap_2.HashMap));
            exports_50("TypeSpecImpl", TypeSpecImpl);
        }
    }
});
System.register("src/intermediate/TypeFactory", ["src/intermediate/typeimpl/TypeSpecImpl"], function(exports_51, context_51) {
    "use strict";
    var __moduleName = context_51 && context_51.id;
    var TypeSpecImpl_1;
    var TypeFactory;
    return {
        setters:[
            function (TypeSpecImpl_1_1) {
                TypeSpecImpl_1 = TypeSpecImpl_1_1;
            }],
        execute: function() {
            TypeFactory = (function () {
                function TypeFactory() {
                }
                TypeFactory.createType = function (form) {
                    return new TypeSpecImpl_1.TypeSpecImpl(form);
                };
                TypeFactory.createStringType = function (value) {
                    return new TypeSpecImpl_1.TypeSpecImpl(value);
                };
                return TypeFactory;
            }());
            exports_51("TypeFactory", TypeFactory);
        }
    }
});
System.register("src/intermediate/ICode", [], function(exports_52, context_52) {
    "use strict";
    var __moduleName = context_52 && context_52.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("src/intermediate/icodeimpl/ICodeImpl", [], function(exports_53, context_53) {
    "use strict";
    var __moduleName = context_53 && context_53.id;
    var ICodeImpl;
    return {
        setters:[],
        execute: function() {
            ICodeImpl = (function () {
                function ICodeImpl() {
                }
                ICodeImpl.prototype.setRoot = function (node) {
                    this.root = node;
                    return this.root;
                };
                ICodeImpl.prototype.getRoot = function () {
                    return this.root;
                };
                return ICodeImpl;
            }());
            exports_53("ICodeImpl", ICodeImpl);
        }
    }
});
System.register("src/intermediate/icodeimpl/ICodeNodeImpl", ["src/intermediate/ICodeFactory", "src/intermediate/SymTabEntry", "src/util/List", "src/util/HashMap", "src/util/PolyfillObject"], function(exports_54, context_54) {
    "use strict";
    var __moduleName = context_54 && context_54.id;
    var ICodeFactory_1, SymTabEntry_2, List_3, HashMap_3, PolyfillObject_6;
    var ICodeNodeImpl;
    return {
        setters:[
            function (ICodeFactory_1_1) {
                ICodeFactory_1 = ICodeFactory_1_1;
            },
            function (SymTabEntry_2_1) {
                SymTabEntry_2 = SymTabEntry_2_1;
            },
            function (List_3_1) {
                List_3 = List_3_1;
            },
            function (HashMap_3_1) {
                HashMap_3 = HashMap_3_1;
            },
            function (PolyfillObject_6_1) {
                PolyfillObject_6 = PolyfillObject_6_1;
            }],
        execute: function() {
            ICodeNodeImpl = (function (_super) {
                __extends(ICodeNodeImpl, _super);
                function ICodeNodeImpl(type) {
                    _super.call(this);
                    this.type = type;
                    this.parent = undefined;
                    this.children = new List_3.List();
                }
                ICodeNodeImpl.prototype.getType = function () {
                    return this.type;
                };
                ICodeNodeImpl.prototype.getParent = function () {
                    return this.parent;
                };
                ICodeNodeImpl.prototype.setTypeSpec = function (typeSpec) {
                    this.typeSpec = typeSpec;
                };
                ICodeNodeImpl.prototype.getTypeSpec = function () {
                    return this.typeSpec;
                };
                ICodeNodeImpl.prototype.addChild = function (node) {
                    if (node !== undefined) {
                        this.children.add(node);
                        node.parent = this;
                    }
                    return node;
                };
                ICodeNodeImpl.prototype.getChildren = function () {
                    return this.children;
                };
                ICodeNodeImpl.prototype.setAttribute = function (key, value) {
                    this.put(key, value);
                };
                ICodeNodeImpl.prototype.getAttribute = function (key) {
                    return this.get(key);
                };
                ICodeNodeImpl.prototype.copy = function () {
                    var copy;
                    copy = ICodeFactory_1.ICodeFactory.createICodeNode(this.type);
                    copy.setTypeSpec(this.typeSpec);
                    for (var key in this.getKeys()) {
                        copy.putKeyString(key, this.get[key]);
                    }
                    return copy;
                };
                ICodeNodeImpl.prototype.toString = function () {
                    return this.type.toString();
                };
                ICodeNodeImpl.prototype.toJson = function () {
                    var node = {
                        name: this.type.toString(),
                        typeSpec: this.typeSpec ? this.typeSpec.toJson() : undefined,
                        children: [],
                        attributes: {}
                    };
                    var keys = this.getKeys();
                    for (var i = 0; i < keys.length; ++i) {
                        var value = this.getKeyString(keys[i]);
                        var isSymTabEntry = value instanceof SymTabEntry_2.SymTabEntry;
                        var valueString = isSymTabEntry ? value.getName()
                            : value.toString();
                        var attribute = {};
                        node.attributes[PolyfillObject_6.PolyfillObject.getObject(keys[i]).toString().toLowerCase()]
                            = valueString;
                    }
                    for (var i = 0; i < this.children.size(); i++) {
                        node.children.push(this.children.get(i).toJson());
                    }
                    return node;
                };
                return ICodeNodeImpl;
            }(HashMap_3.HashMap));
            exports_54("ICodeNodeImpl", ICodeNodeImpl);
        }
    }
});
System.register("src/intermediate/ICodeFactory", ["src/intermediate/icodeimpl/ICodeImpl", "src/intermediate/icodeimpl/ICodeNodeImpl"], function(exports_55, context_55) {
    "use strict";
    var __moduleName = context_55 && context_55.id;
    var ICodeImpl_1, ICodeNodeImpl_1;
    var ICodeFactory;
    return {
        setters:[
            function (ICodeImpl_1_1) {
                ICodeImpl_1 = ICodeImpl_1_1;
            },
            function (ICodeNodeImpl_1_1) {
                ICodeNodeImpl_1 = ICodeNodeImpl_1_1;
            }],
        execute: function() {
            ICodeFactory = (function () {
                function ICodeFactory() {
                }
                ICodeFactory.createICode = function () {
                    return new ICodeImpl_1.ICodeImpl();
                };
                ICodeFactory.createICodeNode = function (type) {
                    return new ICodeNodeImpl_1.ICodeNodeImpl(type);
                };
                return ICodeFactory;
            }());
            exports_55("ICodeFactory", ICodeFactory);
        }
    }
});
System.register("src/intermediate/icodeimpl/ICodeKeyImpl", ["src/util/PolyfillObject"], function(exports_56, context_56) {
    "use strict";
    var __moduleName = context_56 && context_56.id;
    var PolyfillObject_7;
    var ICodeKeyImpl;
    return {
        setters:[
            function (PolyfillObject_7_1) {
                PolyfillObject_7 = PolyfillObject_7_1;
            }],
        execute: function() {
            ICodeKeyImpl = (function (_super) {
                __extends(ICodeKeyImpl, _super);
                function ICodeKeyImpl(text) {
                    _super.call(this);
                    this.text = text;
                }
                ICodeKeyImpl.prototype.toString = function () {
                    return this.text.toLowerCase();
                };
                ICodeKeyImpl.LINE = new ICodeKeyImpl('LINE');
                ICodeKeyImpl.ID = new ICodeKeyImpl('ID');
                ICodeKeyImpl.VALUE = new ICodeKeyImpl('VALUE');
                return ICodeKeyImpl;
            }(PolyfillObject_7.PolyfillObject));
            exports_56("ICodeKeyImpl", ICodeKeyImpl);
        }
    }
});
System.register("src/intermediate/icodeimpl/ICodeNodeTypeImpl", [], function(exports_57, context_57) {
    "use strict";
    var __moduleName = context_57 && context_57.id;
    var ICodeNodeTypeImpl;
    return {
        setters:[],
        execute: function() {
            ICodeNodeTypeImpl = (function () {
                function ICodeNodeTypeImpl(text) {
                    this.text = text;
                }
                ICodeNodeTypeImpl.prototype.toString = function () {
                    return this.text;
                };
                ICodeNodeTypeImpl.PROGRAM = new ICodeNodeTypeImpl('PROGRAM');
                ICodeNodeTypeImpl.PROCEDURE = new ICodeNodeTypeImpl('PROCEDURE');
                ICodeNodeTypeImpl.FUNCTION = new ICodeNodeTypeImpl('FUNCTION');
                ICodeNodeTypeImpl.COMPOUND = new ICodeNodeTypeImpl('COMPOUND');
                ICodeNodeTypeImpl.ASSIGN = new ICodeNodeTypeImpl('ASSIGN');
                ICodeNodeTypeImpl.LOOP = new ICodeNodeTypeImpl('LOOP');
                ICodeNodeTypeImpl.TEST = new ICodeNodeTypeImpl('TEST');
                ICodeNodeTypeImpl.CALL = new ICodeNodeTypeImpl('CALL');
                ICodeNodeTypeImpl.PARAMETERS = new ICodeNodeTypeImpl('PARAMETERS');
                ICodeNodeTypeImpl.IF = new ICodeNodeTypeImpl('IF');
                ICodeNodeTypeImpl.SELECT = new ICodeNodeTypeImpl('SELECT');
                ICodeNodeTypeImpl.SELECT_BRANCH = new ICodeNodeTypeImpl('SELECT_BRANCH');
                ICodeNodeTypeImpl.SELECT_CONSTANTS = new ICodeNodeTypeImpl('SELECT_CONSTANTS');
                ICodeNodeTypeImpl.NO_OP = new ICodeNodeTypeImpl('NO_OP');
                ICodeNodeTypeImpl.EQ = new ICodeNodeTypeImpl('EQ');
                ICodeNodeTypeImpl.NE = new ICodeNodeTypeImpl('NE');
                ICodeNodeTypeImpl.LT = new ICodeNodeTypeImpl('LT');
                ICodeNodeTypeImpl.LE = new ICodeNodeTypeImpl('LE');
                ICodeNodeTypeImpl.GT = new ICodeNodeTypeImpl('GT');
                ICodeNodeTypeImpl.GE = new ICodeNodeTypeImpl('GE');
                ICodeNodeTypeImpl.NOT = new ICodeNodeTypeImpl('NOT');
                ICodeNodeTypeImpl.ADD = new ICodeNodeTypeImpl('ADD');
                ICodeNodeTypeImpl.SUBTRACT = new ICodeNodeTypeImpl('SUBTRACT');
                ICodeNodeTypeImpl.OR = new ICodeNodeTypeImpl('OR');
                ICodeNodeTypeImpl.NEGATE = new ICodeNodeTypeImpl('NEGATE');
                ICodeNodeTypeImpl.MULTIPLY = new ICodeNodeTypeImpl('MULTIPLY');
                ICodeNodeTypeImpl.INTEGER_DIVIDE = new ICodeNodeTypeImpl('INTEGER_DIVIDE');
                ICodeNodeTypeImpl.FLOAT_DIVIDE = new ICodeNodeTypeImpl('FLOAT_DIVIDE');
                ICodeNodeTypeImpl.MOD = new ICodeNodeTypeImpl('MOD');
                ICodeNodeTypeImpl.AND = new ICodeNodeTypeImpl('AND');
                ICodeNodeTypeImpl.VARIABLE = new ICodeNodeTypeImpl('VARIABLE');
                ICodeNodeTypeImpl.SUBSCRIPTS = new ICodeNodeTypeImpl('SUBSCRIPTS');
                ICodeNodeTypeImpl.FIELD = new ICodeNodeTypeImpl('FIELD');
                ICodeNodeTypeImpl.INTEGER_CONSTANT = new ICodeNodeTypeImpl('INTEGER_CONSTANT');
                ICodeNodeTypeImpl.REAL_CONSTANT = new ICodeNodeTypeImpl('REAL_CONSTANT');
                ICodeNodeTypeImpl.STRING_CONSTANT = new ICodeNodeTypeImpl('STRING_CONSTANT');
                ICodeNodeTypeImpl.BOOLEAN_CONSTANT = new ICodeNodeTypeImpl('BOOLEAN_CONSTANT');
                ICodeNodeTypeImpl.WRITE_PARM = new ICodeNodeTypeImpl('WRITE_PARM');
                return ICodeNodeTypeImpl;
            }());
            exports_57("ICodeNodeTypeImpl", ICodeNodeTypeImpl);
        }
    }
});
System.register("src/intermediate/typeimpl/TypeChecker", ["src/intermediate/typeimpl/TypeFormImpl", "src/intermediate/symtabimpl/Predefined"], function(exports_58, context_58) {
    "use strict";
    var __moduleName = context_58 && context_58.id;
    var TypeFormImpl_3, Predefined_2;
    var TypeChecker;
    return {
        setters:[
            function (TypeFormImpl_3_1) {
                TypeFormImpl_3 = TypeFormImpl_3_1;
            },
            function (Predefined_2_1) {
                Predefined_2 = Predefined_2_1;
            }],
        execute: function() {
            TypeChecker = (function () {
                function TypeChecker() {
                }
                TypeChecker.isInteger = function (type) {
                    return (type !== undefined) && (type.baseType() === Predefined_2.Predefined.integerType);
                };
                TypeChecker.areBothInteger = function (type1, type2) {
                    return this.isInteger(type1) && this.isInteger(type2);
                };
                TypeChecker.isReal = function (type) {
                    return (type !== undefined) && (type.baseType() === Predefined_2.Predefined.realType);
                };
                TypeChecker.isIntegerOrReal = function (type) {
                    return this.isInteger(type) || this.isReal(type);
                };
                TypeChecker.isAtLeastOneReal = function (type1, type2) {
                    return (this.isReal(type1) && this.isReal(type2)) ||
                        (this.isReal(type1) && this.isInteger(type2)) ||
                        (this.isInteger(type1) && this.isReal(type2));
                };
                TypeChecker.isBoolean = function (type) {
                    return (type !== undefined) && (type.baseType() === Predefined_2.Predefined.booleanType);
                };
                TypeChecker.areBothBoolean = function (type1, type2) {
                    return this.isBoolean(type1) && this.isBoolean(type2);
                };
                TypeChecker.isChar = function (type) {
                    return (type !== undefined) && (type.baseType() === Predefined_2.Predefined.charType);
                };
                TypeChecker.areAssignmentCompatible = function (targetType, valueType) {
                    if ((targetType === undefined) || (valueType === undefined)) {
                        return false;
                    }
                    targetType = targetType.baseType();
                    valueType = valueType.baseType();
                    var compatible = false;
                    if (targetType === valueType) {
                        compatible = true;
                    }
                    else if (this.isReal(targetType) && this.isInteger(valueType)) {
                        compatible = true;
                    }
                    else {
                        compatible =
                            targetType.isPascalString() && valueType.isPascalString();
                    }
                    return compatible;
                };
                TypeChecker.areComparisonCompatible = function (type1, type2) {
                    if ((type1 === undefined) || (type2 === undefined)) {
                        return false;
                    }
                    type1 = type1.baseType();
                    type2 = type2.baseType();
                    var form = type1.getForm();
                    var compatible = false;
                    if ((type1 === type2) && ((form === TypeFormImpl_3.TypeFormImpl.SCALAR) || (form === TypeFormImpl_3.TypeFormImpl.ENUMERATION))) {
                        compatible = true;
                    }
                    else if (this.isAtLeastOneReal(type1, type2)) {
                        compatible = true;
                    }
                    else {
                        compatible = type1.isPascalString() && type2.isPascalString();
                    }
                    return compatible;
                };
                return TypeChecker;
            }());
            exports_58("TypeChecker", TypeChecker);
        }
    }
});
System.register("src/language/pascal/parsersBundle", ["src/language/pascal/PascalParser", "src/language/pascal/PascalTokenType", "src/language/pascal/PascalErrorCode", "src/frontend/Token", "src/frontend/EofToken", "src/intermediate/TypeFactory", "src/intermediate/symtabimpl/DefinitionImpl", "src/intermediate/symtabimpl/Predefined", "src/intermediate/symtabimpl/SymTabKeyImpl", "src/intermediate/symtabimpl/RoutineCodeImpl", "src/intermediate/ICodeFactory", "src/intermediate/icodeimpl/ICodeKeyImpl", "src/intermediate/icodeimpl/ICodeNodeTypeImpl", "src/intermediate/typeimpl/TypeKeyImpl", "src/intermediate/typeimpl/TypeFormImpl", "src/intermediate/typeimpl/TypeChecker", "src/util/HashMap", "src/util/List", "src/util/Util"], function(exports_59, context_59) {
    "use strict";
    var __moduleName = context_59 && context_59.id;
    var PascalParser_1, PascalTokenType_7, PascalErrorCode_7, Token_3, EofToken_3, TypeFactory_2, DefinitionImpl_2, Predefined_3, SymTabKeyImpl_2, RoutineCodeImpl_2, ICodeFactory_2, ICodeKeyImpl_1, ICodeNodeTypeImpl_1, TypeKeyImpl_3, TypeFormImpl_4, TypeChecker_1, HashMap_4, List_4, Util_4;
    var StatementParser, BlockParser, CompoundStatementParser, DeclarationsParser, ConstantDefinitionsParser, SimpleTypeParser, TypeSpecificationParser, TypeDefinitionsParser, ArrayTypeParser, DeclaredRoutineParser, EnumerationTypeParser, ProgramParser, RecordTypeParser, SubrangeTypeParser, VariableDeclarationsParser, ExpressionParser, AssignmentStatementParser, ForStatementParser, WhileStatementParser, IfStatementParser, CaseStatementParser, RepeatStatementParser, CallParser, CallDeclaredParser, CallStandardParser, VariableParser;
    return {
        setters:[
            function (PascalParser_1_1) {
                PascalParser_1 = PascalParser_1_1;
            },
            function (PascalTokenType_7_1) {
                PascalTokenType_7 = PascalTokenType_7_1;
            },
            function (PascalErrorCode_7_1) {
                PascalErrorCode_7 = PascalErrorCode_7_1;
            },
            function (Token_3_1) {
                Token_3 = Token_3_1;
            },
            function (EofToken_3_1) {
                EofToken_3 = EofToken_3_1;
            },
            function (TypeFactory_2_1) {
                TypeFactory_2 = TypeFactory_2_1;
            },
            function (DefinitionImpl_2_1) {
                DefinitionImpl_2 = DefinitionImpl_2_1;
            },
            function (Predefined_3_1) {
                Predefined_3 = Predefined_3_1;
            },
            function (SymTabKeyImpl_2_1) {
                SymTabKeyImpl_2 = SymTabKeyImpl_2_1;
            },
            function (RoutineCodeImpl_2_1) {
                RoutineCodeImpl_2 = RoutineCodeImpl_2_1;
            },
            function (ICodeFactory_2_1) {
                ICodeFactory_2 = ICodeFactory_2_1;
            },
            function (ICodeKeyImpl_1_1) {
                ICodeKeyImpl_1 = ICodeKeyImpl_1_1;
            },
            function (ICodeNodeTypeImpl_1_1) {
                ICodeNodeTypeImpl_1 = ICodeNodeTypeImpl_1_1;
            },
            function (TypeKeyImpl_3_1) {
                TypeKeyImpl_3 = TypeKeyImpl_3_1;
            },
            function (TypeFormImpl_4_1) {
                TypeFormImpl_4 = TypeFormImpl_4_1;
            },
            function (TypeChecker_1_1) {
                TypeChecker_1 = TypeChecker_1_1;
            },
            function (HashMap_4_1) {
                HashMap_4 = HashMap_4_1;
            },
            function (List_4_1) {
                List_4 = List_4_1;
            },
            function (Util_4_1) {
                Util_4 = Util_4_1;
            }],
        execute: function() {
            StatementParser = (function (_super) {
                __extends(StatementParser, _super);
                function StatementParser(parent) {
                    _super.call(this, parent);
                }
                StatementParser.prototype.parse = function (token) {
                    var statementNode = undefined;
                    switch (token.getType()) {
                        case PascalTokenType_7.PascalTokenType.BEGIN: {
                            var compoundParser = new CompoundStatementParser(this);
                            statementNode = compoundParser.parse(token);
                            break;
                        }
                        case PascalTokenType_7.PascalTokenType.IDENTIFIER: {
                            var name_1 = token.getText().toLowerCase();
                            var id = StatementParser.symTabStack.lookup(name_1);
                            var idDefn = id !== undefined ? id.getDefinition()
                                : DefinitionImpl_2.DefinitionImpl.UNDEFINED;
                            switch (idDefn) {
                                case DefinitionImpl_2.DefinitionImpl.VARIABLE:
                                case DefinitionImpl_2.DefinitionImpl.VALUE_PARM:
                                case DefinitionImpl_2.DefinitionImpl.VAR_PARM:
                                case DefinitionImpl_2.DefinitionImpl.UNDEFINED: {
                                    var assignmentParser = new AssignmentStatementParser(this);
                                    statementNode = assignmentParser.parse(token);
                                    break;
                                }
                                case DefinitionImpl_2.DefinitionImpl.FUNCTION: {
                                    var assignmentParser = new AssignmentStatementParser(this);
                                    statementNode =
                                        assignmentParser.parseFunctionNameAssignment(token);
                                    break;
                                }
                                case DefinitionImpl_2.DefinitionImpl.PROCEDURE: {
                                    var callParser = new CallParser(this);
                                    statementNode = callParser.parse(token);
                                    break;
                                }
                                default: {
                                    StatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.UNEXPECTED_TOKEN, this);
                                    token = this.nextToken();
                                }
                            }
                            break;
                        }
                        case PascalTokenType_7.PascalTokenType.REPEAT: {
                            var repeatParser = new RepeatStatementParser(this);
                            statementNode = repeatParser.parse(token);
                            break;
                        }
                        case PascalTokenType_7.PascalTokenType.WHILE: {
                            var whileParser = new WhileStatementParser(this);
                            statementNode = whileParser.parse(token);
                            break;
                        }
                        case PascalTokenType_7.PascalTokenType.FOR: {
                            var forParser = new ForStatementParser(this);
                            statementNode = forParser.parse(token);
                            break;
                        }
                        case PascalTokenType_7.PascalTokenType.IF: {
                            var ifParser = new IfStatementParser(this);
                            statementNode = ifParser.parse(token);
                            break;
                        }
                        case PascalTokenType_7.PascalTokenType.CASE: {
                            var caseParser = new CaseStatementParser(this);
                            statementNode = caseParser.parse(token);
                            break;
                        }
                        default: {
                            statementNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.NO_OP);
                            break;
                        }
                    }
                    this.setLineNumber(statementNode, token);
                    return statementNode;
                };
                StatementParser.prototype.setLineNumber = function (node, token) {
                    if (node !== undefined) {
                        node.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.LINE, token.getLineNumber());
                    }
                };
                StatementParser.prototype.parseList = function (token, parentNode, terminator, errorCode) {
                    var terminatorSet = StatementParser.STMT_START_SET.clone();
                    terminatorSet.add(terminator);
                    while (!(token instanceof EofToken_3.EofToken) &&
                        (token.getType() !== terminator)) {
                        var statementNode = this.parse(token);
                        parentNode.addChild(statementNode);
                        token = this.currentToken();
                        var tokenType = token.getType();
                        if (tokenType === PascalTokenType_7.PascalTokenType.SEMICOLON) {
                            token = this.nextToken();
                        }
                        else if (StatementParser.STMT_START_SET.contains(tokenType)) {
                            StatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_SEMICOLON, this);
                        }
                        token = this.synchronize(terminatorSet);
                    }
                    if (token.getType() === terminator) {
                        token = this.nextToken();
                    }
                    else {
                        StatementParser.errorHandler.flag(token, errorCode, this);
                    }
                };
                StatementParser.STMT_START_SET = new List_4.List([
                    PascalTokenType_7.PascalTokenType.BEGIN,
                    PascalTokenType_7.PascalTokenType.CASE,
                    PascalTokenType_7.PascalTokenType.FOR,
                    PascalTokenType_7.PascalTokenType.IF,
                    PascalTokenType_7.PascalTokenType.REPEAT,
                    PascalTokenType_7.PascalTokenType.WHILE,
                    PascalTokenType_7.PascalTokenType.IDENTIFIER,
                    PascalTokenType_7.PascalTokenType.SEMICOLON]);
                StatementParser.STMT_FOLLOW_SET = new List_4.List([
                    PascalTokenType_7.PascalTokenType.SEMICOLON,
                    PascalTokenType_7.PascalTokenType.END,
                    PascalTokenType_7.PascalTokenType.ELSE,
                    PascalTokenType_7.PascalTokenType.UNTIL,
                    PascalTokenType_7.PascalTokenType.DOT]);
                return StatementParser;
            }(PascalParser_1.PascalParser));
            exports_59("StatementParser", StatementParser);
            BlockParser = (function (_super) {
                __extends(BlockParser, _super);
                function BlockParser(parent) {
                    _super.call(this, parent);
                }
                BlockParser.prototype.parse = function (token, routineId) {
                    var declarationsParser = new DeclarationsParser(this);
                    var statementParser = new StatementParser(this);
                    declarationsParser.parse(token, routineId);
                    token = this.synchronize(StatementParser.STMT_START_SET);
                    var tokenType = token.getType();
                    var rootNode = undefined;
                    if (tokenType === PascalTokenType_7.PascalTokenType.BEGIN) {
                        rootNode = statementParser.parse(token);
                    }
                    else {
                        BlockParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_BEGIN, this);
                        if (StatementParser.STMT_START_SET.contains(tokenType)) {
                            rootNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.COMPOUND);
                            statementParser.parseList(token, rootNode, PascalTokenType_7.PascalTokenType.END, PascalErrorCode_7.PascalErrorCode.MISSING_END);
                        }
                    }
                    return rootNode;
                };
                return BlockParser;
            }(PascalParser_1.PascalParser));
            exports_59("BlockParser", BlockParser);
            CompoundStatementParser = (function (_super) {
                __extends(CompoundStatementParser, _super);
                function CompoundStatementParser(parent) {
                    _super.call(this, parent);
                }
                CompoundStatementParser.prototype.parse = function (token) {
                    token = this.nextToken();
                    var compoundNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.COMPOUND);
                    var statementParser = new StatementParser(this);
                    statementParser.parseList(token, compoundNode, PascalTokenType_7.PascalTokenType.END, PascalErrorCode_7.PascalErrorCode.MISSING_END);
                    return compoundNode;
                };
                return CompoundStatementParser;
            }(StatementParser));
            exports_59("CompoundStatementParser", CompoundStatementParser);
            DeclarationsParser = (function (_super) {
                __extends(DeclarationsParser, _super);
                function DeclarationsParser(parent) {
                    _super.call(this, parent);
                }
                DeclarationsParser.initialize = function () {
                    DeclarationsParser.TYPE_START_SET.remove(PascalTokenType_7.PascalTokenType.CONST);
                    DeclarationsParser.VAR_START_SET.remove(PascalTokenType_7.PascalTokenType.TYPE);
                    DeclarationsParser.ROUTINE_START_SET.remove(PascalTokenType_7.PascalTokenType.VAR);
                };
                DeclarationsParser.prototype.parse = function (token, parentId) {
                    token = this.synchronize(DeclarationsParser.DECLARATION_START_SET);
                    if (token.getType() === PascalTokenType_7.PascalTokenType.CONST) {
                        token = this.nextToken();
                        var constantDefinitionsParser = new ConstantDefinitionsParser(this);
                        constantDefinitionsParser.parse(token, undefined);
                    }
                    token = this.synchronize(DeclarationsParser.TYPE_START_SET);
                    if (token.getType() === PascalTokenType_7.PascalTokenType.TYPE) {
                        token = this.nextToken();
                        var typeDefinitionsParser = new TypeDefinitionsParser(this);
                        typeDefinitionsParser.parse(token, undefined);
                    }
                    token = this.synchronize(DeclarationsParser.VAR_START_SET);
                    if (token.getType() === PascalTokenType_7.PascalTokenType.VAR) {
                        token = this.nextToken();
                        var variableDeclarationsParser = new VariableDeclarationsParser(this);
                        variableDeclarationsParser.setDefinition(DefinitionImpl_2.DefinitionImpl.VARIABLE);
                        variableDeclarationsParser.parse(token, undefined);
                    }
                    token = this.synchronize(DeclarationsParser.ROUTINE_START_SET);
                    var tokenType = token.getType();
                    while ((tokenType === PascalTokenType_7.PascalTokenType.PROCEDURE) || (tokenType === DefinitionImpl_2.DefinitionImpl.FUNCTION)) {
                        var routineParser = new DeclaredRoutineParser(this);
                        routineParser.parse(token, parentId);
                        token = this.currentToken();
                        if (token.getType() === PascalTokenType_7.PascalTokenType.SEMICOLON) {
                            while (token.getType() === PascalTokenType_7.PascalTokenType.SEMICOLON) {
                                token = this.nextToken();
                            }
                        }
                        token = this.synchronize(DeclarationsParser.ROUTINE_START_SET);
                        tokenType = token.getType();
                    }
                    return undefined;
                };
                DeclarationsParser.DECLARATION_START_SET = new List_4.List([
                    PascalTokenType_7.PascalTokenType.CONST,
                    PascalTokenType_7.PascalTokenType.TYPE,
                    PascalTokenType_7.PascalTokenType.VAR,
                    PascalTokenType_7.PascalTokenType.PROCEDURE,
                    PascalTokenType_7.PascalTokenType.FUNCTION,
                    PascalTokenType_7.PascalTokenType.BEGIN]);
                DeclarationsParser.TYPE_START_SET = DeclarationsParser.DECLARATION_START_SET.clone();
                DeclarationsParser.VAR_START_SET = DeclarationsParser.TYPE_START_SET.clone();
                DeclarationsParser.ROUTINE_START_SET = DeclarationsParser.VAR_START_SET.clone();
                return DeclarationsParser;
            }(PascalParser_1.PascalParser));
            exports_59("DeclarationsParser", DeclarationsParser);
            DeclarationsParser.initialize();
            ConstantDefinitionsParser = (function (_super) {
                __extends(ConstantDefinitionsParser, _super);
                function ConstantDefinitionsParser(parent) {
                    _super.call(this, parent);
                }
                ConstantDefinitionsParser.initialize = function () {
                    ConstantDefinitionsParser.IDENTIFIER_SET.add(PascalTokenType_7.PascalTokenType.IDENTIFIER);
                    ConstantDefinitionsParser.EQUALS_SET.add(PascalTokenType_7.PascalTokenType.EQUALS);
                    ConstantDefinitionsParser.EQUALS_SET.add(PascalTokenType_7.PascalTokenType.SEMICOLON);
                    ConstantDefinitionsParser.NEXT_START_SET.add(PascalTokenType_7.PascalTokenType.SEMICOLON);
                    ConstantDefinitionsParser.NEXT_START_SET.add(PascalTokenType_7.PascalTokenType.IDENTIFIER);
                };
                ConstantDefinitionsParser.prototype.parse = function (token, parentId) {
                    token = this.synchronize(ConstantDefinitionsParser.IDENTIFIER_SET);
                    while (token.getType() === PascalTokenType_7.PascalTokenType.IDENTIFIER) {
                        var name_2 = token.getText().toLowerCase();
                        var constantId = ConstantDefinitionsParser.symTabStack.lookupLocal(name_2);
                        if (constantId === undefined) {
                            constantId = ConstantDefinitionsParser.symTabStack.enterLocal(name_2);
                            constantId.appendLineNumber(token.getLineNumber());
                        }
                        else {
                            ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.IDENTIFIER_REDEFINED, this);
                            constantId = undefined;
                        }
                        token = this.nextToken();
                        token = this.synchronize(ConstantDefinitionsParser.EQUALS_SET);
                        if (token.getType() === PascalTokenType_7.PascalTokenType.EQUALS) {
                            token = this.nextToken();
                        }
                        else {
                            ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_EQUALS, this);
                        }
                        var constantToken = token;
                        var value = this.parseConstant(token);
                        if (constantId !== undefined) {
                            constantId.setDefinition(DefinitionImpl_2.DefinitionImpl.CONSTANT);
                            constantId.setAttribute(SymTabKeyImpl_2.SymTabKeyImpl.CONSTANT_VALUE, value);
                            var constantType = constantToken.getType() === PascalTokenType_7.PascalTokenType.IDENTIFIER
                                ? this.getConstantType(constantToken)
                                : this.getConstantType(value);
                            constantId.setTypeSpec(constantType);
                        }
                        token = this.currentToken();
                        var tokenType = token.getType();
                        if (tokenType === PascalTokenType_7.PascalTokenType.SEMICOLON) {
                            while (token.getType() === PascalTokenType_7.PascalTokenType.SEMICOLON) {
                                token = this.nextToken();
                            }
                        }
                        else if (ConstantDefinitionsParser.NEXT_START_SET.contains(tokenType)) {
                            ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_SEMICOLON, this);
                        }
                        token = this.synchronize(ConstantDefinitionsParser.IDENTIFIER_SET);
                    }
                    return undefined;
                };
                ConstantDefinitionsParser.prototype.parseConstant = function (token) {
                    var sign = undefined;
                    token = this.synchronize(ConstantDefinitionsParser.CONSTANT_START_SET);
                    var tokenType = token.getType();
                    if ((tokenType === PascalTokenType_7.PascalTokenType.PLUS) || (tokenType === PascalTokenType_7.PascalTokenType.MINUS)) {
                        sign = tokenType;
                        token = this.nextToken();
                    }
                    switch (token.getType()) {
                        case PascalTokenType_7.PascalTokenType.IDENTIFIER: {
                            return this.parseIdentifierConstant(token, sign);
                        }
                        case PascalTokenType_7.PascalTokenType.INTEGER: {
                            var value = token.getValue();
                            this.nextToken();
                            return sign === PascalTokenType_7.PascalTokenType.MINUS ? -value : value;
                        }
                        case PascalTokenType_7.PascalTokenType.REAL: {
                            var value = token.getValue();
                            this.nextToken();
                            return sign === PascalTokenType_7.PascalTokenType.MINUS ? -value : value;
                        }
                        case PascalTokenType_7.PascalTokenType.STRING: {
                            if (sign !== undefined) {
                                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_CONSTANT, this);
                            }
                            this.nextToken();
                            return token.getValue();
                        }
                        default: {
                            ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_CONSTANT, this);
                            return undefined;
                        }
                    }
                };
                ConstantDefinitionsParser.prototype.parseIdentifierConstant = function (token, sign) {
                    var name = token.getText().toLowerCase();
                    var id = ConstantDefinitionsParser.symTabStack.lookup(name);
                    this.nextToken();
                    if (id === undefined) {
                        ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.IDENTIFIER_UNDEFINED, this);
                        return undefined;
                    }
                    var definition = id.getDefinition();
                    if (definition === DefinitionImpl_2.DefinitionImpl.CONSTANT) {
                        var value = id.getAttribute(SymTabKeyImpl_2.SymTabKeyImpl.CONSTANT_VALUE);
                        id.appendLineNumber(token.getLineNumber());
                        if (Util_4.Util.isInteger(value)) {
                            return sign === PascalTokenType_7.PascalTokenType.MINUS ? -value : value;
                        }
                        else if (Util_4.Util.isFloat(value)) {
                            return sign === PascalTokenType_7.PascalTokenType.MINUS ? -value : value;
                        }
                        else if (value instanceof String) {
                            if (sign !== undefined) {
                                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_CONSTANT, this);
                            }
                            return value;
                        }
                        else {
                            return undefined;
                        }
                    }
                    else if (definition === DefinitionImpl_2.DefinitionImpl.ENUMERATION_CONSTANT) {
                        var value = id.getAttribute(SymTabKeyImpl_2.SymTabKeyImpl.CONSTANT_VALUE);
                        id.appendLineNumber(token.getLineNumber());
                        if (sign !== undefined) {
                            ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_CONSTANT, this);
                        }
                        return value;
                    }
                    else if (definition === undefined) {
                        ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.NOT_CONSTANT_IDENTIFIER, this);
                        return undefined;
                    }
                    else {
                        ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_CONSTANT, this);
                        return undefined;
                    }
                };
                ConstantDefinitionsParser.prototype.getConstantType = function (object) {
                    if (object instanceof Token_3.Token) {
                        return this.getConstantTypeByToken(object);
                    }
                    else {
                        return this.getConstantTypeByObject(object);
                    }
                };
                ConstantDefinitionsParser.prototype.getConstantTypeByObject = function (value) {
                    var constantType = undefined;
                    if (Util_4.Util.isInteger(value)) {
                        constantType = Predefined_3.Predefined.integerType;
                    }
                    else if (Util_4.Util.isFloat(value)) {
                        constantType = Predefined_3.Predefined.realType;
                    }
                    else if (value instanceof String) {
                        if (value.length === 1) {
                            constantType = Predefined_3.Predefined.charType;
                        }
                        else {
                            constantType = TypeFactory_2.TypeFactory.createStringType(value);
                        }
                    }
                    return constantType;
                };
                ConstantDefinitionsParser.prototype.getConstantTypeByToken = function (identifier) {
                    var name = identifier.getText().toLowerCase();
                    var id = ConstantDefinitionsParser.symTabStack.lookup(name);
                    if (id === undefined) {
                        return undefined;
                    }
                    var definition = id.getDefinition();
                    if ((definition === DefinitionImpl_2.DefinitionImpl.CONSTANT) || (definition === DefinitionImpl_2.DefinitionImpl.ENUMERATION_CONSTANT)) {
                        return id.getTypeSpec();
                    }
                    else {
                        return undefined;
                    }
                };
                ConstantDefinitionsParser.IDENTIFIER_SET = DeclarationsParser.TYPE_START_SET.clone();
                ConstantDefinitionsParser.NEXT_START_SET = DeclarationsParser.TYPE_START_SET.clone();
                ConstantDefinitionsParser.CONSTANT_START_SET = new List_4.List([
                    PascalTokenType_7.PascalTokenType.IDENTIFIER,
                    PascalTokenType_7.PascalTokenType.INTEGER,
                    PascalTokenType_7.PascalTokenType.REAL,
                    PascalTokenType_7.PascalTokenType.PLUS,
                    PascalTokenType_7.PascalTokenType.MINUS,
                    PascalTokenType_7.PascalTokenType.STRING,
                    PascalTokenType_7.PascalTokenType.SEMICOLON]);
                ConstantDefinitionsParser.EQUALS_SET = ConstantDefinitionsParser.CONSTANT_START_SET.clone();
                return ConstantDefinitionsParser;
            }(DeclarationsParser));
            exports_59("ConstantDefinitionsParser", ConstantDefinitionsParser);
            ConstantDefinitionsParser.initialize();
            SimpleTypeParser = (function (_super) {
                __extends(SimpleTypeParser, _super);
                function SimpleTypeParser(parent) {
                    _super.call(this, parent);
                }
                SimpleTypeParser.initialize = function () {
                    SimpleTypeParser.SIMPLE_TYPE_START_SET.add(PascalTokenType_7.PascalTokenType.LEFT_PAREN);
                    SimpleTypeParser.SIMPLE_TYPE_START_SET.add(PascalTokenType_7.PascalTokenType.COMMA);
                    SimpleTypeParser.SIMPLE_TYPE_START_SET.add(PascalTokenType_7.PascalTokenType.SEMICOLON);
                };
                SimpleTypeParser.prototype.parse = function (token) {
                    token = this.synchronize(SimpleTypeParser.SIMPLE_TYPE_START_SET);
                    switch (token.getType()) {
                        case PascalTokenType_7.PascalTokenType.IDENTIFIER: {
                            var name_3 = token.getText().toLowerCase();
                            var id = SimpleTypeParser.symTabStack.lookup(name_3);
                            if (id !== undefined) {
                                var definition = id.getDefinition();
                                if (definition === DefinitionImpl_2.DefinitionImpl.TYPE) {
                                    id.appendLineNumber(token.getLineNumber());
                                    token = this.nextToken();
                                    return id.getTypeSpec();
                                }
                                else if ((definition !== DefinitionImpl_2.DefinitionImpl.CONSTANT) &&
                                    (definition !== DefinitionImpl_2.DefinitionImpl.ENUMERATION_CONSTANT)) {
                                    SimpleTypeParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.NOT_TYPE_IDENTIFIER, this);
                                    token = this.nextToken();
                                    return undefined;
                                }
                                else {
                                    var subrangeTypeParser = new SubrangeTypeParser(this);
                                    return subrangeTypeParser.parse(token);
                                }
                            }
                            else {
                                SimpleTypeParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.IDENTIFIER_UNDEFINED, this);
                                token = this.nextToken();
                                return undefined;
                            }
                        }
                        case PascalTokenType_7.PascalTokenType.LEFT_PAREN: {
                            var enumerationTypeParser = new EnumerationTypeParser(this);
                            return enumerationTypeParser.parse(token);
                        }
                        case PascalTokenType_7.PascalTokenType.COMMA:
                        case PascalTokenType_7.PascalTokenType.SEMICOLON: {
                            SimpleTypeParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_TYPE, this);
                            return undefined;
                        }
                        default: {
                            var subrangeTypeParser = new SubrangeTypeParser(this);
                            return subrangeTypeParser.parse(token);
                        }
                    }
                };
                SimpleTypeParser.SIMPLE_TYPE_START_SET = ConstantDefinitionsParser.CONSTANT_START_SET.clone();
                return SimpleTypeParser;
            }(PascalParser_1.PascalParser));
            exports_59("SimpleTypeParser", SimpleTypeParser);
            SimpleTypeParser.initialize();
            TypeSpecificationParser = (function (_super) {
                __extends(TypeSpecificationParser, _super);
                function TypeSpecificationParser(parent) {
                    _super.call(this, parent);
                }
                TypeSpecificationParser.initialize = function () {
                    TypeSpecificationParser.TYPE_START_SET.add(PascalTokenType_7.PascalTokenType.ARRAY);
                    TypeSpecificationParser.TYPE_START_SET.add(PascalTokenType_7.PascalTokenType.RECORD);
                    TypeSpecificationParser.TYPE_START_SET.add(PascalTokenType_7.PascalTokenType.SEMICOLON);
                };
                TypeSpecificationParser.prototype.parse = function (token) {
                    token = this.synchronize(TypeSpecificationParser.TYPE_START_SET);
                    switch (token.getType()) {
                        case PascalTokenType_7.PascalTokenType.ARRAY: {
                            var arrayTypeParser = new ArrayTypeParser(this);
                            return arrayTypeParser.parse(token);
                        }
                        case PascalTokenType_7.PascalTokenType.RECORD: {
                            var recordTypeParser = new RecordTypeParser(this);
                            return recordTypeParser.parse(token);
                        }
                        default: {
                            var simpleTypeParser = new SimpleTypeParser(this);
                            return simpleTypeParser.parse(token);
                        }
                    }
                };
                TypeSpecificationParser.TYPE_START_SET = SimpleTypeParser.SIMPLE_TYPE_START_SET.clone();
                return TypeSpecificationParser;
            }(PascalParser_1.PascalParser));
            exports_59("TypeSpecificationParser", TypeSpecificationParser);
            TypeSpecificationParser.initialize();
            TypeDefinitionsParser = (function (_super) {
                __extends(TypeDefinitionsParser, _super);
                function TypeDefinitionsParser(parent) {
                    _super.call(this, parent);
                }
                TypeDefinitionsParser.initialize = function () {
                    TypeDefinitionsParser.IDENTIFIER_SET.add(PascalTokenType_7.PascalTokenType.IDENTIFIER);
                    TypeDefinitionsParser.EQUALS_SET.add(PascalTokenType_7.PascalTokenType.EQUALS);
                    TypeDefinitionsParser.EQUALS_SET.add(PascalTokenType_7.PascalTokenType.SEMICOLON);
                    TypeDefinitionsParser.NEXT_START_SET.add(PascalTokenType_7.PascalTokenType.SEMICOLON);
                    TypeDefinitionsParser.NEXT_START_SET.add(PascalTokenType_7.PascalTokenType.IDENTIFIER);
                };
                TypeDefinitionsParser.prototype.parse = function (token, parentId) {
                    token = this.synchronize(TypeDefinitionsParser.IDENTIFIER_SET);
                    while (token.getType() === PascalTokenType_7.PascalTokenType.IDENTIFIER) {
                        var name_4 = token.getText().toLowerCase();
                        var typeId = TypeDefinitionsParser.symTabStack.lookupLocal(name_4);
                        if (typeId === undefined) {
                            typeId = TypeDefinitionsParser.symTabStack.enterLocal(name_4);
                            typeId.appendLineNumber(token.getLineNumber());
                        }
                        else {
                            TypeDefinitionsParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.IDENTIFIER_REDEFINED, this);
                            typeId = undefined;
                        }
                        token = this.nextToken();
                        token = this.synchronize(TypeDefinitionsParser.EQUALS_SET);
                        if (token.getType() === PascalTokenType_7.PascalTokenType.EQUALS) {
                            token = this.nextToken();
                        }
                        else {
                            TypeDefinitionsParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_EQUALS, this);
                        }
                        var typeSpecificationParser = new TypeSpecificationParser(this);
                        var type = typeSpecificationParser.parse(token);
                        if (typeId !== undefined) {
                            typeId.setDefinition(PascalTokenType_7.PascalTokenType.TYPE);
                        }
                        if ((type !== undefined) && (typeId !== undefined)) {
                            if (type.getIdentifier() === undefined) {
                                type.setIdentifier(typeId);
                            }
                            typeId.setTypeSpec(type);
                        }
                        else {
                            token = this.synchronize(TypeDefinitionsParser.FOLLOW_SET);
                        }
                        token = this.currentToken();
                        var tokenType = token.getType();
                        if (tokenType === PascalTokenType_7.PascalTokenType.SEMICOLON) {
                            while (token.getType() === PascalTokenType_7.PascalTokenType.SEMICOLON) {
                                token = this.nextToken();
                            }
                        }
                        else if (TypeDefinitionsParser.NEXT_START_SET.contains(tokenType)) {
                            TypeDefinitionsParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_SEMICOLON, this);
                        }
                        token = this.synchronize(TypeDefinitionsParser.IDENTIFIER_SET);
                    }
                    return undefined;
                };
                TypeDefinitionsParser.IDENTIFIER_SET = DeclarationsParser.VAR_START_SET.clone();
                TypeDefinitionsParser.EQUALS_SET = ConstantDefinitionsParser.CONSTANT_START_SET.clone();
                TypeDefinitionsParser.FOLLOW_SET = new List_4.List([PascalTokenType_7.PascalTokenType.SEMICOLON]);
                TypeDefinitionsParser.NEXT_START_SET = DeclarationsParser.VAR_START_SET.clone();
                return TypeDefinitionsParser;
            }(DeclarationsParser));
            exports_59("TypeDefinitionsParser", TypeDefinitionsParser);
            ArrayTypeParser = (function (_super) {
                __extends(ArrayTypeParser, _super);
                function ArrayTypeParser(parent) {
                    _super.call(this, parent);
                }
                ArrayTypeParser.initialize = function () {
                    ArrayTypeParser.LEFT_BRACKET_SET.add(PascalTokenType_7.PascalTokenType.LEFT_BRACKET);
                    ArrayTypeParser.LEFT_BRACKET_SET.add(PascalTokenType_7.PascalTokenType.RIGHT_BRACKET);
                    ArrayTypeParser.OF_SET.add(PascalTokenType_7.PascalTokenType.OF);
                    ArrayTypeParser.OF_SET.add(PascalTokenType_7.PascalTokenType.SEMICOLON);
                    ArrayTypeParser.INDEX_START_SET.add(PascalTokenType_7.PascalTokenType.COMMA);
                    ArrayTypeParser.INDEX_FOLLOW_SET.addAll(ArrayTypeParser.INDEX_END_SET);
                };
                ArrayTypeParser.prototype.parse = function (token) {
                    var arrayType = TypeFactory_2.TypeFactory.createType(PascalTokenType_7.PascalTokenType.ARRAY);
                    token = this.nextToken();
                    token = this.synchronize(ArrayTypeParser.LEFT_BRACKET_SET);
                    if (token.getType() !== PascalTokenType_7.PascalTokenType.LEFT_BRACKET) {
                        ArrayTypeParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_LEFT_BRACKET, this);
                    }
                    var elementType = this.parseIndexTypeList(token, arrayType);
                    token = this.synchronize(ArrayTypeParser.RIGHT_BRACKET_SET);
                    if (token.getType() === PascalTokenType_7.PascalTokenType.RIGHT_BRACKET) {
                        token = this.nextToken();
                    }
                    else {
                        ArrayTypeParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_RIGHT_BRACKET, this);
                    }
                    token = this.synchronize(ArrayTypeParser.OF_SET);
                    if (token.getType() === PascalTokenType_7.PascalTokenType.OF) {
                        token = this.nextToken();
                    }
                    else {
                        ArrayTypeParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_OF, this);
                    }
                    elementType.setAttribute(TypeKeyImpl_3.TypeKeyImpl.ARRAY_ELEMENT_TYPE, this.parseElementType(token));
                    return arrayType;
                };
                ArrayTypeParser.prototype.parseIndexTypeList = function (token, arrayType) {
                    var elementType = arrayType;
                    var anotherIndex = false;
                    token = this.nextToken();
                    do {
                        anotherIndex = false;
                        token = this.synchronize(ArrayTypeParser.INDEX_START_SET);
                        this.parseIndexType(token, elementType);
                        token = this.synchronize(ArrayTypeParser.INDEX_FOLLOW_SET);
                        var tokenType = token.getType();
                        if ((tokenType !== PascalTokenType_7.PascalTokenType.COMMA) && (tokenType !== PascalTokenType_7.PascalTokenType.RIGHT_BRACKET)) {
                            if (ArrayTypeParser.INDEX_START_SET.contains(tokenType)) {
                                ArrayTypeParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_COMMA, this);
                                anotherIndex = true;
                            }
                        }
                        else if (tokenType === PascalTokenType_7.PascalTokenType.COMMA) {
                            var newElementType = TypeFactory_2.TypeFactory.createType(PascalTokenType_7.PascalTokenType.ARRAY);
                            elementType.setAttribute(TypeKeyImpl_3.TypeKeyImpl.ARRAY_ELEMENT_TYPE, newElementType);
                            elementType = newElementType;
                            token = this.nextToken();
                            anotherIndex = true;
                        }
                    } while (anotherIndex);
                    return elementType;
                };
                ArrayTypeParser.prototype.parseIndexType = function (token, arrayType) {
                    var simpleTypeParser = new SimpleTypeParser(this);
                    var indexType = simpleTypeParser.parse(token);
                    arrayType.setAttribute(TypeKeyImpl_3.TypeKeyImpl.ARRAY_INDEX_TYPE, indexType);
                    if (indexType === undefined) {
                        return;
                    }
                    var form = indexType.getForm();
                    var count = 0;
                    if (form === TypeFormImpl_4.TypeFormImpl.SUBRANGE) {
                        var minValue = indexType.getAttribute(TypeKeyImpl_3.TypeKeyImpl.SUBRANGE_MIN_VALUE);
                        var maxValue = indexType.getAttribute(TypeKeyImpl_3.TypeKeyImpl.SUBRANGE_MAX_VALUE);
                        if ((minValue !== undefined) && (maxValue !== undefined)) {
                            count = maxValue - minValue + 1;
                        }
                    }
                    else if (form === TypeFormImpl_4.TypeFormImpl.ENUMERATION) {
                        var constants = indexType.getAttribute(TypeKeyImpl_3.TypeKeyImpl.ENUMERATION_CONSTANTS);
                        count = constants.size();
                    }
                    else {
                        ArrayTypeParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_INDEX_TYPE, this);
                    }
                    arrayType.setAttribute(TypeKeyImpl_3.TypeKeyImpl.ARRAY_ELEMENT_COUNT, count);
                };
                ArrayTypeParser.prototype.parseElementType = function (token) {
                    var typeSpecificationParser = new TypeSpecificationParser(this);
                    return typeSpecificationParser.parse(token);
                };
                ArrayTypeParser.LEFT_BRACKET_SET = SimpleTypeParser.SIMPLE_TYPE_START_SET.clone();
                ArrayTypeParser.RIGHT_BRACKET_SET = new List_4.List([
                    PascalTokenType_7.PascalTokenType.RIGHT_BRACKET,
                    PascalTokenType_7.PascalTokenType.OF,
                    PascalTokenType_7.PascalTokenType.SEMICOLON]);
                ArrayTypeParser.OF_SET = TypeSpecificationParser.TYPE_START_SET.clone();
                ArrayTypeParser.INDEX_START_SET = SimpleTypeParser.SIMPLE_TYPE_START_SET.clone();
                ArrayTypeParser.INDEX_END_SET = new List_4.List([
                    PascalTokenType_7.PascalTokenType.RIGHT_BRACKET,
                    PascalTokenType_7.PascalTokenType.OF,
                    PascalTokenType_7.PascalTokenType.SEMICOLON]);
                ArrayTypeParser.INDEX_FOLLOW_SET = ArrayTypeParser.INDEX_START_SET.clone();
                return ArrayTypeParser;
            }(TypeSpecificationParser));
            exports_59("ArrayTypeParser", ArrayTypeParser);
            (function (ArrayTypeParser) {
                ArrayTypeParser.initialize();
            })(ArrayTypeParser = ArrayTypeParser || (ArrayTypeParser = {}));
            exports_59("ArrayTypeParser", ArrayTypeParser);
            DeclaredRoutineParser = (function (_super) {
                __extends(DeclaredRoutineParser, _super);
                function DeclaredRoutineParser(parent) {
                    _super.call(this, parent);
                }
                DeclaredRoutineParser.initialize = function () {
                    DeclaredRoutineParser.PARAMETER_SET.add(PascalTokenType_7.PascalTokenType.VAR);
                    DeclaredRoutineParser.PARAMETER_SET.add(PascalTokenType_7.PascalTokenType.IDENTIFIER);
                    DeclaredRoutineParser.PARAMETER_SET.add(PascalTokenType_7.PascalTokenType.RIGHT_PAREN);
                    DeclaredRoutineParser.LEFT_PAREN_SET.add(PascalTokenType_7.PascalTokenType.LEFT_PAREN);
                    DeclaredRoutineParser.LEFT_PAREN_SET.add(PascalTokenType_7.PascalTokenType.SEMICOLON);
                    DeclaredRoutineParser.LEFT_PAREN_SET.add(PascalTokenType_7.PascalTokenType.COLON);
                    DeclaredRoutineParser.RIGHT_PAREN_SET.remove(PascalTokenType_7.PascalTokenType.LEFT_PAREN);
                    DeclaredRoutineParser.RIGHT_PAREN_SET.add(PascalTokenType_7.PascalTokenType.RIGHT_PAREN);
                    DeclaredRoutineParser.PARAMETER_FOLLOW_SET.addAll(DeclarationsParser.DECLARATION_START_SET);
                    DeclaredRoutineParser.COMMA_SET.addAll(DeclarationsParser.DECLARATION_START_SET);
                };
                DeclaredRoutineParser.prototype.parse = function (token, parentId) {
                    var routineDefn = undefined;
                    var dummyName = undefined;
                    var routineId = undefined;
                    var routineType = token.getType();
                    switch (routineType) {
                        case PascalTokenType_7.PascalTokenType.PROGRAM: {
                            token = this.nextToken();
                            routineDefn = DefinitionImpl_2.DefinitionImpl.PROGRAM;
                            dummyName = 'DummyProgramName'.toLowerCase();
                            break;
                        }
                        case PascalTokenType_7.PascalTokenType.PROCEDURE: {
                            token = this.nextToken();
                            routineDefn = DefinitionImpl_2.DefinitionImpl.PROCEDURE;
                            dummyName = 'DummyProcedureName_'.toLowerCase() +
                                console.info('%03d', ++DeclaredRoutineParser.dummyCounter);
                            break;
                        }
                        case PascalTokenType_7.PascalTokenType.FUNCTION: {
                            token = this.nextToken();
                            routineDefn = DefinitionImpl_2.DefinitionImpl.FUNCTION;
                            dummyName = 'DummyFunctionName_'.toLowerCase() +
                                console.info('%03d', ++DeclaredRoutineParser.dummyCounter);
                            break;
                        }
                        default: {
                            routineDefn = DefinitionImpl_2.DefinitionImpl.PROGRAM;
                            dummyName = 'DummyProgramName'.toLowerCase();
                            break;
                        }
                    }
                    routineId = this.parseRoutineName(token, dummyName);
                    routineId.setDefinition(routineDefn);
                    token = this.currentToken();
                    var iCode = ICodeFactory_2.ICodeFactory.createICode();
                    routineId.setAttribute(SymTabKeyImpl_2.SymTabKeyImpl.ROUTINE_ICODE, iCode);
                    routineId.setAttribute(SymTabKeyImpl_2.SymTabKeyImpl.ROUTINE_ROUTINES, new List_4.List());
                    if (routineId.getAttribute(SymTabKeyImpl_2.SymTabKeyImpl.ROUTINE_CODE) === RoutineCodeImpl_2.RoutineCodeImpl.FORWARD) {
                        var symTab = routineId.getAttribute(SymTabKeyImpl_2.SymTabKeyImpl.ROUTINE_SYMTAB);
                        DeclaredRoutineParser.symTabStack.push(symTab);
                    }
                    else {
                        routineId.setAttribute(SymTabKeyImpl_2.SymTabKeyImpl.ROUTINE_SYMTAB, DeclaredRoutineParser.symTabStack.push());
                    }
                    if (routineDefn === DefinitionImpl_2.DefinitionImpl.PROGRAM) {
                        DeclaredRoutineParser.symTabStack.setProgramId(routineId);
                        DeclaredRoutineParser.symTabStack.getLocalSymTab().nextSlotNumber();
                    }
                    else if (routineId.getAttribute(SymTabKeyImpl_2.SymTabKeyImpl.ROUTINE_CODE) !== RoutineCodeImpl_2.RoutineCodeImpl.FORWARD) {
                        var subroutines = parentId.getAttribute(SymTabKeyImpl_2.SymTabKeyImpl.ROUTINE_ROUTINES);
                        subroutines.add(routineId);
                    }
                    if (routineId.getAttribute(SymTabKeyImpl_2.SymTabKeyImpl.ROUTINE_CODE) === RoutineCodeImpl_2.RoutineCodeImpl.FORWARD) {
                        if (token.getType() !== PascalTokenType_7.PascalTokenType.SEMICOLON) {
                            DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.ALREADY_FORWARDED, this);
                            this.parseHeader(token, routineId);
                        }
                    }
                    else {
                        this.parseHeader(token, routineId);
                    }
                    token = this.currentToken();
                    if (token.getType() === PascalTokenType_7.PascalTokenType.SEMICOLON) {
                        do {
                            token = this.nextToken();
                        } while (token.getType() === PascalTokenType_7.PascalTokenType.SEMICOLON);
                    }
                    else {
                        DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_SEMICOLON, this);
                    }
                    if ((token.getType() === PascalTokenType_7.PascalTokenType.IDENTIFIER) &&
                        (token.getText().toLowerCase() === 'forward')) {
                        token = this.nextToken();
                        routineId.setAttribute(SymTabKeyImpl_2.SymTabKeyImpl.ROUTINE_CODE, RoutineCodeImpl_2.RoutineCodeImpl.FORWARD);
                    }
                    else {
                        routineId.setAttribute(SymTabKeyImpl_2.SymTabKeyImpl.ROUTINE_CODE, RoutineCodeImpl_2.RoutineCodeImpl.DECLARED);
                        var blockParser = new BlockParser(this);
                        var rootNode = blockParser.parse(token, routineId);
                        iCode.setRoot(rootNode);
                    }
                    DeclaredRoutineParser.symTabStack.pop();
                    return routineId;
                };
                DeclaredRoutineParser.prototype.parseRoutineName = function (token, dummyName) {
                    var routineId = undefined;
                    if (token.getType() === PascalTokenType_7.PascalTokenType.IDENTIFIER) {
                        var routineName = token.getText().toLowerCase();
                        routineId = DeclaredRoutineParser.symTabStack.lookupLocal(routineName);
                        if (routineId === undefined) {
                            routineId = DeclaredRoutineParser.symTabStack.enterLocal(routineName);
                        }
                        else if (routineId.getAttribute(SymTabKeyImpl_2.SymTabKeyImpl.ROUTINE_CODE) !== RoutineCodeImpl_2.RoutineCodeImpl.FORWARD) {
                            routineId = undefined;
                            DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.IDENTIFIER_REDEFINED, this);
                        }
                        token = this.nextToken();
                    }
                    else {
                        DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_IDENTIFIER, this);
                    }
                    if (routineId === undefined) {
                        routineId = DeclaredRoutineParser.symTabStack.enterLocal(dummyName);
                    }
                    return routineId;
                };
                DeclaredRoutineParser.prototype.parseHeader = function (token, routineId) {
                    this.parseFormalParameters(token, routineId);
                    token = this.currentToken();
                    if (routineId.getDefinition() === DefinitionImpl_2.DefinitionImpl.FUNCTION) {
                        var variableDeclarationsParser = new VariableDeclarationsParser(this);
                        variableDeclarationsParser.setDefinition(DefinitionImpl_2.DefinitionImpl.FUNCTION);
                        var type = variableDeclarationsParser.parseTypeSpec(token);
                        token = this.currentToken();
                        if (type !== undefined) {
                            var form = type.getForm();
                            if ((form === TypeFormImpl_4.TypeFormImpl.ARRAY) ||
                                (form === TypeFormImpl_4.TypeFormImpl.RECORD)) {
                                DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_TYPE, this);
                            }
                        }
                        else {
                            type = Predefined_3.Predefined.undefinedType;
                        }
                        routineId.setTypeSpec(type);
                        token = this.currentToken();
                    }
                };
                DeclaredRoutineParser.prototype.parseFormalParameters = function (token, routineId) {
                    token = this.synchronize(DeclaredRoutineParser.LEFT_PAREN_SET);
                    if (token.getType() === PascalTokenType_7.PascalTokenType.LEFT_PAREN) {
                        token = this.nextToken();
                        var parms = new List_4.List();
                        token = this.synchronize(DeclaredRoutineParser.PARAMETER_SET);
                        var tokenType = token.getType();
                        while ((tokenType === PascalTokenType_7.PascalTokenType.IDENTIFIER) || (tokenType === PascalTokenType_7.PascalTokenType.VAR)) {
                            parms.addAll(this.parseParmSublist(token, routineId));
                            token = this.currentToken();
                            tokenType = token.getType();
                        }
                        if (token.getType() === PascalTokenType_7.PascalTokenType.RIGHT_PAREN) {
                            token = this.nextToken();
                        }
                        else {
                            DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_RIGHT_PAREN, this);
                        }
                        routineId.setAttribute(SymTabKeyImpl_2.SymTabKeyImpl.ROUTINE_PARMS, parms);
                    }
                };
                DeclaredRoutineParser.prototype.parseParmSublist = function (token, routineId) {
                    var isProgram = routineId.getDefinition() === DefinitionImpl_2.DefinitionImpl.PROGRAM;
                    var parmDefn = isProgram ? DefinitionImpl_2.DefinitionImpl.PROGRAM_PARM : undefined;
                    var tokenType = token.getType();
                    if (tokenType === PascalTokenType_7.PascalTokenType.VAR) {
                        if (!isProgram) {
                            parmDefn = DefinitionImpl_2.DefinitionImpl.VAR_PARM;
                        }
                        else {
                            DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_VAR_PARM, this);
                        }
                        token = this.nextToken();
                    }
                    else if (!isProgram) {
                        parmDefn = DefinitionImpl_2.DefinitionImpl.VALUE_PARM;
                    }
                    var variableDeclarationsParser = new VariableDeclarationsParser(this);
                    variableDeclarationsParser.setDefinition(parmDefn);
                    var sublist = variableDeclarationsParser.parseIdentifierSublist(token, DeclaredRoutineParser.PARAMETER_FOLLOW_SET, DeclaredRoutineParser.COMMA_SET);
                    token = this.currentToken();
                    tokenType = token.getType();
                    if (!isProgram) {
                        if (tokenType === PascalTokenType_7.PascalTokenType.SEMICOLON) {
                            while (token.getType() === PascalTokenType_7.PascalTokenType.SEMICOLON) {
                                token = this.nextToken();
                            }
                        }
                        else if (VariableDeclarationsParser.
                            NEXT_START_SET.contains(tokenType)) {
                            DeclaredRoutineParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_SEMICOLON, this);
                        }
                        token = this.synchronize(DeclaredRoutineParser.PARAMETER_SET);
                    }
                    return sublist;
                };
                DeclaredRoutineParser.PARAMETER_SET = DeclarationsParser.DECLARATION_START_SET.clone();
                DeclaredRoutineParser.LEFT_PAREN_SET = DeclarationsParser.DECLARATION_START_SET.clone();
                DeclaredRoutineParser.RIGHT_PAREN_SET = DeclaredRoutineParser.LEFT_PAREN_SET.clone();
                DeclaredRoutineParser.PARAMETER_FOLLOW_SET = new List_4.List([
                    PascalTokenType_7.PascalTokenType.COLON,
                    PascalTokenType_7.PascalTokenType.RIGHT_PAREN,
                    PascalTokenType_7.PascalTokenType.SEMICOLON]);
                DeclaredRoutineParser.COMMA_SET = new List_4.List([
                    PascalTokenType_7.PascalTokenType.COMMA,
                    PascalTokenType_7.PascalTokenType.COLON,
                    PascalTokenType_7.PascalTokenType.IDENTIFIER,
                    PascalTokenType_7.PascalTokenType.RIGHT_PAREN,
                    PascalTokenType_7.PascalTokenType.SEMICOLON]);
                DeclaredRoutineParser.dummyCounter = 0;
                return DeclaredRoutineParser;
            }(DeclarationsParser));
            exports_59("DeclaredRoutineParser", DeclaredRoutineParser);
            DeclaredRoutineParser.initialize();
            EnumerationTypeParser = (function (_super) {
                __extends(EnumerationTypeParser, _super);
                function EnumerationTypeParser(parent) {
                    _super.call(this, parent);
                }
                EnumerationTypeParser.initialize = function () {
                    EnumerationTypeParser.ENUM_DEFINITION_FOLLOW_SET.addAll(DeclarationsParser.VAR_START_SET);
                };
                EnumerationTypeParser.prototype.parse = function (token) {
                    var enumerationType = TypeFactory_2.TypeFactory.createType(TypeFormImpl_4.TypeFormImpl.ENUMERATION);
                    var value = -1;
                    var constants = new List_4.List();
                    token = this.nextToken();
                    do {
                        token = this.synchronize(EnumerationTypeParser.ENUM_CONSTANT_START_SET);
                        this.parseEnumerationIdentifier(token, ++value, enumerationType, constants);
                        token = this.currentToken();
                        var tokenType = token.getType();
                        if (tokenType === PascalTokenType_7.PascalTokenType.COMMA) {
                            token = this.nextToken();
                            if (EnumerationTypeParser.ENUM_DEFINITION_FOLLOW_SET.contains(token.getType())) {
                                EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_IDENTIFIER, this);
                            }
                        }
                        else if (EnumerationTypeParser.ENUM_CONSTANT_START_SET.contains(tokenType)) {
                            EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_COMMA, this);
                        }
                    } while (!EnumerationTypeParser.ENUM_DEFINITION_FOLLOW_SET.contains(token.getType()));
                    if (token.getType() === PascalTokenType_7.PascalTokenType.RIGHT_PAREN) {
                        token = this.nextToken();
                    }
                    else {
                        EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_RIGHT_PAREN, this);
                    }
                    enumerationType.setAttribute(TypeKeyImpl_3.TypeKeyImpl.ENUMERATION_CONSTANTS, constants);
                    return enumerationType;
                };
                EnumerationTypeParser.prototype.parseEnumerationIdentifier = function (token, value, enumerationType, constants) {
                    var tokenType = token.getType();
                    if (tokenType === PascalTokenType_7.PascalTokenType.IDENTIFIER) {
                        var name_5 = token.getText().toLowerCase();
                        var constantId = EnumerationTypeParser.symTabStack.lookupLocal(name_5);
                        if (constantId !== undefined) {
                            EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.IDENTIFIER_REDEFINED, this);
                        }
                        else {
                            constantId = EnumerationTypeParser.symTabStack.enterLocal(name_5);
                            constantId.setDefinition(DefinitionImpl_2.DefinitionImpl.ENUMERATION_CONSTANT);
                            constantId.setTypeSpec(enumerationType);
                            constantId.setAttribute(SymTabKeyImpl_2.SymTabKeyImpl.CONSTANT_VALUE, value);
                            constantId.appendLineNumber(token.getLineNumber());
                            constants.add(constantId);
                        }
                        token = this.nextToken();
                    }
                    else {
                        EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_IDENTIFIER, this);
                    }
                };
                EnumerationTypeParser.ENUM_CONSTANT_START_SET = new List_4.List([
                    PascalTokenType_7.PascalTokenType.IDENTIFIER,
                    PascalTokenType_7.PascalTokenType.COMMA]);
                EnumerationTypeParser.ENUM_DEFINITION_FOLLOW_SET = new List_4.List([
                    PascalTokenType_7.PascalTokenType.RIGHT_PAREN,
                    PascalTokenType_7.PascalTokenType.SEMICOLON]);
                return EnumerationTypeParser;
            }(TypeSpecificationParser));
            exports_59("EnumerationTypeParser", EnumerationTypeParser);
            (function (EnumerationTypeParser) {
                EnumerationTypeParser.initialize();
            })(EnumerationTypeParser = EnumerationTypeParser || (EnumerationTypeParser = {}));
            exports_59("EnumerationTypeParser", EnumerationTypeParser);
            ProgramParser = (function (_super) {
                __extends(ProgramParser, _super);
                function ProgramParser(parent) {
                    _super.call(this, parent);
                }
                ProgramParser.initialize = function () {
                    ProgramParser.PROGRAM_START_SET.addAll(DeclarationsParser.DECLARATION_START_SET);
                };
                ProgramParser.prototype.parse = function (token, parentId) {
                    token = this.synchronize(ProgramParser.PROGRAM_START_SET);
                    var routineParser = new DeclaredRoutineParser(this);
                    routineParser.parse(token, parentId);
                    token = this.currentToken();
                    if (token.getType() !== PascalTokenType_7.PascalTokenType.DOT) {
                        ProgramParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_PERIOD, this);
                    }
                    return undefined;
                };
                ProgramParser.PROGRAM_START_SET = new List_4.List([
                    PascalTokenType_7.PascalTokenType.PROGRAM,
                    PascalTokenType_7.PascalTokenType.SEMICOLON]);
                return ProgramParser;
            }(DeclarationsParser));
            exports_59("ProgramParser", ProgramParser);
            ProgramParser.initialize();
            RecordTypeParser = (function (_super) {
                __extends(RecordTypeParser, _super);
                function RecordTypeParser(parent) {
                    _super.call(this, parent);
                }
                RecordTypeParser.initialize = function () {
                    RecordTypeParser.END_SET.add(PascalTokenType_7.PascalTokenType.END);
                    RecordTypeParser.END_SET.add(PascalTokenType_7.PascalTokenType.SEMICOLON);
                };
                RecordTypeParser.prototype.parse = function (token) {
                    var recordType = TypeFactory_2.TypeFactory.createType(PascalTokenType_7.PascalTokenType.RECORD);
                    token = this.nextToken();
                    recordType.setAttribute(TypeKeyImpl_3.TypeKeyImpl.RECORD_SYMTAB, RecordTypeParser.symTabStack.push());
                    var variableDeclarationsParser = new VariableDeclarationsParser(this);
                    variableDeclarationsParser.setDefinition(DefinitionImpl_2.DefinitionImpl.FIELD);
                    variableDeclarationsParser.parse(token, undefined);
                    RecordTypeParser.symTabStack.pop();
                    token = this.synchronize(RecordTypeParser.END_SET);
                    if (token.getType() === PascalTokenType_7.PascalTokenType.END) {
                        token = this.nextToken();
                    }
                    else {
                        RecordTypeParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_END, this);
                    }
                    return recordType;
                };
                RecordTypeParser.END_SET = DeclarationsParser.VAR_START_SET.clone();
                return RecordTypeParser;
            }(TypeSpecificationParser));
            exports_59("RecordTypeParser", RecordTypeParser);
            (function (RecordTypeParser) {
                RecordTypeParser.initialize();
            })(RecordTypeParser = RecordTypeParser || (RecordTypeParser = {}));
            exports_59("RecordTypeParser", RecordTypeParser);
            SubrangeTypeParser = (function (_super) {
                __extends(SubrangeTypeParser, _super);
                function SubrangeTypeParser(parent) {
                    _super.call(this, parent);
                }
                SubrangeTypeParser.prototype.parse = function (token) {
                    var subrangeType = TypeFactory_2.TypeFactory.createType(TypeFormImpl_4.TypeFormImpl.SUBRANGE);
                    var minValue = undefined;
                    var maxValue = undefined;
                    var constantToken = token;
                    var constantParser = new ConstantDefinitionsParser(this);
                    minValue = constantParser.parseConstant(token);
                    var minType = constantToken.getType() === PascalTokenType_7.PascalTokenType.IDENTIFIER
                        ? constantParser.getConstantType(constantToken)
                        : constantParser.getConstantType(minValue);
                    minValue = this.checkValueType(constantToken, minValue, minType);
                    token = this.currentToken();
                    var sawDotDot = false;
                    if (token.getType() === PascalTokenType_7.PascalTokenType.DOT_DOT) {
                        token = this.nextToken();
                        sawDotDot = true;
                    }
                    var tokenType = token.getType();
                    if (ConstantDefinitionsParser.CONSTANT_START_SET.contains(tokenType)) {
                        if (!sawDotDot) {
                            SubrangeTypeParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_DOT_DOT, this);
                        }
                        token = this.synchronize(ConstantDefinitionsParser.CONSTANT_START_SET);
                        constantToken = token;
                        maxValue = constantParser.parseConstant(token);
                        var maxType = constantToken.getType() === PascalTokenType_7.PascalTokenType.IDENTIFIER
                            ? constantParser.getConstantType(constantToken)
                            : constantParser.getConstantType(maxValue);
                        maxValue = this.checkValueType(constantToken, maxValue, maxType);
                        if ((minType === undefined) || (maxType === undefined)) {
                            SubrangeTypeParser.errorHandler.flag(constantToken, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                        }
                        else if (minType !== maxType) {
                            SubrangeTypeParser.errorHandler.flag(constantToken, PascalErrorCode_7.PascalErrorCode.INVALID_SUBRANGE_TYPE, this);
                        }
                        else if ((minValue !== undefined) && (maxValue !== undefined) &&
                            (Math.floor(minValue) >= Math.floor(maxValue))) {
                            SubrangeTypeParser.errorHandler.flag(constantToken, PascalErrorCode_7.PascalErrorCode.MIN_GT_MAX, this);
                        }
                    }
                    else {
                        SubrangeTypeParser.errorHandler.flag(constantToken, PascalErrorCode_7.PascalErrorCode.INVALID_SUBRANGE_TYPE, this);
                    }
                    subrangeType.setAttribute(TypeKeyImpl_3.TypeKeyImpl.SUBRANGE_BASE_TYPE, minType);
                    subrangeType.setAttribute(TypeKeyImpl_3.TypeKeyImpl.SUBRANGE_MIN_VALUE, minValue);
                    subrangeType.setAttribute(TypeKeyImpl_3.TypeKeyImpl.SUBRANGE_MAX_VALUE, maxValue);
                    return subrangeType;
                };
                SubrangeTypeParser.prototype.checkValueType = function (token, value, type) {
                    if (type === undefined) {
                        return value;
                    }
                    if (type === Predefined_3.Predefined.integerType) {
                        return value;
                    }
                    else if (type === Predefined_3.Predefined.charType) {
                        var ch = value.charAt(0);
                        return Number(ch);
                        ;
                    }
                    else if (type.getForm() === TypeFormImpl_4.TypeFormImpl.ENUMERATION) {
                        return value;
                    }
                    else {
                        SubrangeTypeParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_SUBRANGE_TYPE, this);
                        return value;
                    }
                };
                return SubrangeTypeParser;
            }(TypeSpecificationParser));
            exports_59("SubrangeTypeParser", SubrangeTypeParser);
            VariableDeclarationsParser = (function (_super) {
                __extends(VariableDeclarationsParser, _super);
                function VariableDeclarationsParser(parent) {
                    _super.call(this, parent);
                }
                VariableDeclarationsParser.initialize = function () {
                    VariableDeclarationsParser.IDENTIFIER_SET.add(PascalTokenType_7.PascalTokenType.IDENTIFIER);
                    VariableDeclarationsParser.IDENTIFIER_SET.add(PascalTokenType_7.PascalTokenType.END);
                    VariableDeclarationsParser.IDENTIFIER_SET.add(PascalTokenType_7.PascalTokenType.SEMICOLON);
                    VariableDeclarationsParser.IDENTIFIER_FOLLOW_SET.addAll(DeclarationsParser.VAR_START_SET);
                    VariableDeclarationsParser.NEXT_START_SET.add(PascalTokenType_7.PascalTokenType.IDENTIFIER);
                    VariableDeclarationsParser.NEXT_START_SET.add(PascalTokenType_7.PascalTokenType.SEMICOLON);
                };
                VariableDeclarationsParser.prototype.setDefinition = function (definition) {
                    this.definition = definition;
                };
                VariableDeclarationsParser.prototype.parse = function (token, parentId) {
                    token = this.synchronize(VariableDeclarationsParser.IDENTIFIER_SET);
                    while (token.getType() === PascalTokenType_7.PascalTokenType.IDENTIFIER) {
                        this.parseIdentifierSublist(token, VariableDeclarationsParser.IDENTIFIER_FOLLOW_SET, VariableDeclarationsParser.COMMA_SET);
                        token = this.currentToken();
                        var tokenType = token.getType();
                        if (tokenType === PascalTokenType_7.PascalTokenType.SEMICOLON) {
                            while (token.getType() === PascalTokenType_7.PascalTokenType.SEMICOLON) {
                                token = this.nextToken();
                            }
                        }
                        else if (VariableDeclarationsParser.NEXT_START_SET.contains(tokenType)) {
                            VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_SEMICOLON, this);
                        }
                        token = this.synchronize(VariableDeclarationsParser.IDENTIFIER_SET);
                    }
                    return undefined;
                };
                VariableDeclarationsParser.prototype.parseIdentifierSublist = function (token, followSet, commaSet) {
                    var sublist = new List_4.List();
                    do {
                        token = this.synchronize(VariableDeclarationsParser.IDENTIFIER_START_SET);
                        var id = this.parseIdentifier(token);
                        if (id !== undefined) {
                            sublist.add(id);
                        }
                        token = this.synchronize(commaSet);
                        var tokenType = token.getType();
                        if (tokenType === PascalTokenType_7.PascalTokenType.COMMA) {
                            token = this.nextToken();
                            if (followSet.contains(token.getType())) {
                                VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_IDENTIFIER, this);
                            }
                        }
                        else if (VariableDeclarationsParser.IDENTIFIER_START_SET.contains(tokenType)) {
                            VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_COMMA, this);
                        }
                    } while (!followSet.contains(token.getType()));
                    if (this.definition !== DefinitionImpl_2.DefinitionImpl.PROGRAM_PARM) {
                        var type = this.parseTypeSpec(token);
                        for (var i = 0; i < sublist.size(); i++) {
                            sublist.index(i).setTypeSpec(type);
                        }
                    }
                    return sublist;
                };
                VariableDeclarationsParser.prototype.parseIdentifier = function (token) {
                    var id = undefined;
                    if (token.getType() === PascalTokenType_7.PascalTokenType.IDENTIFIER) {
                        var name_6 = token.getText().toLowerCase();
                        id = VariableDeclarationsParser.symTabStack.lookupLocal(name_6);
                        if (id === undefined) {
                            id = VariableDeclarationsParser.symTabStack.enterLocal(name_6);
                            id.setDefinition(this.definition);
                            id.appendLineNumber(token.getLineNumber());
                            var slot = id.getSymTab().nextSlotNumber();
                            id.setAttribute(SymTabKeyImpl_2.SymTabKeyImpl.SLOT, slot);
                        }
                        else {
                            VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.IDENTIFIER_REDEFINED, this);
                        }
                        token = this.nextToken();
                    }
                    else {
                        VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_IDENTIFIER, this);
                    }
                    return id;
                };
                VariableDeclarationsParser.prototype.parseTypeSpec = function (token) {
                    token = this.synchronize(VariableDeclarationsParser.COLON_SET);
                    if (token.getType() === PascalTokenType_7.PascalTokenType.COLON) {
                        token = this.nextToken();
                    }
                    else {
                        VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_COLON, this);
                    }
                    var typeSpecificationParser = new TypeSpecificationParser(this);
                    var type = typeSpecificationParser.parse(token);
                    if ((this.definition !== DefinitionImpl_2.DefinitionImpl.VARIABLE) &&
                        (this.definition !== DefinitionImpl_2.DefinitionImpl.FIELD) &&
                        (type !== undefined) && (type.getIdentifier() === undefined)) {
                        VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_TYPE, this);
                    }
                    return type;
                };
                VariableDeclarationsParser.IDENTIFIER_SET = DeclarationsParser.VAR_START_SET.clone();
                VariableDeclarationsParser.IDENTIFIER_START_SET = new List_4.List([
                    PascalTokenType_7.PascalTokenType.IDENTIFIER,
                    PascalTokenType_7.PascalTokenType.COMMA]);
                VariableDeclarationsParser.IDENTIFIER_FOLLOW_SET = new List_4.List([
                    PascalTokenType_7.PascalTokenType.COLON,
                    PascalTokenType_7.PascalTokenType.SEMICOLON]);
                VariableDeclarationsParser.COMMA_SET = new List_4.List([
                    PascalTokenType_7.PascalTokenType.COMMA,
                    PascalTokenType_7.PascalTokenType.COLON,
                    PascalTokenType_7.PascalTokenType.IDENTIFIER,
                    PascalTokenType_7.PascalTokenType.SEMICOLON]);
                VariableDeclarationsParser.COLON_SET = new List_4.List([
                    PascalTokenType_7.PascalTokenType.COLON,
                    PascalTokenType_7.PascalTokenType.SEMICOLON]);
                VariableDeclarationsParser.NEXT_START_SET = DeclarationsParser.ROUTINE_START_SET.clone();
                return VariableDeclarationsParser;
            }(DeclarationsParser));
            exports_59("VariableDeclarationsParser", VariableDeclarationsParser);
            VariableDeclarationsParser.initialize();
            ExpressionParser = (function (_super) {
                __extends(ExpressionParser, _super);
                function ExpressionParser(parent) {
                    _super.call(this, parent);
                }
                ExpressionParser.initialize = function () {
                    ExpressionParser.REL_OPS_MAP.put(PascalTokenType_7.PascalTokenType.EQUALS, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.EQ);
                    ExpressionParser.REL_OPS_MAP.put(PascalTokenType_7.PascalTokenType.NOT_EQUALS, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.NE);
                    ExpressionParser.REL_OPS_MAP.put(PascalTokenType_7.PascalTokenType.LESS_THAN, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.LT);
                    ExpressionParser.REL_OPS_MAP.put(PascalTokenType_7.PascalTokenType.LESS_EQUALS, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.LE);
                    ExpressionParser.REL_OPS_MAP.put(PascalTokenType_7.PascalTokenType.GREATER_THAN, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.GT);
                    ExpressionParser.REL_OPS_MAP.put(PascalTokenType_7.PascalTokenType.GREATER_EQUALS, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.GE);
                    ExpressionParser.ADD_OPS_OPS_MAP.put(PascalTokenType_7.PascalTokenType.PLUS, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.ADD);
                    ExpressionParser.ADD_OPS_OPS_MAP.put(PascalTokenType_7.PascalTokenType.MINUS, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.SUBTRACT);
                    ExpressionParser.ADD_OPS_OPS_MAP.put(PascalTokenType_7.PascalTokenType.OR, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.OR);
                    ExpressionParser.MULT_OPS_OPS_MAP.put(PascalTokenType_7.PascalTokenType.STAR, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.MULTIPLY);
                    ExpressionParser.MULT_OPS_OPS_MAP.put(PascalTokenType_7.PascalTokenType.SLASH, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.FLOAT_DIVIDE);
                    ExpressionParser.MULT_OPS_OPS_MAP.put(PascalTokenType_7.PascalTokenType.DIV, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.INTEGER_DIVIDE);
                    ExpressionParser.MULT_OPS_OPS_MAP.put(PascalTokenType_7.PascalTokenType.MOD, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.MOD);
                    ExpressionParser.MULT_OPS_OPS_MAP.put(PascalTokenType_7.PascalTokenType.AND, ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.AND);
                };
                ;
                ExpressionParser.prototype.parse = function (token) {
                    return this.parseExpression(token);
                };
                ExpressionParser.prototype.parseExpression = function (token) {
                    var rootNode = this.parseSimpleExpression(token);
                    var resultType = rootNode !== undefined ? rootNode.getTypeSpec()
                        : Predefined_3.Predefined.undefinedType;
                    token = this.currentToken();
                    var tokenType = token.getType();
                    if (ExpressionParser.REL_OPS.contains(tokenType)) {
                        var nodeType = ExpressionParser.REL_OPS_MAP.get(tokenType);
                        var opNode = ICodeFactory_2.ICodeFactory.createICodeNode(nodeType);
                        opNode.addChild(rootNode);
                        token = this.nextToken();
                        var simExprNode = this.parseSimpleExpression(token);
                        opNode.addChild(simExprNode);
                        rootNode = opNode;
                        var simExprType = simExprNode !== undefined
                            ? simExprNode.getTypeSpec()
                            : Predefined_3.Predefined.undefinedType;
                        if (TypeChecker_1.TypeChecker.areComparisonCompatible(resultType, simExprType)) {
                            resultType = Predefined_3.Predefined.booleanType;
                        }
                        else {
                            ExpressionParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                            resultType = Predefined_3.Predefined.undefinedType;
                        }
                    }
                    if (rootNode !== undefined) {
                        rootNode.setTypeSpec(resultType);
                    }
                    return rootNode;
                };
                ExpressionParser.prototype.parseSimpleExpression = function (token) {
                    var signToken = undefined;
                    var signType = undefined;
                    var tokenType = token.getType();
                    if ((tokenType === PascalTokenType_7.PascalTokenType.PLUS) || (tokenType === PascalTokenType_7.PascalTokenType.MINUS)) {
                        signType = tokenType;
                        signToken = token;
                        token = this.nextToken();
                    }
                    var rootNode = this.parseTerm(token);
                    var resultType = rootNode !== undefined ? rootNode.getTypeSpec()
                        : Predefined_3.Predefined.undefinedType;
                    if ((signType !== undefined) && (!TypeChecker_1.TypeChecker.isIntegerOrReal(resultType))) {
                        ExpressionParser.errorHandler.flag(signToken, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }
                    if (signType === PascalTokenType_7.PascalTokenType.MINUS) {
                        var negateNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.NEGATE);
                        negateNode.addChild(rootNode);
                        negateNode.setTypeSpec(rootNode.getTypeSpec());
                        rootNode = negateNode;
                    }
                    token = this.currentToken();
                    tokenType = token.getType();
                    while (ExpressionParser.ADD_OPS.contains(tokenType)) {
                        var operator = tokenType;
                        var nodeType = ExpressionParser.ADD_OPS_OPS_MAP.get(operator);
                        var opNode = ICodeFactory_2.ICodeFactory.createICodeNode(nodeType);
                        opNode.addChild(rootNode);
                        token = this.nextToken();
                        var termNode = this.parseTerm(token);
                        opNode.addChild(termNode);
                        var termType = termNode !== undefined ? termNode.getTypeSpec()
                            : Predefined_3.Predefined.undefinedType;
                        rootNode = opNode;
                        switch (operator) {
                            case PascalTokenType_7.PascalTokenType.PLUS:
                            case PascalTokenType_7.PascalTokenType.MINUS: {
                                if (TypeChecker_1.TypeChecker.areBothInteger(resultType, termType)) {
                                    resultType = Predefined_3.Predefined.integerType;
                                }
                                else if (TypeChecker_1.TypeChecker.isAtLeastOneReal(resultType, termType)) {
                                    resultType = Predefined_3.Predefined.realType;
                                }
                                else {
                                    ExpressionParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                                }
                                break;
                            }
                            case PascalTokenType_7.PascalTokenType.OR: {
                                if (TypeChecker_1.TypeChecker.areBothBoolean(resultType, termType)) {
                                    resultType = Predefined_3.Predefined.booleanType;
                                }
                                else {
                                    ExpressionParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                                }
                                break;
                            }
                        }
                        rootNode.setTypeSpec(resultType);
                        token = this.currentToken();
                        tokenType = token.getType();
                    }
                    return rootNode;
                };
                ExpressionParser.prototype.parseTerm = function (token) {
                    var rootNode = this.parseFactor(token);
                    var resultType = rootNode !== undefined ? rootNode.getTypeSpec()
                        : Predefined_3.Predefined.undefinedType;
                    token = this.currentToken();
                    var tokenType = token.getType();
                    while (ExpressionParser.MULT_OPS.contains(tokenType)) {
                        var operator = tokenType;
                        var nodeType = ExpressionParser.MULT_OPS_OPS_MAP.get(operator);
                        var opNode = ICodeFactory_2.ICodeFactory.createICodeNode(nodeType);
                        opNode.addChild(rootNode);
                        token = this.nextToken();
                        var factorNode = this.parseFactor(token);
                        opNode.addChild(factorNode);
                        var factorType = factorNode !== undefined ? factorNode.getTypeSpec()
                            : Predefined_3.Predefined.undefinedType;
                        rootNode = opNode;
                        switch (operator) {
                            case PascalTokenType_7.PascalTokenType.STAR: {
                                if (TypeChecker_1.TypeChecker.areBothInteger(resultType, factorType)) {
                                    resultType = Predefined_3.Predefined.integerType;
                                }
                                else if (TypeChecker_1.TypeChecker.isAtLeastOneReal(resultType, factorType)) {
                                    resultType = Predefined_3.Predefined.realType;
                                }
                                else {
                                    ExpressionParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                                }
                                break;
                            }
                            case PascalTokenType_7.PascalTokenType.SLASH: {
                                if (TypeChecker_1.TypeChecker.areBothInteger(resultType, factorType) ||
                                    TypeChecker_1.TypeChecker.isAtLeastOneReal(resultType, factorType)) {
                                    resultType = Predefined_3.Predefined.realType;
                                }
                                else {
                                    ExpressionParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                                }
                                break;
                            }
                            case PascalTokenType_7.PascalTokenType.DIV:
                            case PascalTokenType_7.PascalTokenType.MOD: {
                                if (TypeChecker_1.TypeChecker.areBothInteger(resultType, factorType)) {
                                    resultType = Predefined_3.Predefined.integerType;
                                }
                                else {
                                    ExpressionParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                                }
                                break;
                            }
                            case PascalTokenType_7.PascalTokenType.AND: {
                                if (TypeChecker_1.TypeChecker.areBothBoolean(resultType, factorType)) {
                                    resultType = Predefined_3.Predefined.booleanType;
                                }
                                else {
                                    ExpressionParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                                }
                                break;
                            }
                        }
                        rootNode.setTypeSpec(resultType);
                        token = this.currentToken();
                        tokenType = token.getType();
                    }
                    return rootNode;
                };
                ExpressionParser.prototype.parseFactor = function (token) {
                    var tokenType = token.getType();
                    var rootNode = undefined;
                    switch (tokenType) {
                        case PascalTokenType_7.PascalTokenType.IDENTIFIER: {
                            return this.parseIdentifier(token);
                        }
                        case PascalTokenType_7.PascalTokenType.INTEGER: {
                            rootNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.INTEGER_CONSTANT);
                            rootNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, token.getValue());
                            token = this.nextToken();
                            rootNode.setTypeSpec(Predefined_3.Predefined.integerType);
                            break;
                        }
                        case PascalTokenType_7.PascalTokenType.REAL: {
                            rootNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.REAL_CONSTANT);
                            rootNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, token.getValue());
                            token = this.nextToken();
                            rootNode.setTypeSpec(Predefined_3.Predefined.realType);
                            break;
                        }
                        case PascalTokenType_7.PascalTokenType.STRING: {
                            var value = token.getValue();
                            rootNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.STRING_CONSTANT);
                            rootNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, value);
                            var resultType = value.length === 1
                                ? Predefined_3.Predefined.charType
                                : TypeFactory_2.TypeFactory.createStringType(value);
                            token = this.nextToken();
                            rootNode.setTypeSpec(resultType);
                            break;
                        }
                        case PascalTokenType_7.PascalTokenType.NOT: {
                            token = this.nextToken();
                            rootNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.NOT);
                            var factorNode = this.parseFactor(token);
                            rootNode.addChild(factorNode);
                            var factorType = factorNode !== undefined
                                ? factorNode.getTypeSpec()
                                : Predefined_3.Predefined.undefinedType;
                            if (!TypeChecker_1.TypeChecker.isBoolean(factorType)) {
                                ExpressionParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                            }
                            rootNode.setTypeSpec(Predefined_3.Predefined.booleanType);
                            break;
                        }
                        case PascalTokenType_7.PascalTokenType.LEFT_PAREN: {
                            token = this.nextToken();
                            rootNode = this.parseExpression(token);
                            var resultType = rootNode !== undefined
                                ? rootNode.getTypeSpec()
                                : Predefined_3.Predefined.undefinedType;
                            token = this.currentToken();
                            if (token.getType() === PascalTokenType_7.PascalTokenType.RIGHT_PAREN) {
                                token = this.nextToken();
                            }
                            else {
                                ExpressionParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_RIGHT_PAREN, this);
                            }
                            rootNode.setTypeSpec(resultType);
                            break;
                        }
                        default: {
                            ExpressionParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.UNEXPECTED_TOKEN, this);
                        }
                    }
                    return rootNode;
                };
                ExpressionParser.prototype.parseIdentifier = function (token) {
                    var rootNode = undefined;
                    var name = token.getText().toLowerCase();
                    var id = ExpressionParser.symTabStack.lookup(name);
                    if (id === undefined) {
                        ExpressionParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.IDENTIFIER_UNDEFINED, this);
                        id = ExpressionParser.symTabStack.enterLocal(name);
                        id.setDefinition(DefinitionImpl_2.DefinitionImpl.UNDEFINED);
                        id.setTypeSpec(Predefined_3.Predefined.undefinedType);
                    }
                    var defnCode = id.getDefinition();
                    switch (defnCode) {
                        case DefinitionImpl_2.DefinitionImpl.CONSTANT: {
                            var value = id.getAttribute(SymTabKeyImpl_2.SymTabKeyImpl.CONSTANT_VALUE);
                            var type = id.getTypeSpec();
                            if (Util_4.Util.isInteger(value)) {
                                rootNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.INTEGER_CONSTANT);
                                rootNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, value);
                            }
                            else if (Util_4.Util.isFloat(value)) {
                                rootNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.REAL_CONSTANT);
                                rootNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, value);
                            }
                            else if (value instanceof String) {
                                rootNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.STRING_CONSTANT);
                                rootNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, value);
                            }
                            id.appendLineNumber(token.getLineNumber());
                            token = this.nextToken();
                            if (rootNode !== undefined) {
                                rootNode.setTypeSpec(type);
                            }
                            break;
                        }
                        case DefinitionImpl_2.DefinitionImpl.ENUMERATION_CONSTANT: {
                            var value = id.getAttribute(SymTabKeyImpl_2.SymTabKeyImpl.CONSTANT_VALUE);
                            var type = id.getTypeSpec();
                            rootNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.INTEGER_CONSTANT);
                            rootNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, value);
                            id.appendLineNumber(token.getLineNumber());
                            token = this.nextToken();
                            rootNode.setTypeSpec(type);
                            break;
                        }
                        case DefinitionImpl_2.DefinitionImpl.FUNCTION: {
                            var callParser = new CallParser(this);
                            rootNode = callParser.parse(token);
                            break;
                        }
                        default: {
                            var variableParser = new VariableParser(this);
                            rootNode = variableParser.parse(token, id);
                            break;
                        }
                    }
                    return rootNode;
                };
                ExpressionParser.EXPR_START_SET = new List_4.List([
                    PascalTokenType_7.PascalTokenType.PLUS,
                    PascalTokenType_7.PascalTokenType.MINUS,
                    PascalTokenType_7.PascalTokenType.IDENTIFIER,
                    PascalTokenType_7.PascalTokenType.INTEGER,
                    PascalTokenType_7.PascalTokenType.REAL,
                    PascalTokenType_7.PascalTokenType.STRING,
                    PascalTokenType_7.PascalTokenType.NOT,
                    PascalTokenType_7.PascalTokenType.LEFT_PAREN]);
                ExpressionParser.REL_OPS = new List_4.List([
                    PascalTokenType_7.PascalTokenType.EQUALS,
                    PascalTokenType_7.PascalTokenType.NOT_EQUALS,
                    PascalTokenType_7.PascalTokenType.LESS_THAN,
                    PascalTokenType_7.PascalTokenType.LESS_EQUALS,
                    PascalTokenType_7.PascalTokenType.GREATER_THAN,
                    PascalTokenType_7.PascalTokenType.GREATER_EQUALS]);
                ExpressionParser.REL_OPS_MAP = new HashMap_4.HashMap();
                ExpressionParser.ADD_OPS = new List_4.List([
                    PascalTokenType_7.PascalTokenType.PLUS,
                    PascalTokenType_7.PascalTokenType.MINUS,
                    PascalTokenType_7.PascalTokenType.OR]);
                ExpressionParser.ADD_OPS_OPS_MAP = new HashMap_4.HashMap();
                ExpressionParser.MULT_OPS = new List_4.List([
                    PascalTokenType_7.PascalTokenType.STAR,
                    PascalTokenType_7.PascalTokenType.SLASH,
                    PascalTokenType_7.PascalTokenType.DIV,
                    PascalTokenType_7.PascalTokenType.MOD,
                    PascalTokenType_7.PascalTokenType.AND]);
                ExpressionParser.MULT_OPS_OPS_MAP = new HashMap_4.HashMap();
                return ExpressionParser;
            }(StatementParser));
            exports_59("ExpressionParser", ExpressionParser);
            ExpressionParser.initialize();
            AssignmentStatementParser = (function (_super) {
                __extends(AssignmentStatementParser, _super);
                function AssignmentStatementParser(parent) {
                    _super.call(this, parent);
                    this.isFunctionTarget = false;
                }
                AssignmentStatementParser.initialize = function () {
                    AssignmentStatementParser.COLON_EQUALS_SET.add(PascalTokenType_7.PascalTokenType.COLON_EQUALS);
                    AssignmentStatementParser.COLON_EQUALS_SET.addAll(StatementParser.STMT_FOLLOW_SET);
                };
                AssignmentStatementParser.prototype.parse = function (token) {
                    var assignNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.ASSIGN);
                    var variableParser = new VariableParser(this);
                    var targetNode = this.isFunctionTarget
                        ? variableParser.parseFunctionNameTarget(token)
                        : variableParser.parse(token);
                    var targetType = targetNode !== undefined ? targetNode.getTypeSpec()
                        : Predefined_3.Predefined.undefinedType;
                    assignNode.addChild(targetNode);
                    token = this.synchronize(AssignmentStatementParser.COLON_EQUALS_SET);
                    if (token.getType() === PascalTokenType_7.PascalTokenType.COLON_EQUALS) {
                        token = this.nextToken();
                    }
                    else {
                        AssignmentStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_COLON_EQUALS, this);
                    }
                    var expressionParser = new ExpressionParser(this);
                    var exprNode = expressionParser.parse(token);
                    assignNode.addChild(exprNode);
                    var exprType = exprNode !== undefined ? exprNode.getTypeSpec()
                        : Predefined_3.Predefined.undefinedType;
                    if (!TypeChecker_1.TypeChecker.areAssignmentCompatible(targetType, exprType)) {
                        AssignmentStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }
                    assignNode.setTypeSpec(targetType);
                    return assignNode;
                };
                AssignmentStatementParser.prototype.parseFunctionNameAssignment = function (token) {
                    this.isFunctionTarget = true;
                    return this.parse(token);
                };
                AssignmentStatementParser.COLON_EQUALS_SET = ExpressionParser.EXPR_START_SET.clone();
                return AssignmentStatementParser;
            }(StatementParser));
            exports_59("AssignmentStatementParser", AssignmentStatementParser);
            AssignmentStatementParser.initialize();
            ForStatementParser = (function (_super) {
                __extends(ForStatementParser, _super);
                function ForStatementParser(parent) {
                    _super.call(this, parent);
                }
                ForStatementParser.initialize = function () {
                    ForStatementParser.TO_DOWNTO_SET.add(PascalTokenType_7.PascalTokenType.TO);
                    ForStatementParser.TO_DOWNTO_SET.add(PascalTokenType_7.PascalTokenType.DOWNTO);
                    ForStatementParser.TO_DOWNTO_SET.addAll(StatementParser.STMT_FOLLOW_SET);
                    ForStatementParser.DO_SET.add(PascalTokenType_7.PascalTokenType.DO);
                    ForStatementParser.DO_SET.addAll(StatementParser.STMT_FOLLOW_SET);
                };
                ForStatementParser.prototype.parse = function (token) {
                    token = this.nextToken();
                    var targetToken = token;
                    var compoundNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.COMPOUND);
                    var loopNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.LOOP);
                    var testNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.TEST);
                    var assignmentParser = new AssignmentStatementParser(this);
                    var initAssignNode = assignmentParser.parse(token);
                    var controlType = initAssignNode !== undefined
                        ? initAssignNode.getTypeSpec()
                        : Predefined_3.Predefined.undefinedType;
                    this.setLineNumber(initAssignNode, targetToken);
                    if (!TypeChecker_1.TypeChecker.isInteger(controlType) &&
                        (controlType.getForm() !== TypeFormImpl_4.TypeFormImpl.ENUMERATION)) {
                        ForStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }
                    compoundNode.addChild(initAssignNode);
                    compoundNode.addChild(loopNode);
                    token = this.synchronize(ForStatementParser.TO_DOWNTO_SET);
                    var direction = token.getType();
                    if ((direction === PascalTokenType_7.PascalTokenType.TO) || (direction === PascalTokenType_7.PascalTokenType.DOWNTO)) {
                        token = this.nextToken();
                    }
                    else {
                        direction = PascalTokenType_7.PascalTokenType.TO;
                        ForStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_TO_DOWNTO, this);
                    }
                    var relOpNode = ICodeFactory_2.ICodeFactory.createICodeNode(direction === PascalTokenType_7.PascalTokenType.TO
                        ? ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.GT : ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.LT);
                    relOpNode.setTypeSpec(Predefined_3.Predefined.booleanType);
                    var controlVarNode = initAssignNode.getChildren().get(0);
                    relOpNode.addChild(controlVarNode.copy());
                    var expressionParser = new ExpressionParser(this);
                    var exprNode = expressionParser.parse(token);
                    relOpNode.addChild(exprNode);
                    var exprType = exprNode !== undefined ? exprNode.getTypeSpec()
                        : Predefined_3.Predefined.undefinedType;
                    if (!TypeChecker_1.TypeChecker.areAssignmentCompatible(controlType, exprType)) {
                        ForStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }
                    testNode.addChild(relOpNode);
                    loopNode.addChild(testNode);
                    token = this.synchronize(ForStatementParser.DO_SET);
                    if (token.getType() === PascalTokenType_7.PascalTokenType.DO) {
                        token = this.nextToken();
                    }
                    else {
                        ForStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_DO, this);
                    }
                    var statementParser = new StatementParser(this);
                    loopNode.addChild(statementParser.parse(token));
                    var nextAssignNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.ASSIGN);
                    nextAssignNode.setTypeSpec(controlType);
                    nextAssignNode.addChild(controlVarNode.copy());
                    var arithOpNode = ICodeFactory_2.ICodeFactory.createICodeNode(direction === PascalTokenType_7.PascalTokenType.TO
                        ? ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.ADD : ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.SUBTRACT);
                    arithOpNode.setTypeSpec(Predefined_3.Predefined.integerType);
                    arithOpNode.addChild(controlVarNode.copy());
                    var oneNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.INTEGER_CONSTANT);
                    oneNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, 1);
                    oneNode.setTypeSpec(Predefined_3.Predefined.integerType);
                    arithOpNode.addChild(oneNode);
                    nextAssignNode.addChild(arithOpNode);
                    loopNode.addChild(nextAssignNode);
                    this.setLineNumber(nextAssignNode, targetToken);
                    return compoundNode;
                };
                ForStatementParser.TO_DOWNTO_SET = ExpressionParser.EXPR_START_SET.clone();
                ForStatementParser.DO_SET = StatementParser.STMT_START_SET.clone();
                return ForStatementParser;
            }(StatementParser));
            exports_59("ForStatementParser", ForStatementParser);
            WhileStatementParser = (function (_super) {
                __extends(WhileStatementParser, _super);
                function WhileStatementParser(parent) {
                    _super.call(this, parent);
                }
                WhileStatementParser.initialize = function () {
                    WhileStatementParser.DO_SET.add(PascalTokenType_7.PascalTokenType.DO);
                    WhileStatementParser.DO_SET.addAll(StatementParser.STMT_FOLLOW_SET);
                };
                WhileStatementParser.prototype.parse = function (token) {
                    token = this.nextToken();
                    var loopNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.LOOP);
                    var breakNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.TEST);
                    var notNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.NOT);
                    loopNode.addChild(breakNode);
                    breakNode.addChild(notNode);
                    var expressionParser = new ExpressionParser(this);
                    var exprNode = expressionParser.parse(token);
                    notNode.addChild(exprNode);
                    var exprType = exprNode !== undefined ? exprNode.getTypeSpec()
                        : Predefined_3.Predefined.undefinedType;
                    if (!TypeChecker_1.TypeChecker.isBoolean(exprType)) {
                        WhileStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }
                    token = this.synchronize(WhileStatementParser.DO_SET);
                    if (token.getType() === PascalTokenType_7.PascalTokenType.DO) {
                        token = this.nextToken();
                    }
                    else {
                        WhileStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_DO, this);
                    }
                    var statementParser = new StatementParser(this);
                    loopNode.addChild(statementParser.parse(token));
                    return loopNode;
                };
                WhileStatementParser.DO_SET = StatementParser.STMT_START_SET.clone();
                return WhileStatementParser;
            }(StatementParser));
            exports_59("WhileStatementParser", WhileStatementParser);
            WhileStatementParser.initialize();
            IfStatementParser = (function (_super) {
                __extends(IfStatementParser, _super);
                function IfStatementParser(parent) {
                    _super.call(this, parent);
                }
                IfStatementParser.initialize = function () {
                    IfStatementParser.THEN_SET.add(PascalTokenType_7.PascalTokenType.THEN);
                    IfStatementParser.THEN_SET.addAll(StatementParser.STMT_FOLLOW_SET);
                };
                IfStatementParser.prototype.parse = function (token) {
                    token = this.nextToken();
                    var ifNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.IF);
                    var expressionParser = new ExpressionParser(this);
                    var exprNode = expressionParser.parse(token);
                    ifNode.addChild(exprNode);
                    var exprType = exprNode !== undefined ? exprNode.getTypeSpec()
                        : Predefined_3.Predefined.undefinedType;
                    if (!TypeChecker_1.TypeChecker.isBoolean(exprType)) {
                        IfStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }
                    token = this.synchronize(IfStatementParser.THEN_SET);
                    if (token.getType() === PascalTokenType_7.PascalTokenType.THEN) {
                        token = this.nextToken();
                    }
                    else {
                        IfStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_THEN, this);
                    }
                    var statementParser = new StatementParser(this);
                    ifNode.addChild(statementParser.parse(token));
                    token = this.currentToken();
                    if (token.getType() === PascalTokenType_7.PascalTokenType.ELSE) {
                        token = this.nextToken();
                        ifNode.addChild(statementParser.parse(token));
                    }
                    return ifNode;
                };
                IfStatementParser.THEN_SET = StatementParser.STMT_START_SET.clone();
                return IfStatementParser;
            }(StatementParser));
            exports_59("IfStatementParser", IfStatementParser);
            IfStatementParser.initialize();
            CaseStatementParser = (function (_super) {
                __extends(CaseStatementParser, _super);
                function CaseStatementParser(parent) {
                    _super.call(this, parent);
                }
                CaseStatementParser.initialize = function () {
                    CaseStatementParser.OF_SET.add(PascalTokenType_7.PascalTokenType.OF);
                    CaseStatementParser.OF_SET.addAll(StatementParser.STMT_FOLLOW_SET);
                    CaseStatementParser.COMMA_SET.add(PascalTokenType_7.PascalTokenType.COMMA);
                    CaseStatementParser.COMMA_SET.add(PascalTokenType_7.PascalTokenType.COLON);
                    CaseStatementParser.COMMA_SET.addAll(StatementParser.STMT_START_SET);
                    CaseStatementParser.COMMA_SET.addAll(StatementParser.STMT_FOLLOW_SET);
                };
                CaseStatementParser.prototype.parse = function (token) {
                    token = this.nextToken();
                    var selectNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.SELECT);
                    var expressionParser = new ExpressionParser(this);
                    var exprNode = expressionParser.parse(token);
                    selectNode.addChild(exprNode);
                    var exprType = exprNode !== undefined ? exprNode.getTypeSpec()
                        : Predefined_3.Predefined.undefinedType;
                    if (!TypeChecker_1.TypeChecker.isInteger(exprType) &&
                        !TypeChecker_1.TypeChecker.isChar(exprType) &&
                        (exprType.getForm() !== TypeFormImpl_4.TypeFormImpl.ENUMERATION)) {
                        CaseStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }
                    token = this.synchronize(CaseStatementParser.OF_SET);
                    if (token.getType() === PascalTokenType_7.PascalTokenType.OF) {
                        token = this.nextToken();
                    }
                    else {
                        CaseStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_OF, this);
                    }
                    var constantSet = new List_4.List();
                    while (!(token instanceof EofToken_3.EofToken) && (token.getType() !== PascalTokenType_7.PascalTokenType.END)) {
                        selectNode.addChild(this.parseBranch(token, exprType, constantSet));
                        token = this.currentToken();
                        var tokenType = token.getType();
                        if (tokenType === PascalTokenType_7.PascalTokenType.SEMICOLON) {
                            token = this.nextToken();
                        }
                        else if (CaseStatementParser.CONSTANT_START_SET.contains(tokenType)) {
                            CaseStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_SEMICOLON, this);
                        }
                    }
                    if (token.getType() === PascalTokenType_7.PascalTokenType.END) {
                        token = this.nextToken();
                    }
                    else {
                        CaseStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_END, this);
                    }
                    return selectNode;
                };
                CaseStatementParser.prototype.parseBranch = function (token, expressionType, constantSet) {
                    var branchNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.SELECT_BRANCH);
                    var constantsNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.SELECT_CONSTANTS);
                    branchNode.addChild(constantsNode);
                    this.parseConstantList(token, expressionType, constantsNode, constantSet);
                    token = this.currentToken();
                    if (token.getType() === PascalTokenType_7.PascalTokenType.COLON) {
                        token = this.nextToken();
                    }
                    else {
                        CaseStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_COLON, this);
                    }
                    var statementParser = new StatementParser(this);
                    branchNode.addChild(statementParser.parse(token));
                    return branchNode;
                };
                CaseStatementParser.prototype.parseConstantList = function (token, expressionType, constantsNode, constantSet) {
                    while (CaseStatementParser.CONSTANT_START_SET.contains(token.getType())) {
                        constantsNode.addChild(this.parseConstant(token, expressionType, constantSet));
                        token = this.synchronize(CaseStatementParser.COMMA_SET);
                        if (token.getType() === PascalTokenType_7.PascalTokenType.COMMA) {
                            token = this.nextToken();
                        }
                        else if (CaseStatementParser.CONSTANT_START_SET.contains(token.getType())) {
                            CaseStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_COMMA, this);
                        }
                    }
                };
                CaseStatementParser.prototype.parseConstant = function (token, expressionType, constantSet) {
                    var sign = undefined;
                    var constantNode = undefined;
                    var constantType = undefined;
                    token = this.synchronize(CaseStatementParser.CONSTANT_START_SET);
                    var tokenType = token.getType();
                    if ((tokenType === PascalTokenType_7.PascalTokenType.PLUS) || (tokenType === PascalTokenType_7.PascalTokenType.MINUS)) {
                        sign = tokenType;
                        token = this.nextToken();
                    }
                    switch (token.getType()) {
                        case PascalTokenType_7.PascalTokenType.IDENTIFIER: {
                            constantNode = this.parseIdentifierConstant(token, sign);
                            if (constantNode !== undefined) {
                                constantType = constantNode.getTypeSpec();
                            }
                            break;
                        }
                        case PascalTokenType_7.PascalTokenType.INTEGER: {
                            constantNode = this.parseIntegerConstant(token.getText(), sign);
                            constantType = Predefined_3.Predefined.integerType;
                            break;
                        }
                        case PascalTokenType_7.PascalTokenType.STRING: {
                            constantNode =
                                this.parseCharacterConstant(token, token.getValue(), sign);
                            constantType = Predefined_3.Predefined.charType;
                            break;
                        }
                        default: {
                            CaseStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_CONSTANT, this);
                            break;
                        }
                    }
                    if (constantNode !== undefined) {
                        var value = constantNode.getAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE);
                        if (constantSet.contains(value)) {
                            CaseStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.CASE_CONSTANT_REUSED, this);
                        }
                        else {
                            constantSet.add(value);
                        }
                    }
                    if (!TypeChecker_1.TypeChecker.areComparisonCompatible(expressionType, constantType)) {
                        CaseStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }
                    token = this.nextToken();
                    constantNode.setTypeSpec(constantType);
                    return constantNode;
                };
                CaseStatementParser.prototype.parseIdentifierConstant = function (token, sign) {
                    var constantNode = undefined;
                    var constantType = undefined;
                    var name = token.getText().toLowerCase();
                    var id = CaseStatementParser.symTabStack.lookup(name);
                    if (id === undefined) {
                        id = CaseStatementParser.symTabStack.enterLocal(name);
                        id.setDefinition(DefinitionImpl_2.DefinitionImpl.UNDEFINED);
                        id.setTypeSpec(Predefined_3.Predefined.undefinedType);
                        CaseStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.IDENTIFIER_UNDEFINED, this);
                        return undefined;
                    }
                    var defnCode = id.getDefinition();
                    if ((defnCode === DefinitionImpl_2.DefinitionImpl.CONSTANT) || (defnCode === DefinitionImpl_2.DefinitionImpl.ENUMERATION_CONSTANT)) {
                        var constantValue = id.getAttribute(SymTabKeyImpl_2.SymTabKeyImpl.CONSTANT_VALUE);
                        constantType = id.getTypeSpec();
                        if ((sign !== undefined) && !TypeChecker_1.TypeChecker.isInteger(constantType)) {
                            CaseStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_CONSTANT, this);
                        }
                        constantNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.INTEGER_CONSTANT);
                        constantNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, constantValue);
                    }
                    id.appendLineNumber(token.getLineNumber());
                    if (constantNode !== undefined) {
                        constantNode.setTypeSpec(constantType);
                    }
                    return constantNode;
                };
                CaseStatementParser.prototype.parseIntegerConstant = function (value, sign) {
                    var constantNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.INTEGER_CONSTANT);
                    var intValue = parseInt(value);
                    if (sign === PascalTokenType_7.PascalTokenType.MINUS) {
                        intValue = -intValue;
                    }
                    constantNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, intValue);
                    return constantNode;
                };
                CaseStatementParser.prototype.parseCharacterConstant = function (token, value, sign) {
                    var constantNode = undefined;
                    if (sign !== undefined) {
                        CaseStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_CONSTANT, this);
                    }
                    else {
                        if (value.length === 1) {
                            constantNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.STRING_CONSTANT);
                            constantNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.VALUE, value);
                        }
                        else {
                            CaseStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_CONSTANT, this);
                        }
                    }
                    return constantNode;
                };
                CaseStatementParser.CONSTANT_START_SET = new List_4.List([
                    PascalTokenType_7.PascalTokenType.IDENTIFIER,
                    PascalTokenType_7.PascalTokenType.INTEGER,
                    PascalTokenType_7.PascalTokenType.PLUS,
                    PascalTokenType_7.PascalTokenType.MINUS,
                    PascalTokenType_7.PascalTokenType.STRING]);
                CaseStatementParser.OF_SET = CaseStatementParser.CONSTANT_START_SET.clone();
                CaseStatementParser.COMMA_SET = CaseStatementParser.CONSTANT_START_SET.clone();
                return CaseStatementParser;
            }(StatementParser));
            exports_59("CaseStatementParser", CaseStatementParser);
            RepeatStatementParser = (function (_super) {
                __extends(RepeatStatementParser, _super);
                function RepeatStatementParser(parent) {
                    _super.call(this, parent);
                }
                RepeatStatementParser.prototype.parse = function (token) {
                    token = this.nextToken();
                    var loopNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.LOOP);
                    var testNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.TEST);
                    var statementParser = new StatementParser(this);
                    statementParser.parseList(token, loopNode, PascalTokenType_7.PascalTokenType.UNTIL, PascalErrorCode_7.PascalErrorCode.MISSING_UNTIL);
                    token = this.currentToken();
                    var expressionParser = new ExpressionParser(this);
                    var exprNode = expressionParser.parse(token);
                    testNode.addChild(exprNode);
                    loopNode.addChild(testNode);
                    var exprType = exprNode !== undefined ? exprNode.getTypeSpec()
                        : Predefined_3.Predefined.undefinedType;
                    if (!TypeChecker_1.TypeChecker.isBoolean(exprType)) {
                        RepeatStatementParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }
                    return loopNode;
                };
                return RepeatStatementParser;
            }(StatementParser));
            exports_59("RepeatStatementParser", RepeatStatementParser);
            CallParser = (function (_super) {
                __extends(CallParser, _super);
                function CallParser(parent) {
                    _super.call(this, parent);
                }
                CallParser.initialize = function () {
                    CallParser.COMMA_SET.add(PascalTokenType_7.PascalTokenType.COMMA);
                    CallParser.COMMA_SET.add(PascalTokenType_7.PascalTokenType.RIGHT_PAREN);
                };
                ;
                CallParser.prototype.parse = function (token) {
                    var pfId = CallParser.symTabStack.lookup(token.getText().toLowerCase());
                    var routineCode = pfId.getAttribute(SymTabKeyImpl_2.SymTabKeyImpl.ROUTINE_CODE);
                    var callParser = (routineCode === RoutineCodeImpl_2.RoutineCodeImpl.DECLARED) ||
                        (routineCode === RoutineCodeImpl_2.RoutineCodeImpl.FORWARD)
                        ? new CallDeclaredParser(this)
                        : new CallStandardParser(this);
                    return callParser.parse(token);
                };
                CallParser.prototype.parseActualParameters = function (token, pfId, isDeclared, isReadReadln, isWriteWriteln) {
                    var expressionParser = new ExpressionParser(this);
                    var parmsNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.PARAMETERS);
                    var formalParms = undefined;
                    var parmCount = 0;
                    var parmIndex = -1;
                    if (isDeclared) {
                        formalParms =
                            pfId.getAttribute(SymTabKeyImpl_2.SymTabKeyImpl.ROUTINE_PARMS);
                        parmCount = formalParms !== undefined ? formalParms.size() : 0;
                    }
                    if (token.getType() !== PascalTokenType_7.PascalTokenType.LEFT_PAREN) {
                        if (parmCount !== 0) {
                            CallParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.WRONG_NUMBER_OF_PARMS, this);
                        }
                        return undefined;
                    }
                    token = this.nextToken();
                    while (token.getType() !== PascalTokenType_7.PascalTokenType.RIGHT_PAREN) {
                        var actualNode = expressionParser.parse(token);
                        if (isDeclared) {
                            if (++parmIndex < parmCount) {
                                var formalId = formalParms.get(parmIndex);
                                this.checkActualParameter(token, formalId, actualNode);
                            }
                            else if (parmIndex === parmCount) {
                                CallParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.WRONG_NUMBER_OF_PARMS, this);
                            }
                        }
                        else if (isReadReadln) {
                            var type = actualNode.getTypeSpec();
                            var form = type.getForm();
                            if (!((actualNode.getType() === ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.VARIABLE)
                                && ((form === TypeFormImpl_4.TypeFormImpl.SCALAR) ||
                                    (type === Predefined_3.Predefined.booleanType) ||
                                    ((form === TypeFormImpl_4.TypeFormImpl.SUBRANGE) &&
                                        (type.baseType() === Predefined_3.Predefined.integerType))))) {
                                CallParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_VAR_PARM, this);
                            }
                        }
                        else if (isWriteWriteln) {
                            var exprNode = actualNode;
                            actualNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.WRITE_PARM);
                            actualNode.addChild(exprNode);
                            var type = exprNode.getTypeSpec().baseType();
                            var form = type.getForm();
                            if (!((form === TypeFormImpl_4.TypeFormImpl.SCALAR) || (type === Predefined_3.Predefined.booleanType) ||
                                (type.isPascalString()))) {
                                CallParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                            }
                            token = this.currentToken();
                            actualNode.addChild(this.parseWriteSpec(token));
                            token = this.currentToken();
                            actualNode.addChild(this.parseWriteSpec(token));
                        }
                        parmsNode.addChild(actualNode);
                        token = this.synchronize(CallParser.COMMA_SET);
                        var tokenType = token.getType();
                        if (tokenType === PascalTokenType_7.PascalTokenType.COMMA) {
                            token = this.nextToken();
                        }
                        else if (ExpressionParser.EXPR_START_SET.contains(tokenType)) {
                            CallParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_COMMA, this);
                        }
                        else if (tokenType !== PascalTokenType_7.PascalTokenType.RIGHT_PAREN) {
                            token = this.synchronize(ExpressionParser.EXPR_START_SET);
                        }
                    }
                    token = this.nextToken();
                    if ((parmsNode.getChildren().size() === 0) ||
                        (isDeclared && (parmIndex !== parmCount - 1))) {
                        CallParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.WRONG_NUMBER_OF_PARMS, this);
                    }
                    return parmsNode;
                };
                CallParser.prototype.checkActualParameter = function (token, formalId, actualNode) {
                    var formalDefn = formalId.getDefinition();
                    var formalType = formalId.getTypeSpec();
                    var actualType = actualNode.getTypeSpec();
                    if (formalDefn === DefinitionImpl_2.DefinitionImpl.VAR_PARM) {
                        if ((actualNode.getType() !== ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.VARIABLE) ||
                            (actualType !== formalType)) {
                            CallParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_VAR_PARM, this);
                        }
                    }
                    else if (!TypeChecker_1.TypeChecker.areAssignmentCompatible(formalType, actualType)) {
                        CallParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }
                };
                CallParser.prototype.parseWriteSpec = function (token) {
                    if (token.getType() === PascalTokenType_7.PascalTokenType.COLON) {
                        token = this.nextToken();
                        var expressionParser = new ExpressionParser(this);
                        var specNode = expressionParser.parse(token);
                        if (specNode.getType() === ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.INTEGER_CONSTANT) {
                            return specNode;
                        }
                        else {
                            CallParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_NUMBER, this);
                            return undefined;
                        }
                    }
                    else {
                        return undefined;
                    }
                };
                CallParser.COMMA_SET = ExpressionParser.EXPR_START_SET.clone();
                return CallParser;
            }(StatementParser));
            exports_59("CallParser", CallParser);
            CallParser.initialize();
            CallDeclaredParser = (function (_super) {
                __extends(CallDeclaredParser, _super);
                function CallDeclaredParser(parent) {
                    _super.call(this, parent);
                }
                CallDeclaredParser.prototype.parse = function (token) {
                    var callNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.CALL);
                    var pfId = CallDeclaredParser.symTabStack.lookup(token.getText().toLowerCase());
                    callNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.ID, pfId);
                    callNode.setTypeSpec(pfId.getTypeSpec());
                    token = this.nextToken();
                    var parmsNode = this.parseActualParameters(token, pfId, true, false, false);
                    callNode.addChild(parmsNode);
                    return callNode;
                };
                return CallDeclaredParser;
            }(CallParser));
            exports_59("CallDeclaredParser", CallDeclaredParser);
            CallStandardParser = (function (_super) {
                __extends(CallStandardParser, _super);
                function CallStandardParser(parent) {
                    _super.call(this, parent);
                }
                CallStandardParser.prototype.parse = function (token) {
                    var callNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.CALL);
                    var pfId = CallStandardParser.symTabStack.lookup(token.getText().toLowerCase());
                    var routineCode = pfId.getAttribute(SymTabKeyImpl_2.SymTabKeyImpl.ROUTINE_CODE);
                    callNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.ID, pfId);
                    token = this.nextToken();
                    switch (routineCode) {
                        case RoutineCodeImpl_2.RoutineCodeImpl.READ:
                        case RoutineCodeImpl_2.RoutineCodeImpl.READLN: return this.parseReadReadln(token, callNode, pfId);
                        case RoutineCodeImpl_2.RoutineCodeImpl.WRITE:
                        case RoutineCodeImpl_2.RoutineCodeImpl.WRITELN: return this.parseWriteWriteln(token, callNode, pfId);
                        case RoutineCodeImpl_2.RoutineCodeImpl.EOF:
                        case RoutineCodeImpl_2.RoutineCodeImpl.EOLN: return this.parseEofEoln(token, callNode, pfId);
                        case RoutineCodeImpl_2.RoutineCodeImpl.ABS:
                        case RoutineCodeImpl_2.RoutineCodeImpl.SQR: return this.parseAbsSqr(token, callNode, pfId);
                        case RoutineCodeImpl_2.RoutineCodeImpl.ARCTAN:
                        case RoutineCodeImpl_2.RoutineCodeImpl.COS:
                        case RoutineCodeImpl_2.RoutineCodeImpl.EXP:
                        case RoutineCodeImpl_2.RoutineCodeImpl.LN:
                        case RoutineCodeImpl_2.RoutineCodeImpl.SIN:
                        case RoutineCodeImpl_2.RoutineCodeImpl.SQRT: return this.parseArctanCosExpLnSinSqrt(token, callNode, pfId);
                        case RoutineCodeImpl_2.RoutineCodeImpl.PRED:
                        case RoutineCodeImpl_2.RoutineCodeImpl.SUCC: return this.parsePredSucc(token, callNode, pfId);
                        case RoutineCodeImpl_2.RoutineCodeImpl.CHR: return this.parseChr(token, callNode, pfId);
                        case RoutineCodeImpl_2.RoutineCodeImpl.ODD: return this.parseOdd(token, callNode, pfId);
                        case RoutineCodeImpl_2.RoutineCodeImpl.ORD: return this.parseOrd(token, callNode, pfId);
                        case RoutineCodeImpl_2.RoutineCodeImpl.ROUND:
                        case RoutineCodeImpl_2.RoutineCodeImpl.TRUNC: return this.parseRoundTrunc(token, callNode, pfId);
                        default: return undefined;
                    }
                };
                CallStandardParser.prototype.parseReadReadln = function (token, callNode, pfId) {
                    var parmsNode = this.parseActualParameters(token, pfId, false, true, false);
                    callNode.addChild(parmsNode);
                    if ((pfId === Predefined_3.Predefined.readId) &&
                        (callNode.getChildren().size() === 0)) {
                        CallStandardParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.WRONG_NUMBER_OF_PARMS, this);
                    }
                    return callNode;
                };
                CallStandardParser.prototype.parseWriteWriteln = function (token, callNode, pfId) {
                    var parmsNode = this.parseActualParameters(token, pfId, false, false, true);
                    callNode.addChild(parmsNode);
                    if ((pfId === Predefined_3.Predefined.writeId) &&
                        (callNode.getChildren().size() === 0)) {
                        CallStandardParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.WRONG_NUMBER_OF_PARMS, this);
                    }
                    return callNode;
                };
                CallStandardParser.prototype.parseEofEoln = function (token, callNode, pfId) {
                    var parmsNode = this.parseActualParameters(token, pfId, false, false, false);
                    callNode.addChild(parmsNode);
                    if (this.checkParmCount(token, parmsNode, 0)) {
                        callNode.setTypeSpec(Predefined_3.Predefined.booleanType);
                    }
                    return callNode;
                };
                CallStandardParser.prototype.parseAbsSqr = function (token, callNode, pfId) {
                    var parmsNode = this.parseActualParameters(token, pfId, false, false, false);
                    callNode.addChild(parmsNode);
                    if (this.checkParmCount(token, parmsNode, 1)) {
                        var argType = parmsNode.getChildren().get(0).getTypeSpec().baseType();
                        if ((argType === Predefined_3.Predefined.integerType) ||
                            (argType === Predefined_3.Predefined.realType)) {
                            callNode.setTypeSpec(argType);
                        }
                        else {
                            CallStandardParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_TYPE, this);
                        }
                    }
                    return callNode;
                };
                CallStandardParser.prototype.parseArctanCosExpLnSinSqrt = function (token, callNode, pfId) {
                    var parmsNode = this.parseActualParameters(token, pfId, false, false, false);
                    callNode.addChild(parmsNode);
                    if (this.checkParmCount(token, parmsNode, 1)) {
                        var argType = parmsNode.getChildren().get(0).getTypeSpec().baseType();
                        if ((argType === Predefined_3.Predefined.integerType) ||
                            (argType === Predefined_3.Predefined.realType)) {
                            callNode.setTypeSpec(Predefined_3.Predefined.realType);
                        }
                        else {
                            CallStandardParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_TYPE, this);
                        }
                    }
                    return callNode;
                };
                CallStandardParser.prototype.parsePredSucc = function (token, callNode, pfId) {
                    var parmsNode = this.parseActualParameters(token, pfId, false, false, false);
                    callNode.addChild(parmsNode);
                    if (this.checkParmCount(token, parmsNode, 1)) {
                        var argType = parmsNode.getChildren().get(0).getTypeSpec().baseType();
                        if ((argType === Predefined_3.Predefined.integerType) ||
                            (argType.getForm() === TypeFormImpl_4.TypeFormImpl.ENUMERATION)) {
                            callNode.setTypeSpec(argType);
                        }
                        else {
                            CallStandardParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_TYPE, this);
                        }
                    }
                    return callNode;
                };
                CallStandardParser.prototype.parseChr = function (token, callNode, pfId) {
                    var parmsNode = this.parseActualParameters(token, pfId, false, false, false);
                    callNode.addChild(parmsNode);
                    if (this.checkParmCount(token, parmsNode, 1)) {
                        var argType = parmsNode.getChildren().get(0).getTypeSpec().baseType();
                        if (argType === Predefined_3.Predefined.integerType) {
                            callNode.setTypeSpec(Predefined_3.Predefined.charType);
                        }
                        else {
                            CallStandardParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_TYPE, this);
                        }
                    }
                    return callNode;
                };
                CallStandardParser.prototype.parseOdd = function (token, callNode, pfId) {
                    var parmsNode = this.parseActualParameters(token, pfId, false, false, false);
                    callNode.addChild(parmsNode);
                    if (this.checkParmCount(token, parmsNode, 1)) {
                        var argType = parmsNode.getChildren().get(0).getTypeSpec().baseType();
                        if (argType === Predefined_3.Predefined.integerType) {
                            callNode.setTypeSpec(Predefined_3.Predefined.booleanType);
                        }
                        else {
                            CallStandardParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_TYPE, this);
                        }
                    }
                    return callNode;
                };
                CallStandardParser.prototype.parseOrd = function (token, callNode, pfId) {
                    var parmsNode = this.parseActualParameters(token, pfId, false, false, false);
                    callNode.addChild(parmsNode);
                    if (this.checkParmCount(token, parmsNode, 1)) {
                        var argType = parmsNode.getChildren().get(0).getTypeSpec().baseType();
                        if ((argType === Predefined_3.Predefined.charType) ||
                            (argType.getForm() === TypeFormImpl_4.TypeFormImpl.ENUMERATION)) {
                            callNode.setTypeSpec(Predefined_3.Predefined.integerType);
                        }
                        else {
                            CallStandardParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_TYPE, this);
                        }
                    }
                    return callNode;
                };
                CallStandardParser.prototype.parseRoundTrunc = function (token, callNode, pfId) {
                    var parmsNode = this.parseActualParameters(token, pfId, false, false, false);
                    callNode.addChild(parmsNode);
                    if (this.checkParmCount(token, parmsNode, 1)) {
                        var argType = parmsNode.getChildren().get(0).getTypeSpec().baseType();
                        if (argType === Predefined_3.Predefined.realType) {
                            callNode.setTypeSpec(Predefined_3.Predefined.integerType);
                        }
                        else {
                            CallStandardParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_TYPE, this);
                        }
                    }
                    return callNode;
                };
                CallStandardParser.prototype.checkParmCount = function (token, parmsNode, count) {
                    if (((parmsNode === undefined) && (count === 0)) ||
                        (parmsNode.getChildren().size() === count)) {
                        return true;
                    }
                    else {
                        CallStandardParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.WRONG_NUMBER_OF_PARMS, this);
                        return false;
                    }
                };
                return CallStandardParser;
            }(CallParser));
            exports_59("CallStandardParser", CallStandardParser);
            VariableParser = (function (_super) {
                __extends(VariableParser, _super);
                function VariableParser(parent) {
                    _super.call(this, parent);
                    this.isFunctionTarget = false;
                }
                VariableParser.prototype.parseFunctionNameTarget = function (token) {
                    this.isFunctionTarget = true;
                    return this.parse(token);
                };
                VariableParser.prototype.parse = function (token, variableId) {
                    if (variableId) {
                        return this.parseTokenSymTab(token, variableId);
                    }
                    else {
                        return this.parseTokenOnly(token);
                    }
                };
                VariableParser.prototype.parseTokenSymTab = function (token, variableId) {
                    var defnCode = variableId.getDefinition();
                    if (!((defnCode === DefinitionImpl_2.DefinitionImpl.VARIABLE) || (defnCode === DefinitionImpl_2.DefinitionImpl.VALUE_PARM) ||
                        (defnCode === DefinitionImpl_2.DefinitionImpl.VAR_PARM) ||
                        (this.isFunctionTarget && (defnCode === DefinitionImpl_2.DefinitionImpl.FUNCTION)))) {
                        VariableParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_IDENTIFIER_USAGE, this);
                    }
                    variableId.appendLineNumber(token.getLineNumber());
                    var variableNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.VARIABLE);
                    variableNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.ID, variableId);
                    token = this.nextToken();
                    var variableType = variableId.getTypeSpec();
                    if (!this.isFunctionTarget) {
                        while (VariableParser.SUBSCRIPT_FIELD_START_SET.contains(token.getType())) {
                            var subFldNode = token.getType() === PascalTokenType_7.PascalTokenType.LEFT_BRACKET
                                ? this.parseSubscripts(variableType)
                                : this.parseField(variableType);
                            token = this.currentToken();
                            variableType = subFldNode.getTypeSpec();
                            variableNode.addChild(subFldNode);
                        }
                    }
                    variableNode.setTypeSpec(variableType);
                    return variableNode;
                };
                VariableParser.prototype.parseTokenOnly = function (token) {
                    var name = token.getText().toLowerCase();
                    var variableId = VariableParser.symTabStack.lookup(name);
                    if (variableId === undefined) {
                        VariableParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.IDENTIFIER_UNDEFINED, this);
                        variableId = VariableParser.symTabStack.enterLocal(name);
                        variableId.setDefinition(DefinitionImpl_2.DefinitionImpl.UNDEFINED);
                        variableId.setTypeSpec(Predefined_3.Predefined.undefinedType);
                    }
                    return this.parse(token, variableId);
                };
                VariableParser.prototype.parseSubscripts = function (variableType) {
                    var token;
                    var expressionParser = new ExpressionParser(this);
                    var subscriptsNode = ICodeFactory_2.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.SUBSCRIPTS);
                    do {
                        token = this.nextToken();
                        if (variableType.getForm() === TypeFormImpl_4.TypeFormImpl.ARRAY) {
                            var exprNode = expressionParser.parse(token);
                            var exprType = exprNode !== undefined ? exprNode.getTypeSpec()
                                : Predefined_3.Predefined.undefinedType;
                            var indexType = variableType.getAttribute(TypeKeyImpl_3.TypeKeyImpl.ARRAY_INDEX_TYPE);
                            if (!TypeChecker_1.TypeChecker.areAssignmentCompatible(indexType, exprType)) {
                                VariableParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INCOMPATIBLE_TYPES, this);
                            }
                            subscriptsNode.addChild(exprNode);
                            variableType =
                                variableType.getAttribute(TypeKeyImpl_3.TypeKeyImpl.ARRAY_ELEMENT_TYPE);
                        }
                        else {
                            VariableParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.TOO_MANY_SUBSCRIPTS, this);
                            expressionParser.parse(token);
                        }
                        token = this.currentToken();
                    } while (token.getType() === PascalTokenType_7.PascalTokenType.COMMA);
                    token = this.synchronize(VariableParser.RIGHT_BRACKET_SET);
                    if (token.getType() === PascalTokenType_7.PascalTokenType.RIGHT_BRACKET) {
                        token = this.nextToken();
                    }
                    else {
                        VariableParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.MISSING_RIGHT_BRACKET, this);
                    }
                    subscriptsNode.setTypeSpec(variableType);
                    return subscriptsNode;
                };
                VariableParser.prototype.parseField = function (variableType) {
                    var fieldNode = ICodeFactory_2.ICodeFactory.createICodeNode(DefinitionImpl_2.DefinitionImpl.FIELD);
                    var token = this.nextToken();
                    var tokenType = token.getType();
                    var variableForm = variableType.getForm();
                    if ((tokenType === PascalTokenType_7.PascalTokenType.IDENTIFIER) && (variableForm === TypeFormImpl_4.TypeFormImpl.RECORD)) {
                        var symTab = variableType.getAttribute(TypeKeyImpl_3.TypeKeyImpl.RECORD_SYMTAB);
                        var fieldName = token.getText().toLowerCase();
                        var fieldId = symTab.lookup(fieldName);
                        if (fieldId !== undefined) {
                            variableType = fieldId.getTypeSpec();
                            fieldId.appendLineNumber(token.getLineNumber());
                            fieldNode.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.ID, fieldId);
                        }
                        else {
                            VariableParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_FIELD, this);
                        }
                    }
                    else {
                        VariableParser.errorHandler.flag(token, PascalErrorCode_7.PascalErrorCode.INVALID_FIELD, this);
                    }
                    token = this.nextToken();
                    fieldNode.setTypeSpec(variableType);
                    return fieldNode;
                };
                VariableParser.SUBSCRIPT_FIELD_START_SET = new List_4.List([
                    PascalTokenType_7.PascalTokenType.LEFT_BRACKET,
                    PascalTokenType_7.PascalTokenType.DOT]);
                VariableParser.RIGHT_BRACKET_SET = new List_4.List([
                    PascalTokenType_7.PascalTokenType.RIGHT_BRACKET,
                    PascalTokenType_7.PascalTokenType.EQUALS,
                    PascalTokenType_7.PascalTokenType.SEMICOLON]);
                return VariableParser;
            }(StatementParser));
            exports_59("VariableParser", VariableParser);
        }
    }
});
System.register("src/language/pascal/PascalParserTD", ["src/language/pascal/PascalErrorCode", "src/language/pascal/PascalParser", "src/language/pascal/parsersBundle", "src/message/MessageType", "src/message/Message", "src/intermediate/symtabimpl/Predefined"], function(exports_60, context_60) {
    "use strict";
    var __moduleName = context_60 && context_60.id;
    var PascalErrorCode_8, PascalParser_2, parsersBundle_1, MessageType_3, Message_3, Predefined_4;
    var PascalParserTD;
    return {
        setters:[
            function (PascalErrorCode_8_1) {
                PascalErrorCode_8 = PascalErrorCode_8_1;
            },
            function (PascalParser_2_1) {
                PascalParser_2 = PascalParser_2_1;
            },
            function (parsersBundle_1_1) {
                parsersBundle_1 = parsersBundle_1_1;
            },
            function (MessageType_3_1) {
                MessageType_3 = MessageType_3_1;
            },
            function (Message_3_1) {
                Message_3 = Message_3_1;
            },
            function (Predefined_4_1) {
                Predefined_4 = Predefined_4_1;
            }],
        execute: function() {
            PascalParserTD = (function (_super) {
                __extends(PascalParserTD, _super);
                function PascalParserTD(param) {
                    if (param instanceof PascalParserTD) {
                        _super.call(this, param.getScanner());
                    }
                    else {
                        _super.call(this, param);
                    }
                }
                PascalParserTD.prototype.parse = function () {
                    var params = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        params[_i - 0] = arguments[_i];
                    }
                    var token;
                    Predefined_4.Predefined.initialize(PascalParserTD.symTabStack);
                    try {
                        var token_1 = this.nextToken();
                        var programParser = new parsersBundle_1.ProgramParser(this);
                        programParser.parse(token_1, undefined);
                        token_1 = this.currentToken();
                        var elapsedTime = 0;
                        this.sendMessage(new Message_3.Message(MessageType_3.MessageType.PARSER_SUMMARY, [token_1.getLineNumber(),
                            this.getErrorCount(),
                            elapsedTime]));
                    }
                    catch (ex) {
                        console.error('Error!!!!!!!!');
                        console.info(ex);
                        PascalParserTD.errorHandler.abortTranslation(PascalErrorCode_8.PascalErrorCode.IO_ERROR, this);
                    }
                };
                return PascalParserTD;
            }(PascalParser_2.PascalParser));
            exports_60("PascalParserTD", PascalParserTD);
        }
    }
});
System.register("src/Compiler", [], function(exports_61, context_61) {
    "use strict";
    var __moduleName = context_61 && context_61.id;
    var Compiler;
    return {
        setters:[],
        execute: function() {
            Compiler = (function () {
                function Compiler(languageName) {
                    this.languageName = languageName;
                }
                Compiler.prototype.setSource = function (source) {
                    this.source = source;
                    this.scanner.setSource(this.source);
                };
                Compiler.prototype.getParser = function () {
                    return this.parser;
                };
                return Compiler;
            }());
            exports_61("Compiler", Compiler);
        }
    }
});
System.register("src/language/Pascal", ["src/language/pascal/PascalScanner", "src/language/pascal/PascalParserTD", "src/Compiler"], function(exports_62, context_62) {
    "use strict";
    var __moduleName = context_62 && context_62.id;
    var PascalScanner_1, PascalParserTD_1, Compiler_1;
    var Pascal;
    return {
        setters:[
            function (PascalScanner_1_1) {
                PascalScanner_1 = PascalScanner_1_1;
            },
            function (PascalParserTD_1_1) {
                PascalParserTD_1 = PascalParserTD_1_1;
            },
            function (Compiler_1_1) {
                Compiler_1 = Compiler_1_1;
            }],
        execute: function() {
            Pascal = (function (_super) {
                __extends(Pascal, _super);
                function Pascal() {
                    _super.call(this, 'Pascal');
                    this.scanner = new PascalScanner_1.PascalScanner();
                    this.parser = new PascalParserTD_1.PascalParserTD(this.scanner);
                }
                return Pascal;
            }(Compiler_1.Compiler));
            exports_62("Pascal", Pascal);
        }
    }
});
System.register("src/util/IntermediateHandler", [], function(exports_63, context_63) {
    "use strict";
    var __moduleName = context_63 && context_63.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("src/util/CrossReferencer", ["src/intermediate/symtabimpl/DefinitionImpl", "src/intermediate/symtabimpl/SymTabKeyImpl", "src/intermediate/typeimpl/TypeKeyImpl", "src/intermediate/typeimpl/TypeFormImpl"], function(exports_64, context_64) {
    "use strict";
    var __moduleName = context_64 && context_64.id;
    var DefinitionImpl_3, SymTabKeyImpl_3, TypeKeyImpl_4, TypeFormImpl_5;
    var CrossReferencer;
    return {
        setters:[
            function (DefinitionImpl_3_1) {
                DefinitionImpl_3 = DefinitionImpl_3_1;
            },
            function (SymTabKeyImpl_3_1) {
                SymTabKeyImpl_3 = SymTabKeyImpl_3_1;
            },
            function (TypeKeyImpl_4_1) {
                TypeKeyImpl_4 = TypeKeyImpl_4_1;
            },
            function (TypeFormImpl_5_1) {
                TypeFormImpl_5 = TypeFormImpl_5_1;
            }],
        execute: function() {
            CrossReferencer = (function () {
                function CrossReferencer() {
                }
                CrossReferencer.prototype.print = function (symTabStack) {
                    console.info('\n===== CROSS-REFERENCE TABLE =====');
                    var programId = symTabStack.getProgramId();
                    this.printRoutine(programId);
                };
                CrossReferencer.prototype.printRoutine = function (routineId) {
                    var definition = routineId.getDefinition();
                    console.info('\n*** ' + definition.toString() +
                        ' ' + routineId.getName() + ' ***');
                    this.printColumnHeadings();
                    var symTab = routineId.getAttribute(SymTabKeyImpl_3.SymTabKeyImpl.ROUTINE_SYMTAB);
                    var newRecordTypes = [];
                    this.printSymTab(symTab, newRecordTypes);
                    if (newRecordTypes.length > 0) {
                        this.printRecords(newRecordTypes);
                    }
                    var routineIds = routineId.getAttribute(SymTabKeyImpl_3.SymTabKeyImpl.ROUTINE_ROUTINES);
                    if (routineIds !== undefined) {
                        for (var i = 0; i < routineIds.length; ++i) {
                            var rtnId = routineIds[i];
                            this.printRoutine(rtnId);
                        }
                    }
                };
                CrossReferencer.prototype.printColumnHeadings = function () {
                    console.info(CrossReferencer.NAME_FORMAT, 'Identifier', CrossReferencer.NUMBERS_LABEL + 'Type specification');
                    console.info(CrossReferencer.NAME_FORMAT, '----------', CrossReferencer.NUMBERS_UNDERLINE + '------------------');
                };
                CrossReferencer.prototype.printSymTab = function (symTab, recordTypes) {
                    recordTypes = recordTypes || [];
                    var sorted = symTab.sortedEntries();
                    for (var i = 0; i < sorted.length; i++) {
                        var entry = sorted[i];
                        var lineNumbers = entry.getLineNumbers();
                        var line = entry.getName();
                        for (var index = line.length; index < 10; index++) {
                            line += ' ';
                        }
                        if (lineNumbers !== undefined) {
                            for (var lineNumber in lineNumbers) {
                                line += lineNumber + ',';
                            }
                        }
                        console.info(line);
                        this.printEntry(entry, recordTypes);
                    }
                };
                CrossReferencer.prototype.printEntry = function (entry, recordTypes) {
                    var definition = entry.getDefinition();
                    var nestingLevel = entry.getSymTab().getNestingLevel();
                    console.info(CrossReferencer.INDENT + 'Defined as: ' + definition.getText());
                    console.info(CrossReferencer.INDENT + 'Scope nesting level: ' + nestingLevel);
                    var type = entry.getTypeSpec();
                    this.printType(type);
                    switch (definition) {
                        case DefinitionImpl_3.DefinitionImpl.CONSTANT: {
                            var value = entry.getAttribute(SymTabKeyImpl_3.SymTabKeyImpl.CONSTANT_VALUE);
                            console.info(CrossReferencer.INDENT + 'Value = ' + value);
                            if (type.getIdentifier() === undefined) {
                                this.printTypeDetail(type, recordTypes);
                            }
                            break;
                        }
                        case DefinitionImpl_3.DefinitionImpl.ENUMERATION_CONSTANT: {
                            var value = entry.getAttribute(SymTabKeyImpl_3.SymTabKeyImpl.CONSTANT_VALUE);
                            console.info(CrossReferencer.INDENT + 'Value = ' + value);
                            break;
                        }
                        case DefinitionImpl_3.DefinitionImpl.TYPE: {
                            if (entry === type.getIdentifier()) {
                                this.printTypeDetail(type, recordTypes);
                            }
                            break;
                        }
                        case DefinitionImpl_3.DefinitionImpl.VARIABLE: {
                            if (type.getIdentifier() === undefined) {
                                this.printTypeDetail(type, recordTypes);
                            }
                            break;
                        }
                    }
                };
                CrossReferencer.prototype.printType = function (type) {
                    if (type !== undefined) {
                        var form = type.getForm();
                        var typeId = type.getIdentifier();
                        var typeName = typeId !== undefined ? typeId.getName() : '<unnamed>';
                        console.info(CrossReferencer.INDENT + 'Type form = ' + form +
                            ', Type id = ' + typeName);
                    }
                };
                CrossReferencer.prototype.printTypeDetail = function (type, recordTypes) {
                    var form = type.getForm();
                    switch (form) {
                        case TypeFormImpl_5.TypeFormImpl.ENUMERATION: {
                            var constantIds = type.getAttribute(TypeKeyImpl_4.TypeKeyImpl.ENUMERATION_CONSTANTS);
                            console.info(CrossReferencer.INDENT + '--- Enumeration constants ---');
                            for (var _i = 0, constantIds_1 = constantIds; _i < constantIds_1.length; _i++) {
                                var constantId = constantIds_1[_i];
                                var name_7 = constantId.getName();
                                var value = constantId.getAttribute(SymTabKeyImpl_3.SymTabKeyImpl.CONSTANT_VALUE);
                                console.info(CrossReferencer.INDENT + CrossReferencer.ENUM_CONST_FORMAT, name_7, value);
                            }
                            break;
                        }
                        case TypeFormImpl_5.TypeFormImpl.SUBRANGE: {
                            var minValue = type.getAttribute(TypeKeyImpl_4.TypeKeyImpl.SUBRANGE_MIN_VALUE);
                            var maxValue = type.getAttribute(TypeKeyImpl_4.TypeKeyImpl.SUBRANGE_MAX_VALUE);
                            var baseTypeSpec = type.getAttribute(TypeKeyImpl_4.TypeKeyImpl.SUBRANGE_BASE_TYPE);
                            console.info(CrossReferencer.INDENT + '--- Base type ---');
                            this.printType(baseTypeSpec);
                            if (baseTypeSpec.getIdentifier() === undefined) {
                                this.printTypeDetail(baseTypeSpec, recordTypes);
                            }
                            console.info(CrossReferencer.INDENT + 'Range = ');
                            console.info(this.toString(minValue) + '..' +
                                this.toString(maxValue));
                            break;
                        }
                        case TypeFormImpl_5.TypeFormImpl.ARRAY: {
                            var indexType = type.getAttribute(TypeKeyImpl_4.TypeKeyImpl.ARRAY_INDEX_TYPE);
                            var elementType = type.getAttribute(TypeKeyImpl_4.TypeKeyImpl.ARRAY_ELEMENT_TYPE);
                            var count = type.getAttribute(TypeKeyImpl_4.TypeKeyImpl.ARRAY_ELEMENT_COUNT);
                            console.info(CrossReferencer.INDENT + '--- INDEX TYPE ---');
                            this.printType(indexType);
                            if (indexType.getIdentifier() === undefined) {
                                this.printTypeDetail(indexType, recordTypes);
                            }
                            console.info(CrossReferencer.INDENT + '--- ELEMENT TYPE ---');
                            this.printType(elementType);
                            console.info(CrossReferencer.INDENT.toString() + count + ' elements');
                            if (elementType.getIdentifier() === undefined) {
                                this.printTypeDetail(elementType, recordTypes);
                            }
                            break;
                        }
                        case TypeFormImpl_5.TypeFormImpl.RECORD: {
                            recordTypes.push(type);
                            break;
                        }
                    }
                };
                CrossReferencer.prototype.printRecords = function (recordTypes) {
                    for (var _i = 0, recordTypes_1 = recordTypes; _i < recordTypes_1.length; _i++) {
                        var recordType = recordTypes_1[_i];
                        var recordId = recordType.getIdentifier();
                        var name_8 = recordId !== undefined ? recordId.getName() : '<unnamed>';
                        console.info('\n--- RECORD ' + name_8 + ' ---');
                        this.printColumnHeadings();
                        var symTab = recordType.getAttribute(TypeKeyImpl_4.TypeKeyImpl.RECORD_SYMTAB);
                        var newRecordTypes = [];
                        this.printSymTab(symTab, newRecordTypes);
                        if (newRecordTypes.length > 0) {
                            this.printRecords(newRecordTypes);
                        }
                    }
                };
                CrossReferencer.prototype.toString = function (value) {
                    return value instanceof String ? '"' + value + '"'
                        : value.toString();
                };
                CrossReferencer.NAME_WIDTH = 16;
                CrossReferencer.NAME_FORMAT = '%s';
                CrossReferencer.NUMBERS_LABEL = ' Line numbers    ';
                CrossReferencer.NUMBERS_UNDERLINE = ' ------------    ';
                CrossReferencer.NUMBER_FORMAT = ' %03d';
                CrossReferencer.LABEL_WIDTH = CrossReferencer.NUMBERS_LABEL.length;
                CrossReferencer.INDENT_WIDTH = CrossReferencer.NAME_WIDTH + CrossReferencer.LABEL_WIDTH;
                CrossReferencer.INDENT = '            ';
                CrossReferencer.ENUM_CONST_FORMAT = '%' + CrossReferencer.NAME_WIDTH + 's = %s';
                return CrossReferencer;
            }());
            exports_64("CrossReferencer", CrossReferencer);
        }
    }
});
System.register("src/util/export/Exporter", [], function(exports_65, context_65) {
    "use strict";
    var __moduleName = context_65 && context_65.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("src/Transpiler", ["src/frontend/Source", "src/message/MessageType", "src/intermediate/symtabimpl/SymTabKeyImpl", "src/util/List"], function(exports_66, context_66) {
    "use strict";
    var __moduleName = context_66 && context_66.id;
    var Source_3, MessageType_4, SymTabKeyImpl_4, List_5;
    var Transpiler, SourceMessageListener, ParserMessageListener, SyntacError, ParserSummary;
    return {
        setters:[
            function (Source_3_1) {
                Source_3 = Source_3_1;
            },
            function (MessageType_4_1) {
                MessageType_4 = MessageType_4_1;
            },
            function (SymTabKeyImpl_4_1) {
                SymTabKeyImpl_4 = SymTabKeyImpl_4_1;
            },
            function (List_5_1) {
                List_5 = List_5_1;
            }],
        execute: function() {
            Transpiler = (function () {
                function Transpiler(language) {
                    this.language = language;
                    this.USAGE = 'Usage: {{language}} execute|compile '.replace('{{language}}', this.language.languageName)
                        + Transpiler.FLAGS + ' <source file path>';
                }
                Transpiler.prototype.setCompiler = function (language) {
                    this.language = language;
                };
                Transpiler.prototype.parse = function (text, intermediateHandlers) {
                    try {
                        this.source = new Source_3.Source(text);
                        this.source.addMessageListener(new SourceMessageListener());
                        this.language.setSource(this.source);
                        this.parser = this.language.getParser();
                        this.parser.addMessageListener(new ParserMessageListener());
                        this.parser.parse();
                        this.source.close();
                        if (this.parser.getErrorCount() === 0) {
                            this.symTabStack = this.parser.getSymTabStack();
                            var programId = this.symTabStack.getProgramId();
                            this.iCode = programId.getAttribute(SymTabKeyImpl_4.SymTabKeyImpl.ROUTINE_ICODE);
                        }
                    }
                    catch (ex) {
                        console.info(ex);
                        console.info('***** Internal translator error. *****');
                    }
                };
                Transpiler.prototype.export = function (exporter) {
                    if (this.symTabStack === undefined) {
                        throw 'Nothing to parse yet.';
                    }
                    return exporter.export(this.symTabStack);
                };
                Transpiler.FLAGS = '[-ixlafcr]';
                Transpiler.SOURCE_LINE_FORMAT = '%d %s';
                Transpiler.PARSER_SUMMARY_FORMAT = '\n%d source lines.' +
                    '\n%d syntax errors.' +
                    '\n%d seconds total parsing time.\n';
                Transpiler.PREFIX_WIDTH = 5;
                Transpiler.INTERPRETER_SUMMARY_FORMAT = '\n%,20d statements executed.' +
                    '\n%,20d runtime errors.' +
                    '\n%,20.2f seconds total execution time.\n';
                Transpiler.COMPILER_SUMMARY_FORMAT = '\n%,20d instructions generated.' +
                    '\n%,20.2f seconds total code generation time.\n';
                Transpiler.LINE_FORMAT = '>>> AT LINE %03d\n';
                Transpiler.ASSIGN_FORMAT = '>>> AT LINE %03d: %s = %s\n';
                Transpiler.FETCH_FORMAT = '>>> AT LINE %03d: %s : %s\n';
                Transpiler.CALL_FORMAT = '>>> AT LINE %03d: CALL %s\n';
                Transpiler.RETURN_FORMAT = '>>> AT LINE %03d: RETURN FROM %s\n';
                return Transpiler;
            }());
            exports_66("Transpiler", Transpiler);
            SourceMessageListener = (function () {
                function SourceMessageListener() {
                    this.sourcelineReport = '';
                }
                SourceMessageListener.prototype.messageReceived = function (message) {
                    var type = message.getType();
                    var body = message.getBody();
                    switch (type) {
                        case MessageType_4.MessageType.SOURCE_LINE: {
                            var lineNumber = body[0];
                            var lineText = body[1];
                            break;
                        }
                    }
                };
                return SourceMessageListener;
            }());
            ParserMessageListener = (function () {
                function ParserMessageListener() {
                    this.syntaxError = new List_5.List();
                }
                ParserMessageListener.prototype.messageReceived = function (message) {
                    var type = message.getType();
                    switch (type) {
                        case MessageType_4.MessageType.PARSER_SUMMARY: {
                            var body = message.getBody();
                            var statementCount = body[0];
                            var syntaxErrors = body[1];
                            var elapsedTime = body[2];
                            this.parserSummary = new ParserSummary(statementCount, syntaxErrors, elapsedTime);
                            break;
                        }
                        case MessageType_4.MessageType.SYNTAX_ERROR: {
                            var body = message.getBody();
                            var lineNumber = body[0];
                            var position = body[1];
                            var tokenText = body[2];
                            var errorMessage = body[3];
                            this.syntaxError.add(new SyntacError(lineNumber, position, tokenText, errorMessage));
                            break;
                        }
                    }
                };
                return ParserMessageListener;
            }());
            SyntacError = (function () {
                function SyntacError(lineNumber, position, tokenText, errorMessage) {
                    this.lineNumber = lineNumber;
                    this.position = position;
                    this.tokenText = tokenText;
                    this.errorMessage = errorMessage;
                }
                SyntacError.prototype.toJson = function () {
                    return {
                        lineNumber: this.lineNumber,
                        position: this.position,
                        tokenText: this.tokenText,
                        errorMessage: this.errorMessage
                    };
                };
                SyntacError.prototype.toString = function () {
                    var spaceCount = Transpiler.PREFIX_WIDTH + this.position;
                    var flagBuffer = '';
                    for (var i = 0; i < spaceCount; i++) {
                        flagBuffer += ' ';
                    }
                    flagBuffer += '^\n*** ' + this.errorMessage;
                    if (this.tokenText !== undefined) {
                        flagBuffer += ' [at \'' + this.tokenText
                            + '\']';
                    }
                    return flagBuffer;
                };
                return SyntacError;
            }());
            ParserSummary = (function () {
                function ParserSummary(statementCount, syntaxErrors, elapsedTime) {
                    this.statementCount = statementCount;
                    this.syntaxErrors = syntaxErrors;
                    this.elapsedTime = elapsedTime;
                }
                ParserSummary.prototype.toJson = function () {
                    return {
                        statementCount: this.statementCount,
                        syntaxErrors: this.syntaxErrors,
                        elapsedTime: this.elapsedTime
                    };
                };
                ParserSummary.prototype.toString = function () {
                    return '';
                };
                return ParserSummary;
            }());
        }
    }
});
System.register("src/util/export/JsonExporter", ["src/intermediate/symtabimpl/SymTabKeyImpl"], function(exports_67, context_67) {
    "use strict";
    var __moduleName = context_67 && context_67.id;
    var SymTabKeyImpl_5;
    var JsonExporter;
    return {
        setters:[
            function (SymTabKeyImpl_5_1) {
                SymTabKeyImpl_5 = SymTabKeyImpl_5_1;
            }],
        execute: function() {
            JsonExporter = (function () {
                function JsonExporter() {
                }
                JsonExporter.prototype.export = function (symTabStack) {
                    var programId = symTabStack.getProgramId();
                    var definition = programId.getDefinition();
                    var iCode = programId.getAttribute(SymTabKeyImpl_5.SymTabKeyImpl.ROUTINE_ICODE);
                    return {
                        definition: definition.toString(),
                        name: programId.getName(),
                        program: iCode.getRoot().toJson()
                    };
                };
                return JsonExporter;
            }());
            exports_67("JsonExporter", JsonExporter);
        }
    }
});
System.register("test", ["src/language/Pascal", "src/Transpiler", "src/util/export/JsonExporter"], function(exports_68, context_68) {
    "use strict";
    var __moduleName = context_68 && context_68.id;
    var Pascal_1, Transpiler_1, JsonExporter_1;
    var fs, text, exporter, compiler;
    return {
        setters:[
            function (Pascal_1_1) {
                Pascal_1 = Pascal_1_1;
            },
            function (Transpiler_1_1) {
                Transpiler_1 = Transpiler_1_1;
            },
            function (JsonExporter_1_1) {
                JsonExporter_1 = JsonExporter_1_1;
            }],
        execute: function() {
            fs = require('fs');
            text = fs.readFileSync('./test.pas', 'utf8');
            exporter = new JsonExporter_1.JsonExporter();
            compiler = new Transpiler_1.Transpiler(new Pascal_1.Pascal());
            compiler.parse(text);
            fs.writeFileSync('export.json', JSON.stringify(compiler.export(exporter), null, 4));
        }
    }
});
//# sourceMappingURL=bundle.js.map