"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Site = void 0;
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const args = process.argv.slice(2);
(0, dotenv_1.config)({
    path: args[0] || ".env",
});
class Site {
}
exports.Site = Site;
Site.TITLE = process.env["TITLE"] || "CMS";
Site.BRAND = process.env["BRAND"] || "Nari Drift";
Site.ROOT = process.cwd() || __dirname;
Site.PORT = parseInt(process.env["PORT"] || "0") || 3000;
Site.PRODUCTION = (process.env["PRODUCTION"] || "").toLowerCase() == "true";
Site.FORCE_FAMILY_4 = (process.env["FORCE_FAMILY_4"] || "").toLowerCase() == "true";
Site.EXIT_ON_UNCAUGHT_EXCEPTION = (process.env["EXIT_ON_UNCAUGHT_EXCEPTION"] || "").toLowerCase() == "true";
Site.EXIT_ON_UNHANDLED_REJECTION = (process.env["EXIT_ON_UNHANDLED_REJECTION"] || "").toLowerCase() == "true";
Site.URL = Site.PRODUCTION ? (process.env["PROD_URL"] || "") : `http://localhost:${Site.PORT}`;
Site.MAX_ALLOWED_FLOG_LOG_WEIGHT = (_a = parseInt(process.env["MAX_ALLOWED_FLOG_LOG_WEIGHT"] || "0")) !== null && _a !== void 0 ? _a : 5;
Site.GROQ_KEY = process.env["GROQ_KEY"] || "";
Site.GROQ_ENDPOINT = process.env["GROQ_ENDPOINT"] || "";
Site.GROQ_MODELS = (process.env["GROQ_MODELS"] || "").split(" ").filter(x => x.length > 0);
Site.GROQ_REQUEST_TIMEOUT_MS = parseInt(process.env["GROQ_REQUEST_TIMEOUT_MS"] || "0") || Infinity;
Site.GROQ_MAX_RETRIES = parseInt(process.env["GROQ_MAX_RETRIES"] || "0") || 1;
Site.GROQ_HTTP_TIMEOUT_MS = parseInt(process.env["GROQ_HTTP_TIMEOUT_MS"] || "0") || 60000;
Site.GROQ_USE = (process.env["GROQ_USE"] || "").toLowerCase() == "true";
Site.GROQ_MAX_HISTORY_COUNT = parseInt(process.env["GROQ_MAX_HISTORY_COUNT"] || "0") || 5;
Site.DATA_PATH = path_1.default.join(Site.ROOT, `data_${process.env.DATA_POSTSTRING || "default"}`);
Site.AUTH = (process.env["AUTH"] || "").toLowerCase() == "true";
Site.AUTH_USER = process.env["AUTH_USER"] || "root";
Site.AUTH_PASS = process.env["AUTH_PASS"] || "123456";
Site.AUTH_SESSION_SECRET = process.env["AUTH_SESSION_SECRET"] || "irdh4efurwgi";
Site.AUTH_MAX_ATTEMPTS = parseInt(process.env["AUTH_MAX_ATTEMPTS"] || "0") || 10;
