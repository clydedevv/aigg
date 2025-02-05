import { perplexityPlugin } from "@elizaos/plugin-perplexity";

export function validatePlugin() {
    if (!perplexityPlugin.actions.length) {
        throw new Error('Perplexity actions not loaded');
    }
    console.log('✅ Plugin structure valid');
} 