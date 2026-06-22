import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JSON Formatter" },
      { name: "description", content: "Format, validate, and beautify your JSON with ease." },
      { property: "og:title", content: "JSON Formatter" },
      { property: "og:description", content: "Format, validate, and beautify your JSON with ease." },
    ],
  }),
  component: JsonFormatterPage,
});

function JsonFormatterPage() {
  const [input, setInput] = useState('{"hello":"world","count":42,"nested":{"a":1,"b":2},"items":[true,false,null]}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState("2");
  const [copied, setCopied] = useState(false);

  const format = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const space = indent === "tab" ? "\t" : parseInt(indent, 10);
      const formatted = JSON.stringify(parsed, null, space);
      setOutput(formatted);
      setError("");
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  }, [input, indent]);

  const minify = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError("");
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  }, [input]);

  const copyToClipboard = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">JSON Formatter</h1>
        <p className="text-sm text-muted-foreground">Paste your JSON, validate, and format it instantly.</p>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 md:flex-row md:p-6">
        {/* Input Panel */}
        <section className="flex flex-1 flex-col gap-3 md:w-1/2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium text-foreground">Input</span>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={indent} onValueChange={setIndent}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Indent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 spaces</SelectItem>
                  <SelectItem value="4">4 spaces</SelectItem>
                  <SelectItem value="tab">Tab</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" onClick={format}>Format</Button>
              <Button size="sm" variant="outline" onClick={minify}>Minify</Button>
            </div>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="min-h-[300px] flex-1 resize-none font-mono text-sm md:min-h-0"
            spellCheck={false}
          />
        </section>

        {/* Output Panel */}
        <section className="flex flex-1 flex-col gap-3 md:w-1/2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium text-foreground">Output</span>
            <Button size="sm" variant="outline" onClick={copyToClipboard} disabled={!output}>
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>

          {error ? (
            <div className="flex flex-1 flex-col rounded-md border border-destructive bg-destructive/10 p-4">
              <p className="text-sm font-semibold text-destructive">Invalid JSON</p>
              <p className="mt-1 text-sm text-destructive/90">{error}</p>
            </div>
          ) : (
            <Textarea
              value={output}
              readOnly
              placeholder="Formatted JSON will appear here..."
              className="min-h-[300px] flex-1 resize-none font-mono text-sm md:min-h-0"
              spellCheck={false}
            />
          )}
        </section>
      </main>
    </div>
  );
}
