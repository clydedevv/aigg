import { Plugin } from "@elizaos/core";
import { perplexityAction } from './actions/perplexity.js';

export const perplexityPlugin: Plugin = {
    name: 'Perplexity Analysis',
    description: 'Real-time market analysis using Perplexity AI',
    actions: [perplexityAction],
    services: []
};

export default perplexityPlugin;