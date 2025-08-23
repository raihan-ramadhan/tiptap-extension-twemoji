import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import CodeBlock from "./components/mdx-ui/CodeBlock";
import { cn } from "./lib/utils";

function extractText(children: any): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (children?.props?.children) return extractText(children.props.children);
  return "";
}

const components: MDXComponents = {
  // Headings
  h1: ({ children, ...props }) => (
    <h1 className="text-4xl font-bold mt-8 mb-4 max-[767px]:mt-3" {...props}>
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
    <p
      className="leading-7 mb-4 mt-2 text-gray-700 dark:text-gray-300"
      {...props}
    >
      {children}
    </p>
  ),

  // Inline code
  code: ({ children, ...props }) => (
    <code
      className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-[0.85em]"
      {...props}
    >
      {children}
    </code>
  ),

  // Code blocks
  pre: (props: any) => <CodeBlock>{props.children}</CodeBlock>,

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
    <Link className="underline" {...props}>
      {children}
    </Link>
  ),

  // hr
  hr: (props) => (
    <hr
      className="border-t border-gray-200 dark:border-gray-700 my-8"
      {...props}
    />
  ),
  H2: ({ children, iconUrl, iconAlt, className, iconClassName, ...props }) => {
    const text = extractText(children);

    return (
      <h2
        className={cn(
          `flex items-start gap-2 text-2xl font-semibold mt-6 mb-3`,
          className
        )}
        {...props}
      >
        {iconUrl && (
          <span className="flex-shrink-0 leading-none mt-0.5">
            <img
              src={iconUrl}
              alt={iconAlt}
              className={cn(
                "inline-block h-[1em] w-[1em] align-middle cursor-text",
                iconClassName
              )}
              draggable="false"
            />
          </span>
        )}
        <span className="w-full inline-flex"> {text}</span>
      </h2>
    );
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
