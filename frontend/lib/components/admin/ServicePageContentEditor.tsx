"use client";

import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ServicePageContent } from "@/lib/types/servicePageContent";
import { Plus, Trash2 } from "lucide-react";

type Props = {
  value: ServicePageContent;
  onChange: (next: ServicePageContent) => void;
};

function linesToList(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function listToLines(items: string[]): string {
  return items.join("\n");
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-3 rounded-lg border p-3">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}

export function ServicePageContentEditor({ value, onChange }: Props) {
  const update = <K extends keyof ServicePageContent>(
    section: K,
    patch: Partial<ServicePageContent[K]>
  ) => {
    onChange({
      ...value,
      [section]: {
        ...value[section],
        ...patch,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-foreground">Detail Page Text</h3>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
          Editable Copy
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        Edit the text shown on this service&apos;s detail page. Layout and images stay the same.
        Use a new line for each list item. For titles with two lines, put each line on its own row.
      </p>

      <Section title="Hero">
        <Field label="Eyebrow">
          <Input
            value={value.hero.eyebrow}
            onChange={(e) => update("hero", { eyebrow: e.target.value })}
            className="h-9 text-sm"
          />
        </Field>
        <Field label="Title">
          <Input
            value={value.hero.title}
            onChange={(e) => update("hero", { title: e.target.value })}
            className="h-9 text-sm"
          />
        </Field>
        <Field label="Subtitle">
          <Textarea
            value={value.hero.subtitle}
            onChange={(e) => update("hero", { subtitle: e.target.value })}
            className="min-h-[80px] text-sm"
          />
        </Field>
        <Field label="Badges (one per line)">
          <Textarea
            value={listToLines(value.hero.badges)}
            onChange={(e) => update("hero", { badges: linesToList(e.target.value) })}
            className="min-h-[70px] text-sm"
          />
        </Field>
      </Section>

      <Section title="Intro">
        <Field label="Eyebrow">
          <Input
            value={value.intro.eyebrow}
            onChange={(e) => update("intro", { eyebrow: e.target.value })}
            className="h-9 text-sm"
          />
        </Field>
        <Field label="Title (use new line for line break)">
          <Textarea
            value={value.intro.title}
            onChange={(e) => update("intro", { title: e.target.value })}
            className="min-h-[60px] text-sm"
          />
        </Field>
        <Field label="Paragraphs (separate with a blank line)">
          <Textarea
            value={value.intro.paragraphs.join("\n\n")}
            onChange={(e) =>
              update("intro", {
                paragraphs: e.target.value
                  .split(/\n\s*\n/)
                  .map((p) => p.trim())
                  .filter(Boolean),
              })
            }
            className="min-h-[120px] text-sm"
          />
        </Field>
        <Field label="Bullets (one per line)">
          <Textarea
            value={listToLines(value.intro.bullets)}
            onChange={(e) => update("intro", { bullets: linesToList(e.target.value) })}
            className="min-h-[90px] text-sm"
          />
        </Field>
      </Section>

      <Section title="Gallery">
        <Field label="Eyebrow">
          <Input
            value={value.gallery.eyebrow}
            onChange={(e) => update("gallery", { eyebrow: e.target.value })}
            className="h-9 text-sm"
          />
        </Field>
        <Field label="Title">
          <Input
            value={value.gallery.title}
            onChange={(e) => update("gallery", { title: e.target.value })}
            className="h-9 text-sm"
          />
        </Field>
        <Field label="Subtitle">
          <Textarea
            value={value.gallery.subtitle}
            onChange={(e) => update("gallery", { subtitle: e.target.value })}
            className="min-h-[70px] text-sm"
          />
        </Field>
        <Field label="Image labels (one per line)">
          <Textarea
            value={listToLines(value.gallery.labels)}
            onChange={(e) => update("gallery", { labels: linesToList(e.target.value) })}
            className="min-h-[70px] text-sm"
          />
        </Field>
      </Section>

      <Section title="Why Choose Us">
        <Field label="Eyebrow">
          <Input
            value={value.why.eyebrow}
            onChange={(e) => update("why", { eyebrow: e.target.value })}
            className="h-9 text-sm"
          />
        </Field>
        <Field label="Title">
          <Input
            value={value.why.title}
            onChange={(e) => update("why", { title: e.target.value })}
            className="h-9 text-sm"
          />
        </Field>
        <Field label="Paragraph">
          <Textarea
            value={value.why.paragraph}
            onChange={(e) => update("why", { paragraph: e.target.value })}
            className="min-h-[90px] text-sm"
          />
        </Field>
        <Field label="Stats (format: value|label — one per line)">
          <Textarea
            value={value.why.stats.map((s) => `${s.value}|${s.label}`).join("\n")}
            onChange={(e) =>
              update("why", {
                stats: linesToList(e.target.value).map((line) => {
                  const [statValue, ...rest] = line.split("|");
                  return { value: (statValue || "").trim(), label: rest.join("|").trim() };
                }),
              })
            }
            className="min-h-[90px] text-sm"
            placeholder={"30%|Avg. Power Gain\n1,000+|Remaps Completed"}
          />
        </Field>
      </Section>

      <Section title="Benefits">
        <Field label="Eyebrow">
          <Input
            value={value.benefits.eyebrow}
            onChange={(e) => update("benefits", { eyebrow: e.target.value })}
            className="h-9 text-sm"
          />
        </Field>
        <Field label="Title">
          <Input
            value={value.benefits.title}
            onChange={(e) => update("benefits", { title: e.target.value })}
            className="h-9 text-sm"
          />
        </Field>
        <Field label="Paragraph">
          <Textarea
            value={value.benefits.paragraph}
            onChange={(e) => update("benefits", { paragraph: e.target.value })}
            className="min-h-[80px] text-sm"
          />
        </Field>
        <Field label="Bullets (one per line)">
          <Textarea
            value={listToLines(value.benefits.bullets)}
            onChange={(e) => update("benefits", { bullets: linesToList(e.target.value) })}
            className="min-h-[70px] text-sm"
          />
        </Field>
        <Field label="Features (format: title|description — one per line)">
          <Textarea
            value={value.benefits.features.map((f) => `${f.title}|${f.desc}`).join("\n")}
            onChange={(e) =>
              update("benefits", {
                features: linesToList(e.target.value).map((line) => {
                  const [title, ...rest] = line.split("|");
                  return { title: (title || "").trim(), desc: rest.join("|").trim() };
                }),
              })
            }
            className="min-h-[100px] text-sm"
          />
        </Field>
        <Field label="Included title">
          <Input
            value={value.benefits.includedTitle}
            onChange={(e) => update("benefits", { includedTitle: e.target.value })}
            className="h-9 text-sm"
          />
        </Field>
        <Field label="Included note (optional)">
          <Textarea
            value={value.benefits.includedNote || ""}
            onChange={(e) => update("benefits", { includedNote: e.target.value })}
            className="min-h-[60px] text-sm"
          />
        </Field>
        <Field label="Included items (one per line)">
          <Textarea
            value={listToLines(value.benefits.included)}
            onChange={(e) => update("benefits", { included: linesToList(e.target.value) })}
            className="min-h-[120px] text-sm"
          />
        </Field>
      </Section>

      <Section title="FAQs">
        <Field label="Eyebrow">
          <Input
            value={value.faq.eyebrow}
            onChange={(e) => update("faq", { eyebrow: e.target.value })}
            className="h-9 text-sm"
          />
        </Field>
        <Field label="Title">
          <Input
            value={value.faq.title}
            onChange={(e) => update("faq", { title: e.target.value })}
            className="h-9 text-sm"
          />
        </Field>
        <div className="space-y-3">
          {value.faq.items.map((item, index) => (
            <div key={index} className="rounded-md border p-3 space-y-2 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">FAQ {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-destructive"
                  onClick={() =>
                    update("faq", {
                      items: value.faq.items.filter((_, i) => i !== index),
                    })
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <Input
                value={item.question}
                placeholder="Question"
                className="h-9 text-sm"
                onChange={(e) => {
                  const items = [...value.faq.items];
                  items[index] = { ...items[index], question: e.target.value };
                  update("faq", { items });
                }}
              />
              <Textarea
                value={item.answer}
                placeholder="Answer"
                className="min-h-[80px] text-sm"
                onChange={(e) => {
                  const items = [...value.faq.items];
                  items[index] = { ...items[index], answer: e.target.value };
                  update("faq", { items });
                }}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() =>
              update("faq", {
                items: [...value.faq.items, { question: "", answer: "" }],
              })
            }
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add FAQ
          </Button>
        </div>
      </Section>
    </div>
  );
}
