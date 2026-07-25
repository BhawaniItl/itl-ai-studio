import { useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, endpoints } from "@/services/api/api";

export interface SectionRecord {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  parent_id?: string | null;
  status: string;
  sort_order: number;
  children?: SectionRecord[];
}

interface SectionDialogProps {
  open: boolean;
  mode: "create-root" | "create-child" | "edit";
  bookId: string;
  bookName?: string;
  section?: SectionRecord | null;
  parentOptions: SectionRecord[];
  onOpenChange: (open: boolean) => void;
}

const sectionSchema = z.object({
  title: z.string().min(1, "Title is required."),
  slug: z.string().min(1, "Slug is required."),
  description: z.string().optional(),
  parent_id: z.string().optional(),
  status: z.string().min(1, "Status is required."),
  sort_order: z.string().regex(/^\d+$/, "Sort order must be a whole number."),
});
type SectionFormValues = z.infer<typeof sectionSchema>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function SectionDialog({
  open,
  mode,
  bookId,
  bookName,
  section,
  parentOptions,
  onOpenChange,
}: SectionDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = mode === "edit";
  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: useMemo(
      () => ({
        title: section?.title ?? "",
        slug: section?.slug ?? "",
        description: section?.description ?? "",
        parent_id: section?.parent_id ?? "",
        status: section?.status ?? "DRAFT",
        sort_order: String(section?.sort_order ?? 0),
      }),
      [section],
    ),
  });

  useEffect(() => {
    form.reset({
      title: section?.title ?? "",
      slug: section?.slug ?? "",
      description: section?.description ?? "",
      parent_id: section?.parent_id ?? "",
      status: isEdit ? (section?.status ?? "ACTIVE") : "ACTIVE",
      sort_order: String(section?.sort_order ?? 0),
    });
  }, [form, isEdit, section]);

  useEffect(() => {
    if (!isEdit) {
      const title = form.watch("title");
      const derivedTitle = bookName ? `${bookName} ${title}` : title;
      const nextSlug = slugify(derivedTitle);

      if (nextSlug && !form.getValues("slug")) {
        form.setValue("slug", nextSlug, { shouldDirty: true, shouldValidate: true });
      }
    }
  }, [bookName, form, isEdit]);

  const mutation = useMutation({
    mutationFn: async (values: SectionFormValues) => {
      const payload = {
        ...values,
        sort_order: Number(values.sort_order),
        status: isEdit ? values.status : "ACTIVE",
        book_id: bookId,
        parent_id: values.parent_id || null,
      };

      if (mode === "edit" && section?.id) {
        const { data } = await api.put(endpoints.books.updateSection(section.id), payload);
        return data;
      }

      if (mode === "create-child" && section?.id) {
        payload.parent_id = section.id;
      }

      const { data } = await api.post(endpoints.books.createSection, payload);
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["book-sections", bookId] });
      const message =
        mode === "edit" ? "Section updated successfully." : "Section created successfully.";
      toast.success(message);
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast.error(mode === "edit" ? "Failed to update section." : "Failed to create section.");
    },
  });

  const onSubmit = (values: SectionFormValues) => mutation.mutate(values);

  const flatParentOptions = useMemo(() => flattenSections(parentOptions).filter((item) => item.id !== section?.id), [parentOptions, section?.id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit"
              ? "Edit Section"
              : mode === "create-child"
                ? "Create Child Section"
                : "Create Root Section"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the section title, hierarchy, and status."
              : "Create a new section in the selected book and keep its tree structure in sync."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input autoFocus placeholder="Section title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="section-slug" {...field} disabled={!isEdit} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} disabled={!isEdit} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!isEdit}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parent_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Section</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === "ROOT" ? "" : value)} value={field.value || "ROOT"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Root section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ROOT">Root Section</SelectItem>
                        {flatParentOptions.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="Section summary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? "Saving..."
                  : mode === "edit"
                    ? "Save Changes"
                    : "Create Section"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function flattenSections(sections: SectionRecord[]): SectionRecord[] {
  return sections.flatMap((section) => [section, ...flattenSections(section.children ?? [])]);
}
