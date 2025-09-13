"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONSafeParse = void 0;
const JSONSafeParse = (str, isArray = false) => {
    try {
        let obj = JSON.parse(str);
        return obj;
    }
    catch (error) {
        return isArray ? [] : {};
    }
};
exports.JSONSafeParse = JSONSafeParse;
