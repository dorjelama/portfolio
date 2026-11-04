// Tiny T-SQL highlighter: just enough token types to colour the editor panel.
const KEYWORDS = new Set(
  "use select from where inner join left right full outer cross lateral on and or not in as with order by desc asc group having set statistics profile top over partition nolock option recompile case when then else end is null distinct union all exists limit offset like ilike between insert into values update delete create drop alter table index primary key references unique check returning explain analyze true false default".split(" ")
);

const PATTERN = /(--[^\n]*)|('(?:[^']|'')*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_@#][\w.]*)|(\s+)|(.)/g;

export function tokenize(sql) {
  const out = [];
  for (const [text, comment, string, number, word] of sql.matchAll(PATTERN)) {
    const type = comment ? "comment" : string ? "string" : number ? "number"
      : word ? (KEYWORDS.has(word.toLowerCase()) ? "keyword" : "ident")
      : "plain";
    out.push({ type, text });
  }
  return out;
}
