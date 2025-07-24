import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";
import alias from "@rollup/plugin-alias";
import path from "path";
import url from "@rollup/plugin-url";
import sass from "sass";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const packageJson = require("./package.json");

const isDev = process.env.BUILD === "dev";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('rollup').RollupOptions[]} */
const configs = [];

// Main JS/TS build
configs.push(
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      !isDev && terser(),
      postcss({
        inject: true,
        minimize: !isDev,
        extensions: [".scss", ".css"],
        use: [
          [
            "sass",
            {
              implementation: sass,
            },
          ],
        ],
      }),
      json(),
      alias({
        entries: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
      }),
      url({
        include: ["**/*.png", "**/*.jpg", "**/*.svg"],
        limit: 0,
        fileName: "[name].[hash][extname]",
        destDir: "dist/assets",
      }),
    ].filter(Boolean),
    external: ["react", "react-dom"],
    watch: isDev
      ? {
          include: "src/**",
          clearScreen: false,
        }
      : undefined,
  },
  {
    input: "src/index.ts",
    output: [{ file: packageJson.types, format: "es" }],
    plugins: [dts()],
    external: [/\.css$/],
  }
);

export default configs;
