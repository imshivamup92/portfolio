import { useEffect, useState } from "react";
import { terminalLines } from "../data.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const Prompt = () => (
  <>
    <span className="c-green">shivam@portfolio</span>
    <span className="c-muted">:</span>
    <span className="c-blue">~</span>
    <span className="c-muted">$</span>{" "}
  </>
);

const Cursor = () => <span className="cursor" />;

const Parts = ({ parts }) =>
  parts.map((p, i) => <span key={i} className={p.c || ""}>{p.t}</span>);

export default function Terminal() {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // pos = { line: kaunsi line chal rahi hai, chars: kitne characters typed }
  const [pos, setPos] = useState(
    reduce ? { line: terminalLines.length, chars: 0 } : { line: 0, chars: 0 }
  );

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    (async () => {
      setPos({ line: 0, chars: 0 });
      for (let li = 0; li < terminalLines.length; li++) {
        const l = terminalLines[li];
        if (l.type === "cmd") {
          for (let i = 1; i <= l.text.length; i++) {
            if (cancelled) return;
            setPos({ line: li, chars: i });
            await sleep(45);
          }
          await sleep(250);
        } else {
          if (cancelled) return;
          setPos({ line: li, chars: 1 });
          await sleep(350);
        }
      }
      if (!cancelled) setPos({ line: terminalLines.length, chars: 0 });
    })();
    return () => { cancelled = true; };
  }, [reduce]);

  const finished = pos.line >= terminalLines.length;

  return (
    <div id="term" aria-live="polite">
      {terminalLines.map((l, i) => {
        if (i > pos.line && !finished) return null;
        const isCurrent = i === pos.line && !finished;
        if (l.type === "cmd") {
          const text = isCurrent ? l.text.slice(0, pos.chars) : l.text;
          return (
            <span className="ln" key={i}>
              <Prompt />{text}{isCurrent && <Cursor />}
            </span>
          );
        }
        return (
          <span className="ln" key={i}>
            <Parts parts={l.parts} />
          </span>
        );
      })}
      {finished && (
        <span className="ln"><Prompt /><Cursor /></span>
      )}
    </div>
  );
}
