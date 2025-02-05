import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    sourcemap: true,
    clean: true,
    format: ["esm"],
    external: [
        "dotenv",
        "fs",
        "path",
        "@reflink/reflink",
        "@node-llama-cpp",
        "https",
        "http",
        "agentkeepalive",
    ],
    target: 'esnext',
    legacyOutput: false,
    esbuildOptions(options) {
        options.resolveExtensions = ['.ts', '.js', '.tsx', '.jsx']
    }
});
