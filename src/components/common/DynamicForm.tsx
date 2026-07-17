import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormSchema, FormFieldSchema } from "@/types/cms";
import { cn } from "@/lib/utils";

function buildZod(fields: FormFieldSchema[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of fields) {
    let s: z.ZodTypeAny = z.string();
    if (f.kind === "email") s = z.string().email();
    if (f.kind === "number") s = z.coerce.number();
    if (f.kind === "checkbox" || f.kind === "toggle") s = z.boolean().optional();
    if (f.kind === "pincode") s = z.string().regex(/^\d{6}$/, "6-digit PIN");
    if (f.kind === "phone") s = z.string().regex(/^[6-9]\d{9}$/, "10-digit mobile");
    if (f.required && s instanceof z.ZodString) s = s.min(1, "Required");
    if (!f.required) s = s.optional();
    shape[f.name] = s;
  }
  return z.object(shape);
}

interface Props {
  schema: FormSchema;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  defaultValues?: Record<string, unknown>;
  submitting?: boolean;
}

export function DynamicForm({ schema, onSubmit, defaultValues, submitting }: Props) {
  const zodSchema = buildZod(schema.fields);
  const form = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: defaultValues ?? {},
  });

  return (
    <form
      className="grid grid-cols-2 gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {schema.fields.map((f) => (
        <div
          key={f.name}
          className={cn(
            f.grid === 2 ? "col-span-1" : "col-span-2",
            f.grid === 3 && "sm:col-span-1",
          )}
        >
          <Label className="mb-1.5 block text-xs">
            {f.label}
            {f.required && <span className="ml-0.5 text-destructive">*</span>}
          </Label>
          {f.kind === "textarea" ? (
            <Textarea placeholder={f.placeholder} {...form.register(f.name)} className="min-h-[110px]" />
          ) : f.kind === "select" ? (
            <Select
              onValueChange={(v) => form.setValue(f.name, v)}
              defaultValue={f.defaultValue as string | undefined}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder={f.placeholder ?? "Select…"} />
              </SelectTrigger>
              <SelectContent>
                {(f.options ?? []).map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : f.kind === "checkbox" ? (
            <label className="flex items-center gap-2 pt-2 text-sm">
              <Checkbox onCheckedChange={(v) => form.setValue(f.name, !!v)} />
              {f.placeholder ?? f.label}
            </label>
          ) : f.kind === "toggle" ? (
            <div className="flex items-center gap-2 pt-2 text-sm">
              <Switch onCheckedChange={(v) => form.setValue(f.name, v)} />
              <span className="text-muted-foreground">{f.helper}</span>
            </div>
          ) : (
            <Input
              type={
                f.kind === "email"
                  ? "email"
                  : f.kind === "password"
                    ? "password"
                    : f.kind === "number" || f.kind === "phone" || f.kind === "pincode"
                      ? "text"
                      : f.kind === "date"
                        ? "date"
                        : "text"
              }
              placeholder={f.placeholder}
              className="h-11"
              {...form.register(f.name)}
            />
          )}
          {form.formState.errors[f.name] && (
            <p className="mt-1 text-[11px] text-destructive">
              {String(form.formState.errors[f.name]?.message ?? "Invalid")}
            </p>
          )}
          {f.helper && !form.formState.errors[f.name] && (
            <p className="mt-1 text-[11px] text-muted-foreground">{f.helper}</p>
          )}
        </div>
      ))}
      <div className="col-span-2 flex justify-end">
        <Button type="submit" disabled={submitting} className="h-11 rounded-xl px-6 gradient-primary text-primary-foreground">
          {submitting ? "Please wait…" : (schema.submitLabel ?? "Submit")}
        </Button>
      </div>
    </form>
  );
}
