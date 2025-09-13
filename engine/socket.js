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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEngine = void 0;
const extract_json_1 = require("./../lib/extract_json");
const script_1 = require("./../model/script");
const log_1 = require("../lib/log");
const data_1 = require("./data");
const site_1 = require("../site");
const pfile_1 = require("../model/pfile");
const prompt_1 = require("./prompt");
const groq_1 = require("./groq");
class SocketEngine {
}
exports.SocketEngine = SocketEngine;
_a = SocketEngine;
SocketEngine.initialize = (io) => {
    _a.io = io;
    _a.runOnce();
};
SocketEngine.runOnce = () => {
    if (_a.io) {
        _a.io.use((socket, next) => {
            var _b;
            let user = (_b = socket.request.session) === null || _b === void 0 ? void 0 : _b.user;
            let isDev = (!site_1.Site.PRODUCTION) && (socket.request.headers.origin || "").includes(":4200");
            let canAccess = site_1.Site.AUTH ? (user ? true : (isDev)) : true;
            if (canAccess) {
                next();
            }
            else {
                return next(new Error("Session expired. Please login again."));
            }
        }).on("connection", (socket) => {
            log_1.Log.dev(`Socket client connected with id ${socket.id}.`);
            socket.on("HELLO_SERVER", () => {
                socket.emit("HELLO_CLIENT", {
                    brand: site_1.Site.TITLE,
                    year: (new Date()).getFullYear(),
                    url: site_1.Site.URL,
                    auth: site_1.Site.AUTH,
                });
                _a.broadcastRouteData(socket);
            });
            socket.on("ADD_SUBFOLDER", (url, cb) => __awaiter(void 0, void 0, void 0, function* () {
                const v = yield data_1.DataEngine.addSubfolder(url);
                if (v) {
                    _a.broadcastRouteData(socket);
                }
                cb(v);
            }));
            socket.on("DELETE", (url, cb) => __awaiter(void 0, void 0, void 0, function* () {
                const v = yield data_1.DataEngine.delete(url);
                if (v) {
                    _a.broadcastRouteData(socket);
                }
                cb(v);
            }));
            socket.on("NAVIGATE_TO", (url, cb) => __awaiter(void 0, void 0, void 0, function* () {
                const v = yield data_1.DataEngine.navigateTo(url);
                if (v) {
                    _a.broadcastRouteData(socket);
                }
                cb(v);
            }));
            socket.on("NEW_FILE", (url, base_ideas, cb) => __awaiter(void 0, void 0, void 0, function* () {
                const v = yield data_1.DataEngine.write(url + '/' + `${Date.now()}.json`, JSON.stringify((0, pfile_1.createEmptyPFile)(base_ideas)));
                if (v) {
                    _a.broadcastRouteData(socket);
                }
                cb(v);
            }));
            socket.on("SAVE_FILE", (url, content, cb) => __awaiter(void 0, void 0, void 0, function* () {
                const v = yield data_1.DataEngine.write(url, content);
                cb(v);
            }));
            socket.on("COPY_FILE", (url, content, cb) => __awaiter(void 0, void 0, void 0, function* () {
                const newURL = url.replace(/[\d]+\.json/, `${Date.now()}.json`);
                const v = yield data_1.DataEngine.write(newURL, content);
                if (v) {
                    _a.broadcastRouteData(socket);
                }
                cb(v ? newURL : null);
            }));
            socket.on("PROMPT", (url, ideas, cb) => __awaiter(void 0, void 0, void 0, function* () {
                const parts = url.split("/").filter(x => x.length > 0);
                const organism = parts[0];
                const { system, user } = prompt_1.PromptEngine.getMainPrompt(organism);
                const res = yield groq_1.GroqEngine.direct({
                    messages: [
                        {
                            role: 'system',
                            content: system,
                        },
                        {
                            role: 'user',
                            content: user,
                        }
                    ]
                });
                if (res.succ) {
                    let p = null;
                    try {
                        try {
                            p = JSON.parse(res.message);
                        }
                        catch (error) {
                            p = (0, extract_json_1.extractJsonFromText)(res.message);
                        }
                    }
                    catch (error) {
                        p = null;
                    }
                    finally {
                        if (p) {
                            if ((0, script_1.isValidScript)(p)) {
                                const f = {
                                    base_ideas: ideas,
                                    output: p,
                                };
                                const v = yield data_1.DataEngine.write(url, JSON.stringify(f));
                                cb(v, 'Success');
                            }
                            else {
                                cb(false, 'Generated script is not valid. Please try again.');
                            }
                        }
                        else {
                            cb(false, 'Could not parse LLM response.');
                        }
                    }
                }
                else {
                    cb(false, res.extra.reason || 'LLM inference error.');
                }
            }));
            socket.on("READ_FILE", (url, cb) => __awaiter(void 0, void 0, void 0, function* () {
                const v = yield data_1.DataEngine.read(url);
                if (!v) {
                    cb(v);
                }
                else {
                    let p = null;
                    try {
                        p = JSON.parse(v);
                    }
                    catch (error) {
                    }
                    finally {
                        if (p) {
                            cb(p);
                        }
                        else {
                            cb((0, pfile_1.createEmptyPFile)());
                        }
                    }
                }
            }));
            socket.on("BACK", (cb) => __awaiter(void 0, void 0, void 0, function* () {
                const v = yield data_1.DataEngine.back();
                if (v) {
                    _a.broadcastRouteData(socket);
                }
                cb(v);
            }));
            socket.on("disconnect", () => {
                log_1.Log.dev(`Socket client with id ${socket.id}.`);
            });
        });
    }
};
SocketEngine.broadcastRouteData = (socket) => {
    socket.emit("ROUTE_UPDATE", data_1.DataEngine.path.getValue());
};
