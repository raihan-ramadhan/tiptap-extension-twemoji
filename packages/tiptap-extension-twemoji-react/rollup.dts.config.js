import dts from "rollup-plugin-dts";
import tsconfigPaths from "rollup-plugin-tsconfig-paths";

const plugins = [tsconfigPaths(), dts()];

export default [
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins,
    external: [/\.css$/, /\.scss$/],
  },
  {
    input: "src/components/popover/index.ts",
    output: [{ file: "dist/popover.d.ts", format: "es" }],
    plugins,
    external: [/\.css$/, /\.scss$/],
  },
];
