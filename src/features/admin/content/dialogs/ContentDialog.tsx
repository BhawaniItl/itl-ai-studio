import { useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { RichTextEditor } from "@/components/common/RichTextEditor";

export interface ContentRecord {
  id: string;
  title: string;
  reference_no?: string;
  keywords?: string;
  summary?: string;
  status: string;
  version: number;
  updated_at: string;
  body?: string;
  content_html?: string;
  content_text?: string;
}

interface ContentDialogProps {
  open: boolean;
  mode: "create" | "edit" | "view";
  content?: ContentRecord | null;
  bookId: string;
  sectionId: string;
  bookName?: string;
  sectionTitle?: string;
  onOpenChange: (open: boolean) => void;
}

const contentSchema = z.object({
  book_id: z.string().min(1, "Book is required."),
  section_id: z.string().min(1, "Section is required."),
  title: z.string().min(1, "Title is required."),
  reference_no: z.string().min(1, "Reference number is required."),
  keywords: z.string().optional(),
  summary: z.string().optional(),
  status: z.string().min(1, "Status is required."),
  version: z.string().regex(/^[1-9]\d*$/, "Version must be at least 1."),
  content_html: z.string().optional(),
  content_text: z.string().optional(),
});
type ContentFormValues = z.infer<typeof contentSchema>;

export function ContentDialog({
  open,
  mode,
  content,
  bookId,
  sectionId,
  bookName,
  sectionTitle,
  onOpenChange,
}: ContentDialogProps) {
  const queryClient = useQueryClient();
  const { data: contentDetail } = useQuery({
    queryKey: ["book-content", content?.id],
    queryFn: async () => (await api.get<ContentRecord>(endpoints.books.content(content!.id))).data,
    enabled: open && Boolean(content?.id),
  });
  const currentContent = contentDetail ?? content;
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: useMemo(
      () => ({
        book_id: bookId,
        section_id: sectionId,
        title: currentContent?.title ?? "",
        reference_no: currentContent?.reference_no ?? "",
        keywords: currentContent?.keywords ?? "",
        summary: currentContent?.summary ?? "",
        status: currentContent?.status ?? "ACTIVE",
        version: String(currentContent?.version ?? 1),
        content_html: currentContent?.content_html ?? currentContent?.body ?? "",
        content_text: currentContent?.content_text ?? "",
      }),
      [bookId, currentContent, sectionId],
    ),
  });

  useEffect(() => {
    form.reset({
      book_id: bookId,
      section_id: sectionId,
      title: currentContent?.title ?? "",
      reference_no: currentContent?.reference_no ?? "",
      keywords: currentContent?.keywords ?? "",
      summary: currentContent?.summary ?? "",
      status: currentContent?.status ?? "DRAFT",
      version: String(currentContent?.version ?? 1),
      content_html: currentContent?.content_html ?? currentContent?.body ?? "",
      content_text: currentContent?.content_text ?? "",
    });
  }, [bookId, currentContent, form, sectionId]);

  const mutation = useMutation({
    mutationFn: async (values: ContentFormValues) => {
      const payload = {
        ...values,
        version: Number(values.version),
        content_html: values.content_html ?? "",
        content_text: values.content_text ?? "",
      };

      if (mode === "edit" && content?.id) {
        const { data } = await api.put(endpoints.books.updateContent(content.id), payload);
        return data;
      }

      const { data } = await api.post(endpoints.books.createContent, payload);
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["section-contents", sectionId],
      });
      toast.success(
        mode === "edit" ? "Content updated successfully." : "Content created successfully.",
      );
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast.error(mode === "edit" ? "Failed to update content." : "Failed to create content.");
    },
  });

  const onSubmit = (values: ContentFormValues) => mutation.mutate(values);

  const isReadOnly = mode === "view";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "view" ? "View Content" : mode === "edit" ? "Edit Content" : "Create Content"}
          </DialogTitle>
          <DialogDescription>
            {mode === "view"
              ? "Read-only content details for the selected section."
              : "Create or update content with the section context already selected."}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/30 p-3 text-sm">
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Book
              </div>
              <div className="mt-1 font-medium">{bookName || "—"}</div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Section
              </div>
              <div className="mt-1 font-medium">{sectionTitle || "—"}</div>
            </div>
          </div>
        </div>

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
                      <Input
                        autoFocus
                        placeholder="Content title"
                        {...field}
                        readOnly={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reference_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Number</FormLabel>
                    <FormControl>
                      <Input placeholder="REF-001" {...field} readOnly={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} readOnly={isReadOnly} />
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isReadOnly || mode !== "edit"}
                    >
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
                name="keywords"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                      <Input placeholder="keyword, keyword" {...field} readOnly={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Brief summary"
                        {...field}
                        readOnly={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content_html"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Body</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        content={field.value ?? ""}
                        onChange={(html, text) => {
                          field.onChange(html);
                          form.setValue("content_text", text, {
                            shouldDirty: true,
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {isReadOnly ? "Close" : "Cancel"}
              </Button>
              {!isReadOnly && (
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending
                    ? "Saving..."
                    : mode === "edit"
                      ? "Save Changes"
                      : "Create Content"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
