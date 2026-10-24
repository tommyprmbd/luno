import { useEffect, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import Button from "../ui/Button";

// shortcut: renders the markdown subset used by about.md (headings, paragraphs,
// lists, bold/italic/links, rules); swap in a real parser if content grows.
type Block =
  | { type: "h1" | "h2" | "h3" | "p"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "hr" };

function renderInline(text: string): ReactNode[] {
  const parts = text.split(
    /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\(https?:\/\/[^)]+\))/g,
  );

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{renderInline(part.slice(2, -2))}</strong>;
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);

    if (link) {
      return (
        <a key={index} href={link[2]} target="_blank" rel="noreferrer">
          {link[1]}
        </a>
      );
    }

    return part;
  });
}

function parseMarkdown(source: string): Block[] {
  const blocks: Block[] = [];
  const lines = source.split(/\r?\n/);
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  function flushParagraph() {
    if (paragraph.length > 0) {
      blocks.push({ type: "p", text: paragraph.join(" ") });
      paragraph = [];
    }
  }

  function flushList() {
    if (list) {
      blocks.push({ type: list.ordered ? "ol" : "ul", items: list.items });
      list = null;
    }
  }

  for (const raw of lines) {
    const line = raw.trim().replace(/\\$/, "");

    if (line.length === 0) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = line.match(/^(#{1,3}) (.*)$/);

    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({
        type: `h${heading[1].length}` as "h1" | "h2" | "h3",
        text: heading[2],
      });
      continue;
    }

    if (/^-{3,}$/.test(line)) {
      flushParagraph();
      flushList();
      blocks.push({ type: "hr" });
      continue;
    }

    const ordered = line.match(/^\d+\.\s+(.*)$/);
    const bullet = line.match(/^[-*]\s+(.*)$/);

    if (ordered || bullet) {
      flushParagraph();

      const isOrdered = Boolean(ordered);

      if (!list || list.ordered !== isOrdered) {
        flushList();
        list = { ordered: isOrdered, items: [] };
      }

      list.items.push((ordered ?? bullet)![1]);
      continue;
    }

    if (list) {
      list.items[list.items.length - 1] += ` ${line}`;
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

function Markdown({ source }: { source: string }) {
  return (
    <>
      {parseMarkdown(source).map((block, index) => {
        switch (block.type) {
          case "h1":
            // The dialog title already says "About Luno".
            return index === 0 ? null : (
              <h3 key={index}>{renderInline(block.text)}</h3>
            );
          case "h2":
            return <h2 key={index}>{renderInline(block.text)}</h2>;
          case "h3":
            return <h3 key={index}>{renderInline(block.text)}</h3>;
          case "hr":
            return <hr key={index} />;
          case "ul":
          case "ol": {
            const List = block.type;
            return (
              <List key={index}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{renderInline(item)}</li>
                ))}
              </List>
            );
          }
          default:
            return <p key={index}>{renderInline(block.text)}</p>;
        }
      })}
    </>
  );
}

type AboutModalProps = {
  onClose: () => void;
};

function AboutModal({ onClose }: AboutModalProps) {
  const [content, setContent] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    fetch(`${import.meta.env.BASE_URL}content/about.md`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`About content responded ${response.status}`);
        }

        return response.text();
      })
      .then((text) => {
        if (active) {
          setContent(text);
        }
      })
      .catch(() => {
        if (active) {
          setFailed(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusable = event.currentTarget.querySelectorAll<HTMLElement>(
      'button, a[href], [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!first || !last) {
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div
      className="modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="modal about-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        onKeyDown={handleKeyDown}
      >
        <div className="modal-header">
          <div className="modal-title">
            <span className="modal-icon" aria-hidden="true">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <h2 id="about-title">About Luno</h2>
          </div>

          <Button
            variant="icon"
            aria-label="Close"
            onClick={onClose}
            autoFocus
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </Button>
        </div>

        <div className="about-body">
          {failed && (
            <p className="about-status">Could not load the about content.</p>
          )}

          {!failed && content === null && (
            <p className="about-status">Loading…</p>
          )}

          {content !== null && <Markdown source={content} />}
        </div>

        <div className="modal-footer">
          <Button onClick={onClose}>GOT IT</Button>
        </div>
      </div>
    </div>
  );
}

export default AboutModal;
