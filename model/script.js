"use strict";
// === Script Section ===
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidScript = isValidScript;
// === Type Guards ===
function isValidVisualItem(obj) {
    return (obj &&
        typeof obj === 'object' &&
        typeof obj.description === 'string' &&
        typeof obj.midjourney_prompt === 'string');
}
function isValidVoiceOverConfig(obj) {
    return (obj &&
        typeof obj.tool === 'string' &&
        typeof obj.voice === 'string' &&
        typeof obj.settings === 'string' &&
        typeof obj.export_format === 'string');
}
function isValidMusicConfig(obj) {
    return (obj &&
        typeof obj.style === 'string' &&
        typeof obj.source === 'string' &&
        typeof obj.notes === 'string');
}
function isValidTextOverlay(obj) {
    return (obj &&
        typeof obj.text === 'string' &&
        typeof obj.color === 'string' &&
        typeof obj.animation === 'string' &&
        ['hook', 'story', 'close'].includes(obj.section));
}
function isValidAutomationConfig(obj) {
    return (obj &&
        typeof obj.script === 'string' &&
        typeof obj.visuals === 'string' &&
        typeof obj.editing === 'string' &&
        typeof obj.scheduling === 'string' &&
        typeof obj.engagement === 'string');
}
// === Final Script Validator ===
function isValidScript(obj) {
    if (typeof obj !== 'object' || obj === null)
        return false;
    const s = obj.script;
    const v = obj.visuals;
    const p = obj.production;
    // Validate script section
    if (!s ||
        typeof s.hook !== 'string' ||
        typeof s.close !== 'string' ||
        !Array.isArray(s.story) ||
        !s.story.every((p) => typeof p === 'string'))
        return false;
    // Validate visuals section
    if (!v ||
        !isValidVisualItem(v.hook) ||
        !isValidVisualItem(v.close) ||
        !Array.isArray(v.story) ||
        !v.story.every(isValidVisualItem))
        return false;
    // Cross-field: script.story and visuals.story must match in length
    if (s.story.length !== v.story.length)
        return false;
    // Validate production section
    if (!p ||
        !isValidVoiceOverConfig(p.voice_over) ||
        !isValidMusicConfig(p.music) ||
        !Array.isArray(p.text_overlays) ||
        !p.text_overlays.every(isValidTextOverlay) ||
        !isValidAutomationConfig(p.automation))
        return false;
    return true;
}
