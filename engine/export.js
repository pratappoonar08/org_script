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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportEngine = void 0;
const log_1 = require("./../lib/log");
const data_1 = require("./data");
const jszip_1 = __importDefault(require("jszip"));
class ExportEngine {
}
exports.ExportEngine = ExportEngine;
_a = ExportEngine;
ExportEngine.imagePromptTemplate = (org, prompts) => {
    let t = `create these images depicting ${org}. Let them be as realistic as possible. Use a suitable color progression across the images, with dimension 9:16.`;
    let i = 1;
    for (const p of prompts) {
        t += `\n\n${i}. ${p}`;
        i++;
    }
    return t;
};
ExportEngine.captionPromptTemplate = (hook, story, close) => {
    let p = `Below are the scripts for a reels/shorts video of mine.`;
    p += `\n\n## HOOK\n${hook}`;
    p += `\n\n## STORY\n${story.join("\n\n")}`;
    p += `\n\n## CLOSE\n${close}`;
    p += `\n\n## TASK`;
    p += `\nI need:`;
    p += `\n1. Video caption with necessary hashtags (everything under 103 characters). Should be enticing enough to drive engagement, or even cause mild rage (rage-bait). This would be used on platforms like Youtube.`;
    p += `\n\n2. Video description, a brief description, a few paragraphs, where necessary, with all necessary tags and hashtags, following the current trends on social media, to drive engagement and discovery. This would also be used on platforms like youtube.`;
    p += `\n\n3. 3. For platforms with one text field per video (only caption, neither title nor description. e.g. facebook, instagram, tiktok). I need a video caption (with necessary hashtags), aimed at promoting clicks, engagements, e.t.c. May follow current trends or may get as creative as possible, based on the topic of the video.`;
    p += `\n\nANSWER 1\n\nANSWER 2\n\nANSWER 3`;
    return p;
};
ExportEngine.overlayTemplate = (hook, story, close, l) => {
    let p = (new Array(l)).fill(1).map((_, i) => `${(i + 1)}${i == 0 ? ' 0s' : ''}`).join('\n');
    if (hook)
        p += `\n\nHOOK\n${hook}`;
    if (!!story.length)
        p += `\n\nSTORY\n${story.join('\n\n')}`;
    if (close)
        p += `\n\nCLOSE\n${close}`;
    return p;
};
ExportEngine.route = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const org = decodeURIComponent(req.params.org || '');
    const file = decodeURIComponent(req.params.file || '');
    const url = `/${org}/${file}`;
    const data = yield data_1.DataEngine.read(url);
    if (data) {
        let p = null;
        try {
            p = JSON.parse(data);
        }
        catch (error) {
        }
        finally {
            if (p) {
                let images = [...p.output.visuals.story.map(x => x.midjourney_prompt)];
                if (p.output.visuals.hook.midjourney_prompt) {
                    images.unshift(p.output.visuals.hook.midjourney_prompt);
                }
                if (p.output.visuals.close.midjourney_prompt) {
                    images.push(p.output.visuals.close.midjourney_prompt);
                }
                const imagePrompt = _a.imagePromptTemplate(org, images);
                const scripts = ([
                    p.output.script.hook,
                    ...p.output.script.story,
                    p.output.script.close,
                ]).join('\n\n');
                const captionPrompt = _a.captionPromptTemplate(p.output.script.hook, p.output.script.story, p.output.script.close);
                const overlay = _a.overlayTemplate((p.output.production.text_overlays.filter(x => x.section === 'hook')[0] || {}).text || '', p.output.production.text_overlays.filter(x => x.section === 'story').map(x => x.text), (p.output.production.text_overlays.filter(x => x.section === 'close')[0] || {}).text || '', 2 + p.output.script.story.length);
                try {
                    const zip = new jszip_1.default();
                    zip.file('image_prompt.txt', imagePrompt);
                    zip.file(`scripts.txt`, scripts);
                    zip.file(`overlays_and_timestamps.txt`, overlay);
                    zip.file(`caption_prompt.txt`, captionPrompt);
                    const content = yield zip.generateAsync({ type: 'nodebuffer' });
                    res.setHeader("Content-Disposition", "attachment; filename=" + org + ".zip");
                    res.setHeader("Content-Type", "application/zip");
                    res.send(content);
                    // res.send(overlay);
                }
                catch (error) {
                    log_1.Log.dev(error);
                    res.status(500).send("Error generating zip");
                }
            }
            else {
                res.status(500).send("Error parsing data file");
            }
        }
    }
    else {
        res.sendStatus(404);
    }
});
