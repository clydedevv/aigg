## Eliza Integration

Register in your character config:

```typescript
import { perplexityPlugin } from "@elizaos/plugin-perplexity";
import { bootstrapPlugin } from "@eliza/plugin-bootstrap";

export default {
    plugins: [
        bootstrapPlugin, // Required for core functionality
        perplexityPlugin
    ],
    // ... rest of config
};
```

## Action Response Format

```typescript
interface PerplexityResponse {
    analysis: string;
    citations: string[];
    model: "sonar-pro";
    created: number; // Unix timestamp
}
```

## Temporary Installation

While we resolve build system issues, use this direct import:

```ts
import { perplexityPlugin } from "@elizaos/plugin-perplexity/dist/index.js";
```

> Note: Core package must be built first 