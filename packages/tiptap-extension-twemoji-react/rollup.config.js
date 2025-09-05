import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";
import postcss from "rollup-plugin-postcss";
import sass from "sass";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import json from "@rollup/plugin-json";
import alias from "@rollup/plugin-alias";
import url from "@rollup/plugin-url";
import terser from "@rollup/plugin-terser";
import path from "path";
import copy from "rollup-plugin-copy";

import { visualizer } from "rollup-plugin-visualizer";

const isDev = process.env.BUILD === "dev";
const isProd = !isDev;
const isReport = process.env.BUILD === "report";

import dts from "rollup-plugin-dts";
import tsconfigPaths from "rollup-plugin-tsconfig-paths";

function jsonMinifier(content, filename) {
  if (filename.endsWith(".json")) {
    return JSON.stringify(JSON.parse(content.toString()));
  }
  return content;
}

function tsMinifier(content) {
  const text = content.toString();
  return text.replace(/\s{2,}/g, " ").trim();
}

const plugins = [
  peerDepsExternal(),
  resolve({
    extensions: [".mjs", ".js", ".json", ".ts", ".tsx"],
  }),
  commonjs(),
  esbuild({
    target: "esnext",
    tsconfig: "tsconfig.json",
    minify: isProd,
  }),
  postcss({
    inject: true,
    minimize: isProd
      ? {
          preset: ["default", { calc: false }], // Disable calc optimization
        }
      : false,
    extensions: [".scss", ".css"],
    use: [["sass", { implementation: sass }]],
    url: true,
  }),
  json(),
  copy({
    targets: [
      {
        src: "src/data/emoji-sprite-map.json",
        dest: "dist/data",
        transform: jsonMinifier,
      },
      {
        src: "src/data/emoji-substring-index.json",
        dest: "dist/data",
        transform: jsonMinifier,
      },
      {
        src: "src/data/emoji-emoticons-map.json",
        dest: "dist/data",
        transform: jsonMinifier,
      },
      {
        src: "src/data/emoji-shortcodes-map.json",
        dest: "dist/data",
        transform: jsonMinifier,
      },
      {
        src: "src/data/emoji-sprite-order.ts",
        dest: "dist/data",
        transform: tsMinifier,
      },
      {
        src: "src/data/emoji-shortcodes-pattern.ts",
        dest: "dist/data",
        transform: tsMinifier,
      },
    ],
  }),
  alias({
    entries: [{ find: "@", replacement: path.resolve("src") }],
  }),
  url({
    include: ["**/*.webp"],
    limit: 0,
    emitFiles: true,
    fileName: "assets/[name][hash][extname]",
  }),
  isReport &&
    visualizer({
      filename: "stats.html",
      open: true, // auto opens in browser
      gzipSize: true,
      brotliSize: true,
    }),
  isProd && terser(),
].filter(Boolean);

export default [
  {
    input: "src/index.ts",
    output: [
      {
        dir: "dist",
        format: "esm",
        sourcemap: isDev ? "inline" : true,
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].js",
      },
      {
        dir: "dist",
        format: "cjs",
        sourcemap: isDev ? "inline" : true,
        entryFileNames: "[name].cjs",
        chunkFileNames: "chunks/[name].cjs",
      },
    ],
    external: [
      "lucide-react",
      "lodash-es",
      "react-dropzone",
      "react-window",
      /emoji-substring-index\.json$/,
      /emoji-sprite-map\.json$/,
      /emoji-emoticons-map\.json$/,
      /emoji-shortcodes-map\.json$/,
      /emoji-sprite-order\.ts$/,
      /emoji-shortcodes-pattern\.ts$/,
    ],
    plugins,
    preserveEntrySignatures: "strict",
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [tsconfigPaths(), dts()],
    external: [/\.css$/, /\.scss$/],
  },
];
