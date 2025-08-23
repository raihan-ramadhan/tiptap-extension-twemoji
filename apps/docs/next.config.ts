import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import remarkPrism from "remark-prism";
import remarkSectionize from "remark-sectionize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ofqhpepsytodemxfrhrc.supabase.co",
        pathname: "/storage/v1/object/sign/emojis/**",
      },
      {
        protocol: "https",
        hostname: "ofqhpepsytodemxfrhrc.supabase.co",
        pathname:
          "/storage/v1/object/public/tiptap-extension-twemoji-assets/**",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/gh/jdecked/twemoji@16.0.1/assets/**",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/gh/primer/octicons@16.1.1/icons/**", // github icon cdn assets
      },
    ],
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [remarkSectionize, remarkPrism as any],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behaviour: "append",
          properties: {
            ariaHidden: true,
            tabIndex: -1,
            className: "hash-link",
          },
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
