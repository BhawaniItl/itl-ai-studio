import { useEffect, useMemo, useState } from "react";
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

interface BookFormValues {
  name: string;
  slug: string;
  description: string;
  status: string;
  sort_order: number;
}

interface BookRecord {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
  sort_order: number;
}

interface BookDialogProps {
  open: boolean;
  mode: "create" | "edit";
  book?: BookRecord | null;
  onOpenChange: (open: boolean) => void;
}

const bookSchema = z.object({
  name: z.string().min(1, "Name is required."),
  slug: z.string().min(1, "Slug is required."),
  description: z.string().optional(),
  status: z.string().min(1, "Status is required."),
  sort_order: z.coerce.number().int().min(0, "Sort order must be zero or greater."),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function BookDialog({ open, mode, book, onOpenChange }: BookDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = mode === "edit";

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: useMemo(
      () => ({
        name: book?.name ?? "",
        slug: book?.slug ?? "",
        description: book?.description ?? "",
        status: book?.status ?? "DRAFT",
        sort_order: book?.sort_order ?? 0,
      }),
      [book],
    ),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    form.reset({
      name: book?.name ?? "",
      slug: book?.slug ?? "",
      description: book?.description ?? "",
      status: isEdit ? (book?.status ?? "ACTIVE") : "ACTIVE",
      sort_order: book?.sort_order ?? 0,
    });
  }, [book, form, isEdit]);

  useEffect(() => {
    if (!isEdit) {
      const name = form.watch("name");
      const nextSlug = slugify(name);

      if (nextSlug && !form.getValues("slug")) {
        form.setValue("slug", nextSlug, { shouldDirty: true, shouldValidate: true });
      }
    }
  }, [form, isEdit]);

  const mutation = useMutation({
    mutationFn: async (values: BookFormValues) => {
      const payload = {
        ...values,
        sort_order: Number(values.sort_order),
        status: isEdit ? values.status : "ACTIVE",
      };

      if (isEdit && book?.id) {
        const { data } = await api.put(endpoints.books.update(book.id), payload);
        return data;
      }

      const { data } = await api.post(endpoints.books.create, payload);
      return data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["books"] }),
        queryClient.invalidateQueries({ queryKey: ["book-sections"] }),
      ]);

      toast.success(isEdit ? "Book updated successfully." : "Book created successfully.");
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast.error(isEdit ? "Failed to update book." : "Failed to create book.");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (values: BookFormValues) => {
    setIsSubmitting(true);
    await mutation.mutateAsync(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Book" : "Create Book"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the selected book metadata and publishing settings."
              : "Create a new book and keep it connected to the content workspace."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input autoFocus placeholder="Book name" {...field} />
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
                      <Input placeholder="book-slug" {...field} disabled={!isEdit} />
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
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="Short description" {...field} />
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
              <Button type="submit" disabled={isSubmitting || mutation.isPending}>
                {isSubmitting || mutation.isPending
                  ? "Saving..."
                  : isEdit
                    ? "Save Changes"
                    : "Create Book"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
