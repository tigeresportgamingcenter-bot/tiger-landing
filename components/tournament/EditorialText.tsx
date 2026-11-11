import type { CSSProperties } from "react";
import { formatNumbersInText } from "@/lib/formatText";

function cleanLine(value: string) {
  return value
    .replace(/^\s*(#{1,6}\s+|[-*•]+\s*)/, "")
    .replace(/\*/g, "")
    .replace(/_{2,}/g, "")
    .replace(/-{3,}/g, " ")
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/[\uFE0E\uFE0F]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function cleanText(value: string) {
  return value.split(/\r?\n/).map(cleanLine).filter(Boolean).join(" ");
}

type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "steps"; items: string[] }
  | { type: "facts"; items: Array<{ label: string; value: string }> };

const BULLET = /^\s*[-*•]\s+/;
const STEP = /^\s*\d{1,2}[.)]\s+/;
const MARKDOWN_HEADING = /^\s*#{1,6}\s+/;
const FACT = /^([^:.]{2,28}):\s+(.+)$/;

/** Reads the admin's plain text and finds its structure: headings, bullets, numbered steps, "Label: value" rows. */
function parse(value: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of value.split(/\r?\n/)) {
    const isStep = STEP.test(raw);
    const text = formatNumbersInText(cleanLine(isStep ? raw.replace(STEP, "") : raw));
    if (!text) continue;
    const last = blocks.at(-1);

    if (BULLET.test(raw)) {
      if (last?.type === "bullets") last.items.push(text);
      else blocks.push({ type: "bullets", items: [text] });
    } else if (isStep) {
      if (last?.type === "steps") last.items.push(text);
      else blocks.push({ type: "steps", items: [text] });
    } else if (MARKDOWN_HEADING.test(raw) || (text.endsWith(":") && text.length <= 60)) {
      blocks.push({ type: "heading", text: text.replace(/:$/, "") });
    } else {
      const fact = FACT.exec(text);
      if (fact) {
        const row = { label: fact[1], value: fact[2] };
        if (last?.type === "facts") last.items.push(row);
        else blocks.push({ type: "facts", items: [row] });
      } else blocks.push({ type: "paragraph", text });
    }
  }
  return blocks;
}

const indexStyle = (index: number) => ({ "--i": index }) as CSSProperties;

export function EditorialText({ value }: { value: string }) {
  return (
    <div className="space-y-5">
      {parse(value).map((block, blockIndex) => {
        switch (block.type) {
          case "heading":
            return <h3 key={blockIndex} className="flex items-center gap-3 pt-2 text-lg font-extrabold text-white"><span className="size-2.5 shrink-0 bg-accent" aria-hidden="true" />{block.text}</h3>;
          case "bullets":
            return (
              <ul key={blockIndex} className="grid gap-2">
                {block.items.map((item, index) => (
                  <li key={index} style={indexStyle(index)} className="stagger-item flex items-start gap-3 rounded-lg bg-white/[0.04] px-4 py-3 text-base leading-7 text-zinc-200">
                    <span className="mt-2.5 size-2 shrink-0 bg-accent" aria-hidden="true" />{item}
                  </li>
                ))}
              </ul>
            );
          case "steps":
            return (
              <ol key={blockIndex} className="grid gap-2">
                {block.items.map((item, index) => (
                  <li key={index} style={indexStyle(index)} className="stagger-item flex items-start gap-4 rounded-lg bg-white/[0.04] px-4 py-3 text-base leading-7 text-zinc-200">
                    <span className="grid size-8 shrink-0 place-items-center rounded-md bg-accent text-sm font-extrabold tabular-nums text-ground" aria-hidden="true">{index + 1}</span>{item}
                  </li>
                ))}
              </ol>
            );
          case "facts":
            return (
              <dl key={blockIndex} className="divide-y divide-white/10 overflow-hidden rounded-xl bg-white/[0.04] ring-1 ring-white/10">
                {block.items.map((item, index) => (
                  <div key={index} className="grid gap-1 px-4 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
                    <dt className="text-base font-semibold text-accent">{item.label}</dt>
                    <dd className="text-base leading-7 text-zinc-100">{item.value}</dd>
                  </div>
                ))}
              </dl>
            );
          default:
            return <p key={blockIndex} className="text-base leading-8 text-zinc-300">{block.text}</p>;
        }
      })}
    </div>
  );
}
