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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataEngine = void 0;
const to_title_case_1 = require("./../lib/to_title_case");
const regex_1 = require("./../lib/regex");
const log_1 = require("./../lib/log");
const site_1 = require("./../site");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const rxjs_1 = require("rxjs");
const promises_1 = require("fs/promises");
class DataEngine {
}
exports.DataEngine = DataEngine;
_a = DataEngine;
DataEngine.currentPath = '/';
DataEngine.pathRel = (pth = _a.currentPath) => pth.replace(/^\//, "").trim();
DataEngine.lastPath = () => _a.pathRel(_a.currentPath).split("/").slice(-1)[0];
DataEngine.path = new rxjs_1.BehaviorSubject({
    canGoBack: false,
    elements: [],
    name: '',
    level: 0,
    current: '/',
});
DataEngine.loadCurrentPath = () => new Promise((resolve, reject) => {
    if (regex_1.RegexPatterns.path.test(_a.currentPath)) {
        const fullPath = path_1.default.join(site_1.Site.DATA_PATH, _a.pathRel(_a.currentPath));
        if ((0, fs_1.existsSync)(fullPath)) {
            (0, fs_1.readdir)(fullPath, (err, files) => {
                if (err) {
                    log_1.Log.dev(err);
                    resolve(false);
                }
                else {
                    files.sort((a, b) => a.localeCompare(b));
                    const d = {
                        canGoBack: !!_a.pathRel(_a.currentPath),
                        elements: files,
                        name: _a.pathRel(_a.currentPath) ? (0, to_title_case_1.toTitleCase)(_a.lastPath()) : (0, to_title_case_1.toTitleCase)('organisms'),
                        level: _a.currentPath.trim().split("/").filter(x => !!x.length).length + 1,
                        current: _a.currentPath,
                    };
                    _a.path.next(d);
                    resolve(true);
                }
            });
        }
        else {
            resolve(false);
        }
    }
    else {
        resolve(false);
    }
});
DataEngine.addSubfolder = (url) => new Promise((resolve, reject) => {
    if (regex_1.RegexPatterns.path.test(url)) {
        const fullPath = path_1.default.join(site_1.Site.DATA_PATH, _a.pathRel(url));
        if ((0, fs_1.existsSync)(fullPath)) {
            resolve(false);
        }
        else {
            (0, fs_1.mkdir)(fullPath, { recursive: false }, (err) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    log_1.Log.dev(err);
                    resolve(false);
                }
                else {
                    yield _a.loadCurrentPath();
                    resolve(true);
                }
            }));
        }
    }
    else {
        resolve(false);
    }
});
DataEngine.delete = (url) => new Promise((resolve, reject) => {
    if (regex_1.RegexPatterns.path.test(url)) {
        const fullPath = path_1.default.join(site_1.Site.DATA_PATH, _a.pathRel(url));
        if ((0, fs_1.existsSync)(fullPath)) {
            (0, promises_1.rm)(fullPath, { recursive: true, force: false, }).then(() => __awaiter(void 0, void 0, void 0, function* () {
                yield _a.loadCurrentPath();
                resolve(true);
            })).catch(err => {
                log_1.Log.dev(err);
                resolve(false);
            });
        }
        else {
            resolve(false);
        }
    }
    else {
        resolve(false);
    }
});
DataEngine.read = (url) => new Promise((resolve, reject) => {
    if (regex_1.RegexPatterns.path.test(url) && url.endsWith(".json")) {
        const fullPath = path_1.default.join(site_1.Site.DATA_PATH, _a.pathRel(url));
        if ((0, fs_1.existsSync)(fullPath)) {
            (0, fs_1.readFile)(fullPath, "utf8", (err, data) => {
                if (err) {
                    log_1.Log.dev(err);
                    resolve(null);
                }
                else {
                    resolve(data);
                }
            });
        }
        else {
            resolve(null);
        }
    }
    else {
        resolve(null);
    }
});
DataEngine.write = (url, data) => new Promise((resolve, reject) => {
    if (regex_1.RegexPatterns.path.test(url) && url.endsWith(".json")) {
        const fullPath = path_1.default.join(site_1.Site.DATA_PATH, _a.pathRel(url));
        (0, fs_1.writeFile)(fullPath, data, "utf8", (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                log_1.Log.dev(err);
                resolve(false);
            }
            else {
                yield _a.loadCurrentPath();
                resolve(true);
            }
        }));
    }
    else {
        resolve(false);
    }
});
DataEngine.navigateTo = (url) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    const original = _a.currentPath;
    _a.currentPath = url;
    if (yield _a.loadCurrentPath()) {
        resolve(true);
    }
    else {
        _a.currentPath = original;
        resolve(false);
    }
}));
DataEngine.back = () => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    const relPath = _a.pathRel();
    if (relPath) {
        const originalPath = _a.currentPath;
        const newPath = relPath.split("/");
        newPath.pop();
        const sliced = "/" + newPath.join("/");
        _a.currentPath = sliced;
        if (yield _a.loadCurrentPath()) {
            resolve(true);
        }
        else {
            _a.currentPath = originalPath;
            resolve(false);
        }
    }
    else {
        resolve(false);
    }
}));
DataEngine.start = () => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    const ensureFolderIsCreated = () => new Promise((res, rej) => {
        if ((0, fs_1.existsSync)(site_1.Site.DATA_PATH)) {
            res(true);
        }
        else {
            (0, fs_1.mkdir)(site_1.Site.DATA_PATH, { recursive: false }, err => {
                if (err) {
                    log_1.Log.dev(err);
                    res(false);
                }
                else {
                    res(true);
                }
            });
        }
    });
    const dirReady = yield ensureFolderIsCreated();
    if (dirReady) {
        resolve(yield _a.loadCurrentPath());
    }
    else {
        resolve(false);
    }
}));
DataEngine.stop = () => new Promise((resolve, reject) => {
    resolve(true);
});
