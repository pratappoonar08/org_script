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
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopEngine = exports.startEngine = void 0;
const data_1 = require("./data");
const startEngine = () => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    const loaded = (yield data_1.DataEngine.start());
    resolve(loaded);
}));
exports.startEngine = startEngine;
const stopEngine = () => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    const conclude = () => __awaiter(void 0, void 0, void 0, function* () {
        const ended = yield Promise.all([
            data_1.DataEngine.stop(),
        ]);
        resolve(ended.every(v => v === true));
    });
    conclude();
}));
exports.stopEngine = stopEngine;
