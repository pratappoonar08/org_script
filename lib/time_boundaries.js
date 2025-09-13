"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeBoundaries = void 0;
const timeBoundaries = (ts, type) => {
    const date = new Date(ts);
    let start;
    let end;
    switch (type) {
        case 'day':
            start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
            end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
            break;
        case 'week': {
            const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
            const diffToMonday = (dayOfWeek + 6) % 7; // Adjust to make Monday the first day of the week
            start = new Date(date);
            start.setDate(date.getDate() - diffToMonday);
            start.setHours(0, 0, 0, 0);
            end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            break;
        }
        case 'month':
            start = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
            end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
            break;
        case 'year':
            start = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
            end = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
            break;
        default:
            start = new Date(0);
            end = new Date(0);
    }
    return { start: start.getTime(), end: end.getTime() };
};
exports.timeBoundaries = timeBoundaries;
