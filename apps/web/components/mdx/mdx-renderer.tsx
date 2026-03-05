import type { ComponentType } from "react";
import { serialize } from "next-mdx-remote/serialize";

type MdxComponents = Record<string, ComponentType<unknown>>;

interface MdxRendererProps {
  source: string;
  options?: Parameters<typeof serialize>[1];
  components?: MdxComponents;
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
    source,
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
