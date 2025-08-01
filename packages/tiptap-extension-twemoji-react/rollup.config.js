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
import { visualizer } from "rollup-plugin-visualizer";

const isDev = process.env.BUILD === "dev";
const isProd = !isDev;
const isReport = process.env.BUILD === "report";

const external = ["react", "react-dom"];

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
  isProd && terser(),
  postcss({
    inject: true,
    minimize: isProd
      ? {
          preset: ["default", { calc: false }], // Disable calc optimization
        }
      : false,
    extensions: [".scss", ".css"],
    use: [["sass", { implementation: sass }]],
    config: { path: "./postcss.config.js" },
    url: true,
    exclude: "infinity",
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
  isReport &&
    visualizer({
      filename: "stats.html",
      open: true, // auto opens in browser
      gzipSize: true,
      brotliSize: true,
    }),
].filter(Boolean);

const entries = [
  { input: "src/index.ts", outDir: "" },
  { input: "src/components/popover/index.ts", outDir: "popover" },
];

export default entries.map(({ input, outDir }) => ({
  input,
  output: [
    {
      file: `dist/${outDir ? `${outDir}/` : ""}index.js`,
      format: "esm",
      sourcemap: isDev ? "inline" : true,
    },
    {
      file: `dist/${outDir ? `${outDir}/` : ""}index.cjs`,
      format: "cjs",
      sourcemap: isDev ? "inline" : true,
    },
  ],
  external,
  plugins,
}));
