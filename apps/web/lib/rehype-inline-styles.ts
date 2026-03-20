/**
 * Rehype plugin that converts HTML-style string `style` attributes
 * into JSX-compatible style objects.
 *
 * e.g. style="text-align:center;margin:24px 0"
 *   -> style={{ textAlign: "center", margin: "24px 0" }}
 *
 * This is needed because MDX content stored in the database may contain
 * raw HTML with string-based style attributes, which React rejects.
 */

import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

function toCamelCase(prop: string): string {
  return prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

function parseStyleString(
  styleStr: string,
): Record<string, string | number> {
  const result: Record<string, string | number> = {};

  for (const decl of styleStr.split(";")) {
    const colonIdx = decl.indexOf(":");
    if (colonIdx === -1) continue;

    const key = toCamelCase(decl.substring(0, colonIdx).trim());
    const value = decl.substring(colonIdx + 1).trim();

    if (!key || !value) continue;

    // Convert purely numeric values to numbers
    result[key] = /^[\d.]+$/.test(value) ? Number(value) : value;
  }

  return result;
}

export function rehypeInlineStyles() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (
        node.properties &&
        typeof node.properties.style === "string"
      ) {
        (node.properties as Record<string, unknown>).style = parseStyleString(
          node.properties.style as string,
        );
      }
    });
  };
}
