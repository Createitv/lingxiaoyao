import type { ComponentType } from "react";
import { serialize } from "next-mdx-remote/serialize";

type MdxComponents = Record<string, ComponentType<unknown>>;

interface MdxRendererProps {
  source: string;
  options?: Parameters<typeof serialize>[1];
  components?: MdxComponents;
}

/**
 * Convert HTML-style `style="prop:val;..."` to JSX `style={{prop:"val",...}}`.
 * MDX treats inline elements as JSX, so string-based style attrs cause React errors.
 */
function convertInlineStyles(mdx: string): string {
  return mdx.replace(
    /\bstyle="([^"]+)"/g,
    (_match: string, cssStr: string) => {
      const pairs = cssStr
        .split(";")
        .map((s: string) => s.trim())
        .filter(Boolean)
        .map((decl: string) => {
          const idx = decl.indexOf(":");
          if (idx === -1) return null;
          const prop = decl
            .substring(0, idx)
            .trim()
            .replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase());
          const val = decl.substring(idx + 1).trim();
          return `${prop}:"${val}"`;
        })
        .filter(Boolean);
      return `style={{${pairs.join(",")}}}`;
    },
  );
}

/**
 * Workaround for React 19 dev incompatibility in next-mdx-remote/rsc.
 * Uses the same compile pipeline, but renders Content via JSX instead of React.createElement.
 */
export async function MdxRenderer({
  source,
  options,
  components = {},
}: MdxRendererProps) {
  const { compiledSource, frontmatter, scope } = await serialize(
    convertInlineStyles(source),
    options,
    true,
  );

  const runtime =
    process.env.NODE_ENV === "production"
      ? await import("react/jsx-runtime")
      : await import("react/jsx-dev-runtime");

  const fullScope = {
    opts: runtime,
    frontmatter,
    ...scope,
  };

  const keys = Object.keys(fullScope);
  const values = Object.values(fullScope);
  // eslint-disable-next-line no-new-func
  const hydrateFn = Reflect.construct(
    Function,
    keys.concat(`${compiledSource}`),
  ) as (...args: unknown[]) => {
    default: ComponentType<{ components?: MdxComponents }>;
  };
  const Content = hydrateFn.apply(hydrateFn, values).default;

  return <Content components={components} />;
}
