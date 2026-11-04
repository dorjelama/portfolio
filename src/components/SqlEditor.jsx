import { tokenize } from "../lib/sql";

const TOKEN_CLASS = {
  keyword: "text-accent2",
  string: "text-accent",
  number: "text-amber-300",
  comment: "text-slate-500 italic",
  ident: "text-slate-200",
  plain: "text-slate-500",
};

// Transparent textarea stacked on a highlighted <pre> in the same grid cell, so both share size and metrics.
export default function SqlEditor({ value, onChange, onRun, onFocus }) {
  const lines = value.split("\n").length;
  return (
    <div className="h-80 overflow-auto py-3 text-[12px] leading-6 focus-within:bg-slate-900/30 md:text-[13px] lg:h-[28rem]">
      <div className="flex min-w-max">
        <div aria-hidden className="w-10 shrink-0 select-none pr-3 text-right text-slate-600">
          {Array.from({ length: lines }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div className="grid flex-1">
          <pre aria-hidden className="col-start-1 row-start-1 pr-4">
            {tokenize(value).map((t, i) => (
              <span key={i} className={TOKEN_CLASS[t.type]}>
                {t.text}
              </span>
            ))}
            {"\n"}
          </pre>
          <textarea
            aria-label="SQL query (Ctrl+Enter to run)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                onRun();
              }
            }}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            wrap="off"
            className="col-start-1 row-start-1 resize-none overflow-hidden whitespace-pre bg-transparent pr-4 text-transparent caret-slate-100 outline-none selection:bg-accent2/30"
          />
        </div>
      </div>
    </div>
  );
}
