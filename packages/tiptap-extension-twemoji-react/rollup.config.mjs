import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import json from "@rollup/plugin-json";
import alias from "@rollup/plugin-alias";
import url from "@rollup/plugin-url";
import path from "path";

// styling
import postcss from "rollup-plugin-postcss";
import sass from "sass";

const isDev = process.env.BUILD === "dev";
const isProd = !isDev;

const external = ["react", "react-dom"];

const plugins = [
  peerDepsExternal(),
  resolve(),
  commonjs(),
  typescript({ tsconfig: "./tsconfig.json" }),
  isProd && terser(),
  postcss({
    inject: true,
    minimize: isProd,
    extensions: [".scss", ".css"],
    use: [["sass", { implementation: sass }]],
    config: { path: "./postcss.config.js" },
    url: true,
  }),
  json(),
  alias({
    entries: [{ find: "@", replacement: path.resolve("src") }],
  }),
  url({
    include: ["**/*.webp"],
    limit: 0, 
    emitFiles: true,
    fileName: "assets/[name][hash][extname]",
  }),
].filter(Boolean);

/** @type {import('rollup').RollupOptions[]} */
const configs = [
  // Main entry build
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.cjs",
        format: "cjs",
        sourcemap: isDev ? "inline" : true,
      },
      {
        file: "dist/index.js",
        format: "esm",
        sourcemap: isDev ? "inline" : true,
      },
    ],
    external,
    plugins,
  },

  // Popover entry build
  {
    input: "src/components/popover/index.ts",
    output: [
      {
        file: "dist/popover/index.js",
        format: "esm",
        sourcemap: isDev ? "inline" : true,
      },
      {
        file: "dist/popover/index.cjs",
        format: "cjs",
        sourcemap: isDev ? "inline" : true,
      },
    ],
    external,
    plugins,
  },

  // DTS for main entry
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
    external: [/\.css$/, /\.scss$/],
  },

  // DTS for popover
  {
    input: "src/components/popover/index.ts",
    output: [{ file: "dist/popover/index.d.ts", format: "es" }],
    plugins: [dts()],
    external: [/\.css$/, /\.scss$/],
  },
];

export default configs;
