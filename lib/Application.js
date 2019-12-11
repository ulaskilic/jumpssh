"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = __importDefault(require("commander"));
var appJson = require("../package.json");
var chalk_1 = __importDefault(require("chalk"));
var clear_1 = __importDefault(require("clear"));
var figlet_1 = __importDefault(require("figlet"));
var DataStoreService_1 = require("./Services/DataStoreService");
var prompts_1 = __importDefault(require("prompts"));
var Sessions_1 = require("./Services/Entity/Sessions");
var validator_1 = __importDefault(require("validator"));
/**
 * Main application context
 */
var Application = /** @class */ (function () {
    function Application() {
        this.store = null;
        this.initArgs();
    }
    Application.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.store = new DataStoreService_1.DataStoreService();
                if (commander_1.default.create) {
                    this.createSession();
                }
                else if (commander_1.default.update) {
                    this.updateSession();
                }
                else if (commander_1.default.delete) {
                    this.deleteSession();
                }
                else if (commander_1.default.args.length > 0) {
                    this.findSession();
                }
                else {
                    clear_1.default();
                    console.log(chalk_1.default.green(figlet_1.default.textSync(appJson.name, { horizontalLayout: "full" })));
                    commander_1.default.outputHelp();
                }
                return [2 /*return*/];
            });
        });
    };
    Application.prototype.createSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, session, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prompts_1.default([
                            {
                                type: 'text',
                                name: 'sessionName',
                                message: 'Session name for using later',
                                validate: function (sessionName) {
                                    if (!sessionName) {
                                        return false;
                                    }
                                    return validator_1.default.isAlphanumeric(sessionName);
                                }
                            },
                            {
                                type: 'text',
                                name: 'ipAddress',
                                message: 'IP address of remote',
                                validate: function (ipAddress) {
                                    if (!ipAddress) {
                                        return false;
                                    }
                                    return validator_1.default.isIP(ipAddress);
                                }
                            },
                            {
                                type: 'text',
                                name: 'user',
                                message: 'User information (Optional)',
                                initial: '',
                                validate: function (user) {
                                    if (user) {
                                        return validator_1.default.isAlphanumeric(user);
                                    }
                                    return true;
                                }
                            },
                            {
                                type: 'text',
                                name: 'pass',
                                message: 'Pass information (Optional)',
                                initial: '',
                                validate: function (pass) {
                                    return true;
                                }
                            },
                        ])];
                    case 1:
                        response = _a.sent();
                        session = new Sessions_1.Sessions(response.sessionName, response.ipAddress, response.user, response.pass);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        if (!this.store) {
                            throw new Error("Unknown error occured");
                        }
                        return [4 /*yield*/, this.store.createSession(session)];
                    case 3:
                        _a.sent();
                        this.log("Session added!", Colors.GREEN);
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        this.log("Failed! Error: " + e_1.message, Colors.RED);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Application.prototype.updateSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    Application.prototype.deleteSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    Application.prototype.findSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _sessions, e_2, optionList, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _sessions = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        if (!this.store) {
                            throw new Error("Unknown error occurred");
                        }
                        return [4 /*yield*/, this.store.listSessions(this.program.args[0])];
                    case 2:
                        _sessions = _a.sent();
                        if (_sessions.length == 0) {
                            this.log("No session found.", Colors.RED);
                        }
                        else if (_sessions.length == 1) {
                            return [2 /*return*/, this.startSession(_sessions[0])];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        this.log("Failed! Error: " + e_2.message, Colors.RED);
                        return [3 /*break*/, 4];
                    case 4:
                        optionList = function () {
                            var choices = [];
                            for (var _i = 0, _sessions_1 = _sessions; _i < _sessions_1.length; _i++) {
                                var session = _sessions_1[_i];
                                choices.push({
                                    title: session.name + "(" + session.ip + ")",
                                    value: session
                                });
                            }
                            return choices;
                        };
                        return [4 /*yield*/, prompts_1.default({
                                type: 'select',
                                name: 'session',
                                message: 'Pick session',
                                choices: optionList()
                            })];
                    case 5:
                        response = _a.sent();
                        if (response.session) {
                            this.startSession(response.session);
                        }
                        else {
                            this.log("Process terminated!", Colors.RED);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Application.prototype.startSession = function (session) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.log("Trying to connect : " + session.name + "(" + session.ip + ")", Colors.GREEN);
                return [2 /*return*/];
            });
        });
    };
    Application.prototype.initArgs = function () {
        this.program = commander_1.default
            .version(appJson.version)
            .option("-c, --create", "create new session")
            .option("-u, --update <SESSION_NAME>", "update exists session")
            .option("-d, --delete <SESSION_NAME>", "delete session")
            .arguments("<SESSION_NAME>")
            .description(appJson.description)
            .parse(process.argv);
    };
    Application.prototype.log = function (msg, color) {
        switch (color) {
            case Colors.GREEN:
                console.log(chalk_1.default.green(msg));
                break;
            case Colors.RED:
                console.log(chalk_1.default.red(msg));
                break;
        }
    };
    return Application;
}());
exports.Application = Application;
var Colors;
(function (Colors) {
    Colors["RED"] = "red";
    Colors["GREEN"] = "green";
})(Colors || (Colors = {}));
