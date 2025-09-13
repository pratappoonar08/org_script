"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyPFile = void 0;
const createEmptyPFile = (base_ideas = []) => {
    return {
        base_ideas: base_ideas,
        output: {
            script: {
                hook: '',
                story: [],
                close: '',
            },
            visuals: {
                hook: {
                    description: '',
                    midjourney_prompt: '',
                },
                story: [],
                close: {
                    description: '',
                    midjourney_prompt: '',
                },
            },
            production: {
                voice_over: {
                    tool: '',
                    voice: '',
                    settings: '',
                    export_format: '',
                },
                music: {
                    style: '',
                    source: '',
                    notes: '',
                },
                text_overlays: [],
                automation: {
                    script: '',
                    visuals: '',
                    editing: '',
                    scheduling: '',
                    engagement: '',
                },
            },
        }
    };
};
exports.createEmptyPFile = createEmptyPFile;
