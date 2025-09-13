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
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const site_1 = require("./site");
if (site_1.Site.FORCE_FAMILY_4) {
    https_1.default.globalAgent.options.family = 4;
}
const express_1 = __importDefault(require("express"));
const terminal_1 = require("./engine/terminal");
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const log_1 = require("./lib/log");
const socket_io_1 = require("socket.io");
const res_1 = require("./lib/res");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const socket_1 = require("./engine/socket");
const express_session_1 = __importDefault(require("express-session"));
const auth_1 = require("./engine/auth");
const sessMid = (0, express_session_1.default)({
    secret: site_1.Site.AUTH_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
});
const CACHE_PROD = 1000 * 60 * 60 * 24 * 30;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: site_1.Site.PRODUCTION ? "/" : "*",
    }
});
app.use((0, cors_1.default)({
    origin: '*',
    optionsSuccessStatus: 204,
}));
app.disable("x-powered-by");
app.disable('etag');
app.use(body_parser_1.default.json({ limit: "35mb" }));
app.use(body_parser_1.default.urlencoded({
    extended: true,
    limit: "35mb",
    parameterLimit: 50000,
}));
app.use((req, res, next) => {
    if (req.method === "POST" && (!req.body)) {
        res.status(400).send(res_1.GRes.err("NO_BODY"));
    }
    else {
        next();
    }
});
app.use(sessMid);
io.engine.use(sessMid);
app.use(auth_1.authEntry);
app.use(express_1.default.static(path_1.default.join(site_1.Site.ROOT, "public"), {
    maxAge: site_1.Site.PRODUCTION ? CACHE_PROD : 0,
}));
app.use((req, res) => {
    res.sendFile(path_1.default.join(site_1.Site.ROOT, "public", "index.html"));
});
process.on('exit', (code) => __awaiter(void 0, void 0, void 0, function* () {
    // NOTHING FOR NOW
}));
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    log_1.Log.dev('Process > Received SIGINT.');
    const l = yield (0, terminal_1.stopEngine)();
    process.exit(0);
}));
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    log_1.Log.dev('Process > Received SIGTERM.');
    const l = yield (0, terminal_1.stopEngine)();
    process.exit(0);
}));
process.on('uncaughtException', (err) => __awaiter(void 0, void 0, void 0, function* () {
    log_1.Log.dev('Process > Unhandled exception caught.');
    console.log(err);
    if (site_1.Site.EXIT_ON_UNCAUGHT_EXCEPTION) {
        const l = yield (0, terminal_1.stopEngine)();
        process.exit(0);
    }
}));
process.on('unhandledRejection', (err, promise) => __awaiter(void 0, void 0, void 0, function* () {
    log_1.Log.dev('Process > Unhandled rejection caught.');
    console.log("Promise:", promise);
    console.log("Reason:", err);
    if (site_1.Site.EXIT_ON_UNHANDLED_REJECTION) {
        const l = yield (0, terminal_1.stopEngine)();
        process.exit(0);
    }
}));
log_1.Log.flow([site_1.Site.TITLE, 'Attempting to start engines.'], 0);
(0, terminal_1.startEngine)().then(r => {
    if (r) {
        server.listen(site_1.Site.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
            socket_1.SocketEngine.initialize(io);
            log_1.Log.flow([site_1.Site.TITLE, 'Sucessfully started all engines.'], 0);
            log_1.Log.flow([site_1.Site.TITLE, `Running at http://127.0.0.1:${site_1.Site.PORT}`], 0);
        }));
    }
    else {
        log_1.Log.flow([site_1.Site.TITLE, 'Failed to start all engines.'], 0);
        process.exit(0);
    }
});
