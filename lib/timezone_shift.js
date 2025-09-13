"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timezoneShift = void 0;
const timezoneShift = () => {
    // This seems irrelevant, so
    return 0;
    const offsetInMinutes = new Date().getTimezoneOffset(); // Offset in minutes from UTC
    return offsetInMinutes * 60 * 1000; // Convert to milliseconds
};
exports.timezoneShift = timezoneShift;
