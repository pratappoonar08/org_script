"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTitleCase = void 0;
const toTitleCase = (str) => {
    return str
        .toLowerCase()
        .split(/\s+/) // split by any whitespace
        .map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    })
        .join(' ');
};
exports.toTitleCase = toTitleCase;
