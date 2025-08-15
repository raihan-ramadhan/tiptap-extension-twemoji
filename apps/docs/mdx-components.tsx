import type { MDXComponents } from "mdx/types";
import Link from "next/link";

const components: MDXComponents = {
  // Headings
  h1: ({ children, ...props }) => (
    <h1 className="text-4xl font-bold mt-8 mb-4" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-2xl font-semibold mt-6 mb-3" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-xl font-medium mt-4 mb-2" {...props}>
      {children}
    </h3>
  ),

  // Paragraphs
  p: ({ children, ...props }) => (
    <p className="leading-7 mb-4 text-gray-700 dark:text-gray-300" {...props}>
      {children}
    </p>
  ),

  // Inline code
  code: ({ children, ...props }) => (
    <code
      className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-sm text-pink-600"
      {...props}
    >
      {children}
    </code>
  ),

  // Code blocks
  pre: ({ children, ...props }) => (
    <pre
      className="rounded-lg bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm"
      {...props}
    >
      {children}
    </pre>
  ),

  // Lists
  ul: ({ children, ...props }) => (
    <ul className="list-disc pl-6 mb-4 space-y-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-1" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-6" {...props}>
      {children}
    </li>
  ),

  // Links
  a: ({ children, ...props }) => (
    <Link className="text-blue-600 hover:underline" {...props}>
      {children}
    </Link>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
