import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
    plugins: [
        vue(),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern",
            },
        },
    },
    build: {
        sourcemap: true,
        lib: {
            entry: path.resolve(__dirname, "index.js"),
            name: "LumaPlayer",
            fileName: "luma-player"
        },
        rollupOptions: {
            // Externalise deps to not bundle them
            external: ["vue"],
            output: [
                {
                    format: "es",
                    entryFileNames: "luma-player.esm.js",
                },
                {
                    format: "umd",
                    entryFileNames: "luma-player.umd.js",
                    name: "LumaPlayer",
                    globals: {
                        vue: "Vue"
                    }
                }
            ],
        }
    }
});
