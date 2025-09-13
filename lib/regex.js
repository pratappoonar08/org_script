"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegexPatterns = void 0;
class RegexPatterns {
}
exports.RegexPatterns = RegexPatterns;
// static path = /^\/(?:$|[a-zA-Z0-9\-_]+(?:\/(\d{4})(?:\/(\d+)\.json)?)?)$/;
// static path = /^\/(?:$|[a-zA-Z0-9\-_ ]+(?:\/(\d{4})(?:\/(\d+)\.json)?)?)$/;
RegexPatterns.path = /^\/(?:$|[a-zA-Z0-9\-_ ]+(?:(?:\/(\d+)\.json)?)?)$/;
