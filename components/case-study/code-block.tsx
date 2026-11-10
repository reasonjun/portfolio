import { renderInlineCode } from "./inline-code";

interface CodeBlockProps {
  lang: string;
  code: string;
  caption?: string;
}

export const CodeBlock = ({ lang, code, caption }: CodeBlockProps) => (
  <figure className="space-y-2">
    <div className="overflow-x-auto rounded-lg border bg-muted/40">
      <div className="border-b px-4 py-2 text-xs text-muted-foreground">
        {lang}
      </div>
      <pre className="p-4 text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
    {caption && (
      <figcaption className="text-sm text-muted-foreground">
        {renderInlineCode(caption)}
      </figcaption>
    )}
  </figure>
);
