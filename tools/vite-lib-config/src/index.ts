import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

type Options = {
  dirname: string;
  externals?: string[];
};

export default (opts: Options) =>
  defineConfig({
    build: {
      lib: {
        entry: resolve(opts.dirname, "src/index.ts"),
        fileName: "index",
        formats: ["es", "cjs"],
      },
      rollupOptions: {
        ...opts.externals && { external: opts.externals },
      },
    },
    plugins: [typeof dts !== "undefined" && dts()].filter(Boolean),
  });
