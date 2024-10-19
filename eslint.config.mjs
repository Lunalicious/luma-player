import vue from "eslint-plugin-vue";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("eslint:recommended", "plugin:vue/vue3-essential"), {
    plugins: {
        vue,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        ecmaVersion: "latest",
        sourceType: "module",
    },

    rules: {
        "vue/require-valid-default-prop": ["off"],
        indent: ["error", 4],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        eqeqeq: ["error", "smart"],
        "func-style": ["error", "expression"],
        "prefer-arrow-callback": ["error"],
        "no-else-return": ["error"],
        "no-eval": ["error"],
        "prefer-const": ["error"],
        "no-empty-function": ["error"],
    },
}];
